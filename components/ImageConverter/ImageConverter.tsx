'use client';

import { useState, useRef } from 'react';

type Format = 'png' | 'jpeg' | 'webp';

export default function ImageConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [outputFormat, setOutputFormat] = useState<Format>('png');
  const [quality, setQuality] = useState(90);
  const [convertedImage, setConvertedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
      setConvertedImage(null);
    }
  };

  const convertImage = async () => {
    if (!file || !preview) return;

    setLoading(true);
    try {
      const img = new Image();
      img.src = preview;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }

      ctx.drawImage(img, 0, 0);

      const mimeType = `image/${outputFormat === 'jpeg' ? 'jpeg' : outputFormat}`;
      const convertedDataUrl = canvas.toDataURL(mimeType, quality / 100);

      setConvertedImage(convertedDataUrl);
    } catch (error) {
      console.error('Conversion error:', error);
      alert('Failed to convert image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = () => {
    if (!convertedImage) return;

    const link = document.createElement('a');
    link.download = `converted.${outputFormat}`;
    link.href = convertedImage;
    link.click();
  };

  const getOriginalSize = () => {
    if (!file) return 0;
    return (file.size / 1024).toFixed(2);
  };

  const getConvertedSize = () => {
    if (!convertedImage) return 0;
    const base64Length = convertedImage.length - (convertedImage.indexOf(',') + 1);
    const padding = convertedImage.endsWith('==') ? 2 : convertedImage.endsWith('=') ? 1 : 0;
    const size = (base64Length * 3) / 4 - padding;
    return (size / 1024).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Image Format Converter</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">Convert images between formats (Client-side processing)</p>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <span className="text-xl">ℹ️</span>
            <div>
              <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-300 mb-1">Client-Side Conversion</p>
              <p className="text-sm text-yellow-700 dark:text-yellow-400">
                This tool converts images using your browser. Supported formats: PNG, JPEG, WebP. 
                For advanced formats (TIFF, HEIC, AVIF), backend service is required. See backend documentation for details.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Upload Image</h2>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full px-6 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-600 dark:hover:border-primary-500 text-gray-700 dark:text-gray-300 font-semibold transition-colors"
            >
              Choose Image File
            </button>
            {file && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  File: {file.name} ({(file.size / 1024).toFixed(2)} KB)
                </p>
                {preview && (
                  <div className="mt-4">
                    <img
                      src={preview}
                      alt="Preview"
                      className="max-w-full h-auto rounded-lg border border-gray-200 dark:border-gray-700"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Conversion Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Output Format</label>
                <div className="flex gap-2">
                  {(['png', 'jpeg', 'webp'] as Format[]).map((format) => (
                    <button
                      key={format}
                      onClick={() => setOutputFormat(format)}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-colors ${
                        outputFormat === format
                          ? 'bg-primary-600 dark:bg-primary-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {format.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {outputFormat !== 'png' && (
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                    Quality: {quality}%
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              )}

              <button
                onClick={convertImage}
                disabled={!file || loading}
                className="w-full px-6 py-3 bg-primary-600 dark:bg-primary-500 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors"
              >
                {loading ? 'Converting...' : 'Convert Image'}
              </button>
            </div>
          </div>
        </div>

        {convertedImage && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Converted Image</h2>
              <button
                onClick={downloadImage}
                className="px-4 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 font-semibold transition-colors"
              >
                Download
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Original</p>
                <p className="text-xs text-gray-500 dark:text-gray-500">{getOriginalSize()} KB</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Converted ({outputFormat.toUpperCase()})</p>
                <p className="text-xs text-gray-500 dark:text-gray-500">{getConvertedSize()} KB</p>
              </div>
            </div>
            <img
              src={convertedImage}
              alt="Converted"
              className="max-w-full h-auto rounded-lg border border-gray-200 dark:border-gray-700"
            />
          </div>
        )}

        <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Supported Formats</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div>
              <p className="font-semibold mb-1">Client-Side (This Tool):</p>
              <ul className="list-disc list-inside space-y-1">
                <li>PNG ↔ JPEG</li>
                <li>PNG ↔ WebP</li>
                <li>JPEG ↔ WebP</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-1">Requires Backend:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>TIFF, HEIC, AVIF</li>
                <li>BMP, GIF (animated)</li>
                <li>ICO, ICNS</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
