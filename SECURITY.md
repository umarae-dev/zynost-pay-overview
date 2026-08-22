# Security Policy

Zynost Pay is a production payment product. This public repository documents product architecture and security boundaries; it does **not** contain production credentials, merchant/customer data, seed phrases, private keys, signing secrets, or the private production frontend source.

## Responsible disclosure

If you believe you found a security issue affecting Zynost Pay, Zynost Gateway, Zynost Paymaster, merchant settlement, authentication, webhooks, gasless checkout, or related infrastructure:

- do not exploit the issue beyond what is required to demonstrate it safely;
- do not access, modify, transfer, or retain funds or private user data;
- do not publish a live exploit before the issue can be investigated and remediated;
- include clear reproduction steps, affected surface, expected impact, and any relevant transaction/request identifiers that are safe to share.

Contact: **security@zynost.com**

If that mailbox is unavailable, use the contact channel listed on the live Zynost Pay website.

## Scope notes

The following are never legitimate secrets to request from a merchant or customer on behalf of Zynost Pay:

- seed phrase / mnemonic;
- wallet private key;
- merchant API key outside the merchant's own server-side integration;
- webhook signing secret outside the merchant's own verification environment;
- one-time authentication or 2FA codes.

Security research should use accounts, wallets and funds you control unless explicit written authorization says otherwise.

## Public-source boundary

This repository intentionally exposes architecture, trust boundaries and product behavior while keeping production implementation and operational credentials private. A separate non-production open-source BNB component may be published for developer/hackathon use; it should never require production Zynost secrets to run.