'use strict';
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const upath = require('upath');

// Image optimization config
const JPEG_QUALITY = 85;
const WEBP_QUALITY = 80;
const PNG_QUALITY = 90;

const IMG_DIR = upath.resolve(__dirname, '../src/assets/img');

async function optimizeImage(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const basename = path.basename(filePath, ext);
    const dirname = path.dirname(filePath);

    console.log(`Optimizing: ${filePath}`);

    try {
        const image = sharp(filePath);

        if (ext === '.jpg' || ext === '.jpeg') {
            // Generate optimized JPEG
            const optJpgPath = path.join(dirname, `${basename}-opt.jpg`);
            await image
                .jpeg({ quality: JPEG_QUALITY, progressive: true })
                .toFile(optJpgPath);

            // Generate WebP
            const webpPath = path.join(dirname, `${basename}.webp`);
            await sharp(filePath)
                .webp({ quality: WEBP_QUALITY })
                .toFile(webpPath);

            console.log(`  ✓ Created ${basename}-opt.jpg and ${basename}.webp`);

        } else if (ext === '.png') {
            // Generate optimized PNG
            const optPngPath = path.join(dirname, `${basename}-opt.png`);
            await image
                .png({ quality: PNG_QUALITY, compressionLevel: 9 })
                .toFile(optPngPath);

            // Generate WebP
            const webpPath = path.join(dirname, `${basename}.webp`);
            await sharp(filePath)
                .webp({ quality: WEBP_QUALITY, lossless: false })
                .toFile(webpPath);

            console.log(`  ✓ Created ${basename}-opt.png and ${basename}.webp`);
        }

    } catch (err) {
        console.error(`  ✗ Error optimizing ${filePath}:`, err);
    }
}

async function findAndOptimizeImages(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            await findAndOptimizeImages(fullPath);
        } else if (entry.isFile()) {
            const ext = path.extname(entry.name).toLowerCase();
            // Skip already optimized files
            if ((ext === '.jpg' || ext === '.jpeg' || ext === '.png') &&
                !entry.name.includes('-opt') &&
                entry.name !== '.DS_Store' &&
                entry.name !== 'Untitled.jpeg') {
                await optimizeImage(fullPath);
            }
        }
    }
}

// Main execution
(async () => {
    console.log('Starting image optimization...\n');
    await findAndOptimizeImages(IMG_DIR);
    console.log('\nOptimization complete!');
})();
