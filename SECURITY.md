# Security Policy

Zynost Pay is a production payment product. This public repository contains a deliberately scoped, production-derived browser client core plus public documentation and CI. It does **not** contain production credentials, merchant/customer data, seed phrases, private wallet keys, server signing secrets, database access, authenticated admin/merchant operational code, or private deployment configuration.

## What is public here

The published production-derived client subset includes:

- EIP-6963 wallet discovery and injected-wallet connection;
- WalletConnect v2 connection and mobile deep links;
- ERC-20 transfer calldata construction and exact integer amount conversion;
- deterministic client-side gasless smart-account owner derivation and EIP-191 signing;
- production dependency and TypeScript configuration files.

See [`PROVENANCE.md`](PROVENANCE.md) for the exact-copy list and [`PUBLIC_PRIVATE_BOUNDARY.md`](PUBLIC_PRIVATE_BOUNDARY.md) for the security boundary.

## Responsible disclosure

If you believe you found a security issue affecting Zynost Pay, Zynost Gateway, Zynost Paymaster, merchant settlement, wallet connection, webhooks, gasless checkout, authentication, or related infrastructure:

- do not exploit the issue beyond what is required to demonstrate it safely;
- do not access, modify, transfer, or retain funds or private user data;
- do not test against live merchant/customer funds without explicit written authorization;
- do not publish a live exploit before the issue can be investigated and remediated;
- include clear reproduction steps, affected surface, expected impact, and any transaction/request identifiers that are safe to share.

Contact: **security@zynost.com**

If that mailbox is unavailable, use the contact channel listed on the live Zynost Pay website.

## Secrets and account material

The following must never be committed to this public repository or requested from a merchant/customer as part of normal Zynost Pay usage:

- seed phrase / mnemonic;
- wallet private key;
- merchant API key outside the merchant's own server-side integration;
- webhook signing secret outside the merchant's own verification environment;
- server JWT/database credentials;
- operational signing credentials;
- one-time authentication or 2FA codes.

Security research should use accounts, wallets and funds you control unless explicit written authorization says otherwise.

## Public-source boundary

Publishing the browser client core makes wallet and signing behavior independently inspectable without exposing the complete live merchant product. Authenticated dashboard/admin surfaces, live operational configuration, private data and server-side credentials remain outside this repository by design.
