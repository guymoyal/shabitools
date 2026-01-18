# Cloudflare Deployment

This directory contains Cloudflare-specific configuration files.

## Setup

1. Install dependencies: `pnpm install`
2. Login to Cloudflare: `pnpm cf:login`
3. Verify login: `pnpm cf:whoami`

## Deployment

- **Preview**: `pnpm deploy:preview`
- **Production**: `pnpm deploy:production`
- **Default**: `pnpm deploy`
