// Test script to manually store break message data
const { ConvexHttpClient } = require("convex/browser");

// Initialize the Convex client
// Replace with your actual deployment URL from .env.local
const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL || "https://bold-shepherd-872.convex.cloud");

async function testBreakMessage() {
  try {
    // Test with "continue" response
    const continueId = await client.mutation("test:testStoreBreakMessage", {
      userId: "test_user_123",
      response: "continue"
    });
    console.log("Stored 'continue' response with ID:", continueId);
    
    // Test with "break" response
    const breakId = await client.mutation("test:testStoreBreakMessage", {
      userId: "test_user_123",
      response: "break"
    });
    console.log("Stored 'break' response with ID:", breakId);
    
    console.log("Test completed successfully!");
  } catch (error) {
    console.error("Error during test:", error);
  }
}

// Run the test
testBreakMessage();
