import { useMutation } from 'convex/react';
import { api } from '../api/convexApi';

/**
 * Hook to store user responses to the break message prompt
 */
export const useStoreBreakMessageResponse = () => {
  const storeBreakMessageResponseMutation = useMutation(api.sustainability.storeBreakMessageResponse);
  
  return async (response) => {
    try {
      // Get user ID from localStorage
      const userId = localStorage.getItem('userId');
      if (!userId) {
        console.error('No user ID found in localStorage');
        return null;
      }
      
      // Store the response in the messages_info table
      const id = await storeBreakMessageResponseMutation({
        userId,
        response, // 'continue' or 'break'
      });
      
      console.log('Break message response stored:', response);
      return id;
    } catch (error) {
      console.error('Error storing break message response:', error);
      console.log('Break message response (fallback):', response);
      return null;
    }
  };
};
