'use client';

import { useState, useRef } from 'react';

interface Color {
  hex: string;
  rgb: string;
  hsl: string;
}

type PaletteType = 'monochromatic' | 'complementary' | 'triadic' | 'analogous' | 'split-complementary';

export default function ColorPaletteGenerator() {
  const [baseColor, setBaseColor] = useState('#0284c7');
  const [paletteType, setPaletteType] = useState<PaletteType>('monochromatic');
  const [palette, setPalette] = useState<Color[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
  };

  const hslToRgb = (h: number, s: number, l: number): { r: number; g: number; b: number } => {
    h /= 360;
    s /= 100;
    l /= 100;
    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  };

  const rgbToHex = (r: number, g: number, b: number): string => {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  };

  const generatePalette = () => {
    const rgb = hexToRgb(baseColor);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const colors: Color[] = [];

    switch (paletteType) {
      case 'monochromatic':
        for (let i = 0; i < 5; i++) {
          const l = Math.max(10, Math.min(90, hsl.l + (i - 2) * 15));
          const newRgb = hslToRgb(hsl.h, hsl.s, l);
          const hex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
          colors.push({
            hex,
            rgb: `rgb(${newRgb.r}, ${newRgb.g}, ${newRgb.b})`,
            hsl: `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(l)}%)`
          });
        }
        break;

      case 'complementary':
        colors.push({
          hex: baseColor,
          rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
          hsl: `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`
        });
        const compH = (hsl.h + 180) % 360;
        const compRgb = hslToRgb(compH, hsl.s, hsl.l);
        const compHex = rgbToHex(compRgb.r, compRgb.g, compRgb.b);
        colors.push({
          hex: compHex,
          rgb: `rgb(${compRgb.r}, ${compRgb.g}, ${compRgb.b})`,
          hsl: `hsl(${Math.round(compH)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`
        });
        break;

      case 'triadic':
        for (let i = 0; i < 3; i++) {
          const h = (hsl.h + i * 120) % 360;
          const newRgb = hslToRgb(h, hsl.s, hsl.l);
          const hex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
          colors.push({
            hex,
            rgb: `rgb(${newRgb.r}, ${newRgb.g}, ${newRgb.b})`,
            hsl: `hsl(${Math.round(h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`
          });
        }
        break;

      case 'analogous':
        for (let i = -1; i <= 1; i++) {
          const h = (hsl.h + i * 30 + 360) % 360;
          const newRgb = hslToRgb(h, hsl.s, hsl.l);
          const hex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
          colors.push({
            hex,
            rgb: `rgb(${newRgb.r}, ${newRgb.g}, ${newRgb.b})`,
            hsl: `hsl(${Math.round(h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`
          });
        }
        break;

      case 'split-complementary':
        colors.push({
          hex: baseColor,
          rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
          hsl: `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`
        });
        const h1 = (hsl.h + 150) % 360;
        const h2 = (hsl.h + 210) % 360;
        [h1, h2].forEach(h => {
          const newRgb = hslToRgb(h, hsl.s, hsl.l);
          const hex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
          colors.push({
            hex,
            rgb: `rgb(${newRgb.r}, ${newRgb.g}, ${newRgb.b})`,
            hsl: `hsl(${Math.round(h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`
          });
        });
        break;
    }

    setPalette(colors);
  };

  const extractColorsFromImage = () => {
    if (!imageFile) return;

    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);

      const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
      if (!imageData) return;

      const colorMap = new Map<string, number>();
      const data = imageData.data;

      // Sample colors (every 10th pixel for performance)
      for (let i = 0; i < data.length; i += 40) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const hex = rgbToHex(r, g, b);
        colorMap.set(hex, (colorMap.get(hex) || 0) + 1);
      }

      // Get top 5 colors
      const sortedColors = Array.from(colorMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([hex]) => {
          const rgb = hexToRgb(hex);
          const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
          return {
            hex,
            rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
            hsl: `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`
          };
        });

      setPalette(sortedColors);
    };

    img.src = URL.createObjectURL(imageFile);
  };

  const copyColor = (color: Color) => {
    navigator.clipboard.writeText(color.hex);
  };

  const exportCSS = () => {
    const css = palette.map((color, idx) => 
      `  --color-${idx + 1}: ${color.hex};`
    ).join('\n');
    navigator.clipboard.writeText(`:root {\n${css}\n}`);
  };

  const exportJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(palette, null, 2));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-4 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Color Palette Generator</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">Generate beautiful color palettes</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Base Color</label>
              <div className="flex items-center gap-4">
                <input
                  type="color"
                  value={baseColor}
                  onChange={(e) => setBaseColor(e.target.value)}
                  className="w-20 h-20 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={baseColor}
                  onChange={(e) => setBaseColor(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Palette Type</label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {(['monochromatic', 'complementary', 'triadic', 'analogous', 'split-complementary'] as PaletteType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setPaletteType(type)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-colors ${
                      paletteType === type
                        ? 'bg-primary-600 dark:bg-primary-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {type.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Extract from Image (Optional)</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setImageFile(file);
                  }
                }}
                className="hidden"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-semibold transition-colors"
                >
                  Choose Image
                </button>
                {imageFile && (
                  <>
                    <button
                      onClick={extractColorsFromImage}
                      className="px-4 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 font-semibold transition-colors"
                    >
                      Extract Colors
                    </button>
                    <span className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 self-center">{imageFile.name}</span>
                  </>
                )}
              </div>
            </div>

            <button
              onClick={generatePalette}
              className="w-full px-6 py-3 bg-primary-600 dark:bg-primary-500 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 font-semibold transition-colors"
            >
              Generate Palette
            </button>
          </div>
        </div>

        {palette.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Generated Palette</h2>
              <div className="flex gap-2">
                <button
                  onClick={exportCSS}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 text-sm font-semibold transition-colors"
                >
                  Export CSS
                </button>
                <button
                  onClick={exportJSON}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 text-sm font-semibold transition-colors"
                >
                  Export JSON
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {palette.map((color, idx) => (
                <div
                  key={idx}
                  className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
                >
                  <div
                    className="h-24 w-full cursor-pointer"
                    style={{ backgroundColor: color.hex }}
                    onClick={() => copyColor(color)}
                    title="Click to copy hex"
                  />
                  <div className="p-3 bg-gray-50 dark:bg-gray-700">
                    <div className="font-mono text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      {color.hex}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 space-y-0.5">
                      <div>{color.rgb}</div>
                      <div>{color.hsl}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
