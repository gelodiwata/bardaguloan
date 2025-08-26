# User Authentication Setup Guide

This guide covers the complete setup for user authentication in the Bardaguloan application.

## Overview

The application now includes Firebase Authentication with the following features:
- User registration with email/password
- User login with email/password
- Real-time authentication state management
- User-specific data isolation
- Protected routes based on authentication state

## Components Created

### 1. Authentication Service (`lib/authService.js`)
- `registerUser(email, password, displayName)` - Register new users
- `loginUser(email, password)` - Login existing users
- `logoutUser()` - Logout current user
- `subscribeToAuthChanges(callback)` - Real-time auth state monitoring
- `getCurrentUser()` - Get currently logged in user
- `isUserAuthenticated()` - Check if user is logged in

### 2. Authentication Context (`pages/context/AuthContext.jsx`)
- Provides authentication state throughout the app
- Manages loading states
- Handles real-time auth state changes

### 3. Authentication Components
- `RegisterForm.jsx` - User registration form with validation
- `LoginForm.jsx` - User login form
- `AuthModal.jsx` - Combined modal for login/register switching

### 4. Updated Firebase Configuration
- Added Firebase Authentication module
- Updated database structure to use user-specific paths
- Enhanced security with user data isolation

## Database Structure Changes

The Firebase Realtime Database now uses user-specific paths:
```
utangs/
  └── {userId}/
      └── {utangId}
          ├── name: string
          ├── img: string
          └── details: object
              ├── amount: number
              ├── to: string
              ├── item: string
              ├── date: string
              ├── paid: boolean
              └── receipt: string (optional)
```

## Setup Instructions

### 1. Enable Firebase Authentication
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Navigate to "Authentication" > "Get started"
4. Enable "Email/Password" provider
5. Save the configuration

### 2. Update Firebase Rules
Update your Firebase Realtime Database rules to support user-specific data:

```json
{
  "rules": {
    "utangs": {
      "$userId": {
        ".read": "$userId === auth.uid",
        ".write": "$userId === auth.uid"
      }
    }
  }
}
```

### 3. Environment Variables
Ensure your `.env.local` file includes all required Firebase configuration:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Usage

### Registration
1. When first accessing the app, users will see an authentication modal
2. Click "Register" tab
3. Fill in:
   - Email address
   - Display name (used as username in the app)
   - Password (minimum 6 characters)
   - Confirm password
4. Click "Register" button

### Login
1. Existing users can click "Login" tab
2. Enter email and password
3. Click "Login" button

### Logout
1. Click the user avatar in the top-right corner
2. Select "Logout" from the dropdown menu

## Security Features

- **User Data Isolation**: Each user's data is stored under their unique user ID
- **Protected Routes**: The app automatically redirects unauthenticated users to the login screen
- **Real-time Sync**: Authentication state is synchronized across all components
- **Error Handling**: Comprehensive error handling for all authentication operations

## Testing the Implementation

1. **Registration Test**:
   - Open the app in a new browser/incognito window
   - Register a new user account
   - Verify the user can add utangs
   - Check that data is isolated to the specific user

2. **Login Test**:
   - Logout from the current account
   - Login with existing credentials
   - Verify data persistence across sessions

3. **Multi-user Test**:
   - Register multiple user accounts
   - Verify each user only sees their own data
   - Test simultaneous usage by different users

## Troubleshooting

### Common Issues

1. **Registration fails**: Check Firebase Authentication is enabled in console
2. **Data not saving**: Verify database rules allow user-specific writes
3. **Login issues**: Ensure email/password provider is enabled
4. **User data not isolated**: Check database structure uses userId as parent key

### Debug Steps

1. Check browser console for error messages
2. Verify Firebase configuration in environment variables
3. Test authentication directly in Firebase console
4. Check network tab for API calls

## Next Steps

- Add password reset functionality
- Implement email verification
- Add social login providers (Google, Facebook)
- Create user profile management
- Add multi-device support considerations