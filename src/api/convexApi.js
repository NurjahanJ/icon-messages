// This file re-exports the Convex API for use in the frontend
// It serves as a bridge between the frontend and the Convex backend

// Create a mock API object that matches the structure of the Convex API
export const api = {
  users: {
    getOrCreateUser: "users:getOrCreateUser",
    getUser: "users:getUser",
    incrementPromptCount: "users:incrementPromptCount",
    getAllUsers: "users:getAllUsers"
  },
  conversations: {
    storeConversation: "conversations:storeConversation",
    getUserConversations: "conversations:getUserConversations",
    getAllConversations: "conversations:getAllConversations"
  },
  messages: {
    storeSustainabilityChoice: "messages:storeSustainabilityChoice",
    storeRewordChoice: "messages:storeRewordChoice",
    storeRewordedPrompt: "messages:storeRewordedPrompt",
    storeBreakChoice: "messages:storeBreakChoice",
    getUserMessages: "messages:getUserMessages",
    getAllMessages: "messages:getAllMessages"
  }
};
