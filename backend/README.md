# Backend Services for iziTools

## Overview

This folder contains backend services for tools that require server-side processing. These services can be deployed separately from the main Next.js frontend.

## Architecture

```
backend/
├── README.md                 # This file
├── services/                 # Individual service implementations
│   ├── image-converter/     # Image format conversion service
│   ├── document-converter/  # Document format conversion service
│   └── audio-converter/     # Audio format conversion service
├── shared/                   # Shared utilities and types
│   ├── types.ts            # TypeScript types
│   └── utils.ts            # Utility functions
└── docker/                  # Docker configurations
    ├── Dockerfile
    └── docker-compose.yml
```

## Services

### Image Converter Service
- **Purpose**: Convert images between formats (PNG, JPEG, WebP, SVG, etc.)
- **Technology**: Sharp (Node.js) or ImageMagick
- **Client-side alternative**: Basic conversions possible with Canvas API
- **Backend required**: For complex formats (TIFF, HEIC, AVIF, etc.)

### Document Converter Service
- **Purpose**: Convert documents (PDF, DOCX, XLSX, PPTX, etc.)
- **Technology**: LibreOffice, Pandoc, or cloud APIs
- **Client-side alternative**: Limited (PDF.js for viewing only)
- **Backend required**: Yes, for all document conversions

### Audio Converter Service
- **Purpose**: Convert audio files (MP3, WAV, FLAC, OGG, etc.)
- **Technology**: FFmpeg
- **Client-side alternative**: Limited (Web Audio API for basic operations)
- **Backend required**: Yes, for all audio format conversions

## Deployment Options

### Option 1: Separate Backend Service
- Deploy as separate Node.js/Python service
- Use REST API or GraphQL
- Can scale independently
- Recommended for production

### Option 2: Next.js API Routes
- Use Next.js API routes (`/app/api/`)
- Simpler deployment (same as frontend)
- Limited scalability
- Good for MVP/testing

### Option 3: Serverless Functions
- Deploy as serverless functions (Vercel, AWS Lambda)
- Pay-per-use pricing
- Auto-scaling
- Good for low-medium traffic

## Implementation Status

- ⏳ **Image Converter**: Client-side basic support, backend needed for advanced formats
- ⏳ **Document Converter**: Backend required
- ⏳ **Audio Converter**: Backend required

## API Design

### Image Converter API
```typescript
POST /api/convert/image
Body: {
  file: File,
  fromFormat: string,
  toFormat: string,
  options?: {
    quality?: number,
    width?: number,
    height?: number
  }
}
Response: {
  success: boolean,
  file?: Blob,
  error?: string
}
```

### Document Converter API
```typescript
POST /api/convert/document
Body: {
  file: File,
  fromFormat: string,
  toFormat: string
}
Response: {
  success: boolean,
  file?: Blob,
  error?: string
}
```

### Audio Converter API
```typescript
POST /api/convert/audio
Body: {
  file: File,
  fromFormat: string,
  toFormat: string,
  options?: {
    bitrate?: number,
    sampleRate?: number
  }
}
Response: {
  success: boolean,
  file?: Blob,
  error?: string
}
```

## Environment Variables

```env
# Image Converter
IMAGE_CONVERTER_MAX_SIZE=10MB
IMAGE_CONVERTER_ALLOWED_FORMATS=png,jpg,jpeg,webp,svg

# Document Converter
DOCUMENT_CONVERTER_MAX_SIZE=50MB
DOCUMENT_CONVERTER_ALLOWED_FORMATS=pdf,docx,xlsx,pptx

# Audio Converter
AUDIO_CONVERTER_MAX_SIZE=100MB
AUDIO_CONVERTER_ALLOWED_FORMATS=mp3,wav,flac,ogg

# Storage (if using cloud storage)
STORAGE_PROVIDER=local|s3|cloudflare-r2
STORAGE_BUCKET=your-bucket-name
```

## Security Considerations

1. **File Size Limits**: Enforce maximum file sizes
2. **File Type Validation**: Validate file types server-side
3. **Rate Limiting**: Prevent abuse
4. **Virus Scanning**: Scan uploaded files (optional)
5. **Temporary Storage**: Clean up temporary files
6. **CORS**: Configure CORS properly

## Cost Considerations

### Free/Open Source Options
- **Sharp**: Free, Node.js image processing
- **FFmpeg**: Free, audio/video processing
- **LibreOffice**: Free, document conversion
- **Pandoc**: Free, document conversion

### Paid Options
- **CloudConvert API**: Pay-per-use, supports many formats
- **Adobe PDF Services**: Paid, high-quality PDF conversion
- **AWS MediaConvert**: Pay-per-use, scalable

## Next Steps

1. Choose deployment option (Next.js API routes for MVP)
2. Implement basic image converter (client-side first)
3. Set up document converter backend
4. Set up audio converter backend
5. Add rate limiting and security
6. Add monitoring and logging

## Migration Plan

When ready to move backend to separate project:

1. Copy `backend/` folder to new repository
2. Set up CI/CD pipeline
3. Deploy to cloud provider
4. Update frontend API endpoints
5. Add environment variables
6. Test end-to-end
