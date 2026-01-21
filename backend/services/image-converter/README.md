# Image Converter Service

## Overview

Service for converting images between different formats. Supports both client-side (basic) and server-side (advanced) conversion.

## Client-Side Support (Implemented)

### Supported Formats
- PNG ↔ JPEG
- PNG ↔ WebP
- JPEG ↔ WebP
- SVG optimization (text-based)

### Limitations
- Limited format support
- Browser memory constraints
- No advanced features (resize, crop, filters)

### Implementation
Uses browser Canvas API and FileReader API.

## Server-Side Support (Future)

### Supported Formats
- PNG, JPEG, WebP, SVG
- TIFF, HEIC, AVIF, BMP
- GIF (animated)
- ICO, ICNS

### Features
- Format conversion
- Resize and crop
- Quality adjustment
- Compression
- Batch processing

### Technology Options

#### Option 1: Sharp (Node.js)
```bash
npm install sharp
```
- Fast, modern
- Good format support
- Memory efficient

#### Option 2: ImageMagick
```bash
# Requires system installation
```
- Extensive format support
- More features
- Heavier resource usage

## API Endpoint

```
POST /api/convert/image
Content-Type: multipart/form-data

Form Data:
- file: File (required)
- toFormat: string (required) - png, jpg, webp, svg
- quality?: number (optional) - 1-100
- width?: number (optional)
- height?: number (optional)
- maintainAspectRatio?: boolean (optional)
```

## Example Implementation

```typescript
// Client-side (basic)
async function convertImageClient(file: File, toFormat: string) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const img = new Image();
  
  img.src = URL.createObjectURL(file);
  await new Promise((resolve) => {
    img.onload = resolve;
  });
  
  canvas.width = img.width;
  canvas.height = img.height;
  ctx?.drawImage(img, 0, 0);
  
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, `image/${toFormat}`, 0.9);
  });
}

// Server-side (future)
import sharp from 'sharp';

async function convertImageServer(file: Buffer, toFormat: string, options: any) {
  return sharp(file)
    .resize(options.width, options.height, {
      fit: options.maintainAspectRatio ? 'inside' : 'fill'
    })
    .toFormat(toFormat, { quality: options.quality })
    .toBuffer();
}
```

## File Size Limits

- Client-side: Limited by browser memory (~50MB recommended)
- Server-side: Configurable (default: 10MB)

## Security

- Validate file types
- Check file signatures (not just extensions)
- Limit file sizes
- Sanitize filenames
- Rate limiting
