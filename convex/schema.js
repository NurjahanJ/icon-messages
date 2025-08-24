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
  
  // New table to track sustainability prompt interactions
  message_one: defineTable({
    userId: v.string(), // User ID
    info_message: v.string(), // User's choice for first message (yes/no)
    reword_choice: v.optional(v.string()), // User's choice to reword or continue (optional)
    break_message: v.optional(v.string()), // User's choice for break message (break/continue)
  }),
  
  // messages_info table has been removed
});
