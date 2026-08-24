# Release checklist

A public release is complete only when all of the following are true:

- [ ] `package.json`, `tsconfig.json`, `.gitignore`, `lib/walletBridge.ts`, and `lib/gaslessBilling.ts` match the current approved private-production Git blob SHAs.
- [ ] `.env` and credential-bearing files are absent.
- [ ] `node scripts/check-public-repo.mjs` passes.
- [ ] dependencies install successfully on the CI Node version.
- [ ] `npx tsc --noEmit` passes.
- [ ] GitHub Actions shows a green run for the final public content.
- [ ] README, SECURITY, provenance and public/private boundary match the actual published scope.
