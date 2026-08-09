# Zynost Pay — Merchant Dashboard

**A Zynost product, built from a real need.**

Zynost Pay is the dashboard merchants use to run a non-custodial crypto payment integration end to end — connect a wallet, generate API credentials, wire up webhooks, and watch orders settle directly to their own address, with no custody step anywhere in between.

**Live:** https://pay.zynost.com

## Where this came from

Zynost's first product wasn't a payment gateway — it was a decision-intelligence platform for crypto traders, built around 18 specialist AI agents that analyze a coin from every angle and hand back one clear, reasoned verdict. That product needed to charge for subscriptions, and every custodial payment processor we evaluated wanted to hold customer funds before releasing them on their own schedule — freezes, payout minimums, and multi-day delays included. So the non-custodial payment layer was built for internal use first, ran against real subscription revenue until it was genuinely proven, and only then became its own standalone product. One account and one login (shared 2FA included) covers both — Zynost the trading platform, and Zynost Pay the gateway it grew out of.

## What a merchant actually sees

The dashboard is split into focused, single-purpose sections rather than one crowded settings page:

- **Orders** — every checkout, filterable by status, searchable by reference, exportable to CSV, with a receive address and paid-amount breakdown per order.
- **API** — the active key's ID (masked by default, revealable), a one-time full-key reveal on generation or rotation, and a complete history of every key ever issued.
- **Webhooks** — set the delivery URL, rotate the signing secret (takes effect immediately), and copy ready-to-use HMAC verification code in Python, PHP, or Node.js.
- **Xpub** — the merchant's own extended public key for EVM chains, a Solana payout address field, a downloadable offline tool to generate a fresh wallet, and a request form for changing it (always admin-reviewed, never instant, since it's the one setting that redirects every future payment).
- **Withdraw** — instructions and a downloadable offline script that sweeps funds from every per-order address into one destination wallet the merchant controls — nothing routes through Zynost.
- **Reserve** — funding the small per-merchant gas-reserve address that automatically covers gas during a sweep, so a merchant never manually tops up gas order by order.
- **Billing** — switch between flat and pay-as-you-go pricing, see the current cycle's volume and fees, and upgrade to Pro.
- **Security** — password changes and TOTP two-factor authentication, shared with the main Zynost login.

## What "non-custodial" actually buys a merchant

The pitch isn't abstract — it's a direct trade-off against how custodial gateways work:

| Custodial gateways | Zynost Pay |
|---|---|
| Funds sit in the provider's wallet until payout | Funds land directly in your wallet, instantly |
| Payout schedules, minimums, and delays | No payout step — there's nothing to release |
| Provider can freeze or hold your balance | No one can freeze what they never held |
| You trust their custody + security practices | You trust your own wallet, same as always |

The mechanism behind it: an xpub lets the gateway derive unlimited receive addresses that belong to the merchant's wallet, but it's mathematically impossible to use it to spend from that wallet — no private key or seed phrase is ever involved. It's the same watch-only principle real hardware wallets use for address-book features, applied to payment processing.

## Pricing

Free covers up to 50 orders a month. Pro is a flat $19/month for unlimited orders. Merchants who'd rather not think about tiers can choose pay-as-you-go instead — no cap at all, just 0.3% of what actually gets paid.

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS · deployed on Vercel

## Status

In active production use by real merchants processing live crypto payments — including Zynost's own subscription revenue, running through the same dashboard.

---

This repository is a public overview of a closed-source production system. Source code isn't published here — the same practice most fintech dashboards follow for their core products.
