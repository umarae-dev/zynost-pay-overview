# Zynost Pay — Non-Custodial Crypto Payments for Merchants

> **A developer-first crypto payment platform where merchants keep custody, customers get a modern checkout, and BNB Chain can remove the gas-friction problem.**

Zynost Pay is the merchant-facing product layer of the Zynost payment stack. It gives businesses a hosted crypto checkout, API access, signed webhooks, order analytics, wallet settlement controls, billing and ERC-4337 gasless payments — while keeping merchant funds outside Zynost custody.

**Live:** https://pay.zynost.com  
**Primary BNB experience:** BSC stablecoin checkout + ERC-4337 gas sponsorship  
**Custody model:** merchant-controlled settlement  
**Developer API:** https://api.zynost.com

---

## What Zynost Pay is solving

Crypto checkout is often more complicated than the payment itself:

- customers choose the wrong network;
- users hold USDT/USDC but no native gas token;
- merchants depend on provider-controlled payout wallets;
- API/webhook setup is fragmented;
- payment reconciliation becomes a manual support problem;
- merchant branding disappears inside a generic processor page.

Zynost Pay brings these pieces into one merchant system while preserving a simple rule:

> **The payment should settle to infrastructure controlled by the merchant, not sit in a Zynost payout wallet waiting to be released.**

---

## Product architecture

```text
Merchant application
        │
        │ create checkout
        ▼
Zynost Pay API
        │
        ├─────────────── Hosted Checkout
        │                     │
        │                     ▼
        │               Customer Wallet
        │                     │
        │            normal or gasless payment
        │                     │
        ▼                     ▼
Merchant-controlled settlement address
        │
        ▼
On-chain verification
        │
        ▼
Signed webhook + merchant dashboard
```

The merchant dashboard is the control plane. The gateway backend performs order creation and verification. The separate Zynost Paymaster layer handles eligible ERC-4337 gas sponsorship on BNB Smart Chain.

---

## BNB Smart Chain as a first-class payment rail

BNB Chain is not treated as a checkbox in a network selector. It is central to the payment UX because low-cost EVM settlement makes stablecoin checkout practical for merchants and customers.

Current BNB-oriented product capabilities include:

- BSC USDT / USDC checkout;
- merchant-controlled EVM settlement addresses;
- connected-wallet payment flows;
- WalletConnect support;
- ERC-4337 smart accounts;
- gasless checkout through Zynost Paymaster;
- order-level payment verification and reconciliation;
- merchant controls for enabling/disabling the gasless customer option.

The objective is simple: **make BNB Chain feel like a normal modern payment rail instead of requiring every customer to understand gas mechanics first.**

---

## Hosted checkout

Every order can be presented through a hosted checkout page designed for real merchant use rather than a developer-only transaction screen.

Merchants can control customer-facing elements such as:

- business identity;
- merchant logo;
- accent color;
- supported payment experience;
- gasless-checkout availability.

The checkout remains visibly merchant-oriented while still communicating the settlement and network state clearly.

### Customer flow

```text
Amount due
   │
   ▼
Choose asset / network
   │
   ├── Normal wallet payment
   │
   └── Gasless BNB Chain payment
           │
           ▼
      ERC-4337 smart account
           │
           ▼
      sponsored settlement
   │
   ▼
Merchant receives confirmed payment
```

---

## Merchant dashboard

The private production frontend contains dedicated sections rather than one crowded settings page.

### Overview

The merchant home surface tracks operational setup and payment activity, including:

- total orders;
- paid and pending orders;
- tracked revenue;
- conversion rate;
- recent order activity;
- billing state;
- wallet / webhook / API readiness;
- BNB gasless availability.

### Orders

Merchants can review payment state and order-level settlement information rather than treating the blockchain as the dashboard.

### API Keys

API credentials are managed separately from general settings, with rotation designed for production integrations rather than copy-pasting permanent secrets forever.

### Webhooks

Merchants configure a delivery endpoint and use a merchant-specific signing secret to authenticate payment events.

### Settlement / xpub

EVM receiving addresses are derived from merchant-supplied public wallet information. High-risk payout-configuration changes are deliberately treated differently from ordinary UI preferences.

### Checkout Page

Merchants can customize hosted-checkout branding and choose whether gasless BNB checkout is offered to their customers.

### Gasless

A dedicated dashboard surface explains the ERC-4337 customer journey, sponsorship boundaries and BNB-specific status.

### Billing

Merchants can see usage, plan status and billing-model information without mixing it into payment operations.

### Security

Account-security controls are separated from payment configuration.

---

## What "non-custodial" means here

Zynost Pay's commercial model does not depend on holding merchant payment balances.

| Custodial processor model | Zynost Pay model |
|---|---|
| Customer funds enter provider-controlled wallet | Customer funds settle to merchant-controlled infrastructure |
| Merchant waits for payout | No provider payout queue for the original payment |
| Provider may control withdrawal timing | Merchant controls its own wallet operations |
| Payment and custody are coupled | Payment verification and custody are separated |

For EVM orders, the gateway can derive watch-only child addresses from a merchant's extended public key without receiving the private material required to spend from those addresses.

**An xpub is not a seed phrase and is not a private spending key.** It allows address derivation and observation, not arbitrary withdrawal of merchant funds.

---

## Gasless checkout on BNB Smart Chain

The gasless flow targets a common real-world failure:

> **The customer has the stablecoin, but no BNB for gas.**

Instead of forcing the customer to stop checkout, acquire BNB and return later, Zynost Pay can use an ERC-4337 smart-account flow with the separate **[Zynost Paymaster](https://github.com/umarae-dev/zynost-paymaster-overview)** infrastructure.

```text
Customer connects wallet
        │
        ▼
Free ownership signature
        │
        ▼
Recoverable smart-account address
        │
        ▼
USDT / USDC available at smart account
        │
        ▼
Order-bound transfer prepared
        │
        ▼
Customer authorizes exact operation
        │
        ▼
Zynost sponsors eligible network gas
        │
        ▼
Merchant-owned checkout address
```

Important boundaries:

- the paymaster sponsors network gas, not the purchase amount;
- merchant settlement remains separate from the paymaster gas balance;
- the customer authorizes the operation;
- the server determines the real order destination from server-side order state;
- the gasless path settles into the same order-verification pipeline as a normal payment;
- merchants can disable the gasless option without changing the rest of their integration.

---

## Developer experience

Zynost Pay is designed so a merchant can start with the hosted checkout and later build a custom experience using the same backend rails.

The developer surface includes:

- authenticated checkout creation;
- order-status retrieval;
- hosted-checkout URLs;
- signed payment webhooks;
- gasless smart-account initialization/status/preparation/submission flows;
- documented error handling;
- billing information;
- settlement guidance.

Developer documentation is available at:

**https://pay.zynost.com/docs**

The commercial API key is intended for server-side merchant integrations. Browser-facing gasless interactions are scoped separately so the merchant's private API credential does not need to be shipped to customer-side JavaScript.

---

## Merchant security model

Zynost Pay separates different classes of secrets and actions instead of treating every setting as equivalent.

| Area | Security principle |
|---|---|
| API access | Server-side credentials with controlled rotation |
| Webhooks | Per-merchant HMAC signing secret |
| Settlement configuration | Higher-risk change workflow |
| Account access | Authentication + security controls |
| Gas sponsorship | Separate paymaster policy and on-chain limits |
| Payment custody | Merchant wallet remains outside Zynost control |

Security is designed around **blast-radius reduction**: compromise of one subsystem should not automatically provide authority over unrelated payment funds.

---

## Supported networks

Current gateway architecture includes:

| Network | Customer experience | Assets |
|---|---|---|
| **BNB Smart Chain** | Normal + gasless checkout | USDT, USDC |
| Ethereum | Standard EVM checkout | USDT, USDC |
| Polygon | Standard EVM checkout | USDT, USDC |
| Solana | Solana payment flow | USDT, USDC |

BNB Smart Chain currently has the deepest product integration because it also powers the live ERC-4337 gasless path.

---

## Pricing

Zynost Pay is designed to stay accessible to small developers while still supporting merchant scale.

- **Free:** up to 50 orders per month;
- **Pro:** $19/month for unlimited orders;
- **Volume:** 0.3% of successfully paid volume.

The billing architecture is separated from custody: pricing the gateway service does not require Zynost to hold the merchant's customer payments.

---

## Relationship to the backend infrastructure

This repository describes the **merchant product/UI layer**.

Related public architecture repositories:

- **[Zynost Gateway API](https://github.com/umarae-dev/zynost-gateway-backend-overview)** — order creation, watch-only address derivation, payment verification, webhooks and merchant logic;
- **[Zynost Paymaster](https://github.com/umarae-dev/zynost-paymaster-overview)** — ERC-4337 BNB gas sponsorship and its security model.

```text
Zynost Pay UI
      │
      ▼
Gateway API
      │
      ├──── normal settlement verification
      │
      └──── gasless flow
                  │
                  ▼
             Paymaster
                  │
                  ▼
          BNB Smart Chain
```

---

## Production vs. public repository boundary

This repository is a **public product and architecture overview**, not a mirror of the production frontend repository.

### Public here

- product architecture;
- merchant workflow;
- BNB integration model;
- non-custodial trust boundaries;
- dashboard capabilities;
- developer experience;
- gasless-checkout concepts;
- links to related public technical overviews.

### Kept private

- production source code;
- environment variables;
- internal API wiring not intended for public reuse;
- authentication/session implementation details;
- production operational configuration;
- private customer/merchant data;
- any credential or signing secret.

No seed phrase, private key, API secret or merchant/customer credential should ever be committed to this repository.

---

## Open-source / BNB developer track

The commercial Zynost Pay product remains private production software. A separately scoped **open-source BNB developer/hackathon component** is being prepared so useful BNB-native technology can be inspected and reproduced without exposing the entire live merchant platform.

The public component will use non-production configuration and will be linked here when ready.

---

## Broader Zynost ecosystem

```text
Zynost Intelligence
        │
        ▼
Zynost Wallet
        │
        ├───────────────┐
        ▼               ▼
   Zynost Pay      UQX ecosystem
        │
        ▼
 Zynost Paymaster
        │
        ▼
  BNB Smart Chain
```

The longer-term direction is an integrated crypto stack spanning **decision intelligence, self-custody, merchant payments, account abstraction and BNB-native ecosystem utility**.

---

## Technology

Next.js · React · TypeScript · Tailwind CSS · WalletConnect · ethers.js · Firebase · Framer Motion · Three.js / React Three Fiber · Vercel

The merchant frontend talks to the separate Zynost Gateway API rather than embedding custody or chain-verification logic directly into the UI.

---

## Status

**Active production product.**

The private frontend includes live merchant dashboard, order management, checkout customization, developer documentation, billing, security and BNB gasless-payment interfaces.

For responsible security reporting, see [`SECURITY.md`](SECURITY.md).
