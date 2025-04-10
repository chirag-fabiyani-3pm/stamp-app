const fs = require("fs")
const path = require("path")
const { createCanvas } = require("canvas")

// Create the pwa directory if it doesn't exist
const pwaDir = path.join(__dirname, "../public/pwa")
if (!fs.existsSync(pwaDir)) {
  fs.mkdirSync(pwaDir, { recursive: true })
}

// Icon sizes to generate
const sizes = [72, 96, 128, 144, 152, 192, 384, 512]

// Function to generate a simple icon
function generateIcon(size) {
  const canvas = createCanvas(size, size)
  const ctx = canvas.getContext("2d")

  // Background
  ctx.fillStyle = "#f4831f"
  ctx.fillRect(0, 0, size, size)

  // Simple stamp design
  const padding = size * 0.15
  const innerSize = size - padding * 2

  // Outer border
  ctx.strokeStyle = "#ffffff"
  ctx.lineWidth = size * 0.03
  ctx.strokeRect(padding, padding, innerSize, innerSize)

  // Inner content - simple "S" for Stamps
  ctx.fillStyle = "#ffffff"
  ctx.font = `bold ${size * 0.5}px Arial`
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText("S", size / 2, size / 2)

  // Save the icon
  const buffer = canvas.toBuffer("image/png")
  fs.writeFileSync(path.join(pwaDir, `icon-${size}x${size}.png`), buffer)

  console.log(`Generated icon: ${size}x${size}`)
}

// Generate all icon sizes
sizes.forEach(generateIcon)

// Generate screenshots
function generateScreenshot(width, height, filename) {
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext("2d")

  // Background
  ctx.fillStyle = "#f8f9fa"
  ctx.fillRect(0, 0, width, height)

  // Header
  ctx.fillStyle = "#f4831f"
  ctx.fillRect(0, 0, width, height * 0.1)

  // Content blocks
  ctx.fillStyle = "#ffffff"
  const blockHeight = height * 0.2
  const blockPadding = height * 0.02

  for (let i = 0; i < 3; i++) {
    const y = height * 0.15 + i * (blockHeight + blockPadding)
    ctx.fillRect(width * 0.05, y, width * 0.9, blockHeight)

    // Add some fake content
    ctx.fillStyle = "#595959"
    ctx.fillRect(width * 0.1, y + blockHeight * 0.3, width * 0.8, blockHeight * 0.1)
    ctx.fillRect(width * 0.1, y + blockHeight * 0.5, width * 0.6, blockHeight * 0.1)
    ctx.fillRect(width * 0.1, y + blockHeight * 0.7, width * 0.7, blockHeight * 0.1)
    ctx.fillStyle = "#ffffff"
  }

  // Save the screenshot
  const buffer = canvas.toBuffer("image/png")
  fs.writeFileSync(path.join(pwaDir, filename), buffer)

  console.log(`Generated screenshot: ${width}x${height}`)
}

// Generate desktop and mobile screenshots
generateScreenshot(1280, 720, "screenshot-desktop.png")
generateScreenshot(750, 1334, "screenshot-mobile.png")

console.log("All PWA assets generated successfully!")
