import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Empty implementation of sustainability functions to maintain API compatibility
// The sustainability table has been removed from the schema

// Store sustainability interaction data (no-op implementation)
export const storeSustainabilityInteraction = mutation({
  args: {
    userId: v.string(),
    interactionType: v.string(),
    userChoice: v.string(),
    originalPrompt: v.optional(v.string()),
    rewrittenPrompt: v.optional(v.string()),
    rewrittenResponse: v.optional(v.string()),
    timestamp: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    console.log('Sustainability tracking disabled - interaction not stored');
    // Return a mock ID to maintain API compatibility
    return "mock-interaction-id";
  },
});

// Get sustainability interactions for a specific user (returns empty array)
export const getUserSustainabilityInteractions = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    // Return empty array to maintain API compatibility
    return [];
  },
});

// Get all sustainability interactions (returns empty array)
export const getAllSustainabilityInteractions = query({
  args: {},
  handler: async (ctx) => {
    // Return empty array to maintain API compatibility
    return [];
  },
});

// Get sustainability interactions by type (returns empty array)
export const getSustainabilityInteractionsByType = query({
  args: { interactionType: v.string() },
  handler: async (ctx, args) => {
    // Return empty array to maintain API compatibility
    return [];
  },
});

// Get sustainability interactions by user choice (returns empty array)
export const getSustainabilityInteractionsByChoice = query({
  args: { userChoice: v.string() },
  handler: async (ctx, args) => {
    // Return empty array to maintain API compatibility
    return [];
  },
});

// Store info prompt response (no-op implementation)
export const storeInfoPromptResponse = mutation({
  args: {
    userId: v.string(),
    response: v.string(), // 'yes' or 'no'
  },
  handler: async (ctx, args) => {
    console.log('Sustainability tracking disabled - info prompt response not stored');
    // Return a mock ID to maintain API compatibility
    return "mock-info-prompt-id";
  },
});
