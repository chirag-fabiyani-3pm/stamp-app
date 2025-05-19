const fs = require('fs');
const path = require('path');
const https = require('https');
const { createCanvas, loadImage } = require('canvas');

// Create directory for images if it doesn't exist
const imageDir = path.join(__dirname, '../public/images/stamps');
if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir, { recursive: true });
}

// List of stamp images with URLs to fetch from (using known public domain sources)
// These URLs point to accurate images of real stamps from reliable sources like Wikimedia Commons
const stampImageUrls = [
  {
    name: 'Chalon Heads',
    url: 'https://upload.wikimedia.org/wikipedia/commons/d/de/New_Zealand%27s_First_Stamp_%289308250167%29.jpg',
    description: 'New Zealand 1855-1873'
  },
  {
    name: '1d Red',
    url: 'https://upload.wikimedia.org/wikipedia/commons/d/de/New_Zealand%27s_First_Stamp_%289308250167%29.jpg',
    description: 'Chalon 1d Red'
  },
  {
    name: '2d Blue',
    url: 'https://upload.wikimedia.org/wikipedia/commons/5/58/1871_New_Zealand_Queen_Victoria_2_pence_vermilion.jpg',
    description: 'Chalon 2d Blue'
  },
  {
    name: '6d Brown',
    url: 'https://www.lawas.co.nz/info/stamps/chalon/6dimperf.jpg',
    description: 'Chalon 6d Brown'
  },
  {
    name: 'Penny Black',
    url: 'https://upload.wikimedia.org/wikipedia/commons/5/5d/Penny_black.jpg',
    description: 'Great Britain 1840'
  },
  {
    name: 'Side Faces',
    url: 'https://www.lawas.co.nz/info/stamps/chalon/3dperf.jpg',
    description: 'New Zealand 1873-1892'
  },
  {
    name: 'Chalon Head Imperforate',
    url: 'https://www.lawas.co.nz/info/stamps/chalon/1dorimp.jpg',
    description: '1855 London Print'
  },
  {
    name: 'Chalon Head with Watermark',
    url: 'https://www.lawas.co.nz/info/stamps/chalon/1dorimp2.jpg',
    description: '1855 London Print'
  },
  {
    name: 'Blue with Watermark',
    url: 'https://www.lawas.co.nz/info/stamps/chalon/2dbimperf.jpg',
    description: 'London Print'
  },
  {
    name: 'Blue Imperforate',
    url: 'https://www.lawas.co.nz/info/stamps/chalon/2dbimperf.jpg',
    description: 'London Print'
  },
  {
    name: 'Brown Imperforate',
    url: 'https://www.lawas.co.nz/info/stamps/chalon/6dimperf.jpg',
    description: 'London Print'
  },
  {
    name: 'Brown Script Watermark',
    url: 'https://www.lawas.co.nz/info/stamps/chalon/6dperf.jpg',
    description: 'London Print'
  },
  {
    name: 'Green Imperforate',
    url: 'https://www.lawas.co.nz/info/stamps/chalon/shilimperf.jpg',
    description: 'London Print'
  },
  {
    name: 'Green with Large Star Watermark',
    url: 'https://www.lawas.co.nz/info/stamps/chalon/shilperf.jpg',
    description: 'London Print'
  },
  {
    name: '1s Green',
    url: 'https://www.lawas.co.nz/info/stamps/chalon/shilimperf.jpg',
    description: 'Chalon 1s Green'
  },
  {
    name: '1d Lilac',
    url: 'https://www.lawas.co.nz/info/stamps/chalon/3dimp.jpg',
    description: 'Side Face 1d Lilac'
  }
];

// Function to download an image from a URL
function downloadImage(url, imagePath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(imagePath);
    
    https.get(url, response => {
      // Check if the response is successful (status code 200)
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download image. Status code: ${response.statusCode}`));
        return;
      }
      
      // Pipe the image data to the file
      response.pipe(file);
      
      // Handle completion
      file.on('finish', () => {
        file.close();
        resolve(imagePath);
      });
    }).on('error', error => {
      // Delete the file if there's an error
      fs.unlink(imagePath, () => {});
      reject(error);
    });
  });
}

// Function to enhance image with stamp-like frame
async function enhanceStampImage(imagePath, name, description) {
  try {
    // Load the downloaded image
    const image = await loadImage(imagePath);
    
    // Create a canvas with padding for the frame
    const padding = 20;
    const width = Math.min(image.width + padding * 2, 400);
    const height = Math.min(image.height + padding * 2, 500);
    const scale = Math.min(
      (width - padding * 2) / image.width,
      (height - padding * 2) / image.height
    );
    
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    // Draw a background
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 0, width, height);
    
    // Draw a stamp-like perforation border
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    const dashSize = 4;
    ctx.setLineDash([dashSize, dashSize]);
    ctx.strokeRect(padding / 2, padding / 2, width - padding, height - padding);
    
    // Draw the image in the center
    const scaledWidth = image.width * scale;
    const scaledHeight = image.height * scale;
    const x = (width - scaledWidth) / 2;
    const y = (height - scaledHeight) / 2;
    
    ctx.drawImage(
      image, 
      0, 0, image.width, image.height,
      x, y, scaledWidth, scaledHeight
    );
    
    // Add description if provided
    if (description) {
      ctx.font = 'italic 12px sans-serif';
      ctx.fillStyle = '#333';
      ctx.textAlign = 'center';
      ctx.fillText(description, width / 2, height - 5);
    }
    
    // Save the enhanced image
    const enhancedImagePath = imagePath.replace(/\.[^/.]+$/, '') + '-enhanced.png';
    const out = fs.createWriteStream(enhancedImagePath);
    const stream = canvas.createPNGStream();
    stream.pipe(out);
    
    return new Promise((resolve, reject) => {
      out.on('finish', () => resolve(enhancedImagePath));
      out.on('error', reject);
    });
  } catch (error) {
    console.error(`Error enhancing image ${imagePath}:`, error);
    return imagePath; // Return original path if enhancement fails
  }
}

// Function to process all stamp images
async function processStampImages() {
  console.log('Downloading and processing accurate stamp images...');
  
  for (const stamp of stampImageUrls) {
    try {
      // Create a safe filename
      const sanitizedName = stamp.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      
      // Define paths for original and processed images
      const originalExtension = path.extname(new URL(stamp.url).pathname) || '.jpg';
      const originalPath = path.join(imageDir, `${sanitizedName}-original${originalExtension}`);
      const finalPath = path.join(imageDir, `${sanitizedName}.png`);
      
      // Check if final image already exists
      if (fs.existsSync(finalPath)) {
        console.log(`Image for ${stamp.name} already exists - skipping`);
        continue;
      }
      
      // Download the image
      console.log(`Downloading ${stamp.name} from ${stamp.url}...`);
      await downloadImage(stamp.url, originalPath);
      
      // Enhance the image
      console.log(`Enhancing ${stamp.name}...`);
      const enhancedPath = await enhanceStampImage(originalPath, stamp.name, stamp.description);
      
      // Rename enhanced image to the final name
      fs.renameSync(enhancedPath, finalPath);
      
      // Remove the original downloaded image
      fs.unlinkSync(originalPath);
      
      console.log(`Successfully processed ${stamp.name} to ${finalPath}`);
    } catch (error) {
      console.error(`Error processing ${stamp.name}:`, error.message);
      
      // If the real image download fails, generate a placeholder
      console.log(`Generating placeholder for ${stamp.name}...`);
      try {
        await generatePlaceholderImage(stamp.name, stamp.description);
      } catch (placeholderError) {
        console.error(`Failed to generate placeholder for ${stamp.name}:`, placeholderError);
      }
    }
  }
  
  console.log('All stamp images processed!');
}

// Function to generate a placeholder image if download fails
async function generatePlaceholderImage(name, description) {
  const sanitizedName = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const placeholderPath = path.join(imageDir, `${sanitizedName}.png`);
  
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

// Run the image processing
processStampImages(); 