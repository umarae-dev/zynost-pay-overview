# Zynost Pay — Production-Derived Client Core

[![CI](https://github.com/umarae-dev/zynost-pay-overview/actions/workflows/ci.yml/badge.svg)](https://github.com/umarae-dev/zynost-pay-overview/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)

> Non-custodial stablecoin checkout client code for wallet connection, ERC-20 transfer construction and gasless smart-account signing.

Zynost Pay is the merchant-facing payment product in the Zynost stack. This public repository contains a **production-derived browser client core**, not only an architecture overview.

**Live product:** https://pay.zynost.com  
**Primary BNB experience:** BSC stablecoin checkout + ERC-4337 gas sponsorship  
**Custody model:** merchant-controlled settlement  
**License:** Apache-2.0  
**Architecture:** [`ARCHITECTURE.md`](ARCHITECTURE.md)  
**Public/private boundary:** [`PUBLIC_PRIVATE_BOUNDARY.md`](PUBLIC_PRIVATE_BOUNDARY.md)  
**Release verification:** [`RELEASE_CHECKLIST.md`](RELEASE_CHECKLIST.md)

## Why this repository exists

The complete production merchant application remains private because it contains authenticated product surfaces and operational integrations that should not be exposed merely to demonstrate production lineage. This repository instead publishes the independently reviewable browser execution core used for wallet connection, stablecoin transfer construction and gasless signing.

The goal is to give reviewers executable, auditable source without exposing credentials, customer data, private infrastructure, live operational controls or commercial implementation details that could weaken the production service.

## What is open here

These files are copied byte-for-byte from the approved private production frontend and verified by Git blob SHA before release:

- `lib/walletBridge.ts` — EIP-6963 wallet discovery, WalletConnect v2, MetaMask/Trust Wallet mobile deep links, exact ERC-20 transfer construction and stablecoin integer amount conversion.
- `lib/gaslessBilling.ts` — deterministic client-side owner derivation and EIP-191 signing used by the production gasless billing flow.
- `tsconfig.json` — production TypeScript configuration.
- `.gitignore` — production ignore policy.

`package.json` is intentionally scoped public build glue containing only dependencies required by the published client core. The complete private frontend has unrelated dashboard/admin/marketing/3D dependencies that are not needed to evaluate this code. See [`PROVENANCE.md`](PROVENANCE.md).

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

See [`ARCHITECTURE.md`](ARCHITECTURE.md) for the public trust boundary and the relationship between browser code, private production services and BNB Smart Chain.

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

### Published here

- reusable production wallet connection and transfer client;
- production gasless signing client;
- exact production TypeScript/ignore configuration;
- minimal scoped dependency manifest;
- CI and runtime dependency auditing;
- secret/sensitive-file guard;
- architecture, provenance, security and release documentation;
- public contribution and review controls.

### Kept private

- authenticated merchant dashboard and admin UI;
- live session/API wiring and production operational configuration;
- merchant/customer records;
- API keys, webhook secrets, server JWTs, database credentials and signing credentials;
- private RPC strategy and infrastructure credentials;
- internal fraud/abuse controls, thresholds and operational runbooks;
- any other production material whose disclosure would weaken the live service.

See [`PUBLIC_PRIVATE_BOUNDARY.md`](PUBLIC_PRIVATE_BOUNDARY.md), [`PROVENANCE.md`](PROVENANCE.md), and [`SECURITY.md`](SECURITY.md).

## Local verification

```bash
npm install
npm audit --omit=dev --audit-level=high
npm run check:public
npm run typecheck
```

`NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` is optional. Copy `.env.example` to your local environment and use your own public Reown project ID if you want WalletConnect-backed options enabled.

## Reviewer verification

A reviewer can validate the public release without access to any private credential:

1. inspect `PROVENANCE.md` for the exact production-derived file list;
2. inspect `PUBLIC_PRIVATE_BOUNDARY.md` and `ARCHITECTURE.md` for the disclosure/trust boundary;
3. run the four local verification commands above;
4. confirm the GitHub Actions CI workflow is green on the reviewed commit;
5. inspect `scripts/check-public-repo.mjs` and the PR checklist for anti-leak controls;
6. review `lib/walletBridge.ts` and `lib/gaslessBilling.ts` as the executable production-derived client core.

The public repository is designed to be reviewable on its own while the private production product remains protected.

## Repository safety controls

- GitHub Actions runs dependency audit, public-repository guard and TypeScript compile checks.
- `.env` variants other than the safe `.env.example` are rejected by the repository guard.
- common private-key, GitHub-token, AWS-key and credential-assignment patterns are blocked by the guard.
- `CODEOWNERS` places the production-derived client core and disclosure-boundary files under explicit owner review.
- the pull-request template requires a manual public-source safety review.
- `CONTRIBUTING.md` prohibits copying private production code unless it is explicitly approved and documented for public release.

These controls reduce accidental disclosure risk but do not replace human review before publishing production-derived material.

## Related repositories

- [Zynost Gateway API](https://github.com/umarae-dev/zynost-gateway-backend-overview) — public-safe gateway backend reference for merchant orders, settlement verification and webhooks.
- [Zynost Paymaster](https://github.com/umarae-dev/zynost-paymaster-overview) — ERC-4337 sponsorship and on-chain safety controls.
- [UQX BNB contracts](https://github.com/umarae-dev/uqx-bnb-contracts-overview) — BNB-native UQX token, presale and vesting contracts.
- [Zynost Public Intelligence Reference](https://github.com/umarae-dev/tradeos-backend-overview) — executable public reference for Zynost decision intelligence.
- [UQX Android App Overview](https://github.com/umarae-dev/uqx-app-overview) — self-custody Web3 wallet and device-security architecture.

Together these repositories expose inspectable BNB/Zynost building blocks while keeping production credentials, private data and sensitive operational logic outside public source control.

## Technology

Public core: TypeScript · WalletConnect v2 · ethers.js · BNB Smart Chain · ERC-4337.  
Live product: Next.js / React merchant frontend backed by the separate Zynost Gateway API.

## License

Apache License 2.0. See [`LICENSE`](LICENSE).

The license applies to the source code in this repository. Zynost, Zynost Pay and UQX names, logos and branding are not granted as trademarks merely because source code is available under Apache-2.0.

## Status

Production-derived public client core with CI, runtime dependency auditing, secret scanning, architecture/provenance documentation and explicit public/private review controls. The complete live merchant frontend and sensitive production operations remain private.

For responsible security reporting, see [`SECURITY.md`](SECURITY.md). For contributions, see [`CONTRIBUTING.md`](CONTRIBUTING.md).
