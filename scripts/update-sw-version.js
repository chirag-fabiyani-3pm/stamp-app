const fs = require('fs');
const path = require('path');

/**
 * Updates the service worker version to match package.json and current timestamp
 * Run this script during your build process to ensure cache busting on deployments
 */

function updateServiceWorkerVersion() {
  try {
    // Read package.json to get the current version
    const packageJsonPath = path.join(__dirname, '..', 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const appVersion = packageJson.version;

    // Read the service worker file
    const swPath = path.join(__dirname, '..', 'public', 'sw.js');
    let swContent = fs.readFileSync(swPath, 'utf8');

    // Create build timestamp
    const buildTimestamp = new Date().toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm

    // Update the version in the service worker
    swContent = swContent.replace(
      /const APP_VERSION = '[^']*'/,
      `const APP_VERSION = '${appVersion}'`
    );

    swContent = swContent.replace(
      /const BUILD_TIMESTAMP = '[^']*'/,
      `const BUILD_TIMESTAMP = '${buildTimestamp}'`
    );

    // Write the updated service worker
    fs.writeFileSync(swPath, swContent, 'utf8');

    console.log(`✅ Service worker updated to version ${appVersion}-${buildTimestamp}`);
    console.log('Cache will be properly invalidated on next deployment.');

  } catch (error) {
    console.error('❌ Error updating service worker version:', error.message);
    process.exit(1);
  }
}

// Run if this script is executed directly
if (require.main === module) {
  updateServiceWorkerVersion();
}

module.exports = updateServiceWorkerVersion; 