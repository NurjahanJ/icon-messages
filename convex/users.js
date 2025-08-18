import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { nanoid } from "nanoid";

// Create a new user or retrieve existing user ID from storage
export const getOrCreateUser = mutation({
  args: { existingUserId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    // If an existing user ID is provided, check if it exists in the database
    if (args.existingUserId) {
      const existingUser = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("userId"), args.existingUserId))
        .first();
      
      // If the user exists, return their ID
      if (existingUser) {
        return existingUser.userId;
      }
    }
    
    // If no existing user or user not found, generate a unique ID
    const userId = nanoid(10);
    
    // Store the user in the database
    await ctx.db.insert("users", {
      userId,
      promptCounter: 0, // Initialize prompt counter
    });
    
    return userId;
  },
});

// Get user by ID
export const getUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();
  },
});

// Increment a user's prompt count
export const incrementPromptCount = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();
    
    if (!user) {
      throw new Error(`User with ID ${args.userId} not found`);
    }
    
    await ctx.db.patch(user._id, {
      promptCounter: (user.promptCounter || 0) + 1,
    });
    
    return user._id;
  },
});

// Get all users (admin function)
export const getAllUsers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("users")
      .collect();
  },
});
