import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Table to store user information
  users: defineTable({
    userId: v.string(), // Unique user ID
    promptCounter: v.number(), // Total number of prompts by this user
  }),

  // Define the conversations table schema
  conversations: defineTable({
    userId: v.string(),
    promptCounter: v.number(),
    prompt: v.string(),
    response: v.string(),
  }),
  
  // Note: sustainability_interactions table has been removed
});
