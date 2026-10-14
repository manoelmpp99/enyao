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
const BASE_KEY = 'enyao-v02';
const AUTH_KEY = 'enyao-auth-v01';
const USERS_KEY = 'enyao-users-v01';
const SALDO_TICKER = '__SALDO__';

let authUser = null;

function getKey() {
  if (authUser && authUser.userId) return `${BASE_KEY}-u-${authUser.userId}`;
  return BASE_KEY;
}

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

const COLOR_MAP = { 'Ação':'#ec4899', 'FII':'#22d3ee', 'ETF':'#a855f7', 'BDR':'#f59e0b', 'Renda fixa':'#10b981', 'Outro':'#64748b' };
const AVATAR_COLORS = ['#ec4899','#22d3ee','#a855f7','#f59e0b','#10b981','#f43f5e','#8b5cf6','#06b6d4'];
const RF_TICKERS = ['CDB','LCI','LCA','CRI','CRA','DEBENTURE','TESOURO SELIC','TESOURO IPCA','TESOURO PREFIXADO'];
const isRFTicker = t => RF_TICKERS.includes(t);

const DEFAULT_STATE = () => ({
  catalog: [], trades: [], dividends: [], prices: {},
  apiKey: DEFAULT_API_KEY, lastUpdated: null, autoRefresh: 0, lastSource: '',
  cdiRate: 13.65, rfLastProjection: null, history: [], priceHistory: {},
  goals: [], b3Catalog: [], b3CatalogSyncedAt: null,
  social: { posts: [], following: [], classes: [], publicProfile: true, bio: '', nickname: '' }
});

let state = DEFAULT_STATE();

function loadStateForCurrentUser() {
  state = DEFAULT_STATE();
  try {
    const raw = localStorage.getItem(getKey());
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
      if (Array.isArray(s.goals)) state.goals = s.goals;
      if (Array.isArray(s.b3Catalog)) state.b3Catalog = s.b3Catalog;
      if (s.b3CatalogSyncedAt) state.b3CatalogSyncedAt = s.b3CatalogSyncedAt;
      if (s.social && typeof s.social === 'object') {
        if (Array.isArray(s.social.posts)) state.social.posts = s.social.posts;
        if (Array.isArray(s.social.following)) state.social.following = s.social.following;
        if (Array.isArray(s.social.classes)) state.social.classes = s.social.classes;
        if (typeof s.social.publicProfile === 'boolean') state.social.publicProfile = s.social.publicProfile;
        if (typeof s.social.bio === 'string') state.social.bio = s.social.bio;
        if (typeof s.social.nickname === 'string') state.social.nickname = s.social.nickname;
      }
    }
  } catch (e) { console.warn('Erro lendo estado', e); }
  state.apiKey = DEFAULT_API_KEY;
}

function catalog() {
  const map = new Map();
  for (const a of baseCatalog) map.set(a.ticker, a);
  for (const a of state.catalog) map.set(a.ticker, a);
  for (const a of (state.b3Catalog || [])) if (!map.has(a.ticker)) map.set(a.ticker, a);
  return Array.from(map.values());
}

const brl = n => Number(n || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const pct = n => { const v = Number(n || 0); return (v >= 0 ? '+' : '') + v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%'; };
const today = () => new Date().toLocaleDateString('en-CA');
const $ = id => document.getElementById(id);
function save() { localStorage.setItem(getKey(), JSON.stringify(state)); render(); }
function esc(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

function avatarColor(str) {
  let h = 0;
  for (let i = 0; i < (str || '').length; i++) h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}
function initials(name) {
  const parts = String(name || '?').trim().split(/\s+/).slice(0, 2);
  return parts.map(p => p.charAt(0).toUpperCase()).join('') || '?';
}

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
  try {
    const raw = localStorage.getItem(getKey());
    if (!raw) return;
    const s = JSON.parse(raw);
    if (!s || !Array.isArray(s.trades)) return;
    const map = {};
    for (const t of s.trades) {
      if (isRFComposite(t.ticker)) continue;
      if (t.ticker === SALDO_TICKER) continue;
      const c = baseCatalog.find(x => x.ticker === t.ticker) || (s.catalog || []).find(x => x.ticker === t.ticker);
      const isRF = isRFTicker(t.ticker) || c?.type === 'Renda fixa';
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
        if (s.prices && s.prices[oldT] !== undefined) { s.prices[newT] = s.prices[oldT]; delete s.prices[oldT]; }
        if (Array.isArray(s.dividends)) for (const d of s.dividends) if (d.ticker === oldT) d.ticker = newT;
      }
      localStorage.setItem(getKey(), JSON.stringify(s));
    }
  } catch (e) {}
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

/* ---------- Saldo ---------- */
function getSaldoDisponivel() {
  const total = state.trades.filter(t => t.ticker === SALDO_TICKER).reduce((sum, t) => sum + (t.side === 'buy' ? t.price : -t.price), 0);
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
  try { localStorage.setItem(getKey(), JSON.stringify(state)); } catch (e) {}
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
  try { localStorage.setItem(getKey(), JSON.stringify(state)); } catch (e) {}
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

/* ---------- Parser de notas ---------- */
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
      if (!ticker) { const tk = especificacao.match(/\b([A-Z]{4}\d{1,2})\b/); if (tk) ticker = tk[1]; }
      if (!ticker) { ticker = especificacao.replace(/\s+(CI|ER|N2|N1|ON|PN|UNT|CI ER)\s*$/i, '').split(/\s+/).slice(0, 3).join(' ').toUpperCase(); }
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

/* ---------- Catálogo B3 ---------- */
function classifyB3Asset(stock, ticker, rawType) {
  const t = (rawType || '').toLowerCase();
  if (t === 'stock') return 'Ação';
  if (t === 'fund') return 'FII';
  if (t === 'bdr') return 'BDR';
  if (t === 'unit') return 'Ação';
  const tk = (ticker || '').toUpperCase();
  if (tk.endsWith('11')) return 'FII';
  if (/^[A-Z]{4}3[2-9]$/.test(tk)) return 'BDR';
  if (/^[A-Z]{4}[3-9]$/.test(tk)) return 'Ação';
  if (/^[A-Z]{4}11$/.test(tk)) return 'Ação';
  return 'Outro';
}

async function syncB3Catalog() {
  const btn = $('syncB3Btn');
  const status = $('b3Status');
  if (!state.apiKey) { alert('Sem chave da brapi configurada.'); return; }
  if (btn) { btn.disabled = true; btn.innerHTML = '<span class="spinner"></span>Sincronizando…'; }
  if (status) { status.textContent = 'Consultando B3 via brapi…'; status.className = 'cdi-status'; }
  try {
    const url = 'https://brapi.dev/api/quote/list?token=' + encodeURIComponent(state.apiKey);
    const r = await fetch(url, { headers: { 'Accept': 'application/json' } });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const j = await r.json();
    const list = Array.isArray(j?.stocks) ? j.stocks : (Array.isArray(j?.results) ? j.results : []);
    if (!list.length) throw new Error('Lista vazia');
    const parsed = [];
    const seen = new Set();
    for (const item of list) {
      const tk = (item.stock || item.ticker || '').toUpperCase().trim();
      if (!tk || seen.has(tk)) continue;
      seen.add(tk);
      const nome = item.name || item.shortName || tk;
      const type = classifyB3Asset(item.stock, tk, item.type);
      parsed.push({ ticker: tk, name: nome, type, custom: false, fromB3: true });
    }
    state.b3Catalog = parsed;
    state.b3CatalogSyncedAt = new Date().toISOString();
    try { localStorage.setItem(getKey(), JSON.stringify(state)); } catch (e) {}
    if (status) {
      status.textContent = `✅ ${parsed.length} ativos sincronizados (${timeAgo(state.b3CatalogSyncedAt)})`;
      status.className = 'cdi-status ok';
    }
    alert(`✅ Catálogo B3 atualizado: ${parsed.length} ativos`);
  } catch (e) {
    if (status) {
      status.textContent = '❌ Falha: ' + (e.message || 'erro');
      status.className = 'cdi-status err';
    }
    alert('Não foi possível sincronizar: ' + (e.message || 'erro'));
  } finally {
    if (btn) { btn.disabled = false; btn.innerHTML = '📥 Sincronizar catálogo B3'; }
    render();
  }
}

function clearB3Catalog() {
  if (!confirm('Limpar o catálogo B3 sincronizado?\n\nVocê continua podendo usar o catálogo básico e cadastrar ativos manualmente.')) return;
  state.b3Catalog = [];
  state.b3CatalogSyncedAt = null;
  save();
  const status = $('b3Status');
  if (status) { status.textContent = 'Catálogo B3 limpo'; status.className = 'cdi-status'; }
}

/* ---------- PDF empty stubs (evita erro antes do app-2 carregar) ---------- */
window.showTab = window.showTab || function(){};
window.render = window.render || function(){};

/* ---- FIM DO app-1.js ---- */