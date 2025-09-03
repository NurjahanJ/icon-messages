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
const convexUrl = process.env.REACT_APP_CONVEX_URL;

// Debug information
console.log('ConvexContext initialization');
console.log('REACT_APP_CONVEX_URL:', convexUrl ? '✅ URL exists' : '❌ URL missing');

let convexClient;
try {
  if (!convexUrl) {
    throw new Error('REACT_APP_CONVEX_URL is not defined in environment variables');
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
        <p>Please check your environment variables and make sure REACT_APP_CONVEX_URL is set correctly.</p>
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
  const getOrCreateUser = useMutation(api.users.getOrCreateUser);

  useEffect(() => {
    const initializeUser = async () => {
      try {
        // Check if user ID exists in localStorage
        let storedUserId = localStorage.getItem('userId');
        
        // Get or create user in Convex - only pass existingUserId if it's not null
        const validatedUserId = await getOrCreateUser(
          storedUserId ? { existingUserId: storedUserId } : {}
        );
        
        // Update localStorage with validated user ID
        localStorage.setItem('userId', validatedUserId);
        setUserId(validatedUserId);
        console.log('User initialized successfully with ID:', validatedUserId);
      } catch (error) {
        console.error('Error initializing user:', error);
        // Fallback to local user ID if Convex fails
        const fallbackUserId = localStorage.getItem('userId') || nanoid(10);
        localStorage.setItem('userId', fallbackUserId);
        setUserId(fallbackUserId);
        console.log('User initialized with fallback ID:', fallbackUserId);
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
    <UserContext.Provider value={{ userId, setUserId, isInitialized }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
