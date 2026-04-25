<div align="center">

```
 ██████╗██╗    ██╗████████╗     ██████╗ ██████╗  █████╗  ██████╗██╗     ███████╗
██╔════╝██║    ██║╚══██╔══╝    ██╔═══██╗██╔══██╗██╔══██╗██╔════╝██║     ██╔════╝
██║     ██║ █╗ ██║   ██║       ██║   ██║██████╔╝███████║██║     ██║     █████╗  
██║     ██║███╗██║   ██║       ██║   ██║██╔══██╗██╔══██║██║     ██║     ██╔══╝  
╚██████╗╚███╔███╔╝   ██║       ╚██████╔╝██║  ██║██║  ██║╚██████╗███████╗███████╗
 ╚═════╝ ╚══╝╚══╝    ╚═╝        ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚══════╝╚══════╝
```

### ⚡ Real-Time Crypto Prediction Intelligence ⚡

[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-Latest-00C7B7?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![SQLite](https://img.shields.io/badge/SQLite-Database-07405E?style=for-the-badge&logo=sqlite&logoColor=white)](https://sqlite.org)
[![Binance](https://img.shields.io/badge/Binance-Live_Data-F0B90B?style=for-the-badge&logo=binance&logoColor=black)](https://binance.com)
[![OpenRouter](https://img.shields.io/badge/OpenRouter-LLM-6E42C1?style=for-the-badge&logo=openai&logoColor=white)](https://openrouter.ai)
[![License](https://img.shields.io/badge/License-MIT-22C55E?style=for-the-badge)](LICENSE)

<br/>

> **5 Assets · 4 Prediction Horizons · Kelly Risk Sizing · Live Dashboard · Auto-Verification**

<br/>

```
┌─────────────────────────────────────────────────────────┐
│  BTC ↑ UP   51.6%  │  ETH ↓ DOWN  50.8%  │  SOL ↑ UP  │
│  KELLY: 0.30%      │  KELLY: 0.53%        │  KELLY: —  │
│  RISK: NORMAL ✓    │  RISK: HIGH_RISK ⚠️  │  PENDING   │
└─────────────────────────────────────────────────────────┘
         ROLLING ACCURACY: 55.95%  |  PREDICTIONS: 268
```

</div>

---

## 🧠 What Is This?

CWT Predictions Agent is a **production-grade, multi-agent crypto forecasting system** built for the CrowdWisdomTrading internship assessment. It monitors **BTC, ETH, SOL, DOGE, and BNB** in real-time — every 5 minutes the Hermes orchestrator kicks off a 5-step pipeline:

- 🔍 Scans **Polymarket** for live prediction market odds
- 📊 Pulls **1000 OHLCV bars** from Binance (no API key needed)
- 🤖 Runs **Kronos AI** time-series forecasting across 4 horizons
- 💰 Calculates **Kelly Criterion** optimal position sizing
- ✅ **Verifies** predictions after 5 minutes and logs accuracy

Everything streams live to a cyberpunk trading dashboard built from scratch.

---

## 🏗️ Architecture

```
╔══════════════════════════════════════════════════════════════════╗
║                    HERMES ORCHESTRATOR (LLM)                     ║
║                    Model: Llama 3.1 8B via OpenRouter            ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  ║
║  │  🔍 MARKET  │  │  📊 DATA    │  │  🤖 PREDICTION          │  ║
║  │   SEARCH    │→ │   FETCH     │→ │     ENGINE              │  ║
║  │  Polymarket │  │  Binance    │  │   Kronos AI Model       │  ║
║  │  Gamma API  │  │  1000 bars  │  │   4 time horizons       │  ║
║  └─────────────┘  └─────────────┘  └───────────┬─────────────┘  ║
║                                                 │                ║
║  ┌─────────────────────────────┐  ┌─────────────▼─────────────┐  ║
║  │  ✅ VERIFICATION LOOP       │  │  💰 RISK AGENT             │  ║
║  │  Runs after 5 minutes       │  │  Kelly Criterion           │  ║
║  │  Marks correct/incorrect    │  │  Arbitrage Detection       │  ║
║  │  Updates rolling accuracy   │  │  Position Sizing           │  ║
║  └──────────────┬──────────────┘  └───────────────────────────┘  ║
╚═════════════════╪════════════════════════════════════════════════╝
                  │
    ┌─────────────▼──────────────┐
    │   💾 SQLite Database        │
    │   predictions.db            │
    └─────────────┬──────────────┘
                  │
    ┌─────────────▼──────────────┐
    │   🚀 FastAPI REST API       │
    │   localhost:8000            │
    └─────────────┬──────────────┘
                  │
    ┌─────────────▼──────────────┐
    │   🖥️  Live Dashboard        │
    │   Cyberpunk Trading UI      │
    │   Chart.js · Auto-refresh   │
    └────────────────────────────┘
```

---

## ✨ Features

### 🔮 Prediction Engine
| Feature | Details |
|---|---|
| **Horizons** | 5min · 15min · 3×5min aggregated · 1-hour |
| **Model** | Kronos time-series AI (momentum + rolling stats) |
| **Output** | Direction (UP/DOWN) + Confidence score |
| **Conflict Detection** | Cross-horizon disagreement triggers risk flags |
| **Verification** | Actual vs predicted checked after every cycle |

### 💰 Risk Management
| Flag | Condition | Kelly Adjustment |
|---|---|---|
| `✅ NORMAL` | Signals align across horizons | Standard half-Kelly |
| `🟢 HIGH_CONFIDENCE` | All horizons agree | Full fraction applied |
| `🟡 TREND_CONFLICT` | 5min vs 1h disagree | −30% reduction |
| `🔴 HIGH_RISK` | 15min vs 3×5min disagree | −50% reduction |

> Predictions below **0.1% Kelly** are auto-skipped to preserve capital.

### 📡 Data Pipeline
```
Binance Public API  ──→  1000 x 1min OHLCV candles  ──→  Kronos Model
Polymarket Gamma API ──→  Live crypto market odds    ──→  Kelly Calculator
```
- ✅ No API keys required for Binance or Polymarket
- ✅ 5-second price cache to prevent rate limiting
- ✅ Retry logic with exponential backoff
- ✅ Local JSON cache for OHLCV data

### 🖥️ Live Dashboard
- 🌑 **Dark/Light mode** toggle with localStorage persistence
- 📈 **Interactive Chart.js** price charts with prediction overlays
- 🃏 **5 asset cards** with animated confidence gauges + sparklines
- 📊 **Market sentiment banner** (bullish/bearish ratio live)
- 🔴 **Live telemetry feed** — sortable, filterable, paginated
- 📤 **CSV export** of full prediction history
- ⌨️ **Keyboard shortcuts** for power users
- 🔄 **Auto-refresh** every 30 seconds, no page reload

---

## 🚀 Quick Start

### 1. Clone the repo
```bash
git clone https://github.com/nmnroy/CWT-Predictions.git
cd CWT-Predictions/cwt-predictions-agent
```

### 2. Install dependencies
```bash
pip3 install -r requirements.txt
pip3 install cryptography aiofiles
```

### 3. Install Kronos (ML model)
```bash
git clone https://github.com/shiyu-coder/Kronos
pip3 install -r Kronos/requirements.txt
```

### 4. Configure environment
```bash
cp .env.example .env
```

Edit `.env`:
```env
OPENROUTER_API_KEY=your_key_here
APIFY_API_TOKEN=your_token_here
BANKROLL_AMOUNT=1000
ASSETS=["BTC","ETH","SOL","DOGE","BNB"]
PREDICTION_INTERVAL_MINUTES=5
```

### 5. Run
```bash
# Full loop mode (runs every 5 minutes)
python3 main.py

# Run once and exit
python3 main.py --once

# Specific assets
python3 main.py --asset BTC,ETH --interval 10
```

**Dashboard** → `http://localhost:8000`  
**API Docs** → `http://localhost:8000/docs`

---

## 🌐 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Live dashboard (index.html) |
| `GET` | `/status` | Latest prediction per asset + rolling accuracy |
| `GET` | `/accuracy` | Per-asset accuracy breakdown |
| `GET` | `/history?limit=200&asset=BTC` | Prediction log, newest first |
| `GET` | `/live-prices` | Real-time Binance prices (5s cache) |
| `GET` | `/chart-data?asset=BTC&bars=100` | OHLCV candle data |
| `GET` | `/markets` | Active Polymarket crypto markets |
| `GET` | `/health` | System uptime and status |

### Example `/status` Response
```json
{
  "BTC": {
    "latest_prediction": {
      "direction": "UP",
      "confidence": 0.516,
      "kelly_fraction": 0.003,
      "risk_flag": "NORMAL",
      "timestamp": "2026-04-25T22:10:00"
    }
  },
  "ETH": { "latest_prediction": { "direction": "DOWN", "confidence": 0.508 } },
  "rolling_accuracy": 55.95,
  "total_predictions": 268,
  "correct_predictions": 150
}
```

---

## ⌨️ Dashboard Shortcuts

| Key | Action |
|---|---|
| `R` | Refresh all data immediately |
| `F` | Toggle fullscreen chart |
| `B` | Filter telemetry to BTC only |
| `E` | Filter telemetry to ETH only |
| `→` / `←` | Navigate telemetry pages |
| `?` | Show all keyboard shortcuts |
| `ESC` | Close modals / exit fullscreen |

---

## 📁 Project Structure

```
cwt-predictions-agent/
│
├── 🚀 main.py                    Entry point — CLI + pipeline loop
├── 🖥️  index.html                 Full dashboard (single-file SPA)
├── 📋 requirements.txt
├── 🔒 .env.example
│
├── api/
│   └── routes.py                 FastAPI endpoints + CORS
│
├── agents/
│   ├── orchestrator_agent.py     Hermes — coordinates full pipeline
│   ├── market_search_agent.py    Polymarket odds fetcher
│   ├── data_fetch_agent.py       Binance OHLCV data
│   ├── prediction_agent.py       Kronos model interface
│   └── risk_agent.py             Kelly criterion + arbitrage flags
│
├── tools/
│   ├── kronos_tool.py            Kronos model wrapper
│   ├── polymarket_tool.py        Gamma API integration
│   ├── apify_tool.py             Web scraping utility
│   └── kalshi_tool.py            Kalshi stub (geo-restricted outside US)
│
├── db/
│   └── database.py               SQLAlchemy models + SQLite engine
│
├── config/
│   └── settings.py               Environment config loader
│
├── Kronos/                       ML model library
└── logs/                         Rotating log files (5MB × 3)
```

---

## 📊 Scaling Strategy

The PDF spec asked to think outside the box. Here's what was implemented:

```
✅ Scale 1 — Multi-Asset
   ASSETS = ["BTC", "ETH", "SOL", "DOGE", "BNB"]
   Add any Binance pair in settings.py — zero code changes needed

✅ Scale 2 — Internal Arbitrage
   Compare 15min prediction vs 3x consecutive 5min predictions
   If they conflict → HIGH_RISK flag → Kelly fraction cut by 50%
   Compare 5min vs 1h trend → TREND_CONFLICT → cut by 30%

✅ Scale 3 — User Visibility
   Full live dashboard at localhost:8000
   REST API with 8 endpoints
   CSV export, dark/light mode, keyboard shortcuts
```

---

## ⚠️ Known Limitations

| Issue | Status | Notes |
|---|---|---|
| Kalshi API | ⛔ Skipped | Geo-restricted to US residents only |
| LLM tool calling | ℹ️ Simplified | Free OpenRouter models don't support tool_choice — pipeline runs sequentially in Python, LLM used for final summary only |
| Kronos model | ℹ️ Statistical fallback | Heavy ML inference replaced with momentum-based predictor for reliability |

---

## 🛠️ Built With

| Technology | Purpose |
|---|---|
| **Python 3.13** | Core language |
| **FastAPI** | REST API + dashboard serving |
| **SQLAlchemy + SQLite** | Prediction persistence |
| **Binance Public API** | Live OHLCV data (no key needed) |
| **Polymarket Gamma API** | Prediction market odds |
| **OpenRouter + Llama 3.1 8B** | LLM orchestration summary |
| **Kronos / Momentum Model** | Directional prediction |
| **Kelly Criterion** | Risk-adjusted position sizing |
| **Chart.js** | Interactive dashboard charts |
| **Antigravity (AI IDE)** | Built using AI-assisted development |

---

## 📹 Demo

> Run `python3 main.py` then open `http://localhost:8000`

```
Terminal output (every 5 minutes):
════════════════════════════════════════════════════════════
CYCLE SUMMARY
════════════════════════════════════════════════════════════
Asset  │ Direction │ Confidence │ Kelly%  │ Risk Flag
───────┼───────────┼────────────┼─────────┼──────────────
BTC    │ UP        │ 51.6%      │ 0.30%   │ NORMAL
ETH    │ DOWN      │ 50.8%      │ 0.53%   │ HIGH_RISK
SOL    │ UP        │ 51.4%      │ 0.29%   │ NORMAL
DOGE   │ UP        │ 50.5%      │ 0.36%   │ NORMAL
BNB    │ UP        │ 50.2%      │ 0.11%   │ NORMAL
════════════════════════════════════════════════════════════
ROLLING ACCURACY: 55.95% (150/268)
```

---

<div align="center">

**Submission includes:**
`GitHub Repo` · `Apify Token` · `Demo Video`

Built by [@nmnroy](https://github.com/nmnroy) for **CrowdWisdomTrading** internship assessment · 2026

*"Think outside the box on how you can scale this"* — ✅ Done.

</div>
