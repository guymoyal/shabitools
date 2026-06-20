// lib/advisor/sigv4.ts
// Minimal AWS Signature V4 for PA-API, using Web Crypto (globalThis.crypto.subtle).

const enc = new TextEncoder();

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function sha256Hex(data: string): Promise<string> {
  return toHex(await crypto.subtle.digest('SHA-256', enc.encode(data)));
}

async function hmac(key: ArrayBuffer | Uint8Array, msg: string): Promise<ArrayBuffer> {
  const k = await crypto.subtle.importKey('raw', key as BufferSource, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return crypto.subtle.sign('HMAC', k, enc.encode(msg));
}

export async function hmacSha256Hex(key: string, msg: string): Promise<string> {
  return toHex(await hmac(enc.encode(key), msg));
}

export async function signingKey(secret: string, date: string, region: string, service: string): Promise<ArrayBuffer> {
  const kDate = await hmac(enc.encode('AWS4' + secret), date);
  const kRegion = await hmac(kDate, region);
  const kService = await hmac(kRegion, service);
  return hmac(kService, 'aws4_request');
}

export interface SignedRequest { url: string; headers: Record<string, string>; body: string; }

export interface SignInput {
  accessKey: string; secretKey: string; region: string; service: string;
  host: string; path: string; target: string; body: string;
  amzDate: string;   // YYYYMMDDTHHMMSSZ
  dateStamp: string; // YYYYMMDD
}

/** Build a fully-signed POST request (SigV4, headers: host;x-amz-date;x-amz-target;content-encoding). */
export async function signRequest(i: SignInput): Promise<SignedRequest> {
  const contentEncoding = 'amz-1.0';
  const canonicalHeaders =
    `content-encoding:${contentEncoding}\n` +
    `host:${i.host}\n` +
    `x-amz-date:${i.amzDate}\n` +
    `x-amz-target:${i.target}\n`;
  const signedHeaders = 'content-encoding;host;x-amz-date;x-amz-target';
  const payloadHash = await sha256Hex(i.body);
  const canonicalRequest =
    `POST\n${i.path}\n\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;
  const scope = `${i.dateStamp}/${i.region}/${i.service}/aws4_request`;
  const stringToSign =
    `AWS4-HMAC-SHA256\n${i.amzDate}\n${scope}\n${await sha256Hex(canonicalRequest)}`;
  const key = await signingKey(i.secretKey, i.dateStamp, i.region, i.service);
  const signature = toHex(await hmac(key, stringToSign));
  const authorization =
    `AWS4-HMAC-SHA256 Credential=${i.accessKey}/${scope}, ` +
    `SignedHeaders=${signedHeaders}, Signature=${signature}`;
  return {
    url: `https://${i.host}${i.path}`,
    headers: {
      'content-encoding': contentEncoding,
      'content-type': 'application/json; charset=utf-8',
      host: i.host,
      'x-amz-date': i.amzDate,
      'x-amz-target': i.target,
      authorization,
    },
    body: i.body,
  };
}
