const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { createObjectCsvWriter } = require('csv-writer');

// Directory containing CSV files
const csvDir = path.join(__dirname, 'convex_data');

// Function to format timestamp to mm/dd/yyyy, hour:minute AM/PM
function formatTimestamp(timestamp) {
  const date = new Date(Number(timestamp));
  
  const month = date.getMonth() + 1; // getMonth() returns 0-11
  const day = date.getDate();
  const year = date.getFullYear();
  
  let hour = date.getHours();
  const minute = date.getMinutes();
  const ampm = hour >= 12 ? 'PM' : 'AM';
  
  // Convert to 12-hour format
  hour = hour % 12;
  hour = hour ? hour : 12; // the hour '0' should be '12'
  
  // Add leading zero to minutes if needed
  const formattedMinute = minute < 10 ? '0' + minute : minute;
  
  return `${month}/${day}/${year}, ${hour}:${formattedMinute} ${ampm}`;
}

// Process a single CSV file
async function processFile(filePath) {
  console.log(`Processing ${filePath}...`);
  
  const rows = [];
  const headers = [];
  let firstRow = true;
  
  // Read the CSV file
  await new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('headers', (headerList) => {
        headers.push(...headerList);
      })
      .on('data', (row) => {
        // Convert _creationTime if it exists
        if (row._creationTime) {
          // Check if it's already in date format or still a timestamp
          if (!isNaN(Number(row._creationTime))) {
            // It's a numeric timestamp
            row._creationTime = formatTimestamp(row._creationTime);
          } else if (typeof row._creationTime === 'string' && row._creationTime.includes('/')) {
            // It's already in date format, but needs to be converted to AM/PM
            // Extract the timestamp parts
            const parts = row._creationTime.split(', ');
            if (parts.length === 2) {
              const datePart = parts[0];
              const timePart = parts[1];
              
              // Parse the time
              const [hours, minutes] = timePart.split(':').map(Number);
              
              // Convert to AM/PM format
              const ampm = hours >= 12 ? 'PM' : 'AM';
              const hour12 = hours % 12 || 12;
              const formattedMinute = minutes < 10 ? '0' + minutes : minutes;
              
              row._creationTime = `${datePart}, ${hour12}:${formattedMinute} ${ampm}`;
            }
          }
        }
        
        // Also convert any field named 'timestamp' if it exists
        if (row.timestamp) {
          // Check if it's already in date format or still a timestamp
          if (!isNaN(Number(row.timestamp))) {
            // It's a numeric timestamp
            row.timestamp = formatTimestamp(row.timestamp);
          } else if (typeof row.timestamp === 'string' && row.timestamp.includes('/')) {
            // It's already in date format, but needs to be converted to AM/PM
            // Extract the timestamp parts
            const parts = row.timestamp.split(', ');
            if (parts.length === 2) {
              const datePart = parts[0];
              const timePart = parts[1];
              
              // Parse the time
              const [hours, minutes] = timePart.split(':').map(Number);
              
              // Convert to AM/PM format
              const ampm = hours >= 12 ? 'PM' : 'AM';
              const hour12 = hours % 12 || 12;
              const formattedMinute = minutes < 10 ? '0' + minutes : minutes;
              
              row.timestamp = `${datePart}, ${hour12}:${formattedMinute} ${ampm}`;
            }
          }
        }
        
        rows.push(row);
      })
      .on('end', resolve)
      .on('error', reject);
  });
  
  // Write the modified data back to the file
  const csvWriter = createObjectCsvWriter({
    path: filePath,
    header: headers.map(header => ({ id: header, title: header })),
  });
  
  await csvWriter.writeRecords(rows);
  console.log(`Finished processing ${filePath}`);
}

// Process all CSV files in the directory
async function processAllFiles() {
  try {
    const files = fs.readdirSync(csvDir);
    
    for (const file of files) {
      if (path.extname(file).toLowerCase() === '.csv') {
        await processFile(path.join(csvDir, file));
      }
    }
    
    console.log('All CSV files have been processed successfully!');
  } catch (error) {
    console.error('Error processing CSV files:', error);
  }
}

// Run the script
processAllFiles();
