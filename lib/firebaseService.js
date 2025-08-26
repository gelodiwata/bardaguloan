import { database } from './firebase';
import { ref, push, set, update, remove, onValue, off, query, orderByChild, equalTo } from 'firebase/database';

const UTANGS_REF = 'utangs';

export const firebaseService = {
  // Initialize real-time listener for all utangs (global)
  subscribeToUtangs: (callback, onError) => {
    const utangsRef = ref(database, UTANGS_REF);
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

  // Add new utang (global)
  addUtang: async (utang) => {
    try {
      const utangsRef = ref(database, UTANGS_REF);
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

  // Update existing utang (global)
  updateUtang: async (id, updatedUtang) => {
    try {
      const utangRef = ref(database, `${UTANGS_REF}/${id}`);
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

  // Delete utang (global)
  deleteUtang: async (id) => {
    try {
      const utangRef = ref(database, `${UTANGS_REF}/${id}`);
      await remove(utangRef);
      return { success: true };
    } catch (error) {
      console.error('Error deleting utang:', error);
      return { success: false, error: error.message };
    }
  },

  // Batch operations (global)
  addBatchUtangs: async (utangs) => {
    try {
      const updates = {};
      
      utangs.forEach(utang => {
        const newUtangRef = push(ref(database, UTANGS_REF));
        updates[`${UTANGS_REF}/${newUtangRef.key}`] = {
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