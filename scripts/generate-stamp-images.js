const fs = require('fs');
const { createCanvas } = require('canvas');
const path = require('path');

// Ensure the directory exists
const imageDir = path.join(__dirname, '../public/images/stamps');
if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir, { recursive: true });
}

// Colors for different stamp types
const colorMap = {
  'chalon': { bg: '#8B4513', text: '#F5DEB3' }, // Brown/Wheat
  'side-faces': { bg: '#4682B4', text: '#F0F8FF' }, // Steel Blue/Alice Blue
  'pictorials': { bg: '#2E8B57', text: '#F0FFF0' }, // Sea Green/Honeydew
  'penny-black': { bg: '#000000', text: '#FFFFFF' }, // Black/White
  'penny-red': { bg: '#8B0000', text: '#FFE4E1' }, // Dark Red/Misty Rose
  'kangaroo': { bg: '#CD853F', text: '#FFDEAD' }, // Peru/Navajo White
  'default': { bg: '#696969', text: '#F5F5F5' } // Dim Gray/White Smoke
};

// Function to generate a simple stamp image
function generateStampImage(name, series, width = 400, height = 400) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  // Get color scheme based on series or use default
  const seriesKey = Object.keys(colorMap).find(key => series.toLowerCase().includes(key)) || 'default';
  const { bg, text } = colorMap[seriesKey];

  // Draw background
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);
  
  // Draw border (stamp-like perforations)
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 2;
  const dashSize = 8;
  ctx.setLineDash([dashSize, dashSize]);
  ctx.strokeRect(10, 10, width - 20, height - 20);
  
  // Draw a second border
  ctx.strokeStyle = text;
  ctx.lineWidth = 1;
  ctx.setLineDash([]);
  ctx.strokeRect(20, 20, width - 40, height - 40);
  
  // Draw text
  ctx.fillStyle = text;
  ctx.font = 'bold 24px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Split name into lines if too long
  const words = name.split(' ');
  let lines = [];
  let currentLine = '';
  
  words.forEach(word => {
    const testLine = currentLine + (currentLine ? ' ' : '') + word;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > width - 60 && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  });
  lines.push(currentLine);
  
  // Draw each line
  const lineHeight = 30;
  const startY = height / 2 - ((lines.length - 1) * lineHeight) / 2;
  
  lines.forEach((line, i) => {
    ctx.fillText(line, width / 2, startY + i * lineHeight);
  });
  
  // Add series text at bottom
  ctx.font = 'italic 16px serif';
  ctx.fillText(series, width / 2, height - 40);
  
  // Save to file
  const sanitizedName = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const fileName = `${sanitizedName}.png`;
  const out = fs.createWriteStream(path.join(imageDir, fileName));
  const stream = canvas.createPNGStream();
  stream.pipe(out);
  
  return new Promise((resolve, reject) => {
    out.on('finish', () => resolve(fileName));
    out.on('error', reject);
  });
}

// Define stamps to generate from our series
const stampsToGenerate = [
  // Chalons
  { name: '1d Red', series: 'Chalon Heads' },
  { name: '2d Blue', series: 'Chalon Heads' },
  { name: '6d Brown', series: 'Chalon Heads' },
  { name: '1s Green', series: 'Chalon Heads' },
  
  // Specific varieties
  { name: 'Chalon Head Imperforate', series: 'London Print 1d Red' },
  { name: 'Chalon Head with Watermark', series: 'London Print 1d Red' },
  { name: 'Blue with Watermark', series: 'London Print 2d Blue' },
  { name: 'Blue Imperforate', series: 'London Print 2d Blue' },
  
  // Side Faces
  { name: '1d Lilac', series: 'Side Faces' },
  { name: '2d Rose', series: 'Side Faces' },
  { name: 'Lilac Perf 12.5', series: 'First Side Face' },
  { name: 'Lilac Perf 10', series: 'First Side Face' },
  
  // Second Side Faces
  { name: '1d Rose', series: 'Second Side Faces' },
  { name: 'Rose Die 1', series: 'Second Side Faces' },
  { name: 'Rose Die 2', series: 'Second Side Faces' },
  
  // 1898 Pictorials
  { name: '1d Lake Taupo', series: '1898 Pictorials' },
  { name: '2d Pembroke Peak', series: '1898 Pictorials' },
  { name: '9d Pink Terrace', series: '1898 Pictorials' },
  
  // Australia Kangaroo
  { name: '1d Red Kangaroo', series: 'Australia Kangaroo' },
  { name: '2d Grey Kangaroo', series: 'Australia Kangaroo' },
  
  // Penny Black & Relatives
  { name: 'Penny Black', series: 'Great Britain 1840' },
  { name: 'Penny Black Plate 1a', series: 'Great Britain 1840' },
  { name: 'Penny Black Plate 2', series: 'Great Britain 1840' },
  { name: 'Penny Red Imperforate', series: 'Great Britain 1841' }
];

// Generate all stamp images
async function generateAllStamps() {
  console.log('Generating stamp images...');
  
  for (const stamp of stampsToGenerate) {
    try {
      const fileName = await generateStampImage(stamp.name, stamp.series);
      console.log(`Generated: ${fileName}`);
    } catch (err) {
      console.error(`Error generating ${stamp.name}:`, err);
    }
  }
  
  console.log('All stamp images generated!');
}

generateAllStamps(); 