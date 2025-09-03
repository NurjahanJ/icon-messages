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
    timestamp: v.optional(v.number()), // Changed from string to number type
  }),
  
  // Table to track sustainability prompt interactions
  message_one: defineTable({
    userId: v.string(), // User ID
    info_message: v.string(), // User's choice for first message (yes/no)
    reword_choice: v.optional(v.string()), // User's choice to reword or continue (optional)
    break_message: v.optional(v.string()), // User's choice for break message (break/continue)
    timestamp: v.optional(v.number()), // Timestamp when the choice was made
  }),
  
  // Add sustainability table to match API endpoints
  sustainability: defineTable({
    userId: v.string(), // User ID
    interactionType: v.string(), // Type of interaction (info_prompt, rewrite_prompt, break_prompt, etc.)
    userChoice: v.string(), // User's choice
    originalPrompt: v.optional(v.string()), // Original prompt for rewritten content
    rewrittenPrompt: v.optional(v.string()), // Rewritten prompt
    rewrittenResponse: v.optional(v.string()), // Response to rewritten prompt
    timestamp: v.optional(v.number()), // Timestamp when the interaction occurred
  }),
});
