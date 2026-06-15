"use client";
import React, { useState, useEffect } from "react";
import "@/src/assets/sass/home.scss";
import { FaStar, FaXmark } from "react-icons/fa6";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";

const getCurrencyFlag = (currencyCode: string): string => {
  const exceptions: Record<string, string> = {
    USD: "us", EUR: "eu", GBP: "gb", JPY: "jp", CHF: "ch",
    AUD: "au", CAD: "ca", CNY: "cn", AZN: "az", RUB: "ru",
    TRY: "tr", UAH: "ua", KZT: "kz", GEL: "ge", AMD: "am",
    SEK: "se", NOK: "no", DKK: "dk", PLN: "pl", CZK: "cz",
    HUF: "hu", RON: "ro", BGN: "bg", HRK: "hr", ISK: "is",
    MXN: "mx", BRL: "br", ARS: "ar", CLP: "cl", COP: "co",
    PEN: "pe", INR: "in", IDR: "id", MYR: "my", THB: "th",
    SGD: "sg", HKD: "hk", KRW: "kr", TWD: "tw", PHP: "ph",
    VND: "vn", PKR: "pk", BDT: "bd", LKR: "lk", NPR: "np",
    SAR: "sa", AED: "ae", QAR: "qa", KWD: "kw", BHD: "bh",
    OMR: "om", JOD: "jo", LBP: "lb", EGP: "eg", MAD: "ma",
    TND: "tn", ZAR: "za", NGN: "ng", KES: "ke", GHS: "gh",
    NZD: "nz", ILS: "il", IRR: "ir", IQD: "iq",
  };

  if (exceptions[currencyCode]) return exceptions[currencyCode];
  return currencyCode.slice(0, 2).toLowerCase();
};

interface LogItem {
  id: number;
  from: string;
  to: string;
  amount: string;
  result: string;
  rate: number;
  time: string;
}

export default function Page() {
  const [sendAmount, setSendAmount] = useState<string>("1000");
  const [rate, setRate] = useState<number>(0.8530);
  const [loading, setLoading] = useState<boolean>(false);

  const [fromCurrency, setFromCurrency] = useState<string>("USD");
  const [toCurrency, setToCurrency] = useState<string>("EUR");
  
  const [currencies, setCurrencies] = useState<Record<string, string>>({
    USD: "United States Dollar", EUR: "Euro", AZN: "Azerbaijani Manat",
    TRY: "Turkish Lira", GBP: "British Pound", RUB: "Russian Ruble",
    GEL: "Georgian Lari", CHF: "Swiss Franc", AUD: "Australian Dollar",
    CAD: "Canadian Dollar", CNY: "Chinese Yuan", JPY: "Japanese Yen",
    INR: "Indian Rupee", AED: "UAE Dirham", SAR: "Saudi Riyal", BDT: "Bangladeshi Taka"
  });
  const [allRates, setAllRates] = useState<Record<string, number>>({});

  const [showFromPicker, setShowFromPicker] = useState<boolean>(false);
  const [showToPicker, setShowToPicker] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [activeTab, setActiveTab] = useState<"history" | "compare" | "favorites" | "log">("history");
  const [activeTimeframe, setActiveTimeframe] = useState<string>("1M");

  const [favorites, setFavorites] = useState<string[]>([]);
  const [conversionLogs, setConversionLogs] = useState<LogItem[]>([]);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const currentPair = `${fromCurrency}-${toCurrency}`;
  const isFavorited = favorites.includes(currentPair);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== "undefined") {
      const savedFavs = localStorage.getItem("fav_currencies");
      if (savedFavs) setFavorites(JSON.parse(savedFavs));
      else setFavorites(["USD-EUR"]);
      
      const savedLogs = localStorage.getItem("conversion_logs");
      if (savedLogs) setConversionLogs(JSON.parse(savedLogs));
    }
  }, []);

  useEffect(() => {
    fetch("/api/rate")
      .then((res) => res.json())
      .then((data) => {
        if (data && Object.keys(data).length > 0) setCurrencies(data);
      })
      .catch((err) => console.error("Failed to load currencies:", err));
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/convert?from=${fromCurrency}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.rates) {
          setAllRates(data.rates);
          if (data.rates[toCurrency]) setRate(data.rates[toCurrency]);
          else if (fromCurrency === toCurrency) setRate(1);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error:", err);
        setLoading(false);
      });
  }, [fromCurrency]);

  useEffect(() => {
    if (fromCurrency === toCurrency) setRate(1);
    else if (allRates[toCurrency]) setRate(allRates[toCurrency]);
  }, [toCurrency, allRates]);

  const receiveAmount = (parseFloat(sendAmount) || 0) * rate;

  const handleSwap = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleFavorite = () => {
    let updated: string[];
    if (isFavorited) {
      updated = favorites.filter((pair) => pair !== currentPair);
      showToast(`❌ Removed ${currentPair.replace("-", "/")} from favorites!`);
    } else {
      updated = [...favorites, currentPair];
      showToast(`⭐ Added ${currentPair.replace("-", "/")} to favorites!`);
    }
    setFavorites(updated);
    localStorage.setItem("fav_currencies", JSON.stringify(updated));
  };

  const handleLogConversion = () => {
    const newLog: LogItem = {
      id: Date.now(),
      from: fromCurrency,
      to: toCurrency,
      amount: sendAmount,
      result: receiveAmount.toFixed(2),
      rate: rate,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    const updatedLogs = [newLog, ...conversionLogs];
    setConversionLogs(updatedLogs);
    localStorage.setItem("conversion_logs", JSON.stringify(updatedLogs));
    showToast("💾 Conversion successfully logged!");
  };

  const handleDeleteLog = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedLogs = conversionLogs.filter((log) => log.id !== id);
    setConversionLogs(updatedLogs);
    localStorage.setItem("conversion_logs", JSON.stringify(updatedLogs));
    showToast("🗑️ Log entry deleted!");
  };

  const filteredCurrencies = Object.entries(currencies).filter(
    ([code, name]) =>
      code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const CurrencyBadge = ({ currency, onClick }: { currency: string; onClick: () => void }) => (
    <div className="currency-badge" onClick={(e) => { e.stopPropagation(); onClick(); }}>
      <img
        src={`https://flagcdn.com/w20/${getCurrencyFlag(currency)}.png`}
        width="18" height="13" alt={currency} className="flag-img"
      />
      <span className="badge-code">{currency}</span>
      <span className="badge-arrow">▼</span>
    </div>
  );

  const renderCurrencyPicker = (onSelect: (code: string) => void) => (
    <div className="currency-picker-dropdown" onClick={(e) => e.stopPropagation()}>
      <input
        type="text"
        className="form-control form-control-sm search-input"
        placeholder="Search..."
        autoFocus
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {filteredCurrencies.length === 0 ? (
        <div className="no-results">No results found</div>
      ) : (
        filteredCurrencies.map(([code, name]) => (
          <div
            key={code}
            className="item-select"
            onClick={() => { onSelect(code); setSearchQuery(""); }}
          >
            <img src={`https://flagcdn.com/w20/${getCurrencyFlag(code)}.png`} width="18" height="13" alt={code} className="flag-img" />
            <strong className="item-code">{code}</strong> — <span className="item-name">{name}</span>
          </div>
        ))
      )}
    </div>
  );

  const chartData: Record<string, Array<{ name: string; rate: number }>> = {
    "1D": [
      { name: "00:00", rate: 0.8530 }, { name: "04:00", rate: 0.8522 }, { name: "08:00", rate: 0.8545 }, 
      { name: "12:00", rate: 0.8510 }, { name: "16:00", rate: 0.8558 }, { name: "20:00", rate: 0.8535 }, { name: "24:00", rate: 0.8540 }
    ],
    "1W": [
      { name: "Mon", rate: 0.8510 }, { name: "Tue", rate: 0.8565 }, { name: "Wed", rate: 0.8490 }, 
      { name: "Thu", rate: 0.8530 }, { name: "Fri", rate: 0.8520 }, { name: "Sat", rate: 0.8550 }, { name: "Sun", rate: 0.8538 }
    ],
    "1M": [
      { name: "Apr 14", rate: 0.8525 }, { name: "", rate: 0.8548 }, { name: "", rate: 0.8505 }, { name: "", rate: 0.8480 },
      { name: "", rate: 0.8515 }, { name: "Apr 21", rate: 0.8510 }, { name: "", rate: 0.8470 }, { name: "", rate: 0.8435 },
      { name: "", rate: 0.8421 }, { name: "", rate: 0.8472 }, { name: "Apr 28", rate: 0.8516 }, { name: "", rate: 0.8445 },
      { name: "", rate: 0.8475 }, { name: "", rate: 0.8432 }, { name: "", rate: 0.8490 }, { name: "May 06", rate: 0.8548 },
      { name: "", rate: 0.8492 }, { name: "", rate: 0.8545 }, { name: "", rate: 0.8578 }, { name: "", rate: 0.8550 }, { name: "May 14", rate: 0.8568 }
    ],
    "3M": [
      { name: "Mar", rate: 0.8410 }, { name: "", rate: 0.8495 }, { name: "", rate: 0.8450 },
      { name: "Apr", rate: 0.8535 }, { name: "", rate: 0.8510 }, { name: "", rate: 0.8480 },
      { name: "May", rate: 0.8568 }, { name: "", rate: 0.8590 }, { name: "", rate: 0.8440 }
    ],
    "1Y": [
      { name: "Jun 25", rate: 0.8210 }, { name: "Sep 25", rate: 0.8450 }, 
      { name: "Dec 25", rate: 0.8390 }, { name: "Mar 26", rate: 0.8530 }, { name: "Jun 26", rate: 0.8568 }
    ],
    "5Y": [
      { name: "2022", rate: 0.7950 }, { name: "2023", rate: 0.8810 }, 
      { name: "2024", rate: 0.8520 }, { name: "2025", rate: 0.8410 }, { name: "2026", rate: 0.8568 }
    ]
  };

  const currentChartData = chartData[activeTimeframe] || chartData["1M"];

  return (
    <div className="page-wrapper" onClick={() => { setShowFromPicker(false); setShowToPicker(false); }}>
      
      {toastMessage && (
        <div className="custom-toast">
          {toastMessage}
        </div>
      )}

      <div className="container main-container d-flex flex-column align-items-center">
        
        <h3 className="page-title w-100 fw-bold">
          CHECK THE RATE
        </h3>

        <div className="currency p-3 p-md-4 w-100" onClick={(e) => e.stopPropagation()}>
          <div className="row g-2 g-md-3 align-items-center">
            
            <div className="col-12 col-md-5 picker-container">
              <div className="box1 p-3 rounded-3 d-flex flex-column justify-content-between">
                <div>
                  <p className="box-label fw-semibold">SEND</p>
                  <input
                    type="number"
                    className="amount-input fw-bold d-block w-100"
                    value={sendAmount}
                    onChange={(e) => setSendAmount(e.target.value)}
                  />
                </div>
                <div className="d-flex justify-content-end">
                  <CurrencyBadge currency={fromCurrency} onClick={() => { setShowFromPicker(!showFromPicker); setShowToPicker(false); }} />
                </div>
              </div>
              {showFromPicker && renderCurrencyPicker((code) => { setFromCurrency(code); setShowFromPicker(false); })}
            </div>

            <div className="col-12 col-md-2 d-flex justify-content-center swap-container">
              <button className="swap-btn btn rounded-circle d-flex align-items-center justify-content-center" onClick={handleSwap}>
                <span className="swap-icon-desktop d-none d-md-inline">⇄</span>
                <span className="swap-icon-mobile d-inline d-md-none">⇳</span>
              </button>
            </div>

            <div className="col-12 col-md-5 picker-container">
              <div className="box1 p-3 rounded-3 d-flex flex-column justify-content-between">
                <div>
                  <p className="box-label fw-semibold">RECEIVE</p>
                  <span className={`receive-amount fw-bold d-block ${loading ? "loading-dots" : ""}`}>
                    {loading ? "..." : receiveAmount.toFixed(2)}
                  </span>
                </div>
                <div className="d-flex justify-content-end">
                  <CurrencyBadge currency={toCurrency} onClick={() => { setShowToPicker(!showToPicker); setShowFromPicker(false); }} />
                </div>
              </div>
              {showToPicker && renderCurrencyPicker((code) => { setToCurrency(code); setShowToPicker(false); })}
            </div>
          </div>

          <div className="down d-flex flex-column">
            <div className="rate-text font-monospace text-center text-md-start">
              1 {fromCurrency} = {rate.toFixed(4)} {toCurrency}
            </div>
            
            <div className="action-buttons d-flex flex-wrap gap-2 justify-content-center justify-content-md-start">
              <button 
                className={`btn btn-sm fav-toggle-btn d-flex align-items-center justify-content-center gap-2 rounded-pill fw-bold flex-grow-1 flex-md-grow-0 ${isFavorited ? "is-active" : ""}`}
                onClick={toggleFavorite}
              >
                <FaStar className="star-icon" />
                <span>{isFavorited ? "FAVORITED" : "FAVORITE"}</span>
              </button>
              
              <button 
                className="btn btn-sm log-btn rounded-pill fw-bold flex-grow-1 flex-md-grow-0" 
                onClick={handleLogConversion}
              >
                LOG CONVERSION
              </button>
            </div>
          </div>
        </div>

        <div className="details-panel w-100 rounded-3" onClick={(e) => e.stopPropagation()}>
          
          <div className="panel-header d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-end gap-3">
            <div className="tabs-group d-flex align-items-center gap-4 flex-wrap">
              {[
                { id: "history", label: "HISTORY" },
                { id: "compare", label: "COMPARE" },
                { id: "favorites", label: "FAVORITES" },
                { id: "log", label: "LOG" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`tab-btn btn p-0 border-0 fw-bold position-relative ${activeTab === tab.id ? "active" : ""}`}
                >
                  <span className="tab-label-container d-inline-block position-relative">
                    {tab.label}
                    {isMounted && tab.id === "favorites" && favorites.length > 0 && (
                      <span className="badge-count rounded-circle fw-bold">{favorites.length}</span>
                    )}
                    {isMounted && tab.id === "log" && conversionLogs.length > 0 && (
                      <span className="badge-count rounded-circle fw-bold">{conversionLogs.length}</span>
                    )}
                  </span>
                  
                  {activeTab === tab.id && <div className="active-line position-absolute start-0 w-100" />}
                </button>
              ))}
            </div>

            {activeTab === "history" && (
              <div className="timeframe-group d-flex rounded p-1 gap-1">
                {["1D", "1W", "1M", "3M", "1Y", "5Y"].map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setActiveTimeframe(tf)}
                    className={`timeframe-btn btn btn-sm border-0 font-monospace fw-bold flex-grow-1 flex-sm-grow-0 ${activeTimeframe === tf ? "active" : ""}`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            )}
          </div>

          {activeTab === "history" && (
            <div className="history-content">
              <div className="row g-2 stats-cards-row">
                {[
                  { title: "OPEN", value: "0.8516", type: "default" },
                  { title: "LAST", value: rate.toFixed(4), type: "default" },
                  { title: "CHANGE", value: "+0.0014", type: "positive" },
                  { title: "% CHANGE", value: "+0.16%", type: "positive" }
                ].map((card, idx) => (
                  <div key={idx} className="col-6 col-sm-3">
                    <div className="stat-card p-2 p-md-3 rounded-3">
                      <span className="stat-title d-block">{card.title}</span>
                      <strong className={`stat-value ${card.type}`}>{card.value}</strong>
                    </div>
                  </div>
                ))}
              </div>

              <div className="chart-box w-100 rounded-3 p-3 p-md-4 d-flex flex-column justify-content-between">
                <div className="chart-header d-flex justify-content-between align-items-center">
                  <span className="chart-pair fw-bold">{fromCurrency} / {toCurrency}</span>
                  <span className="chart-meta font-monospace text-uppercase">{rate.toFixed(4)} • {activeTimeframe}</span>
                </div>
                
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={currentChartData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                      <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="rgb(208, 241, 67)" stopOpacity={0.35}/>
                          <stop offset="95%" stopColor="rgb(208, 241, 67)" stopOpacity={0.0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#6c757d", fontSize: 10 }} />
                      <YAxis domain={['dataMin - 0.001', 'dataMax + 0.001']} axisLine={false} tickLine={false} tick={{ fill: "#6c757d", fontSize: 10 }} />
                      <Tooltip contentStyle={{ backgroundColor: "#0e0e10", border: "1px solid #333", color: "#fff" }} labelStyle={{ color: "#6c757d" }} />
                      <Area type="monotone" dataKey="rate" stroke="rgb(208, 241, 67)" strokeWidth={2} fillOpacity={1} fill="url(#chartGradient)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeTab === "compare" && (
            <div className="compare-content">
              <div className="compare-header d-flex justify-content-between align-items-center px-1">
                <span className="compare-title font-monospace">
                  MULTI-CURRENCY <span className="highlight">{(parseFloat(sendAmount) || 0).toLocaleString()} FROM {fromCurrency}</span>
                </span>
                <span className="compare-count font-monospace">8 PAIRS</span>
              </div>

              <div className="compare-list d-flex flex-column gap-2">
                {[
                  { code: "GBP", name: "British Pound" },
                  { code: "JPY", name: "Japanese Yen" },
                  { code: "CHF", name: "Swiss Franc" },
                  { code: "CAD", name: "Canadian Dollar" },
                  { code: "AUD", name: "Australian Dollar" },
                  { code: "INR", name: "Indian Rupee" },
                  { code: "CNY", name: "Chinese Yuan" },
                  { code: "BDT", name: "Bangladeshi Taka" }
                ].map((item) => {
                  const currentCompareRate = fromCurrency === item.code ? 1 : (allRates[item.code] || (rate * 0.95)); 
                  const calculatedResult = (parseFloat(sendAmount) || 0) * currentCompareRate;
                  const comparePair = `${fromCurrency}-${item.code}`;
                  const isCompareFavorited = favorites.includes(comparePair);

                  return (
                    <div key={item.code} className="compare-row p-3 rounded-3 d-flex justify-content-between align-items-center">
                      <div className="currency-info d-flex align-items-center gap-2 gap-sm-3">
                        <img src={`https://flagcdn.com/w20/${getCurrencyFlag(item.code)}.png`} width="22" height="15" alt={item.code} className="flag-img" />
                        <div>
                          <span className="info-code fw-bold d-block font-monospace">{item.code}</span>
                          <span className="info-name d-none d-sm-block">{item.name}</span>
                        </div>
                      </div>

                      <div className="compare-actions d-flex align-items-center gap-3">
                        <div className="result-block text-end">
                          <span className="result-value fw-bold d-block font-monospace">
                            {calculatedResult.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                          <span className="result-rate font-monospace">@ {currentCompareRate.toFixed(4)}</span>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            let updated: string[];
                            if (isCompareFavorited) {
                              updated = favorites.filter((pair) => pair !== comparePair);
                              showToast(`❌ Removed ${comparePair.replace("-", "/")} from favorites!`);
                            } else {
                              updated = [...favorites, comparePair];
                              showToast(`⭐ Added ${comparePair.replace("-", "/")} to favorites!`);
                            }
                            setFavorites(updated);
                            localStorage.setItem("fav_currencies", JSON.stringify(updated));
                          }}
                          className={`favbtn p-0 border-0 d-flex align-items-center justify-content-center ${isCompareFavorited ? "is-favorited" : ""}`}
                        >
                          <FaStar className="star-icon" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {activeTab === "favorites" && (
            <div className="favorites-content d-flex flex-wrap gap-2">
              {favorites.length === 0 ? (
                <div className="empty-msg text-center w-100 py-4">No favorites added yet.</div>
              ) : (
                favorites.map((pair) => (
                  <button
                    key={pair}
                    onClick={() => {
                      const [from, to] = pair.split("-");
                      setFromCurrency(from);
                      setToCurrency(to);
                    }}
                    className="btn fav-pair-btn px-3 py-2 rounded-3 flex-grow-1 flex-sm-grow-0"
                  >
                    {pair.replace("-", " ⇄ ")}
                  </button>
                ))
              )}
            </div>
          )}

          {activeTab === "log" && (
            <div className="log-content d-flex flex-column gap-2">
              {conversionLogs.length === 0 ? (
                <div className="empty-msg text-center w-100 py-4">No conversions logged yet.</div>
              ) : (
                conversionLogs.map((log) => (
                  <div key={log.id} className="log-row p-3 rounded d-flex justify-content-between align-items-center px-3">
                    <span className="log-text">
                      {log.amount} {log.from} ➔ <b className="highlight">{log.result} {log.to}</b>
                    </span>
                    <div className="log-meta d-flex align-items-center gap-2 gap-sm-3 ms-2 flex-shrink-0">
                      <span className="log-time font-monospace">{log.time}</span>
                      <button 
                        onClick={(e) => handleDeleteLog(log.id, e)}
                        className="delete-log-btn btn p-0 border-0" 
                      >
                        <FaXmark className="close-icon" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}