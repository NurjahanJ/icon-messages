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

  // Table to track sustainability interactions
  sustainability_interactions: defineTable({
    userId: v.string(), // User ID
    interactionType: v.string(), // Type of interaction: "info_prompt", "rewrite_prompt", "break_prompt"
    userChoice: v.string(), // User's choice: "yes", "no", "continue", "rewrite", "take_break"
    originalPrompt: v.optional(v.string()), // Original prompt if applicable
    rewrittenPrompt: v.optional(v.string()), // Rewritten prompt if applicable
    rewrittenResponse: v.optional(v.string()), // Response to rewritten prompt if applicable
    timestamp: v.number(), // Timestamp of the interaction
  }),
});
