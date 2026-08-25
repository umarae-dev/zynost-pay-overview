# Contributing

Zynost Pay is a live payment product, so this public repository has a strict disclosure boundary. Contributions are welcome only for the public client-core scope and public-only tooling/documentation.

## Safe contribution scope

Good contributions include:

- browser-wallet compatibility fixes;
- standards-compliant EIP-1193 / EIP-6963 improvements;
- WalletConnect interoperability fixes;
- TypeScript correctness;
- public test/tooling improvements;
- documentation and developer-experience improvements;
- security hardening that does not disclose private production controls.

## Never submit

Do not commit or paste:

- `.env` files or real environment values;
- seed phrases, mnemonics, wallet private keys, keystores or signing material;
- merchant API keys or webhook secrets;
- JWT/session secrets;
- database URLs, passwords or dumps;
- production RPC credentials;
- private deployment configuration;
- customer or merchant records;
- internal fraud/abuse thresholds or private operational runbooks;
- source copied from the private product unless it has been explicitly approved for public release.

If a change depends on private production behavior, describe the public interface or expected behavior instead of copying private implementation details.

## Before opening a pull request

Run:

```bash
npm install
npm audit --omit=dev --audit-level=high
npm run check:public
npm run typecheck
```

Then manually inspect the diff for credentials, private URLs/configuration, user data and proprietary operational material.

## Security reports

Do not open a public issue for a vulnerability that could affect live funds, authentication, merchant data, settlement, sponsorship or infrastructure. Follow `SECURITY.md` instead.

## License

By contributing, you agree that your contribution is licensed under the repository's Apache-2.0 license. Zynost and UQX names, marks and branding are not granted as trademarks by the source-code license.