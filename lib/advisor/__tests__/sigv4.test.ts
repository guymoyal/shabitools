// lib/advisor/__tests__/sigv4.test.ts
import { describe, it, expect } from 'vitest';
import { hmacSha256Hex, sha256Hex, signingKey, signRequest } from '@/lib/advisor/sigv4';

// Reference values from AWS Signature V4 documentation examples.
const SECRET = 'wJalrXUtnFEMI/K7MDENG+bPxRfiCYEXAMPLEKEY';

describe('sha256Hex', () => {
  it('hashes empty string to the known SHA-256', async () => {
    expect(await sha256Hex('')).toBe(
      'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
  });
});

describe('signingKey', () => {
  it('derives the documented signing key digest', async () => {
    // AWS docs "derive signing key" example: 20150830 / us-east-1 / iam
    const key = await signingKey(SECRET, '20150830', 'us-east-1', 'iam');
    const hex = Array.from(new Uint8Array(key)).map((b) => b.toString(16).padStart(2, '0')).join('');
    expect(hex).toBe('c4afb1cc5771d871763a393e44b703571b55cc28424d1a5e86da6ed3c154a4b9');
  });
});

describe('hmacSha256Hex', () => {
  it('is deterministic', async () => {
    expect(await hmacSha256Hex('key', 'msg')).toBe(await hmacSha256Hex('key', 'msg'));
  });
});

describe('signRequest', () => {
  const input = {
    accessKey: 'AKID', secretKey: SECRET, region: 'us-east-1', service: 'ProductAdvertisingAPI',
    host: 'webservices.amazon.com', path: '/paapi5/searchitems',
    target: 'com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems',
    body: '{"Keywords":"drill"}', amzDate: '20240101T000000Z', dateStamp: '20240101',
  };

  it('signs every header it sends (content-type must not be unsigned)', async () => {
    const signed = await signRequest(input);
    const signedHeaders = signed.headers.authorization.match(/SignedHeaders=([^,]+)/)?.[1] ?? '';
    const signedSet = new Set(signedHeaders.split(';'));
    // Every header sent (except the authorization header itself) must be in SignedHeaders.
    for (const name of Object.keys(signed.headers)) {
      if (name === 'authorization') continue;
      expect(signedSet.has(name.toLowerCase())).toBe(true);
    }
    expect(signedSet.has('content-type')).toBe(true);
  });

  it('lists signed headers in alphabetical order', async () => {
    const signed = await signRequest(input);
    const signedHeaders = signed.headers.authorization.match(/SignedHeaders=([^,]+)/)?.[1] ?? '';
    const parts = signedHeaders.split(';');
    expect(parts).toEqual([...parts].sort());
  });
});
