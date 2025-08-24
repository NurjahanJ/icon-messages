import { useMutation } from 'convex/react';
import { api } from '../api/convexApi';

/**
 * Hook to store user responses to the sustainability info prompt
 */
export const useStoreInfoPromptResponse = () => {
  const storeInfoPromptResponseMutation = useMutation(api.sustainability.storeInfoPromptResponse);
  
  return async (response) => {
    try {
      // Get user ID from localStorage
      const userId = localStorage.getItem('userId');
      if (!userId) {
        console.error('No user ID found in localStorage');
        return null;
      }
      
      // Store the response in the messages_info table
      const id = await storeInfoPromptResponseMutation({
        userId,
        response, // 'yes' or 'no'
      });
      
      console.log('Info prompt response stored:', response);
      return id;
    } catch (error) {
      console.error('Error storing info prompt response:', error);
      console.log('Info prompt response (fallback):', response);
      return null;
    }
  };
};
