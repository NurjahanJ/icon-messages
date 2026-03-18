import React, { createContext, useContext, useEffect, useState } from 'react';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { useMutation } from 'convex/react';
import { nanoid } from 'nanoid';
// Import API from a path that will be accessible after build
import { api } from '../api/convexApi';

// Create context for user ID
const UserContext = createContext();

// Create a Convex client with error handling
// Use fallback URL if environment variable is not set
const convexUrl = import.meta.env.VITE_CONVEX_URL;

// Debug information
console.log('ConvexContext initialization');
console.log('VITE_CONVEX_URL:', convexUrl ? '✅ URL exists' : '❌ URL missing');

let convexClient;
try {
  if (!convexUrl) {
    throw new Error('VITE_CONVEX_URL is not defined in environment variables');
  }
  convexClient = new ConvexReactClient(convexUrl);
  console.log('✅ Convex client created successfully');
} catch (error) {
  console.error('❌ Error creating Convex client:', error);
  // Create a fallback client that will show an error UI instead of crashing
  convexClient = {
    _isFallback: true,
    error: error.message
  };
}

export const ConvexProviderWrapper = ({ children }) => {
  // Check if we're using the fallback client
  if (convexClient._isFallback) {
    return (
      <div className="p-4 m-4 border border-red-500 rounded bg-red-50">
        <h2 className="text-xl font-bold text-red-700 mb-2">Convex Connection Error</h2>
        <p className="text-red-600 mb-4">{convexClient.error}</p>
        <p>Please check your environment variables and make sure VITE_CONVEX_URL is set correctly.</p>
        <p className="mt-2">Current URL: {convexUrl || 'undefined'}</p>
      </div>
    );
  }
  
  return (
    <ConvexProvider client={convexClient}>
      <UserProvider>{children}</UserProvider>
    </ConvexProvider>
  );
};

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [initializationError, setInitializationError] = useState(null);
  const getOrCreateUser = useMutation(api.users.getOrCreateUser);

  useEffect(() => {
    const initializeUser = async (retryCount = 0, maxRetries = 3) => {
      try {
        console.log(`Attempting to initialize user (attempt ${retryCount + 1}/${maxRetries + 1})`);
        
        // Check if user ID exists in localStorage
        let storedUserId = localStorage.getItem('userId');
        console.log('Stored userId from localStorage:', storedUserId ? `${storedUserId.substring(0, 4)}...` : 'null');
        
        // Get or create user in Convex - only pass existingUserId if it's not null
        const validatedUserId = await getOrCreateUser(
          storedUserId ? { existingUserId: storedUserId } : {}
        );
        
        if (!validatedUserId) {
          throw new Error('Received null or undefined userId from Convex');
        }
        
        // Update localStorage with validated user ID
        localStorage.setItem('userId', validatedUserId);
        setUserId(validatedUserId);
        setInitializationError(null);
        console.log('User initialized successfully with ID:', `${validatedUserId.substring(0, 4)}...`);
      } catch (error) {
        console.error(`Error initializing user (attempt ${retryCount + 1}):`, error);
        
        // Retry logic with exponential backoff
        if (retryCount < maxRetries) {
          const delay = Math.min(1000 * Math.pow(2, retryCount), 8000);
          console.log(`Retrying user initialization in ${delay}ms...`);
          setTimeout(() => initializeUser(retryCount + 1, maxRetries), delay);
          return;
        }
        
        // After all retries, fall back to local user ID
        setInitializationError(error.message);
        const fallbackUserId = localStorage.getItem('userId') || nanoid(10);
        localStorage.setItem('userId', fallbackUserId);
        setUserId(fallbackUserId);
        console.log('User initialized with fallback ID:', `${fallbackUserId.substring(0, 4)}...`);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeUser();
  }, [getOrCreateUser]);

  // Show loading indicator while initializing
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2">Initializing your session...</p>
        </div>
      </div>
    );
  }

  return (
    <UserContext.Provider value={{ 
      userId, 
      setUserId, 
      isInitialized,
      initializationError
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
