// Script to export Convex data to CSV files
const { ConvexHttpClient } = require("convex/browser");
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Get the Convex URL from environment variables
const convexUrl = process.env.REACT_APP_CONVEX_URL || process.env.CONVEX_URL;

if (!convexUrl) {
  console.error("Error: CONVEX_URL or REACT_APP_CONVEX_URL environment variable not set");
  process.exit(1);
}

// Initialize Convex client
const client = new ConvexHttpClient(convexUrl);

// Create the export directory if it doesn't exist
const exportDir = path.join(__dirname, 'convex_data');
if (!fs.existsSync(exportDir)) {
  fs.mkdirSync(exportDir, { recursive: true });
}

// Function to convert data to CSV format
function convertToCSV(data) {
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
      // Handle different data types
      if (value === null || value === undefined) {
        return '';
      } else if (typeof value === 'string') {
        // Escape quotes and wrap in quotes
        return `"${value.replace(/"/g, '""')}"`;
      } else if (typeof value === 'object') {
        // Convert objects to JSON strings
        return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
      }
      return value;
    });
    csvRows.push(values.join(','));
  }
  
  return csvRows.join('\n');
}

// Function to write data to a CSV file
function writeToCSV(data, filename) {
  const csvData = convertToCSV(data);
  const filePath = path.join(exportDir, filename);
  
  fs.writeFileSync(filePath, csvData);
  console.log(`✅ Exported ${data.length} records to ${filePath}`);
}

// Main export function
async function exportConvexData() {
  try {
    console.log("Starting Convex data export...");
    
    // Export conversations table
    console.log("Exporting conversations...");
    const conversations = await client.query("conversations:getAllConversations");
    writeToCSV(conversations, 'conversations.csv');
    
    // Export message_one table
    console.log("Exporting message_one data...");
    const messageChoices = await client.query("message_one:getAllMessageChoices");
    writeToCSV(messageChoices, 'message_one.csv');
    
    // Export users table if it exists
    try {
      console.log("Exporting users...");
      const allUsers = await client.query("users:getAllUsers");
      
      // Filter out users with zero prompts
      const usersWithPrompts = allUsers.filter(user => {
        // Check if promptCounter exists and is greater than 0
        return user.promptCounter && user.promptCounter > 0;
      });
      
      console.log(`Filtered out ${allUsers.length - usersWithPrompts.length} users with zero prompts`);
      writeToCSV(usersWithPrompts, 'users.csv');
    } catch (error) {
      console.log("Note: Users table export failed. This may be expected if the table or query doesn't exist.");
    }
    
    console.log("✅ Convex data export completed successfully!");
  } catch (error) {
    console.error("Error exporting Convex data:", error);
  }
}

// Run the export
exportConvexData().catch(console.error);
