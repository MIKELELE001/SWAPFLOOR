# SwapFloor — Live OTC BTC ↔ USDT Negotiation Arena

> A real-time peer-to-peer OTC trading floor built on [IntercomSwap](https://github.com/TracSystems/intercom-swap). Find strangers, negotiate live, lock deals, and execute on IntercomSwap — all in one cinematic interface.

**Live Site:** https://MIKELELE001.github.io/swapfloor/swapfloor.html

---

## What is SwapFloor?

SwapFloor is a public OTC negotiation arena where BTC sellers and USDT buyers find each other anonymously, negotiate a fair rate in real time, and generate a ready-to-execute IntercomSwap RFQ command — without ever knowing each other beforehand.

**The full flow:**
```
POST ORDER (public floor)
      ↓
MATCH (click any order)
      ↓
NEGOTIATE (private room · sliders · deal zone)
      ↓
LOCK DEAL (confetti + RFQ generated)
      ↓
EXECUTE (paste RFQ into IntercomSwap peer)
```

---

## Features

**Public Order Board**
- Post Buy or Sell BTC orders publicly
- Orders stored in localStorage and persist across sessions
- Orders auto-expire after 10 minutes with live countdown
- Fairness badges — FAIR / OK / SPREAD based on vs market rate
- Stealth Mode — hide your nickname, negotiate anonymously

**Negotiation Room**
- Dual sliders for Seller rate and Buyer rate
- Animated Deal Zone — lights up green when rates overlap within 2%
- Smart Rate Advisor — fairness score, market comparison, spread analysis
- 10-minute countdown timer with color urgency
- Lock Deal button activates when deal zone is live
- Confetti explosion on deal lock

**Live Market Panel**
- Real BTC/USDT price from CoinGecko API (refreshed every 30s)
- Market Mood visualizer — Extreme Fear to Extreme Greed
- Volatility meter — 12-bar intensity display
- 24H stats: Volume, Market Cap, High, Low
- Live trade feed from Binance public API (refreshed every 9s)

**Deal Generator**
- Complete IntercomSwap RFQ command generated on deal lock
- Shows BTC amount, agreed rate, gross USDT, fee breakdown, net USDT
- One-click copy to clipboard

**Reputation Layer (localStorage)**
- Tracks total completed deals
- Average fairness score across all deals
- Best spread achieved
- Badges: Active Poster → Fair Trader → Power Trader → Master Trader

---

## How to Use

### Option 1 — Open directly
Download `swapfloor.html` and open it in any browser. No server needed.

### Option 2 — GitHub Pages (live site)
Visit: `https://MIKELELE001.github.io/swapfloor/swapfloor.html`

### To execute a real swap after locking a deal
1. Install IntercomSwap: `npm install` in this repo
2. Start your peer: `scripts/run-swap-maker.sh swap-maker 49222 0000intercomswapbtcusdt`
3. Copy the RFQ command from SwapFloor
4. Paste it into your terminal

---

## Data Sources

| Data | Source | Refresh |
|---|---|---|
| BTC price + 24h change | CoinGecko API | 30s |
| 24H volume + market cap | CoinGecko API | 30s |
| High / Low | CoinGecko API | 30s |
| Live trade feed | Binance public API | 9s |
| Swap fee (0.2%) | IntercomSwap protocol | Fixed |

All data is real. No fake numbers. No simulations.

---

## Built On

Fork of **[IntercomSwap](https://github.com/TracSystems/intercom-swap)** by Trac Systems.

SwapFloor adds a complete OTC negotiation UI on top of the IntercomSwap protocol stack.

---

## GitHub

**Username:** MIKELELE001
**Repo:** https://github.com/MIKELELE001/swapfloor

---

## Trac Address

> **trac1qhpj64n8ywsl20cwyjl9n99rztzxhqqh3amfre7q3y4c66gh3lysyv7fc4**

---

## License

MIT — same as upstream IntercomSwap.
