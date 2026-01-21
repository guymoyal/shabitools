import { NextRequest, NextResponse } from 'next/server';

// Placeholder for document converter backend
// See backend/services/document-converter/README.md for implementation details

export async function POST(request: NextRequest) {
  return NextResponse.json({
    message: 'Document converter backend not yet implemented',
    note: 'See backend/services/document-converter/README.md for implementation guide',
    options: [
      'Use LibreOffice for self-hosted solution',
      'Use CloudConvert API for cloud solution',
      'Use Pandoc for text-based formats',
    ],
  });
}
