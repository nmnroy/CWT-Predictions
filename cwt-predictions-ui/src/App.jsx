import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:8000';

const CryptoIcons = {
  BTC: <div className="crypto-icon" style={{ background: '#f7931a' }}>₿</div>,
  ETH: <div className="crypto-icon" style={{ background: '#627eea' }}>Ξ</div>,
  SOL: <div className="crypto-icon" style={{ background: '#14f195' }}>◎</div>,
  BNB: <div className="crypto-icon" style={{ background: '#f3ba2f' }}>BNB</div>,
  DOGE: <div className="crypto-icon" style={{ background: '#c2a633' }}>Ð</div>,
  DEFAULT: <div className="crypto-icon" style={{ background: '#00e5ff' }}>★</div>
};

function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [theme, setTheme] = useState('dark');
  const [data, setData] = useState({ status: [], accuracy: null });
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.className = theme === 'light' ? 'light-mode' : '';
  }, [theme]);

  const fetchHistory = async (assets) => {
    try {
      const promises = assets.map(asset => 
        fetch(`${API_URL}/history?asset=${asset}&limit=50`)
          .then(r => r.json())
          .then(data => Array.isArray(data) ? data.map(item => ({ ...item, asset })) : [])
      );
      const results = await Promise.all(promises);
      let combined = [];
      results.forEach(res => {
        if (Array.isArray(res)) combined = [...combined, ...res];
      });
      combined.sort((a, b) => new Date(b.timestamp + 'Z') - new Date(a.timestamp + 'Z'));
      setHistoryData(combined);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    }
  };

  const fetchData = async () => {
    try {
      const [statusRes, accuracyRes, healthRes] = await Promise.all([
        fetch(`${API_URL}/status`),
        fetch(`${API_URL}/accuracy`),
        fetch(`${API_URL}/health`)
      ]);
      if (!statusRes.ok || !accuracyRes.ok || !healthRes.ok) throw new Error('API Error');
      const statusResult = await statusRes.json();
      const accuracyResult = await accuracyRes.json();
      const healthResult = await healthRes.json();
      
      setData({ status: statusResult, accuracy: accuracyResult, health: healthResult });
      
      const assets = statusResult.map(item => item.asset);
      if (assets.length > 0) fetchHistory(assets);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  // --- SUB-COMPONENTS ---
  const GlobalNav = () => (
    <nav className="global-nav">
      <div className="nav-brand" onClick={() => setCurrentView('landing')} style={{ cursor: 'pointer' }}>
        <span>CWT</span><strong>ORACLE</strong>
      </div>
      <div className="nav-links">
        <button className={currentView === 'signals' || currentView === 'dashboard' ? 'active' : ''} onClick={() => setCurrentView('signals')}>SIGNALS</button>
        <button className={currentView === 'assets' ? 'active' : ''} onClick={() => setCurrentView('assets')}>ASSETS</button>
        <button className={currentView === 'confidence' ? 'active' : ''} onClick={() => setCurrentView('confidence')}>CONFIDENCE</button>
        <button className={currentView === 'landing' || currentView === 'protocol' ? 'active' : ''} onClick={() => setCurrentView('protocol')}>PROTOCOL</button>
      </div>
      <div className="nav-controls">
        <button className="theme-toggle" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <button className="btn-cyan" onClick={() => window.open('https://github.com/nmnroy/CWT-Predictions', '_blank')}>GitHub</button>
      </div>
    </nav>
  );

  const LandingView = () => {
    // Take top 3 assets for landing page showcase
    const showcaseAssets = data.status.slice(0, 3);
    
    return (
      <div className="landing-grid">
        <div className="hero-section">
          <h1 className="hero-title">PREDICT THE<br/>FUTURE OF ASSETS</h1>
          <p className="hero-subtitle">
            AI-powered crypto prediction agent using Hermes orchestration, Kronos time-series forecasting, and Kelly Criterion risk management across 5 live crypto assets.
          </p>
          <div className="hero-actions">
            <button className="btn-cyan" onClick={() => setCurrentView('dashboard')}>START PREDICTING</button>
            <button className="btn-outline">VIEW PROTOCOL</button>
          </div>
          
          <h3 style={{ marginBottom: '1.5rem', fontWeight: 600 }}>Live Market Predictions</h3>
          <div className="mini-asset-container">
            {showcaseAssets.map((item) => {
              const pred = item.latest_prediction;
              if (!pred) return null;
              const isUp = pred.direction === 'UP';
              return (
                <div key={item.asset} className="mini-asset-card">
                  <div className="mini-title">
                    {CryptoIcons[item.asset] || CryptoIcons.DEFAULT}
                    {item.asset}
                  </div>
                  <div>
                    <div className="mini-price">{(pred.confidence * 100).toFixed(1)}%</div>
                    <div className={isUp ? 'signal-up' : 'signal-down'}>
                      {isUp ? '↑ UP SIGNAL' : '↓ DOWN SIGNAL'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="right-panel">
          <h3 style={{ marginBottom: '1.5rem', fontWeight: 600 }}>Live Market Predictions</h3>
          <div className="panel-glass">
            <div className="stats-grid">
              <div className="stat-box">
                <span className="dash-badge badge-up" style={{ padding: '0.2rem 0.5rem', background: 'rgba(20, 241, 149, 0.1)', color: '#14f195', border: '1px solid #14f195' }}>
                  <span style={{ display: 'inline-block', width: 6, height: 6, background: '#14f195', borderRadius: '50%', marginRight: 6 }}></span>
                  LIVE
                </span>
                <h3>{data?.accuracy?.overall?.total !== undefined ? data.accuracy.overall.total : 'Live'}</h3>
                <p>TOTAL PREDICTIONS</p>
              </div>
              <div className="stat-box">
                <span className="dash-badge badge-down" style={{ padding: '0.2rem 0.5rem', background: 'transparent', border: 'none' }}>&nbsp;</span>
                <h3>{data?.accuracy?.overall?.accuracy !== undefined ? data.accuracy.overall.accuracy.toFixed(1) + '%' : 'Live'}</h3>
                <p>SUCCESS RATE</p>
              </div>
            </div>
            <button className="btn-cyan" style={{ marginTop: '1.5rem', width: '100%' }} onClick={() => setCurrentView('protocol')}>LEARN ABOUT THE PROTOCOL</button>
          </div>

          <h3 style={{ margin: '2rem 0 1.5rem 0', fontWeight: 600 }}>Advanced Architecture</h3>
          <div className="panel-glass">
            <div className="arch-graphic">
              <div className="arch-text">
                BUILT FOR THE<br/>
                <span style={{ color: 'var(--accent-cyan)' }}>KINETIC ERA</span>
              </div>
            </div>
            <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
              <div className="stat-box">
                <h3>{data?.accuracy?.overall?.total !== undefined ? data.accuracy.overall.total : 'Live'}</h3>
                <p>TOTAL PREDICTIONS</p>
              </div>
              <div className="stat-box">
                <h3>{data?.accuracy?.overall?.accuracy !== undefined ? data.accuracy.overall.accuracy.toFixed(1) + '%' : 'Live'}</h3>
                <p>SUCCESS RATE</p>
              </div>
            </div>
            <button className="btn-cyan" style={{ width: '100%' }} onClick={() => setCurrentView('protocol')}>LEARN ABOUT THE PROTOCOL</button>
          </div>
        </div>
      </div>
    );
  };

  const LoginView = () => (
    <div className="login-overlay">
      <div className="login-card">
        <h2>Sign In to CWT Oracle</h2>
        <p>Enter your credentials to access the prediction floor.</p>
        
        <div className="input-group">
          <label>Institutional Email</label>
          <input type="email" placeholder="@ name@protocol.com" />
        </div>
        
        <div className="input-group">
          <label>Access Key <span style={{ float: 'right', cursor: 'pointer' }}>RECOVER KEY</span></label>
          <input type="password" placeholder="••••••••••••" />
        </div>
        
        <button className="btn-cyan" style={{ width: '100%', marginBottom: '2rem' }} onClick={() => setCurrentView('dashboard')}>
          ESTABLISH CONNECTION
        </button>
        
        <div style={{ textAlign: 'center', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
          PROTOCOL AUTH
        </div>
        
        <div className="sso-buttons">
          <button className="sso-btn">Google</button>
          <button className="sso-btn">MetaMask</button>
        </div>
      </div>
    </div>
  );

  const DashboardView = ({ mode }) => (
    <div>
      {(mode === 'signals' || mode === 'confidence') && (
        <div className="dashboard-overview-grid">
          <div className="dash-top-card">
            <h4>Rolling Accuracy</h4>
            <div className="val">{data?.accuracy?.overall?.accuracy !== undefined ? `${data.accuracy.overall.accuracy.toFixed(1)}%` : 'N/A'}</div>
          </div>
          <div className="dash-top-card">
            <h4>Total Predictions</h4>
            <div className="val">{data?.accuracy?.overall?.total || 0}</div>
          </div>
          <div className="dash-top-card" style={{ border: '1px solid var(--accent-cyan)', background: 'rgba(0,229,255,0.05)' }}>
            <h4>HERMES AGENT</h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
              <div className="val" style={{ color: 'var(--accent-cyan)' }}>ONLINE</div>
              <span className="dash-badge badge-cyan">Llama 3.1 8B</span>
            </div>
          </div>
        </div>
      )}

      {mode === 'signals' && (
        <>
          <h3 style={{ marginBottom: '1.5rem', fontWeight: 600 }}>CWT PREDICTIONS DASHBOARD - OVERVIEW</h3>
          <div className="dash-asset-grid">
            {data.status.map((item) => {
          const pred = item.latest_prediction;
          if (!pred) return null;
          const isUp = pred.direction === 'UP';
          
          return (
            <div key={item.asset} className={`dash-card ${isUp ? 'up-card' : 'down-card'}`}>
              <div className="dash-card-header">
                <div className="mini-title" style={{ fontSize: '1.5rem' }}>
                  {CryptoIcons[item.asset] || CryptoIcons.DEFAULT} {item.asset}
                </div>
                <div className={`dash-badge ${isUp ? 'badge-up' : 'badge-down'}`}>
                  {isUp ? 'UP' : 'DOWN'}
                </div>
              </div>
              
              <div className="dash-metric">
                <span>Model Confidence</span>
                <strong>{(pred.confidence * 100).toFixed(0)}%</strong>
              </div>
              <div className="dash-progress" style={{ marginBottom: '1.5rem' }}>
                <div className={isUp ? 'dash-fill-up' : 'dash-fill-down'} style={{ width: `${pred.confidence * 100}%` }}></div>
              </div>
              
              <div className="dash-metric">
                <span>Risk Sizing</span>
                <strong>{(pred.kelly_fraction * 100).toFixed(2)}%</strong>
              </div>
              <div className="dash-progress" style={{ background: 'var(--input-bg)' }}>
                <div className="dash-fill-cyan" style={{ width: `${Math.min(pred.kelly_fraction * 1000, 100)}%` }}></div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <span>{new Date(pred.timestamp + 'Z').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                <span style={{ color: pred.actual_direction ? (pred.was_correct ? 'var(--accent-up)' : 'var(--accent-down)') : 'inherit' }}>
                  {pred.actual_direction ? (pred.was_correct ? 'Verified Correct' : 'Failed') : 'Pending Verification...'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      </>
      )}
      
      {mode === 'assets' && (
        <>
          <h3 style={{ marginBottom: '1.5rem', fontWeight: 900, fontSize: '1.5rem', color: 'var(--accent-cyan)', textShadow: 'var(--glow-cyan)' }}>LIVE TELEMETRY FEED</h3>
          <table className="glass-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Asset</th>
                <th>Direction</th>
                <th>Confidence</th>
                <th>Kelly Sizing</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {historyData.map((row) => (
                <tr key={row.id}>
                  <td style={{ fontFamily: 'monospace' }}>{new Date(row.timestamp + 'Z').toLocaleString([], { timeStyle: 'short', dateStyle: 'short' })}</td>
                  <td style={{ fontWeight: 700 }}>{row.asset}</td>
                  <td style={{ color: row.direction === 'UP' ? 'var(--accent-up)' : 'var(--accent-down)' }}>{row.direction}</td>
                  <td>{(row.confidence * 100).toFixed(1)}%</td>
                  <td>{(row.kelly_fraction * 100).toFixed(2)}%</td>
                  <td>
                    {row.actual_direction ? (row.was_correct ? '✓ Correct' : '✗ Failed') : 'Pending'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {mode === 'confidence' && (
        <div className="panel-glass" style={{ marginTop: '2rem' }}>
          <h2 style={{ color: 'var(--accent-cyan)', marginBottom: '1.5rem', fontSize: '1.8rem' }}>Accuracy Breakdown</h2>
          <table className="glass-table" style={{ width: '100%', textAlign: 'left' }}>
            <thead>
              <tr>
                <th>Asset</th>
                <th>Accuracy %</th>
                <th>Performance (Correct / Total)</th>
                <th>Indicator</th>
              </tr>
            </thead>
            <tbody>
              {data?.accuracy && Object.entries(data.accuracy).filter(([key]) => key !== 'overall').map(([asset, stats]) => {
                const acc = stats.accuracy;
                let color = '#ff4d4f';
                if (acc > 55) color = '#14f195';
                else if (acc >= 50) color = '#f3ba2f';
                return (
                  <tr key={asset}>
                    <td style={{ fontWeight: 700 }}>{CryptoIcons[asset] || CryptoIcons.DEFAULT} {asset}</td>
                    <td style={{ fontWeight: 'bold' }}>{acc.toFixed(1)}%</td>
                    <td style={{ fontFamily: 'monospace' }}>{stats.correct} / {stats.total}</td>
                    <td style={{ verticalAlign: 'middle' }}>
                      <div style={{ width: '100px', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${Math.min(acc, 100)}%`, height: '100%', background: color }}></div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const ProtocolView = () => (
    <div className="protocol-container">
      <div className="protocol-hero">
        <h1 className="hero-title" style={{ fontSize: '3.5rem', marginBottom: '1rem', textAlign: 'center' }}>THE PROTOCOL</h1>
        <p className="hero-subtitle" style={{ maxWidth: '600px', margin: '0 auto 3rem auto', fontSize: '1.2rem', textAlign: 'center' }}>
          A decentralized, agentic intelligence network powering high-fidelity market telemetry and predictive analytics.
        </p>
      </div>

      <div className="protocol-diagram-container">
        <img src="/protocol_diagram.png" alt="Protocol Architecture Diagram" className="protocol-image" />
      </div>

      <div className="protocol-features">
        <div className="feature-card">
          <div className="feature-icon">🤖</div>
          <h3>5-Agent Pipeline</h3>
          <p>An orchestrator agent coordinates Market Search, Data Fetch (Binance), Prediction, and Risk Management agents seamlessly.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🌐</div>
          <h3>Market Telemetry</h3>
          <p>Real-time data ingestion from Binance 1m OHLCV streams and integration with Polymarket active odds.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🧠</div>
          <h3>Kronos Forecasting</h3>
          <p>Powered by Kronos time-series models to predict structural multi-horizon trends (5min, 15min, 1h).</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">⚡</div>
          <h3>Kelly Criterion Risk</h3>
          <p>Dynamic Kelly Criterion sizing algorithms allocate simulated capital based on confidence spreads and risk profiles.</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="app-container">
      <GlobalNav />
      {currentView === 'landing' && <LandingView />}
      {currentView === 'login' && <LoginView />}
      {currentView === 'protocol' && <ProtocolView />}
      {['signals', 'assets', 'confidence', 'dashboard'].includes(currentView) && <DashboardView mode={currentView === 'dashboard' ? 'signals' : currentView} />}
    </div>
  );
}

export default App;
