'use client';

import { useState } from 'react';

type InputType = 'text' | 'image' | 'file';

export default function Base64Encoder() {
  const [inputType, setInputType] = useState<InputType>('text');
  const [textInput, setTextInput] = useState('');
  const [base64Output, setBase64Output] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('');

  const encodeText = () => {
    try {
      const encoded = btoa(unescape(encodeURIComponent(textInput)));
      setBase64Output(encoded);
      setImagePreview(null);
    } catch (err) {
      alert('Error encoding text: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const decodeText = () => {
    try {
      const decoded = decodeURIComponent(escape(atob(textInput)));
      setBase64Output(decoded);
      setImagePreview(null);
    } catch (err) {
      alert('Error decoding Base64: ' + (err instanceof Error ? err.message : 'Invalid Base64'));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setFileType(file.type);

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      // Extract base64 part (remove data:image/...;base64, prefix)
      const base64 = result.split(',')[1] || result;
      setBase64Output(base64);
      setImagePreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setFileType(file.type);

    const reader = new FileReader();
    reader.onload = (event) => {
      const arrayBuffer = event.target?.result as ArrayBuffer;
      const bytes = new Uint8Array(arrayBuffer);
      let binary = '';
      for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      const base64 = btoa(binary);
      setBase64Output(base64);
      setImagePreview(null);
    };
    reader.readAsArrayBuffer(file);
  };

  const decodeBase64 = () => {
    try {
      if (inputType === 'image' && fileType.startsWith('image/')) {
        const dataUrl = `data:${fileType};base64,${textInput}`;
        setImagePreview(dataUrl);
        setBase64Output(textInput);
      } else {
        const decoded = atob(textInput);
        setBase64Output(decoded);
        setImagePreview(null);
      }
    } catch (err) {
      alert('Error decoding Base64: ' + (err instanceof Error ? err.message : 'Invalid Base64'));
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(base64Output || textInput);
  };

  const generateDataUrl = () => {
    if (fileType.startsWith('image/') && base64Output) {
      const dataUrl = `data:${fileType};base64,${base64Output}`;
      navigator.clipboard.writeText(dataUrl);
      alert('Data URL copied to clipboard!');
    } else {
      alert('Data URLs are only available for images');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Base64 Encoder & Decoder</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">Encode and decode Base64 data</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex gap-2 mb-6">
            {(['text', 'image', 'file'] as InputType[]).map((type) => (
              <button
                key={type}
                onClick={() => {
                  setInputType(type);
                  setTextInput('');
                  setBase64Output('');
                  setImagePreview(null);
                  setFileName('');
                  setFileType('');
                }}
                className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-colors ${
                  inputType === type
                    ? 'bg-primary-600 dark:bg-primary-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {inputType === 'text' && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Text Input</label>
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Enter text to encode or Base64 to decode"
                  rows={8}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-600 dark:focus:ring-primary-500 focus:border-transparent font-mono text-sm"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={encodeText}
                  className="px-4 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 text-sm font-semibold transition-colors"
                >
                  Encode
                </button>
                <button
                  onClick={decodeText}
                  className="px-4 py-2 bg-gray-600 dark:bg-gray-500 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 text-sm font-semibold transition-colors"
                >
                  Decode
                </button>
              </div>
            </div>
          )}

          {inputType === 'image' && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Upload Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              {imagePreview && (
                <div className="mt-4">
                  <div className="text-sm font-semibold text-gray-700 mb-2">Preview</div>
                  <img src={imagePreview} alt="Preview" className="max-w-md border border-gray-200 rounded-lg" />
                </div>
              )}
            </div>
          )}

          {inputType === 'file' && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Upload File</label>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>
          )}
        </div>

        {base64Output && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Base64 Output</label>
              <div className="flex gap-2">
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 text-sm font-semibold transition-colors"
                >
                  Copy
                </button>
                {inputType === 'image' && fileType.startsWith('image/') && (
                  <button
                    onClick={generateDataUrl}
                    className="px-4 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 text-sm font-semibold transition-colors"
                  >
                    Copy Data URL
                  </button>
                )}
              </div>
            </div>
            <textarea
              value={base64Output}
              readOnly
              rows={10}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 font-mono text-sm text-gray-900 dark:text-gray-100"
            />
            {fileName && (
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                File: {fileName} ({fileType})
              </div>
            )}
          </div>
        )}

        {inputType === 'text' && textInput && !base64Output && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Decode Base64</label>
              <button
                onClick={decodeBase64}
                className="px-4 py-2 bg-gray-600 dark:bg-gray-500 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 text-sm font-semibold transition-colors"
              >
                Decode
              </button>
            </div>
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Enter Base64 string to decode"
              rows={8}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-600 dark:focus:ring-primary-500 focus:border-transparent font-mono text-sm"
            />
          </div>
        )}
      </div>
    </div>
  );
}
