# Zynost Pay — Merchant Dashboard

The merchant-facing dashboard for Zynost Pay, a non-custodial crypto payment gateway. Merchants sign up, connect their own wallet (via xpub), and manage everything needed to accept crypto payments without ever handing custody of funds to a third party.

**Live:** https://pay.zynost.com

## What it does

- Merchant onboarding and API key management (one-time secret reveal, rotation with a grace period, full audit history).
- Webhook configuration and signature-verification reference code in multiple languages.
- Non-custodial payout setup — merchants provide their own extended public key (xpub); Zynost never holds a spendable key.
- Billing (flat-fee or volume-based), usage tracking, and an admin panel for operational oversight (plan management, xpub-change approval workflow, merchant support).
- Real-time notifications for account events (payments received, requests approved/rejected).

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS · deployed on Vercel

## Status

In active production use by real merchants processing live crypto payments.

---

This repository is a public overview of a closed-source production system. Source code is not published here — the same practice most fintech dashboards (Stripe, Coinbase, etc.) follow for their core products.
