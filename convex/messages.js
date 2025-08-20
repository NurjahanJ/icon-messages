import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Store user interaction with the first sustainability prompt (yes/no)
export const storeSustainabilityChoice = mutation({
  args: {
    userId: v.string(),
    choice: v.string(), // 'yes' or 'no'
  },
  handler: async (ctx, args) => {
    const { userId, choice } = args;
    
    // Create a new record in the messages table
    const messageId = await ctx.db.insert("messages", {
      userId,
      sustainabilityChoice: choice,
      timestamp: new Date().toISOString(),
    });
    
    return messageId;
  },
});

// Store user interaction with the reword/continue prompt
export const storeRewordChoice = mutation({
  args: {
    userId: v.string(),
    choice: v.string(), // 'reword' or 'continue'
    originalPrompt: v.optional(v.string()), // Original 3rd prompt
  },
  handler: async (ctx, args) => {
    const { userId, choice, originalPrompt } = args;
    
    // Create a new record in the messages table
    const messageId = await ctx.db.insert("messages", {
      userId,
      rewordOrContinue: choice,
      ogPrompt: originalPrompt,
      timestamp: new Date().toISOString(),
    });
    
    return messageId;
  },
});

// Store reworded prompt
export const storeRewordedPrompt = mutation({
  args: {
    userId: v.string(),
    rewordedPrompt: v.string(),
    messageId: v.optional(v.id("messages")), // Optional ID to update existing record
  },
  handler: async (ctx, args) => {
    const { userId, rewordedPrompt, messageId } = args;
    
    if (messageId) {
      // Update existing record if messageId is provided
      await ctx.db.patch(messageId, {
        rewordedPrompt,
      });
      return messageId;
    } else {
      // Create a new record if no messageId is provided
      const newMessageId = await ctx.db.insert("messages", {
        userId,
        rewordedPrompt,
        timestamp: new Date().toISOString(),
      });
      return newMessageId;
    }
  },
});

// Store user interaction with the break message prompt
export const storeBreakChoice = mutation({
  args: {
    userId: v.string(),
    choice: v.string(), // 'continue' or 'break'
  },
  handler: async (ctx, args) => {
    const { userId, choice } = args;
    
    // Create a new record in the messages table
    const messageId = await ctx.db.insert("messages", {
      userId,
      breakMessage: choice,
      timestamp: new Date().toISOString(),
    });
    
    return messageId;
  },
});

// Query to get all message records for a specific user
export const getUserMessages = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const { userId } = args;
    
    return await ctx.db
      .query("messages")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();
  },
});

// Query to get all message records
export const getAllMessages = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("messages")
      .collect();
  },
});
