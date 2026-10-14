/* ============================================================
   SOCIAL — MOCKS
   ============================================================ */
const MOCK_AUTHORS = [
  { id:'a1', name:'Ana Souza', bio:'Focada em FIIs de papel e renda passiva', followers:284, pctMonth:4.82 },
  { id:'a2', name:'Bruno Lima', bio:'Dividendos e valor. Buy and hold desde 2018', followers:612, pctMonth:3.41 },
  { id:'a3', name:'Carla Mendes', bio:'ETFs e diversificação internacional', followers:193, pctMonth:5.17 },
  { id:'a4', name:'Diego Alves', bio:'FIIs de logística e shoppings', followers:98, pctMonth:2.06 },
  { id:'a5', name:'Elisa Prado', bio:'Renda fixa + FIIs. Perfil conservador', followers:147, pctMonth:1.24 },
  { id:'a6', name:'Felipe Rocha', bio:'Small caps e turnaround', followers:341, pctMonth:7.63 },
  { id:'a7', name:'Gabi Nunes', bio:'Longão em bancos e utilities', followers:255, pctMonth:-1.42 },
  { id:'a8', name:'Heitor Vaz', bio:'FIIs híbridos e desenvolvimento', followers:88, pctMonth:2.88 },
  { id:'a9', name:'Iara Costa', bio:'Bolsa brasileira, foco em qualidade', followers:419, pctMonth:3.02 },
  { id:'a10', name:'João Teles', bio:'Day trade + swing. Carteira agressiva', followers:721, pctMonth:-0.83 }
];

const MOCK_POSTS = [
  { author:'a1', ticker:'MXRF11', text:'Aumentei posição em MXRF11. Yield ainda atrativo no patamar atual, e o fundo mantém boa liquidez. Seguindo a estratégia de acumular todo mês.', hours:2, likes:24 },
  { author:'a3', ticker:'IVVB11', text:'IVVB11 é minha proteção cambial. Todo mês aporte fixo. O segredo não é acertar o timing, é a constância.', hours:5, likes:41 },
  { author:'a6', ticker:'PRIO3', text:'PRIO segue entregando produção sólida. Continuo com a tese de petróleo independente. Position longa.', hours:9, likes:18 },
  { author:'a2', ticker:'BBAS3', text:'BBAS3 pagando dividendos gordos. Bancos públicos com boa rentabilidade — vale manter posição para renda.', hours:14, likes:33 },
  { author:'a4', ticker:'BTLG11', text:'Aluguel de galpões em alta. BTLG11 com vacância baixa. Momento bom pra FIIs de logística.', hours:22, likes:27 },
  { author:'a5', ticker:'LFTS11', text:'LFTS11 tá rendendo bem com Selic alta. Ótima alternativa para reserva de oportunidade com liquidez.', hours:30, likes:15 },
  { author:'a9', ticker:'WEGE3', text:'WEGE é daquelas que você compra e esquece. Empresa séria, gestão boa. Longo prazo sempre.', hours:44, likes:52 },
  { author:'a10', ticker:'PETR4', text:'PETR4 devolvendo parte do movimento. Atenção ao dividend yield e à política de preços.', hours:52, likes:9 }
];

let currentSocialTab = 'feed';
let rankFilter = 'month';

function setSocialTab(id) {
  currentSocialTab = id;
  document.querySelectorAll('.tools-tab[data-social]').forEach(b => {
    b.classList.toggle('active', b.dataset.social === id);
  });
  ['feed','rank','discover'].forEach(t => {
    const el = $('social' + t.charAt(0).toUpperCase() + t.slice(1));
    if (el) el.classList.toggle('hidden', t !== id);
  });
  if (id === 'feed') renderFeed();
  if (id === 'rank') renderRanking();
  if (id === 'discover') renderDiscover();
}
window.setSocialTab = setSocialTab;

document.querySelectorAll('.tools-tab[data-social]').forEach(btn => {
  btn.addEventListener('click', () => setSocialTab(btn.dataset.social));
});

function getInitialPosts() {
  if (!Array.isArray(state.social.posts)) state.social.posts = [];
  const hasMocks = state.social.posts.some(p => p.mock);
  if (!hasMocks) {
    const now = Date.now();
    for (const mp of MOCK_POSTS) {
      state.social.posts.push({
        id: 'mock-' + mp.author + '-' + mp.hours,
        authorId: mp.author,
        ticker: mp.ticker,
        text: mp.text,
        ts: now - (mp.hours * 3600 * 1000),
        likes: mp.likes,
        liked: false,
        mock: true
      });
    }
  }
}

function authorById(id) {
  if (id === 'me') {
    return {
      id: 'me',
      name: state.social.nickname || authUser?.name || 'Você',
      bio: state.social.bio || '',
      followers: 0
    };
  }
  return MOCK_AUTHORS.find(a => a.id === id) || { id, name: 'Investidor', bio:'', followers:0 };
}

function renderFeed() {
  const container = $('feedList');
  if (!container) return;
  getInitialPosts();
  const list = [...state.social.posts].sort((a, b) => b.ts - a.ts);
  if (!list.length) {
    container.innerHTML = '<div class="empty">Nada por aqui ainda. Seja o primeiro a publicar!</div>';
    return;
  }
  container.innerHTML = list.map(p => {
    const a = authorById(p.authorId);
    const color = avatarColor(a.name);
    const time = timeAgo(new Date(p.ts).toISOString());
    const likeClass = p.liked ? 'liked' : '';
    const tickerTag = p.ticker ? `<div class="feed-ticker">💼 ${esc(p.ticker)}</div>` : '';
    return `<div class="feed-card">
      <div class="feed-head">
        <div class="feed-avatar" style="background:${color}">${esc(initials(a.name))}</div>
        <div class="feed-info">
          <div class="feed-name">${esc(a.name)}</div>
          <div class="feed-meta">${esc(time)}</div>
        </div>
      </div>
      ${tickerTag}
      <div class="feed-text">${esc(p.text)}</div>
      <div class="feed-actions">
        <button type="button" class="feed-action ${likeClass}" onclick="likePost('${p.id}')">♥ ${p.likes || 0}</button>
        <button type="button" class="feed-action" onclick="commentPost('${p.id}')">💬 Comentar</button>
      </div>
    </div>`;
  }).join('');
}

window.likePost = function(id) {
  const p = state.social.posts.find(x => x.id === id);
  if (!p) return;
  if (p.liked) { p.liked = false; p.likes = Math.max(0, (p.likes || 0) - 1); }
  else { p.liked = true; p.likes = (p.likes || 0) + 1; }
  save();
  renderFeed();
};

window.commentPost = function(id) {
  alert('💬 Comentários chegam quando a nuvem estiver ativa.');
};

window.newPost = function() {
  const tickerEl = $('postTicker');
  const textEl = $('postText');
  if (tickerEl) tickerEl.value = '';
  if (textEl) textEl.value = '';
  $('postModal')?.classList.remove('hidden');
};

window.closePostModal = function() {
  $('postModal')?.classList.add('hidden');
};

window.confirmPost = function() {
  const ticker = ($('postTicker')?.value || '').trim().toUpperCase();
  const text = ($('postText')?.value || '').trim();
  if (!text) { alert('Escreva algo antes de publicar.'); return; }
  const id = 'p' + Date.now();
  state.social.posts.push({
    id, authorId: 'me', ticker, text,
    ts: Date.now(), likes: 0, liked: false, mine: true
  });
  save();
  closePostModal();
  setSocialTab('feed');
};

function myPortfolioPct() {
  const ps = positions();
  const total = ps.reduce((s, p) => s + p.market, 0);
  const cost = ps.reduce((s, p) => s + p.cost, 0);
  if (cost <= 0) return 0;
  return ((total - cost) / cost) * 100;
}

function rankPctFor(author, filter) {
  if (filter === 'month') return author.pctMonth;
  if (filter === 'year') return author.pctMonth * (8 + (author.followers % 5));
  return author.pctMonth * (20 + (author.followers % 10));
}

function renderRanking() {
  const container = $('rankList');
  if (!container) return;
  const meName = state.social.nickname || authUser?.name || 'Você';
  const mePct = rankPctFor({ pctMonth: myPortfolioPct(), followers: 0 }, rankFilter);
  const meIsPublic = state.social.publicProfile;
  const entries = MOCK_AUTHORS.map(a => ({
    id: a.id, name: a.name, pct: rankPctFor(a, rankFilter), followers: a.followers, me: false
  }));
  if (meIsPublic || myPortfolioPct() !== 0) {
    entries.push({ id: 'me', name: meName + ' (você)', pct: mePct, followers: 0, me: true });
  }
  entries.sort((a, b) => b.pct - a.pct);
  container.innerHTML = entries.map((e, i) => {
    const posClass = i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : '';
    const isNeg = e.pct < 0;
    return `<div class="rank-item ${e.me ? 'me' : ''}">
      <div class="rank-pos ${posClass}">${i + 1}</div>
      <div class="rank-info">
        <div class="rank-name">${esc(e.name)}</div>
        <div class="rank-sub">${e.followers > 0 ? e.followers + ' seguidores' : 'Sem seguidores'}</div>
      </div>
      <div class="rank-pct ${isNeg ? 'neg' : ''}">${pct(e.pct)}</div>
    </div>`;
  }).join('') || '<div class="empty">Sem dados de ranking ainda.</div>';
}

document.querySelectorAll('.rank-chip').forEach(btn => {
  btn.addEventListener('click', () => {
    rankFilter = btn.dataset.rank;
    document.querySelectorAll('.rank-chip').forEach(b => b.classList.toggle('active', b === btn));
    renderRanking();
  });
});

function renderDiscover() {
  const container = $('discoverList');
  if (!container) return;
  container.innerHTML = MOCK_AUTHORS.map(a => {
    const color = avatarColor(a.name);
    const following = state.social.following.includes(a.id);
    return `<div class="discover-card">
      <div class="discover-head">
        <div class="discover-avatar" style="background:${color}">${esc(initials(a.name))}</div>
        <div class="discover-info">
          <div class="discover-name">${esc(a.name)}</div>
          <div class="discover-bio">${esc(a.bio)}</div>
        </div>
      </div>
      <div class="discover-stats">
        <span><b>${a.followers}</b> seguidores</span>
        <span><b>${a.pctMonth >= 0 ? '+' : ''}${a.pctMonth.toFixed(2)}%</b> este mês</span>
      </div>
      <button type="button" class="discover-follow ${following ? 'following' : ''}" onclick="toggleFollow('${a.id}')">
        ${following ? 'Seguindo' : 'Seguir'}
      </button>
    </div>`;
  }).join('');
}

window.toggleFollow = function(id) {
  const idx = state.social.following.indexOf(id);
  if (idx >= 0) state.social.following.splice(idx, 1);
  else state.social.following.push(id);
  save();
  renderDiscover();
};

/* ============================================================
   OPERAR — SUB-ABAS
   ============================================================ */
let currentOpTab = 'buy';
function setOpTab(id) {
  currentOpTab = id;
  document.querySelectorAll('.tools-tab[data-op]').forEach(b => b.classList.toggle('active', b.dataset.op === id));
  ['buy','div','nota','hist'].forEach(t => {
    const el = $('op' + t.charAt(0).toUpperCase() + t.slice(1));
    if (el) el.classList.toggle('hidden', t !== id);
  });
}
window.setOpTab = setOpTab;

document.querySelectorAll('.tools-tab[data-op]').forEach(btn => {
  btn.addEventListener('click', () => setOpTab(btn.dataset.op));
});

/* ============================================================
   ESTUDOS
   ============================================================ */
function renderStudy() {
  const isTeacher = state.study.role === 'teacher';
  const studentBox = $('studyStudent');
  const teacherBox = $('studyTeacher');
  const title = $('studyTitle');
  if (title) title.textContent = isTeacher ? 'Painel do Professor' : 'Estudos';

  if (isTeacher) {
    if (studentBox) studentBox.classList.add('hidden');
    if (teacherBox) teacherBox.classList.remove('hidden');
    renderTeacherClasses();
  } else {
    if (studentBox) studentBox.classList.remove('hidden');
    if (teacherBox) teacherBox.classList.add('hidden');
    renderStudentStudy();
  }
}
window.renderStudy = renderStudy;

function renderStudentStudy() {
  const noClass = $('studentNoClass');
  const hasClass = $('studentHasClass');
  if (!noClass || !hasClass) return;

  const code = state.study.enrolledClassCode;
  const allClasses = loadGlobalClasses();
  const classObj = code ? allClasses[code] : null;

  if (!classObj) {
    noClass.classList.remove('hidden');
    hasClass.classList.add('hidden');
    return;
  }

  noClass.classList.add('hidden');
  hasClass.classList.remove('hidden');

  const expired = isCodeExpired(classObj);
  const expiresIn = classObj.expiresAt
    ? Math.max(0, Math.ceil((new Date(classObj.expiresAt).getTime() - Date.now()) / 86400000))
    : null;

  const materials = Array.isArray(classObj.materials) ? classObj.materials : [];

  hasClass.innerHTML = `
    <div class="student-class-header">
      <div class="student-class-name">${esc(classObj.name)}</div>
      <div class="student-class-teacher">Professor: ${esc(classObj.teacherName || '—')}</div>
      <div class="student-class-meta">
        <span>${materials.length} ${materials.length === 1 ? 'material' : 'materiais'}</span>
        ${expiresIn !== null ? `<span><b>${expired ? 'Expirado' : expiresIn + ' dias restantes'}</b></span>` : ''}
      </div>
    </div>
    ${expired ? '<div class="auth-error" style="margin-bottom:14px;display:block">⚠️ Seu acesso expirou. Peça um novo código ao professor.</div>' : ''}
    ${!expired && classObj.description ? `<p class="notice" style="margin-bottom:14px">${esc(classObj.description)}</p>` : ''}
    ${!expired ? (materials.length ? materials.map(m => `
      <div class="material-card">
        <div class="material-icon">${m.type === 'video' ? '🎥' : m.type === 'pdf' ? '📄' : '📝'}</div>
        <div class="material-info">
          <div class="material-title">${esc(m.title)}</div>
          <div class="material-meta">${esc(m.type || 'material')} · adicionado ${timeAgo(m.addedAt)}</div>
        </div>
        <button type="button" class="material-action" onclick="openMaterial('${esc(m.id)}')">Abrir</button>
      </div>
    `).join('') : '<div class="empty">O professor ainda não enviou materiais.</div>') : ''}
    <button type="button" class="ghost" style="width:100%;margin-top:14px" onclick="leaveStudyClass()">Sair da turma</button>
  `;
}

window.openMaterial = function(id) {
  const code = state.study.enrolledClassCode;
  if (!code) return;
  const all = loadGlobalClasses();
  const c = all[code];
  if (!c) return;
  const m = (c.materials || []).find(x => x.id === id);
  if (!m) return;
  if (m.url) {
    window.open(m.url, '_blank');
  } else {
    alert(`📄 ${m.title}\n\n${m.description || '(sem conteúdo)'}`);
  }
};

window.leaveStudyClass = function() {
  if (!confirm('Sair da turma? Você pode entrar de novo com o mesmo código, se ainda não expirou.')) return;
  state.study.enrolledClassCode = null;
  save();
  renderStudentStudy();
};

window.redeemStudyCode = function() {
  const err = $('studyError');
  if (err) err.classList.add('hidden');
  const input = $('studyCodeInput');
  const code = (input?.value || '').trim().toUpperCase();
  if (!code || code.length < 4) {
    if (err) { err.textContent = 'Código inválido.'; err.classList.remove('hidden'); }
    return;
  }
  const all = loadGlobalClasses();
  const classObj = all[code];
  if (!classObj) {
    if (err) { err.textContent = 'Código não encontrado. Confira com seu professor.'; err.classList.remove('hidden'); }
    return;
  }
  if (isCodeExpired(classObj)) {
    if (err) { err.textContent = 'Este código expirou. Peça um novo ao professor.'; err.classList.remove('hidden'); }
    return;
  }
  state.study.enrolledClassCode = code;
  save();
  if (input) input.value = '';
  renderStudentStudy();
  alert(`✅ Bem-vindo(a) à turma "${classObj.name}"!`);
};

/* ============================================================
   ESTUDOS — PROFESSOR
   ============================================================ */
function renderTeacherClasses() {
  const container = $('classList');
  if (!container) return;
  const all = loadGlobalClasses();
  const myEmail = authUser?.email || '';
  const myClasses = Object.values(all).filter(c => c.teacherEmail === myEmail);

  if (!myClasses.length) {
    container.innerHTML = '<div class="empty">Você ainda não criou nenhuma turma.<br>Toque em <b>+ Criar nova turma</b> pra começar.</div>';
    return;
  }

  container.innerHTML = myClasses.map(c => {
    const expired = isCodeExpired(c);
    const expiresIn = c.expiresAt
      ? Math.max(0, Math.ceil((new Date(c.expiresAt).getTime() - Date.now()) / 86400000))
      : null;
    const materials = Array.isArray(c.materials) ? c.materials : [];
    return `<div class="class-card-study ${expired ? 'expired' : ''}">
      <div class="class-study-head">
        <div style="flex:1;min-width:0">
          <div class="class-study-name">${esc(c.name)}</div>
          <div class="class-study-sub">${c.description ? esc(c.description) : 'Sem descrição'}</div>
        </div>
        <span class="class-study-badge ${expired ? 'expired' : 'active'}">${expired ? 'Expirado' : 'Ativo'}</span>
      </div>
      <div class="class-study-code-big">${esc(c.code)}</div>
      <div class="class-study-info">
        <span><b>${materials.length}</b> materiais</span>
        ${expiresIn !== null ? `<span>${expired ? 'Expirado' : '<b>' + expiresIn + '</b> dias restantes'}</span>` : '<span>Sem validade</span>'}
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px">
        <button type="button" class="ghost-sm" onclick="copyStudyCode('${esc(c.code)}')">📋 Copiar código</button>
        <button type="button" class="ghost-sm" onclick="addMaterial('${esc(c.code)}')">+ Material</button>
        <button type="button" class="ghost-sm" onclick="renewStudyCode('${esc(c.code)}')">🔄 Renovar</button>
        <button type="button" class="ghost-sm danger-ghost" onclick="deleteStudyClass('${esc(c.code)}')">Excluir</button>
      </div>
    </div>`;
  }).join('');
}

window.copyStudyCode = function(code) {
  try {
    navigator.clipboard.writeText(code);
    alert('Código copiado: ' + code + '\n\nEnvie para o aluno pelo WhatsApp, e-mail ou como preferir.');
  } catch (e) {
    alert('Código: ' + code);
  }
};

window.addMaterial = function(code) {
  const title = prompt('Título do material:');
  if (!title) return;
  const type = prompt('Tipo (video, pdf, texto):', 'texto') || 'texto';
  const url = prompt('URL (opcional):') || '';
  const description = prompt('Descrição (opcional):') || '';
  const all = loadGlobalClasses();
  if (!all[code]) return;
  if (!Array.isArray(all[code].materials)) all[code].materials = [];
  all[code].materials.push({
    id: 'm' + Date.now(),
    title: title.trim().slice(0, 80),
    type: type.trim().toLowerCase(),
    url: url.trim(),
    description: description.trim().slice(0, 200),
    addedAt: new Date().toISOString()
  });
  saveGlobalClasses(all);
  renderTeacherClasses();
  alert('✅ Material adicionado.');
};

window.renewStudyCode = function(code) {
  const days = prompt('Renovar por quantos dias?', '30');
  const d = Number(days) || 0;
  if (d <= 0) return;
  const all = loadGlobalClasses();
  if (!all[code]) return;
  all[code].expiresAt = new Date(Date.now() + d * 86400000).toISOString();
  saveGlobalClasses(all);
  renderTeacherClasses();
  alert(`✅ Código renovado por mais ${d} dias.`);
};

window.deleteStudyClass = function(code) {
  if (!confirm('Excluir esta turma? Alunos perderão o acesso imediatamente.')) return;
  const all = loadGlobalClasses();
  delete all[code];
  saveGlobalClasses(all);
  renderTeacherClasses();
};

window.createClass = function() {
  const body = $('classModalBody');
  const title = $('classModalTitle');
  if (title) title.textContent = 'Criar turma';
  if (body) {
    body.innerHTML = `
      <label>Nome da turma</label>
      <input id="classInputName" placeholder="Ex.: Turma FIIs - 2026.1">
      <label style="margin-top:12px">Descrição (opcional)</label>
      <input id="classInputDesc" placeholder="Ex.: Aulas de segunda e quarta">
      <label style="margin-top:12px">Validade do código</label>
      <select id="classInputValidity">
        <option value="7">7 dias</option>
        <option value="15">15 dias</option>
        <option value="30" selected>30 dias</option>
        <option value="90">90 dias</option>
      </select>
    `;
  }
  const modal = $('classModal');
  if (modal) {
    modal.dataset.mode = 'create';
    modal.classList.remove('hidden');
  }
};

window.closeClassModal = function() {
  $('classModal')?.classList.add('hidden');
};

window.confirmClass = function() {
  const modal = $('classModal');
  const mode = modal?.dataset.mode;
  if (mode === 'create') {
    const name = ($('classInputName')?.value || '').trim();
    const desc = ($('classInputDesc')?.value || '').trim();
    const days = Number($('classInputValidity')?.value || 30);
    if (!name) { alert('Dê um nome para a turma.'); return; }
    const code = genStudyCode();
    const all = loadGlobalClasses();
    if (all[code]) { alert('Erro ao gerar código único. Tente de novo.'); return; }
    all[code] = {
      code,
      name: name.slice(0, 60),
      description: desc.slice(0, 120),
      teacherEmail: authUser?.email || '',
      teacherName: authUser?.name || '',
      expiresAt: new Date(Date.now() + days * 86400000).toISOString(),
      createdAt: new Date().toISOString(),
      materials: []
    };
    saveGlobalClasses(all);
    closeClassModal();
    renderTeacherClasses();
    alert(`✅ Turma criada!\n\nCódigo: ${code}\nVálido por ${days} dias.\n\nEnvie esse código pros seus alunos.`);
  }
};

/* ============================================================
   RENDER PRINCIPAL
   ============================================================ */
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
  renderAccount();
  renderPublicProfile();
  if (!$('tools')?.classList.contains('hidden')) renderTools();
  if (!$('social')?.classList.contains('hidden')) setSocialTab(currentSocialTab);
  if (!$('study')?.classList.contains('hidden')) renderStudy();
  if($('autoRefreshSelect')) $('autoRefreshSelect').value = String(state.autoRefresh || 0);
  if($('cdiRateInput')) $('cdiRateInput').value = numToBR(state.cdiRate);
  const b3Status = $('b3Status');
  if (b3Status) {
    const n = (state.b3Catalog || []).length;
    if (n > 0) {
      b3Status.textContent = `${n} ativos sincronizados · ${timeAgo(state.b3CatalogSyncedAt)}`;
      b3Status.className = 'cdi-status ok';
    } else {
      b3Status.textContent = 'Catálogo B3 ainda não sincronizado';
      b3Status.className = 'cdi-status';
    }
  }
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
  ['portfolio','trade','social','study','tools','backup'].forEach(t => { const el = $(t); if (el) el.classList.toggle('hidden', t !== id); });
  const hideHero = (id === 'tools' || id === 'backup' || id === 'trade' || id === 'social' || id === 'study');
  const hs = $('heroSection');
  if (hs) hs.classList.toggle('hidden', hideHero);
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (id === 'tools') renderTools();
  if (id === 'social') setSocialTab(currentSocialTab);
  if (id === 'study') renderStudy();
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
  window.showTab('trade');
  setOpTab('div');
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
  if($('sellInfo')) $('sellInfo').innerHTML = `Posição atual: <b>${qtyToBR(p.qty)}</b> un. · Preço médio ${brl(p.avg)}<br>Preço atual: <b>${brl(p.current)}</b>`;
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
  alert(`✅ Venda registrada.`);
});

window.openRedeem = function(ticker) {
  const p = positions().find(x => x.ticker === ticker);
  if (!p) { alert('Posição não encontrada.'); return; }
  const modal = $('redeemModal');
  if (!modal) return;
  modal.dataset.ticker = ticker;
  if($('redeemTickerName')) $('redeemTickerName').textContent = displayTicker(ticker);
  if($('redeemInfo')) $('redeemInfo').innerHTML = `Valor aplicado: <b>${brl(p.cost)}</b><br>Saldo atual: <b>${brl(p.market)}</b>`;
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
  if (value > p.cost + 1e-6) { alert(`Valor maior que o aplicado.`); return; }
  const pctCDI = rfPct(ticker);
  state.trades.push({ ticker, side: 'sell', qty: 1, price: value, fees: 0, date, pctCDI });
  state.rfLastProjection = null;
  runRFProjection(true);
  save();
  $('redeemModal')?.classList.add('hidden');
  alert(`✅ Resgate registrado.`);
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

/* ============================================================
   EVENTOS GLOBAIS
   ============================================================ */
['tradePrice','tradeRFValue','fees','divAmount','modalInput','cdiRateInput','sellPrice','sellFees','redeemValue','simInitial','simMonthly','goalValue'].forEach(id => { const el = $(id); if (el) attachMoneyMask(el); });

$('addSaldoBtn')?.addEventListener('click', () => window.addSaldo());
$('removeSaldoBtn')?.addEventListener('click', () => window.removeSaldo());
$('refreshBtn')?.addEventListener('click', refreshQuotes);
$('simCalcBtn')?.addEventListener('click', () => window.calcSimulation());
$('genReportBtn')?.addEventListener('click', () => generateReportImage());
$('syncB3Btn')?.addEventListener('click', () => syncB3Catalog());
$('clearB3Btn')?.addEventListener('click', () => clearB3Catalog());
$('btnLogin')?.addEventListener('click', () => doLogin());
$('btnSignup')?.addEventListener('click', () => doSignup());
$('loginPassword')?.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); doLogin(); } });
$('signupPassword2')?.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); doSignup(); } });

$('postCancel')?.addEventListener('click', () => closePostModal());
$('postConfirm')?.addEventListener('click', () => confirmPost());
$('postModal')?.addEventListener('click', e => { if (e.target === $('postModal')) closePostModal(); });

$('classCancel')?.addEventListener('click', () => closeClassModal());
$('classConfirm')?.addEventListener('click', () => confirmClass());
$('classModal')?.addEventListener('click', e => { if (e.target === $('classModal')) closeClassModal(); });

$('addGoalBtn')?.addEventListener('click', () => {
  const box = $('goalFormBox');
  box.classList.toggle('hidden');
  if (!box.classList.contains('hidden')) {
    $('goalDate').value = '';
    setTimeout(() => $('goalName')?.focus(), 50);
  }
});
$('saveGoalBtn')?.addEventListener('click', () => {
  const name = ($('goalName')?.value || '').trim();
  const value = parseMoneyBR($('goalValue')?.value);
  const date = $('goalDate')?.value || '';
  if (!name) { alert('Dê um nome para a meta.'); return; }
  if (!value || value <= 0) { alert('Informe um valor alvo.'); return; }
  state.goals.push({ id: Date.now(), name, value, date });
  save();
  $('goalName').value = '';
  $('goalValue').value = '';
  $('goalDate').value = '';
  $('goalFormBox').classList.add('hidden');
  renderGoals();
});
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
  const matches = catalog().filter(a => (a.ticker + ' ' + a.name).toLowerCase().includes(q)).slice(0, 15);
  const box = $('suggestions'); if(!box) return;
  let html = '';
  const exactInMatches = matches.some(a => a.ticker === upper);
  if (upper && !exactInMatches && upper.length >= 3) { html += `<button type="button" class="suggestion new" data-new="1"><span><strong>+ Usar "${esc(upper)}"</strong><br><small style="color:var(--muted)">Ticker novo</small></span><span class="pill pill-new">Novo</span></button>`; }
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
    if (value <= 0) { alert('Informe um valor válido.'); return; }
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
  const matches = catalog().filter(a => (a.ticker + ' ' + a.name).toLowerCase().includes(q)).slice(0, 15);
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
      if (Array.isArray(d.goals)) state.goals = d.goals;
      if (d.social && typeof d.social === 'object') {
        if (Array.isArray(d.social.posts)) state.social.posts = d.social.posts;
        if (Array.isArray(d.social.following)) state.social.following = d.social.following;
        if (typeof d.social.publicProfile === 'boolean') state.social.publicProfile = d.social.publicProfile;
        if (typeof d.social.bio === 'string') state.social.bio = d.social.bio;
        if (typeof d.social.nickname === 'string') state.social.nickname = d.social.nickname;
      }
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
    const raw = localStorage.getItem(getKey()) || '(vazio)';
    const parsed = raw !== '(vazio)' ? JSON.parse(raw) : null;
    const summary = parsed ? `Operações: ${(parsed.trades || []).length}\nProventos: ${(parsed.dividends || []).length}\nCatálogo pessoal: ${(parsed.catalog || []).length}\nCatálogo B3: ${(parsed.b3Catalog || []).length}\nPreços: ${Object.keys(parsed.prices || {}).length}\nHistórico: ${(parsed.history || []).length} dias\nPosts: ${(parsed.social?.posts || []).length}\nPapel: ${parsed.study?.role || 'student'}\nCDI: ${parsed.cdiRate || '—'}%\nSaldo: ${brl(getSaldoDisponivel())}\n\nConta: ${authUser ? authUser.email : 'Convidado'}` : '(sem dados)';
    alert('📦 Dados no aparelho:\n\n' + summary + '\n\nTamanho: ' + raw.length + ' caracteres');
  } catch (e) { alert('Erro: ' + e.message); }
});

$('clearBtn')?.addEventListener('click', () => {
  if (confirm('Apagar todos os dados deste aparelho?')) {
    state = DEFAULT_STATE();
    state.apiKey = DEFAULT_API_KEY;
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

/* ============================================================
   START
   ============================================================ */
try {
  const isTeacherLink = new URLSearchParams(location.search).has('professor');
  if (isTeacherLink) {
    const t = $('welcomeTagline');
    if (t) t.textContent = 'Painel do professor: crie turmas, gere códigos e envie materiais.';
    const st = $('signupTitle');
    if (st) st.textContent = 'Criar conta de professor';
    const ss = $('signupSubtitle');
    if (ss) ss.textContent = 'Você terá acesso ao painel de turmas.';
    const tf = $('teacherField');
    if (tf) tf.classList.remove('hidden');
  }

  authUser = loadAuth();
  if (authUser && authUser.userId) {
    const users = loadUsers();
    const u = users[authUser.email];
    loadStateForCurrentUser();
    if (u && u.isTeacher) state.study.role = 'teacher';
    bootAfterAuth();
  } else {
    document.getElementById('authFlow')?.classList.remove('hidden');
    document.getElementById('appShell')?.classList.add('hidden');
    setTimeout(() => authScreen('welcome'), 1200);
  }
} catch (e) {
  console.error('Erro no start:', e);
}

if ('serviceWorker' in navigator) { window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {})); }