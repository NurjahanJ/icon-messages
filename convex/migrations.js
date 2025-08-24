import { mutation } from "./_generated/server";

// Migration function to clean up messages_info table
// This will remove the fields we don't want anymore
export const migrateMessagesInfo = mutation({
  handler: async (ctx) => {
    // Get all messages_info documents
    const messages = await ctx.db.query("messages_info").collect();
    
    // For each document, create a new one with only the fields we want to keep
    for (const message of messages) {
      const { _id, userId, info_prompt } = message;
      
      // Update the document to only include the fields we want
      await ctx.db.patch(_id, {
        // Keep only these fields
        userId,
        info_prompt,
        
        // Remove these fields by setting them to undefined
        content: undefined,
        isRead: undefined,
        messageId: undefined,
        timestamp: undefined
      });
    }
    
    return { migrated: messages.length };
  }
});
