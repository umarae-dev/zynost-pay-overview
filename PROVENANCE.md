# Provenance

This public repository contains a production-derived, security-reviewed subset of the private `umarae-dev/zynost-pay` frontend.

## Exact production blobs

The following public files are intended to remain byte-for-byte identical to their private production counterparts:

- `package.json`
- `tsconfig.json`
- `.gitignore`
- `lib/walletBridge.ts`
- `lib/gaslessBilling.ts`

Public-only files such as CI, secret scanning, `.env.example`, documentation and release guidance are maintained independently for this open-source mirror.

## Verification rule

Before release, compare Git blob SHAs for every exact-production file and require the public CI workflow to pass.
