
const fs = require('fs');
const path = require('path');

const content = fs.readFileSync('temp_apps_table.md', 'utf8');
const lines = content.split('\n').filter(line => line.trim() !== '');

// Skip header and separator
const dataLines = lines.slice(2);

const apps = dataLines.map(line => {
  // Remove leading/trailing pipes and split
  const parts = line.split('|').map(p => p.trim());
  // Index 0 is empty because of leading pipe
  // Name | Category | Description | Price | URL | Screenshot URL
  // The split will result in: ["", "Name", "Category", "Description", "Price", "URL", "Screenshot URL", ""]
  // So indices are 1, 2, 3, 4, 5, 6
  
  const name = parts[1];
  const category = parts[2];
  let description = parts[3];
  const price = parts[4];
  const downloadUrl = parts[5];
  const screenshotUrl = parts[6];

  // Clean description (remove surrounding quotes if any)
  if (description.startsWith('"') && description.endsWith('"')) {
    description = description.slice(1, -1);
  }
  // Remove extra pipes within description that might have been split incorrectly?
  // Actually, if description contained pipes, the split would be wrong.
  // But looking at the data: "Blitzit is... | helping you...".
  // The user's markdown table uses pipes as separators. 
  // If the description itself has pipes, the split by '|' will break the description into multiple parts.
  // I need to be careful.
  // The markdown table format usually escapes pipes or uses code blocks, but here it seems raw.
  // However, looking at the row: 
  // | Blitzit | Productivity Tracker | "Blitzit... | helping you... | ... " | Free | ...
  // It seems the description contains pipes!
  // So I should take the first 2 columns as Name, Category.
  // And the last 3 columns as Price, URL, Screenshot URL.
  // Everything in between is Description.
  
  const nameIdx = 1;
  const categoryIdx = 2;
  const priceIdx = parts.length - 3; // 2nd to last (empty), 3rd to last is screenshot, 4th is url, 5th is price
  // Wait, parts array length:
  // | Name | Cat | Desc | Price | URL | Screen |
  // ["", "Name", "Cat", "Desc", "Price", "URL", "Screen", ""] -> length 8.
  // If desc has pipes: ["", "Name", "Cat", "Desc Part 1", "Desc Part 2", "Price", "URL", "Screen", ""]
  
  const realName = parts[1];
  const realCategory = parts[2];
  const realScreenshotUrl = parts[parts.length - 2];
  const realDownloadUrl = parts[parts.length - 3];
  const realPrice = parts[parts.length - 4];
  
  // Description is everything from index 3 to parts.length - 4
  const descParts = parts.slice(3, parts.length - 4);
  let realDescription = descParts.join(', '); // Join with comma instead of pipe for cleaner text
  
  if (realDescription.startsWith('"') && realDescription.endsWith('"')) {
    realDescription = realDescription.slice(1, -1);
  }

  return {
    name: realName,
    category: realCategory,
    description: realDescription,
    price: realPrice,
    downloadUrl: realDownloadUrl,
    screenshotUrl: realScreenshotUrl
  };
});

console.log(JSON.stringify(apps, null, 2));
