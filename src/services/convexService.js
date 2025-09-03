import { useMutation, useQuery } from 'convex/react';
import { api } from '../api/convexApi';
import { useUser } from '../contexts/ConvexContext';
import { nanoid } from 'nanoid';

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

// Store a conversation in Convex with enhanced reliability
export const useStoreConversation = () => {
  const storeConversationMutation = useMutation(api.conversations.storeConversation);
  const createUserMutation = useMutation(api.users.getOrCreateUser);
  const { userId: contextUserId, isInitialized, initializationError } = useUser();
  
  return async (prompt, response, maxRetries = 5) => {
    // Track retry attempts
    let retries = 0;
    
    // Function to attempt storage with retry logic
    const attemptStore = async () => {
      try {
        // First try to use userId from context if available
        let effectiveUserId = contextUserId;
        
        // Fall back to localStorage if context isn't available
        if (!effectiveUserId) {
          effectiveUserId = localStorage.getItem('userId');
          console.log('Using userId from localStorage as fallback:', effectiveUserId ? `${effectiveUserId.substring(0, 4)}...` : 'null');
        }
        
        if (!effectiveUserId) {
          console.error('No user ID found in context or localStorage');
          // Generate a new user ID as last resort
          effectiveUserId = nanoid(10);
          localStorage.setItem('userId', effectiveUserId);
          console.log('Generated new userId as last resort:', `${effectiveUserId.substring(0, 4)}...`);
          
          // Try to create this user in the database
          try {
            await createUserMutation({});
            console.log('Created new user in database');
          } catch (userCreateError) {
            console.error('Failed to create new user in database:', userCreateError);
          }
        }
        
        // Store the conversation in Convex
        const conversationId = await storeConversationMutation({
          userId: effectiveUserId,
          prompt,
          response,
          timestamp: Date.now(),
        });
        
        console.log('Conversation stored successfully with ID:', conversationId);
        return conversationId;
      } catch (error) {
        retries++;
        console.error(`Error storing conversation (attempt ${retries}/${maxRetries}):`, error);
        
        // Check for specific error types
        const errorMessage = error.toString().toLowerCase();
        
        // If the error indicates the user doesn't exist, try to create the user
        if (errorMessage.includes('user') && errorMessage.includes('not found') && retries <= 2) {
          try {
            console.log('User not found, attempting to create user...');
            const userId = await createUserMutation({});
            console.log('Created new user with ID:', `${userId.substring(0, 4)}...`);
            localStorage.setItem('userId', userId);
            
            // No need to increment retry counter for this special case
            retries--;
          } catch (userCreateError) {
            console.error('Failed to create user:', userCreateError);
          }
        }
        
        if (retries < maxRetries) {
          // Wait before retry with exponential backoff
          const delay = Math.min(1000 * Math.pow(2, retries - 1), 8000);
          console.log(`Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          return attemptStore(); // Recursive retry
        } else {
          // Log conversation to console as fallback after all retries fail
          console.log('Conversation (fallback after retries):', { 
            userId: contextUserId || localStorage.getItem('userId'), 
            prompt, 
            response,
            timestamp: Date.now()
          });
          return null;
        }
      }
    };
    
    // If user initialization is still in progress, wait briefly before attempting
    if (!isInitialized) {
      console.log('User not yet initialized, waiting before storing conversation...');
      await new Promise(resolve => setTimeout(resolve, 2000)); // Increased wait time
    }
    
    // If there was an initialization error, log it but still try to store
    if (initializationError) {
      console.warn('Proceeding with conversation storage despite initialization error:', initializationError);
    }
    
    return attemptStore();
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
  const { userId, isInitialized } = useUser();
  
  return async (choice) => {
    try {
      // Wait for user initialization if needed
      if (!isInitialized) {
        console.log('Waiting for user initialization before storing sustainability choice...');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // Get userId from context or localStorage
      const effectiveUserId = userId || localStorage.getItem('userId');
      if (!effectiveUserId) {
        console.error('No user ID found in context or localStorage');
        return null;
      }
      
      const interactionId = await storeSustainabilityInteractionMutation({
        userId: effectiveUserId,
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
  const { userId, isInitialized } = useUser();
  
  return async (choice) => {
    try {
      // Wait for user initialization if needed
      if (!isInitialized) {
        console.log('Waiting for user initialization before storing reword choice...');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // Get userId from context or localStorage
      const effectiveUserId = userId || localStorage.getItem('userId');
      if (!effectiveUserId) {
        console.error('No user ID found in context or localStorage');
        return null;
      }
      
      const interactionId = await storeSustainabilityInteractionMutation({
        userId: effectiveUserId,
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
  const { userId, isInitialized } = useUser();
  
  return async (originalPrompt, rewrittenPrompt, rewrittenResponse) => {
    try {
      // Wait for user initialization if needed
      if (!isInitialized) {
        console.log('Waiting for user initialization before storing reworded prompt...');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // Get userId from context or localStorage
      const effectiveUserId = userId || localStorage.getItem('userId');
      if (!effectiveUserId) {
        console.error('No user ID found in context or localStorage');
        return null;
      }
      
      const interactionId = await storeSustainabilityInteractionMutation({
        userId: effectiveUserId,
        interactionType: 'rewritten_content',
        userChoice: 'rewrite',
        originalPrompt,
        rewrittenPrompt,
        rewrittenResponse,
        timestamp: Date.now(),
      });
      
      console.log('Reworded prompt stored successfully');
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
  const { userId, isInitialized } = useUser();
  
  return async (choice) => {
    try {
      // Wait for user initialization if needed
      if (!isInitialized) {
        console.log('Waiting for user initialization before storing break choice...');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // Get userId from context or localStorage
      const effectiveUserId = userId || localStorage.getItem('userId');
      if (!effectiveUserId) {
        console.error('No user ID found in context or localStorage');
        return null;
      }
      
      const interactionId = await storeSustainabilityInteractionMutation({
        userId: effectiveUserId,
        interactionType: 'break_prompt',
        userChoice: choice, // 'continue' or 'break'
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
