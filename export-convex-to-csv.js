// Script to export Convex data to CSV files using Convex CLI
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
require("dotenv").config();

// Directory to save CSV files
const outputDir = path.join(__dirname, "convex_data");

// Ensure the output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Function to run Convex CLI commands
function runConvexCommand(command) {
  try {
    console.log(`Running: npx convex ${command}`);
    return execSync(`npx convex ${command}`, { encoding: 'utf8' });
  } catch (error) {
    console.error(`Error running Convex command: ${command}`);
    console.error(error.message);
    return null;
  }
}

// Export tables to CSV files
async function exportTables() {
  try {
    console.log('Starting export of Convex data to CSV...');
    
    // Export users table
    console.log('Exporting users table...');
    runConvexCommand('export users --to-csv ' + path.join(outputDir, 'users.csv'));
    
    // Export conversations table
    console.log('Exporting conversations table...');
    runConvexCommand('export conversations --to-csv ' + path.join(outputDir, 'conversations.csv'));
    
    // Export message_one table
    console.log('Exporting message_one table...');
    runConvexCommand('export message_one --to-csv ' + path.join(outputDir, 'message_one.csv'));
    
    console.log('Export completed successfully!');
  } catch (error) {
    console.error('Error exporting data:', error);
    process.exit(1);
  }
}

// Run the export
exportTables();
function convertToCSV(data) {
  if (data.length === 0) {
    return "";
  }

  // Get headers from the first object
  const headers = Object.keys(data[0]);
  
  // Create CSV header row
  const csvRows = [headers.join(",")];
  
  // Add data rows
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      // Handle different data types
      if (value === null || value === undefined) {
        return "";
      } else if (typeof value === "string") {
        // Escape quotes and wrap in quotes
        return `"${value.replace(/"/g, '""')}"`;
      } else if (value instanceof Date) {
        return `"${value.toLocaleString()}"`;
      } else if (typeof value === "object") {
        // Convert objects to JSON strings
        return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
      }
      return value;
    });
    csvRows.push(values.join(","));
  }
  
  return csvRows.join("\n");
}

// Save data to CSV file
function saveToCSV(data, filename) {
  const csvData = convertToCSV(data);
  const filePath = path.join(outputDir, filename);
  
  fs.writeFileSync(filePath, csvData);
  console.log(`Exported ${data.length} records to ${filePath}`);
}

// Export tables
async function exportTables() {
  try {
    console.log("Starting export of Convex data to CSV...");
    
    // Export users table
    console.log("Exporting users table...");
    const users = await client.query(api.users.getAllUsers);
    saveToCSV(users, "users.csv");
    
    // Export conversations table
    console.log("Exporting conversations table...");
    const conversations = await client.query(api.conversations.getAllConversations);
    saveToCSV(conversations, "conversations.csv");
    
    // Export message_one table
    console.log("Exporting message_one table...");
    const messageOne = await client.query(api.message_one.getAllMessages);
    saveToCSV(messageOne, "message_one.csv");
    
    console.log("Export completed successfully!");
  } catch (error) {
    console.error("Error exporting data:", error);
    process.exit(1);
  }
}

// Run the export
exportTables();
