# Zynost Pay Public Client-Core Architecture

This repository exposes only the browser-side client core that can be safely reviewed in public. It is intentionally separated from private production services, credentials, merchant data, operational controls, and deployment configuration.

## Public execution path

```text
Customer EVM wallet
      │
      ├─ EIP-6963 injected-wallet discovery
      │
      ├─ WalletConnect v2 / mobile deep links
      │
      ▼
Zynost Pay browser client core
      │
      ├─ exact integer stablecoin amount conversion
      ├─ ERC-20 transfer calldata construction
      ├─ chain switching / transaction request
      │
      └─ optional gasless signing path
             │
             ├─ user-approved wallet signature
             ├─ deterministic smart-account owner derivation
             └─ EIP-191 operation-hash signature
                    │
                    ▼
          Private production services
          (not contained in this repo)
                    │
                    ├─ authenticated merchant/order context
                    ├─ sponsorship / policy evaluation
                    ├─ RPC / settlement verification
                    └─ operational controls
                    │
                    ▼
             BNB Smart Chain
```

## BNB Chain role

BNB Smart Chain is the primary low-cost EVM payment path demonstrated by the wider Zynost Pay stack. The public wallet bridge supports BSC chain ID 56 and constructs normal ERC-20 transfers client-side. The public gasless client produces the user-side signatures required by the separate ERC-4337 sponsorship path.

The server-side sponsorship rules, live merchant authorization, private RPC strategy, signer material, fraud controls, internal thresholds, and production deployment configuration are intentionally not published here.

## Public modules

### `lib/walletBridge.ts`

Production-derived browser wallet execution logic covering:

- EIP-6963 wallet discovery;
- injected EIP-1193 providers;
- WalletConnect v2;
- MetaMask and Trust Wallet mobile deep links;
- BSC/EVM chain switching;
- exact ERC-20 transfer calldata construction;
- stablecoin amount conversion using integer math.

### `lib/gaslessBilling.ts`

Production-derived user-side gasless signing logic covering:

- deterministic owner derivation from a user-approved wallet signature;
- local ephemeral owner material;
- EIP-191 signing of a 32-byte operation hash.

It does not contain a production paymaster key, sponsor key, bundler credential, private RPC key, database credential, or merchant secret.

## Trust boundary

The browser client is not trusted with server authority. Public client code can request wallet actions and produce user-authorized signatures, but production authorization and settlement decisions belong to private server/on-chain controls outside this repository.

## Public/private design rule

A component is publishable only when all of the following are true:

1. it contains no production credential or user/merchant private data;
2. publishing it does not disclose a private operational control whose secrecy materially protects the live service;
3. it can be reviewed independently without granting production authority;
4. it is explicitly listed in `PROVENANCE.md` or is public-only documentation/tooling;
5. it passes the repository guard and CI before merge.

See `PUBLIC_PRIVATE_BOUNDARY.md`, `PROVENANCE.md`, `SECURITY.md`, and `RELEASE_CHECKLIST.md` for the release boundary.