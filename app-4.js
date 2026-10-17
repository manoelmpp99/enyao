/* ============================================================
   CALCULADORAS — app-4.js
   Baseado nas calculadoras do Investidor10 (versão sem API)
   ============================================================ */

function calcBRL(n) {
  return Number(n || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 2 });
}

function calcBRLShort(n) {
  const v = Number(n || 0);
  if (Math.abs(v) >= 1e9) return 'R$ ' + (v / 1e9).toFixed(2).replace('.', ',') + ' bi';
  if (Math.abs(v) >= 1e6) return 'R$ ' + (v / 1e6).toFixed(2).replace('.', ',') + ' mi';
  if (Math.abs(v) >= 1e3) return 'R$ ' + (v / 1e3).toFixed(1).replace('.', ',') + ' mil';
  return calcBRL(v);
}

function calcPct(n) {
  const v = Number(n || 0);
  return (v >= 0 ? '+' : '') + v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%';
}

function calcMonthsLabel(m) {
  m = Math.max(0, Math.round(m));
  if (m < 1) return 'agora';
  const y = Math.floor(m / 12);
  const rest = m % 12;
  if (y === 0) return m + (m === 1 ? ' mês' : ' meses');
  if (rest === 0) return y + (y === 1 ? ' ano' : ' anos');
  return y + (y === 1 ? ' ano' : ' anos') + ' e ' + rest + (rest === 1 ? ' mês' : ' meses');
}

function calcAttachMoney() {
  ['calcInit', 'calcMonthly', 'calcReserveCost', 'calcReserveSaved'].forEach(id => {
    const el = $(id);
    if (!el) return;
    if (el.dataset.maskAttached) return;
    el.dataset.maskAttached = '1';
    el.addEventListener('input', () => {
      const digits = el.value.replace(/\D/g, '');
      el.value = digitsToMoney(digits);
      requestAnimationFrame(() => { const l = el.value.length; el.setSelectionRange(l, l); });
    });
  });
}

let calcLastInputs = {
  compound: { init: '', monthly: '', rate: '0,80', months: '120' },
  fire:     { income: '', rate: '4', ret: '0,80', current: '', monthly: '' },
  reserve:  { cost: '', months: '6', saved: '' },
  million:  { init: '', monthly: '', rate: '0,80' }
};

window.openCalc = function(type) {
  const detail = $('calcDetail');
  const body = $('calcBody');
  const title = $('calcTitle');
  const subtitle = $('calcSubtitle');
  if (!detail || !body || !title) return;

  detail.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  detail.dataset.type = type;

  const stored = calcLastInputs[type] || {};
  let html = '';

  if (type === 'compound') {
    title.textContent = 'Juros Compostos';
    subtitle.textContent = 'Simule o crescimento do seu dinheiro';
    html = `
      <p class="notice" style="margin-bottom:16px">Coloque um valor inicial (pode ser 0) e um aporte mensal. A taxa é em % ao mês.</p>
      <label for="calcInit">Valor inicial (R$)</label>
      <input id="calcInit" class="money-input" type="text" inputmode="numeric" value="${stored.init || ''}" placeholder="0,00">
      <label for="calcMonthly">Aporte mensal (R$)</label>
      <input id="calcMonthly" class="money-input" type="text" inputmode="numeric" value="${stored.monthly || ''}" placeholder="0,00">
      <div class="grid">
        <div><label for="calcRate">Taxa (% a.m.)</label><input id="calcRate" type="text" inputmode="decimal" value="${stored.rate || '0,80'}"></div>
        <div><label for="calcMonths">Prazo (meses)</label><input id="calcMonths" type="number" min="1" max="1200" value="${stored.months || '120'}"></div>
      </div>
      <button type="button" class="primary" style="margin-top:18px" onclick="runCalcCompound()">Calcular</button>
      <div id="calcResultBox"></div>
    `;
  } else if (type === 'fire') {
    title.textContent = 'Independência Financeira';
    subtitle.textContent = 'Quanto você precisa pra viver de renda';
    html = `
      <p class="notice" style="margin-bottom:16px">Informe a renda mensal que você quer ter quando parar. A "taxa de retirada segura" é o percentual anual que você tira do patrimônio — o padrão do mercado é 4%.</p>
      <label for="calcIncome">Renda mensal desejada (R$)</label>
      <input id="calcIncome" class="money-input" type="text" inputmode="numeric" value="${stored.income || ''}" placeholder="0,00">
      <div class="grid">
        <div><label for="calcFireRate">Taxa de retirada (% a.a.)</label><input id="calcFireRate" type="text" inputmode="decimal" value="${stored.rate || '4'}"></div>
        <div><label for="calcFireReturn">Rentabilidade (% a.m.)</label><input id="calcFireReturn" type="text" inputmode="decimal" value="${stored.ret || '0,80'}"></div>
      </div>
      <label for="calcCurrent">Patrimônio atual (R$)</label>
      <input id="calcCurrent" class="money-input" type="text" inputmode="numeric" value="${stored.current || ''}" placeholder="0,00">
      <label for="calcFireMonthly">Aporte mensal (R$)</label>
      <input id="calcFireMonthly" class="money-input" type="text" inputmode="numeric" value="${stored.monthly || ''}" placeholder="0,00">
      <button type="button" class="primary" style="margin-top:18px" onclick="runCalcFIRE()">Calcular</button>
      <div id="calcResultBox"></div>
    `;
  } else if (type === 'reserve') {
    title.textContent = 'Reserva de Emergência';
    subtitle.textContent = 'Quanto guardar pra imprevistos';
    html = `
      <p class="notice" style="margin-bottom:16px">O padrão do mercado é guardar entre 6 e 12 meses do seu custo de vida. Autônomos geralmente precisam de mais.</p>
      <label for="calcReserveCost">Custo de vida mensal (R$)</label>
      <input id="calcReserveCost" class="money-input" type="text" inputmode="numeric" value="${stored.cost || ''}" placeholder="0,00">
      <label for="calcReserveMonths">Meses de proteção</label>
      <select id="calcReserveMonths">
        <option value="3" ${stored.months === '3' ? 'selected' : ''}>3 meses (renda estável)</option>
        <option value="6" ${stored.months === '6' || !stored.months ? 'selected' : ''}>6 meses (padrão)</option>
        <option value="9" ${stored.months === '9' ? 'selected' : ''}>9 meses (autônomo)</option>
        <option value="12" ${stored.months === '12' ? 'selected' : ''}>12 meses (conservador)</option>
      </select>
      <label for="calcReserveSaved">Já guardado (R$)</label>
      <input id="calcReserveSaved" class="money-input" type="text" inputmode="numeric" value="${stored.saved || ''}" placeholder="0,00">
      <button type="button" class="primary" style="margin-top:18px" onclick="runCalcReserve()">Calcular</button>
      <div id="calcResultBox"></div>
    `;
  } else if (type === 'million') {
    title.textContent = 'Primeiro Milhão';
    subtitle.textContent = 'Quanto tempo até R$ 1.000.000';
    html = `
      <p class="notice" style="margin-bottom:16px">Descubra em quanto tempo você chega no primeiro milhão, com seu aporte mensal e rentabilidade.</p>
      <label for="calcInit">Valor inicial (R$)</label>
      <input id="calcInit" class="money-input" type="text" inputmode="numeric" value="${stored.init || ''}" placeholder="0,00">
      <label for="calcMonthly">Aporte mensal (R$)</label>
      <input id="calcMonthly" class="money-input" type="text" inputmode="numeric" value="${stored.monthly || ''}" placeholder="0,00">
      <label for="calcRate">Taxa (% a.m.)</label>
      <input id="calcRate" type="text" inputmode="decimal" value="${stored.rate || '0,80'}">
      <button type="button" class="primary" style="margin-top:18px" onclick="runCalcMillion()">Calcular</button>
      <div id="calcResultBox"></div>
    `;
  }

  body.innerHTML = html;
  calcAttachMoney();
  setTimeout(() => { const first = body.querySelector('input'); if (first) first.focus(); }, 150);
};

window.closeCalc = function() {
  $('calcDetail')?.classList.add('hidden');
  document.body.style.overflow = '';
};

function calcSaveInputs(type, obj) {
  calcLastInputs[type] = { ...calcLastInputs[type], ...obj };
}

function calcRenderChart(series) {
  const w = 100, h = 40, padY = 2.5;
  const uid = 'calcChart' + Date.now() + Math.floor(Math.random() * 1000);
  let paths = '', gradients = '';
  series.forEach((s, i) => {
    if (!s.points.length) return;
    let line = '', area = '';
    s.points.forEach((p, idx) => {
      const x = p.x * w;
      const y = h - padY - p.y * (h - padY * 2);
      if (idx === 0) { line += `M ${x} ${y}`; area += `M ${x} ${h} L ${x} ${y}`; }
      else { line += ` L ${x} ${y}`; area += ` L ${x} ${y}`; }
      if (idx === s.points.length - 1) area += ` L ${x} ${h} Z`;
    });
    if (s.fill) {
      gradients += `<linearGradient id="${uid}-fill-${i}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${s.color}" stop-opacity="0.28"/><stop offset="100%" stop-color="${s.color}" stop-opacity="0"/></linearGradient>`;
      paths += `<path d="${area}" fill="url(#${uid}-fill-${i})"/>`;
    }
    paths += `<path d="${line}" fill="none" stroke="${s.color}" stroke-width="2" vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round"/>`;
  });
  return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"><defs>${gradients}</defs>${paths}</svg>`;
}

/* ---------- JUROS COMPOSTOS ---------- */
window.runCalcCompound = function() {
  const init = parseMoneyBR($('calcInit')?.value);
  const monthly = parseMoneyBR($('calcMonthly')?.value);
  const rateStr = $('calcRate')?.value || '0';
  const rate = parseNum(rateStr) / 100;
  const months = Math.max(1, Math.min(1200, Number($('calcMonths')?.value) || 0));

  if (rate <= 0) { alert('Informe uma taxa maior que zero.'); return; }
  if (init <= 0 && monthly <= 0) { alert('Informe um valor inicial ou aporte mensal.'); return; }

  calcSaveInputs('compound', {
    init: $('calcInit')?.value || '',
    monthly: $('calcMonthly')?.value || '',
    rate: rateStr,
    months: String(months)
  });

  let total = init, invested = init;
  const series = [
    { label: 'Total', color: '#22d3ee', fill: true, points: [] },
    { label: 'Investido', color: '#ec4899', fill: false, points: [] }
  ];

  for (let m = 1; m <= months; m++) {
    total = total * (1 + rate) + monthly;
    invested += monthly;
    const x = m / months;
    series[0].points.push({ x, y: total });
    series[1].points.push({ x, y: invested });
  }

  const maxVal = total;
  series.forEach(s => s.points.forEach(p => { p.y = maxVal > 0 ? p.y / maxVal : 0; }));

  const profit = total - invested;
  const profitPct = invested > 0 ? (profit / invested) * 100 : 0;

  const box = $('calcResultBox');
  box.innerHTML = `
    <div class="calc-result">
      <div class="calc-result-hero">
        <div class="calc-result-label">Montante final em ${calcMonthsLabel(months)}</div>
        <div class="calc-result-value pos">${calcBRL(total)}</div>
      </div>
      <div class="calc-result-rows">
        <div class="calc-result-row"><span class="lbl">Total investido</span><span class="val">${calcBRL(invested)}</span></div>
        <div class="calc-result-row"><span class="lbl">Juros ganhos</span><span class="val" style="color:var(--pink)">${calcBRL(profit)}</span></div>
        <div class="calc-result-row"><span class="lbl">Rentabilidade total</span><span class="val">${calcPct(profitPct)}</span></div>
        <div class="calc-result-row"><span class="lbl">Taxa efetiva</span><span class="val">${rateStr}% a.m.</span></div>
      </div>
      <div class="calc-chart-wrap">${calcRenderChart(series)}</div>
      <div class="calc-chart-legend">
        <span><span class="calc-legend-dot" style="background:#22d3ee"></span> Total</span>
        <span><span class="calc-legend-dot" style="background:#ec4899"></span> Investido</span>
      </div>
      <div class="calc-hint">Em ${calcMonthsLabel(months)}, ${((profit / total) * 100).toFixed(1).replace('.', ',')}% do seu patrimônio serão juros.</div>
    </div>
  `;
};

/* ---------- INDEPENDÊNCIA FINANCEIRA ---------- */
window.runCalcFIRE = function() {
  const income = parseMoneyBR($('calcIncome')?.value);
  const withdrawalRate = parseNum($('calcFireRate')?.value) / 100;
  const monthlyReturn = parseNum($('calcFireReturn')?.value) / 100;
  const current = parseMoneyBR($('calcCurrent')?.value);
  const monthly = parseMoneyBR($('calcFireMonthly')?.value);

  if (income <= 0) { alert('Informe a renda mensal desejada.'); return; }
  if (withdrawalRate <= 0) { alert('Informe a taxa de retirada.'); return; }
  if (monthlyReturn <= 0) { alert('Informe a rentabilidade esperada.'); return; }

  calcSaveInputs('fire', {
    income: $('calcIncome')?.value || '',
    rate: $('calcFireRate')?.value || '4',
    ret: $('calcFireReturn')?.value || '0,80',
    current: $('calcCurrent')?.value || '',
    monthly: $('calcFireMonthly')?.value || ''
  });

  const goal = (income * 12) / withdrawalRate;
  const need = Math.max(0, goal - current);
  let months = 0;
  const series = [
    { label: 'Patrimônio', color: '#a855f7', fill: true, points: [] },
    { label: 'Meta', color: '#22d3ee', fill: false, points: [] }
  ];
  const MAX = 1200;

  if (current < goal) {
    let invest = current, m = 0;
    while (invest < goal && m < MAX) {
      invest = invest * (1 + monthlyReturn) + monthly;
      m++;
    }
    months = invest >= goal ? m : MAX;

    const steps = 60;
    const stepMonths = Math.max(1, Math.ceil(months / steps));
    let v = current, mm = 0;
    series[0].points.push({ x: 0, y: current });
    series[1].points.push({ x: 0, y: goal });
    while (mm < months) {
      for (let k = 0; k < stepMonths && mm < months; k++) {
        v = v * (1 + monthlyReturn) + monthly;
        mm++;
      }
      series[0].points.push({ x: mm / months, y: v });
      series[1].points.push({ x: mm / months, y: goal });
    }
  } else {
    months = 0;
  }

  const maxY = Math.max(goal, ...series[0].points.map(p => p.y));
  series.forEach(s => s.points.forEach(p => { p.y = maxY > 0 ? p.y / maxY : 0; }));

  const box = $('calcResultBox');
  const reached = current >= goal;
  box.innerHTML = `
    <div class="calc-result">
      <div class="calc-result-hero">
        <div class="calc-result-label">Patrimônio necessário</div>
        <div class="calc-result-value pos">${calcBRL(goal)}</div>
        <div class="calc-hint" style="margin-top:8px">Isso gera ${calcBRL(income)}/mês tirando ${(withdrawalRate * 100).toFixed(1).replace('.', ',')}% ao ano.</div>
      </div>
      <div class="calc-result-rows">
        <div class="calc-result-row"><span class="lbl">Patrimônio atual</span><span class="val">${calcBRL(current)}</span></div>
        <div class="calc-result-row"><span class="lbl">Falta</span><span class="val" style="color:var(--pink)">${calcBRL(need)}</span></div>
        <div class="calc-result-row"><span class="lbl">Aporte mensal considerado</span><span class="val">${calcBRL(monthly)}</span></div>
        <div class="calc-result-row"><span class="lbl">Tempo estimado</span><span class="val">${reached ? 'Já chegou!' : calcMonthsLabel(months)}</span></div>
      </div>
      ${!reached && months > 0 ? `<div class="calc-chart-wrap">${calcRenderChart(series)}</div>
      <div class="calc-chart-legend">
        <span><span class="calc-legend-dot" style="background:#a855f7"></span> Seu patrimônio</span>
        <span><span class="calc-legend-dot" style="background:#22d3ee"></span> Meta</span>
      </div>` : ''}
    </div>
  `;
};

/* ---------- RESERVA DE EMERGÊNCIA ---------- */
window.runCalcReserve = function() {
  const cost = parseMoneyBR($('calcReserveCost')?.value);
  const months = Math.max(1, Number($('calcReserveMonths')?.value) || 6);
  const saved = parseMoneyBR($('calcReserveSaved')?.value);

  if (cost <= 0) { alert('Informe o custo de vida mensal.'); return; }

  calcSaveInputs('reserve', {
    cost: $('calcReserveCost')?.value || '',
    months: String(months),
    saved: $('calcReserveSaved')?.value || ''
  });

  const goal = cost * months;
  const falta = Math.max(0, goal - saved);
  const pctVal = goal > 0 ? Math.min(100, (saved / goal) * 100) : 0;

  const box = $('calcResultBox');
  box.innerHTML = `
    <div class="calc-result">
      <div class="calc-result-hero">
        <div class="calc-result-label">Reserva ideal (${months} meses)</div>
        <div class="calc-result-value pos">${calcBRL(goal)}</div>
      </div>
      <div class="calc-result-rows">
        <div class="calc-result-row"><span class="lbl">Já guardado</span><span class="val">${calcBRL(saved)}</span></div>
        <div class="calc-result-row"><span class="lbl">Falta</span><span class="val" style="color:var(--pink)">${calcBRL(falta)}</span></div>
        <div class="calc-result-row"><span class="lbl">Progresso</span><span class="val">${pctVal.toFixed(1).replace('.', ',')}%</span></div>
      </div>
      <div class="calc-chart-wrap" style="height:auto">
        <div class="goal-bar"><div class="goal-bar-fill" style="width:${pctVal}%"></div></div>
      </div>
      <div class="calc-hint">Onde guardar: Tesouro Selic, CDB de liquidez diária, ou fundo DI. Nunca em renda variável.</div>
    </div>
  `;
};

/* ---------- PRIMEIRO MILHÃO ---------- */
window.runCalcMillion = function() {
  const init = parseMoneyBR($('calcInit')?.value);
  const monthly = parseMoneyBR($('calcMonthly')?.value);
  const rateStr = $('calcRate')?.value || '0';
  const rate = parseNum(rateStr) / 100;

  if (rate <= 0) { alert('Informe uma taxa maior que zero.'); return; }
  if (init <= 0 && monthly <= 0) { alert('Informe um valor inicial ou aporte mensal.'); return; }

  calcSaveInputs('million', {
    init: $('calcInit')?.value || '',
    monthly: $('calcMonthly')?.value || '',
    rate: rateStr
  });

  const GOAL = 1000000;
  const MAX = 1200;
  let total = init, invested = init, m = 0;

  if (total >= GOAL) {
    m = 0;
  } else {
    while (total < GOAL && m < MAX) {
      total = total * (1 + rate) + monthly;
      invested += monthly;
      m++;
    }
  }

  const reached = total >= GOAL;
  const series = [
    { label: 'Patrimônio', color: '#fbbf24', fill: true, points: [] },
    { label: 'Investido', color: '#ec4899', fill: false, points: [] }
  ];

  if (m > 0) {
    const steps = 60;
    const stepMonths = Math.max(1, Math.ceil(m / steps));
    let v = init, inv = init, mm = 0;
    series[0].points.push({ x: 0, y: v });
    series[1].points.push({ x: 0, y: inv });
    while (mm < m) {
      for (let k = 0; k < stepMonths && mm < m; k++) {
        v = v * (1 + rate) + monthly;
        inv += monthly;
        mm++;
      }
      series[0].points.push({ x: mm / m, y: v });
      series[1].points.push({ x: mm / m, y: inv });
    }
    const maxY = Math.max(GOAL, v);
    series.forEach(s => s.points.forEach(p => { p.y = maxY > 0 ? p.y / maxY : 0; }));
  }

  const profit = total - invested;

  const box = $('calcResultBox');
  box.innerHTML = `
    <div class="calc-result">
      <div class="calc-result-hero">
        <div class="calc-result-label">Você chega em R$ 1 milhão em</div>
        <div class="calc-result-value pos">${reached ? calcMonthsLabel(m) : 'mais de 100 anos'}</div>
      </div>
      <div class="calc-result-rows">
        <div class="calc-result-row"><span class="lbl">Aporte mensal</span><span class="val">${calcBRL(monthly)}</span></div>
        <div class="calc-result-row"><span class="lbl">Total investido</span><span class="val">${calcBRL(invested)}</span></div>
        <div class="calc-result-row"><span class="lbl">Juros ganhos</span><span class="val" style="color:var(--pink)">${calcBRL(profit)}</span></div>
        <div class="calc-result-row"><span class="lbl">Montante final</span><span class="val">${calcBRL(total)}</span></div>
      </div>
      ${m > 0 ? `<div class="calc-chart-wrap">${calcRenderChart(series)}</div>
      <div class="calc-chart-legend">
        <span><span class="calc-legend-dot" style="background:#fbbf24"></span> Patrimônio</span>
        <span><span class="calc-legend-dot" style="background:#ec4899"></span> Investido</span>
      </div>
      <div class="calc-hint">${((profit / total) * 100).toFixed(1).replace('.', ',')}% do milhão virão dos juros — o resto é o que você aportou.</div>` : ''}
    </div>
  `;
};