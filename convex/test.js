import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Test function to manually store break message data
export const testStoreBreakMessage = mutation({
  args: {
    userId: v.string(),
    response: v.string(), // 'continue' or 'break'
  },
  handler: async (ctx, args) => {
    const { userId, response } = args;
    
    // Store the response in the messages_info table
    const id = await ctx.db.insert("messages_info", {
      userId,
      break_message: response, // Store 'continue' or 'break'
    });
    
    return id;
  },
});
