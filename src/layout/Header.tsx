import { MdEdit } from "react-icons/md";

export default function Header() {
  return (
    <header className="custom-header text-white">
      
      <div className="header-top flex-column flex-sm-row gap-2 gap-sm-0">
        <div className="d-flex align-items-center gap-2 fw-bold">
          <span className="fx-badge"><MdEdit /></span>
          <span className="logo-text">FX_CHECKER</span>
        </div>
        
        <div className="header-links">
          <span>55 CURRENCIES</span>
          <span className="separator">•</span>
          <span>BOD</span>
          <span className="separator">•</span>
          <span>ECB DATA</span>
        </div>
      </div>

      <div className="live-ticker-container">
        <div className="live-btn">
          <span className="pulse-dot"></span>
          <span>Live Markets</span>
        </div>

        <div className="ticker-wrap">
          <div className="currency-item">
            <span className="label">EUR/USD</span>
            <span className="value">1.0854</span>
            <span className="down">-0.14%</span>
          </div>
          <div className="currency-item">
            <span className="label">USD/JPY</span>
            <span className="value">157.91</span>
            <span className="up">+0.04%</span>
          </div>
          <div className="currency-item">
            <span className="label">GBP/USD</span>
            <span className="value">1.2575</span>
            <span className="down">-0.22%</span>
          </div>
          <div className="currency-item">
            <span className="label">USD/CHF</span>
            <span className="value">0.9098</span>
            <span className="up">+0.13%</span>
          </div>
          <div className="currency-item">
            <span className="label">EUR/GBP</span>
            <span className="value">0.8633</span>
            <span className="up">+0.11%</span>
          </div>
        </div>
      </div>

    </header>
  );
}