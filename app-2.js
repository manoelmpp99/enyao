/* ============================================================
   AUTENTICAÇÃO (local)
   ============================================================ */
function authScreen(id) {
  ['splash','welcome','login','signup'].forEach(s => {
    const el = document.getElementById('screen' + s.charAt(0).toUpperCase() + s.slice(1));
    if (el) el.classList.toggle('hidden', s !== id);
  });
}

function showApp() {
  try {
    const af = document.getElementById('authFlow');
    const as = document.getElementById('appShell');
    if (af) af.classList.add('hidden');
    if (as) as.classList.remove('hidden');
    return true;
  } catch (e) {
    console.error('[enyao] Erro no showApp:', e);
    alert('Erro ao trocar de tela: ' + e.message);
    return false;
  }
}

function showAuthFlow() {
  document.getElementById('authFlow')?.classList.remove('hidden');
  document.getElementById('appShell')?.classList.add('hidden');
  authScreen('welcome');
}

async function hashPassword(pwd) {
  try {
    const buf = new TextEncoder().encode('enyao-salt-v1-' + pwd);
    const hash = await crypto.subtle.digest('SHA-256', buf);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (e) {
    let h = 0;
    const s = 'enyao-salt-v1-' + pwd;
    for (let i = 0; i < s.length; i++) { h = ((h << 5) - h + s.charCodeAt(i)) | 0; }
    return 'fb-' + Math.abs(h).toString(16);
  }
}

function newUserId() {
  try { if (crypto && crypto.randomUUID) return crypto.randomUUID().replace(/-/g,'').slice(0, 16); } catch (e) {}
  return 'u' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function loadUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || '{}') || {}; } catch (e) { return {}; }
}
function saveUsers(u) { try { localStorage.setItem(USERS_KEY, JSON.stringify(u)); } catch (e) {} }

function persistAuth(user) {
  authUser = user;
  try { localStorage.setItem(AUTH_KEY, JSON.stringify(user)); } catch (e) {}
}
function clearAuth() {
  authUser = null;
  try { localStorage.removeItem(AUTH_KEY); } catch (e) {}
}
function loadAuth() {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    const a = JSON.parse(raw);
    if (a && a.userId) return a;
  } catch (e) {}
  return null;
}

function showAuthError(elId, msg) {
  const el = $(elId);
  if (!el) { alert(msg); return; }
  el.textContent = msg;
  el.classList.remove('hidden');
}

async function doSignup() {
  try {
    const err = $('signupError');
    if (err) err.classList.add('hidden');
    const name = ($('signupName')?.value || '').trim();
    const email = ($('signupEmail')?.value || '').trim().toLowerCase();
    const pwd = $('signupPassword')?.value || '';
    const pwd2 = $('signupPassword2')?.value || '';
    if (!name) return showAuthError('signupError', 'Informe seu nome.');
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showAuthError('signupError', 'E-mail inválido.');
    if (pwd.length < 6) return showAuthError('signupError', 'A senha precisa ter pelo menos 6 caracteres.');
    if (pwd !== pwd2) return showAuthError('signupError', 'As senhas não batem.');
    const users = loadUsers();
    if (users[email]) return showAuthError('signupError', 'Esse e-mail já está cadastrado. Faça login.');
    const btn = $('btnSignup');
    if (btn) { btn.disabled = true; btn.textContent = 'Criando…'; }
    const userId = newUserId();
    const passwordHash = await hashPassword(pwd);
    const isTeacher = (typeof window.__teacherSignup !== 'undefined' && window.__teacherSignup === true)
      || new URLSearchParams(location.search).has('professor')
      || location.hash === '#professor';
    users[email] = { userId, name, email, passwordHash, isTeacher, createdAt: new Date().toISOString() };
    saveUsers(users);
    persistAuth({ userId, name, email });
    try {
      const guestRaw = localStorage.getItem(BASE_KEY);
      if (guestRaw && !localStorage.getItem(getKey())) localStorage.setItem(getKey(), guestRaw);
    } catch (e) {}
    if (btn) { btn.disabled = false; btn.textContent = 'Criar conta'; }
    loadStateForCurrentUser();
    if (isTeacher) state.study.role = 'teacher';
    window.__teacherSignup = false;
    bootAfterAuth();
  } catch (e) {
    console.error('[enyao] Erro no signup:', e);
    alert('Erro ao criar conta: ' + e.message);
    const btn = $('btnSignup');
    if (btn) { btn.disabled = false; btn.textContent = 'Criar conta'; }
  }
}

async function doLogin() {
  try {
    const err = $('loginError');
    if (err) err.classList.add('hidden');
    const email = ($('loginEmail')?.value || '').trim().toLowerCase();
    const pwd = $('loginPassword')?.value || '';
    if (!email || !pwd) return showAuthError('loginError', 'Preencha e-mail e senha.');
    const users = loadUsers();
    const u = users[email];
    if (!u) return showAuthError('loginError', 'E-mail não cadastrado neste aparelho.');
    const h = await hashPassword(pwd);
    if (h !== u.passwordHash) return showAuthError('loginError', 'Senha incorreta.');
    persistAuth({ userId: u.userId, name: u.name, email: u.email });
    loadStateForCurrentUser();
    if (u.isTeacher) state.study.role = 'teacher';
    bootAfterAuth();
  } catch (e) {
    console.error('[enyao] Erro no login:', e);
    alert('Erro ao entrar: ' + e.message);
  }
}

function enterAsGuest() {
  try {
    clearAuth();
    loadStateForCurrentUser();
    bootAfterAuth();
  } catch (e) {
    console.error('[enyao] Erro guest:', e);
    alert('Erro: ' + e.message);
  }
}

window.logoutConfirm = function() {
  if (!confirm('Sair da sua conta?\n\nSeus dados continuam salvos neste aparelho.')) return;
  clearAuth();
  showAuthFlow();
};

function bootAfterAuth() {
  if (!showApp()) return;
  try { renderAccount(); } catch (e) { console.error('[enyao] renderAccount:', e); }
  try { runRFProjection(false); } catch (e) { console.error('[enyao] runRFProjection:', e); }
  try { recordSnapshot(); } catch (e) { console.error('[enyao] recordSnapshot:', e); }
  try { render(); } catch (e) { console.error('[enyao] render:', e); alert('Erro ao carregar o app: ' + e.message); }
  try { setupAutoRefresh(); } catch (e) { console.error('[enyao] setupAutoRefresh:', e); }
}

window.authScreen = authScreen;
window.enterAsGuest = enterAsGuest;
window.doSignup = doSignup;
window.doLogin = doLogin;

/* ============================================================
   RENDER CONTA / PERFIL
   ============================================================ */
function renderAccount() {
  const box = $('accountBox');
  if (!box) return;
  if (authUser && authUser.userId) {
    const initial = (authUser.name || '?').trim().charAt(0).toUpperCase();
    const color = avatarColor(authUser.email || authUser.name);
    const users = loadUsers();
    const u = users[authUser.email];
    const isTeacher = u?.isTeacher || state.study.role === 'teacher';
    const tag = isTeacher ? 'Professor' : 'Conta ativa';
    const upgradeBtn = !isTeacher
      ? `<button class="ghost" style="width:100%;margin-top:10px" onclick="openTeacherCode()">🔓 Ativar modo professor</button>`
      : '';
    box.innerHTML = `
      <div class="account-card">
        <div class="account-avatar" style="background:${color}">${esc(initial)}</div>
        <div class="account-info">
          <div class="account-name">${esc(authUser.name)}</div>
          <div class="account-email">${esc(authUser.email)}</div>
          <span class="account-badge user">${esc(tag)}</span>
        </div>
      </div>
      <button class="ghost" style="width:100%;margin-top:12px" onclick="logoutConfirm()">Sair da conta</button>
      ${upgradeBtn}
    `;
  } else {
    box.innerHTML = `
      <div class="account-card">
        <div class="account-avatar" style="background:rgba(255,255,255,.06);color:var(--muted)">?</div>
        <div class="account-info">
          <div class="account-name">Modo convidado</div>
          <div class="account-email">Seus dados ficam só neste aparelho.</div>
          <span class="account-badge guest">Sem conta</span>
        </div>
      </div>
      <button class="primary" style="width:100%;margin-top:12px" onclick="openSignupFromApp()">Criar conta agora</button>
    `;
  }
}

window.openSignupFromApp = function() {
  if (!confirm('Criar uma conta agora?\n\nSeus dados locais serão copiados pra sua nova conta.')) return;
  document.getElementById('authFlow')?.classList.remove('hidden');
  document.getElementById('appShell')?.classList.add('hidden');
  authScreen('signup');
};

function renderPublicProfile() {
  const box = $('publicProfileBox');
  if (!box) return;
  const nickname = state.social.nickname || (authUser?.name || 'Você');
  const bio = state.social.bio || 'Investidor(a) em construção.';
  const color = avatarColor(authUser?.email || nickname);
  const isPublic = state.social.publicProfile;
  box.innerHTML = `
    <div class="public-profile ${isPublic ? '' : 'hidden-mode'}">
      <div class="pp-avatar ${isPublic ? '' : 'anon'}" style="${isPublic ? `background:${color}` : ''}">
        ${isPublic ? esc(initials(nickname)) : '?'}
      </div>
      <div class="pp-name">${isPublic ? esc(nickname) : 'Perfil anônimo'}</div>
      <div class="pp-bio">${isPublic ? esc(bio) : 'Ative o perfil público para aparecer no Ranking e no Descobrir.'}</div>
      <div class="pp-stats">
        <div><div class="pp-stat-l">Seguidores</div><div class="pp-stat-v">0</div></div>
        <div><div class="pp-stat-l">Posts</div><div class="pp-stat-v">${state.social.posts.filter(p => p.mine).length}</div></div>
        <div><div class="pp-stat-l">Turmas</div><div class="pp-stat-v">0</div></div>
      </div>
      <div class="pp-toggle">
        <div class="pp-toggle-text">
          <b>Perfil público</b><br>
          <span style="color:var(--muted);font-size:11px">Aparecer no Ranking e ser encontrado por outros investidores.</span>
        </div>
        <div class="switch ${isPublic ? 'on' : ''}" onclick="togglePublicProfile()"></div>
      </div>
      <button class="ghost" style="width:100%;margin-top:12px" onclick="editProfile()">Editar apelido e bio</button>
    </div>
  `;
}

window.togglePublicProfile = function() {
  state.social.publicProfile = !state.social.publicProfile;
  save();
  renderPublicProfile();
};

window.editProfile = function() {
  const nick = prompt('Apelido público:', state.social.nickname || authUser?.name || '');
  if (nick === null) return;
  const bio = prompt('Bio curta:', state.social.bio || '');
  if (bio === null) return;
  state.social.nickname = nick.trim().slice(0, 30);
  state.social.bio = bio.trim().slice(0, 120);
  save();
  renderPublicProfile();
};

/* ============================================================
   TELA DE DETALHE
   ============================================================ */
let currentChartData = null;

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
  const trades = state.trades.filter(t => t.ticker === ticker).sort((a, b) => (a.date || '').localeCompare(b.date || ''));
  if (trades.length) {
    $('adTrades').innerHTML = trades.map(t => {
      const isBuy = t.side === 'buy';
      const isRF = isRFAsset(t.ticker);
      const label = isRF ? (isBuy ? 'Aplicação' : 'Resgate') : (isBuy ? 'Compra' : 'Venda');
      const detail = isRF ? brl(Math.abs(t.qty * t.price)) : qtyToBR(t.qty) + ' × ' + brl(t.price);
      const total = Math.abs(t.qty * t.price) + (t.fees || 0);
      return `<div class="ad-trade-row">
        <div><span class="ad-badge ${isBuy ? 'buy' : 'sell'}">${label}</span><div class="meta">${esc(t.date)}</div></div>
        <div class="value">${brl(total)}<small>${detail}</small></div>
      </div>`;
    }).join('');
  } else {
    $('adTrades').innerHTML = '<div class="empty" style="padding:14px">Nenhuma operação registrada.</div>';
  }
  const divs = state.dividends.filter(d => d.ticker === ticker).sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  if (divs.length) {
    $('adDividends').innerHTML = divs.map(d => `
      <div class="ad-trade-row">
        <div><span class="ad-badge buy">${esc(d.kind || 'Dividendo')}</span><div class="meta">${esc(d.date)}</div></div>
        <div class="value">${brl(d.amount)}</div>
      </div>`).join('');
  } else {
    $('adDividends').innerHTML = '<div class="empty" style="padding:14px">Nenhum provento registrado.</div>';
  }
  loadAssetChart(ticker);
}

window.closeAssetDetail = function() {
  $('assetDetail')?.classList.add('hidden');
  document.body.style.overflow = '';
  currentChartData = null;
  hideChartOverlays();
};

function hideChartOverlays() {
  const l = $('adChartLine'), d = $('adChartDot'), t = $('adChartTip');
  if (l) l.style.opacity = '0';
  if (d) d.style.opacity = '0';
  if (t) t.style.opacity = '0';
}

async function fetchPriceHistory(ticker) {
  if (!state.priceHistory) state.priceHistory = {};
  const cached = state.priceHistory[ticker];
  if (cached && cached.ts && (Date.now() - cached.ts) < 3600000) return cached.data;
  try {
    const url = 'https://brapi.dev/api/quote/' + encodeURIComponent(ticker) + '?range=3mo&interval=1d&token=' + encodeURIComponent(state.apiKey);
    const r = await fetch(url, { headers: { 'Accept': 'application/json' } });
    if (!r.ok) return null;
    const j = await r.json();
    const hist = j?.results?.[0]?.historicalDataPrice;
    if (!Array.isArray(hist) || !hist.length) return null;
    state.priceHistory[ticker] = { ts: Date.now(), data: hist };
    try { localStorage.setItem(getKey(), JSON.stringify(state)); } catch (e) {}
    return hist;
  } catch (e) { return null; }
}

function normalizeDate(d) {
  if (typeof d === 'number') {
    let ts = d; if (ts > 1e10) ts = Math.floor(ts / 1000);
    const date = new Date(ts * 1000); return date.toISOString().slice(0, 10);
  }
  if (typeof d === 'string') {
    if (/^\d{4}-\d{2}-\d{2}/.test(d)) return d.slice(0, 10);
    const parsed = new Date(d); if (!isNaN(parsed.getTime())) return parsed.toISOString().slice(0, 10);
  }
  return '';
}

async function loadAssetChart(ticker) {
  const svg = $('adChart');
  const loading = $('adChartLoading');
  if (!svg || !loading) return;
  svg.innerHTML = '';
  hideChartOverlays();
  loading.style.display = 'flex';
  loading.textContent = 'Carregando…';
  currentChartData = null;
  if (isRFAsset(ticker)) { loading.textContent = 'Renda fixa não tem gráfico de preço'; return; }
  const hist = await fetchPriceHistory(ticker);
  loading.style.display = 'none';
  if (!hist || hist.length < 2) {
    svg.innerHTML = '<text x="50" y="20" text-anchor="middle" fill="#8a8a9c" font-size="3.5">Sem histórico disponível</text>';
    return;
  }
  const points = hist.map(h => ({ date: normalizeDate(h.date), close: Number(h.close) })).filter(p => Number.isFinite(p.close) && p.close > 0);
  if (points.length < 2) {
    svg.innerHTML = '<text x="50" y="20" text-anchor="middle" fill="#8a8a9c" font-size="3.5">Sem dados suficientes</text>';
    return;
  }
  const prices = points.map(p => p.close);
  const w = 100, height = 40, padY = 2.5;
  const min = Math.min(...prices), max = Math.max(...prices);
  const range = (max - min) || 1;
  const first = prices[0], last = prices[prices.length - 1];
  const positive = last >= first;
  let linePath = '', areaPath = '';
  points.forEach((pt, i) => {
    const x = (i / (points.length - 1)) * w;
    const y = height - padY - ((pt.close - min) / range) * (height - padY * 2);
    if (i === 0) { linePath += `M ${x} ${y}`; areaPath += `M ${x} ${height} L ${x} ${y}`; }
    else { linePath += ` L ${x} ${y}`; areaPath += ` L ${x} ${y}`; }
    if (i === points.length - 1) areaPath += ` L ${x} ${height} Z`;
  });
  const c1 = positive ? '#22d3ee' : '#ff4d80';
  const c2 = positive ? '#ec4899' : '#a855f7';
  const uid = 'adc' + Date.now();
  svg.innerHTML = `
    <defs>
      <linearGradient id="${uid}-line" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="${c2}"/><stop offset="100%" stop-color="${c1}"/></linearGradient>
      <linearGradient id="${uid}-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${c1}" stop-opacity="0.3"/><stop offset="100%" stop-color="${c1}" stop-opacity="0"/></linearGradient>
    </defs>
    <path d="${areaPath}" fill="url(#${uid}-fill)"/>
    <path d="${linePath}" fill="none" stroke="url(#${uid}-line)" stroke-width="2" vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round"/>
  `;
  currentChartData = { points, min, max, range, padY, height, w };
}

(function setupChartInteraction(){
  let wrap = null;
  let touchActive = false;
  let lockedHorizontal = false;
  let startX = 0, startY = 0;
  function updateOverlays(clientX) {
    if (!currentChartData || !wrap) return;
    const rect = wrap.getBoundingClientRect();
    let x = clientX - rect.left;
    x = Math.max(0, Math.min(rect.width, x));
    const pctX = x / rect.width;
    const pts = currentChartData.points;
    const idx = Math.round(pctX * (pts.length - 1));
    const point = pts[idx];
    if (!point) return;
    const xPct = (idx / (pts.length - 1)) * 100;
    const yViewBox = currentChartData.height - currentChartData.padY - ((point.close - currentChartData.min) / currentChartData.range) * (currentChartData.height - currentChartData.padY * 2);
    const yPct = (yViewBox / currentChartData.height) * 100;
    const line = $('adChartLine'), dot = $('adChartDot'), tip = $('adChartTip');
    if (!line || !dot || !tip) return;
    line.style.left = xPct + '%'; line.style.opacity = '1';
    dot.style.left = xPct + '%'; dot.style.top = yPct + '%'; dot.style.opacity = '1';
    const price = point.close.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    let dateStr = point.date || '';
    if (dateStr && /^\d{4}-\d{2}-\d{2}$/.test(dateStr)) { const [y, m, d] = dateStr.split('-'); dateStr = `${d}/${m}/${y}`; }
    tip.innerHTML = `<div class="ad-tip-price">${price}</div><div class="ad-tip-date">${dateStr}</div>`;
    tip.style.left = xPct + '%'; tip.style.opacity = '1';
  }
  function onTouchStart(e) {
    wrap = $('adChartWrap');
    if (!wrap || !currentChartData) return;
    const t = e.touches[0];
    startX = t.clientX; startY = t.clientY;
    touchActive = true; lockedHorizontal = false;
  }
  function onTouchMove(e) {
    if (!touchActive || !wrap || !currentChartData) return;
    const t = e.touches[0];
    const dx = Math.abs(t.clientX - startX);
    const dy = Math.abs(t.clientY - startY);
    if (!lockedHorizontal) {
      if (dx > 6 && dx > dy * 1.2) { lockedHorizontal = true; }
      else if (dy > 8) { touchActive = false; return; }
      else { return; }
    }
    if (lockedHorizontal) { if (e.cancelable) e.preventDefault(); updateOverlays(t.clientX); }
  }
  function onTouchEnd() { touchActive = false; lockedHorizontal = false; hideChartOverlays(); }
  function onMouseDown(e) {
    wrap = $('adChartWrap');
    if (!wrap || !currentChartData) return;
    touchActive = true; updateOverlays(e.clientX);
  }
  function onMouseMove(e) { if (!touchActive || !currentChartData) return; updateOverlays(e.clientX); }
  function onMouseUp() { if (!touchActive) return; touchActive = false; hideChartOverlays(); }
  document.addEventListener('touchstart', onTouchStart, { passive: true });
  document.addEventListener('touchmove', onTouchMove, { passive: false });
  document.addEventListener('touchend', onTouchEnd);
  document.addEventListener('touchcancel', onTouchEnd);
  document.addEventListener('mousedown', onMouseDown);
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
})();

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

/* ============================================================
   FERRAMENTAS
   ============================================================ */
let currentTool = 'perf';

function renderTools() {
  document.querySelectorAll('.tools-tab[data-tool]').forEach(b => {
    b.classList.toggle('active', b.dataset.tool === currentTool);
  });
  // ⚠️ CORREÇÃO: 'calc' adicionado na lista abaixo
  ['perf','sim','calc','goals','report','ir'].forEach(t => {
    const el = $('tool' + t.charAt(0).toUpperCase() + t.slice(1));
    if (el) el.classList.toggle('hidden', t !== currentTool);
  });
  if (currentTool === 'perf') renderPerformance();
  if (currentTool === 'goals') renderGoals();
  if (currentTool === 'ir') renderIR();
  if (currentTool === 'report') initReportMonth();
}

document.querySelectorAll('.tools-tab[data-tool]').forEach(btn => {
  btn.addEventListener('click', () => { currentTool = btn.dataset.tool; renderTools(); });
});

function renderPerformance() {
  const container = $('perfContent');
  if (!container) return;
  const ps = positions();
  if (!ps.length) { container.innerHTML = '<div class="empty">Sem ativos na carteira ainda.</div>'; return; }
  const sorted = [...ps].sort((a, b) => b.unrealizedPct - a.unrealizedPct);
  const maxAbs = Math.max(...sorted.map(p => Math.abs(p.unrealizedPct)), 1);
  container.innerHTML = sorted.map((p, i) => {
    const isPos = p.unrealizedPct >= 0;
    const rankClass = i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : '';
    const barWidth = Math.min(100, (Math.abs(p.unrealizedPct) / maxAbs) * 100);
    return `<div class="perf-item ${isPos ? 'pos' : 'neg'}">
      <div class="perf-head">
        <div style="display:flex;align-items:center;gap:10px;min-width:0;flex:1">
          <div class="perf-rank ${rankClass}">${i + 1}</div>
          <div style="min-width:0">
            <div class="perf-ticker">${esc(displayTicker(p.ticker))}</div>
            <div class="small" style="margin-top:1px">${esc(p.type)}</div>
          </div>
        </div>
        <div class="perf-pct ${isPos ? 'pos' : 'neg'}">${pct(p.unrealizedPct)}</div>
      </div>
      <div class="perf-meta"><span>Custo: ${brl(p.cost)}</span><span>Atual: ${brl(p.market)}</span></div>
      <div class="perf-bar"><div class="perf-bar-fill ${isPos ? 'pos' : 'neg'}" style="width:${barWidth}%"></div></div>
    </div>`;
  }).join('');
}

window.calcSimulation = function() {
  const initial = parseMoneyBR($('simInitial')?.value);
  const monthly = parseMoneyBR($('simMonthly')?.value);
  const months = Number($('simMonths')?.value) || 0;
  const rateStr = $('simRate')?.value || '0';
  const monthlyRate = parseNum(rateStr) / 100;
  if (months <= 0) { alert('Informe um prazo maior que zero.'); return; }
  if (monthlyRate <= 0) { alert('Informe uma taxa maior que zero.'); return; }
  if (initial <= 0 && monthly <= 0) { alert('Informe um valor inicial ou aporte mensal.'); return; }
  let total = initial, invested = initial;
  for (let i = 0; i < months; i++) { total = total * (1 + monthlyRate) + monthly; invested += monthly; }
  const profit = total - invested;
  const box = $('simResult');
  box.classList.remove('hidden');
  box.innerHTML = `
    <div style="font-size:10px;font-weight:800;letter-spacing:1.4px;text-transform:uppercase;color:var(--muted);text-align:center">Resultado em ${months} meses</div>
    <div class="sim-total" style="color:var(--cyan)">${brl(total)}</div>
    <div class="sim-row"><span class="lbl">Total investido</span><span class="val">${brl(invested)}</span></div>
    <div class="sim-row"><span class="lbl">Juros ganhos</span><span class="val" style="color:var(--pink)">${brl(profit)}</span></div>
    <div class="sim-row"><span class="lbl">Rentabilidade total</span><span class="val">${invested > 0 ? pct((profit / invested) * 100) : '0%'}</span></div>
    <div class="sim-row"><span class="lbl">Taxa efetiva</span><span class="val">${rateStr}% a.m.</span></div>
  `;
};

function renderGoals() {
  const container = $('goalsList');
  if (!container) return;
  const ps = positions();
  const totalAtual = ps.reduce((s, p) => s + p.market, 0);
  const goals = Array.isArray(state.goals) ? state.goals : [];
  if (!goals.length) {
    container.innerHTML = '<div class="empty">Nenhuma meta cadastrada ainda.<br>Toque em <b>+ Nova meta</b> para criar.</div>';
    return;
  }
  container.innerHTML = goals.map(g => {
    const pctVal = g.value > 0 ? Math.min(100, (totalAtual / g.value) * 100) : 0;
    const falta = Math.max(0, g.value - totalAtual);
    let prazoInfo = '';
    if (g.date) {
      const hoje = new Date();
      const alvo = new Date(g.date + 'T00:00:00');
      const dias = Math.ceil((alvo - hoje) / 86400000);
      if (dias > 0) {
        const meses = Math.ceil(dias / 30);
        const aporteNecessario = meses > 0 ? falta / meses : 0;
        prazoInfo = `${meses} meses restantes · aporte ~${brl(aporteNecessario)}/mês`;
      } else { prazoInfo = 'Prazo vencido'; }
    }
    return `<div class="goal-card">
      <div class="goal-head">
        <div style="flex:1;min-width:0">
          <div class="goal-name">${esc(g.name)}</div>
          ${g.date ? `<div class="goal-date">Alvo: ${esc(g.date.split('-').reverse().join('/'))}</div>` : ''}
        </div>
        <button type="button" class="goal-delete" onclick="removeGoal(${g.id})">✕</button>
      </div>
      <div class="goal-values">
        <span><span class="lbl">Atual</span> ${brl(totalAtual)}</span>
        <span><span class="lbl">Alvo</span> ${brl(g.value)}</span>
      </div>
      <div class="goal-bar"><div class="goal-bar-fill" style="width:${pctVal}%"></div></div>
      <div class="goal-pct">${pctVal.toFixed(1)}% alcançado</div>
      ${prazoInfo ? `<div class="goal-info">${prazoInfo}</div>` : ''}
    </div>`;
  }).join('');
}

window.removeGoal = function(id) {
  if (!confirm('Excluir esta meta?')) return;
  state.goals = state.goals.filter(g => g.id !== id);
  save();
  renderGoals();
};

function initReportMonth() {
  const el = $('reportMonth');
  if (el && !el.value) {
    const now = new Date();
    el.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }
}

async function generateReportImage() {
  const monthStr = $('reportMonth')?.value;
  if (!monthStr) { alert('Escolha um mês.'); return; }
  const [yy, mm] = monthStr.split('-');
  const monthNames = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
  const monthLabel = `${monthNames[Number(mm) - 1]} ${yy}`;
  const ps = positions();
  const totalAtual = ps.reduce((s, p) => s + p.market, 0);
  const profitTotal = ps.reduce((s, p) => s + p.unrealized, 0);
  const profitPct = totalAtual - profitTotal > 0 ? (profitTotal / (totalAtual - profitTotal)) * 100 : 0;
  const divsMes = state.dividends.filter(d => (d.date || '').startsWith(monthStr));
  const divsTotal = divsMes.reduce((s, d) => s + Number(d.amount || 0), 0);
  const tradesMes = state.trades.filter(t => (t.date || '').startsWith(monthStr) && t.ticker !== SALDO_TICKER);
  const aportes = tradesMes.filter(t => t.side === 'buy' && !isRFAsset(t.ticker)).reduce((s, t) => s + Math.abs(t.qty * t.price), 0);
  const retiradas = tradesMes.filter(t => t.side === 'sell' && !isRFAsset(t.ticker)).reduce((s, t) => s + Math.abs(t.qty * t.price), 0);
  const topAtivos = [...ps].sort((a, b) => b.market - a.market).slice(0, 5);
  const W = 1080, H = 1350;
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#050508'); bg.addColorStop(1, '#0e0e14');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  const gtop = ctx.createLinearGradient(0, 0, W, 0);
  gtop.addColorStop(0, '#ec4899'); gtop.addColorStop(0.5, '#a855f7'); gtop.addColorStop(1, '#22d3ee');
  ctx.fillStyle = gtop; ctx.fillRect(0, 0, W, 8);
  ctx.font = '800 52px system-ui, sans-serif';
  ctx.fillStyle = gtop;
  ctx.fillText('enyao', 60, 100);
  ctx.font = '700 26px system-ui, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,.55)';
  ctx.fillText('Relatório mensal', 60, 140);
  ctx.font = '800 46px system-ui, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(monthLabel, 60, 210);
  const hg = ctx.createLinearGradient(60, 250, W - 60, 480);
  hg.addColorStop(0, '#ec4899'); hg.addColorStop(0.5, '#a855f7'); hg.addColorStop(1, '#22d3ee');
  ctx.fillStyle = hg;
  roundRect(ctx, 60, 260, W - 120, 220, 32); ctx.fill();
  ctx.font = '700 20px system-ui, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,.75)';
  ctx.fillText('PATRIMÔNIO ATUAL', 100, 310);
  ctx.font = '800 68px system-ui, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(brl(totalAtual), 100, 390);
  ctx.font = '700 24px system-ui, sans-serif';
  const pos = profitTotal >= 0;
  ctx.fillStyle = pos ? '#d5f7ff' : '#ffd0dd';
  ctx.fillText(`${pos ? '+' : ''}${brl(profitTotal)}  (${pct(profitPct)})`, 100, 440);
  const yBase = 540;
  const gapW = (W - 120 - 40) / 3;
  drawStatCard(ctx, 60, yBase, gapW, 180, 'Proventos do mês', brl(divsTotal), '#22d3ee');
  drawStatCard(ctx, 60 + gapW + 20, yBase, gapW, 180, 'Aportes no mês', brl(aportes), '#a855f7');
  drawStatCard(ctx, 60 + (gapW + 20) * 2, yBase, gapW, 180, 'Retiradas', brl(retiradas), '#ec4899');
  ctx.font = '800 22px system-ui, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,.55)';
  ctx.fillText('TOP 5 ATIVOS', 60, yBase + 260);
  const itemY = yBase + 300;
  const itemH = 80;
  topAtivos.forEach((p, i) => {
    const y = itemY + i * (itemH + 12);
    ctx.fillStyle = 'rgba(255,255,255,.04)';
    roundRect(ctx, 60, y, W - 120, itemH, 18); ctx.fill();
    const dotColor = COLOR_MAP[p.type] || '#64748b';
    ctx.fillStyle = dotColor;
    ctx.beginPath(); ctx.arc(110, y + itemH / 2, 10, 0, Math.PI * 2); ctx.fill();
    ctx.font = '800 26px system-ui, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(displayTicker(p.ticker), 150, y + 36);
    ctx.font = '600 16px system-ui, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,.45)';
    ctx.fillText(p.type, 150, y + 62);
    ctx.font = '800 26px system-ui, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'right';
    ctx.fillText(brl(p.market), W - 110, y + 36);
    ctx.font = '700 18px system-ui, sans-serif';
    ctx.fillStyle = p.unrealized >= 0 ? '#22d3ee' : '#ff4d80';
    ctx.fillText(pct(p.unrealizedPct), W - 110, y + 62);
    ctx.textAlign = 'left';
  });
  ctx.font = '600 16px system-ui, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,.3)';
  const dataHoje = new Date().toLocaleDateString('pt-BR');
  ctx.fillText(`Gerado em ${dataHoje} · enyao`, 60, H - 50);
  const dataUrl = canvas.toDataURL('image/png');
  const preview = $('reportPreview');
  const img = $('reportImage');
  const dl = $('reportDownload');
  if (img) img.src = dataUrl;
  if (dl) dl.href = dataUrl;
  if (preview) preview.classList.remove('hidden');
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawStatCard(ctx, x, y, w, h, label, value, accent) {
  ctx.fillStyle = 'rgba(255,255,255,.04)';
  roundRect(ctx, x, y, w, h, 20); ctx.fill();
  ctx.fillStyle = accent;
  roundRect(ctx, x, y, w, 6, 3); ctx.fill();
  ctx.font = '700 16px system-ui, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,.5)';
  ctx.fillText(label, x + 20, y + 48);
  ctx.font = '800 30px system-ui, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(value, x + 20, y + 110);
}

/* ============================================================
   CÓDIGO DE PROFESSOR
   ============================================================ */
const TEACHER_ACCESS_CODE = 'PROFESSOR2026';

window.openTeacherCode = function() {
  const err = $('teacherCodeError');
  if (err) err.classList.add('hidden');
  const input = $('teacherCodeInput');
  if (input) input.value = '';
  $('teacherCodeModal')?.classList.remove('hidden');
  setTimeout(() => input?.focus(), 100);
};

window.closeTeacherCode = function() {
  $('teacherCodeModal')?.classList.add('hidden');
};

window.confirmTeacherCode = function() {
  const err = $('teacherCodeError');
  const input = $('teacherCodeInput');
  const code = (input?.value || '').trim().toUpperCase();
  if (!code) {
    if (err) { err.textContent = 'Insira um código.'; err.classList.remove('hidden'); }
    return;
  }
  if (code !== TEACHER_ACCESS_CODE) {
    if (err) { err.textContent = 'Código inválido. Confira o que você recebeu.'; err.classList.remove('hidden'); }
    return;
  }
  window.__teacherSignup = true;
  closeTeacherCode();

  if (authUser && authUser.userId) {
    const users = loadUsers();
    const u = users[authUser.email];
    if (u) {
      u.isTeacher = true;
      saveUsers(users);
    }
    state.study.role = 'teacher';
    save();
    alert('✅ Modo professor ativado nesta conta!');
    render();
    window.showTab('study');
  } else {
    authScreen('signup');
    const st = $('signupTitle');
    if (st) st.textContent = 'Criar conta de professor';
    const ss = $('signupSubtitle');
    if (ss) ss.textContent = 'Você terá acesso ao painel de turmas.';
    const tf = $('teacherField');
    if (tf) tf.classList.remove('hidden');
  }
};

window.activateTeacherOnCurrentAccount = function() {
  if (!authUser || !authUser.userId) return;
  const users = loadUsers();
  const u = users[authUser.email];
  if (!u) return;
  u.isTeacher = true;
  saveUsers(users);
  state.study.role = 'teacher';
  save();
  alert('✅ Modo professor ativado nesta conta!');
  render();
  window.showTab('study');
};