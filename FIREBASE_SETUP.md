# Firebase Realtime Database Integration Guide

This guide will help you set up and deploy the Bardaguloan application with Firebase Realtime Database.

## Prerequisites

1. **Firebase Account**: Create a free account at [firebase.google.com](https://firebase.google.com)
2. **Node.js**: Ensure you have Node.js 16+ installed
3. **Firebase CLI**: Install globally with `npm install -g firebase-tools`

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create Project" or select existing project
3. Name your project (e.g., "bardaguloan-app")
4. Enable Google Analytics (optional)
5. Click "Create Project"

## Step 2: Enable Realtime Database

1. In Firebase Console, go to **Build > Realtime Database**
2. Click **Create Database**
3. Choose **Start in test mode** (for development)
4. Select your region (choose closest to your users)
5. Click **Enable**

## Step 3: Get Firebase Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Under **Your apps**, click **Add app** > **Web**
3. Register your app with a nickname (e.g., "bardaguloan-web")
4. Copy the configuration object that appears
5. Replace the placeholder values in `.env.local` with your actual Firebase config

## Step 4: Configure Environment Variables

Your `.env.local` file should look like this:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your_project_id-default-rtdb.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Step 5: Database Rules (Security)

For production, update your database rules in Firebase Console:

1. Go to **Realtime Database > Rules**
2. Replace with secure rules:

```javascript
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null",
    "utangs": {
      ".read": true,
      ".write": true
    }
  }
}
```

## Step 6: Deploy to Firebase Hosting (Optional)

### Install Firebase CLI
```bash
npm install -g firebase-tools
```

### Login to Firebase
```bash
firebase login
```

### Initialize Firebase in your project
```bash
firebase init
```

Select:
- **Hosting** (use space bar to select)
- Choose your Firebase project
- **dist** as your public directory (or **out** if using static export)
- **Yes** to single-page app
- **No** to overwrite index.html

### Deploy
```bash
npm run build
firebase deploy
```

## Step 7: Test the Application

1. **Local Development**:
   ```bash
   npm run dev
   ```

2. **Production Build**:
   ```bash
   npm run build
   npm run start
   ```

## Features Now Available

✅ **Real-time Data Sync**: All utangs sync across devices instantly
✅ **Offline Support**: Firebase handles offline scenarios automatically
✅ **Error Handling**: Comprehensive error messages for network issues
✅ **Batch Operations**: Efficient bulk uploads
✅ **Image Upload**: Receipt images stored with transactions

## Troubleshooting

### Common Issues

1. **Permission Denied**: Check your database rules (use test mode for development)
2. **CORS Issues**: Ensure Firebase hosting or proper CORS configuration
3. **Missing Data**: Check if `.env.local` has correct values
4. **Build Errors**: Ensure all dependencies are installed: `npm install`

### Debug Commands

```bash
# Check Firebase connection
firebase projects:list

# Test database connection
firebase database:get /utangs

# View logs
firebase functions:log
```

## Next Steps

1. **Add Authentication**: Implement Firebase Authentication for user management
2. **Add Analytics**: Enable Firebase Analytics for usage tracking
3. **Add Performance Monitoring**: Use Firebase Performance Monitoring
4. **Add Cloud Storage**: Store receipt images in Firebase Storage
5. **Add Cloud Functions**: Server-side logic for complex operations

## Support

- **Firebase Documentation**: https://firebase.google.com/docs
- **Next.js Firebase Guide**: https://nextjs.org/docs/deployment#managed-nextjs-with-firebase
- **Community**: https://stackoverflow.com/questions/tagged/firebase

Your Bardaguloan application is now fully integrated with Firebase Realtime Database! 🚀