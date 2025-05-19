const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const inputSvg = path.join(__dirname, '../public/logo.svg');
const outputDir = path.join(__dirname, '../public/icons');
const tempPng = path.join(outputDir, 'logo.png');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// First convert SVG to PNG at maximum size (512x512)
sharp(inputSvg)
    .resize(512, 512)
    .png()
    .toFile(tempPng)
    .then(() => {
        console.log('Converted SVG to PNG');
        
        // Generate all icon sizes
        return Promise.all(sizes.map(size => 
            sharp(tempPng)
                .resize(size, size)
                .toFile(path.join(outputDir, `icon-${size}x${size}.png`))
                .then(() => console.log(`Generated ${size}x${size} icon`))
                .catch(err => console.error(`Error generating ${size}x${size} icon:`, err))
        ));
    })
    .then(() => {
        // Clean up temporary PNG file
        fs.unlinkSync(tempPng);
        console.log('Icon generation complete!');
    })
    .catch(err => {
        console.error('Error in icon generation:', err);
    }); 