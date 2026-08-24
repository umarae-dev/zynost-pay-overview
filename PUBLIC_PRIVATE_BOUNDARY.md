# Public / Private Boundary

This repository publishes the reusable browser-side execution core of Zynost Pay while keeping live merchant operations and credentials out of the public mirror.

## Public

- EIP-6963 wallet discovery and injected-wallet connection
- WalletConnect v2 connection and mobile deep links
- exact ERC-20 transfer construction used by the production client
- exact stablecoin amount integer conversion
- client-side deterministic gasless smart-account owner derivation/signing
- production dependency and TypeScript configuration
- public CI, secret guard and documentation

## Private

- authenticated merchant dashboard and admin surfaces
- live API/session wiring and production operational configuration
- merchant/customer data
- API credentials, webhook secrets and any signing credentials
- abuse controls and operational runbooks whose disclosure would weaken the live service

The public client code must never contain a seed phrase, private wallet key, merchant API secret, server JWT secret or production database credential.
