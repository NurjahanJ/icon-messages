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

// Sustainability interaction functions
// These functions store sustainability interactions in Convex

// Store sustainability info prompt interaction (first prompt)
export const useStoreSustainabilityChoice = () => {
  const storeSustainabilityInteractionMutation = useMutation(api.sustainability.storeSustainabilityInteraction);
  
  return async (choice) => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        console.error('No user ID found in localStorage');
        return null;
      }
      
      const interactionId = await storeSustainabilityInteractionMutation({
        userId,
        interactionType: 'info_prompt',
        userChoice: choice, // 'yes' or 'no'
        timestamp: Date.now(),
      });
      
      console.log('Sustainability choice stored:', choice);
      return interactionId;
    } catch (error) {
      console.error('Error storing sustainability choice:', error);
      console.log('Sustainability choice (fallback):', choice);
      return null;
    }
  };
};

// Store reword prompt interaction (second prompt)
export const useStoreRewordChoice = () => {
  const storeSustainabilityInteractionMutation = useMutation(api.sustainability.storeSustainabilityInteraction);
  
  return async (choice) => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        console.error('No user ID found in localStorage');
        return null;
      }
      
      const interactionId = await storeSustainabilityInteractionMutation({
        userId,
        interactionType: 'rewrite_prompt',
        userChoice: choice, // 'continue' or 'rewrite'
        timestamp: Date.now(),
      });
      
      console.log('Reword choice stored:', choice);
      return interactionId;
    } catch (error) {
      console.error('Error storing reword choice:', error);
      console.log('Reword choice (fallback):', choice);
      return null;
    }
  };
};

// Store reworded prompt and its response
export const useStoreRewordedPrompt = () => {
  const storeSustainabilityInteractionMutation = useMutation(api.sustainability.storeSustainabilityInteraction);
  
  return async (originalPrompt, rewrittenPrompt, rewrittenResponse) => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        console.error('No user ID found in localStorage');
        return null;
      }
      
      const interactionId = await storeSustainabilityInteractionMutation({
        userId,
        interactionType: 'rewritten_content',
        userChoice: 'rewrite',
        originalPrompt,
        rewrittenPrompt,
        rewrittenResponse,
        timestamp: Date.now(),
      });
      
      console.log('Reworded prompt stored');
      return interactionId;
    } catch (error) {
      console.error('Error storing reworded prompt:', error);
      console.log('Reworded prompt (fallback)');
      return null;
    }
  };
};

// Store break choice interaction (third prompt)
export const useStoreBreakChoice = () => {
  const storeSustainabilityInteractionMutation = useMutation(api.sustainability.storeSustainabilityInteraction);
  
  return async (choice) => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        console.error('No user ID found in localStorage');
        return null;
      }
      
      const interactionId = await storeSustainabilityInteractionMutation({
        userId,
        interactionType: 'break_prompt',
        userChoice: choice, // 'continue' or 'take_break'
        timestamp: Date.now(),
      });
      
      console.log('Break choice stored:', choice);
      return interactionId;
    } catch (error) {
      console.error('Error storing break choice:', error);
      console.log('Break choice (fallback):', choice);
      return null;
    }
  };
};

// Get all sustainability interactions for the current user
export const useGetUserSustainabilityInteractions = () => {
  const userId = localStorage.getItem('userId');
  return useQuery(api.sustainability.getUserSustainabilityInteractions, { userId });
};

// Get all sustainability interactions (admin function)
export const useGetAllSustainabilityInteractions = () => {
  return useQuery(api.sustainability.getAllSustainabilityInteractions);
};
