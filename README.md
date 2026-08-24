# Zynost Pay — Production-Derived Client Core

> Non-custodial stablecoin checkout client code for wallet connection, ERC-20 transfer construction and gasless smart-account signing.

Zynost Pay is the merchant-facing payment product in the Zynost stack. This public repository contains a **real production-derived browser client core**, not only an architecture overview.

**Live product:** https://pay.zynost.com  
**Primary BNB experience:** BSC stablecoin checkout + ERC-4337 gas sponsorship  
**Custody model:** merchant-controlled settlement

## What is open here

These files are copied byte-for-byte from the private production frontend and verified by Git blob SHA before release:

- `lib/walletBridge.ts` — EIP-6963 wallet discovery, WalletConnect v2, MetaMask/Trust Wallet mobile deep links, exact ERC-20 transfer construction and stablecoin integer amount conversion.
- `lib/gaslessBilling.ts` — deterministic client-side owner derivation and EIP-191 signing used by the production gasless billing flow.
- `tsconfig.json` — production TypeScript configuration.
- `.gitignore` — production ignore policy.

`package.json` is intentionally scoped public build glue containing only dependencies required by the published client core. The complete private frontend has many unrelated Next.js/dashboard/admin/3D dependencies; installing them here would add code and dependency risk for surfaces that are not published. See [`PROVENANCE.md`](PROVENANCE.md).

## BNB Chain path

```text
Customer wallet
    │
    ├── normal BSC stablecoin transfer
    │      └── ERC-20 transfer encoded client-side
    │
    └── gasless path
           ├── free wallet signature
           ├── deterministic smart-account owner
           ├── exact operation signature
           └── Zynost Paymaster / ERC-4337 sponsorship
                    │
                    ▼
              BNB Smart Chain
```

The production wallet bridge supports Ethereum, BNB Smart Chain and Polygon EVM chain IDs, with BSC represented by chain ID 56. WalletConnect is optional and enabled with a public Reown project identifier.

## Security properties visible in source

- Wallet discovery uses EIP-6963 where available instead of assuming one injected provider.
- WalletConnect sessions can be used when no browser extension exists.
- MetaMask and Trust Wallet mobile flows use direct WalletConnect deep links.
- ERC-20 transfer calldata is constructed from destination, contract and raw integer amount inputs.
- Stablecoin amounts are converted using integer math rather than floating-point token units.
- Gasless owner material is deterministically derived client-side from a user-approved wallet signature and is not stored in this repository.
- Gasless operation hashes use the EIP-191 signing behavior expected by the smart-account verification path.

## Public / private boundary

This is intentionally a **client-core mirror**, not the entire live merchant product.

Published here:

- reusable production wallet connection and transfer client;
- production gasless signing client;
- exact production TypeScript/ignore configuration;
- minimal scoped dependency manifest;
- CI, runtime dependency audit, provenance, license and security documentation.

Kept private:

- authenticated merchant dashboard and admin UI;
- live session/API wiring and operational configuration;
- merchant/customer records;
- API keys, webhook secrets, server JWTs, database credentials and signing credentials;
- operational abuse controls and runbooks.

See [`PUBLIC_PRIVATE_BOUNDARY.md`](PUBLIC_PRIVATE_BOUNDARY.md) and [`PROVENANCE.md`](PROVENANCE.md).

## Local verification

```bash
npm install
npm audit --omit=dev --audit-level=high
node scripts/check-public-repo.mjs
npm run typecheck
```

`NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` is optional. Copy `.env.example` to your own local environment and use your own public Reown project ID if you want WalletConnect-backed options enabled.

## Related repositories

- [Zynost Gateway API](https://github.com/umarae-dev/zynost-gateway-backend-overview) — watch-only address derivation, merchant orders, multi-RPC settlement verification and webhooks.
- [Zynost Paymaster](https://github.com/umarae-dev/zynost-paymaster-overview) — ERC-4337 sponsorship and on-chain safety controls.
- [UQX BNB contracts](https://github.com/umarae-dev/uqx-bnb-contracts-overview) — BNB-native UQX token, presale and vesting contracts.

## Technology

Public core: TypeScript · WalletConnect v2 · ethers.js · BNB Smart Chain · ERC-4337.  
Live product: Next.js / React merchant frontend backed by the separate Zynost Gateway API.

## License

Apache-2.0. See [`LICENSE`](LICENSE).

## Status

Production-derived public client core with CI, runtime dependency auditing and secret scanning. The complete live merchant frontend remains private.

For responsible security reporting, see [`SECURITY.md`](SECURITY.md).
