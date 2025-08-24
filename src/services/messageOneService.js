import { useMutation } from 'convex/react';
import { api } from '../api/convexApi';

/**
 * Hook to store user's choice for the info message (yes/no)
 */
export const useStoreInfoMessageChoice = () => {
  const storeInfoMessageChoiceMutation = useMutation(api.message_one.storeInfoMessageChoice);
  
  return async (choice) => {
    try {
      // Get user ID from localStorage
      const userId = localStorage.getItem('userId');
      if (!userId) {
        console.error('No user ID found in localStorage');
        return null;
      }
      
      // Store the choice in the message-one table
      const id = await storeInfoMessageChoiceMutation({
        userId,
        info_message: choice, // "yes" or "no"
      });
      
      console.log('Info message choice stored:', choice);
      return id;
    } catch (error) {
      console.error('Error storing info message choice:', error);
      return null;
    }
  };
};

/**
 * Hook to store user's choice for rewording (reword/continue)
 */
export const useStoreRewordChoice = () => {
  const storeRewordChoiceMutation = useMutation(api.message_one.storeRewordChoice);
  
  return async (choice, messageId = null) => {
    try {
      // Get user ID from localStorage
      const userId = localStorage.getItem('userId');
      if (!userId) {
        console.error('No user ID found in localStorage');
        return null;
      }
      
      // Store the choice in the message_one table
      const id = await storeRewordChoiceMutation({
        userId,
        messageId,
        reword_choice: choice, // "reword" or "continue"
      });
      
      console.log('Reword choice stored:', choice);
      return id;
    } catch (error) {
      console.error('Error storing reword choice:', error);
      return null;
    }
  };
};

/**
 * Hook to store user's choice for the break message (break/continue)
 */
export const useStoreBreakMessageChoice = () => {
  const storeBreakMessageChoiceMutation = useMutation(api.message_one.storeBreakMessageChoice);
  
  return async (choice, messageId = null) => {
    try {
      // Get user ID from localStorage
      const userId = localStorage.getItem('userId');
      if (!userId) {
        console.error('No user ID found in localStorage');
        return null;
      }
      
      // Store the choice in the message_one table
      const id = await storeBreakMessageChoiceMutation({
        userId,
        messageId,
        break_message: choice, // "break" or "continue"
      });
      
      console.log('Break message choice stored:', choice);
      return id;
    } catch (error) {
      console.error('Error storing break message choice:', error);
      return null;
    }
  };
};
