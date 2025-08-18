import { useMutation, useQuery } from 'convex/react';
import { api } from '../api/convexApi';

/**
 * Service for interacting with Convex database
 * This service handles storing and retrieving user and conversation data
 */

// Get user ID from local storage
export const useGetUserId = () => {
  return () => {
    // Check if user ID exists in local storage
    const userId = localStorage.getItem('userId');
    return userId;
  };
};

// Store a conversation in Convex
export const useStoreConversation = () => {
  const storeConversationMutation = useMutation(api.conversations.storeConversation);
  
  return async (prompt, response) => {
    try {
      // Get user ID from localStorage
      const userId = localStorage.getItem('userId');
      if (!userId) {
        console.error('No user ID found in localStorage');
        return null;
      }
      
      // Store the conversation in Convex
      const conversationId = await storeConversationMutation({
        userId,
        prompt,
        response,
      });
      
      return conversationId;
    } catch (error) {
      console.error('Error storing conversation:', error);
      // Log conversation to console as fallback
      console.log('Conversation (fallback):', { 
        userId: localStorage.getItem('userId'), 
        prompt, 
        response 
      });
      return null;
    }
  };
};

// Get conversations for the current user
export const useGetUserConversations = () => {
  const userId = localStorage.getItem('userId');
  return useQuery(api.conversations.getUserConversations, { userId });
};

// Get all conversations (admin function)
export const useGetAllConversations = () => {
  return useQuery(api.conversations.getAllConversations);
};
