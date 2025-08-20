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
  
  // Define the messages table schema for tracking user interactions with sustainability prompts
  messages: defineTable({
    userId: v.string(), // User ID
    sustainabilityChoice: v.optional(v.string()), // 'yes' or 'no' for first sustainability prompt
    rewordOrContinue: v.optional(v.string()), // 'reword' or 'continue' for the second prompt
    ogPrompt: v.optional(v.string()), // Original 3rd prompt that gets replaced
    rewordedPrompt: v.optional(v.string()), // Reworded prompt if user chose to reword
    breakMessage: v.optional(v.string()), // 'continue' or 'break' for the 8th prompt
    timestamp: v.string(), // When the interaction happened
  }),
});
