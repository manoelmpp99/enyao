/* === PAINEL DE ERRO VISÍVEL === */
(function(){
  function showErr(msg){
    var b=document.getElementById('__err');
    if(!b){
      b=document.createElement('div');b.id='__err';
      b.style.cssText='position:fixed;top:0;left:0;right:0;background:#ff4d80;color:#fff;padding:12px;font:12px/1.4 monospace;z-index:99999;white-space:pre-wrap;max-height:45vh;overflow:auto';
      document.body.appendChild(b);
    }
    b.textContent+=(b.textContent?'\n':'')+msg;
  }
  window.addEventListener('error',function(e){showErr('⚠️ '+(e.message||'erro')+' | '+(e.filename||'').split('/').pop()+':'+(e.lineno||'?'));});
  window.addEventListener('unhandledrejection',function(e){showErr('⚠️ Promise: '+((e.reason&&e.reason.message)||e.reason||'erro'));});
})();

const DEFAULT_API_KEY = 'n2jSRHKNBe1nYrLza56x6n';
const KEY = 'enyao-v02';
const SALDO_TICKER = '__SALDO__';

const baseCatalog = [
  ['MXRF11','Maxi Renda','FII'],['HGLG11','CSHG Logística','FII'],['VISC11','Vinci Shopping Centers','FII'],['XPML11','XP Malls','FII'],['KNRI11','Kinea Renda Imobiliária','FII'],['GARE11','Guardian Real Estate','FII'],['TRXF11','TRX Real Estate','FII'],['RECR11','FII REC Recebíveis Imobiliários','FII'],['LIFE11','Life Capital Partners','FII'],['XPCA11','XP Crédito Agrícola','FII'],['FGAA11','FG Agro','FII'],['AAZQ11','AZ Quest Sole','FII'],['IRIM11','Iridium Recebíveis Imobiliários','FII'],['KNCR11','Kinea Crédito Imobiliário','FII'],['KNIP11','Kinea Índices de Preços','FII'],['HGRU11','CSHG Renda Urbana','FII'],['XPLG11','XP Log','FII'],['BRCO11','Bresco Logística','FII'],['BTLG11','BTG Logística','FII'],['VILG11','Vinci Logística','FII'],['JSRE11','JS Real Estate','FII'],['RBRF11','RBR Alpha','FII'],['RBRP11','RBR Properties','FII'],['CPTS11','Capitânia Securities','FII'],['DEVA11','Devant Recebíveis','FII'],
  ['ITSA4','Itaúsa PN','Ação'],['ITUB4','Itaú Unibanco PN','Ação'],['PETR4','Petrobras PN','Ação'],['PETR3','Petrobras ON','Ação'],['VALE3','Vale ON','Ação'],['BBAS3','Banco do Brasil ON','Ação'],['WEGE3','WEG ON','Ação'],['BBDC4','Bradesco PN','Ação'],['BBDC3','Bradesco ON','Ação'],['ABEV3','Ambev ON','Ação'],['B3SA3','B3 ON','Ação'],['EGIE3','Engie Brasil ON','Ação'],['TAEE11','Taesa units','Ação'],['OPCT3','OceanPact ON','Ação'],['MGLU3','Magazine Luiza ON','Ação'],['LREN3','Lojas Renner ON','Ação'],['RENT3','Localiza ON','Ação'],['SUZB3','Suzano ON','Ação'],['PRIO3','PetroRio ON','Ação'],['RADL3','Raia Drogasil ON','Ação'],['RAIL3','Rumo ON','Ação'],['CSAN3','Cosan ON','Ação'],['ELET3','Eletrobras ON','Ação'],['ELET6','Eletrobras PNB','Ação'],['CMIG4','Cemig PN','Ação'],['SANB11','Santander units','Ação'],['BBSE3','BB Seguridade ON','Ação'],['CXSE3','Caixa Seguridade ON','Ação'],['VIVT3','Telefônica Brasil ON','Ação'],['TIMS3','TIM ON','Ação'],['NTCO3','Natura ON','Ação'],['HAPV3','Hapvida ON','Ação'],['RDOR3','Rede DOr ON','Ação'],['FLRY3','Fleury ON','Ação'],['CCRO3','CCR ON','Ação'],['SBSP3','Sabesp ON','Ação'],['CPLE6','Copel PNB','Ação'],['EQTL3','Equatorial ON','Ação'],['UGPA3','Ultrapar ON','Ação'],['CSNA3','CSN ON','Ação'],['GGBR4','Gerdau PN','Ação'],['GOAU4','Metalúrgica Gerdau PN','Ação'],['USIM5','Usiminas PNA','Ação'],['CYRE3','Cyrela ON','Ação'],['MRVE3','MRV ON','Ação'],['EZTC3','EZTec ON','Ação'],['DIRR3','Direcional ON','Ação'],['TEND3','Tenda ON','Ação'],['ALPA4','Alpargatas PN','Ação'],
  ['IVVB11','iShares S&P 500','ETF'],['BOVA11','iShares Ibovespa','ETF'],['SMAL11','iShares Small Cap','ETF'],['DIVO11','It Now IDIV','ETF'],['LFTS11','Investo Tesouro Selic','ETF'],['NDIV11','Nu ETF Dividendos','ETF'],['XINA11','Trend China','ETF'],['HASH11','Hashdex Nasdaq Crypto','ETF'],['QBTC11','QR Bitcoin','ETF'],['GOLD11','Trend Ouro','ETF'],['FIXA11','Trend FIXA','ETF'],
  ['CDB','CDB bancário','Renda fixa'],['TESOURO SELIC','Tesouro Selic','Renda fixa'],['TESOURO IPCA','Tesouro IPCA+','Renda fixa'],['TESOURO PREFIXADO','Tesouro Prefixado','Renda fixa'],['LCI','Letra de Crédito Imobiliário','Renda fixa'],['LCA','Letra de Crédito do Agronegócio','Renda fixa'],['CRI','Certificado de Recebíveis Imobiliários','Renda fixa'],['CRA','Certificado de Recebíveis do Agronegócio','Renda fixa'],['DEBENTURE','Debênture','Renda fixa']
].map(([ticker, name, type]) => ({ ticker, name, type, custom: false }));

const NAME_TO_TICKER = {
  'MAXI REN':'MXRF11','REC RECE':'RECR11','REC REC':'RECR11','REC RECEBIVEIS':'RECR11',
  'RBRR PAX':'RBRP11','RBR PAX':'RBRP11','RBR PROPERTIES':'RBRP11','RBR ALPHA':'RBRF11','RBR LOG':'RBRS11',
  'TRX REAL':'TRXF11','HGLG':'HGLG11','VISC':'VISC11','XPML':'XPML11','XP MALLS':'XPML11',
  'KNRI':'KNRI11','KINEA REND':'KNRI11','GARE':'GARE11','GUARDIAN':'GARE11','LIFE':'LIFE11',
  'XPCA':'XPCA11','FGAA':'FGAA11','FG AGRO':'FGAA11','AAZQ':'AAZQ11','AZ QUEST':'AAZQ11',
  'IRIM':'IRIM11','IRIDIUM':'IRIM11','KNCR':'KNCR11','KNIP':'KNIP11','HGRU':'HGRU11',
  'XPLG':'XPLG11','XP LOG':'XPLG11','BRCO':'BRCO11','BRESCO':'BRCO11','BTLG':'BTLG11','BTG LOG':'BTLG11',
  'VILG':'VILG11','VINCI LOG':'VILG11','JSRE':'JSRE11','JS REAL':'JSRE11','CPTS':'CPTS11','CAPITANIA':'CPTS11',
  'DEVA':'DEVA11','DEVANT':'DEVA11','VGHF':'VGHF11','MALL':'MALL11','HSML':'HSML11','H SIERRA':'HSML11',
  'BBRC':'BBRC11','BB RENDA':'BBRC11','SNFF':'SNFF11','RECT':'RECT11','RVBI':'RVBI11','FEXC':'FEXC11',
  'GGRC':'GGRC11','HCTR':'HCTR11','HECTARE':'HCTR11','URPR':'URPR11','URCA':'URPR11','MGFF':'MGFF11',
  'XPCI':'XPCI11','AEFI':'AEFI11','BCRI':'BCRI11','BLMR':'BLMR11','CACG':'CACG11','CCME':'CCME11',
  'CEGR':'CEGR11','CRIH':'CRIH11','FAMB':'FAMB11','FVPQ':'FVPQ11','GRLV':'GRLV11','HCCI':'HCCI11',
  'HTMX':'HTMX11','KFOF':'KFOF11','KNHY':'KNHY11','KINEA H':'KNHY11','LGCP':'LGCP11','LOGCP':'LGCP11',
  'MCHF':'MCHF11','MFAI':'MFAI11','MORE':'MORE11','NVHO':'NVHO11','ONEF':'ONEF11','PATL':'PATL11',
  'PATRIA':'PATL11','PLCR':'PLCR11','PQDP':'PQDP11','RBCO':'RBCO11','RBRD':'RBRD11','RELG':'RELG11',
  'RZAK':'RZAK11','RZTR':'RZTR11','SARE':'SARE11','SCJR':'SCJR11','SDIL':'SDIL11','SNCI':'SNCI11',
  'SNID':'SNID11','TEPP':'TEPP11','TGAR':'TGAR11','TRNO':'TRNO11','VCJR':'VCJR11','VCRR':'VCRR11',
  'VINO':'VINO11','VRTA':'VRTA11','VSHO':'VSHO11','VTLT':'VTLT11','XPPR':'XPPR11','XP PROP':'XPPR11',
  'RBR DESENV':'RBRD11',
  'FII REC':'RECR11','FII MAXI':'MXRF11','FII TRX':'TRXF11','FII RBRR':'RBRP11','FII RBR':'RBRF11',
  'FII XPML':'XPML11','FII VISC':'VISC11','FII HGLG':'HGLG11','FII KNRI':'KNRI11','FII XPLG':'XPLG11',
  'FII VILG':'VILG11','FII BTLG':'BTLG11','FII BRCO':'BRCO11','FII HGRU':'HGRU11','FII KNCR':'KNCR11',
  'FII KNIP':'KNIP11','FII RECR':'RECR11','FII IRIM':'IRIM11','FII JSRE':'JSRE11','FII CPTS':'CPTS11',
  'FII DEVA':'DEVA11','FII GARE':'GARE11','FII LIFE':'LIFE11','FII FGAA':'FGAA11','FII AAZQ':'AAZQ11',
  'FII XPCA':'XPCA11',
  'PETROBRAS PN':'PETR4','PETROBRAS ON':'PETR3','PETROBRAS':'PETR4','PETROLEO BRAS':'PETR4',
  'VALE ON':'VALE3','VALE':'VALE3','ITAU UNIBANCO':'ITUB4','ITAUUNIBANCO':'ITUB4','ITAU SA':'ITSA4',
  'ITAUSA':'ITSA4','BRADESCO PN':'BBDC4','BRADESCO ON':'BBDC3','BRADESCO':'BBDC4','BANCO DO BRASIL':'BBAS3',
  'BB SEGURIDADE':'BBSE3','WEG ON':'WEGE3','WEG':'WEGE3','AMBEV':'ABEV3','MAGAZINE LUIZA':'MGLU3',
  'MAGALU':'MGLU3','LOJAS RENNER':'LREN3','RENNER':'LREN3','LOCALIZA':'RENT3','SUZANO':'SUZB3',
  'ELETROBRAS ON':'ELET3','ELETROBRAS PNB':'ELET6','ELETROBRAS':'ELET3','CEMIG PN':'CMIG4','CEMIG':'CMIG4',
  'SANTANDER':'SANB11','B3 ON':'B3SA3','B3 SA':'B3SA3','RUMO ON':'RAIL3','RUMO':'RAIL3','COSAN ON':'CSAN3',
  'COSAN':'CSAN3','EQUATORIAL':'EQTL3','TAESA':'TAEE11','ENGIE BRASIL':'EGIE3','ENGIE':'EGIE3',
  'REDE DOR':'RDOR3','REDE D OR':'RDOR3','HAPVIDA':'HAPV3','NATURA':'NTCO3','TIM ON':'TIMS3',
  'TIM S.A':'TIMS3','TIM SA':'TIMS3','TELEFONICA':'VIVT3','VIVO':'VIVT3','ULTRAPAR':'UGPA3',
  'CYRELA':'CYRE3','MRV ON':'MRVE3','MRV':'MRVE3','GERDAU MET':'GOAU4','GERDAU PN':'GGBR4','GERDAU':'GGBR4',
  'CSN ON':'CSNA3','CSN':'CSNA3','SABESP':'SBSP3','COPEL':'CPLE6','RAIA DROGASIL':'RADL3','RAIADROGASIL':'RADL3',
  'FLEURY':'FLRY3','BRF SA':'BRFS3','MARFRIG':'MRFG3','JBS':'JBSS3','MINERVA':'BEEF3','OCEANPACT':'OPCT3',
  'CAIXA SEGURIDADE':'CXSE3','CAIXA SEG':'CXSE3','LIGHT':'LIGT3','USIMINAS':'USIM5','KLABIN':'KLBN4',
  'TELEF BRASIL':'VIVT3',
  'ISHARES S&P':'IVVB11','S&P 500':'IVVB11','IVVB':'IVVB11','ISHARES IBOVESPA':'BOVA11','IBOVESPA':'BOVA11',
  'BOVA':'BOVA11','ISHARES SMALL':'SMAL11','SMALL CAP':'SMAL11','IT NOW IDIV':'DIVO11','INVESTO TESOURO':'LFTS11',
  'NU ETF':'NDIV11','HASHDEX':'HASH11','QR BITCOIN':'QBTC11','TREND OURO':'GOLD11','TREND CHINA':'XINA11','TREND FIXA':'FIXA11'
};

const COLOR_MAP = { 'Ação':'#ec4899', 'FII':'#22d3ee', 'ETF':'#a855f7', 'Renda fixa':'#10b981', 'Outro':'#64748b' };
const RF_TICKERS = ['CDB','LCI','LCA','CRI','CRA','DEBENTURE','TESOURO SELIC','TESOURO IPCA','TESOURO PREFIXADO'];
const isRFTicker = t => RF_TICKERS.includes(t);

let state = {
  catalog: [], trades: [], dividends: [], prices: {},
  apiKey: DEFAULT_API_KEY, lastUpdated: null, autoRefresh: 0, lastSource: '',
  cdiRate: 13.65, rfLastProjection: null, history: [], priceHistory: {}
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
    if (s.priceHistory && typeof s.priceHistory === 'object') state.priceHistory = s.priceHistory;
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
  if (t === SALDO_TICKER) return 'Saldo';
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
  if (ticker === SALDO_TICKER) return false;
  if (isRFComposite(ticker)) return true;
  if (isRFTicker(ticker)) return true;
  const c = catalog().find(x => x.ticker === ticker);
  return c?.type === 'Renda fixa';
}

(function migrateRF() {
  const map = {};
  for (const t of state.trades) {
    if (isRFComposite(t.ticker)) continue;
    if (t.ticker === SALDO_TICKER) continue;
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
  if (!input) return;
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

/* ---------- Saldo disponível ---------- */
function getSaldoDisponivel() {
  const total = state.trades
    .filter(t => t.ticker === SALDO_TICKER)
    .reduce((sum, t) => sum + (t.side === 'buy' ? t.price : -t.price), 0);
  return Math.max(0, total);
}
function updateSaldoDisplay() {
  const el = $('saldoDisponivel');
  if (el) el.textContent = brl(getSaldoDisponivel());
}
window.addSaldo = async function() {
  const v = await openMoneyModal('Adicionar saldo', '');
  if (v === null) return;
  const n = parseMoneyBR(v);
  if (!n || n <= 0) { alert('Informe um valor maior que zero.'); return; }
  state.trades.push({ ticker: SALDO_TICKER, side: 'buy', qty: 1, price: n, fees: 0, date: today() });
  save();
  alert(`✅ Saldo adicionado: ${brl(n)}`);
};
window.removeSaldo = async function() {
  const atual = getSaldoDisponivel();
  if (atual <= 0) { alert('Não há saldo para remover.'); return; }
  const v = await openMoneyModal('Remover saldo', numToBR(atual));
  if (v === null) return;
  const n = parseMoneyBR(v);
  if (!n || n <= 0) { alert('Informe um valor maior que zero.'); return; }
  if (n > atual + 0.01) { alert(`Você só tem ${brl(atual)} disponível.`); return; }
  state.trades.push({ ticker: SALDO_TICKER, side: 'sell', qty: 1, price: n, fees: 0, date: today() });
  save();
  alert(`✅ Saldo removido: ${brl(n)}`);
};

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
  if (!ticker || ticker === SALDO_TICKER) return;
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
    if (t.ticker === SALDO_TICKER) continue;
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

function renderEvolution() {
  const container = $('evolution');
  if (!container) return;
  const h = Array.isArray(state.history) ? state.history.slice() : [];
  if (h.length < 2) {
    container.innerHTML = `<div class="evo-card"><div class="evo-title">Evolução do patrimônio</div><div class="evo-empty">O gráfico aparece a partir do segundo dia de uso.<br>Volte amanhã para ver a evolução. 📈</div></div>`;
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
          <linearGradient id="${uid}-line" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="${c2}"/><stop offset="100%" stop-color="${c1}"/></linearGradient>
          <linearGradient id="${uid}-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${c1}" stop-opacity="0.35"/><stop offset="100%" stop-color="${c1}" stop-opacity="0"/></linearGradient>
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
  if (!container) return;
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
    if (t.ticker === SALDO_TICKER) continue;
    const c = catalogEntry(t.ticker);
    const type = c?.type || 'Outro';
    const rf = isRFAsset(t.ticker);
    let p = m[t.ticker] || (m[t.ticker] = { qty: 0, cost: 0 });
    if (t.side === 'buy') { p.cost += t.qty * t.price + (t.fees || 0); p.qty += t.qty; }
    else {
      const avg = p.qty ? p.cost / p.qty : 0;
      const sold = Math.min(t.qty, p.qty);
      const saleValue = t.qty * t.price;
      const costBasis = avg * sold;
      const fees = t.fees || 0;
      const profit = (t.qty * t.price - fees) - costBasis;
      events.push({ date: t.date, ticker: t.ticker, type, rf, saleValue, costBasis, fees, profit });
      p.cost -= costBasis; p.qty -= sold;
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
    const totalSold = acoesSales + fiisSales + etfSales + outrosSales;
    report.push({ ym, totalSold, acoesSales, acoesProfit, acoesIR, acoesIsento, fiisSales, fiisProfit, fiisIR, etfSales, etfProfit, etfIR, outrosSales, outrosProfit, outrosIR, totalIR });
  }
  return report.sort((a, b) => b.ym.localeCompare(a.ym));
}

let irFilterYear = 'all';

function renderIR() {
  const report = computeIRReport();
  const container = $('irContent');
  const filterBox = $('irFilter');
  if (!container || !filterBox) return;
  if (!report.length) {
    filterBox.innerHTML = '';
    container.innerHTML = `<div class="empty">Nenhuma venda registrada ainda.<br>Quando você vender ações, FIIs ou ETFs, o cálculo de IR aparece aqui.</div>`;
    return;
  }
  const years = [...new Set(report.map(r => r.ym.slice(0, 4)))].sort().reverse();
  filterBox.innerHTML = `<div class="ir-filter"><label for="irYearSelect">Período</label><select id="irYearSelect"><option value="all" ${irFilterYear === 'all' ? 'selected' : ''}>Todos os anos</option>${years.map(y => `<option value="${y}" ${irFilterYear === y ? 'selected' : ''}>${y}</option>`).join('')}</select></div>`;
  const sel = $('irYearSelect');
  if (sel) sel.addEventListener('change', e => { irFilterYear = e.target.value; renderIR(); });
  const filtered = irFilterYear === 'all' ? report : report.filter(r => r.ym.startsWith(irFilterYear));
  if (!filtered.length) { container.innerHTML = `<div class="empty">Nenhuma venda em ${irFilterYear}.</div>`; return; }
  const totalSold = filtered.reduce((s, r) => s + r.totalSold, 0);
  const totalIR = filtered.reduce((s, r) => s + r.totalIR, 0);
  const mn = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
  let html = `<div class="ir-summary-two">
    <div class="ir-summary-card"><div class="lbl">Total vendido</div><div class="val" style="color:var(--cyan)">${brl(totalSold)}</div></div>
    <div class="ir-summary-card"><div class="lbl">DARF estimado</div><div class="val" style="color:${totalIR > 0 ? 'var(--pink)' : 'var(--cyan)'}">${brl(totalIR)}</div></div>
  </div>`;
  if (filtered.length >= 2) {
    const maxIR = Math.max(...filtered.map(r => r.totalIR), 1);
    const ordered = filtered.slice().reverse();
    const bars = ordered.map(r => {
      const h = r.totalIR > 0 ? Math.max(6, (r.totalIR / maxIR) * 100) : 3;
      const [yy, mm] = r.ym.split('-');
      const lbl = irFilterYear === 'all' ? `${mn[Number(mm) - 1]}/${yy.slice(2)}` : mn[Number(mm) - 1];
      return `<div class="ir-bar-wrap ${r.totalIR > 0 ? '' : 'zero'}"><div class="ir-bar" style="height:${h}%"></div><div class="ir-bar-label">${lbl}</div></div>`;
    }).join('');
    html += `<div class="ir-chart">${bars}</div>`;
  }
  for (const r of filtered) {
    const [yy, mm] = r.ym.split('-');
    const label = `${mn[Number(mm) - 1]} ${yy}`;
    html += `<div class="ir-month"><div class="ir-month-head"><div class="ir-month-label">${label}</div><div class="ir-month-total">${brl(r.totalIR)}</div></div>`;
    if (r.acoesSales > 0) html += `<div class="ir-row"><span class="lbl">Ações · vendas ${brl(r.acoesSales)} ${r.acoesIsento ? '<span class="ir-badge isento">isento</span>' : '<span class="ir-badge due">tributado</span>'}</span><span class="val">${brl(r.acoesIR)}</span></div>`;
    if (r.fiisSales > 0) html += `<div class="ir-row"><span class="lbl">FIIs · vendas ${brl(r.fiisSales)} · lucro ${brl(r.fiisProfit)}</span><span class="val">${brl(r.fiisIR)}</span></div>`;
    if (r.etfSales > 0) html += `<div class="ir-row"><span class="lbl">ETFs · vendas ${brl(r.etfSales)} · lucro ${brl(r.etfProfit)}</span><span class="val">${brl(r.etfIR)}</span></div>`;
    if (r.outrosSales > 0) html += `<div class="ir-row"><span class="lbl">Outros · vendas ${brl(r.outrosSales)}</span><span class="val">${brl(r.outrosIR)}</span></div>`;
    html += `</div>`;
  }
  container.innerHTML = html;
}

/* ---------- Parser ---------- */
function parseRowSinacor(line) {
  if (!line || line.length < 8) return null;
  const tickerM = line.match(/\b([A-Z]{4}\d{1,2})\b/);
  if (!tickerM) return null;
  const ticker = tickerM[1];
  const idx = tickerM.index;
  const before = line.slice(0, idx).trim();
  const after = line.slice(idx + ticker.length).trim();
  let side = null;
  if (/\b(compra|aplica[çc][ãa]o)\b/i.test(line)) side = 'buy';
  else if (/\b(venda|resgate)\b/i.test(line)) side = 'sell';
  else {
    const beforeWords = before.split(/\s+/).filter(Boolean);
    const afterWords = after.split(/\s+/).filter(Boolean);
    const lastBefore = beforeWords[beforeWords.length - 1] || '';
    const firstAfter = afterWords[0] || '';
    if (/^[CV]$/.test(lastBefore)) side = lastBefore === 'C' ? 'buy' : 'sell';
    else if (/^[CV]$/.test(firstAfter)) side = firstAfter === 'C' ? 'buy' : 'sell';
    else {
      const cvMatches = line.match(/(?:^|\s)([CV])(?:\s|$)/g);
      if (cvMatches && cvMatches.length) { const c = cvMatches[0].trim(); side = c === 'C' ? 'buy' : 'sell'; }
    }
  }
  if (!side) return null;
  const tokens = after.split(/\s+/).filter(Boolean);
  const numTokens = tokens.filter(t => /^\d{1,3}(?:\.\d{3})*(?:,\d+)?$/.test(t) || /^\d+(?:[.,]\d+)?$/.test(t));
  const parsed = numTokens.map(raw => ({ raw, hasDec: /[.,]/.test(raw), value: parseFloat(raw.replace(/\./g, '').replace(',', '.')) })).filter(n => Number.isFinite(n.value) && n.value > 0);
  let qty = 0, price = 0;
  for (let i = 0; i < parsed.length - 1; i++) {
    const a = parsed[i], b = parsed[i + 1];
    if (!a.hasDec && b.hasDec) {
      let matched = true;
      if (i + 2 < parsed.length) {
        const total = parsed[i + 2].value;
        const expected = a.value * b.value;
        if (Math.abs(total - expected) > 1 && Math.abs(total - expected) / expected > 0.02) matched = false;
      }
      if (matched) { qty = a.value; price = b.value; break; }
      if (!qty) { qty = a.value; price = b.value; }
    }
  }
  if (!qty || !price) return null;
  if (qty > 10000000 || price > 1000000) return null;
  let date = today();
  const isoD = line.match(/(\d{4})-(\d{2})-(\d{2})/);
  const brD = line.match(/(\d{2})\/(\d{2})\/(\d{4})/);
  if (isoD) date = `${isoD[1]}-${isoD[2]}-${isoD[3]}`;
  else if (brD) date = `${brD[3]}-${brD[2]}-${brD[1]}`;
  return { ticker, side, qty, price, date, fees: 0 };
}

function parseCSVLine(line) {
  const parts = line.split(/[,;\t]+/).map(s => s.trim()).filter(Boolean);
  if (parts.length < 5) return null;
  const isoDate = parts.find(p => /^\d{4}-\d{2}-\d{2}$/.test(p));
  const brDate = parts.find(p => /^\d{2}\/\d{2}\/\d{4}$/.test(p));
  const tk = parts.find(p => /^[A-Z]{3,6}\d{1,3}$/i.test(p));
  const sideStr = parts.find(p => /^(compra|venda|c|v|buy|sell)$/i.test(p));
  if (!tk) return null;
  let date = today();
  if (isoDate) date = isoDate;
  else if (brDate) { const [d, m, y] = brDate.split('/'); date = `${y}-${m}-${d}`; }
  let side = '';
  if (sideStr) { const s = sideStr.toLowerCase(); side = (s === 'compra' || s === 'c' || s === 'buy') ? 'buy' : 'sell'; }
  const nums = parts.filter(p => /^\d+([.,]\d+)?$/.test(p)).map(p => parseFloat(p.replace(',', '.')));
  let qty = 0, price = 0, fees = 0;
  if (nums.length >= 2) { qty = nums[0]; price = nums[1]; if (nums.length >= 3) fees = nums[2]; }
  if (!side || !qty || !price) return null;
  return { ticker: tk.toUpperCase(), side, qty, price, date, fees };
}

function guessTickerFromName(nome) {
  const upper = (nome || '').toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const keys = Object.keys(NAME_TO_TICKER).sort((a, b) => b.length - a.length);
  for (const k of keys) {
    const knorm = k.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (upper.includes(knorm)) return NAME_TO_TICKER[k];
  }
  return null;
}

function parseItauNota(text) {
  if (!text) return [];
  const results = [];
  const lines = String(text).replace(/\r/g, '\n').split(/\n+/).map(l => l.trim()).filter(Boolean);
  let dataNota = today();
  const dataM = text.match(/Data Pregão\s*\n?\s*(\d{2})\/(\d{2})\/(\d{4})/i);
  if (dataM) dataNota = `${dataM[3]}-${dataM[2]}-${dataM[1]}`;
  else {
    const alt = text.match(/(\d{2})\/(\d{2})\/(\d{4})/);
    if (alt) dataNota = `${alt[3]}-${alt[2]}-${alt[1]}`;
  }
  for (const line of lines) {
    const m = line.match(/B3\s+RV\s+LISTADO\s+([CV])\s+(\S+)\s+(.+?)\s+[@$]?\s+(\d+)\s+([\d.]+,\d+)\s+([\d.]+,\d+)/i);
    if (m) {
      const side = m[1].toUpperCase() === 'C' ? 'buy' : 'sell';
      const especificacao = m[3].trim();
      const qty = parseInt(m[4], 10);
      const price = parseFloat(m[5].replace(/\./g, '').replace(',', '.'));
      if (!qty || !price) continue;
      let ticker = guessTickerFromName(especificacao);
      if (!ticker) {
        const tk = especificacao.match(/\b([A-Z]{4}\d{1,2})\b/);
        if (tk) ticker = tk[1];
      }
      if (!ticker) {
        ticker = especificacao.replace(/\s+(CI|ER|N2|N1|ON|PN|UNT|CI ER)\s*$/i, '').split(/\s+/).slice(0, 3).join(' ').toUpperCase();
      }
      results.push({ ticker, side, qty, price, date: dataNota, fees: 0 });
    }
  }
  return results;
}

function parseCompactNota(text) {
  if (!text) return [];
  const results = [];
  const lines = String(text).replace(/\r/g, '\n').split(/\n+/).map(l => l.trim()).filter(Boolean);
  for (const line of lines) {
    const m = line.match(/(?:^|\s)([A-Z]{3,6}\d{1,3})\s+([CV])\s+(\d+)\s+([\d.]+,\d+)/i);
    if (m) {
      const ticker = m[1].toUpperCase();
      const side = m[2].toUpperCase() === 'C' ? 'buy' : 'sell';
      const qty = parseInt(m[3], 10);
      const price = parseFloat(m[4].replace(/\./g, '').replace(',', '.'));
      if (qty && price) results.push({ ticker, side, qty, price, date: today(), fees: 0 });
    }
  }
  return results;
}

function parseNotaText(fullText) {
  if (!fullText) return [];
  const seen = new Set();
  const results = [];
  const push = r => {
    if (!r || !r.ticker) return;
    const k = r.ticker + '|' + r.side + '|' + r.qty + '|' + r.price + '|' + r.date;
    if (!seen.has(k)) { seen.add(k); results.push(r); }
  };
  parseItauNota(fullText).forEach(push);
  parseCompactNota(fullText).forEach(push);
  let txt = String(fullText).replace(/\r/g, '\n').replace(/[ \t]+/g, ' ');
  const lines = txt.split(/\n+/).map(l => l.trim()).filter(Boolean);
  for (const line of lines) {
    const csv = parseCSVLine(line); if (csv) { push(csv); continue; }
    const rec = parseRowSinacor(line); if (rec) push(rec);
  }
  return results;
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
    const items = content.items.map(it => ({ str: it.str, y: Math.round(it.transform[5]), x: it.transform[4] }));
    items.sort((a, b) => b.y - a.y || a.x - b.x);
    let lastY = null, line = '';
    const lines = [];
    for (const it of items) {
      if (lastY === null || Math.abs(it.y - lastY) < 3) line += (line ? ' ' : '') + it.str;
      else { lines.push(line); line = it.str; }
      lastY = it.y;
    }
    if (line) lines.push(line);
    fullText += lines.join('\n') + '\n';
  }
  return fullText;
}

let pendingImport = [];

function renderImportPreview() {
  const box = $('notaPreview');
  if (!box) return;
  if (!pendingImport.length) {
    box.classList.remove('hidden');
    box.innerHTML = `<div class="import-preview-card"><div class="import-preview-title">Nada reconhecido</div><div class="import-status err">Não identifiquei negócios nesse texto.</div></div>`;
    return;
  }
  const rows = pendingImport.map((r, i) => {
    const cat = catalogEntry(r.ticker);
    const type = cat?.type || 'Outro';
    const total = r.qty * r.price + (r.fees || 0);
    return `<div class="import-row"><div class="info"><b>${esc(r.ticker)}</b> <span class="pill" style="margin-left:4px">${esc(type)}</span><div class="meta">${r.side === 'buy' ? 'Compra' : 'Venda'} · ${qtyToBR(r.qty)} × ${brl(r.price)} · ${esc(r.date)}</div></div><div class="amount">${brl(total)}</div><button type="button" class="delete-btn" onclick="removePendingImport(${i})">×</button></div>`;
  }).join('');
  box.classList.remove('hidden');
  box.innerHTML = `<div class="import-preview-card"><div class="import-preview-title">${pendingImport.length} negócio(s) reconhecido(s)</div>${rows}<div class="import-actions"><button type="button" class="ghost" onclick="cancelImport()">Cancelar</button><button type="button" class="primary" onclick="confirmImport()">Importar tudo</button></div></div>`;
}

function analyzeNotaText(text) { pendingImport = parseNotaText(text); renderImportPreview(); }

window.removePendingImport = i => { pendingImport.splice(i, 1); renderImportPreview(); };
window.cancelImport = () => { pendingImport = []; $('notaPreview')?.classList.add('hidden'); if($('notaInput')) $('notaInput').value = ''; if($('notaPdf')) $('notaPdf').value = ''; const st = $('pdfStatus'); if(st){st.textContent='';st.className='import-status';} };
window.confirmImport = () => {
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
  $('notaPreview')?.classList.add('hidden');
  if($('notaInput')) $('notaInput').value = '';
  if($('notaPdf')) $('notaPdf').value = '';
  alert(`✅ ${added} operação(ões) importada(s).`);
  window.showTab('portfolio');
};

async function handlePDFUpload(file) {
  const st = $('pdfStatus');
  if (!st) return;
  st.textContent = 'Lendo PDF…'; st.className = 'import-status';
  try {
    const text = await extractPDFText(file);
    if (!text || text.length < 20) throw new Error('PDF vazio ou sem texto.');
    st.textContent = `✅ PDF lido (${text.length} caracteres). Analisando…`; st.className = 'import-status ok';
    const parsed = parseNotaText(text);
    if (!parsed.length) {
      st.textContent = '⚠️ PDF lido, mas nenhum negócio reconhecido.';
      st.className = 'import-status err';
      if($('notaInput')) $('notaInput').value = text.slice(0, 3000);
      return;
    }
    pendingImport = parsed;
    renderImportPreview();
    st.textContent = `✅ ${parsed.length} negócio(s) reconhecido(s).`;
    st.className = 'import-status ok';
  } catch (e) {
    st.textContent = '❌ ' + (e.message || 'Falha ao ler PDF.');
    st.className = 'import-status err';
  }
}

/* ============================================================
   TELA DE DETALHE DO ATIVO
   ============================================================ */
function openAssetDetail(ticker) {
  const p = positions().find(x => x.ticker === ticker);
  if (!p) return;
  const overlay = $('assetDetail');
  if (!overlay) return;
  overlay.classList.remove('hidden');
  overlay.dataset.ticker = ticker;
  document.body.style.overflow = 'hidden';

  $('adTicker').textContent = displayTicker(ticker);
  $('adName').textContent = p.name;
  $('adType').textContent = p.type;
  $('adValue').textContent = brl(p.market);

  const pos = p.unrealized >= 0;
  $('adValuePct').textContent = (pos ? '+' : '') + brl(p.unrealized) + '  ·  ' + pct(p.unrealizedPct);

  $('adAvgLabel').textContent = p.isRF ? 'Valor aplicado' : 'Preço médio';
  $('adAvg').textContent = p.isRF ? brl(p.cost) : brl(p.avg);
  $('adQty').textContent = p.isRF ? '—' : qtyToBR(p.qty);
  $('adResult').textContent = (pos ? '+' : '') + brl(p.unrealized);
  $('adResult').style.color = pos ? 'var(--success)' : 'var(--danger)';
  $('adDiv12m').textContent = p.div12m > 0 ? brl(p.div12m) : '—';
  $('adDiv12m').style.color = 'var(--cyan)';

  // operações
  const trades = state.trades.filter(t => t.ticker === ticker).sort((a, b) => (a.date || '').localeCompare(b.date || ''));
  if (trades.length) {
    $('adTrades').innerHTML = trades.map(t => {
      const isBuy = t.side === 'buy';
      const isRF = isRFAsset(t.ticker);
      const label = isRF ? (isBuy ? 'Aplicação' : 'Resgate') : (isBuy ? 'Compra' : 'Venda');
      const detail = isRF ? brl(Math.abs(t.qty * t.price)) : qtyToBR(t.qty) + ' × ' + brl(t.price);
      const total = Math.abs(t.qty * t.price) + (t.fees || 0);
      return `<div class="ad-trade-row">
        <div>
          <span class="ad-badge ${isBuy ? 'buy' : 'sell'}">${label}</span>
          <div class="meta">${esc(t.date)}</div>
        </div>
        <div class="value">
          ${brl(total)}
          <small>${detail}</small>
        </div>
      </div>`;
    }).join('');
  } else {
    $('adTrades').innerHTML = '<div class="empty" style="padding:14px">Nenhuma operação registrada.</div>';
  }

  // proventos
  const divs = state.dividends.filter(d => d.ticker === ticker).sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  if (divs.length) {
    $('adDividends').innerHTML = divs.map(d => `
      <div class="ad-trade-row">
        <div>
          <span class="ad-badge buy">${esc(d.kind || 'Dividendo')}</span>
          <div class="meta">${esc(d.date)}</div>
        </div>
        <div class="value">${brl(d.amount)}</div>
      </div>
    `).join('');
  } else {
    $('adDividends').innerHTML = '<div class="empty" style="padding:14px">Nenhum provento registrado.</div>';
  }

  loadAssetChart(ticker);
}

window.closeAssetDetail = function() {
  $('assetDetail')?.classList.add('hidden');
  document.body.style.overflow = '';
};

async function fetchPriceHistory(ticker) {
  if (!state.priceHistory) state.priceHistory = {};
  const cached = state.priceHistory[ticker];
  if (cached && cached.ts && (Date.now() - cached.ts) < 3600000) return cached.data;
  try {
    const url = 'https://brapi.dev/api/quote/' + encodeURIComponent(ticker)
      + '?range=3mo&interval=1d&token=' + encodeURIComponent(state.apiKey);
    const r = await fetch(url, { headers: { 'Accept': 'application/json' } });
    if (!r.ok) return null;
    const j = await r.json();
    const hist = j?.results?.[0]?.historicalDataPrice;
    if (!Array.isArray(hist) || !hist.length) return null;
    state.priceHistory[ticker] = { ts: Date.now(), data: hist };
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
    return hist;
  } catch (e) { return null; }
}

async function loadAssetChart(ticker) {
  const svg = $('adChart');
  const loading = $('adChartLoading');
  if (!svg || !loading) return;
  svg.innerHTML = '';
  loading.style.display = 'flex';
  loading.textContent = 'Carregando…';

  if (isRFAsset(ticker)) {
    loading.textContent = 'Renda fixa não tem gráfico de preço';
    return;
  }

  const hist = await fetchPriceHistory(ticker);
  loading.style.display = 'none';

  if (!hist || hist.length < 2) {
    svg.innerHTML = '<text x="50" y="20" text-anchor="middle" fill="#8a8a9c" font-size="3.5">Sem histórico disponível</text>';
    return;
  }

  const prices = hist.map(h => Number(h.close)).filter(p => Number.isFinite(p) && p > 0);
  if (prices.length < 2) {
    svg.innerHTML = '<text x="50" y="20" text-anchor="middle" fill="#8a8a9c" font-size="3.5">Sem dados suficientes</text>';
    return;
  }

  const w = 100, height = 40, padY = 2.5;
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = (max - min) || 1;
  const first = prices[0], last = prices[prices.length - 1];
  const positive = last >= first;

  let linePath = '', areaPath = '';
  prices.forEach((price, i) => {
    const x = (i / (prices.length - 1)) * w;
    const y = height - padY - ((price - min) / range) * (height - padY * 2);
    if (i === 0) { linePath += `M ${x} ${y}`; areaPath += `M ${x} ${height} L ${x} ${y}`; }
    else { linePath += ` L ${x} ${y}`; areaPath += ` L ${x} ${y}`; }
    if (i === prices.length - 1) areaPath += ` L ${x} ${height} Z`;
  });

  const c1 = positive ? '#22d3ee' : '#ff4d80';
  const c2 = positive ? '#ec4899' : '#a855f7';
  const uid = 'adc' + Date.now();

  svg.innerHTML = `
    <defs>
      <linearGradient id="${uid}-line" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="${c2}"/>
        <stop offset="100%" stop-color="${c1}"/>
      </linearGradient>
      <linearGradient id="${uid}-fill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${c1}" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="${c1}" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <path d="${areaPath}" fill="url(#${uid}-fill)"/>
    <path d="${linePath}" fill="none" stroke="url(#${uid}-line)" stroke-width="2" vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round"/>
  `;
}

window.adActionBuy = function() {
  const ticker = $('assetDetail')?.dataset.ticker;
  if (!ticker) return;
  closeAssetDetail();
  window.showTab('trade');
  const base = isRFComposite(ticker) ? rfBase(ticker) : ticker;
  const a = catalogEntry(ticker) || { ticker: base, name: base, type: isRFAsset(ticker) ? 'Renda fixa' : 'Outro' };
  setTimeout(() => {
    choose(a, false);
    if (isRFComposite(ticker) && $('tradeRFPct')) $('tradeRFPct').value = String(rfPct(ticker));
  }, 100);
};
window.adActionSell = function() {
  const ticker = $('assetDetail')?.dataset.ticker;
  if (!ticker) return;
  closeAssetDetail();
  const isRF = isRFAsset(ticker);
  setTimeout(() => { isRF ? window.openRedeem(ticker) : window.openSell(ticker); }, 100);
};
window.adActionProvento = function() {
  const ticker = $('assetDetail')?.dataset.ticker;
  if (!ticker) return;
  closeAssetDetail();
  setTimeout(() => window.showProvento(ticker), 100);
};
window.adActionRemove = function() {
  const ticker = $('assetDetail')?.dataset.ticker;
  if (!ticker) return;
  closeAssetDetail();
  setTimeout(() => window.removePosition(ticker), 100);
};

/* ---------- Render principal ---------- */
function render() {
  const ps = positions();
  const total = ps.reduce((s, p) => s + p.market, 0);
  const totalCost = ps.reduce((s, p) => s + p.cost, 0);
  const profit = ps.reduce((s, p) => s + p.unrealized, 0);
  const totalPct = totalCost > 0 ? (profit / totalCost) * 100 : 0;
  if($('total')) $('total').textContent = brl(total);
  const badge = $('totalPct');
  if(badge){ badge.textContent = pct(totalPct); badge.className = 'hero-badge ' + (totalPct >= 0 ? 'pos' : 'neg'); }
  if($('count')) $('count').textContent = ps.length;
  if($('updatedAt')) $('updatedAt').textContent = state.lastUpdated ? ('Cotações ' + timeAgo(state.lastUpdated) + (state.lastSource ? ' · ' + state.lastSource : '')) : '';
  const pel = $('profit');
  if(pel){ pel.textContent = (profit > 0 ? '+' : '') + brl(profit); pel.style.color = profit < 0 ? '#ffd0dd' : '#d5f7ff'; }
  const dt = computeDividendTotals();
  if($('divMonth')) $('divMonth').textContent = brl(dt.month);
  if($('divYear')) $('divYear').textContent = brl(dt.year);
  renderEvolution();
  renderAllocation(ps);

  const assetsEl = $('assets');
  if(assetsEl) assetsEl.innerHTML = ps.length ? ps.map(p => {
    const pos = p.unrealized >= 0;
    const yocText = p.div12m > 0 ? pct(p.yoc) : '—';
    const displayName = displayTicker(p.ticker);
    const cdiTag = p.isRF && rfPct(p.ticker) !== 100 ? `<span class="pill pill-cdi">${rfPct(p.ticker)}% CDI</span>` : '';
    const safeTicker = esc(p.ticker).replace(/'/g, "\\'");
    if (p.isRF) {
      const cdiInfo = `CDI ${rfPct(p.ticker)}% · Taxa ${state.cdiRate.toFixed(2)}% a.a.`;
      return `<div class="asset clickable" onclick="openAssetDetail('${safeTicker}')">
        <div class="assetTop"><div><div class="ticker">${esc(displayName)} <span class="pill">${esc(p.type)}</span> ${cdiTag}</div><div class="small">${esc(p.name)}</div></div><div class="right"><strong>${brl(p.market)}</strong><div class="small">Saldo atual</div></div></div>
        <div class="sub-grid"><div><div class="sub-label">Valor aplicado</div><div class="sub-value">${brl(p.cost)}</div></div><div><div class="sub-label">Rentabilidade</div><div class="sub-value" style="color:${pos ? 'var(--success)' : 'var(--danger)'}">${pct(p.unrealizedPct)}</div></div><div><div class="sub-label">Resultado</div><div class="sub-value" style="color:${pos ? 'var(--success)' : 'var(--danger)'}">${pos ? '+' : ''}${brl(p.unrealized)}</div></div><div><div class="sub-label">Proventos 12m</div><div class="sub-value" style="color:var(--cyan)">${p.div12m > 0 ? brl(p.div12m) : '—'}</div></div></div>
        <div class="yoc-line"><span>${cdiInfo}</span><b>${yocText}</b></div>
        <div class="actions" onclick="event.stopPropagation()">
          <button type="button" class="ghost-sm" onclick="event.stopPropagation();updatePrice('${safeTicker}')">Atualizar saldo</button>
          <button type="button" class="ghost-sm" onclick="event.stopPropagation();openRedeem('${safeTicker}')">Resgatar</button>
          <button type="button" class="ghost-sm" onclick="event.stopPropagation();showProvento('${safeTicker}')">Provento</button>
          <button type="button" class="ghost-sm danger-ghost" onclick="event.stopPropagation();removePosition('${safeTicker}')">Remover</button>
        </div>
      </div>`;
    }
    return `<div class="asset clickable" onclick="openAssetDetail('${safeTicker}')">
      <div class="assetTop"><div><div class="ticker">${esc(displayName)} <span class="pill">${esc(p.type)}</span></div><div class="small">${esc(p.name)} · ${qtyToBR(p.qty)} un.</div></div><div class="right"><strong>${brl(p.market)}</strong><div class="small">Atual ${brl(p.current)}</div></div></div>
      <div class="sub-grid"><div><div class="sub-label">Preço médio</div><div class="sub-value">${brl(p.avg)}</div></div><div><div class="sub-label">Rentabilidade</div><div class="sub-value" style="color:${pos ? 'var(--success)' : 'var(--danger)'}">${pct(p.unrealizedPct)}</div></div><div><div class="sub-label">Resultado</div><div class="sub-value" style="color:${pos ? 'var(--success)' : 'var(--danger)'}">${pos ? '+' : ''}${brl(p.unrealized)}</div></div><div><div class="sub-label">Proventos 12m</div><div class="sub-value" style="color:var(--cyan)">${p.div12m > 0 ? brl(p.div12m) : '—'}</div></div></div>
      <div class="yoc-line"><span>YOC 12m (sobre preço médio)</span><b>${yocText}</b></div>
      <div class="actions" onclick="event.stopPropagation()">
        <button type="button" class="ghost-sm" onclick="event.stopPropagation();updatePrice('${safeTicker}')">Editar preço</button>
        <button type="button" class="ghost-sm" onclick="event.stopPropagation();openSell('${safeTicker}')">Vender</button>
        <button type="button" class="ghost-sm" onclick="event.stopPropagation();showProvento('${safeTicker}')">Provento</button>
        <button type="button" class="ghost-sm danger-ghost" onclick="event.stopPropagation();removePosition('${safeTicker}')">Remover</button>
      </div>
    </div>`;
  }).join('') : '<div class="empty">Nenhuma posição ainda.<br>Toque em <b>Operar</b> para registrar a primeira compra.</div>';

  renderTradeHistory();
  renderDivHistory();
  renderIR();
  updateSaldoDisplay();
  if($('autoRefreshSelect')) $('autoRefreshSelect').value = String(state.autoRefresh || 0);
  if($('cdiRateInput')) $('cdiRateInput').value = numToBR(state.cdiRate);
}

function renderTradeHistory() {
  const el = $('tradeHistory'); if (!el) return;
  const history = state.trades.filter(t => t.ticker !== SALDO_TICKER).slice().reverse().slice(0, 20);
  el.innerHTML = history.length ? history.map(t => {
    const isRF = isRFAsset(t.ticker);
    const label = isRF ? (t.side === 'buy' ? 'Aplicação' : 'Resgate') : (t.side === 'buy' ? 'Compra' : 'Venda');
    const detail = isRF ? `${esc(t.date)} · ${brl(Math.abs(t.qty * t.price))}` : `${esc(t.date)} · ${qtyToBR(t.qty)} un. a ${brl(t.price)}`;
    return `<div class="asset"><div class="assetTop"><div><strong>${label} · ${esc(displayTicker(t.ticker))}</strong><div class="small">${detail}</div></div><strong>${brl(Math.abs(t.qty * t.price) + (t.fees || 0))}</strong></div></div>`;
  }).join('') : '<div class="empty">Nenhuma operação registrada.</div>';
}

function renderDivHistory() {
  const el = $('divHistory'); if (!el) return;
  const list = [...state.dividends].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  if (!list.length) { el.innerHTML = '<div class="empty">Nenhum provento registrado ainda.</div>'; return; }
  const groups = {};
  for (const d of list) { const k = (d.date || '').slice(0, 7); if (!groups[k]) groups[k] = []; groups[k].push(d); }
  const mn = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
  el.innerHTML = Object.keys(groups).sort().reverse().map(k => {
    const [y, m] = k.split('-'); const label = `${mn[Number(m) - 1]} ${y}`; const items = groups[k];
    const total = items.reduce((s, d) => s + Number(d.amount || 0), 0);
    return `<div class="month-group"><div class="month-label"><span>${label}</span><span class="month-total">${brl(total)}</span></div>${items.map(d => `<div class="div-card"><div class="div-row"><div><strong>${esc(displayTicker(d.ticker))}</strong><span class="div-type" style="margin-left:6px">${esc(d.kind || 'Dividendo')}</span><div class="div-meta">${esc(d.date)}</div></div><div style="text-align:right"><div class="div-amount">${brl(d.amount)}</div><button type="button" class="delete-btn" onclick="deleteDividend(${d.id})">excluir</button></div></div></div>`).join('')}</div>`;
  }).join('');
}

function toggleRFFields(isRF) {
  const rf = $('tradeRegularFields'), rff = $('tradeRFFields');
  if (rf) rf.classList.toggle('hidden', isRF);
  if (rff) rff.classList.toggle('hidden', !isRF);
}

function choose(a, autoAdd) {
  if (autoAdd) ensureTickerInCatalog(a.ticker);
  if($('chosenTicker')) $('chosenTicker').value = a.ticker;
  if($('chosenType')) $('chosenType').value = a.type || 'Outro';
  if($('assetSearch')) $('assetSearch').value = a.ticker + ' — ' + a.name;
  if($('selectedTicker')) $('selectedTicker').textContent = a.ticker;
  if($('selectedName')) $('selectedName').textContent = a.name;
  if($('selectedType')) $('selectedType').textContent = 'Categoria: ' + a.type;
  $('selectedBox')?.classList.remove('hidden');
  $('suggestions')?.classList.add('hidden');
  toggleRFFields(a.type === 'Renda fixa' || isRFTicker(a.ticker));
  if (!a.type || a.type !== 'Renda fixa') { if($('tradeRFPct')) $('tradeRFPct').value = '100'; }
}
function chooseDiv(a, autoAdd) {
  if (autoAdd) ensureTickerInCatalog(a.ticker);
  if($('divChosenTicker')) $('divChosenTicker').value = a.ticker;
  if($('divTickerSearch')) $('divTickerSearch').value = a.ticker + ' — ' + a.name;
  if($('divSelectedTicker')) $('divSelectedTicker').textContent = a.ticker;
  if($('divSelectedName')) $('divSelectedName').textContent = a.name;
  $('divSelectedBox')?.classList.remove('hidden');
  $('divSuggestions')?.classList.add('hidden');
}

window.showTab = function(id) {
  document.querySelectorAll('.tabs button').forEach(x => x.classList.toggle('active', x.dataset.tab === id));
  ['portfolio','trade','dividends','ir','backup'].forEach(t => { const el = $(t); if (el) el.classList.toggle('hidden', t !== id); });
  const hideHero = (id === 'ir' || id === 'backup' || id === 'trade');
  const hs = $('heroSection');
  if (hs) hs.classList.toggle('hidden', hideHero);
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
  $('divFormBox')?.classList.remove('hidden');
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
  if (state.priceHistory) delete state.priceHistory[ticker];
  save();
  alert('Investimento removido.');
};

window.openSell = function(ticker) {
  const p = positions().find(x => x.ticker === ticker);
  if (!p) { alert('Posição não encontrada.'); return; }
  const modal = $('sellModal');
  if (!modal) return;
  modal.dataset.ticker = ticker;
  if($('sellTickerName')) $('sellTickerName').textContent = displayTicker(ticker);
  if($('sellInfo')) $('sellInfo').innerHTML = `Posição atual: <b>${qtyToBR(p.qty)}</b> un. · Preço médio ${brl(p.avg)}<br>Preço atual de mercado: <b>${brl(p.current)}</b>`;
  if($('sellQty')) $('sellQty').value = qtyToBR(p.qty);
  if($('sellPrice')) $('sellPrice').value = numToBR(p.current);
  if($('sellDate')) $('sellDate').value = today();
  if($('sellFees')) $('sellFees').value = '0,00';
  modal.classList.remove('hidden');
};
$('sellCancel')?.addEventListener('click', () => $('sellModal')?.classList.add('hidden'));
$('sellModal')?.addEventListener('click', e => { if (e.target === $('sellModal')) $('sellModal').classList.add('hidden'); });
$('sellConfirm')?.addEventListener('click', () => {
  const modal = $('sellModal');
  const ticker = modal?.dataset.ticker;
  const qty = parseNum($('sellQty')?.value);
  const price = parseMoneyBR($('sellPrice')?.value);
  const fees = parseMoneyBR($('sellFees')?.value);
  const date = $('sellDate')?.value || today();
  if (!ticker) { alert('Ticker não identificado.'); return; }
  if (!qty || qty <= 0) { alert('Informe uma quantidade válida.'); return; }
  if (!price || price <= 0) { alert('Informe um preço válido.'); return; }
  const p = positions().find(x => x.ticker === ticker);
  if (!p) { alert('Posição não encontrada.'); return; }
  if (qty > p.qty + 1e-6) { alert(`Você tem apenas ${qtyToBR(p.qty)} unidades.`); return; }
  state.trades.push({ ticker, side: 'sell', qty, price, fees, date });
  save();
  $('sellModal')?.classList.add('hidden');
  alert(`✅ Venda de ${qtyToBR(qty)} ${displayTicker(ticker)} a ${brl(price)} registrada.`);
});

window.openRedeem = function(ticker) {
  const p = positions().find(x => x.ticker === ticker);
  if (!p) { alert('Posição não encontrada.'); return; }
  const modal = $('redeemModal');
  if (!modal) return;
  modal.dataset.ticker = ticker;
  if($('redeemTickerName')) $('redeemTickerName').textContent = displayTicker(ticker);
  if($('redeemInfo')) $('redeemInfo').innerHTML = `Valor aplicado: <b>${brl(p.cost)}</b><br>Saldo atual projetado: <b>${brl(p.market)}</b>`;
  if($('redeemValue')) $('redeemValue').value = numToBR(p.market);
  if($('redeemDate')) $('redeemDate').value = today();
  modal.classList.remove('hidden');
};
$('redeemCancel')?.addEventListener('click', () => $('redeemModal')?.classList.add('hidden'));
$('redeemModal')?.addEventListener('click', e => { if (e.target === $('redeemModal')) $('redeemModal').classList.add('hidden'); });
$('redeemConfirm')?.addEventListener('click', () => {
  const modal = $('redeemModal');
  const ticker = modal?.dataset.ticker;
  const value = parseMoneyBR($('redeemValue')?.value);
  const date = $('redeemDate')?.value || today();
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
  $('redeemModal')?.classList.add('hidden');
  alert(`✅ Resgate de ${brl(value)} registrado.`);
});

function openMoneyModal(title, defaultValue) {
  return new Promise(resolve => {
    const overlay = $('modalOverlay'), input = $('modalInput');
    if (!overlay || !input) { resolve(null); return; }
    $('modalTitle').textContent = title;
    input.value = defaultValue ? digitsToMoney(String(defaultValue).replace(/\D/g, '')) : '';
    overlay.classList.remove('hidden');
    setTimeout(() => { input.focus(); const l = input.value.length; input.setSelectionRange(l, l); }, 60);
    function cleanup() {
      overlay.classList.add('hidden');
      $('modalConfirm')?.removeEventListener('click', onConfirm);
      $('modalCancel')?.removeEventListener('click', onCancel);
      overlay.removeEventListener('click', onOverlay);
      input.removeEventListener('keydown', onKey);
    }
    function onConfirm() { const v = input.value; cleanup(); resolve(v); }
    function onCancel() { cleanup(); resolve(null); }
    function onOverlay(e) { if (e.target === overlay) onCancel(); }
    function onKey(e) { if (e.key === 'Enter') { e.preventDefault(); onConfirm(); } if (e.key === 'Escape') onCancel(); }
    $('modalConfirm')?.addEventListener('click', onConfirm);
    $('modalCancel')?.addEventListener('click', onCancel);
    overlay.addEventListener('click', onOverlay);
    input.addEventListener('keydown', onKey);
  });
}

['tradePrice','tradeRFValue','fees','divAmount','modalInput','cdiRateInput','sellPrice','sellFees','redeemValue'].forEach(id => { const el = $(id); if (el) attachMoneyMask(el); });

$('addSaldoBtn')?.addEventListener('click', () => window.addSaldo());
$('removeSaldoBtn')?.addEventListener('click', () => window.removeSaldo());
$('refreshBtn')?.addEventListener('click', refreshQuotes);
$('notaAnalyzeBtn')?.addEventListener('click', () => { analyzeNotaText($('notaInput')?.value || ''); });
$('notaExampleBtn')?.addEventListener('click', () => {
  if($('notaInput')) $('notaInput').value = `B3 RV LISTADO   V   VISTA   FII MAXI REN CI   @   1   9,07   9,07   C
B3 RV LISTADO   V   VISTA   FII RBRR PAX CI ER   @   2   68,42   136,84   C
B3 RV LISTADO   V   VISTA   FII TRX REAL CI   @   1   72,93   72,93   C`;
});
$('notaPdf')?.addEventListener('change', async e => { const f = e.target.files[0]; if (f) await handlePDFUpload(f); });

$('assetSearch')?.addEventListener('input', e => {
  const raw = e.target.value.trim(); const q = raw.toLowerCase(); const upper = raw.toUpperCase().replace(/[^A-Z0-9]/g, '');
  const exact = catalog().find(a => a.ticker === upper);
  if (exact && /^[a-zA-Z0-9]{2,}$/.test(raw)) toggleRFFields(exact.type === 'Renda fixa' || isRFTicker(exact.ticker));
  else if (!exact) toggleRFFields(false);
  const matches = catalog().filter(a => (a.ticker + ' ' + a.name).toLowerCase().includes(q)).slice(0, 10);
  const box = $('suggestions'); if(!box) return;
  let html = '';
  const exactInMatches = matches.some(a => a.ticker === upper);
  if (upper && !exactInMatches && upper.length >= 3) { html += `<button type="button" class="suggestion new" data-new="1"><span><strong>+ Usar "${esc(upper)}"</strong><br><small style="color:var(--muted)">Ticker novo — salvo automaticamente</small></span><span class="pill pill-new">Novo</span></button>`; }
  html += matches.map((a, i) => `<button type="button" class="suggestion" data-index="${i}"><span><strong>${esc(a.ticker)}</strong><br><small style="color:var(--muted)">${esc(a.name)}</small></span><span class="pill">${esc(a.type)}</span></button>`).join('');
  box.innerHTML = html; box.classList.toggle('hidden', !q && !upper);
  const nb = box.querySelector('button[data-new]'); if (nb) nb.addEventListener('click', () => choose({ ticker: upper, name: upper, type: isRFTicker(upper) ? 'Renda fixa' : 'Outro' }, true));
  box.querySelectorAll('button[data-index]').forEach(b => b.addEventListener('click', () => choose(matches[Number(b.dataset.index)], false)));
  if($('chosenTicker')) $('chosenTicker').value = '';
  if($('chosenType')) $('chosenType').value = '';
  $('selectedBox')?.classList.add('hidden');
});

if($('tradeDate')) $('tradeDate').value = today();

$('tradeForm')?.addEventListener('submit', e => {
  e.preventDefault();
  let ticker = ($('chosenTicker')?.value || '').trim();
  if (!ticker) {
    const raw = $('assetSearch')?.value.trim() || '';
    const beforeDash = raw.split('—')[0].trim();
    const candidate = beforeDash.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (candidate.length >= 3 && candidate.length <= 10) ticker = candidate;
  }
  if (!ticker) { alert('Escolha um ativo da lista.'); return; }
  const entry = catalogEntry(ticker);
  const isRF = (entry?.type === 'Renda fixa') || isRFTicker(ticker) || isRFComposite(ticker);
  const fees = parseMoneyBR($('fees')?.value);
  let qty, price, pctCDI = 100, finalTicker = ticker;
  if (isRF) {
    const value = parseMoneyBR($('tradeRFValue')?.value);
    if (value <= 0) { alert('Informe um valor válido em "Valor aplicado".'); return; }
    pctCDI = parseNum($('tradeRFPct')?.value) || 100;
    finalTicker = buildRFTicker(rfBase(ticker), pctCDI);
    qty = 1; price = value;
  } else {
    qty = parseNum($('tradeQty')?.value); price = parseMoneyBR($('tradePrice')?.value);
    if (qty <= 0 || price <= 0) { alert('Informe quantidade e preço válidos.'); return; }
  }
  ensureTickerInCatalog(finalTicker);
  const trade = { ticker: finalTicker, side: 'buy', qty, price, fees, date: ($('tradeDate')?.value) || today() };
  if (isRF) trade.pctCDI = pctCDI;
  state.trades.push(trade);
  if (isRF) { state.rfLastProjection = null; runRFProjection(true); }
  else { if (state.prices[finalTicker] === undefined) state.prices[finalTicker] = price; }
  save();
  e.target.reset();
  if($('tradeDate')) $('tradeDate').value = today();
  if($('assetSearch')) $('assetSearch').value = '';
  if($('chosenTicker')) $('chosenTicker').value = '';
  if($('chosenType')) $('chosenType').value = '';
  if($('tradeRFPct')) $('tradeRFPct').value = '100';
  $('selectedBox')?.classList.add('hidden');
  toggleRFFields(false);
  window.showTab('portfolio');
});

$('toggleDivForm')?.addEventListener('click', () => { const box = $('divFormBox'); if(!box) return; box.classList.toggle('hidden'); if (!box.classList.contains('hidden') && $('divDate')) $('divDate').value = today(); });
if($('divDate')) $('divDate').value = today();

$('divTickerSearch')?.addEventListener('input', e => {
  const raw = e.target.value.trim(); const q = raw.toLowerCase();
  const matches = catalog().filter(a => (a.ticker + ' ' + a.name).toLowerCase().includes(q)).slice(0, 10);
  const box = $('divSuggestions'); if(!box) return;
  let html = '';
  const upper = raw.toUpperCase().replace(/[^A-Z0-9]/g, ''); const exact = matches.some(a => a.ticker === upper);
  if (upper && !exact && upper.length >= 3) { html += `<button type="button" class="suggestion new" data-new="1"><span><strong>+ Usar "${esc(upper)}"</strong><br><small style="color:var(--muted)">Ticker novo</small></span><span class="pill pill-new">Novo</span></button>`; }
  html += matches.map((a, i) => `<button type="button" class="suggestion" data-index="${i}"><span><strong>${esc(a.ticker)}</strong><br><small style="color:var(--muted)">${esc(a.name)}</small></span><span class="pill pill-div">${esc(a.type)}</span></button>`).join('');
  box.innerHTML = html; box.classList.toggle('hidden', !q && !upper);
  const nb = box.querySelector('button[data-new]'); if (nb) nb.addEventListener('click', () => chooseDiv({ ticker: upper, name: upper, type: isRFTicker(upper) ? 'Renda fixa' : 'Outro' }, true));
  box.querySelectorAll('button[data-index]').forEach(b => b.addEventListener('click', () => chooseDiv(matches[Number(b.dataset.index)], false)));
  if($('divChosenTicker')) $('divChosenTicker').value = '';
  $('divSelectedBox')?.classList.add('hidden');
});

$('divForm')?.addEventListener('submit', e => {
  e.preventDefault();
  let ticker = $('divChosenTicker')?.value;
  if (!ticker) { const raw = ($('divTickerSearch')?.value || '').trim().split('—')[0].trim().toUpperCase().replace(/[^A-Z0-9]/g, ''); if (raw && raw.length >= 3) ticker = raw; }
  const amount = parseMoneyBR($('divAmount')?.value), date = ($('divDate')?.value) || today(), kind = $('divKind')?.value || 'Dividendo';
  if (!ticker || amount <= 0) { alert('Escolha um ativo e informe um valor válido.'); return; }
  ensureTickerInCatalog(ticker);
  state.dividends.push({ id: Date.now() + Math.floor(Math.random() * 1000), ticker, amount, date, kind });
  save();
  e.target.reset();
  if($('divChosenTicker')) $('divChosenTicker').value = '';
  if($('divTickerSearch')) $('divTickerSearch').value = '';
  $('divSelectedBox')?.classList.add('hidden');
  if($('divDate')) $('divDate').value = today();
  $('divFormBox')?.classList.add('hidden');
});

$('autoRefreshSelect')?.addEventListener('change', e => { state.autoRefresh = Number(e.target.value); save(); setupAutoRefresh(); });
$('cdiRateInput')?.addEventListener('change', () => {
  const v = parseMoneyBR($('cdiRateInput')?.value);
  if (v > 0) { state.cdiRate = v; state.rfLastProjection = null; runRFProjection(true); save(); }
});

let autoRefreshTimer = null;
function setupAutoRefresh() {
  if (autoRefreshTimer) { clearInterval(autoRefreshTimer); autoRefreshTimer = null; }
  const min = Number(state.autoRefresh || 0);
  if (min > 0) { autoRefreshTimer = setInterval(() => { if (document.visibilityState === 'visible') refreshQuotes().catch(() => {}); }, min * 60 * 1000); }
}

$('exportBtn')?.addEventListener('click', () => {
  const exportState = { ...state, apiKey: undefined, priceHistory: undefined };
  const blob = new Blob([JSON.stringify(exportState, null, 2)], { type: 'application/json' });
  const u = URL.createObjectURL(blob), a = document.createElement('a');
  a.href = u; a.download = 'enyao-backup.json'; a.click(); URL.revokeObjectURL(u);
});

$('importFile')?.addEventListener('change', async e => {
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

$('diagBtn')?.addEventListener('click', () => {
  try {
    const raw = localStorage.getItem(KEY) || '(vazio)';
    const parsed = raw !== '(vazio)' ? JSON.parse(raw) : null;
    const summary = parsed ? `Operações: ${(parsed.trades || []).length}\nProventos: ${(parsed.dividends || []).length}\nCatálogo: ${(parsed.catalog || []).length}\nPreços: ${Object.keys(parsed.prices || {}).length}\nHistórico: ${(parsed.history || []).length} dias\nCDI: ${parsed.cdiRate || '—'}%\nSaldo: ${brl(getSaldoDisponivel())}` : '(sem dados)';
    alert('📦 Dados no aparelho:\n\n' + summary + '\n\nTamanho: ' + raw.length + ' caracteres');
  } catch (e) { alert('Erro: ' + e.message); }
});

$('clearBtn')?.addEventListener('click', () => {
  if (confirm('Apagar todos os dados deste aparelho?')) {
    state = { catalog: [], trades: [], dividends: [], prices: {}, apiKey: DEFAULT_API_KEY, lastUpdated: null, autoRefresh: 0, lastSource: '', cdiRate: 13.65, rfLastProjection: null, history: [], priceHistory: {} };
    save();
  }
});

async function refreshQuotes() {
  const btn = $('refreshBtn');
  const ps = positions();
  if (!ps.length) { alert('Sem posições para atualizar.'); return; }
  const tickers = ps.filter(p => !p.isRF).map(p => p.ticker);
  if (!tickers.length) { alert('Só há renda fixa.'); return; }
  if (btn) { btn.disabled = true; btn.innerHTML = '<span class="spinner"></span>Buscando…'; }
  let updated = 0, failed = [], sourceUsed = '';
  for (const tk of tickers) {
    const r = await fetchPrice(tk);
    if (r && r.price > 0) { state.prices[tk] = r.price; updated++; sourceUsed = r.source; }
    else failed.push(tk);
  }
  if (updated) { state.lastUpdated = new Date().toISOString(); state.lastSource = sourceUsed; }
  save();
  if (btn) { btn.disabled = false; btn.innerHTML = '🔄 Atualizar cotações agora'; }
  if (updated && !failed.length) alert(`✅ ${updated} atualizada(s) · ${sourceUsed}`);
  else if (updated) alert(`✅ ${updated} atualizada(s) · ${sourceUsed}\n⚠️ Não encontrei: ${failed.join(', ')}`);
  else alert(`❌ Nenhuma cotação. Verifique: ${failed.join(', ')}`);
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
try {
  runRFProjection(false);
  recordSnapshot();
  render();
  setupAutoRefresh();
} catch (e) {
  console.error('Erro no start:', e);
}

if ('serviceWorker' in navigator) { window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {})); }