# Release checklist

A public release or hackathon submission is complete only when all of the following are true:

## Production lineage

- [ ] `tsconfig.json`, `.gitignore`, `lib/walletBridge.ts`, and `lib/gaslessBilling.ts` match the current approved private-production Git blob SHAs.
- [ ] every production-derived public file is explicitly listed in `PROVENANCE.md`.
- [ ] no additional private-production source was copied merely for completeness or presentation.

## Secret / data boundary

- [ ] `.env` and environment variants other than `.env.example` are absent.
- [ ] seed phrases, private keys, keystores, signer material, API/webhook/JWT/database credentials and production RPC credentials are absent.
- [ ] merchant/customer data, database dumps, logs containing private data and authentication artifacts are absent.
- [ ] private deployment configuration, internal fraud/abuse thresholds and sensitive operational runbooks are absent.
- [ ] `npm run check:public` passes.
- [ ] the final diff has received a manual disclosure review in addition to automated scanning.

## Build / dependency verification

- [ ] the public `package.json` contains only dependencies required by the published client core.
- [ ] dependencies install successfully on the CI Node version.
- [ ] `npm audit --omit=dev --audit-level=high` passes.
- [ ] `npm run typecheck` passes.
- [ ] GitHub Actions shows a green CI run for the exact final public commit.

## Judge / reviewer readiness

- [ ] README accurately describes what is executable and what remains private.
- [ ] `ARCHITECTURE.md` accurately describes the BNB Chain path and trust boundary without exposing sensitive internals.
- [ ] `SECURITY.md`, `PROVENANCE.md` and `PUBLIC_PRIVATE_BOUNDARY.md` match the actual published scope.
- [ ] `CONTRIBUTING.md`, `CODEOWNERS` and the PR template enforce the same public/private boundary for future changes.
- [ ] Apache-2.0 is present and the README clearly states that source-code licensing does not grant Zynost/UQX trademark rights.
- [ ] related public repositories referenced by the README are correct and accessible.

A green CI run is necessary but not sufficient: production-derived releases require a final human review for disclosure risk.