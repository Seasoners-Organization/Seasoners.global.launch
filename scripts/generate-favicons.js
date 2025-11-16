const { generateFavicons } = require('@favware/favicon-generator');
const path = require('path');

async function generate() {
  try {
    await generateFavicons({
      inputFile: path.join(__dirname, '../public/seasoner mountain logo.png'),
      outputFolder: path.join(__dirname, '../public/favicons'),
      generateAndroidManifest: false,
      generateAppleManifest: false,
      generateHtmlManifest: false,
      androidSizes: [48, 72, 96, 144, 192, 512],
      appleSizes: [57, 60, 72, 76, 114, 120, 144, 152, 180],
      faviconSizes: [16, 32, 48],
      logging: true
    });
    console.log('✅ Favicons generated successfully!');
  } catch (error) {
    console.error('❌ Error generating favicons:', error);
    process.exit(1);
  }
}

generate();