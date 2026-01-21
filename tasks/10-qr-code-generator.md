# Task 10: QR Code Generator Tool

## Overview

Build a QR code generator that creates QR codes for text, URLs, emails, WiFi credentials, and more. Includes customization options, download formats, and scanning preview.

## Market Research

### Why This Tool?
- **High Demand**: QR codes are used everywhere
- **SEO Value**: "qr code generator", "qr code maker", "generate qr code", "qr code online"
- **Multiple Use Cases**: URLs, contact info, WiFi, payments
- **Business Tool**: Used by businesses and developers
- **Growing Trend**: QR codes are more popular than ever

### Reference Tools
- **QR Code Generator**: https://www.qr-code-generator.com/
- **QRCode Monkey**: https://www.qrcode-monkey.com/
- **QR Code API**: https://goqr.me/
- **QR Stuff**: https://www.qrstuff.com/

### Competitive Analysis
- Most tools are basic generators
- Opportunity: Better customization
- Opportunity: Multiple QR code types
- Opportunity: Better download options
- Opportunity: Preview/scanning
- Opportunity: Batch generation

## UI/UX Requirements

### Layout
- **Input Section**:
  - QR Code type selector (Text, URL, Email, WiFi, etc.)
  - Content input (textarea or form fields)
  - Type-specific fields (for WiFi, Email, etc.)
  
- **Customization Panel**:
  - Size selector (small, medium, large)
  - Error correction level (L, M, Q, H)
  - Color customization:
    - Foreground color
    - Background color
    - Logo/image upload (optional)
  - Style options (square, rounded, dots)
  
- **Preview Section**:
  - Live QR code preview
  - Size information
  - Scan test (optional)
  - Download options

### Visual Design
- **QR Code Preview**:
  - Large, clear QR code
  - Real-time updates
  - Size indicator
  - Format information
  
- **Customization Controls**:
  - Color pickers
  - Size slider
  - Style selector
  - Error correction selector
  
- **Type-Specific Forms**:
  - URL: Simple URL input
  - Email: Email + subject + body
  - WiFi: SSID + password + security type
  - Text: Textarea
  - Phone: Phone number
  - SMS: Phone + message

### User Experience
- Real-time QR code generation
- Live preview
- Download in multiple formats (PNG, SVG, PDF)
- Copy QR code image
- Share QR code
- Scan test (use device camera)
- Dark mode support
- Mobile-friendly

## Technical Requirements

### Features to Implement

#### Core Features
1. **QR Code Types**
   - Plain Text
   - URL
   - Email (with subject/body)
   - Phone Number
   - SMS (with phone/message)
   - WiFi (SSID, password, security)
   - vCard (contact information)
   - Bitcoin/Payment (optional)
   
2. **QR Code Generation**
   - Use QR code library (qrcode.js or similar)
   - Generate QR code data
   - Render as canvas/SVG
   - Support error correction levels
   
3. **Customization**
   - Size (100px to 1000px)
   - Error correction (L, M, Q, H)
   - Colors (foreground/background)
   - Logo/image overlay (optional)
   - Style (square, rounded corners, dots)
   
4. **Download Options**
   - PNG (high resolution)
   - SVG (vector)
   - PDF (optional)
   - Copy image to clipboard
   
5. **Preview & Testing**
   - Live preview
   - Size information
   - Data capacity info
   - Scan test (optional)

#### Advanced Features (Phase 2)
- Batch generation
- QR code templates
- History of generated codes
- Analytics (track scans)
- Custom logo upload
- Multiple styles

### Component Structure

```
components/QRGenerator/
├── QRGenerator.tsx              # Main component
├── TypeSelector.tsx             # QR code type selector
├── ContentInput.tsx             # Content input (type-specific)
├── CustomizationPanel.tsx       # Customization options
├── QRPreview.tsx                # QR code preview
├── DownloadOptions.tsx          # Download menu
└── index.ts
```

### Data Structure

#### QR Code Data
```typescript
interface QRCodeData {
  type: 'text' | 'url' | 'email' | 'wifi' | 'phone' | 'sms' | 'vcard';
  content: string | QRCodeContent;
  size: number;
  errorCorrection: 'L' | 'M' | 'Q' | 'H';
  foreground: string;
  background: string;
  logo?: string;
}
```

#### Type-Specific Content
```typescript
interface WiFiContent {
  ssid: string;
  password: string;
  security: 'WPA' | 'WEP' | 'nopass';
}

interface EmailContent {
  email: string;
  subject?: string;
  body?: string;
}
```

#### Data Files
- `data/tools/qr-generator/overview.json`
- `data/tools/qr-generator/instructions.json`
- `data/tools/qr-generator/examples.json`

## Implementation Steps

### Phase 1: Setup
1. Create component structure
2. Integrate QR code library (qrcode.js)
3. Create data files
4. Add to `data/tools.json`
5. Create route `app/tools/qr-generator/page.tsx`

### Phase 2: Core Functionality
1. Implement QR code generation
2. Build type selector
3. Create type-specific inputs
4. Build preview component
5. Add basic customization

### Phase 3: Advanced Features
1. Add color customization
2. Implement size/error correction
3. Add download options
4. Add logo overlay (optional)
5. Share functionality

### Phase 4: Polish
1. Improve UI/UX
2. Add example QR codes
3. Add scan test
4. Responsive design
5. Dark mode support

## QR Code Types Examples

### URL
```
https://izitools.com
```

### WiFi
```
WIFI:T:WPA;S:MyNetwork;P:mypassword;;
```

### Email
```
mailto:example@email.com?subject=Hello&body=Message
```

### Phone
```
tel:+1234567890
```

### SMS
```
sms:+1234567890?body=Hello
```

## SEO & Content

### Meta Tags
- Title: "QR Code Generator - Create QR Codes Online Free"
- Description: "Generate QR codes for URLs, text, WiFi, email, and more. Customize colors, size, and download in multiple formats."
- Keywords: "qr code generator, qr code maker, generate qr code, qr code online, create qr code"

### Content for overview.json
- Title: "QR Code Generator"
- Subtitle: "Create QR codes for any content"
- Description: "Generate QR codes for URLs, text, WiFi credentials, email, phone numbers, and more. Customize colors, size, error correction, and download in PNG, SVG, or PDF formats."
- Features: Multiple QR code types, Color customization, Size options, Error correction levels, Download formats, Live preview
- Use Cases: Website QR codes, WiFi sharing, Contact information, Marketing materials, Event tickets, Payment QR codes

## Success Criteria

- ✅ Generates valid QR codes
- ✅ All QR code types work
- ✅ Customization options work
- ✅ Download in multiple formats
- ✅ QR codes are scannable
- ✅ Preview updates in real-time
- ✅ Mobile-friendly
- ✅ Fast generation

## Reference Links

- **QR Code Generator**: https://www.qr-code-generator.com/
- **QRCode Monkey**: https://www.qrcode-monkey.com/
- **qrcode.js**: https://github.com/davidshimjs/qrcodejs
- **QR Code Spec**: https://www.qrcode.com/en/

## Notes

- Use qrcode.js or similar library
- Error correction levels are important
- Color customization is popular feature
- Logo overlay is advanced but valuable
- Multiple download formats are essential
- Consider adding batch generation
- Scan test adds confidence
