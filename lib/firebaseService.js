import { database } from './firebase';
import { ref, push, set, update, remove, onValue, off, query, orderByChild, equalTo } from 'firebase/database';

const UTANGS_REF = 'utangs';

export const firebaseService = {
  // Initialize real-time listener for utangs for a specific user
  subscribeToUtangs: (userId, callback, onError) => {
    if (!userId) {
      callback([]);
      return () => {};
    }
    
    const utangsRef = ref(database, `${UTANGS_REF}/${userId}`);
    const unsubscribe = onValue(utangsRef, (snapshot) => {
      try {
        const data = snapshot.val();
        const utangsList = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
        callback(utangsList);
      } catch (error) {
        console.error('Error processing utangs data:', error);
        if (onError) onError(error);
        callback([]);
      }
    }, (error) => {
      console.error('Error subscribing to utangs:', error);
      if (onError) onError(error);
      callback([]);
    });
    
    return () => off(utangsRef);
  },

  // Add new utang for a specific user
  addUtang: async (userId, utang) => {
    try {
      if (!userId) throw new Error('User ID is required');
      const utangsRef = ref(database, `${UTANGS_REF}/${userId}`);
      const newUtangRef = push(utangsRef);
      await set(newUtangRef, {
        ...utang,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return { id: newUtangRef.key, success: true };
    } catch (error) {
      console.error('Error adding utang:', error);
      return { success: false, error: error.message };
    }
  },

  // Update existing utang for a specific user
  updateUtang: async (userId, id, updatedUtang) => {
    try {
      if (!userId) throw new Error('User ID is required');
      const utangRef = ref(database, `${UTANGS_REF}/${userId}/${id}`);
      await update(utangRef, {
        ...updatedUtang,
        updatedAt: new Date().toISOString()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating utang:', error);
      return { success: false, error: error.message };
    }
  },

  // Delete utang for a specific user
  deleteUtang: async (userId, id) => {
    try {
      if (!userId) throw new Error('User ID is required');
      const utangRef = ref(database, `${UTANGS_REF}/${userId}/${id}`);
      await remove(utangRef);
      return { success: true };
    } catch (error) {
      console.error('Error deleting utang:', error);
      return { success: false, error: error.message };
    }
  },

  // Batch operations for a specific user
  addBatchUtangs: async (userId, utangs) => {
    try {
      if (!userId) throw new Error('User ID is required');
      const updates = {};
      
      utangs.forEach(utang => {
        const newUtangRef = push(ref(database, `${UTANGS_REF}/${userId}`));
        updates[`${UTANGS_REF}/${userId}/${newUtangRef.key}`] = {
          ...utang,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      });
      
      await update(ref(database), updates);
      return { success: true };
    } catch (error) {
      console.error('Error adding batch utangs:', error);
      return { success: false, error: error.message };
    }
  },

  // Check Firebase connection
  checkConnection: () => {
    return new Promise((resolve) => {
      const connectedRef = ref(database, '.info/connected');
      onValue(connectedRef, (snap) => {
        resolve(snap.val() === true);
      });
    });
  }
};