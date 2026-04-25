<p align="center">
  <img src="https://img.shields.io/badge/python-3.10+-blue?style=for-the-badge&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/SQLite-Database-07405E?style=for-the-badge&logo=sqlite&logoColor=white" />
  <img src="https://img.shields.io/badge/Binance-API-F0B90B?style=for-the-badge&logo=binance&logoColor=black" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" />
</p>

<h1 align="center">⚡ CWT Predictions Agent</h1>

<p align="center">
  <strong>Real-time crypto market prediction engine powered by AI, Kelly Criterion risk management, and live Binance data streams.</strong>
</p>

<p align="center">
  <em>5 assets · 4 prediction horizons · Live dashboard · Automated verification</em>
</p>

---

## What is this?

CWT Predictions Agent is a full-stack market intelligence system that monitors **BTC, ETH, SOL, DOGE, and BNB** in real-time. Every 5 minutes, it pulls live OHLCV data from Binance, runs directional predictions through the Kronos model, calculates optimal position sizes using the Kelly Criterion, and logs everything to a SQLite database with automatic accuracy verification.

The whole thing ships with a cyberpunk-styled web dashboard that visualizes predictions, accuracy metrics, and telemetry data — all updating live.

---

## Core Stack

```
┌─────────────────────────────────────────────────────────────┐
│                    HERMES ORCHESTRATOR                       │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │ Market Search │  │  Data Fetch  │  │   Prediction     │  │
│  │    Agent      │  │    Agent     │  │     Agent        │  │
│  │ (Polymarket)  │  │  (Binance)   │  │   (Kronos AI)    │  │
│  └──────┬───────┘  └──────┬───────┘  └───────┬──────────┘  │
│         │                 │                   │             │
│         └────────┬────────┴──────┬────────────┘             │
│                  │               │                          │
│          ┌───────▼───────┐ ┌─────▼──────────┐              │
│          │  Risk Agent   │ │  Verification  │              │
│          │ (Kelly + Arb) │ │    Loop        │              │
│          └───────┬───────┘ └─────┬──────────┘              │
└──────────────────┼───────────────┼──────────────────────────┘
                   │               │
            ┌──────▼───────────────▼──────┐
            │     SQLite (predictions)    │
            └──────────────┬──────────────┘
                           │
                    ┌──────▼──────┐
                    │  FastAPI    │
                    │  REST API   │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │  Dashboard  │
                    │ (index.html)│
                    └─────────────┘
```

---

## Features

**Prediction Engine**
- Multi-horizon forecasting: 5min, 15min, 3×5min aggregated, and 1-hour windows
- Structural conflict detection between timeframes (auto risk scaling)
- Confidence scoring with directional bias (UP/DOWN)

**Risk Management**
- Kelly Criterion position sizing with dynamic fraction adjustment
- Arbitrage flag system: `NORMAL` → `HIGH_CONFIDENCE` → `TREND_CONFLICT` → `HIGH_RISK`
- Sub-0.1% Kelly recommendations are auto-skipped to preserve capital

**Data Pipeline**
- Live Binance OHLCV streams (1-minute candles, no API key needed)
- Polymarket odds integration via Gamma API
- 5-second price cache to avoid rate limiting

**Dashboard**
- Glassmorphism dark/light mode UI with custom cursor + particle effects
- Live price ticker from Binance WebSocket
- Interactive Chart.js price charts with prediction overlay
- Asset cards with animated confidence gauges
- Sortable, paginated telemetry table with row expansion
- Market sentiment banner (calculates bullish/bearish ratio)
- CSV export of prediction history
- Keyboard shortcuts: `R` refresh, `F` fullscreen, `B`/`E` filter, `?` help

**Backend API**
- FastAPI with full CORS support
- SQLite persistence with auto-verification loop
- Rolling accuracy calculation per asset

---

## Quick Start

```bash
# 1. Clone
git clone https://github.com/nmnroy/CWT-Predictions.git
cd CWT-Predictions

# 2. Virtual environment
python3 -m venv venv
source venv/bin/activate

# 3. Install deps
pip install -r requirements.txt

# 4. Configure environment
cp .env.example .env
# Edit .env with your settings (see below)

# 5. Run
python3 main.py
```

Dashboard launches automatically at **http://localhost:8000**

### Run once (no loop):
```bash
python3 main.py --once
```

### Custom assets and interval:
```bash
python3 main.py --asset BTC,ETH --interval 10
```

---

## Environment Variables

Create a `.env` file in the project root:

```env
BANKROLL_AMOUNT=1000
ASSETS=["BTC","ETH","SOL","BNB","DOGE"]
PREDICTION_INTERVAL_MINUTES=5
```

> Polymarket (Gamma API) is keyless. Binance public endpoints need no auth.
> Kalshi integration is bypassed — geo-restricted outside the US.

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Serves the dashboard (`index.html`) |
| `GET` | `/status` | Latest prediction per asset + rolling accuracy + totals |
| `GET` | `/accuracy` | Per-asset accuracy breakdown (correct/total/%) |
| `GET` | `/history?limit=200` | Prediction log, newest first. Optional `?asset=BTC` filter |
| `GET` | `/live-prices` | Current prices from Binance (5s cache) |
| `GET` | `/chart-data?asset=BTC&bars=100` | OHLCV candle data from Binance |
| `GET` | `/health` | Uptime, status, asset count |
| `GET` | `/markets` | Active Polymarket crypto markets |

### Example: `/status` response

```json
{
  "BTC": {
    "latest_prediction": {
      "direction": "UP",
      "confidence": 0.58,
      "kelly_fraction": 0.012,
      "risk_flag": "NORMAL",
      "timestamp": "2026-04-25T22:10:00"
    }
  },
  "rolling_accuracy": 55.6,
  "total_predictions": 268,
  "correct_predictions": 149
}
```

---

## Risk Scaling Logic

The system detects structural conflicts between prediction horizons and adjusts position sizing accordingly:

| Flag | Condition | Kelly Adjustment |
|------|-----------|-----------------|
| `NORMAL` | Signals don't contradict | Standard half-Kelly |
| `HIGH_CONFIDENCE` | All horizons agree | Full fraction |
| `TREND_CONFLICT` | 5min vs 1h disagree | −30% reduction |
| `HIGH_RISK` | 15min vs 3×5min disagree | −50% reduction |

Predictions below `0.1%` Kelly are automatically skipped.

---

## Project Structure

```
cwt-predictions-agent/
├── main.py                  # Entry point — CLI + pipeline loop
├── index.html               # Full dashboard (single-file SPA)
├── requirements.txt
├── .env.example
│
├── api/
│   └── routes.py            # FastAPI endpoints
│
├── agents/
│   ├── orchestrator_agent.py    # Hermes — coordinates the full pipeline
│   ├── market_search_agent.py   # Polymarket odds fetcher
│   ├── data_fetch_agent.py      # Binance OHLCV data
│   ├── prediction_agent.py      # Kronos model interface
│   └── risk_agent.py            # Kelly criterion + arbitrage flags
│
├── tools/
│   ├── kronos_tool.py       # Kronos model wrapper
│   ├── polymarket_tool.py   # Gamma API integration
│   ├── apify_tool.py        # Web scraping utility
│   └── kalshi_tool.py       # Kalshi stub (geo-restricted)
│
├── db/
│   └── database.py          # SQLAlchemy models + SQLite engine
│
├── config/
│   └── settings.py          # Environment config loader
│
├── Kronos/                  # ML model library (submodule)
│
└── logs/                    # Rotating log files
```

---

## How It Works (Pipeline)

1. **Market Search** — Queries Polymarket for active crypto prediction markets and retrieves live betting odds
2. **Data Fetch** — Pulls the latest 100 one-minute OHLCV candles from Binance for the target asset
3. **Prediction** — Feeds the candle data into the Kronos model, which outputs directional predictions across 4 time horizons with confidence scores
4. **Risk Assessment** — Detects conflicts between horizons, assigns a risk flag, and computes the Kelly-optimal fraction using the confidence score and best available odds
5. **Database Write** — Logs the prediction to SQLite with all metadata
6. **Verification** — After 5 minutes, a background loop fetches the actual price movement and marks the prediction as correct or incorrect
7. **Repeat** — The cycle runs every 5 minutes for all configured assets

---

## Dashboard Shortcuts

| Key | Action |
|-----|--------|
| `R` | Refresh all data |
| `F` | Toggle fullscreen chart |
| `B` | Filter to BTC |
| `E` | Filter to ETH |
| `→` / `←` | Navigate telemetry pages |
| `?` | Show keyboard shortcuts |
| `ESC` | Close modals |

---

<p align="center">
  Built by <a href="https://github.com/nmnroy">@nmnroy</a> · CrowdWisdomTrading © 2026
</p>
