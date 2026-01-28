// Script to add canonical URLs to all tool pages
// Run with: node scripts/add-canonical-urls.js

const fs = require('fs');
const path = require('path');
const toolsData = require('../data/tools.json');

const toolsDir = path.join(__dirname, '../app/tools');

toolsData.forEach(tool => {
  const toolPath = tool.link.replace('/tools/', '');
  const pageFile = path.join(toolsDir, toolPath, 'page.tsx');
  
  if (fs.existsSync(pageFile)) {
    let content = fs.readFileSync(pageFile, 'utf8');
    
    // Check if canonical already exists
    if (!content.includes('canonical')) {
      // Find the metadata export
      const metadataMatch = content.match(/export const metadata: Metadata = \{([\s\S]*?)\};/);
      if (metadataMatch) {
        const metadataContent = metadataMatch[1];
        
        // Add canonical if not present
        if (!metadataContent.includes('alternates')) {
          const newMetadata = metadataContent.trim() + ',\n  alternates: {\n    canonical: \'https://shabitools.com' + tool.link + '\',\n  },';
          content = content.replace(metadataMatch[0], `export const metadata: Metadata = {${newMetadata}\n};`);
        } else if (!metadataContent.includes('canonical')) {
          // Add canonical to existing alternates
          content = content.replace(
            /alternates: \{([\s\S]*?)\}/,
            `alternates: {$1    canonical: 'https://shabitools.com${tool.link}',\n  }`
          );
        }
        
        fs.writeFileSync(pageFile, content, 'utf8');
        console.log(`✓ Added canonical URL to ${toolPath}`);
      }
    } else {
      console.log(`- Skipped ${toolPath} (already has canonical)`);
    }
  } else {
    console.log(`✗ File not found: ${pageFile}`);
  }
});

console.log('\nDone!');
