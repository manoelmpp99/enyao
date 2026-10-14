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
  const title = prompt