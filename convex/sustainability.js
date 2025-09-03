import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Store sustainability interaction data
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
    const { userId, interactionType, userChoice, originalPrompt, rewrittenPrompt, rewrittenResponse } = args;
    
    // Store the interaction in the sustainability table
    const interactionId = await ctx.db.insert("sustainability", {
      userId,
      interactionType,
      userChoice,
      originalPrompt,
      rewrittenPrompt,
      rewrittenResponse,
      timestamp: args.timestamp || Date.now(),
    });
    
    return interactionId;
  },
});

// Get sustainability interactions for a specific user
export const getUserSustainabilityInteractions = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("sustainability")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .order("desc", (q) => q.field("timestamp"))
      .collect();
  },
});

// Get all sustainability interactions (admin function)
export const getAllSustainabilityInteractions = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("sustainability")
      .order("desc", (q) => q.field("timestamp"))
      .collect();
  },
});

// Get sustainability interactions by type
export const getSustainabilityInteractionsByType = query({
  args: { interactionType: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("sustainability")
      .filter((q) => q.eq(q.field("interactionType"), args.interactionType))
      .order("desc", (q) => q.field("timestamp"))
      .collect();
  },
});

// Get sustainability interactions by user choice
export const getSustainabilityInteractionsByChoice = query({
  args: { userChoice: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("sustainability")
      .filter((q) => q.eq(q.field("userChoice"), args.userChoice))
      .order("desc", (q) => q.field("timestamp"))
      .collect();
  },
});

// Store info prompt response in the sustainability table
export const storeInfoPromptResponse = mutation({
  args: {
    userId: v.string(),
    response: v.string(), // 'yes' or 'no'
  },
  handler: async (ctx, args) => {
    const { userId, response } = args;
    
    // Store the response in the sustainability table
    const interactionId = await ctx.db.insert("sustainability", {
      userId,
      interactionType: "info_prompt",
      userChoice: response,
      timestamp: Date.now(),
    });
    
    return interactionId;
  },
});
