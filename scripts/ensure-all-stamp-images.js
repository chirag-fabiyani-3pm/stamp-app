const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

// Create directory for images if it doesn't exist
const imageDir = path.join(__dirname, '../public/images/stamps');
if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir, { recursive: true });
}

// Define fallback relationships - if primary image doesn't exist, use fallback
const imageFallbacks = {
  // Main series
  'chalon-heads': 'chalon-head-imperforate',
  '1d-red': 'chalon-head-imperforate',
  '2d-blue': 'blue-imperforate',
  '6d-brown': 'brown-imperforate',
  '1s-green': 'green-imperforate',
  'side-faces': '1d-lilac',
  
  // Variety fallbacks
  'chalon-head-with-watermark': 'chalon-head-imperforate',
  'blue-with-watermark': 'blue-imperforate',
  'brown-script-watermark': 'brown-imperforate',
  'green-with-large-star-watermark': 'green-imperforate',
  
  // Additional variety fallbacks
  'lilac-perf-12-5': '1d-lilac',
  'lilac-perf-10': '1d-lilac',
  'penny-black-plate-1a': 'penny-black',
  'penny-black-plate-2': 'penny-black',
  'penny-red-imperforate': 'penny-black',
  'rose-perf-12-5': '1d-lilac',
  'rose-die-1': '1d-lilac',
  'rose-die-2': '1d-lilac',
  'lake-taupo-blue-brown': '2d-blue',
  'lake-taupo-blue-brown-local-print': '2d-blue',
  'pembroke-peak-lake-rose': '2d-blue',
  'pink-terrace-purple': '2d-blue',
  'pink-terrace-purple-local-print': '2d-blue',
};

// List of essential images we must have
const essentialImages = [
  'chalon-heads',
  '1d-red',
  '2d-blue',
  '6d-brown',
  '1s-green',
  'penny-black',
  'side-faces',
  'chalon-head-imperforate',
  'chalon-head-with-watermark',
  'blue-with-watermark',
  'blue-imperforate',
  'brown-imperforate',
  'brown-script-watermark',
  'green-imperforate',
  'green-with-large-star-watermark',
  '1d-lilac',
  'placeholder'
];

// Function to check if file exists and copy fallback if needed
async function ensureImageExists(imageName) {
  const imagePath = path.join(imageDir, `${imageName}.png`);
  
  // If image exists, no need to do anything
  if (fs.existsSync(imagePath)) {
    console.log(`✓ Image ${imageName}.png exists`);
    return true;
  }
  
  // If image doesn't exist, try to use fallback
  if (imageFallbacks[imageName]) {
    const fallbackName = imageFallbacks[imageName];
    const fallbackPath = path.join(imageDir, `${fallbackName}.png`);
    
    if (fs.existsSync(fallbackPath)) {
      console.log(`! Creating ${imageName}.png from fallback ${fallbackName}.png`);
      
      try {
        // Load the fallback image
        const image = await loadImage(fallbackPath);
        
        // Create a canvas
        const canvas = createCanvas(image.width, image.height);
        const ctx = canvas.getContext('2d');
        
        // Draw the fallback image
        ctx.drawImage(image, 0, 0);
        
        // Add a small text indicating this is a fallback image
        ctx.font = 'italic 10px sans-serif';
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.textAlign = 'end';
        ctx.fillText(`alt: ${imageName}`, image.width - 5, image.height - 5);
        
        // Save to the new file
        const out = fs.createWriteStream(imagePath);
        const stream = canvas.createPNGStream();
        stream.pipe(out);
        
        return new Promise((resolve, reject) => {
          out.on('finish', () => resolve(true));
          out.on('error', reject);
        });
      } catch (error) {
        console.error(`Error creating fallback for ${imageName}:`, error);
        return false;
      }
    } else {
      console.log(`! Fallback ${fallbackName}.png not found for ${imageName}`);
    }
  }
  
  // If we get here, we need to create a placeholder
  console.log(`! Creating placeholder for ${imageName}`);
  return await generatePlaceholderImage(imageName);
}

// Function to generate a placeholder image
async function generatePlaceholderImage(name) {
  const placeholderPath = path.join(imageDir, `${name}.png`);
  
  const canvas = createCanvas(300, 300);
  const ctx = canvas.getContext('2d');
  
  // Draw a colored background based on the stamp type
  let bgColor = '#eee';
  if (name.includes('red')) bgColor = '#ffeeee';
  if (name.includes('blue')) bgColor = '#eeeeff';
  if (name.includes('green')) bgColor = '#eeffee';
  if (name.includes('brown')) bgColor = '#f5e5d5';
  if (name.includes('lilac')) bgColor = '#f5e5ff';
  
  ctx.fillStyle = bgColor;
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
  
  // Add text - convert dash to spaces
  const displayName = name.replace(/-/g, ' ').replace(/(\b\w)/g, c => c.toUpperCase());
  
  // Add the name
  ctx.font = 'bold 24px serif';
  ctx.fillStyle = '#333';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Split name into lines if needed
  const words = displayName.split(' ');
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
  
  // Add 'Stamp Image' text
  ctx.font = 'italic 16px serif';
  ctx.fillText('Stamp Image', 150, 240);
  
  // Save the placeholder image
  const out = fs.createWriteStream(placeholderPath);
  const stream = canvas.createPNGStream();
  stream.pipe(out);
  
  return new Promise((resolve, reject) => {
    out.on('finish', () => {
      console.log(`Generated placeholder for ${name}`);
      resolve(true);
    });
    out.on('error', reject);
  });
}

// Main function to ensure all essential images exist
async function ensureAllImages() {
  console.log('Checking for all essential stamp images...');
  
  // Process all essential images
  for (const imageName of essentialImages) {
    await ensureImageExists(imageName);
  }
  
  // Check for placeholder image
  const placeholderPath = path.join(imageDir, 'placeholder.png');
  if (!fs.existsSync(placeholderPath)) {
    console.log('Creating default placeholder image');
    await generatePlaceholderImage('placeholder');
  }
  
  console.log('All essential stamp images have been checked and created if needed.');
}

// Run the process
ensureAllImages(); 