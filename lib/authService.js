import { auth } from './firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';

// Register a new user
export const registerUser = async (email, password, displayName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update user profile with display name
    if (displayName) {
      await updateProfile(userCredential.user, { displayName });
    }
    
    // Reload user profile to ensure displayName is updated
    await userCredential.user.reload();
    const refreshedUser = auth.currentUser;
    
    return {
      success: true,
      user: refreshedUser || userCredential.user,
      error: null
    };
  } catch (error) {
    console.error('Registration error:', error);
    
    let userFriendlyError = 'Registration failed. Please try again.';
    
    // Handle specific Firebase error codes
    switch (error.code) {
      case 'auth/email-already-in-use':
        userFriendlyError = 'This email is already registered. Please use a different email or try logging in instead.';
        break;
      case 'auth/invalid-email':
        userFriendlyError = 'Please enter a valid email address.';
        break;
      case 'auth/operation-not-allowed':
        userFriendlyError = 'Email registration is currently disabled. Please contact support.';
        break;
      case 'auth/weak-password':
        userFriendlyError = 'Password is too weak. Please use a stronger password with at least 6 characters.';
        break;
      default:
        userFriendlyError = error.message || 'Registration failed. Please try again.';
    }
    
    return {
      success: false,
      user: null,
      error: userFriendlyError
    };
  }
};

// Login existing user
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Reload user profile to ensure displayName is updated
    await userCredential.user.reload();
    const refreshedUser = auth.currentUser;
    
    return {
      success: true,
      user: refreshedUser || userCredential.user,
      error: null
    };
  } catch (error) {
    console.error('Login error:', error);
    
    let userFriendlyError = 'Login failed. Please try again.';
    
    // Handle specific Firebase error codes
    switch (error.code) {
      case 'auth/invalid-email':
        userFriendlyError = 'Please enter a valid email address.';
        break;
      case 'auth/user-disabled':
        userFriendlyError = 'This account has been disabled. Please contact support.';
        break;
      case 'auth/user-not-found':
        userFriendlyError = 'No account found with this email. Please check your email or register a new account.';
        break;
      case 'auth/wrong-password':
        userFriendlyError = 'Incorrect password. Please try again or use the forgot password option.';
        break;
      default:
        userFriendlyError = error.message || 'Login failed. Please try again.';
    }
    
    return {
      success: false,
      user: null,
      error: userFriendlyError
    };
  }
};

// Logout current user
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return {
      success: true,
      error: null
    };
  } catch (error) {
    console.error('Logout error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Subscribe to auth state changes
export const subscribeToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, (user) => {
    callback(user);
  });
};

// Get current user
export const getCurrentUser = () => {
  return auth.currentUser;
};

// Check if user is authenticated
export const isUserAuthenticated = () => {
  return auth.currentUser !== null;
};

// Reload user profile to get updated data (like displayName)
export const reloadUserProfile = async () => {
  try {
    if (auth.currentUser) {
      await auth.currentUser.reload();
      return auth.currentUser;
    }
    return null;
  } catch (error) {
    console.error('Error reloading user profile:', error);
    return null;
  }
};