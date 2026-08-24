"use client";

// Browser "Connect Wallet" bridge for the billing checkout modal — same
// idea as goro_app's web/wallet_bridge.js (EIP-6963 multi-wallet discovery,
// direct eth_sendTransaction), ported to TypeScript since this product is
// already a plain browser app, not a Flutter web build talking to JS via
// dart:js_interop. WalletConnect v2 (below) is the one addition beyond a
// straight EIP-6963 port — it covers what injected-wallet detection
// fundamentally can't: no extension installed at all.

import { Buffer } from "buffer";

// @walletconnect/ethereum-provider (and its dependency chain) does real
// crypto internally (topic hashing, base64/hex encoding for pairing) using
// Node's Buffer/process globals, which Next.js's client bundler does NOT
// polyfill by default (same as webpack 5/esbuild - only webpack 4 auto-
// polyfilled these). Without this, connect() silently fails partway
// through the handshake - the wallet app opens and shows its own
// "connecting..." spinner forever, because the browser side threw a
// ReferenceError mid-handshake that nothing surfaced. This is the actual
// root cause of the "MetaMask spins forever, never connects" bug on mobile.
if (typeof window !== "undefined") {
  (window as unknown as { Buffer?: unknown }).Buffer = (window as unknown as { Buffer?: unknown }).Buffer || Buffer;
  (window as unknown as { process?: unknown }).process = (window as unknown as { process?: unknown }).process || { env: {} };
  (window as unknown as { global?: unknown }).global = (window as unknown as { global?: unknown }).global || window;
}

import { EthereumProvider } from "@walletconnect/ethereum-provider";

export const WALLETCONNECT_WALLET_ID = "walletconnect";
export const WALLETCONNECT_METAMASK_ID = "metamask";
export const WALLETCONNECT_TRUSTWALLET_ID = "trustwallet";

// A public dapp identifier, not a secret (same category as the Firebase
// web API keys elsewhere in this repo) — free at cloud.reown.com. Empty =
// the WalletConnect-backed options are hidden from the picker entirely,
// same graceful-degradation convention as every other optional integration.
const WC_PROJECT_ID = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "";

export function isWalletConnectConfigured(): boolean {
  return !!WC_PROJECT_ID;
}

function _wcMetadata() {
  return {
    name: "Zynost Pay",
    description: "Non-custodial crypto checkout",
    url: typeof window !== "undefined" ? window.location.origin : "https://pay.zynost.com",
    icons: [(typeof window !== "undefined" ? window.location.origin : "") + "/zynost-pay-logo.png"],
  };
}

let _wcProviderPromise: ReturnType<typeof EthereumProvider.init> | null = null;

// showQrModal:true - the official WalletConnect modal, used only for the
// generic "Other wallets" catch-all entry.
function _getWcProvider() {
  if (!_wcProviderPromise) {
    _wcProviderPromise = EthereumProvider.init({
      projectId: WC_PROJECT_ID,
      chains: [1],
      optionalChains: [56, 137],
      showQrModal: true,
      metadata: _wcMetadata(),
    });
  }
  return _wcProviderPromise;
}

let _wcNoModalProviderPromise: ReturnType<typeof EthereumProvider.init> | null = null;

// showQrModal:false - a separate provider instance driven via the
// display_uri event, used for the dedicated MetaMask/Trust Wallet picker
// entries: one tap deep-links straight into that one wallet app instead of
// showing WalletConnect's own generic "pick a wallet" modal on top of ours.
function _getWcProviderNoModal() {
  if (!_wcNoModalProviderPromise) {
    _wcNoModalProviderPromise = EthereumProvider.init({
      projectId: WC_PROJECT_ID,
      chains: [1],
      optionalChains: [56, 137],
      showQrModal: false,
      metadata: _wcMetadata(),
    });
  }
  return _wcNoModalProviderPromise;
}

async function _connectViaDeepLink(buildUrl: (uri: string) => string): Promise<string> {
  const provider = await _getWcProviderNoModal();
  if (!provider.session) {
    const connectPromise = provider.connect();
    provider.once("display_uri", (uri: string) => {
      window.location.href = buildUrl(uri);
    });
    await connectPromise;
  }
  _activeProvider = provider as unknown as Eip1193Provider;
  const address = provider.accounts?.[0];
  if (!address) throw new Error("No account returned by WalletConnect.");
  return address;
}

export type DiscoveredWallet = { id: string; name: string; icon: string };

export type Eip1193Provider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
};

type Eip6963ProviderDetail = {
  info: { uuid: string; name: string; icon: string };
  provider: Eip1193Provider;
};

declare global {
  interface WindowEventMap {
    "eip6963:announceProvider": CustomEvent<Eip6963ProviderDetail>;
  }
}

const _discovered = new Map<string, Eip6963ProviderDetail>();
let _activeProvider: Eip1193Provider | null = null;

function _startDiscovery() {
  if (typeof window === "undefined") return;
  if ((window as unknown as { __zynostPayWalletDiscoveryStarted?: boolean }).__zynostPayWalletDiscoveryStarted) return;
  (window as unknown as { __zynostPayWalletDiscoveryStarted?: boolean }).__zynostPayWalletDiscoveryStarted = true;

  window.addEventListener("eip6963:announceProvider", (event) => {
    const detail = event.detail;
    if (!_discovered.has(detail.info.uuid)) _discovered.set(detail.info.uuid, detail);
  });
  window.dispatchEvent(new Event("eip6963:requestProvider"));
}

// Call once on module load in the browser — mirrors wallet_bridge.js
// dispatching eip6963:requestProvider immediately so wallets that already
// loaded before this ran still get picked up.
if (typeof window !== "undefined") _startDiscovery();

function _hasByNameSubstring(list: DiscoveredWallet[], needle: string): boolean {
  return list.some((w) => w.name.toLowerCase().includes(needle));
}

export function listEvmWallets(): DiscoveredWallet[] {
  const discovered = Array.from(_discovered.values()).map((d) => ({
    id: d.info.uuid,
    name: d.info.name,
    icon: d.info.icon,
  }));
  const real = discovered.length === 0 && typeof window !== "undefined" && (window as unknown as { ethereum?: unknown }).ethereum
    ? [{ id: "legacy-window-ethereum", name: "Browser Wallet", icon: "" }]
    : discovered;
  // MetaMask/Trust Wallet get their own dedicated one-tap entries with a
  // real logo (deep-link straight into that wallet app via WalletConnect)
  // - only added when not already found via a real extension/EIP-6963
  // announcement, so an installed extension always wins. "Other wallets"
  // stays as the WalletConnect-modal catch-all for everything else.
  if (isWalletConnectConfigured()) {
    if (!_hasByNameSubstring(real, "metamask")) real.push({ id: WALLETCONNECT_METAMASK_ID, name: "MetaMask", icon: "" });
    if (!_hasByNameSubstring(real, "trust")) real.push({ id: WALLETCONNECT_TRUSTWALLET_ID, name: "Trust Wallet", icon: "" });
    real.push({ id: WALLETCONNECT_WALLET_ID, name: "Other wallets", icon: "" });
  }
  return real;
}

export function hasEvmWallet(): boolean {
  return listEvmWallets().length > 0;
}

export async function connectEvm(walletId?: string): Promise<string> {
  if (walletId === WALLETCONNECT_METAMASK_ID) {
    return _connectViaDeepLink((uri) => `https://metamask.app.link/wc?uri=${encodeURIComponent(uri)}`);
  }
  if (walletId === WALLETCONNECT_TRUSTWALLET_ID) {
    return _connectViaDeepLink((uri) => `https://link.trustwallet.com/wc?uri=${encodeURIComponent(uri)}`);
  }
  if (walletId === WALLETCONNECT_WALLET_ID) {
    const provider = await _getWcProvider();
    // A previous session on this device may already be approved - skip
    // re-showing the QR modal in that case, same as any other WC dapp.
    if (!provider.session) await provider.connect();
    _activeProvider = provider as unknown as Eip1193Provider;
    const address = provider.accounts?.[0];
    if (!address) throw new Error("No account returned by WalletConnect.");
    return address;
  }
  let provider: Eip1193Provider | null = null;
  const win = window as unknown as { ethereum?: Eip1193Provider };
  if (walletId === "legacy-window-ethereum" || (!walletId && _discovered.size === 0)) {
    provider = win.ethereum ?? null;
  } else {
    const wallet = (walletId && _discovered.get(walletId)) || Array.from(_discovered.values())[0];
    provider = wallet ? wallet.provider : win.ethereum ?? null;
  }
  if (!provider) throw new Error("No EVM wallet (MetaMask, Rabby, Trust Wallet, etc.) found in this browser.");
  _activeProvider = provider;
  const accounts = (await provider.request({ method: "eth_requestAccounts" })) as string[];
  return accounts[0];
}

// amountRaw is a decimal-string integer already scaled by the token's
// decimals (e.g. "3000000" for 3.00 USDT at 6 decimals) — computed by the
// caller via amountRaw() below, never as a float, to avoid rounding a real
// payment amount.
export async function sendErc20(
  fromAddress: string,
  contractAddress: string,
  toAddress: string,
  amountRaw: string,
  chainIdHex: string,
): Promise<string> {
  const provider = _activeProvider ?? ((window as unknown as { ethereum?: Eip1193Provider }).ethereum ?? null);
  if (!provider) throw new Error("No EVM wallet connected.");

  try {
    await provider.request({ method: "wallet_switchEthereumChain", params: [{ chainId: chainIdHex }] });
  } catch {
    throw new Error("WRONG_NETWORK");
  }

  const amountHex = BigInt(amountRaw).toString(16).padStart(64, "0");
  const paddedTo = toAddress.replace("0x", "").toLowerCase().padStart(64, "0");
  const data = "0xa9059cbb" + paddedTo + amountHex;

  return (await provider.request({
    method: "eth_sendTransaction",
    params: [{ from: fromAddress, to: contractAddress, data }],
  })) as string;
}

// Converts a USD amount (always exactly 2 decimal places — see
// merchant_service.PRO_MONTHLY_PRICE_USD / fee_owed_usd) to the raw integer
// string a stablecoin transfer needs, via cents first so this is exact
// integer math, never float rounding on a real payment amount. decimals
// must come from wallet_connect_meta (BSC's USDT/USDC use 18, not the 6
// every other chain here uses).
export function amountRaw(amountUsd: number, decimals: number): string {
  const cents = Math.round(amountUsd * 100);
  return (BigInt(cents) * BigInt(10) ** BigInt(decimals - 2)).toString();
}

export function isMobileBrowser(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

// Deep-links that reopen the CURRENT page inside a wallet app's own
// built-in browser, where window.ethereum becomes available — the site
// then runs the exact same EIP-6963 flow above, just inside that webview.
export function walletDeepLinks(currentUrl: string): { name: string; url: string }[] {
  const bare = currentUrl.replace(/^https?:\/\//, "");
  return [
    { name: "MetaMask", url: `https://metamask.app.link/dapp/${bare}` },
    { name: "Trust Wallet", url: `https://link.trustwallet.com/open_url?coin_id=60&url=${encodeURIComponent(currentUrl)}` },
  ];
}
