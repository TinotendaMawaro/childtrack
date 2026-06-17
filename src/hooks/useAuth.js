import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export function useAuth() {
  const [session, setSession] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [roleLoading, setRoleLoading] = useState(false)
  const [profile, setProfile] = useState(null)
  const [userRole, setUserRole] = useState(null)

  useEffect(() => {
    console.log('[Auth] Initializing auth state...')
    const AUTH_TIMEOUT_MS = 3000

    const timeoutHandle = setTimeout(() => {
      console.warn('[Auth] getSession timeout reached, forcing unauthenticated state')
      setAuthLoading(false)
    }, AUTH_TIMEOUT_MS)

    let didResolve = false
    const finish = () => {
      if (!didResolve) {
        didResolve = true
        clearTimeout(timeoutHandle)
      }
    }

    supabase.auth.getSession().then(({ data: { session }, error }) => {
      finish()
      console.log('[Auth] getSession result:', error ? error.message : 'success', session ? 'session exists' : 'no session')
      setSession(session)
      setAuthLoading(false)
      if (session) {
        console.log('[Auth] Session found, user ID:', session.user.id)
        setRoleLoading(true)
        fetchUserProfile(session.user.id).finally(() => setRoleLoading(false))
      }
    }).catch((err) => {
      finish()
      console.error('[Auth] getSession failed:', err?.message || err)
      setAuthLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        finish()
        setSession(session)
        setAuthLoading(false)
        if (session) {
          setRoleLoading(true)
          fetchUserProfile(session.user.id).finally(() => setRoleLoading(false))
          const saved = localStorage.getItem('supabase.auth.token')
          if (saved && !session.access_token) {
            try {
              const savedSession = JSON.parse(saved)
              await supabase.auth.setSession(savedSession)
            } catch (e) {
              localStorage.removeItem('supabase.auth.token')
            }
          }
        } else {
          setProfile(null)
          setUserRole(null)
          localStorage.removeItem('supabase.auth.token')
        }
      }
    )

    return () => {
      clearTimeout(timeoutHandle)
      subscription.unsubscribe()
    }
  }, [])

async function fetchUserProfile(userId) {
    console.log('[Auth] Fetching profile for user ID:', userId)
    try {
        const { data, error } = await supabase
        .from('profiles')
        .select('*, avatar_url')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('[Auth] Profile fetch error:', error.message)
        throw error
      }
      console.log('[Auth] Profile fetched successfully:', data)
      setProfile({
        ...data,
        full_name: data.full_name || data.email.split('@')[0] || 'Admin',
        avatar_url: data.avatar_url || null
      })
      setUserRole(data?.role || null)
    } catch (error) {
      console.error('[Auth] Error fetching user profile:', error.message)
      // Fallback profile to prevent login loop - use limited role, not admin
      setProfile({
        id: userId,
        email: 'unknown',
        full_name: 'User',
        role: null,
        avatar_url: null
      })
      setUserRole(null)
    }
  }

  const uploadProfilePic = async (file) => {
    if (!session) throw new Error('Not authenticated');
    
    try {
      // Upload to storage - use pro_pic bucket to match SQL
      const fileExt = file.name.split('.').pop();
      const fileName = `${session.user.id}.${fileExt}`;
      const filePath = `${session.user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('pro_pic')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('pro_pic')
        .getPublicUrl(filePath);

      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', session.user.id);

      if (updateError) throw updateError;

      // Refresh profile
      await fetchUserProfile(session.user.id);
      
      console.log('[Auth] Profile pic uploaded:', publicUrl);
      return { success: true, url: publicUrl };
    } catch (error) {
      console.error('[Auth] Upload error:', error.message);
      throw error;
    }
  };

  const updateProfile = async (data) => {
    if (!session) throw new Error('Not authenticated');
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', session.user.id)
        .select()
        .single();

      if (error) throw error;

      // Refresh profile
      await fetchUserProfile(session.user.id);
      
      console.log('[Auth] Profile updated:', data);
      return { success: true };
    } catch (error) {
      console.error('[Auth] Update error:', error.message);
      throw error;
    }
  };

  const signIn = async (email, password, rememberMe = false) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    
    // Persist session if remember me is checked
    if (rememberMe) {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        localStorage.setItem('supabase.auth.token', JSON.stringify(session))
      }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const isAuthenticated = !!session
  const isLoading = authLoading || roleLoading

  return { 
    session, 
    profile, 
    userRole, 
    isAuthenticated,
    isLoading, 
    authLoading, 
    roleLoading,
    signIn, 
    signOut,
    uploadProfilePic,
    updateProfile
  }
}

export function useUserRole() {
  const { profile, userRole, roleLoading } = useAuth()
  return { profile, role: userRole, loading: roleLoading }
}
