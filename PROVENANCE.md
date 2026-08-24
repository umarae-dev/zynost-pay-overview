# Provenance

This public repository contains a production-derived, security-reviewed subset of the private `umarae-dev/zynost-pay` frontend.

## Exact production blobs

The following public files remain byte-for-byte identical to their private production counterparts:

- `tsconfig.json`
- `.gitignore`
- `lib/walletBridge.ts`
- `lib/gaslessBilling.ts`

## Public build manifest

`package.json` is intentionally public-only build glue for this scoped mirror. The private production frontend has a much larger dependency manifest because it also contains Next.js marketing, dashboard, admin, Firebase, 3D and other product surfaces that are not published here. Reusing that full manifest in this smaller repository would install unrelated runtime packages and inherit advisories from code that is not present.

The public manifest therefore contains only dependencies required by the exact production client-core files above. This does not rewrite production business logic; it makes the published subset independently installable and auditable.

Public-only files such as CI, secret scanning, `.env.example`, documentation and release guidance are also maintained independently for this open-source mirror.

## Verification rule

Before release, compare Git blob SHAs for every exact-production file, audit the scoped runtime dependencies, and require the public CI workflow to pass.
