"use client";

// Client-side half of gasless checkout for a merchant's OWN bill to Zynost
// (BillingPaymentPanel.tsx) — mirrors goro_app's web/wallet_bridge.js
// zynostGaslessDeriveOwner/zynostGaslessSignHash functions exactly (same
// fixed message, same keccak256(signature)-as-private-key derivation, same
// EIP-191 personal_sign-style hash signing), just as a real npm `ethers`
// dependency instead of a CDN script tag, since this is already a bundled
// Next.js app. Pairs with the backend's app/routes/gasless_billing.py,
// which reuses gasless_checkout_service.py completely unchanged — only the
// invoice lookup differs from the customer-facing gasless flow, none of
// the actual signing/verification logic is duplicated or reimplemented.

import { Wallet, keccak256, getBytes } from "ethers";
import type { Eip1193Provider } from "./walletBridge";

const ZYNOST_GASLESS_MESSAGE =
  "Zynost Pay — sign to access your gasless smart wallet. This signature " +
  "is free (no gas) and never leaves your device unsigned.";

let _ownerWallet: Wallet | null = null;

// Signs the same fixed message every time with whichever EVM wallet is
// currently connected - the resulting signature deterministically
// re-derives the exact same smart-account owner key on every call, so
// nothing about it is ever stored: losing local state (a refresh, closing
// the tab) just means signing once more to get back to the same key and
// the same smart-account address, with anything already sent there intact.
export async function deriveGaslessOwner(): Promise<string> {
  const win = window as unknown as { ethereum?: Eip1193Provider };
  const provider = win.ethereum;
  if (!provider) throw new Error("No EVM wallet (MetaMask, Rabby, Trust Wallet, etc.) found in this browser.");
  const accounts = (await provider.request({ method: "eth_requestAccounts" })) as string[];
  const connectedAddress = accounts[0];
  if (!connectedAddress) throw new Error("No EVM wallet (MetaMask, Rabby, Trust Wallet, etc.) found in this browser.");
  const signature = (await provider.request({
    method: "personal_sign",
    params: [ZYNOST_GASLESS_MESSAGE, connectedAddress],
  })) as string;
  const ownerPrivateKey = keccak256(signature);
  _ownerWallet = new Wallet(ownerPrivateKey);
  return _ownerWallet.address;
}

// Signs a raw 32-byte hash (hex string) with the derived owner key. ethers'
// Wallet.signMessage applies the standard EIP-191
// "\x19Ethereum Signed Message:\n32" prefix before signing when given raw
// bytes - the exact same prefix SimpleAccount.sol's
// hash.toEthSignedMessageHash() + .recover() expects on-chain, so this
// must never be swapped for a raw/unprefixed signature.
export async function signGaslessHash(hashHex: string): Promise<string> {
  if (!_ownerWallet) throw new Error("Gasless owner wallet not derived yet — call deriveGaslessOwner() first.");
  return await _ownerWallet.signMessage(getBytes(hashHex));
}
