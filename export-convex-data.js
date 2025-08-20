// Script to export Convex data to CSV files
const { ConvexHttpClient } = require("convex/browser");
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// Helper function to convert object to CSV
function objectToCSV(data) {
  if (data.length === 0) {
    return '';
  }
  
  // Get headers from the first object
  const headers = Object.keys(data[0]);
  
  // Create CSV header row
  const csvRows = [headers.join(',')];
  
  // Add data rows
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      // Handle different data types and escape quotes in strings
      if (value === null || value === undefined) {
        return '';
      } else if (typeof value === 'string') {
        // Wrap strings in quotes and escape existing quotes
        return `"${value.replace(/"/g, '""')}"`;
      } else {
        return value;
      }
    });
    csvRows.push(values.join(','));
  }
  
  return csvRows.join('\n');
}

async function exportConvexData() {
  // Get the Convex URL from environment variables
  const convexUrl = process.env.REACT_APP_CONVEX_URL;
  
  if (!convexUrl) {
    console.error("Error: REACT_APP_CONVEX_URL not found in environment variables");
    process.exit(1);
  }

  console.log("Connecting to Convex...");
  const client = new ConvexHttpClient(convexUrl);

  try {
    // Export users table
    console.log("Exporting users table...");
    const users = await client.query("users:getAllUsers");
    
    if (users.length === 0) {
      console.log("No users found to export.");
    } else {
      console.log(`Found ${users.length} users to export.`);
      const usersCSV = objectToCSV(users);
      fs.writeFileSync(path.join(__dirname, 'users.csv'), usersCSV);
      console.log("Users exported successfully to users.csv");
    }

    // Export conversations table
    console.log("Exporting conversations table...");
    const conversations = await client.query("conversations:getAllConversations");
    
    if (conversations.length === 0) {
      console.log("No conversations found to export.");
    } else {
      console.log(`Found ${conversations.length} conversations to export.`);
      const conversationsCSV = objectToCSV(conversations);
      fs.writeFileSync(path.join(__dirname, 'conversations.csv'), conversationsCSV);
      console.log("Conversations exported successfully to conversations.csv");
    }

    // Export sustainability_interactions table
    console.log("Exporting sustainability interactions table...");
    const interactions = await client.query("sustainability:getAllSustainabilityInteractions");
    
    if (interactions.length === 0) {
      console.log("No sustainability interactions found to export.");
    } else {
      console.log(`Found ${interactions.length} sustainability interactions to export.`);
      const interactionsCSV = objectToCSV(interactions);
      fs.writeFileSync(path.join(__dirname, 'sustainability_interactions.csv'), interactionsCSV);
      console.log("Sustainability interactions exported successfully to sustainability_interactions.csv");
    }

    console.log("All data exported successfully!");
  } catch (error) {
    console.error("Error exporting data:", error);
  }
}

exportConvexData().catch(console.error);
