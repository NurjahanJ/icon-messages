import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Store a new conversation (prompt + response)
export const storeConversation = mutation({
  args: {
    userId: v.string(),
    prompt: v.string(),
    response: v.string(),
  },
  handler: async (ctx, args) => {
    const { userId, prompt, response } = args;
    
    // Get the user's previous conversations to calculate promptCounter
    const userConversations = await ctx.db
      .query("conversations")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();
    
    // Calculate the promptCounter (number of previous conversations + 1)
    const promptCounter = userConversations.length + 1;
    
    // Check if user exists
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("userId"), userId))
      .first();
    
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }
    
    // Update user's total prompts count
    await ctx.db.patch(user._id, { 
      promptCounter: (user.promptCounter || 0) + 1 
    });
    
    // Store the conversation in the database with promptCounter
    const conversationId = await ctx.db.insert("conversations", {
      userId,
      prompt,
      response,
      promptCounter,
    });
    
    return conversationId;
  },
});

// Get conversations for a specific user
export const getUserConversations = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("conversations")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .order("desc", (q) => q.field("promptCounter"))
      .collect();
  },
});

// Get all conversations (admin function)
export const getAllConversations = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("conversations")
      .order("desc", (q) => q.field("promptCounter"))
      .collect();
  },
});
