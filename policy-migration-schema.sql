-- =========================================
-- ADMINISTRATIVE POLICIES MIGRATION
-- New Standardized CRUD Architecture
-- =========================================

-- Create permissions table
CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resource VARCHAR(100) NOT NULL, -- 'staff', 'children', 'classes', 'finance', 'recruitment'
    action VARCHAR(50) NOT NULL, -- 'create', 'read', 'update', 'delete'
    scope VARCHAR(50) DEFAULT 'own', -- 'own', 'department', 'organization', 'all'
    conditions JSONB DEFAULT '{}', -- Additional constraints
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(resource, action, scope)
);

-- Create role_permissions junction table
CREATE TABLE role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role VARCHAR(50) NOT NULL, -- 'ADMIN', 'STAFF', 'PARENT', 'DRIVER'
    permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
    granted_by UUID REFERENCES profiles(id),
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(role, permission_id)
);

-- Create user_permissions for individual overrides
CREATE TABLE user_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
    granted BOOLEAN DEFAULT true,
    granted_by UUID REFERENCES profiles(id),
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    reason TEXT,
    UNIQUE(user_id, permission_id)
);

-- Create audit log for policy changes
CREATE TABLE policy_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action VARCHAR(50) NOT NULL, -- 'grant', 'revoke', 'modify'
    resource_type VARCHAR(50) NOT NULL, -- 'permission', 'role_permission', 'user_permission'
    resource_id UUID NOT NULL,
    user_id UUID REFERENCES profiles(id),
    changes JSONB,
    performed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT
);

-- Insert base permissions for each resource
INSERT INTO permissions (resource, action, scope) VALUES
-- Staff permissions
('staff', 'create', 'organization'),
('staff', 'read', 'organization'),
('staff', 'update', 'organization'),
('staff', 'delete', 'organization'),

-- Children permissions
('children', 'create', 'organization'),
('children', 'read', 'organization'),
('children', 'update', 'organization'),
('children', 'delete', 'organization'),

-- Classes permissions
('classes', 'create', 'organization'),
('classes', 'read', 'organization'),
('classes', 'update', 'organization'),
('classes', 'delete', 'organization'),

-- Finance permissions
('finance', 'create', 'organization'),
('finance', 'read', 'organization'),
('finance', 'update', 'organization'),
('finance', 'delete', 'organization'),

-- Recruitment permissions
('recruitment', 'create', 'organization'),
('recruitment', 'read', 'organization'),
('recruitment', 'update', 'organization'),
('recruitment', 'delete', 'organization'),

-- Administrative permissions
('policies', 'manage', 'organization'),
('reports', 'view', 'organization'),
('settings', 'manage', 'organization');

-- Insert default role permissions
INSERT INTO role_permissions (role, permission_id)
SELECT 'ADMIN', p.id FROM permissions p
UNION ALL
-- STAFF permissions (limited CRUD)
SELECT 'STAFF', p.id FROM permissions p
WHERE p.resource IN ('children', 'classes')
AND p.action IN ('read', 'update')
UNION ALL
-- PARENT permissions (very limited)
SELECT 'PARENT', p.id FROM permissions p
WHERE p.resource = 'children'
AND p.action = 'read'
AND p.scope = 'own';

-- Create indexes for performance
CREATE INDEX idx_permissions_resource_action ON permissions(resource, action);
CREATE INDEX idx_role_permissions_role ON role_permissions(role);
CREATE INDEX idx_user_permissions_user ON user_permissions(user_id);
CREATE INDEX idx_policy_audit_timestamp ON policy_audit_log(performed_at);

-- Enable RLS on new tables
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE policy_audit_log ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (only ADMIN can manage policies)
CREATE POLICY "Admins can manage permissions" ON permissions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'ADMIN'
        )
    );

CREATE POLICY "Admins can manage role permissions" ON role_permissions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'ADMIN'
        )
    );

CREATE POLICY "Admins can manage user permissions" ON user_permissions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'ADMIN'
        )
    );

CREATE POLICY "Admins can view audit logs" ON policy_audit_log
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'ADMIN'
        )
    );

-- Create functions for permission checking
CREATE OR REPLACE FUNCTION check_user_permission(
    p_user_id UUID,
    p_resource VARCHAR,
    p_action VARCHAR,
    p_scope VARCHAR DEFAULT 'own'
) RETURNS BOOLEAN AS $$
DECLARE
    user_role VARCHAR;
    has_role_permission BOOLEAN := false;
    has_user_permission BOOLEAN := false;
BEGIN
    -- Get user role
    SELECT role INTO user_role
    FROM profiles
    WHERE id = p_user_id;

    -- Check role-based permissions
    SELECT EXISTS(
        SELECT 1 FROM role_permissions rp
        JOIN permissions p ON rp.permission_id = p.id
        WHERE rp.role = user_role
        AND p.resource = p_resource
        AND p.action = p_action
        AND p.scope = p_scope
    ) INTO has_role_permission;

    -- Check user-specific permissions (can override role permissions)
    SELECT EXISTS(
        SELECT 1 FROM user_permissions up
        JOIN permissions p ON up.permission_id = p.id
        WHERE up.user_id = p_user_id
        AND p.resource = p_resource
        AND p.action = p_action
        AND p.scope = p_scope
        AND up.granted = true
        AND (up.expires_at IS NULL OR up.expires_at > NOW())
    ) INTO has_user_permission;

    -- Return true if role permission exists OR user permission is explicitly granted
    RETURN has_role_permission OR has_user_permission;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to log policy changes
CREATE OR REPLACE FUNCTION log_policy_change(
    p_action VARCHAR,
    p_resource_type VARCHAR,
    p_resource_id UUID,
    p_changes JSONB DEFAULT '{}'
) RETURNS VOID AS $$
BEGIN
    INSERT INTO policy_audit_log (
        action,
        resource_type,
        resource_id,
        user_id,
        changes,
        performed_at
    ) VALUES (
        p_action,
        p_resource_type,
        p_resource_id,
        auth.uid(),
        p_changes,
        NOW()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;