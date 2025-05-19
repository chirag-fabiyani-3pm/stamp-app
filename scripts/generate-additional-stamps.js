const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// Create directory for images if it doesn't exist
const imageDir = path.join(__dirname, '../public/images/stamps');
if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir, { recursive: true });
}

// Additional stamp images to generate
const additionalStamps = [
  {
    name: 'Chalon Head Imperforate',
    description: '1855 London Print'
  },
  {
    name: 'Chalon Head with Watermark',
    description: '1855 London Print'
  },
  {
    name: 'Blue with Watermark',
    description: 'London Print'
  },
  {
    name: 'Blue Imperforate',
    description: 'London Print'
  },
  {
    name: 'Brown Imperforate',
    description: 'London Print'
  },
  {
    name: 'Brown Script Watermark',
    description: 'London Print'
  },
  {
    name: 'Green Imperforate',
    description: 'London Print'
  },
  {
    name: 'Green with Large Star Watermark',
    description: 'London Print'
  },
  {
    name: '1s Green',
    description: 'Chalon 1s Green'
  },
  {
    name: '1d Lilac',
    description: 'Side Face 1d Lilac'
  }
];

// Function to generate a placeholder image
async function generatePlaceholderImage(name, description) {
  const sanitizedName = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const placeholderPath = path.join(imageDir, `${sanitizedName}.png`);
  
  // Check if the file already exists
  if (fs.existsSync(placeholderPath)) {
    console.log(`Image for ${name} already exists - skipping`);
    return placeholderPath;
  }
  
  const canvas = createCanvas(300, 300);
  const ctx = canvas.getContext('2d');
  
  // Draw a placeholder background
  ctx.fillStyle = '#ddd';
  ctx.fillRect(0, 0, 300, 300);
  
  // Draw a stamp-like perforation border
  ctx.strokeStyle = '#555';
  ctx.lineWidth = 2;
  const dashSize = 8;
  ctx.setLineDash([dashSize, dashSize]);
  ctx.strokeRect(10, 10, 280, 280);
  
  // Draw a solid inner border
  ctx.strokeStyle = '#777';
  ctx.lineWidth = 1;
  ctx.setLineDash([]);
  ctx.strokeRect(20, 20, 260, 260);
  
  // Add the name
  ctx.font = 'bold 24px serif';
  ctx.fillStyle = '#333';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Split name into lines if needed
  const words = name.split(' ');
  let lines = [];
  let currentLine = '';
  
  words.forEach(word => {
    const testLine = currentLine + (currentLine ? ' ' : '') + word;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > 240 && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  });
  lines.push(currentLine);
  
  // Draw each line
  const lineHeight = 30;
  const startY = 150 - ((lines.length - 1) * lineHeight) / 2;
  
  lines.forEach((line, i) => {
    ctx.fillText(line, 150, startY + i * lineHeight);
  });
  
  // Add description at bottom
  if (description) {
    ctx.font = 'italic 16px serif';
    ctx.fillText(description, 150, 260);
  }
  
  // Save the placeholder image
  const out = fs.createWriteStream(placeholderPath);
  const stream = canvas.createPNGStream();
  stream.pipe(out);
  
  return new Promise((resolve, reject) => {
    out.on('finish', () => {
      console.log(`Generated placeholder for ${name}`);
      resolve(placeholderPath);
    });
    out.on('error', reject);
  });
}

// Generate all the additional stamp images
async function generateAllAdditionalImages() {
  console.log('Generating additional stamp images...');
  
  for (const stamp of additionalStamps) {
    try {
      await generatePlaceholderImage(stamp.name, stamp.description);
    } catch (error) {
      console.error(`Failed to generate image for ${stamp.name}:`, error);
    }
  }
  
  console.log('All additional stamp images generated!');
}

// Run the image generation
generateAllAdditionalImages(); 