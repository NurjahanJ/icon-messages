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
  // Keeping sustainability API endpoints as empty functions to prevent errors
  // These will be handled by placeholder functions in the backend
  sustainability: {
    storeSustainabilityInteraction: "sustainability:storeSustainabilityInteraction",
    getUserSustainabilityInteractions: "sustainability:getUserSustainabilityInteractions",
    getAllSustainabilityInteractions: "sustainability:getAllSustainabilityInteractions",
    getSustainabilityInteractionsByType: "sustainability:getSustainabilityInteractionsByType",
    getSustainabilityInteractionsByChoice: "sustainability:getSustainabilityInteractionsByChoice"
  }
};
