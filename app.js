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
  cdiRate: 13.65, cdiLastUpdate: null,
  rfAutoProject: true, rfLastProjection: null
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
    if (s.cdiLastUpdate) state.cdiLastUpdate = s.cdiLastUpdate;
    if (typeof s.rfAutoProject === 'boolean') state.rfAutoProject = s.rfAutoProject;
    if (s.rfLastProjection) state.rfLastProjection = s.rfLastProjection;
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

/* ---------- Helpers RF / CDI ---------- */
function isRFComposite(t) { return t && t.indexOf('@') !== -1; }
function rfBase(t) { return isRFComposite(t) ? t.split('@')[0] : t; }
function rfPct(t) { return isRFComposite(t) ? (parseFloat(t.split('@')[1]) || 100) : 100; }
function buildRFTicker(base, pct) { return `${base}@${pct}`; }
function displayTicker(t) {
  if (!t) return '';
  if (isRFComposite(t)) { const [b, p] = t.split('@'); return p === '100' ? b : `${b} · ${p}% CDI`; }
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

/* ---------- Migração: RF antigo sem @ vira @100 ---------- */
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

/* ---------- Projeção de rendimento RF ---------- */
function projectRFBalance(ticker) {
  const trades = state.trades.filter(t => t.ticker === ticker);
  if (!trades.length) return 0;
  const pctContratado = rfPct(ticker);
  const cdiAnual = state.cdiRate / 100;
  const taxaAnual = cdiAnual * pctContratado / 100;
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
  if (!state.rfAutoProject && !force) return;
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
    const c = catalogEntry(t.ticker);
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
        let avg = p.qty ? p.cost / p.qty : 0;
        let sold = Math.min(t.qty, p.qty);
        p.realized += (t.price * sold - (t.fees || 0)) - (avg * sold);
        p.cost -= avg * sold; p.qty -= sold;
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
  const pel = $('profit'); pel.textContent = (profit > 0 ? '+' : '') + brl(profit); pel.style.color = profit < 0