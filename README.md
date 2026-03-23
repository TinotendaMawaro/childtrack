# ChildTrack - Multi-Platform Childcare Management System

FINAL ARCHITECTURE:
| System | Platform |
|--------|----------|
| Admin Portal | React Web (src/) |
| Staff Portal | Flutter Mobile (childtrack_staff_app/) |
| Parent App | Flutter Mobile (childtrack_parent_app/) |
| Driver App | Flutter Mobile (childtrack_driver_app/) |

**Single Supabase backend** with single `profiles` table for roles (ADMIN/STAFF/DRIVER/PARENT).

## Setup
1. Run Supabase schema: Paste `supabase-schema.sql` into your project SQL editor.

## Run Apps

**React Admin Portal:**
```bash
npm install
npm run dev
```
- Login: admin@childtrack.com (signup first)
- URL: localhost:5173

**Staff App:**
```bash
cd childtrack_staff_app
flutter pub get
flutter run -d chrome
```
- Classes → Attendance swipe ✅

**Parent App:**
```bash
cd childtrack_parent_app
flutter pub get
flutter run -d chrome
```

**Driver App:**
```bash
cd childtrack_driver_app
flutter pub get
flutter run -d chrome
```
- Home route list, LiveRouteScreen maps ✅

## Test Users (use these UUIDs in Supabase auth.users)
| Role | UUID | Email |
|------|------|-------|
| Admin | 00000000-0000-0000-0000-000000000000 | admin@childtrack.com |
| Staff | 11111111-1111-1111-1111-111111111111 | staff@childtrack.com |
| Driver | 22222222-2222-2222-2222-222222222222 | driver@childtrack.com |
| Parent | 33333333-3333-3333-3333-333333333333 | parent@childtrack.com |

**Role guards enforce app → role match, wrong role signs out.**

## Features Complete
- Role-based auth across all platforms
- Staff attendance marking
- Parent dashboard/diary/transport
- Driver route tracking/maps
- Glassmorphism UI consistent
