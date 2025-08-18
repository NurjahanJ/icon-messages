import React, { createContext, useContext, useEffect, useState } from 'react';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { useMutation } from 'convex/react';
import { nanoid } from 'nanoid';
// Import API from a path that will be accessible after build
import { api } from '../api/convexApi';

// Create context for user ID
const UserContext = createContext();

// Create a Convex client
const convexUrl = process.env.REACT_APP_CONVEX_URL;
const convexClient = new ConvexReactClient(convexUrl);

export const ConvexProviderWrapper = ({ children }) => {
  return (
    <ConvexProvider client={convexClient}>
      <UserProvider>{children}</UserProvider>
    </ConvexProvider>
  );
};

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const getOrCreateUser = useMutation(api.users.getOrCreateUser);

  useEffect(() => {
    const initializeUser = async () => {
      try {
        // Check if user ID exists in localStorage
        let storedUserId = localStorage.getItem('userId');
        
        // Get or create user in Convex
        const validatedUserId = await getOrCreateUser({ existingUserId: storedUserId });
        
        // Update localStorage with validated user ID
        localStorage.setItem('userId', validatedUserId);
        setUserId(validatedUserId);
      } catch (error) {
        console.error('Error initializing user:', error);
        // Fallback to local user ID if Convex fails
        const fallbackUserId = localStorage.getItem('userId') || nanoid(10);
        localStorage.setItem('userId', fallbackUserId);
        setUserId(fallbackUserId);
      }
    };

    initializeUser();
  }, [getOrCreateUser]);

  return (
    <UserContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
