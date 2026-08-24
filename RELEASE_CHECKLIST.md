# Release checklist

A public release is complete only when all of the following are true:

- [ ] `tsconfig.json`, `.gitignore`, `lib/walletBridge.ts`, and `lib/gaslessBilling.ts` match the current approved private-production Git blob SHAs.
- [ ] the public `package.json` contains only dependencies required by the published client core.
- [ ] `.env` and credential-bearing files are absent.
- [ ] `node scripts/check-public-repo.mjs` passes.
- [ ] dependencies install successfully on the CI Node version.
- [ ] `npm audit --omit=dev --audit-level=high` passes.
- [ ] `npx tsc --noEmit` passes.
- [ ] GitHub Actions shows a green run for the final public content.
- [ ] README, SECURITY, provenance and public/private boundary match the actual published scope.
