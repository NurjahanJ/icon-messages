import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Store the user's choice for the info message (yes/no)
export const storeInfoMessageChoice = mutation({
  args: { 
    userId: v.string(),
    info_message: v.string() // "yes" or "no"
  },
  handler: async (ctx, args) => {
    const { userId, info_message } = args;
    
    // Store the user's choice
    const id = await ctx.db.insert("message_one", {
      userId,
      info_message
    });
    
    return id;
  }
});

// Update or store the user's choice for rewording (reword/continue)
export const storeRewordChoice = mutation({
  args: { 
    userId: v.string(),
    messageId: v.optional(v.id("message_one")), // Optional ID of existing record
    reword_choice: v.string() // "reword" or "continue"
  },
  handler: async (ctx, args) => {
    const { userId, messageId, reword_choice } = args;
    
    if (messageId) {
      // Update existing record
      await ctx.db.patch(messageId, {
        reword_choice
      });
      return messageId;
    } else {
      // Find the most recent record for this user without a reword_choice
      const recentMessages = await ctx.db
        .query("message_one")
        .filter(q => q.eq(q.field("userId"), userId))
        .order("desc")
        .take(1);
      
      if (recentMessages.length > 0) {
        const recentMessage = recentMessages[0];
        await ctx.db.patch(recentMessage._id, {
          reword_choice
        });
        return recentMessage._id;
      } else {
        // Create a new record if no existing record found
        return await ctx.db.insert("message_one", {
          userId,
          info_message: "unknown", // Default value since we don't know
          reword_choice
        });
      }
    }
  }
});

// Get all message choices for a specific user
export const getUserMessageChoices = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("message_one")
      .filter(q => q.eq(q.field("userId"), args.userId))
      .order("desc")
      .collect();
  }
});

// Store the user's choice for the break message (break/continue)
export const storeBreakMessageChoice = mutation({
  args: { 
    userId: v.string(),
    messageId: v.optional(v.id("message_one")), // Optional ID of existing record
    break_message: v.string() // "break" or "continue"
  },
  handler: async (ctx, args) => {
    const { userId, messageId, break_message } = args;
    
    if (messageId) {
      // Update existing record
      await ctx.db.patch(messageId, {
        break_message
      });
      return messageId;
    } else {
      // Find the most recent record for this user
      const recentMessages = await ctx.db
        .query("message_one")
        .filter(q => q.eq(q.field("userId"), userId))
        .order("desc")
        .take(1);
      
      if (recentMessages.length > 0) {
        const recentMessage = recentMessages[0];
        await ctx.db.patch(recentMessage._id, {
          break_message
        });
        return recentMessage._id;
      } else {
        // Create a new record if no existing record found
        return await ctx.db.insert("message_one", {
          userId,
          info_message: "unknown", // Default value since we don't know
          break_message
        });
      }
    }
  }
});

// Get all message choices (admin function)
export const getAllMessageChoices = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("message_one")
      .order("desc")
      .collect();
  }
});
