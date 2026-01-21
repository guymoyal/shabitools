# Document Converter Service

## Overview

Service for converting documents between different formats. **Requires backend** - cannot be done client-side.

## Supported Formats

### Input Formats
- PDF
- DOCX (Microsoft Word)
- XLSX (Microsoft Excel)
- PPTX (Microsoft PowerPoint)
- ODT, ODS, ODP (OpenDocument)
- RTF
- TXT
- Markdown

### Output Formats
- PDF
- DOCX
- HTML
- TXT
- Markdown
- Images (PNG, JPEG) - from PDF pages

## Technology Options

### Option 1: LibreOffice (Recommended)
```bash
# Requires LibreOffice installation
libreoffice --headless --convert-to pdf document.docx
```
- Free and open source
- Good format support
- Requires server installation

### Option 2: Pandoc
```bash
npm install pandoc
```
- Excellent for text-based formats
- Markdown support
- Limited binary format support

### Option 3: CloudConvert API
```bash
npm install cloudconvert
```
- Extensive format support
- Pay-per-use pricing
- No server setup required
- Requires API key

### Option 4: Adobe PDF Services API
- High-quality PDF conversion
- Paid service
- Requires API key

## API Endpoint

```
POST /api/convert/document
Content-Type: multipart/form-data

Form Data:
- file: File (required)
- toFormat: string (required) - pdf, docx, html, txt, md
- options?: {
    pageRange?: string,      // For PDF to images: "1-5"
    quality?: number,         // For PDF to images: 1-100
    orientation?: string      // portrait, landscape
  }
```

## Example Implementation

```typescript
// Using LibreOffice
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);

async function convertDocument(
  inputPath: string,
  outputFormat: string,
  outputDir: string
) {
  const command = `libreoffice --headless --convert-to ${outputFormat} --outdir ${outputDir} "${inputPath}"`;
  await execAsync(command);
  
  const inputName = path.basename(inputPath, path.extname(inputPath));
  const outputPath = path.join(outputDir, `${inputName}.${outputFormat}`);
  
  return await fs.readFile(outputPath);
}

// Using CloudConvert API
import { CloudConvert } from 'cloudconvert';

const cloudConvert = new CloudConvert(process.env.CLOUDCONVERT_API_KEY);

async function convertDocumentCloud(file: File, toFormat: string) {
  const job = await cloudConvert.jobs.create({
    tasks: {
      'import-file': {
        operation: 'import/upload',
        file: file
      },
      'convert': {
        operation: 'convert',
        input: 'import-file',
        output_format: toFormat
      },
      'export': {
        operation: 'export/url',
        input: 'convert'
      }
    }
  });
  
  return job;
}
```

## File Size Limits

- Default: 50MB
- Configurable via environment variable

## Security Considerations

1. **File Validation**: Check file signatures, not just extensions
2. **Virus Scanning**: Scan uploaded documents (ClamAV, etc.)
3. **Sandboxing**: Run conversions in isolated environment
4. **Time Limits**: Set conversion timeout
5. **Resource Limits**: Limit CPU and memory usage

## Cost Estimation

### LibreOffice (Self-hosted)
- **Setup**: Free
- **Ongoing**: Server costs only
- **Best for**: High volume, control over infrastructure

### CloudConvert API
- **Pricing**: ~$0.05 per conversion
- **Best for**: Low-medium volume, quick setup

### Adobe PDF Services
- **Pricing**: ~$0.05-0.10 per conversion
- **Best for**: High-quality PDF needs

## Implementation Priority

1. **Phase 1**: Basic PDF to HTML/TXT (using PDF.js client-side)
2. **Phase 2**: PDF to images (server-side)
3. **Phase 3**: Full document conversion (server-side)

## Dependencies

```json
{
  "dependencies": {
    "pdf-parse": "^1.1.1",
    "pdf-lib": "^1.17.1",
    "mammoth": "^1.6.0",
    "xlsx": "^0.18.5"
  }
}
```
