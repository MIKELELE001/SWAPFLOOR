# SwapFloor SKILL.md

Agent instructions for SwapFloor — a live OTC BTC ↔ USDT negotiation arena built on IntercomSwap.

---

## What SwapFloor Does

SwapFloor is a public order board + private negotiation room that bridges human traders with the IntercomSwap protocol. It handles the pre-swap negotiation layer — the part that happens before an RFQ is posted to the IntercomSwap sidechannel.

**SwapFloor sits between humans and IntercomSwap:**
```
Human Trader A → SwapFloor (negotiate) → IntercomSwap RFQ → Peer Network → Swap Execution
```

---

## How the RFQ is Generated

When two traders lock a deal in SwapFloor, the app generates a complete IntercomSwap RFQ command:

```bash
scripts/rfq-taker-peer.sh swap-taker 49222 \
  --rfq-channel 0000intercomswapbtcusdt \
  --btc-sats <AMOUNT_IN_SATS> \
  --usdt-amount <AMOUNT_IN_MICRO_USDT> \
  --agreed-rate <RATE_USD_PER_BTC> \
  --run-swap 1
```

**Parameters:**
- `--btc-sats`: BTC amount in satoshis (e.g. 100000 = 0.001 BTC)
- `--usdt-amount`: Net USDT after 0.2% fee in micro-USDT (1 USDT = 1,000,000)
- `--agreed-rate`: Negotiated USD/BTC rate
- `--run-swap 1`: Execute immediately after RFQ match

---

## Agent Instructions

### Step 1 — Start IntercomSwap peer
```bash
scripts/run-swap-maker.sh swap-maker 49222 0000intercomswapbtcusdt
```

### Step 2 — Open SwapFloor
Open `swapfloor.html` in a browser. The app automatically loads live BTC price from CoinGecko and trade feed from Binance.

### Step 3 — Post or match an order
- Post a new order (type, BTC amount, target rate, nickname)
- Or click ⚡ MATCH on an existing order

### Step 4 — Negotiate in the room
- Use sliders to adjust Seller rate and Buyer rate
- Watch the Deal Zone — it turns green when within 2% spread
- Smart Advisor gives real-time fairness analysis
- Negotiate until the Lock Deal button activates

### Step 5 — Lock and execute
- Click Lock Deal → confetti + deal receipt generated
- Copy the RFQ command
- Paste into terminal with IntercomSwap peer running
- Swap executes: BTC via Lightning → USDT via Solana HTLC

---

## Key Parameters

| Parameter | Value |
|---|---|
| Sidechannel | 0000intercomswapbtcusdt |
| SC-Bridge port | 49222 |
| Fee | 0.2% (0.1% platform + 0.1% trade) |
| Deal zone threshold | <2% spread between seller and buyer |
| Order expiry | 10 minutes |
| Room timer | 10 minutes |
| Settlement | Lightning BTC → Solana USDT HTLC |
| Refund window | 72h (IntercomSwap default) |

---

## Data Sources Used

- CoinGecko API: live BTC price, 24H change, volume, market cap
- Binance public API: live BTCUSDT trade feed
- localStorage: order persistence, reputation tracking

---

## Reputation System

SwapFloor tracks trader reputation locally:
- `sf_rep.deals` — completed deals counter
- `sf_rep.fairScores` — array of fairness scores per deal
- `sf_rep.bestSpread` — lowest spread achieved
- `sf_rep.posted` — total orders posted

Badges unlock at: 1 deal (Fair Trader), 5 deals (Power Trader), 10 deals (Master Trader).

---

## Upstream

This repo is based on:
- IntercomSwap: https://github.com/TracSystems/intercom-swap
- Intercom: https://github.com/Trac-Systems/intercom

---

## Trac Address

> **trac1qhpj64n8ywsl20cwyjl9n99rztzxhqqh3amfre7q3y4c66gh3lysyv7fc4**
