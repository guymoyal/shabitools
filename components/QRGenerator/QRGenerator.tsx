'use client';

import { useState, useEffect } from 'react';
import QRCode from 'qrcode';

type QRType = 'text' | 'url' | 'email' | 'wifi' | 'phone' | 'sms';

export default function QRGenerator() {
  const [type, setType] = useState<QRType>('url');
  const [content, setContent] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [size, setSize] = useState(256);
  const [errorCorrection, setErrorCorrection] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [foreground, setForeground] = useState('#000000');
  const [background, setBackground] = useState('#ffffff');

  // Type-specific content
  const [email, setEmail] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [wifiSSID, setWifiSSID] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [wifiSecurity, setWifiSecurity] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');
  const [phone, setPhone] = useState('');
  const [smsPhone, setSmsPhone] = useState('');
  const [smsMessage, setSmsMessage] = useState('');

  useEffect(() => {
    generateQRCode();
  }, [type, content, email, emailSubject, emailBody, wifiSSID, wifiPassword, wifiSecurity, phone, smsPhone, smsMessage, size, errorCorrection, foreground, background]);

  const getQRContent = () => {
    switch (type) {
      case 'url':
        return content || 'https://example.com';
      case 'text':
        return content || 'Hello World';
      case 'email':
        const emailUrl = `mailto:${email || 'example@email.com'}`;
        const params = [];
        if (emailSubject) params.push(`subject=${encodeURIComponent(emailSubject)}`);
        if (emailBody) params.push(`body=${encodeURIComponent(emailBody)}`);
        return params.length > 0 ? `${emailUrl}?${params.join('&')}` : emailUrl;
      case 'wifi':
        return `WIFI:T:${wifiSecurity};S:${wifiSSID || 'NetworkName'};P:${wifiPassword || ''};;`;
      case 'phone':
        return `tel:${phone || '+1234567890'}`;
      case 'sms':
        return `sms:${smsPhone || '+1234567890'}${smsMessage ? `?body=${encodeURIComponent(smsMessage)}` : ''}`;
      default:
        return content;
    }
  };

  const generateQRCode = async () => {
    try {
      const qrContent = getQRContent();
      const dataUrl = await QRCode.toDataURL(qrContent, {
        width: size,
        margin: 2,
        color: {
          dark: foreground,
          light: background,
        },
        errorCorrectionLevel: errorCorrection,
      });
      setQrCodeUrl(dataUrl);
    } catch (err) {
      console.error('Error generating QR code:', err);
    }
  };

  const downloadQR = (format: 'png' | 'svg') => {
    if (!qrCodeUrl) return;

    if (format === 'png') {
      const link = document.createElement('a');
      link.href = qrCodeUrl;
      link.download = `qrcode-${type}-${Date.now()}.png`;
      link.click();
    } else {
      QRCode.toString(getQRContent(), {
        type: 'svg',
        width: size,
        margin: 2,
        color: {
          dark: foreground,
          light: background,
        },
        errorCorrectionLevel: errorCorrection,
      }).then((svg) => {
        const blob = new Blob([svg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `qrcode-${type}-${Date.now()}.svg`;
        link.click();
        URL.revokeObjectURL(url);
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">QR Code Generator</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">Create QR codes for any content</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">QR Code Type</h2>
            <div className="grid grid-cols-3 gap-2 mb-6">
              {(['url', 'text', 'email', 'wifi', 'phone', 'sms'] as QRType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-colors ${
                    type === t
                      ? 'bg-primary-600 dark:bg-primary-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {type === 'url' && (
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">URL</label>
                <input
                  type="url"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                />
              </div>
            )}

            {type === 'text' && (
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Text</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter text"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                />
              </div>
            )}

            {type === 'email' && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@email.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Subject (optional)</label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    placeholder="Email subject"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Body (optional)</label>
                  <textarea
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    placeholder="Email body"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {type === 'wifi' && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Network Name (SSID)</label>
                  <input
                    type="text"
                    value={wifiSSID}
                    onChange={(e) => setWifiSSID(e.target.value)}
                    placeholder="NetworkName"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Password</label>
                  <input
                    type="password"
                    value={wifiPassword}
                    onChange={(e) => setWifiPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Security Type</label>
                  <select
                    value={wifiSecurity}
                    onChange={(e) => setWifiSecurity(e.target.value as 'WPA' | 'WEP' | 'nopass')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  >
                    <option value="WPA">WPA/WPA2</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">No Password</option>
                  </select>
                </div>
              </div>
            )}

            {type === 'phone' && (
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1234567890"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                />
              </div>
            )}

            {type === 'sms' && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Phone Number</label>
                  <input
                    type="tel"
                    value={smsPhone}
                    onChange={(e) => setSmsPhone(e.target.value)}
                    placeholder="+1234567890"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Message (optional)</label>
                  <textarea
                    value={smsMessage}
                    onChange={(e) => setSmsMessage(e.target.value)}
                    placeholder="SMS message"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            <div className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Size: {size}px</label>
                <input
                  type="range"
                  min="100"
                  max="1000"
                  step="50"
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Error Correction</label>
                <select
                  value={errorCorrection}
                  onChange={(e) => setErrorCorrection(e.target.value as 'L' | 'M' | 'Q' | 'H')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                >
                  <option value="L">L - Low (~7%)</option>
                  <option value="M">M - Medium (~15%)</option>
                  <option value="Q">Q - Quartile (~25%)</option>
                  <option value="H">H - High (~30%)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Foreground</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={foreground}
                      onChange={(e) => setForeground(e.target.value)}
                      className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      value={foreground}
                      onChange={(e) => setForeground(e.target.value)}
                      className="flex-1 px-2 py-1 border border-gray-300 rounded-lg font-mono text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Background</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={background}
                      onChange={(e) => setBackground(e.target.value)}
                      className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      value={background}
                      onChange={(e) => setBackground(e.target.value)}
                      className="flex-1 px-2 py-1 border border-gray-300 rounded-lg font-mono text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">QR Code Preview</h2>
            {qrCodeUrl && (
              <div className="flex flex-col items-center">
                <img src={qrCodeUrl} alt="QR Code" className="border border-gray-200 rounded-lg mb-4" />
                <div className="flex gap-2">
                  <button
                    onClick={() => downloadQR('png')}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-semibold"
                  >
                    Download PNG
                  </button>
                  <button
                    onClick={() => downloadQR('svg')}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm font-semibold"
                  >
                    Download SVG
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
