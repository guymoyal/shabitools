'use client';

import { useState, useEffect, useRef } from 'react';

type ComparisonMode = 'side-by-side' | 'overlay';
type OverlayMode = 'overlay' | 'blend' | 'onion';
type ViewportPreset = '375' | '768' | '1200' | 'custom';

export default function VisualDiff() {
  const [firstUrl, setFirstUrl] = useState('');
  const [secondUrl, setSecondUrl] = useState('');
  const [comparisonMode, setComparisonMode] = useState<ComparisonMode>('side-by-side');
  const [overlayMode, setOverlayMode] = useState<OverlayMode>('overlay');
  const [opacity, setOpacity] = useState(50);
  const [viewportPreset, setViewportPreset] = useState<ViewportPreset>('375');
  const [customWidth, setCustomWidth] = useState('375');
  const [showSettings, setShowSettings] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showDeviceHeight, setShowDeviceHeight] = useState(false);
  const [checkIframe, setCheckIframe] = useState(true);
  const [iframeErrors, setIframeErrors] = useState<{ first: boolean; second: boolean }>({ first: false, second: false });
  const firstIframeRef = useRef<HTMLIFrameElement>(null);
  const secondIframeRef = useRef<HTMLIFrameElement>(null);
  const firstScrollRef = useRef<HTMLDivElement>(null);
  const secondScrollRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);

  const viewportWidth = viewportPreset === 'custom' ? parseInt(customWidth) || 375 : parseInt(viewportPreset);

  useEffect(() => {
    // Update URL params when inputs change
    const params = new URLSearchParams();
    if (firstUrl) params.set('url1', firstUrl);
    if (secondUrl) params.set('url2', secondUrl);
    if (viewportPreset !== '375') params.set('width', viewportPreset);
    if (customWidth && viewportPreset === 'custom') params.set('customWidth', customWidth);
    if (comparisonMode !== 'side-by-side') params.set('mode', comparisonMode);
    if (overlayMode !== 'overlay') params.set('overlay', overlayMode);
    if (opacity !== 50) params.set('opacity', opacity.toString());
    
    const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    window.history.replaceState({}, '', newUrl);
  }, [firstUrl, secondUrl, viewportPreset, customWidth, comparisonMode, overlayMode, opacity]);

  useEffect(() => {
    // Load from URL params
    const params = new URLSearchParams(window.location.search);
    if (params.get('url1')) setFirstUrl(params.get('url1') || '');
    if (params.get('url2')) setSecondUrl(params.get('url2') || '');
    if (params.get('width')) {
      const width = params.get('width');
      if (width === '375' || width === '768' || width === '1200') {
        setViewportPreset(width as ViewportPreset);
      } else {
        setViewportPreset('custom');
        setCustomWidth(width || '375');
      }
    }
    if (params.get('customWidth')) setCustomWidth(params.get('customWidth') || '375');
    if (params.get('mode')) setComparisonMode(params.get('mode') as ComparisonMode);
    if (params.get('overlay')) setOverlayMode(params.get('overlay') as OverlayMode);
    if (params.get('opacity')) setOpacity(parseInt(params.get('opacity') || '50'));
  }, []);

  const handleOpacityChange = (delta: number) => {
    setOpacity(Math.max(0, Math.min(100, opacity + delta)));
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleIframeError = (which: 'first' | 'second') => {
    setIframeErrors(prev => ({ ...prev, [which]: true }));
  };

  // Synchronized scrolling for side-by-side mode using wrapper divs
  useEffect(() => {
    if (comparisonMode !== 'side-by-side') return;

    const firstScroll = firstScrollRef.current;
    const secondScroll = secondScrollRef.current;

    if (!firstScroll || !secondScroll) return;

    const syncScroll = (source: 'first' | 'second') => {
      if (isScrollingRef.current) return;
      isScrollingRef.current = true;

      const sourceScroll = source === 'first' ? firstScroll : secondScroll;
      const targetScroll = source === 'first' ? secondScroll : firstScroll;

      targetScroll.scrollTop = sourceScroll.scrollTop;

      setTimeout(() => {
        isScrollingRef.current = false;
      }, 10);
    };

    const handleFirstScroll = () => syncScroll('first');
    const handleSecondScroll = () => syncScroll('second');

    firstScroll.addEventListener('scroll', handleFirstScroll);
    secondScroll.addEventListener('scroll', handleSecondScroll);

    return () => {
      firstScroll.removeEventListener('scroll', handleFirstScroll);
      secondScroll.removeEventListener('scroll', handleSecondScroll);
    };
  }, [comparisonMode, firstUrl, secondUrl]);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <div className={`border-b ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Visual Page Compare</h1>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-md ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                aria-label="Toggle dark mode"
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-2 rounded-md ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                aria-label="Settings"
              >
                ⚙️
              </button>
            </div>
          </div>

          {/* URL Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">First URL</label>
              <input
                type="text"
                value={firstUrl}
                onChange={(e) => setFirstUrl(e.target.value)}
                placeholder="https://example.com"
                className={`w-full px-4 py-2 rounded-md border ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:ring-2 focus:ring-primary-600 focus:border-primary-600`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Second URL</label>
              <input
                type="text"
                value={secondUrl}
                onChange={(e) => setSecondUrl(e.target.value)}
                placeholder="https://example.com"
                className={`w-full px-4 py-2 rounded-md border ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:ring-2 focus:ring-primary-600 focus:border-primary-600`}
              />
            </div>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className={`p-4 rounded-md mb-4 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={showDeviceHeight}
                      onChange={(e) => setShowDeviceHeight(e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm">Show device height (above-the-fold line)</span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={checkIframe}
                      onChange={(e) => setCheckIframe(e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm">Check iframe embedding (X-Frame-Options)</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Viewport Width Selector */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Viewport Width</label>
            <div className="flex items-center gap-4 flex-wrap">
              <select
                value={viewportPreset}
                onChange={(e) => setViewportPreset(e.target.value as ViewportPreset)}
                className={`px-4 py-2 rounded-md border ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-gray-100' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:ring-2 focus:ring-primary-600`}
              >
                <option value="375">375px (Mobile)</option>
                <option value="768">768px (Tablet)</option>
                <option value="1200">1200px (Desktop)</option>
                <option value="custom">Custom</option>
              </select>
              {viewportPreset === 'custom' && (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={customWidth}
                    onChange={(e) => setCustomWidth(e.target.value)}
                    min="320"
                    max="1920"
                    className={`w-24 px-4 py-2 rounded-md border ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-gray-100' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:ring-2 focus:ring-primary-600`}
                  />
                  <span className="text-sm">px</span>
                </div>
              )}
            </div>
          </div>

          {/* Comparison Mode Toggle */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Comparison Mode</label>
            <div className="flex gap-2">
              <button
                onClick={() => setComparisonMode('side-by-side')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  comparisonMode === 'side-by-side'
                    ? 'bg-primary-600 text-white'
                    : darkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Side by Side
              </button>
              <button
                onClick={() => setComparisonMode('overlay')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  comparisonMode === 'overlay'
                    ? 'bg-primary-600 text-white'
                    : darkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Overlay
              </button>
            </div>
          </div>

          {/* Overlay Mode Buttons (only show in overlay mode) */}
          {comparisonMode === 'overlay' && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Overlay Mode</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setOverlayMode('overlay')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    overlayMode === 'overlay'
                      ? 'bg-primary-600 text-white'
                      : darkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Overlay
                </button>
                <button
                  onClick={() => setOverlayMode('blend')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    overlayMode === 'blend'
                      ? 'bg-primary-600 text-white'
                      : darkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Blend
                </button>
                <button
                  onClick={() => setOverlayMode('onion')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    overlayMode === 'onion'
                      ? 'bg-primary-600 text-white'
                      : darkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Onion
                </button>
              </div>
            </div>
          )}

          {/* Opacity Control (only for onion mode) */}
          {comparisonMode === 'overlay' && overlayMode === 'onion' && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Opacity: {opacity}%</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleOpacityChange(-10)}
                  className={`px-3 py-1 rounded-md ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  ↓
                </button>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={opacity}
                  onChange={(e) => setOpacity(parseInt(e.target.value))}
                  className="flex-1"
                />
                <button
                  onClick={() => handleOpacityChange(10)}
                  className={`px-3 py-1 rounded-md ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  ↑
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Comparison View */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-4 lg:px-8">
        <div className="relative">
          {comparisonMode === 'side-by-side' ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <div className={`text-sm font-semibold mb-3 px-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    First URL {!firstUrl && <span className="text-xs font-normal text-gray-500">(Enter URL above)</span>}
                  </div>
                  <div className={`border-2 ${darkMode ? 'border-gray-600' : 'border-gray-300'} rounded-lg overflow-hidden bg-white shadow-lg flex flex-col`}>
                    {!firstUrl ? (
                      <div 
                        ref={firstScrollRef}
                        className="flex-1 overflow-auto bg-gray-50" 
                        style={{ height: '1100px' }}
                      >
                        <div className="inline-block" style={{ width: `${viewportWidth}px`, minWidth: `${viewportWidth}px`, height: '1100px' }}>
                          <div className="flex items-center justify-center h-full w-full">
                            <div className={`text-center ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                              <div className="text-4xl mb-4">🌐</div>
                              <p className="text-sm">Enter URL to compare</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        {iframeErrors.first && checkIframe && (
                          <div className={`p-3 text-xs ${darkMode ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-50 text-yellow-800'} border-b ${darkMode ? 'border-yellow-700' : 'border-yellow-200'}`}>
                            ⚠️ This site may block iframe embedding (X-Frame-Options)
                          </div>
                        )}
                        <div 
                          ref={firstScrollRef}
                          className="flex-1 overflow-auto" 
                          style={{ height: '1100px' }}
                        >
                          <div className="inline-block" style={{ width: `${viewportWidth}px`, minWidth: `${viewportWidth}px` }}>
                            <iframe
                              ref={firstIframeRef}
                              src={firstUrl}
                              style={{ 
                                width: `${viewportWidth}px`, 
                                height: '1100px', 
                                minWidth: `${viewportWidth}px`,
                                border: 'none',
                                display: 'block'
                              }}
                              title="First URL"
                              onError={() => handleIframeError('first')}
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className={`text-sm font-semibold mb-3 px-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Second URL {!secondUrl && <span className="text-xs font-normal text-gray-500">(Enter URL above)</span>}
                  </div>
                  <div className={`border-2 ${darkMode ? 'border-gray-600' : 'border-gray-300'} rounded-lg overflow-hidden bg-white shadow-lg flex flex-col`}>
                    {!secondUrl ? (
                      <div 
                        ref={secondScrollRef}
                        className="flex-1 overflow-auto bg-gray-50" 
                        style={{ height: '1100px' }}
                      >
                        <div className="inline-block" style={{ width: `${viewportWidth}px`, minWidth: `${viewportWidth}px`, height: '1100px' }}>
                          <div className="flex items-center justify-center h-full w-full">
                            <div className={`text-center ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                              <div className="text-4xl mb-4">🌐</div>
                              <p className="text-sm">Enter URL to compare</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        {iframeErrors.second && checkIframe && (
                          <div className={`p-3 text-xs ${darkMode ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-50 text-yellow-800'} border-b ${darkMode ? 'border-yellow-700' : 'border-yellow-200'}`}>
                            ⚠️ This site may block iframe embedding (X-Frame-Options)
                          </div>
                        )}
                        <div 
                          ref={secondScrollRef}
                          className="flex-1 overflow-auto" 
                          style={{ height: '1100px' }}
                        >
                          <div className="inline-block" style={{ width: `${viewportWidth}px`, minWidth: `${viewportWidth}px` }}>
                            <iframe
                              ref={secondIframeRef}
                              src={secondUrl}
                              style={{ 
                                width: `${viewportWidth}px`, 
                                height: '1100px', 
                                minWidth: `${viewportWidth}px`,
                                border: 'none',
                                display: 'block'
                              }}
                              title="Second URL"
                              onError={() => handleIframeError('second')}
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className={`text-sm font-semibold mb-3 w-full max-w-full ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Overlay Comparison ({overlayMode})
                </div>
                <div className={`relative border-2 ${darkMode ? 'border-gray-600' : 'border-gray-300'} rounded-lg overflow-hidden bg-white shadow-lg`} style={{ width: `${viewportWidth}px`, maxWidth: '100%', height: '1100px' }}>
                  <div className="relative w-full h-full overflow-auto">
                    {(!firstUrl || !secondUrl) ? (
                      <div className="flex items-center justify-center h-full w-full bg-gray-50" style={{ minHeight: '1100px' }}>
                        <div className={`text-center ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          <div className="text-4xl mb-4">🌐</div>
                          <p className="text-sm">Enter URLs above to compare</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        {(iframeErrors.first || iframeErrors.second) && checkIframe && (
                          <div className={`absolute top-0 left-0 right-0 p-3 text-xs z-20 ${darkMode ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-50 text-yellow-800'} border-b ${darkMode ? 'border-yellow-700' : 'border-yellow-200'}`}>
                            ⚠️ One or both sites may block iframe embedding (X-Frame-Options)
                          </div>
                        )}
                        <div className="relative" style={{ width: `${viewportWidth}px`, height: '1100px', minWidth: `${viewportWidth}px` }}>
                          {firstUrl && (
                            <iframe
                              ref={firstIframeRef}
                              src={firstUrl}
                              style={{ 
                                width: `${viewportWidth}px`, 
                                height: '1100px',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                zIndex: 1,
                                border: 'none'
                              }}
                              title="First URL"
                              onError={() => handleIframeError('first')}
                            />
                          )}
                          {secondUrl && (
                            <iframe
                              ref={secondIframeRef}
                              src={secondUrl}
                              style={{ 
                                width: `${viewportWidth}px`, 
                                height: '1100px',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                zIndex: 2,
                                opacity: overlayMode === 'onion' ? opacity / 100 : overlayMode === 'blend' ? 1 : 0.5,
                                mixBlendMode: overlayMode === 'blend' ? 'difference' : 'normal',
                                pointerEvents: 'none',
                                border: 'none'
                              }}
                              title="Second URL"
                              onError={() => handleIframeError('second')}
                            />
                          )}
                          {showDeviceHeight && (
                            <div 
                              className="absolute left-0 right-0 border-t-2 border-red-500 z-10 pointer-events-none"
                              style={{ top: `${Math.min(viewportWidth * 1.5, 1100)}px` }}
                            >
                              <span className={`absolute left-2 -top-5 text-xs text-red-500 px-2 py-1 rounded ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>Above-the-fold</span>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
