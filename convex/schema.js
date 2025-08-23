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
  
  // Table to store message information
  messages_info: defineTable({
    messageId: v.string(), // Unique message ID
    userId: v.string(), // User who sent the message
    content: v.string(), // Message content
    timestamp: v.number(), // When the message was sent
    isRead: v.boolean(), // Whether the message has been read
  }),
});
