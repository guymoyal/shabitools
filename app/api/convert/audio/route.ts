import { NextRequest, NextResponse } from 'next/server';

// Placeholder for audio converter backend
// See backend/services/audio-converter/README.md for implementation details

export async function POST(request: NextRequest) {
  return NextResponse.json({
    message: 'Audio converter backend not yet implemented',
    note: 'See backend/services/audio-converter/README.md for implementation guide',
    options: [
      'Use FFmpeg for self-hosted solution',
      'Use CloudConvert API for cloud solution',
      'Use AWS MediaConvert for scalable solution',
    ],
  });
}
