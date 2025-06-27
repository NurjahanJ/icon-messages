import axios from 'axios';

/**
 * Service for interacting with the OpenAI API
 * This service handles sending messages to the API and receiving responses
 */

// API endpoint for the serverless function
// Get the base URL from the current window location
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return `${window.location.protocol}//${window.location.host}`;
  }
  return '';
};

// API endpoint for the serverless function
const API_URL = '/api/chat';

// Log the API URL for debugging
console.log(`Using API URL: ${API_URL} with base: ${getBaseUrl()}`);

// Create axios instance with proper base URL
const apiClient = axios.create({
  baseURL: getBaseUrl(),
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Send a conversation to the OpenAI API
 * @param {Array} messages - Array of message objects with role and content
 * @param {string} modelId - The ID of the selected model
 * @returns {Promise<Object>} - A promise that resolves to the API response
 */
// Helper function to add delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Function to send conversation with retry logic
export const sendConversation = async (messages, modelId = 'gpt-4o', retries = 2) => {
  try {
    console.log('Sending request to API with model:', modelId);
    console.log('Full API URL:', `${getBaseUrl()}${API_URL}`);
    
    // Use the apiClient instance instead of axios directly
    const response = await apiClient.post(API_URL, { messages, modelId });
    
    return response.data;
  } catch (error) {
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      modelId: modelId,
      retryCount: retries
    });
    
    // Retry logic for specific errors
    if (retries > 0) {
      // Retry on network errors, timeouts, or 5xx server errors
      if (!error.response || error.code === 'ECONNABORTED' || 
          (error.response && error.response.status >= 500)) {
        console.log(`Retrying request (${retries} attempts left)...`);
        await delay(1000); // Wait 1 second before retrying
        return sendConversation(messages, modelId, retries - 1);
      }
    }
    
    // Construct a more informative error message
    let errorMessage = 'Failed to get a response. Please try again later.';
    
    if (error.code === 'ECONNABORTED') {
      errorMessage = 'Request timed out. The server took too long to respond.';
    } else if (error.response) {
      switch (error.response.status) {
        case 401:
          errorMessage = 'Authentication error. Please check API key configuration.';
          break;
        case 403:
          errorMessage = 'Access forbidden. Please check permissions.';
          break;
        case 429:
          errorMessage = 'Rate limit exceeded. Please try again later.';
          break;
        case 500:
          errorMessage = 'Server error. The API encountered an unexpected condition.';
          break;
        default:
          errorMessage = error.response.data?.error || errorMessage;
      }
    }
    
    throw new Error(errorMessage);
  }
};

/**
 * Format a new user message and add it to the conversation
 * @param {string} content - The content of the user's message
 * @returns {Object} - A message object with role and content
 */
export const createUserMessage = (content) => ({
  role: 'user',
  content
});

/**
 * Format a system message
 * @param {string} content - The content of the system message
 * @returns {Object} - A message object with role and content
 */
export const createSystemMessage = (content) => ({
  role: 'system',
  content
});

/**
 * Format an assistant message
 * @param {string} content - The content of the assistant's message
 * @returns {Object} - A message object with role and content
 */
export const createAssistantMessage = (content) => ({
  role: 'assistant',
  content
});
