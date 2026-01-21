'use client';

import { useState, useEffect } from 'react';

interface IPInfo {
  ip: string;
  country?: string;
  city?: string;
  region?: string;
  timezone?: string;
  isp?: string;
  org?: string;
  asn?: string;
  latitude?: number;
  longitude?: number;
  error?: string;
}

export default function IPAddressInfo() {
  const [ip, setIp] = useState('');
  const [currentIp, setCurrentIp] = useState('');
  const [info, setInfo] = useState<IPInfo | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Get user's current IP
    fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => setCurrentIp(data.ip))
      .catch(() => setCurrentIp('Unable to detect'));
  }, []);

  const lookupIP = async () => {
    if (!ip.trim()) {
      setInfo(null);
      return;
    }

    setLoading(true);
    setInfo(null);

    try {
      // Using ipapi.co free tier
      const response = await fetch(`https://ipapi.co/${ip}/json/`);
      const data = await response.json();

      if (data.error) {
        setInfo({ ip, error: data.reason || 'Invalid IP address' });
      } else {
        setInfo({
          ip: data.ip || ip,
          country: data.country_name,
          city: data.city,
          region: data.region,
          timezone: data.timezone,
          isp: data.org,
          org: data.org,
          asn: data.asn,
          latitude: data.latitude,
          longitude: data.longitude,
        });
      }
    } catch (error) {
      setInfo({
        ip,
        error: 'Failed to fetch IP information. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const useCurrentIP = () => {
    setIp(currentIp);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-4 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">IP Address Info</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">Get detailed IP address information</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">IP Address</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={ip}
                  onChange={(e) => setIp(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && lookupIP()}
                  placeholder="192.168.1.1 or leave empty for your IP"
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-600 dark:focus:ring-primary-500 focus:border-transparent font-mono"
                />
                <button
                  onClick={useCurrentIP}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-semibold transition-colors"
                >
                  My IP
                </button>
                <button
                  onClick={lookupIP}
                  disabled={loading}
                  className="px-6 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors"
                >
                  {loading ? 'Loading...' : 'Lookup'}
                </button>
              </div>
              {currentIp && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Your current IP: <span className="font-mono font-semibold">{currentIp}</span>
                </p>
              )}
            </div>

            {info && (
              <div className="mt-6">
                {info.error ? (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-red-700 dark:text-red-400 font-semibold">Error</p>
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">{info.error}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">IP Address</div>
                      <div className="font-mono text-lg font-semibold text-gray-900 dark:text-gray-100">{info.ip}</div>
                    </div>

                    {info.country && (
                      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Country</div>
                        <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">{info.country}</div>
                      </div>
                    )}

                    {info.city && (
                      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">City</div>
                        <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">{info.city}</div>
                      </div>
                    )}

                    {info.region && (
                      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Region</div>
                        <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">{info.region}</div>
                      </div>
                    )}

                    {info.timezone && (
                      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Timezone</div>
                        <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">{info.timezone}</div>
                      </div>
                    )}

                    {info.isp && (
                      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg md:col-span-2">
                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">ISP / Organization</div>
                        <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">{info.isp}</div>
                      </div>
                    )}

                    {info.asn && (
                      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">ASN</div>
                        <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">{info.asn}</div>
                      </div>
                    )}

                    {(info.latitude && info.longitude) && (
                      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Coordinates</div>
                        <div className="text-sm font-mono text-gray-900 dark:text-gray-100">
                          {info.latitude}, {info.longitude}
                        </div>
                        <a
                          href={`https://www.google.com/maps?q=${info.latitude},${info.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary-600 dark:text-primary-400 hover:underline mt-1 inline-block"
                        >
                          View on Google Maps →
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">About IP Lookup</h2>
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
            <p>
              IP geolocation provides approximate location information based on IP address. The accuracy varies and is typically at the city level.
            </p>
            <p>
              <strong>Note:</strong> IP geolocation is not precise and should not be used for exact location tracking. VPNs and proxies may show incorrect locations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
