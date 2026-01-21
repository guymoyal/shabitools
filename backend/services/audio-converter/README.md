# Audio Converter Service

## Overview

Service for converting audio files between different formats. **Requires backend** - cannot be done client-side for most formats.

## Supported Formats

### Input Formats
- MP3
- WAV
- FLAC
- OGG
- AAC
- M4A
- WMA

### Output Formats
- MP3
- WAV
- FLAC
- OGG
- AAC

## Technology Options

### Option 1: FFmpeg (Recommended)
```bash
# Requires FFmpeg installation
ffmpeg -i input.mp3 -acodec libmp3lame -ab 192k output.mp3
```
- Free and open source
- Excellent format support
- Industry standard
- Requires server installation

### Option 2: CloudConvert API
```bash
npm install cloudconvert
```
- Extensive format support
- Pay-per-use pricing
- No server setup required
- Requires API key

### Option 3: AWS MediaConvert
- Scalable cloud solution
- Pay-per-use pricing
- Requires AWS account

## API Endpoint

```
POST /api/convert/audio
Content-Type: multipart/form-data

Form Data:
- file: File (required)
- toFormat: string (required) - mp3, wav, flac, ogg, aac
- options?: {
    bitrate?: number,         // e.g., 128, 192, 320 (kbps)
    sampleRate?: number,     // e.g., 44100, 48000 (Hz)
    channels?: number,       // 1 (mono), 2 (stereo)
    quality?: number         // 0-9 (for VBR)
  }
```

## Example Implementation

```typescript
// Using FFmpeg
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);

async function convertAudio(
  inputPath: string,
  outputFormat: string,
  options: {
    bitrate?: number;
    sampleRate?: number;
    channels?: number;
  }
) {
  const outputPath = inputPath.replace(/\.[^.]+$/, `.${outputFormat}`);
  
  let command = `ffmpeg -i "${inputPath}"`;
  
  if (options.bitrate) {
    command += ` -b:a ${options.bitrate}k`;
  }
  
  if (options.sampleRate) {
    command += ` -ar ${options.sampleRate}`;
  }
  
  if (options.channels) {
    command += ` -ac ${options.channels}`;
  }
  
  command += ` "${outputPath}"`;
  
  await execAsync(command);
  return await fs.readFile(outputPath);
}

// Using CloudConvert API
import { CloudConvert } from 'cloudconvert';

const cloudConvert = new CloudConvert(process.env.CLOUDCONVERT_API_KEY);

async function convertAudioCloud(file: File, toFormat: string, options: any) {
  const job = await cloudConvert.jobs.create({
    tasks: {
      'import-file': {
        operation: 'import/upload',
        file: file
      },
      'convert': {
        operation: 'convert',
        input: 'import-file',
        output_format: toFormat,
        audio_codec: options.codec || 'mp3',
        audio_bitrate: options.bitrate || 192,
        audio_sample_rate: options.sampleRate || 44100
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

- Default: 100MB
- Configurable via environment variable
- Consider streaming for large files

## Security Considerations

1. **File Validation**: Check file signatures
2. **Duration Limits**: Limit audio length (e.g., 10 minutes)
3. **Resource Limits**: Limit CPU and memory
4. **Sandboxing**: Run conversions in isolated environment

## Cost Estimation

### FFmpeg (Self-hosted)
- **Setup**: Free
- **Ongoing**: Server costs only
- **Best for**: High volume

### CloudConvert API
- **Pricing**: ~$0.05-0.10 per conversion
- **Best for**: Low-medium volume

## Client-Side Limitations

Web Audio API can:
- ✅ Play audio
- ✅ Basic audio analysis
- ✅ Simple effects
- ❌ Cannot convert formats efficiently
- ❌ Limited codec support

## Implementation Priority

1. **Phase 1**: Basic MP3/WAV conversion (server-side)
2. **Phase 2**: Add more formats
3. **Phase 3**: Add quality options and batch processing

## Dependencies

```json
{
  "dependencies": {
    "fluent-ffmpeg": "^2.1.2",
    "cloudconvert": "^2.4.0"
  }
}
```
