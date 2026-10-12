const DEFAULT_API_KEY = 'n2jSRHKNBe1nYrLza56x6n';
const KEY = 'enyao-v02';

const baseCatalog = [
  ['MXRF11','Maxi Renda','FII'],['HGLG11','CSHG Logística','FII'],['VISC11','Vinci Shopping Centers','FII'],['XPML11','XP Malls','FII'],['KNRI11','Kinea Renda Imobiliária','FII'],['GARE11','Guardian Real Estate','FII'],['TRXF11','TRX Real Estate','FII'],['RECR11','FII REC Recebíveis Imobiliários','FII'],['LIFE11','Life Capital Partners','FII'],['XPCA11','XP Crédito Agrícola','FII'],['FGAA11','FG Agro','FII'],['AAZQ11','AZ Quest Sole','FII'],['IRIM11','Iridium Recebíveis Imobiliários','FII'],['KNCR11','Kinea Crédito Imobiliário','FII'],['KNIP11','Kinea Índices de Preços','FII'],['HGRU11','CSHG Renda Urbana','FII'],['XPLG11','XP Log','FII'],['BRCO11','Bresco Logística','FII'],['BTLG11','BTG Logística','FII'],['VILG11','Vinci Logística','FII'],['JSRE11','JS Real Estate','FII'],['RBRF11','RBR Alpha','FII'],['CPTS11','Capitânia Securities','FII'],['DEVA11','Devant Recebíveis','FII'],
  ['ITSA4','Itaúsa PN','Ação'],['ITUB4','Itaú Unibanco PN','Ação'],['PETR4','Petrobras PN','Ação'],['PETR3','Petrobras ON','Ação'],['VALE3','Vale ON','Ação'],['BBAS3','Banco do Brasil ON','Ação'],['WEGE3','WEG ON','Ação'],['BBDC4','Bradesco PN','Ação'],['BBDC3','Bradesco ON','Ação'],['ABEV3','Ambev ON','Ação'],['B3SA3','B3 ON','Ação'],['EGIE3','Engie Brasil ON','Ação'],['TAEE11','Taesa units','Ação'],['OPCT3','OceanPact ON','Ação'],['MGLU3','Magazine Luiza ON','Ação'],['LREN3','Lojas Renner ON','Ação'],['RENT3','Localiza ON','Ação'],['SUZB3','Suzano ON','Ação'],['PRIO3','PetroRio ON','Ação'],['RADL3','Raia Drogasil ON','Ação'],['RAIL3','Rumo ON','Ação'],['CSAN3','Cosan ON','Ação'],['ELET3','Eletrobras ON','Ação'],['ELET6','Eletrobras PNB','Ação'],['CMIG4','Cemig PN','Ação'],['SANB11','Santander units','Ação'],['BBSE3','BB Seguridade ON','Ação'],['CXSE3','Caixa Seguridade ON','Ação'],['VIVT3','Telefônica Brasil ON','Ação'],['TIMS3','TIM ON','Ação'],['NTCO3','Natura ON','Ação'],['HAPV3','Hapvida ON','Ação'],['RDOR3','Rede DOr ON','Ação'],['FLRY3','Fleury ON','Ação'],['CCRO3','CCR ON','Ação'],['SBSP3','Sabesp ON','Ação'],['CPLE6','Copel PNB','Ação'],['EQTL3','Equatorial ON','Ação'],['UGPA3','Ultrapar ON','Ação'],['CSNA3','CSN ON','Ação'],['GGBR4','Gerdau PN','Ação'],['GOAU4','Metalúrgica Gerdau PN','Ação'],['USIM5','Usiminas PNA','Ação'],['CYRE3','Cyrela ON','Ação'],['MRVE3','MRV ON','Ação'],['EZTC3','EZTec ON','Ação'],['DIRR3','Direcional ON','Ação'],['TEND3','Tenda ON','Ação'],['ALPA4','Alpargatas PN','Ação'],
  ['IVVB11','iShares S&P 500','ETF'],['BOVA11','iShares Ibovespa','ETF'],['SMAL11','iShares Small Cap','ETF'],['DIVO11','It Now IDIV','ETF'],['LFTS11','Investo Tesouro Selic','ETF'],['NDIV11','Nu ETF Dividendos','ETF'],['XINA11','Trend China','ETF'],['HASH11','Hashdex Nasdaq Crypto','ETF'],['QBTC11','QR Bitcoin','ETF'],['GOLD11','Trend Ouro','ETF'],['FIXA11','Trend FIXA','ETF'],
  ['CDB','CDB bancário','Renda fixa'],['TESOURO SELIC','Tesouro Selic','Renda fixa'],['TESOURO IPCA','Tesouro IPCA+','Renda fixa'],['TESOURO PREFIXADO','Tesouro Prefixado','Renda fixa'],['LCI','Letra de Crédito Imobiliário','Renda fixa'],['LCA','Letra de Crédito do Agronegócio','Renda fixa'],['CRI','Certificado de Recebíveis Imobiliários','Renda fixa'],['CRA','Certificado de Recebíveis do Agronegócio','Renda fixa'],['DEBENTURE','Debênture','Renda fixa']
].map(([ticker, name, type]) => ({ ticker, name, type, custom: false }));

const COLOR_MAP = { 'Ação': '#ec4899', 'FII': '#22d3ee', 'ETF': '#a855f7', 'Renda fixa': '#10b981', 'Outro': '#64748b' };
const RF_TICKERS = ['CDB','LCI','LCA','CRI','CRA','DEBENTURE','TESOURO SELIC','TESOURO IPCA','TESOURO PREFIXADO'];
const isRFTicker = t => RF_TICKERS.includes(t);

let state = {
  catalog: [], trades: [], dividends: [], prices: {},
  apiKey: DEFAULT_API_KEY, lastUpdated: null, autoRefresh: 0, lastSource: '',
  cdiRate: 13.65, rfLastProjection: null, history: []
};
try {
  const raw = localStorage.getItem(KEY);
  const s = raw ? JSON.parse(raw) : null;
  if (s && typeof s === 'object') {
    if (Array.isArray(s.catalog)) state.catalog = s.catalog;
    if (Array.isArray(s.trades)) state.trades = s.trades;
    if (Array.isArray(s.dividends)) state.dividends = s.dividends;
    if (s.prices && typeof s.prices === 'object') state.prices = s.prices;
    if (s.lastUpdated) state.lastUpdated = s.lastUpdated;
    if (typeof s.autoRefresh === 'number') state.autoRefresh = s.autoRefresh;
    if (s.lastSource) state.lastSource = s.lastSource;
    if (typeof s.cdiRate === 'number' && s.cdiRate > 0) state.cdiRate = s.cdiRate;
    if (s.rfLastProjection) state.rfLastProjection = s.rfLastProjection;
    if (Array.isArray(s.history)) state.history = s.history;
  }
} catch (e) { console.warn('Erro lendo estado', e); }
state.apiKey = DEFAULT_API_KEY;

const catalog = () => [...baseCatalog, ...state.catalog];
const brl = n => Number(n || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const pct = n => { const v = Number(n || 0); return (v >= 0 ? '+' : '') + v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%'; };
const today = () => new Date().toLocaleDateString('en-CA');
const $ = id => document.getElementById(id);
function save() { localStorage.setItem(KEY, JSON.stringify(state)); render(); }
function esc(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

/* ---------- RF helpers ---------- */
function isRFComposite(t) { return t && t.indexOf('@') !== -1; }
function rfBase(t) { return isRFComposite(t) ? t.split('@')[0] : t; }
function rfPct(t) { return isRFComposite(t) ? (parseFloat(t.split('@')[1]) || 100) : 100; }
function buildRFTicker(base, pct) { return `${base}@${pct}`; }
function displayTicker(t) {
  if (!t) return '';
  if (isRFComposite(t)) { const [b, p] = t.split('@'); return (Number(p) === 100) ? b : `${b} · ${p}% CDI`; }
  return t;
}
function catalogEntry(ticker) {
  if (!ticker) return null;
  if (isRFComposite(ticker)) return catalog().find(x => x.ticker === rfBase(ticker)) || null;
  return catalog().find(x => x.ticker === ticker) || null;
}
function isRFAsset(ticker) {
  if (!ticker) return false;
  if (isRFComposite(ticker)) return true;
  if (isRFTicker(ticker)) return true;
  const c = catalog().find(x => x.ticker === ticker);
  return c?.type === 'Renda fixa';
}

(function migrateRF() {
  const map = {};
  for (const t of state.trades) {
    if (isRFComposite(t.ticker)) continue;
    const isRF = isRFTicker(t.ticker) || catalogEntry(t.ticker)?.type === 'Renda fixa';
    if (!isRF) continue;
    const newT = buildRFTicker(t.ticker, t.pctCDI || 100);
    map[t.ticker] = newT;
    t.ticker = newT;
    if (!t.pctCDI) t.pctCDI = 100;
  }
  const keys = Object.keys(map);
  if (keys.length) {
    for (const oldT of keys) {
      const newT = map[oldT];
      if (state.prices[oldT] !== undefined) { state.prices[newT] = state.prices[oldT]; delete state.prices[oldT]; }
      for (const d of state.dividends) if (d.ticker === oldT) d.ticker = newT;
    }
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
  }
})();

/* ---------- Máscara monetária ---------- */
function digitsToMoney(digits) {
  digits = String(digits || '').replace(/\D/g, '');
  if (!digits) return '';
  if (digits.length > 15) digits = digits.slice(0, 15);
  digits = digits.replace(/^0+/, '');
  if (!digits) return '0,00';
  const n = Number(digits) / 100;
  return n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function attachMoneyMask(input) {
  input.addEventListener('input', () => {
    const digits = input.value.replace(/\D/g, '');
    input.value = digitsToMoney(digits);
    requestAnimationFrame(() => { const len = input.value.length; input.setSelectionRange(len, len); });
  });
  input.addEventListener('blur', () => { if (!input.value.trim()) input.value = ''; });
}
function parseMoneyBR(str) {
  if (!str) return 0;
  const s = String(str).replace(/[^\d,]/g, '').replace(/\./g, '').replace(',', '.');
  const n = Number(s); return Number.isFinite(n) ? n : 0;
}
function parseNum(str) {
  if (str === null || str === undefined) return 0;
  let s = String(str).trim().replace(/[^\d.,-]/g, '');
  if (!s) return 0;
  const hasComma = s.includes(','), hasDot = s.includes('.');
  if (hasComma && hasDot) { if (s.lastIndexOf(',') > s.lastIndexOf('.')) s = s.replace(/\./g, '').replace(',', '.'); else s = s.replace(/,/g, ''); }
  else if (hasComma) s = s.replace(',', '.');
  else if (hasDot && /^\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, '');
  const n = Number(s); return Number.isFinite(n) ? n : 0;
}
function numToBR(n) { return Number(n || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
function qtyToBR(n) { return Number(n || 0).toLocaleString('pt-BR', { maximumFractionDigits: 8 }); }

/* ---------- RF projection ---------- */
function projectRFBalance(ticker) {
  const trades = state.trades.filter(t => t.ticker === ticker);
  if (!trades.length) return 0;
  const pctContratado = rfPct(ticker);
  const taxaAnual = (state.cdiRate / 100) * pctContratado / 100;
  if (taxaAnual <= 0) return 0;
  let balance = 0;
  for (const t of trades) {
    const days = Math.max(0, (Date.now() - new Date(t.date + 'T00:00:00').getTime()) / 86400000);
    const valor = Math.abs(t.qty * t.price);
    const projected = valor * Math.pow(1 + taxaAnual, days / 365);
    if (t.side === 'buy') balance += projected;
    else balance -= projected;
  }
  return Math.max(0, balance);
}
function runRFProjection(force) {
  const todayStr = today();
  if (!force && state.rfLastProjection === todayStr) return;
  const tickers = new Set(state.trades.map(t => t.ticker).filter(isRFAsset));
  for (const ticker of tickers) {
    const projected = projectRFBalance(ticker);
    if (projected > 0) state.prices[ticker] = projected;
  }
  state.rfLastProjection = todayStr;
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
}

/* ---------- Snapshot histórico ---------- */
function recordSnapshot() {
  const ps = positions();
  const total = ps.reduce((s, p) => s + p.market, 0);
  const cost = ps.reduce((s, p) => s + p.cost, 0);
  if (total <= 0 && cost <= 0) return;
  const todayStr = today();
  if (!Array.isArray(state.history)) state.history = [];
  const existing = state.history.find(h => h.date === todayStr);
  if (existing) { existing.total = total; existing.cost = cost; }
  else state.history.push({ date: todayStr, total, cost });
  if (state.history.length > 730) state.history = state.history.slice(-730);
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
}

function ensureTickerInCatalog(ticker) {
  if (!ticker) return;
  const base = isRFComposite(ticker) ? rfBase(ticker) : ticker;
  if (isRFComposite(ticker)) {
    if (!catalog().some(a => a.ticker === base)) state.catalog.push({ ticker: base, name: base, type: 'Renda fixa', custom: true });
    return;
  }
  if (catalog().some(a => a.ticker === ticker)) return;
  const type = isRFTicker(ticker) ? 'Renda fixa' : 'Outro';
  state.catalog.push({ ticker, name: ticker, type, custom: true });
}

/* ---------- Posições ---------- */
function positions() {
  let m = {};
  for (const t of state.trades) {
    const rf = isRFAsset(t.ticker);
    let p = m[t.ticker] || (m[t.ticker] = { ticker: t.ticker, qty: 0, cost: 0, realized: 0, isRF: false, pctCDI: rfPct(t.ticker) });
    p.isRF = rf;
    if (rf) {
      const valor = Math.abs(t.qty * t.price) + (t.fees || 0);
      if (t.side === 'buy') p.cost += valor;
      else p.cost -= valor;
      if (p.cost < 0) p.cost = 0;
      if (t.pctCDI) p.pctCDI = t.pctCDI;
    } else {
      if (t.side === 'buy') { p.cost += t.qty * t.price + (t.fees || 0); p.qty += t.qty; }
      else {
        const avg = p.qty ? p.cost / p.qty : 0;
        const sold = Math.min(t.qty, p.qty);
        p.realized += (t.price * sold - (t.fees || 0)) - (avg * sold);
        p.cost -= avg * sold;
        p.qty -= sold;
        if (p.qty < 1e-8) { p.qty = 0; p.cost = 0; }
      }
    }
  }
  const cutoff = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  return Object.values(m).filter(p => p.isRF ? p.cost > 0.01 : p.qty > 1e-8).map(p => {
    const c = catalogEntry(p.ticker);
    p.name = c?.name || rfBase(p.ticker);
    p.type = c?.type || (p.isRF ? 'Renda fixa' : 'Outro');
    if (p.isRF) {
      p.qty = 1; p.avg = p.cost;
      p.current = Number(state.prices[p.ticker] ?? p.cost) || 0;
      p.market = p.current;
      p.unrealized = p.current - p.cost;
      p.unrealizedPct = p.cost > 0 ? (p.unrealized / p.cost) * 100 : 0;
    } else {
      p.avg = p.qty ? p.cost / p.qty : 0;
      p.current = Number(state.prices[p.ticker] ?? p.avg) || 0;
      p.market = p.qty * p.current;
      p.unrealized = p.market - p.cost;
      p.unrealizedPct = p.cost > 0 ? (p.unrealized / p.cost) * 100 : 0;
    }
    let div12m = 0;
    for (const d of state.dividends) if (d.ticker === p.ticker && d.date >= cutoff) div12m += Number(d.amount || 0);
    p.div12m = div12m;
    p.yoc = p.cost > 0 ? (div12m / p.cost) * 100 : 0;
    return p;
  });
}

function timeAgo(iso) {
  if (!iso) return '';
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return 'agora mesmo';
  if (diff < 3600) return `há ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `há ${Math.floor(diff / 3600)} h`;
  return `há ${Math.floor(diff / 86400)} dias`;
}

function computeDividendTotals() {
  const now = new Date(), ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`, y = String(now.getFullYear());
  let month = 0, year = 0;
  for (const d of state.dividends) {
    const a = Number(d.amount || 0);
    if ((d.date || '').startsWith(ym)) month += a;
    if ((d.date || '').startsWith(y)) year += a;
  }
  return { month, year };
}

/* ---------- Evolução ---------- */
function renderEvolution() {
  const container = $('evolution');
  const h = Array.isArray(state.history) ? state.history.slice() : [];
  if (h.length < 2) {
    container.innerHTML = `<div class="evo-card">
      <div class="evo-title">Evolução do patrimônio</div>
      <div class="evo-empty">O gráfico aparece a partir do segundo dia de uso.<br>Volte amanhã para ver a evolução. 📈</div>
    </div>`;
    return;
  }
  h.sort((a, b) => a.date.localeCompare(b.date));
  const last = h[h.length - 1], first = h[0];
  const diff = last.total - first.total;
  const diffPct = first.total > 0 ? (diff / first.total) * 100 : 0;
  const positive = diff >= 0;
  const w = 100, height = 40, padY = 3;
  const maxTotal = Math.max(...h.map(x => x.total));
  const minTotal = Math.min(...h.map(x => x.total));
  const range = (maxTotal - minTotal) || 1;
  let linePath = '', areaPath = '';
  h.forEach((point, i) => {
    const x = h.length > 1 ? (i / (h.length - 1)) * w : 0;
    const y = height - padY - ((point.total - minTotal) / range) * (height - padY * 2);
    if (i === 0) { linePath += `M ${x} ${y}`; areaPath += `M ${x} ${height} L ${x} ${y}`; }
    else { linePath += ` L ${x} ${y}`; areaPath += ` L ${x} ${y}`; }
    if (i === h.length - 1) areaPath += ` L ${x} ${height} Z`;
  });
  const c1 = positive ? '#22d3ee' : '#ff4d80';
  const c2 = positive ? '#ec4899' : '#a855f7';
  const uid = 'evo' + Date.now();
  const fmtDate = d => { const [y, m, day] = d.split('-'); return `${day}/${m}`; };
  container.innerHTML = `<div class="evo-card">
    <div class="evo-title">Evolução do patrimônio</div>
    <div class="evo-value">${brl(last.total)}</div>
    <div class="evo-pct" style="color:${positive ? 'var(--cyan)' : 'var(--danger)'}">
      ${positive ? '+' : ''}${brl(diff)} (${pct(diffPct)}) desde ${fmtDate(first.date)}
    </div>
    <div class="evo-chart-wrap">
      <svg viewBox="0 0 ${w} ${height}" preserveAspectRatio="none" class="evo-chart">
        <defs>
          <linearGradient id="${uid}-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="${c2}"/>
            <stop offset="100%" stop-color="${c1}"/>
          </linearGradient>
          <linearGradient id="${uid}-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${c1}" stop-opacity="0.35"/>
            <stop offset="100%" stop-color="${c1}" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <path d="${areaPath}" fill="url(#${uid}-fill)"/>
        <path d="${linePath}" fill="none" stroke="url(#${uid}-line)" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke" style="stroke-width:2"/>
      </svg>
    </div>
    <div class="evo-footer"><span>${fmtDate(first.date)}</span><span>${h.length} dias</span><span>${fmtDate(last.date)}</span></div>
  </div>`;
}

function renderAllocation(ps) {
  const container = $('allocation');
  if (!ps.length) { container.innerHTML = ''; return; }
  const total = ps.reduce((s, p) => s + p.market, 0);
  if (total <= 0) { container.innerHTML = ''; return; }
  const groups = {};
  for (const p of ps) { const t = p.type || 'Outro'; if (!groups[t]) groups[t] = { value: 0, count: 0 }; groups[t].value += p.market; groups[t].count += 1; }
  const entries = Object.entries(groups).sort((a, b) => b[1].value - a[1].value);
  let cumulative = 0, segments = '', legend = '';
  for (const [type, data] of entries) {
    const pctVal = (data.value / total) * 100;
    const color = COLOR_MAP[type] || COLOR_MAP['Outro'];
    segments += `<circle cx="21" cy="21" r="15.9155" fill="none" stroke="${color}" stroke-width="4.5" stroke-dasharray="${pctVal} ${100 - pctVal}" stroke-dashoffset="${-cumulative}"/>`;
    cumulative += pctVal;
    legend += `<div class="legend-item"><div class="legend-dot" style="background:${color};color:${color}"></div><div class="legend-info"><div class="legend-label">${esc(type)}</div><div class="legend-meta">${data.count} ativo${data.count > 1 ? 's' : ''}</div></div><div><div class="legend-value">${brl(data.value)}</div><div class="legend-pct">${pctVal.toFixed(1)}%</div></div></div>`;
  }
  container.innerHTML = `<div class="alloc-card"><div class="alloc-title">Alocação por classe</div><div class="alloc-body"><div class="donut-wrapper"><svg viewBox="0 0 42 42" class="donut"><circle cx="21" cy="21" r="15.9155" fill="none" stroke="rgba(255,255,255,.04)" stroke-width="4.5"/><g transform="rotate(-90 21 21)">${segments}</g></svg></div><div class="alloc-legend">${legend}</div></div></div>`;
}

/* ---------- IR ---------- */
function realizedEvents() {
  const events = [];
  const m = {};
  const sorted = [...state.trades].sort((a, b) => (a.date || '').localeCompare(b.date || ''));
  for (const t of sorted) {
    const c = catalogEntry(t.ticker);
    const type = c?.type || 'Outro';
    const rf = isRFAsset(t.ticker);
    let p = m[t.ticker] || (m[t.ticker] = { qty: 0, cost: 0 });
    if (t.side === 'buy') {
      p.cost += t.qty * t.price + (t.fees || 0);
      p.qty += t.qty;
    } else {
      const avg = p.qty ? p.cost / p.qty : 0;
      const sold = Math.min(t.qty, p.qty);
      const saleValue = t.qty * t.price;
      const costBasis = avg * sold;
      const fees = t.fees || 0;
      const profit = (t.qty * t.price - fees) - costBasis;
      events.push({ date: t.date, ticker: t.ticker, type, rf, saleValue, costBasis, fees, profit });
      p.cost -= costBasis;
      p.qty -= sold;
      if (p.qty < 1e-8) { p.qty = 0; p.cost = 0; }
    }
  }
  return events;
}

function computeIRReport() {
  const events = realizedEvents();
  const months = {};
  for (const e of events) {
    const ym = (e.date || '').slice(0, 7);
    if (!ym) continue;
    if (!months[ym]) months[ym] = [];
    months[ym].push(e);
  }
  const report = [];
  for (const [ym, sales] of Object.entries(months)) {
    let acoesSales = 0, acoesProfit = 0, fiisSales = 0, fiisProfit = 0, etfSales = 0, etfProfit = 0, outrosSales = 0, outrosProfit = 0;
    for (const s of sales) {
      if (s.rf) continue;
      if (s.type === 'Ação') { acoesSales += s.saleValue; acoesProfit += s.profit; }
      else if (s.type === 'FII') { fiisSales += s.saleValue; fiisProfit += s.profit; }
      else if (s.type === 'ETF') { etfSales += s.saleValue; etfProfit += s.profit; }
      else { outrosSales += s.saleValue; outrosProfit += s.profit; }
    }
    const acoesIsento = acoesSales <= 20000;
    const acoesIR = acoesIsento ? 0 : Math.max(0, acoesProfit) * 0.15;
    const fiisIR = Math.max(0, fiisProfit) * 0.20;
    const etfIR = Math.max(0, etfProfit) * 0.15;
    const outrosIR = Math.max(0, outrosProfit) * 0.15;
    const totalIR = acoesIR + fiisIR + etfIR + outrosIR;
    report.push({ ym, acoesSales, acoesProfit, acoesIR, acoesIsento, fiisSales, fiisProfit, fiisIR, etfSales, etfProfit, etfIR, outrosSales, outrosProfit, outrosIR, totalIR });
  }
  return report.sort((a, b) => b.ym.localeCompare(a.ym));
}

function renderIR() {
  const report = computeIRReport();
  const container = $('irContent');
  if (!report.length) {
    container.innerHTML = `<div class="empty">Nenhuma venda registrada ainda.<br>Quando você vender ações, FIIs ou ETFs, o cálculo de IR aparece aqui.</div>`;
    return;
  }
  const y = String(new Date().getFullYear());
  const yearTotal = report.filter(r => r.ym.startsWith(y)).reduce((s, r) => s + r.totalIR, 0);
  const mn = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
  let html = `<div class="ir-summary">
    <div class="ir-summary-label">DARF estimado em ${y}</div>
    <div class="ir-summary-value" style="color:${yearTotal > 0 ? 'var(--pink)' : 'var(--cyan)'}">${brl(yearTotal)}</div>
    <div class="ir-summary-sub">Vencimento: último dia útil do mês seguinte</div>
  </div>`;
  for (const r of report) {
    const [yy, mm] = r.ym.split('-');
    const label = `${mn[Number(mm) - 1]} ${yy}`;
    html += `<div class="ir-month">
      <div class="ir-month-head"><div class="ir-month-label">${label}</div><div class="ir-month-total">${brl(r.totalIR)}</div></div>`;
    if (r.acoesSales > 0) html += `<div class="ir-row"><span class="lbl">Ações · vendas ${brl(r.acoesSales)} ${r.acoesIsento ? '<span class="ir-badge isento">isento</span>' : '<span class="ir-badge due">tributado</span>'}</span><span class="val">${brl(r.acoesIR)}</span></div>`;
    if (r.fiisSales > 0) html += `<div class="ir-row"><span class="lbl">FIIs · vendas ${brl(r.fiisSales)} · lucro ${brl(r.fiisProfit)}</span><span class="val">${brl(r.fiisIR)}</span></div>`;
    if (r.etfSales > 0) html += `<div class="ir-row"><span class="lbl">ETFs · vendas ${brl(r.etfSales)} · lucro ${brl(r.etfProfit)}</span><span class="val">${brl(r.etfIR)}</span></div>`;
    if (r.outrosSales > 0) html += `<div class="ir-row"><span class="lbl">Outros · vendas ${brl(r.outrosSales)}</span><span class="val">${brl(r.outrosIR)}</span></div>`;
    html += `</div>`;
  }
  container.innerHTML = html;
}

/* ---------- Parser de nota ---------- */
function parseNotaLine(line) {
  if (!line) return null;
  const clean = line.trim();
  if (!clean) return null;
  const parts = clean.split(/[,;\t]+/).map(s => s.trim()).filter(Boolean);
  if (parts.length >= 5) {
    const isoDate = parts.find(p => /^\d{4}-\d{2}-\d{2}$/.test(p));
    const brDate = parts.find(p => /^\d{2}\/\d{2}\/\d{4}$/.test(p));
    const tk = parts.find(p => /^[A-Z]{3,6}\d{1,3}$/i.test(p));
    const sideStr = parts.find(p => /^(compra|venda|c|v|buy|sell)$/i.test(p));
    if (!tk) return null;
    let date = today();
    if (isoDate) date = isoDate;
    else if (brDate) { const [d, m, y] = brDate.split('/'); date = `${y}-${m}-${d}`; }
    let side = '';
    if (sideStr) {
      const s = sideStr.toLowerCase();
      side = (s === 'compra' || s === 'c' || s === 'buy') ? 'buy' : 'sell';
    }
    const nums = parts.filter(p => /^\d+([.,]\d+)?$/.test(p)).map(p => parseFloat(p.replace(',', '.')));
    let qty = 0, price = 0, fees = 0;
    if (nums.length >= 2) { qty = nums[0]; price = nums[1]; if (nums.length >= 3) fees = nums[2]; }
    if (!side || !qty || !price) return null;
    return { ticker: tk.toUpperCase(), side, qty, price, date, fees };
  }
  const tickerMatch = clean.match(/\b([A-Z]{3,6}\d{1,3})\b/i);
  if (!tickerMatch) return null;
  const ticker = tickerMatch[1].toUpperCase();
  const rest = clean.slice(clean.indexOf(tickerMatch[1]) + tickerMatch[1].length).trim();
  let side = '';
  if (/\b(compra|aplica[çc][aã]o)\b/i.test(clean)) side = 'buy';
  else if (/\b(venda|resgate)\b/i.test(clean)) side = 'sell';
  else { const sm = rest.match(/^\s*(C|V|B|S)\b/i); if (sm) { const c = sm[1].toUpperCase(); side = (c === 'C' || c === 'B') ? 'buy' : 'sell'; } }
  if (!side) return null;
  const nums = rest.match(/\d+([.,]\d+)?/g);
  if (!nums || nums.length < 2) return null;
  const qty = parseFloat(nums[0].replace(',', '.'));
  const price = parseFloat(nums[1].replace(',', '.'));
  if (!qty || !price) return null;
  let date = today();
  const isoMatch = clean.match(/(\d{4})-(\d{2})-(\d{2})/);
  const brMatch = clean.match(/(\d{2})\/(\d{2})\/(\d{4})/);
  if (isoMatch) date = `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`;
  else if (brMatch) date = `${brMatch[3]}-${brMatch[2]}-${brMatch[1]}`;
  return { ticker, side, qty, price, date, fees: 0 };
}

/* Parser específico de nota Sinacor (PDF extraído) */
function parseNotaSinacor(text) {
  if (!text) return [];
  const results = [];
  const seen = new Set();
  let normalized = String(text).replace(/\r/g, '\n');
  normalized = normalized.replace(/[ \t]+/g, ' ');
  const lines = normalized.split(/\n+/).map(l => l.trim()).filter(Boolean);

  for (const line of lines) {
    const tickerM = line.match(/\b([A-Z]{4}\d{1,2})\b/);
    if (!tickerM) continue;
    const ticker = tickerM[1];
    if (seen.has(ticker + '@' + line)) continue;
    seen.add(ticker + '@' + line);
    const idx = line.indexOf(ticker);
    const before = line.slice(0, idx);
    const after = line.slice(idx + ticker.length);
    let side = null;
    const cvBefore = before.match(/\b([CV])\s*$/);
    const cvAfter = after.match(/\s*\b([CV])\b/);
    if (cvBefore) side = cvBefore[1] === 'C' ? 'buy' : 'sell';
    else if (cvAfter) side = cvAfter[1] === 'C' ? 'buy' : 'sell';
    if (!side) {
      const cvs = (before + ' ' + after).match(/\b[CV]\b/g);
      if (cvs && cvs.length) side = cvs[0] === 'C' ? 'buy' : 'sell';
    }
    if (!side) continue;
    const numsAfter = after.match(/\d+(?:[.,]\d+)?/g);
    if (!numsAfter || numsAfter.length < 2) continue;
    const qty = parseFloat(numsAfter[0].replace(/\./g, '').replace(',', '.'));
    const price = parseFloat(numsAfter[1].replace(/\./g, '').replace(',', '.'));
    if (!qty || !price || qty < 1 || price < 0.01) continue;
    let date = today();
    const isoD = line.match(/(\d{4})-(\d{2})-(\d{2})/);
    const brD = line.match(/(\d{2})\/(\d{2})\/(\d{4})/);
    if (isoD) date = `${isoD[1]}-${isoD[2]}-${isoD[3]}`;
    else if (brD) date = `${brD[3]}-${brD[2]}-${brD[1]}`;
    results.push({ ticker, side, qty, price, date, fees: 0 });
  }
  return results;
}

function parseAnyNota(text) {
  if (!text) return [];
  const linhas = text.split(/\r?\n/).filter(Boolean);
  const results = [];
  for (const l of linhas) {
    const r = parseNotaLine(l);
    if (r) results.push(r);
  }
  if (results.length) return results;
  return parseNotaSinacor(text);
}

/* ---------- PDF.js ---------- */
let pdfjsLoading = null;
function loadPDFJS() {
  if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib);
  if (pdfjsLoading) return pdfjsLoading;
  pdfjsLoading = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    s.onload = () => {
      try {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        resolve(window.pdfjsLib);
      } catch (e) { reject(e); }
    };
    s.onerror = () => { pdfjsLoading = null; reject(new Error('Falha ao carregar PDF.js')); };
    document.head.appendChild(s);
  });
  return pdfjsLoading;
}

async function extractPDFText(file) {
  const pdfjsLib = await loadPDFJS();
  const buf = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
  let fullText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    // Reconstrói linhas usando coordenadas Y
    const items = content.items.map(it => ({ str: it.str, y: Math.round(it.transform[5]), x: it.transform[4] }));
    items.sort((a, b) => b.y - a.y || a.x - b.x);
    let lastY = null, line = '';
    const lines = [];
    for (const it of items) {
      if (lastY === null || Math.abs(it.y - lastY) < 3) {
        line += (line ? ' ' : '') + it.str;
      } else {
        lines.push(line);
        line = it.str;
      }
      lastY = it.y;
    }
    if (line) lines.push(line);
    fullText += lines.join('\n') + '\n';
  }
  return fullText;
}

/* ---------- Preview de importação ---------- */
let pendingImport = [];

function renderImportPreview() {
  const box = $('notaPreview');
  if (!pendingImport.length) {
    box.classList.remove('hidden');
    box.innerHTML = `<div class="import-preview-card">
      <div class="import-preview-title">Nada reconhecido</div>
      <div class="import-status err">Não consegui identificar negócios nesse texto. Formatos aceitos: <b>MXRF11 C 10 9,85 2025-01-15</b>, CSV ou PDF padrão Sinacor.</div>
    </div>`;
    return;
  }
  const rows = pendingImport.map((r, i) => {
    const cat = catalogEntry(r.ticker);
    const type = cat?.type || 'Outro';
    const total = r.qty * r.price + (r.fees || 0);
    return `<div class="import-row">
      <div class="info">
        <b>${esc(r.ticker)}</b> <span class="pill" style="margin-left:4px">${esc(type)}</span>
        <div class="meta">${r.side === 'buy' ? 'Compra' : 'Venda'} · ${qtyToBR(r.qty)} × ${brl(r.price)} · ${esc(r.date)}</div>
      </div>
      <div class="amount">${brl(total)}</div>
      <button type="button" class="delete-btn" onclick="removePendingImport(${i})">×</button>
    </div>`;
  }).join('');
  box.classList.remove('hidden');
  box.innerHTML = `<div class="import-preview-card">
    <div class="import-preview-title">${pendingImport.length} negócio(s) reconhecido(s)</div>
    ${rows}
    <div class="import-actions">
      <button type="button" class="ghost" onclick="cancelImport()">Cancelar</button>
      <button type="button" class="primary" onclick="confirmImport()">Importar tudo</button>
    </div>
  </div>`;
}

function analyzeNotaText(text) {
  const parsed = parseAnyNota(text);
  pendingImport = parsed;
  renderImportPreview();
}

window.removePendingImport = function (i) { pendingImport.splice(i, 1); renderImportPreview(); };
window.cancelImport = function () {
  pendingImport = [];
  $('notaPreview').classList.add('hidden');
  $('notaInput').value = '';
  const pf = $('notaPdf'); if (pf) pf.value = '';
  const st = $('pdfStatus'); if (st) { st.textContent = ''; st.className = 'import-status'; }
};
window.confirmImport = function () {
  if (!pendingImport.length) return;
  let added = 0;
  for (const r of pendingImport) {
    ensureTickerInCatalog(r.ticker);
    state.trades.push({ ticker: r.ticker, side: r.side, qty: r.qty, price: r.price, fees: r.fees || 0, date: r.date });
    if (state.prices[r.ticker] === undefined) state.prices[r.ticker] = r.price;
    added++;
  }
  pendingImport = [];
  save();
  $('notaPreview').classList.add('hidden');
  $('notaInput').value = '';
  const pf = $('notaPdf'); if (pf) pf.value = '';
  alert(`✅ ${added} operação(ões) importada(s).`);
  window.showTab('portfolio');
};

async function handlePDFUpload(file) {
  const st = $('pdfStatus');
  st.textContent = 'Lendo PDF…'; st.className = 'import-status';
  try {
    const text = await extractPDFText(file);
    if (!text || text.length < 20) throw new Error('PDF vazio ou sem texto. Talvez seja digitalizado (imagem).');
    st.textContent = `✅ PDF lido (${text.length} caracteres). Analisando…`; st.className = 'import-status ok';
    const parsed = parseNotaSinacor(text);
    if (!parsed.length) {
      st.textContent = '⚠️ PDF lido, mas não reconheci negócios. Confira se é nota de corretagem padrão Sinacor.';
      st.className = 'import-status err';
      $('notaInput').value = text.slice(0, 3000);
      return;
    }
    pendingImport = parsed;
    renderImportPreview();
    st.textContent = `✅ ${parsed.length} negócio(s) reconhecido(s) do PDF.`;
    st.className = 'import-status ok';
  } catch (e) {
    st.textContent = '❌ ' + (e.message || 'Falha ao ler PDF.');
    st.className = 'import-status err';
  }
}

/* ---------- Render principal ---------- */
function render() {
  const ps = positions();
  const total = ps.reduce((s, p) => s + p.market, 0);
  const totalCost = ps.reduce((s, p) => s + p.cost, 0);
  const profit = ps.reduce((s, p) => s + p.unrealized, 0);
  const totalPct = totalCost > 0 ? (profit / totalCost) * 100 : 0;
  $('total').textContent = brl(total);
  const badge = $('totalPct'); badge.textContent = pct(totalPct); badge.className = 'hero-badge ' + (totalPct >= 0 ? 'pos' : 'neg');
  $('count').textContent = ps.length;
  $('updatedAt').textContent = state.lastUpdated ? ('Cotações ' + timeAgo(state.lastUpdated) + (state.lastSource ? ' · ' + state.lastSource : '')) : '';
  const pel = $('profit'); pel.textContent = (profit > 0 ? '+' : '') + brl(profit); pel.style.color = profit < 0 ? '#ffd0dd' : '#d5f7ff';
  const dt = computeDividendTotals(); $('divMonth').textContent = brl(dt.month); $('divYear').textContent = brl(dt.year);
  renderEvolution();
  renderAllocation(ps);

  $('assets').innerHTML = ps.length ? ps.map(p => {
    const pos = p.unrealized >= 0;
    const yocText = p.div12m > 0 ? pct(p.yoc) : '—';
    const displayName = displayTicker(p.ticker);
    const cdiTag = p.isRF && rfPct(p.ticker) !== 100 ? `<span class="pill pill-cdi">${rfPct(p.ticker)}% CDI</span>` : '';
    if (p.isRF) {
      const cdiInfo = `CDI ${rfPct(p.ticker)}% · Taxa ${state.cdiRate.toFixed(2)}% a.a.`;
      return `<div class="asset">
        <div class="assetTop">
          <div><div class="ticker">${esc(displayName)} <span class="pill">${esc(p.type)}</span> ${cdiTag}</div><div class="small">${esc(p.name)}</div></div>
          <div class="right"><strong>${brl(p.market)}</strong><div class="small">Saldo atual</div></div>
        </div>
        <div class="sub-grid">
          <div><div class="sub-label">Valor aplicado</div><div class="sub-value">${brl(p.cost)}</div></div>
          <div><div class="sub-label">Rentabilidade</div><div class="sub-value" style="color:${pos ? 'var(--success)' : 'var(--danger)'}">${pct(p.unrealizedPct)}</div></div>
          <div><div class="sub-label">Resultado</div><div class="sub-value" style="color:${pos ? 'var(--success)' : 'var(--danger)'}">${pos ? '+' : ''}${brl(p.unrealized)}</div></div>
          <div><div class="sub-label">Proventos 12m</div><div class="sub-value" style="color:var(--cyan)">${p.div12m > 0 ? brl(p.div12m) : '—'}</div></div>
        </div>
        <div class="yoc-line"><span>${cdiInfo}</span><b>${yocText}</b></div>
        <div class="actions">
          <button type="button" class="ghost-sm" onclick="updatePrice('${esc(p.ticker)}')">Atualizar saldo</button>
          <button type="button" class="ghost-sm" onclick="openRedeem('${esc(p.ticker)}')">Resgatar</button>
          <button type="button" class="ghost-sm" onclick="showProvento('${esc(p.ticker)}')">Provento</button>
          <button type="button" class="ghost-sm danger-ghost" onclick="removePosition('${esc(p.ticker)}')">Remover</button>
        </div>
      </div>`;
    }
    return `<div class="asset">
      <div class="assetTop">
        <div><div class="ticker">${esc(displayName)} <span class="pill">${esc(p.type)}</span></div><div class="small">${esc(p.name)} · ${qtyToBR(p.qty)} un.</div></div>
        <div class="right"><strong>${brl(p.market)}</strong><div class="small">Atual ${brl(p.current)}</div></div>
      </div>
      <div class="sub-grid">
        <div><div class="sub-label">Preço médio</div><div class="sub-value">${brl(p.avg)}</div></div>
        <div><div class="sub-label">Rentabilidade</div><div class="sub-value" style="color:${pos ? 'var(--success)' : 'var(--danger)'}">${pct(p.unrealizedPct)}</div></div>
        <div><div class="sub-label">Resultado</div><div class="sub-value" style="color:${pos ? 'var(--success)' : 'var(--danger)'}">${pos ? '+' : ''}${brl(p.unrealized)}</div></div>
        <div><div class="sub-label">Proventos 12m</div><div class="sub-value" style="color:var(--cyan)">${p.div12m > 0 ? brl(p.div12m) : '—'}</div></div>
      </div>
      <div class="yoc-line"><span>YOC 12m (sobre preço médio)</span><b>${yocText}</b></div>
      <div class="actions">
        <button type="button" class="ghost-sm" onclick="updatePrice('${esc(p.ticker)}')">Editar preço</button>
        <button type="button" class="ghost-sm" onclick="openSell('${esc(p.ticker)}')">Vender</button>
        <button type="button" class="ghost-sm" onclick="showProvento('${esc(p.ticker)}')">Provento</button>
        <button type="button" class="ghost-sm danger-ghost" onclick="removePosition('${esc(p.ticker)}')">Remover</button>
      </div>
    </div>`;
  }).join('') : '<div class="empty">Nenhuma posição ainda.<br>Toque em <b>Comprar</b> para registrar a primeira compra.</div>';

  renderTradeHistory();
  renderDivHistory();
  renderIR();
  $('autoRefreshSelect').value = String(state.autoRefresh || 0);
  $('cdiRateInput').value = numToBR(state.cdiRate);
}

function renderTradeHistory() {
  const history = state.trades.slice().reverse().slice(0, 20);
  $('tradeHistory').innerHTML = history.length ? history.map(t => {
    const isRF = isRFAsset(t.ticker);
    const label = isRF ? (t.side === 'buy' ? 'Aplicação' : 'Resgate') : (t.side === 'buy' ? 'Compra' : 'Venda');
    const detail = isRF ? `${esc(t.date)} · ${brl(Math.abs(t.qty * t.price))}` : `${esc(t.date)} · ${qtyToBR(t.qty)} un. a ${brl(t.price)}`;
    return `<div class="asset"><div class="assetTop"><div><strong>${label} · ${esc(displayTicker(t.ticker))}</strong><div class="small">${detail}</div></div><strong>${brl(Math.abs(t.qty * t.price) + (t.fees || 0))}</strong></div></div>`;
  }).join('') : '<div class="empty">Nenhuma operação registrada.</div>';
}

function renderDivHistory() {
  const list = [...state.dividends].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  if (!list.length) { $('divHistory').innerHTML = '<div class="empty">Nenhum provento registrado ainda.</div>'; return; }
  const groups = {};
  for (const d of list) { const k = (d.date || '').slice(0, 7); if (!groups[k]) groups[k] = []; groups[k].push(d); }
  const mn = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
  const html = Object.keys(groups).sort().reverse().map(k => {
    const [y, m] = k.split('-'); const label = `${mn[Number(m) - 1]} ${y}`; const items = groups[k];
    const total = items.reduce((s, d) => s + Number(d.amount || 0), 0);
    return `<div class="month-group"><div class="month-label"><span>${label}</span><span class="month-total">${brl(total)}</span></div>${items.map(d => `<div class="div-card"><div class="div-row"><div><strong>${esc(displayTicker(d.ticker))}</strong><span class="div-type" style="margin-left:6px">${esc(d.kind || 'Dividendo')}</span><div class="div-meta">${esc(d.date)}</div></div><div style="text-align:right"><div class="div-amount">${brl(d.amount)}</div><button type="button" class="delete-btn" onclick="deleteDividend(${d.id})">excluir</button></div></div></div>`).join('')}</div>`;
  }).join('');
  $('divHistory').innerHTML = html;
}

function toggleRFFields(isRF) {
  $('tradeRegularFields').classList.toggle('hidden', isRF);
  $('tradeRFFields').classList.toggle('hidden', !isRF);
}

function choose(a, autoAdd) {
  if (autoAdd) ensureTickerInCatalog(a.ticker);
  $('chosenTicker').value = a.ticker; $('chosenType').value = a.type || 'Outro';
  $('assetSearch').value = a.ticker + ' — ' + a.name;
  $('selectedTicker').textContent = a.ticker; $('selectedName').textContent = a.name; $('selectedType').textContent = 'Categoria: ' + a.type;
  $('selectedBox').classList.remove('hidden'); $('suggestions').classList.add('hidden');
  toggleRFFields(a.type === 'Renda fixa' || isRFTicker(a.ticker));
  if (!a.type || a.type !== 'Renda fixa') { $('tradeRFPct').value = '100'; }
}
function chooseDiv(a, autoAdd) {
  if (autoAdd) ensureTickerInCatalog(a.ticker);
  $('divChosenTicker').value = a.ticker; $('divTickerSearch').value = a.ticker + ' — ' + a.name;
  $('divSelectedTicker').textContent = a.ticker; $('divSelectedName').textContent = a.name;
  $('divSelectedBox').classList.remove('hidden'); $('divSuggestions').classList.add('hidden');
}

window.showTab = function(id) {
  document.querySelectorAll('.tabs button').forEach(x => x.classList.toggle('active', x.dataset.tab === id));
  ['portfolio','trade','dividends','ir','backup'].forEach(t => { const el = $(t); if (el) el.classList.toggle('hidden', t !== id); });
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.updatePrice = async function(ticker) {
  const p = positions().find(x => x.ticker === ticker);
  const isRF = p?.isRF;
  const label = isRF ? ('Saldo atual de ' + displayTicker(ticker)) : ('Preço atual de ' + displayTicker(ticker));
  const def = isRF ? numToBR(p?.current || p?.cost || 0) : numToBR(p?.current || 0);
  const v = await openMoneyModal(label, def);
  if (v === null) return;
  const n = parseMoneyBR(v);
  if (!Number.isFinite(n) || n <= 0) { alert('Informe um valor maior que zero.'); return; }
  state.prices[ticker] = n;
  if (isRF) state.rfLastProjection = null;
  save();
};

window.showProvento = function(ticker) {
  window.showTab('dividends');
  $('divFormBox').classList.remove('hidden');
  const base = isRFComposite(ticker) ? rfBase(ticker) : ticker;
  const a = catalogEntry(ticker) || { ticker: base, name: base, type: 'Outro' };
  chooseDiv(a, false);
};
window.deleteDividend = function(id) {
  if (!confirm('Excluir este provento?')) return;
  state.dividends = state.dividends.filter(d => d.id !== id);
  save();
};
window.removePosition = function(ticker) {
  const nome = displayTicker(ticker);
  if (!confirm(`Remover "${nome}" completamente?\n\nIsso apaga TODAS as operações, proventos e preços deste ativo. Não tem como desfazer.`)) return;
  state.trades = state.trades.filter(t => t.ticker !== ticker);
  state.dividends = state.dividends.filter(d => d.ticker !== ticker);
  delete state.prices[ticker];
  save();
  alert('Investimento removido.');
};

/* ---------- Modal de venda ---------- */
window.openSell = function(ticker) {
  const p = positions().find(x => x.ticker === ticker);
  if (!p) { alert('Posição não encontrada.'); return; }
  const modal = $('sellModal');
  modal.dataset.ticker = ticker;
  $('sellTickerName').textContent = displayTicker(ticker);
  $('sellInfo').innerHTML = `Posição atual: <b>${qtyToBR(p.qty)}</b> un. · Preço médio ${brl(p.avg)}<br>Preço atual de mercado: <b>${brl(p.current)}</b>`;
  $('sellQty').value = qtyToBR(p.qty);
  $('sellPrice').value = numToBR(p.current);
  $('sellDate').value = today();
  $('sellFees').value = '0,00';
  modal.classList.remove('hidden');
};

$('sellCancel').addEventListener('click', () => $('sellModal').classList.add('hidden'));
$('sellModal').addEventListener('click', e => { if (e.target === $('sellModal')) $('sellModal').classList.add('hidden'); });

$('sellConfirm').addEventListener('click', () => {
  const modal = $('sellModal');
  const ticker = modal.dataset.ticker;
  const qty = parseNum($('sellQty').value);
  const price = parseMoneyBR($('sellPrice').value);
  const fees = parseMoneyBR($('sellFees').value);
  const date = $('sellDate').value || today();
  if (!ticker) { alert('Ticker não identificado.'); return; }
  if (!qty || qty <= 0) { alert('Informe uma quantidade válida.'); return; }
  if (!price || price <= 0) { alert('Informe um preço válido.'); return; }
  const p = positions().find(x => x.ticker === ticker);
  if (!p) { alert('Posição não encontrada.'); return; }
  if (qty > p.qty + 1e-6) { alert(`Você tem apenas ${qtyToBR(p.qty)} unidades.`); return; }
  state.trades.push({ ticker, side: 'sell', qty, price, fees, date });
  save();
  modal.classList.add('hidden');
  alert(`✅ Venda de ${qtyToBR(qty)} ${displayTicker(ticker)} a ${brl(price)} registrada.`);
});

/* ---------- Modal de resgate RF ---------- */
window.openRedeem = function(ticker) {
  const p = positions().find(x => x.ticker === ticker);
  if (!p) { alert('Posição não encontrada.'); return; }
  const modal = $('redeemModal');
  modal.dataset.ticker = ticker;
  $('redeemTickerName').textContent = displayTicker(ticker);
  $('redeemInfo').innerHTML = `Valor aplicado: <b>${brl(p.cost)}</b><br>Saldo atual projetado: <b>${brl(p.market)}</b>`;
  $('redeemValue').value = numToBR(p.market);
  $('redeemDate').value = today();
  modal.classList.remove('hidden');
};

$('redeemCancel').addEventListener('click', () => $('redeemModal').classList.add('hidden'));
$('redeemModal').addEventListener('click', e => { if (e.target === $('redeemModal')) $('redeemModal').classList.add('hidden'); });

$('redeemConfirm').addEventListener('click', () => {
  const modal = $('redeemModal');
  const ticker = modal.dataset.ticker;
  const value = parseMoneyBR($('redeemValue').value);
  const date = $('redeemDate').value || today();
  if (!ticker) { alert('Ticker não identificado.'); return; }
  if (!value || value <= 0) { alert('Informe um valor válido.'); return; }
  const p = positions().find(x => x.ticker === ticker);
  if (!p) { alert('Posição não encontrada.'); return; }
  if (value > p.cost + 1e-6) { alert(`Valor maior que o aplicado (${brl(p.cost)}).`); return; }
  const pctCDI = rfPct(ticker);
  state.trades.push({ ticker, side: 'sell', qty: 1, price: value, fees: 0, date, pctCDI });
  state.rfLastProjection = null;
  runRFProjection(true);
  save();
  modal.classList.add('hidden');
  alert(`✅ Resgate de ${brl(value)} registrado.`);
});

/* ---------- Modal genérico de valor ---------- */
function openMoneyModal(title, defaultValue) {
  return new Promise(resolve => {
    const overlay = $('modalOverlay'), input = $('modalInput');
    $('modalTitle').textContent = title;
    input.value = defaultValue ? digitsToMoney(String(defaultValue).replace(/\D/g, '')) : '';
    overlay.classList.remove('hidden');
    setTimeout(() => { input.focus(); const l = input.value.length; input.setSelectionRange(l, l); }, 60);
    function cleanup() {
      overlay.classList.add('hidden');
      $('modalConfirm').removeEventListener('click', onConfirm);
      $('modalCancel').removeEventListener('click', onCancel);
      overlay.removeEventListener('click', onOverlay);
      input.removeEventListener('keydown', onKey);
    }
    function onConfirm() { const v = input.value; cleanup(); resolve(v); }
    function onCancel() { cleanup(); resolve(null); }
    function onOverlay(e) { if (e.target === overlay) onCancel(); }
    function onKey(e) { if (e.key === 'Enter') { e.preventDefault(); onConfirm(); } if (e.key === 'Escape') onCancel(); }
    $('modalConfirm').addEventListener('click', onConfirm);
    $('modalCancel').addEventListener('click', onCancel);
    overlay.addEventListener('click', onOverlay);
    input.addEventListener('keydown', onKey);
  });
}

/* ---------- Eventos ---------- */
['tradePrice','tradeRFValue','fees','divAmount','modalInput','cdiRateInput','sellPrice','sellFees','redeemValue'].forEach(id => { const el = $(id); if (el) attachMoneyMask(el); });

$('refreshBtn').addEventListener('click', refreshQuotes);
$('notaAnalyzeBtn').addEventListener('click', () => {
  analyzeNotaText($('notaInput').value || '');
});
$('notaExampleBtn').addEventListener('click', () => {
  $('notaInput').value = `MXRF11 C 10 9,85 ${today()}
HGLG11 C 5 165,50 ${today()}
PETR4 C 100 38,20 ${today()}
VALE3 V 50 62,15 ${today()}`;
});
$('notaPdf').addEventListener('change', async e => {
  const f = e.target.files[0];
  if (f) await handlePDFUpload(f);
});

$('assetSearch').addEventListener('input', e => {
  const raw = e.target.value.trim(); const q = raw.toLowerCase(); const upper = raw.toUpperCase().replace(/[^A-Z0-9]/g, '');
  const exact = catalog().find(a => a.ticker === upper);
  if (exact && /^[a-zA-Z0-9]{2,}$/.test(raw)) toggleRFFields(exact.type === 'Renda fixa' || isRFTicker(exact.ticker));
  else if (!exact) toggleRFFields(false);
  const matches = catalog().filter(a => (a.ticker + ' ' + a.name).toLowerCase().includes(q)).slice(0, 10);
  const box = $('suggestions'); let html = '';
  const exactInMatches = matches.some(a => a.ticker === upper);
  if (upper && !exactInMatches && upper.length >= 3) { html += `<button type="button" class="suggestion new" data-new="1"><span><strong>+ Usar "${esc(upper)}"</strong><br><small style="color:var(--muted)">Ticker novo — salvo automaticamente</small></span><span class="pill pill-new">Novo</span></button>`; }
  html += matches.map((a, i) => `<button type="button" class="suggestion" data-index="${i}"><span><strong>${esc(a.ticker)}</strong><br><small style="color:var(--muted)">${esc(a.name)}</small></span><span class="pill">${esc(a.type)}</span></button>`).join('');
  box.innerHTML = html; box.classList.toggle('hidden', !q && !upper);
  const nb = box.querySelector('button[data-new]'); if (nb) nb.addEventListener('click', () => choose({ ticker: upper, name: upper, type: isRFTicker(upper) ? 'Renda fixa' : 'Outro' }, true));
  box.querySelectorAll('button[data-index]').forEach(b => b.addEventListener('click', () => choose(matches[Number(b.dataset.index)], false)));
  $('chosenTicker').value = ''; $('chosenType').value = ''; $('selectedBox').classList.add('hidden');
});

$('tradeDate').value = today();

$('tradeForm').addEventListener('submit', e => {
  e.preventDefault();
  let ticker = ($('chosenTicker').value || '').trim();
  if (!ticker) {
    // Fallback: extrai apenas a parte do ticker antes de " — " se existir
    const raw = $('assetSearch').value.trim();
    const beforeDash = raw.split('—')[0].trim();
    const candidate = beforeDash.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (candidate.length >= 3 && candidate.length <= 10) ticker = candidate;
  }
  if (!ticker) { alert('Escolha um ativo da lista.'); return; }
  const entry = catalogEntry(ticker);
  const isRF = (entry?.type === 'Renda fixa') || isRFTicker(ticker) || isRFComposite(ticker);
  const fees = parseMoneyBR($('fees').value);
  let qty, price, pctCDI = 100, finalTicker = ticker;
  if (isRF) {
    const value = parseMoneyBR($('tradeRFValue').value);
    if (value <= 0) { alert('Informe um valor válido em "Valor aplicado".'); return; }
    pctCDI = parseNum($('tradeRFPct').value) || 100;
    finalTicker = buildRFTicker(rfBase(ticker), pctCDI);
    qty = 1; price = value;
  } else {
    qty = parseNum($('tradeQty').value); price = parseMoneyBR($('tradePrice').value);
    if (qty <= 0 || price <= 0) { alert('Informe quantidade e preço válidos.'); return; }
  }
  ensureTickerInCatalog(finalTicker);
  const trade = { ticker: finalTicker, side: 'buy', qty, price, fees, date: $('tradeDate').value || today() };
  if (isRF) trade.pctCDI = pctCDI;
  state.trades.push(trade);
  if (isRF) {
    state.rfLastProjection = null;
    runRFProjection(true);
  } else {
    if (state.prices[finalTicker] === undefined) state.prices[finalTicker] = price;
  }
  save(); e.target.reset();
  $('tradeDate').value = today(); $('assetSearch').value = ''; $('chosenTicker').value = ''; $('chosenType').value = '';
  $('tradeRFPct').value = '100';
  $('selectedBox').classList.add('hidden'); toggleRFFields(false); window.showTab('portfolio');
});

$('toggleDivForm').addEventListener('click', () => { const box = $('divFormBox'); box.classList.toggle('hidden'); if (!box.classList.contains('hidden')) $('divDate').value = today(); });
$('divDate').value = today();

$('divTickerSearch').addEventListener('input', e => {
  const raw = e.target.value.trim(); const q = raw.toLowerCase();
  const matches = catalog().filter(a => (a.ticker + ' ' + a.name).toLowerCase().includes(q)).slice(0, 10);
  const box = $('divSuggestions'); let html = '';
  const upper = raw.toUpperCase().replace(/[^A-Z0-9]/g, ''); const exact = matches.some(a => a.ticker === upper);
  if (upper && !exact && upper.length >= 3) { html += `<button type="button" class="suggestion new" data-new="1"><span><strong>+ Usar "${esc(upper)}"</strong><br><small style="color:var(--muted)">Ticker novo — salvo automaticamente</small></span><span class="pill pill-new">Novo</span></button>`; }
  html += matches.map((a, i) => `<button type="button" class="suggestion" data-index="${i}"><span><strong>${esc(a.ticker)}</strong><br><small style="color:var(--muted)">${esc(a.name)}</small></span><span class="pill pill-div">${esc(a.type)}</span></button>`).join('');
  box.innerHTML = html; box.classList.toggle('hidden', !q && !upper);
  const nb = box.querySelector('button[data-new]'); if (nb) nb.addEventListener('click', () => chooseDiv({ ticker: upper, name: upper, type: isRFTicker(upper) ? 'Renda fixa' : 'Outro' }, true));
  box.querySelectorAll('button[data-index]').forEach(b => b.addEventListener('click', () => chooseDiv(matches[Number(b.dataset.index)], false)));
  $('divChosenTicker').value = ''; $('divSelectedBox').classList.add('hidden');
});

$('divForm').addEventListener('submit', e => {
  e.preventDefault();
  let ticker = $('divChosenTicker').value;
  if (!ticker) { const raw = $('divTickerSearch').value.trim().split('—')[0].trim().toUpperCase().replace(/[^A-Z0-9]/g, ''); if (raw && raw.length >= 3) ticker = raw; }
  const amount = parseMoneyBR($('divAmount').value), date = $('divDate').value || today(), kind = $('divKind').value;
  if (!ticker || amount <= 0) { alert('Escolha um ativo e informe um valor válido.'); return; }
  ensureTickerInCatalog(ticker);
  state.dividends.push({ id: Date.now() + Math.floor(Math.random() * 1000), ticker, amount, date, kind });
  save(); e.target.reset();
  $('divChosenTicker').value = ''; $('divTickerSearch').value = ''; $('divSelectedBox').classList.add('hidden');
  $('divDate').value = today(); $('divFormBox').classList.add('hidden');
});

$('autoRefreshSelect').addEventListener('change', e => { state.autoRefresh = Number(e.target.value); save(); setupAutoRefresh(); });
$('cdiRateInput').addEventListener('change', () => {
  const v = parseMoneyBR($('cdiRateInput').value);
  if (v > 0) {
    state.cdiRate = v;
    state.rfLastProjection = null;
    runRFProjection(true);
    save();
  }
});

let autoRefreshTimer = null;
function setupAutoRefresh() {
  if (autoRefreshTimer) { clearInterval(autoRefreshTimer); autoRefreshTimer = null; }
  const min = Number(state.autoRefresh || 0);
  if (min > 0) { autoRefreshTimer = setInterval(() => { if (document.visibilityState === 'visible') refreshQuotes().catch(() => {}); }, min * 60 * 1000); }
}

$('exportBtn').addEventListener('click', () => {
  const exportState = { ...state, apiKey: undefined };
  const blob = new Blob([JSON.stringify(exportState, null, 2)], { type: 'application/json' });
  const u = URL.createObjectURL(blob), a = document.createElement('a');
  a.href = u; a.download = 'enyao-backup.json'; a.click(); URL.revokeObjectURL(u);
});

$('importFile').addEventListener('change', async e => {
  const f = e.target.files[0]; if (!f) return;
  try {
    const d = JSON.parse(await f.text());
    if (d.trades && Array.isArray(d.trades)) {
      if (Array.isArray(d.catalog)) state.catalog = d.catalog;
      if (Array.isArray(d.trades)) state.trades = d.trades;
      if (Array.isArray(d.dividends)) state.dividends = d.dividends;
      if (Array.isArray(d.history)) state.history = d.history;
      if (d.prices && typeof d.prices === 'object') state.prices = d.prices;
      if (d.lastUpdated) state.lastUpdated = d.lastUpdated;
      if (typeof d.cdiRate === 'number') state.cdiRate = d.cdiRate;
      save(); alert('Backup importado.');
    } else alert('Formato não reconhecido.');
  } catch (err) { alert('Não foi possível ler esse arquivo JSON.'); }
  e.target.value = '';
});

$('diagBtn').addEventListener('click', () => {
  try {
    const raw = localStorage.getItem(KEY) || '(vazio)';
    const parsed = raw !== '(vazio)' ? JSON.parse(raw) : null;
    const summary = parsed ? `Operações: ${(parsed.trades || []).length}\nProventos: ${(parsed.dividends || []).length}\nCatálogo pessoal: ${(parsed.catalog || []).length}\nPreços salvos: ${Object.keys(parsed.prices || {}).length}\nHistórico: ${(parsed.history || []).length} dias\nCDI: ${parsed.cdiRate || '—'}%` : '(sem dados)';
    alert('📦 Dados no aparelho:\n\n' + summary + '\n\nTamanho total: ' + raw.length + ' caracteres');
  } catch (e) { alert('Erro ao ler dados: ' + e.message); }
});

$('clearBtn').addEventListener('click', () => {
  if (confirm('Apagar carteira, operações, proventos e catálogo pessoal deste aparelho?')) {
    state = { catalog: [], trades: [], dividends: [], prices: {}, apiKey: DEFAULT_API_KEY, lastUpdated: null, autoRefresh: 0, lastSource: '', cdiRate: 13.65, rfLastProjection: null, history: [] };
    save();
  }
});

async function refreshQuotes() {
  const btn = $('refreshBtn');
  const ps = positions();
  if (!ps.length) { alert('Sem posições para atualizar.'); return; }
  const tickers = ps.filter(p => !p.isRF).map(p => p.ticker);
  if (!tickers.length) { alert('Só há renda fixa. A projeção automática cuida dos saldos.'); return; }
  btn.disabled = true; btn.innerHTML = '<span class="spinner"></span>Buscando cotações…';
  let updated = 0, failed = [], sourceUsed = '';
  for (const tk of tickers) {
    const r = await fetchPrice(tk);
    if (r && r.price > 0) { state.prices[tk] = r.price; updated++; sourceUsed = r.source; }
    else failed.push(tk);
  }
  if (updated) { state.lastUpdated = new Date().toISOString(); state.lastSource = sourceUsed; }
  save(); btn.disabled = false; btn.innerHTML = '🔄 Atualizar cotações agora';
  if (updated && !failed.length) alert(`✅ ${updated} cotação(ões) atualizada(s)\nFonte: ${sourceUsed}`);
  else if (updated && failed.length) alert(`✅ ${updated} atualizada(s) (fonte: ${sourceUsed})\n⚠️ Não encontrei: ${failed.join(', ')}`);
  else alert(`❌ Nenhuma cotação encontrada.\nVerifique os tickers: ${failed.join(', ')}`);
}

async function fetchPriceFromBrapi(ticker) {
  if (!state.apiKey) return null;
  try {
    const url = 'https://brapi.dev/api/quote/' + encodeURIComponent(ticker) + '?token=' + encodeURIComponent(state.apiKey);
    const r = await fetch(url, { headers: { 'Accept': 'application/json' } });
    if (!r.ok) return null;
    const j = await r.json();
    const p = j?.results?.[0]?.regularMarketPrice;
    return (typeof p === 'number' && p > 0) ? p : null;
  } catch (e) { return null; }
}
async function fetchPriceFromYahoo(ticker) {
  try {
    const url = 'https://query1.finance.yahoo.com/v8/finance/chart/' + encodeURIComponent(ticker) + '.SA?interval=1d&range=1d';
    const r = await fetch(url, { headers: { 'Accept': 'application/json' } });
    if (!r.ok) return null;
    const j = await r.json();
    const p = j?.chart?.result?.[0]?.meta?.regularMarketPrice;
    return (typeof p === 'number' && p > 0) ? p : null;
  } catch (e) { return null; }
}
async function fetchPrice(ticker) {
  let p = await fetchPriceFromBrapi(ticker); if (p !== null) return { price: p, source: 'brapi' };
  p = await fetchPriceFromYahoo(ticker); if (p !== null) return { price: p, source: 'Yahoo' };
  return null;
}

/* ---------- Start ---------- */
runRFProjection(false);
recordSnapshot();
render();
setupAutoRefresh();
if ('serviceWorker' in navigator) { window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {})); }