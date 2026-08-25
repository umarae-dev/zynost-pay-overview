## Summary

Describe the public-safe change and why it belongs in this repository.

## Verification

- [ ] `npm audit --omit=dev --audit-level=high` passes.
- [ ] `npm run check:public` passes.
- [ ] `npm run typecheck` passes.
- [ ] I reviewed the diff for credentials, private URLs/configuration, merchant/customer data and private operational material.
- [ ] No private production source was copied unless it was explicitly approved for public release and documented in `PROVENANCE.md`.
- [ ] Public/private boundary documentation remains accurate.

## Security boundary

Do not include seed phrases, private keys, API/webhook/JWT/database credentials, production RPC secrets, user data, private deployment details, fraud/abuse thresholds or internal operational runbooks.