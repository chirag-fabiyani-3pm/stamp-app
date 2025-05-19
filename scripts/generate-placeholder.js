const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// Create directory for images if it doesn't exist
const imageDir = path.join(__dirname, '../public/images/stamps');
if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir, { recursive: true });
}

// Function to generate a default placeholder image
async function generateDefaultPlaceholder() {
  const placeholderPath = path.join(imageDir, 'placeholder.png');
  
  // Check if the file already exists
  if (fs.existsSync(placeholderPath)) {
    console.log('Default placeholder already exists - skipping');
    return placeholderPath;
  }
  
  const canvas = createCanvas(300, 300);
  const ctx = canvas.getContext('2d');
  
  // Draw a placeholder background
  ctx.fillStyle = '#eee';
  ctx.fillRect(0, 0, 300, 300);
  
  // Draw a stamp-like perforation border
  ctx.strokeStyle = '#999';
  ctx.lineWidth = 2;
  const dashSize = 8;
  ctx.setLineDash([dashSize, dashSize]);
  ctx.strokeRect(10, 10, 280, 280);
  
  // Draw a solid inner border
  ctx.strokeStyle = '#777';
  ctx.lineWidth = 1;
  ctx.setLineDash([]);
  ctx.strokeRect(20, 20, 260, 260);
  
  // Add text
  ctx.font = 'bold 24px serif';
  ctx.fillStyle = '#555';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Stamp Image', 150, 120);
  ctx.fillText('Coming Soon', 150, 160);
  
  // Add description
  ctx.font = 'italic 16px serif';
  ctx.fillText('Stamps of Approval', 150, 240);
  
  // Save the placeholder image
  const out = fs.createWriteStream(placeholderPath);
  const stream = canvas.createPNGStream();
  stream.pipe(out);
  
  return new Promise((resolve, reject) => {
    out.on('finish', () => {
      console.log('Generated default placeholder image');
      resolve(placeholderPath);
    });
    out.on('error', reject);
  });
}

// Generate the default placeholder
generateDefaultPlaceholder().then(() => {
  console.log('Default placeholder generation complete');
}).catch(error => {
  console.error('Error generating default placeholder:', error);
}); 