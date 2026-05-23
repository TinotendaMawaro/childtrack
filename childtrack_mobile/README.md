# ChildTrack Mobile - Unified App

Single Flutter mobile application serving **Staff**, **Driver**, and **Parent** portals. Role-based access is automatically determined by user credentials.

## Architecture

```
childtrack_mobile/
├── lib/
│   ├── main.dart                    # App entry, role-based router
│   ├── screens/
│   │   ├── staff/                   # Staff portal (attendance, diary)
│   │   ├── driver/                  # Driver portal (routes, maps)
│   │   └── parent/                  # Parent portal (tracking, payments)
│   └── shared_ui/                   # (in packages/) Shared login & components
```

## How It Works

1. **Login**: Single shared login screen (username/password)
2. **Role Detection**: App queries Supabase `profiles` table for user's role
3. **Auto-Redirect**: User is routed to their portal:
   - `STAFF` → Staff portal (attendance, classroom)
   - `DRIVER` → Driver portal (route tracking, maps)
   - `PARENT` → Parent portal (child tracking, payments)
4. **Role Guards**: Each portal validates role on entry; unauthorized users are logged out

## Setup

### Prerequisites
- Flutter SDK 3.10+
- Android Studio / Xcode (for mobile builds)
- Supabase project (URL & anon key)

### Configuration
Edit `lib/main.dart`:
```dart
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
```

### Install Dependencies
```bash
cd childtrack_mobile
flutter pub get
```

### Run in Debug Mode
```bash
flutter run
```
(Connect Android/iOS device or use Chrome for web testing)

### Build for Production
**Android APK:**
```bash
flutter build apk --release
```
Output: `build/app/outputs/flutter-apk/app-release.apk`

**iOS:**
```bash
flutter build ios --release
```

**App Bundle (Google Play):**
```bash
flutter build appbundle --release
```

## Test Credentials

Use these pre-configured users (must exist in your Supabase `profiles` table):

| Role   | Email                 | UUID |
|--------|----------------------|------|
| Admin  | admin@childtrack.com | 00000000-0000-0000-0000-000000000000 |
| Staff  | staff@childtrack.com | 11111111-1111-1111-1111-111111111111 |
| Driver | driver@childtrack.com| 22222222-2222-2222-2222-222222222222 |
| Parent | parent@childtrack.com| 33333333-3333-3333-3333-333333333333 |

**Note:** These UUIDs must match the `id` in `profiles` table and the `auth.users` record.

## Database Schema

Ensure your Supabase database includes:
- `profiles` table with columns: `id` (UUID), `role` (TEXT), `name`, etc.
- Row Level Security (RLS) policies for role-based data access
- Foreign key between `auth.users.id` and `profiles.id`

## Features by Portal

### Staff Portal (`/staff`)
- Mark attendance by class
- Upload student photos
- Update daily diary
- Send messages to parents

### Driver Portal (`/driver`)
- View assigned routes
- Live map with student locations
- Pickup/dropoff status tracking
- Emergency contact button

### Parent Portal (`/parent`)
- Onboarding walkthrough
- View child's attendance & activities
- Track bus location in real-time
- View payments & outstanding balances
- Message teachers

## Troubleshooting

### "Unable to determine user role"
- Check that `profiles` table has a row for the authenticated user
- Ensure RLS policies allow read access to `profiles`

### Login succeeds but redirects incorrectly
- Verify role string values are uppercase (STAFF, DRIVER, PARENT)
- Check that Supabase row is returned from `_getUserRole()` query

### Assets missing (Lottie animations)
Add `.json` files to `assets/lottie/` and update `pubspec.yaml`:
```yaml
flutter:
  assets:
    - assets/lottie/
    - assets/images/
```

### Platform-specific issues
- **Android**: Ensure `minSdkVersion` is 21+ in `android/app/build.gradle`
- **iOS**: Add camera & location permissions in `Info.plist`

## Development Notes

- **State Management**: Riverpod for auth state (shared_ui)
- **Navigation**: GoRouter with role-based redirects
- **Styling**: Glassmorphism UI with custom `GlassCard` widget
- **Authentication**: Supabase Auth + FlutterSecureStorage for tokens
- **Real-time**: Supabase Realtime subscriptions for live updates

## Security

- All user roles enforced at both client (redirects) and server (RLS) levels
- Tokens stored securely using FlutterSecureStorage
- Session invalidation on role mismatch

---

**One app. Three portals. Unified experience.** 🚀