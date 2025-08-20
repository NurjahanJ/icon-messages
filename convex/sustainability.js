import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Store a sustainability interaction
export const storeSustainabilityInteraction = mutation({
  args: {
    userId: v.string(),
    interactionType: v.string(),
    userChoice: v.string(),
    originalPrompt: v.optional(v.string()),
    rewrittenPrompt: v.optional(v.string()),
    rewrittenResponse: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId, interactionType, userChoice, originalPrompt, rewrittenPrompt, rewrittenResponse } = args;
    
    // Store the interaction with current timestamp
    const interactionId = await ctx.db.insert("sustainability_interactions", {
      userId,
      interactionType,
      userChoice,
      originalPrompt,
      rewrittenPrompt,
      rewrittenResponse,
      timestamp: Date.now(),
    });
    
    return interactionId;
  },
});

// Get all sustainability interactions for a specific user
export const getUserSustainabilityInteractions = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const { userId } = args;
    
    return await ctx.db
      .query("sustainability_interactions")
      .filter((q) => q.eq(q.field("userId"), userId))
      .order("desc")
      .collect();
  },
});

// Get all sustainability interactions
export const getAllSustainabilityInteractions = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("sustainability_interactions")
      .order("desc")
      .collect();
  },
});

// Get sustainability interactions by type
export const getSustainabilityInteractionsByType = query({
  args: { interactionType: v.string() },
  handler: async (ctx, args) => {
    const { interactionType } = args;
    
    return await ctx.db
      .query("sustainability_interactions")
      .filter((q) => q.eq(q.field("interactionType"), interactionType))
      .order("desc")
      .collect();
  },
});

// Get sustainability interactions by user choice
export const getSustainabilityInteractionsByChoice = query({
  args: { userChoice: v.string() },
  handler: async (ctx, args) => {
    const { userChoice } = args;
    
    return await ctx.db
      .query("sustainability_interactions")
      .filter((q) => q.eq(q.field("userChoice"), userChoice))
      .order("desc")
      .collect();
  },
});
