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

// Store user's choice for the sustainability prompt (yes/no)
export const useStoreSustainabilityChoice = () => {
  const storeSustainabilityChoiceMutation = useMutation(api.messages.storeSustainabilityChoice);
  
  return async (choice) => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        console.error('No user ID found in localStorage');
        return null;
      }
      
      const messageId = await storeSustainabilityChoiceMutation({
        userId,
        choice,
      });
      
      return messageId;
    } catch (error) {
      console.error('Error storing sustainability choice:', error);
      return null;
    }
  };
};

// Store user's choice for reword/continue prompt
export const useStoreRewordChoice = () => {
  const storeRewordChoiceMutation = useMutation(api.messages.storeRewordChoice);
  
  return async (choice, originalPrompt = null) => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        console.error('No user ID found in localStorage');
        return null;
      }
      
      const messageId = await storeRewordChoiceMutation({
        userId,
        choice,
        originalPrompt,
      });
      
      return messageId;
    } catch (error) {
      console.error('Error storing reword choice:', error);
      return null;
    }
  };
};

// Store reworded prompt
export const useStoreRewordedPrompt = () => {
  const storeRewordedPromptMutation = useMutation(api.messages.storeRewordedPrompt);
  
  return async (rewordedPrompt, messageId = null) => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        console.error('No user ID found in localStorage');
        return null;
      }
      
      const newMessageId = await storeRewordedPromptMutation({
        userId,
        rewordedPrompt,
        messageId,
      });
      
      return newMessageId;
    } catch (error) {
      console.error('Error storing reworded prompt:', error);
      return null;
    }
  };
};

// Store user's choice for break message (continue/break)
export const useStoreBreakChoice = () => {
  const storeBreakChoiceMutation = useMutation(api.messages.storeBreakChoice);
  
  return async (choice) => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        console.error('No user ID found in localStorage');
        return null;
      }
      
      const messageId = await storeBreakChoiceMutation({
        userId,
        choice,
      });
      
      return messageId;
    } catch (error) {
      console.error('Error storing break choice:', error);
      return null;
    }
  };
};

// Get messages for the current user
export const useGetUserMessages = () => {
  const userId = localStorage.getItem('userId');
  return useQuery(api.messages.getUserMessages, { userId });
};

// Get all messages (admin function)
export const useGetAllMessages = () => {
  return useQuery(api.messages.getAllMessages);
};
