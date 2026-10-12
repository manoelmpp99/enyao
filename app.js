/* ============================================================
   CHAVE DA API BRAPI — já embutida (troque quando regenerar)
   ============================================================ */
const DEFAULT_API_KEY = 'n2jSRHKNBe1nYrLza56x6n';

const KEY='enyao-v02';
const baseCatalog=[
['MXRF11','Maxi Renda','FII'],['HGLG11','CSHG Logística','FII'],['VISC11','Vinci Shopping Centers','FII'],['XPML11','XP Malls','FII'],['KNRI11','Kinea Renda Imobiliária','FII'],['GARE11','Guardian Real Estate','FII'],['TRXF11','TRX Real Estate','FII'],['RECR11','FII REC Recebíveis Imobiliários','FII'],['LIFE11','Life Capital Partners','FII'],['XPCA11','XP Crédito Agrícola','FII'],['FGAA11','FG Agro','FII'],['AAZQ11','AZ Quest Sole','FII'],['IRIM11','Iridium Recebíveis Imobiliários','FII'],['KNCR11','Kinea Crédito Imobiliário','FII'],['KNIP11','Kinea Índices de Preços','FII'],['HGRU11','CSHG Renda Urbana','FII'],['XPLG11','XP Log','FII'],['BRCO11','Bresco Logística','FII'],['BTLG11','BTG Logística','FII'],['VILG11','Vinci Logística','FII'],['JSRE11','JS Real Estate','FII'],['RBRF11','RBR Alpha','FII'],['CPTS11','Capitânia Securities','FII'],['DEVA11','Devant Recebíveis','FII'],
['ITSA4','Itaúsa PN','Ação'],['ITUB4','Itaú Unibanco PN','Ação'],['PETR4','Petrobras PN','Ação'],['PETR3','Petrobras ON','Ação'],['VALE3','Vale ON','Ação'],['BBAS3','Banco do Brasil ON','Ação'],['WEGE3','WEG ON','Ação'],['BBDC4','Bradesco PN','Ação'],['BBDC3','Bradesco ON','Ação'],['ABEV3','Ambev ON','Ação'],['B3SA3','B3 ON','Ação'],['EGIE3','Engie Brasil ON','Ação'],['TAEE11','Taesa units','Ação'],['OPCT3','OceanPact ON','Ação'],['MGLU3','Magazine Luiza ON','Ação'],['LREN3','Lojas Renner ON','Ação'],['RENT3','Localiza ON','Ação'],['SUZB3','Suzano ON','Ação'],['PRIO3','PetroRio ON','Ação'],['RADL3','Raia Drogasil ON','Ação'],['RAIL3','Rumo ON','Ação'],['CSAN3','Cosan ON','Ação'],['ELET3','Eletrobras ON','Ação'],['ELET6','Eletrobras PNB','Ação'],['CMIG4','Cemig PN','Ação'],['SANB11','Santander units','Ação'],['BBSE3','BB Seguridade ON','Ação'],['CXSE3','Caixa Seguridade ON','Ação'],['VIVT3','Telefônica Brasil ON','Ação'],['TIMS3','TIM ON','Ação'],['NTCO3','Natura ON','Ação'],['HAPV3','Hapvida ON','Ação'],['RDOR3','Rede DOr ON','Ação'],['FLRY3','Fleury ON','Ação'],['CCRO3','CCR ON','Ação'],['SBSP3','Sabesp ON','Ação'],['CPLE6','Copel PNB','Ação'],['EQTL3','Equatorial ON','Ação'],['UGPA3','Ultrapar ON','Ação'],['CSNA3','CSN ON','Ação'],['GGBR4','Gerdau PN','Ação'],['GOAU4','Metalúrgica Gerdau PN','Ação'],['USIM5','Usiminas PNA','Ação'],['CYRE3','Cyrela ON','Ação'],['MRVE3','MRV ON','Ação'],['EZTC3','EZTec ON','Ação'],['DIRR3','Direcional ON','Ação'],['TEND3','Tenda ON','Ação'],['ALPA4','Alpargatas PN','Ação'],
['IVVB11','iShares S&P 500','ETF'],['BOVA11','iShares Ibovespa','ETF'],['SMAL11','iShares Small Cap','ETF'],['DIVO11','It Now IDIV','ETF'],['LFTS11','Investo Tesouro Selic','ETF'],['NDIV11','Nu ETF Dividendos','ETF'],['XINA11','Trend China','ETF'],['HASH11','Hashdex Nasdaq Crypto','ETF'],['QBTC11','QR Bitcoin','ETF'],['GOLD11','Trend Ouro','ETF'],['FIXA11','Trend FIXA','ETF'],
['CDB','CDB bancário','Renda fixa'],['TESOURO SELIC','Tesouro Selic','Renda fixa'],['TESOURO IPCA','Tesouro IPCA+','Renda fixa'],['TESOURO PREFIXADO','Tesouro Prefixado','Renda fixa'],['LCI','Letra de Crédito Imobiliário','Renda fixa'],['LCA','Letra de Crédito do Agronegócio','Renda fixa'],['CRI','Certificado de Recebíveis Imobiliários','Renda fixa'],['CRA','Certificado de Recebíveis do Agronegócio','Renda fixa'],['DEBENTURE','Debênture','Renda fixa']
].map(([ticker,name,type])=>({ticker,name,type,custom:false}));

let state={catalog:[],trades:[],dividends:[],prices:{},apiKey:DEFAULT_API_KEY,lastUpdated:null,autoRefresh:0,lastSource:''};
try{
  const raw=localStorage.getItem(KEY);
  const s=raw?JSON.parse(raw):null;
  if(s&&typeof s==='object'){
    if(Array.isArray(s.catalog))state.catalog=s.catalog;
    if(Array.isArray(s.trades))state.trades=s.trades;
    if(Array.isArray(s.dividends))state.dividends=s.dividends;
    if(s.prices&&typeof s.prices==='object')state.prices=s.prices;
    if(s.apiKey)state.apiKey=s.apiKey;
    if(s.lastUpdated)state.lastUpdated=s.lastUpdated;
    if(typeof s.autoRefresh==='number')state.autoRefresh=s.autoRefresh;
    if(s.lastSource)state.lastSource=s.lastSource;
  }
}catch(e){console.warn('Erro lendo estado',e)}

const catalog=()=>[...baseCatalog,...state.catalog];
const brl=n=>Number(n||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const pct=n=>{const v=Number(n||0);return (v>=0?'+':'')+v.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2})+'%'};
const num=n=>Number(n||0);
const today=()=>new Date().toLocaleDateString('en-CA');
const $=id=>document.getElementById(id);
function save(){localStorage.setItem(KEY,JSON.stringify(state));render()}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}

function ensureTickerInCatalog(ticker){
  if(!ticker)return;
  if(catalog().some(a=>a.ticker===ticker))return;
  state.catalog.push({ticker,name:ticker,type:'Outro',custom:true});
}

function positions(){
  let m={};
  for(const t of state.trades){
    let p=m[t.ticker]||(m[t.ticker]={ticker:t.ticker,qty:0,cost:0,realized:0});
    if(t.side==='buy'){p.cost+=t.qty*t.price+t.fees;p.qty+=t.qty}
    else{
      let avg=p.qty?p.cost/p.qty:0;
      let sold=Math.min(t.qty,p.qty);
      p.realized+=(t.price*sold-t.fees)-(avg*sold);
      p.cost-=avg*sold;p.qty-=sold;
      if(p.qty<1e-8){p.qty=0;p.cost=0}
    }
  }
  const cutoff=new Date(Date.now()-365*24*60*60*1000).toISOString().slice(0,10);
  return Object.values(m).filter(p=>p.qty>1e-8).map(p=>{
    const c=catalog().find(x=>x.ticker===p.ticker);
    p.avg=p.qty?p.cost/p.qty:0;
    p.current=num(state.prices[p.ticker]??p.avg);
    p.market=p.qty*p.current;
    p.unrealized=p.market-p.cost;
    p.unrealizedPct=p.cost>0?(p.unrealized/p.cost)*100:0;
    p.name=c?.name||p.ticker;
    p.type=c?.type||'Outro';
    let div12m=0;
    for(const d of state.dividends){
      if(d.ticker===p.ticker&&d.date>=cutoff)div12m+=num(d.amount);
    }
    p.div12m=div12m;
    p.yoc=p.cost>0?(div12m/p.cost)*100:0;
    return p;
  });
}

function timeAgo(iso){
  if(!iso)return '';
  const diff=Math.floor((Date.now()-new Date(iso).getTime())/1000);
  if(diff<60)return 'agora mesmo';
  if(diff<3600)return `há ${Math.floor(diff/60)} min`;
  if(diff<86400)return `há ${Math.floor(diff/3600)} h`;
  return `há ${Math.floor(diff/86400)} dias`;
}

function computeDividendTotals(){
  const now=new Date();
  const ym=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
  const y=String(now.getFullYear());
  let month=0,year=0;
  for(const d of state.dividends){
    const a=num(d.amount);
    if((d.date||'').startsWith(ym))month+=a;
    if((d.date||'').startsWith(y))year+=a;
  }
  return {month,year};
}

function render(){
  const ps=positions();
  const total=ps.reduce((s,p)=>s+p.market,0);
  const totalCost=ps.reduce((s,p)=>s+p.cost,0);
  const profit=ps.reduce((s,p)=>s+p.unrealized,0);
  const totalPct=totalCost>0?(profit/totalCost)*100:0;

  $('total').textContent=brl(total);
  const badge=$('totalPct');
  badge.textContent=pct(totalPct);
  badge.className='hero-badge '+(totalPct>=0?'pos':'neg');
  $('count').textContent=ps.length;
  $('updatedAt').textContent=state.lastUpdated?('Cotações '+timeAgo(state.lastUpdated)+(state.lastSource?' · '+state.lastSource:'')):'';
  const pel=$('profit');
  pel.textContent=(profit>0?'+':'')+brl(profit);
  pel.style.color=profit<0?'#ffd0dd':'#d5f7ff';

  const dt=computeDividendTotals();
  $('divMonth').textContent=brl(dt.month);
  $('divYear').textContent=brl(dt.year);

  $('assets').innerHTML=ps.length?ps.map(p=>{
    const pos=p.unrealized>=0;
    const yocText=p.div12m>0?pct(p.yoc):'—';
    return `<div class="asset">
      <div class="assetTop">
        <div>
          <div class="ticker">${esc(p.ticker)} <span class="pill">${esc(p.type)}</span></div>
          <div class="small">${esc(p.name)} · ${p.qty.toLocaleString('pt-BR')} un.</div>
        </div>
        <div class="right">
          <strong>${brl(p.market)}</strong>
          <div class="small">Atual ${brl(p.current)}</div>
        </div>
      </div>
      <div class="sub-grid">
        <div><div class="sub-label">Preço médio</div><div class="sub-value">${brl(p.avg)}</div></div>
        <div><div class="sub-label">Rentabilidade</div><div class="sub-value" style="color:${pos?'var(--success)':'var(--danger)'}">${pct(p.unrealizedPct)}</div></div>
        <div><div class="sub-label">Resultado</div><div class="sub-value" style="color:${pos?'var(--success)':'var(--danger)'}">${pos?'+':''}${brl(p.unrealized)}</div></div>
        <div><div class="sub-label">Proventos 12m</div><div class="sub-value" style="color:var(--cyan)">${p.div12m>0?brl(p.div12m):'—'}</div></div>
      </div>
      <div class="yoc-line"><span>YOC 12m (sobre preço médio)</span><b>${yocText}</b></div>
      <div class="actions">
        <button type="button" class="ghost-sm" onclick="updatePrice('${esc(p.ticker)}')">Editar preço</button>
        <button type="button" class="ghost-sm" onclick="showTrade('${esc(p.ticker)}')">Operar</button>
        <button type="button" class="ghost-sm" onclick="showProvento('${esc(p.ticker)}')">Provento</button>
      </div>
    </div>`;
  }).join(''):'<div class="empty">Nenhuma posição ainda.<br>Toque em <b>Operação</b> para registrar a primeira compra.</div>';

  renderTradeHistory();
  renderDivHistory();
  $('apiKeyInput').value=(state.apiKey&&state.apiKey!==DEFAULT_API_KEY)?state.apiKey:'';
  $('autoRefreshSelect').value=String(state.autoRefresh||0);
}

function renderTradeHistory(){
  const history=state.trades.slice().reverse().slice(0,20);
  $('tradeHistory').innerHTML=history.length?history.map(t=>`
    <div class="asset"><div class="assetTop">
      <div><strong>${t.side==='buy'?'Compra':'Venda'} · ${esc(t.ticker)}</strong>
      <div class="small">${esc(t.date)} · ${t.qty} un. a ${brl(t.price)}</div></div>
      <strong>${brl(t.qty*t.price+t.fees)}</strong>
    </div></div>`).join(''):'<div class="empty">Nenhuma operação registrada.</div>';
}

function renderDivHistory(){
  const list=[...state.dividends].sort((a,b)=>(b.date||'').localeCompare(a.date||''));
  if(!list.length){$('divHistory').innerHTML='<div class="empty">Nenhum provento registrado ainda.</div>';return}
  const groups={};
  for(const d of list){const k=(d.date||'').slice(0,7);if(!groups[k])groups[k]=[];groups[k].push(d)}
  const mn=['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
  const html=Object.keys(groups).sort().reverse().map(k=>{
    const [y,m]=k.split('-');
    const label=`${mn[Number(m)-1]} ${y}`;
    const items=groups[k];
    const total=items.reduce((s,d)=>s+num(d.amount),0);
    return `<div class="month-group">
      <div class="month-label"><span>${label}</span><span class="month-total">${brl(total)}</span></div>
      ${items.map(d=>`<div class="div-card"><div class="div-row">
        <div><strong>${esc(d.ticker)}</strong>
        <span class="div-type" style="margin-left:6px">${esc(d.kind||'Dividendo')}</span>
        <div class="div-meta">${esc(d.date)}</div></div>
        <div style="text-align:right"><div class="div-amount">${brl(d.amount)}</div>
        <button type="button" class="delete-btn" onclick="deleteDividend(${d.id})">excluir</button></div>
      </div></div>`).join('')}
    </div>`;
  }).join('');
  $('divHistory').innerHTML=html;
}

function choose(a,autoAdd){
  if(autoAdd)ensureTickerInCatalog(a.ticker);
  $('chosenTicker').value=a.ticker;
  $('assetSearch').value=a.ticker+' — '+a.name;
  $('selectedTicker').textContent=a.ticker;
  $('selectedName').textContent=a.name;
  $('selectedType').textContent='Categoria: '+a.type;
  $('selectedBox').classList.remove('hidden');
  $('suggestions').classList.add('hidden');
}

function chooseDiv(a,autoAdd){
  if(autoAdd)ensureTickerInCatalog(a.ticker);
  $('divChosenTicker').value=a.ticker;
  $('divTickerSearch').value=a.ticker+' — '+a.name;
  $('divSelectedTicker').textContent=a.ticker;
  $('divSelectedName').textContent=a.name;
  $('divSelectedBox').classList.remove('hidden');
  $('divSuggestions').classList.add('hidden');
}

window.showTab=function(id){
  document.querySelectorAll('.tabs button').forEach(x=>x.classList.toggle('active',x.dataset.tab===id));
  ['portfolio','trade','dividends','backup'].forEach(t=>{
    const el=$(t);if(el)el.classList.toggle('hidden',t!==id);
  });
  window.scrollTo({top:0,behavior:'smooth'});
};
window.updatePrice=function(ticker){
  const p=positions().find(x=>x.ticker===ticker);
  const v=prompt('Preço manual de '+ticker+' (R$):',String(p?.current||''));
  if(v===null)return;
  const n=Number(v.replace(',','.'));
  if(!Number.isFinite(n)||n<=0){alert('Informe um preço maior que zero.');return}
  state.prices[ticker]=n;save();
};
window.showTrade=function(ticker){
  window.showTab('trade');
  const a=catalog().find(x=>x.ticker===ticker)||{ticker,name:ticker,type:'Outro'};
  choose(a,false);
};
window.showProvento=function(ticker){
  window.showTab('dividends');
  $('divFormBox').classList.remove('hidden');
  const a=catalog().find(x=>x.ticker===ticker)||{ticker,name:ticker,type:'Outro'};
  chooseDiv(a,false);
};
window.deleteDividend=function(id){
  if(!confirm('Excluir este provento?'))return;
  state.dividends=state.dividends.filter(d=>d.id!==id);
  save();
};

async function fetchPriceFromBrapi(ticker){
  if(!state.apiKey)return null;
  try{
    const url='https://brapi.dev/api/quote/'+encodeURIComponent(ticker)+'?token='+encodeURIComponent(state.apiKey);
    const r=await fetch(url,{headers:{'Accept':'application/json'}});
    if(!r.ok)return null;
    const j=await r.json();
    const p=j?.results?.[0]?.regularMarketPrice;
    return (typeof p==='number'&&p>0)?p:null;
  }catch(e){return null}
}

async function fetchPriceFromYahoo(ticker){
  try{
    const url='https://query1.finance.yahoo.com/v8/finance/chart/'+encodeURIComponent(ticker)+'.SA?interval=1d&range=1d';
    const r=await fetch(url,{headers:{'Accept':'application/json'}});
    if(!r.ok)return null;
    const j=await r.json();
    const p=j?.chart?.result?.[0]?.meta?.regularMarketPrice;
    return (typeof p==='number'&&p>0)?p:null;
  }catch(e){return null}
}

async function fetchPrice(ticker){
  let p=await fetchPriceFromBrapi(ticker);
  if(p!==null)return {price:p,source:'brapi'};
  p=await fetchPriceFromYahoo(ticker);
  if(p!==null)return {price:p,source:'Yahoo'};
  return null;
}

async function refreshQuotes(){
  const btn=$('refreshBtn');
  const ps=positions();
  if(!ps.length){alert('Sem posições para atualizar.');return}
  const rf=['CDB','LCI','LCA','CRI','CRA','DEBENTURE','TESOURO SELIC','TESOURO IPCA','TESOURO PREFIXADO'];
  const tickers=ps.map(p=>p.ticker).filter(t=>!rf.includes(t));
  if(!tickers.length){alert('Só há renda fixa. Use "Editar preço" em cada ativo.');return}
  btn.disabled=true;
  btn.innerHTML='<span class="spinner"></span>Buscando cotações…';
  let updated=0,failed=[],sourceUsed='';
  for(const tk of tickers){
    const r=await fetchPrice(tk);
    if(r&&r.price>0){state.prices[tk]=r.price;updated++;sourceUsed=r.source}
    else failed.push(tk);
  }
  if(updated){state.lastUpdated=new Date().toISOString();state.lastSource=sourceUsed}
  save();
  btn.disabled=false;
  btn.innerHTML='🔄 Atualizar cotações agora';
  if(updated&&!failed.length)alert(`✅ ${updated} cotação(ões) atualizada(s)\nFonte: ${sourceUsed}`);
  else if(updated&&failed.length)alert(`✅ ${updated} atualizada(s) (fonte: ${sourceUsed})\n⚠️ Não encontrei: ${failed.join(', ')}`);
  else alert(`❌ Nenhuma cotação encontrada.\nVerifique os tickers: ${failed.join(', ')}`);
}

/* ---------- Eventos ---------- */
$('refreshBtn').addEventListener('click',refreshQuotes);

$('assetSearch').addEventListener('input',e=>{
  const raw=e.target.value.trim();
  const q=raw.toLowerCase();
  const matches=catalog().filter(a=>(a.ticker+' '+a.name).toLowerCase().includes(q)).slice(0,10);
  const box=$('suggestions');
  let html='';
  const upper=raw.toUpperCase().replace(/[^A-Z0-9]/g,'');
  const exact=matches.some(a=>a.ticker===upper);
  if(upper&&!exact&&upper.length>=3){
    html+=`<button type="button" class="suggestion new" data-new="1"><span><strong>+ Usar "${esc(upper)}"</strong><br><small style="color:var(--muted)">Ticker novo — salvo automaticamente</small></span><span class="pill pill-new">Novo</span></button>`;
  }
  html+=matches.map((a,i)=>`<button type="button" class="suggestion" data-index="${i}"><span><strong>${esc(a.ticker)}</strong><br><small style="color:var(--muted)">${esc(a.name)}</small></span><span class="pill">${esc(a.type)}</span></button>`).join('');
  box.innerHTML=html;
  box.classList.toggle('hidden',!q&&!upper);
  const nb=box.querySelector('button[data-new]');
  if(nb)nb.addEventListener('click',()=>choose({ticker:upper,name:upper,type:'Outro'},true));
  box.querySelectorAll('button[data-index]').forEach(b=>b.addEventListener('click',()=>choose(matches[Number(b.dataset.index)],false)));
  $('chosenTicker').value='';
  $('selectedBox').classList.add('hidden');
});

$('tradeDate').value=today();

$('tradeForm').addEventListener('submit',e=>{
  e.preventDefault();
  let ticker=$('chosenTicker').value;
  if(!ticker){
    const raw=$('assetSearch').value.trim().toUpperCase().replace(/[^A-Z0-9]/g,'');
    if(raw&&raw.length>=3)ticker=raw;
  }
  const side=$('operation').value,
        qty=num($('tradeQty').value),
        price=num($('tradePrice').value),
        fees=num($('fees').value);
  if(!ticker||qty<=0||price<=0){alert('Escolha um ativo e informe quantidade e preço válidos.');return}
  const p=positions().find(x=>x.ticker===ticker);
  if(side==='sell'&&(!p||qty>p.qty+1e-8)){alert('Quantidade maior que a posição disponível.');return}
  ensureTickerInCatalog(ticker);
  state.trades.push({ticker,side,qty,price,fees,date:$('tradeDate').value||today()});
  if(state.prices[ticker]===undefined)state.prices[ticker]=price;
  save();e.target.reset();
  $('tradeDate').value=today();
  $('assetSearch').value='';
  $('chosenTicker').value='';
  $('selectedBox').classList.add('hidden');
  window.showTab('portfolio');
});

$('toggleDivForm').addEventListener('click',()=>{
  const box=$('divFormBox');
  box.classList.toggle('hidden');
  if(!box.classList.contains('hidden'))$('divDate').value=today();
});
$('divDate').value=today();

$('divTickerSearch').addEventListener('input',e=>{
  const raw=e.target.value.trim();
  const q=raw.toLowerCase();
  const matches=catalog().filter(a=>(a.ticker+' '+a.name).toLowerCase().includes(q)).slice(0,10);
  const box=$('divSuggestions');
  let html='';
  const upper=raw.toUpperCase().replace(/[^A-Z0-9]/g,'');
  const exact=matches.some(a=>a.ticker===upper);
  if(upper&&!exact&&upper.length>=3){
    html+=`<button type="button" class="suggestion new" data-new="1"><span><strong>+ Usar "${esc(upper)}"</strong><br><small style="color:var(--muted)">Ticker novo — salvo automaticamente</small></span><span class="pill pill-new">Novo</span></button>`;
  }
  html+=matches.map((a,i)=>`<button type="button" class="suggestion" data-index="${i}"><span><strong>${esc(a.ticker)}</strong><br><small style="color:var(--muted)">${esc(a.name)}</small></span><span class="pill pill-div">${esc(a.type)}</span></button>`).join('');
  box.innerHTML=html;
  box.classList.toggle('hidden',!q&&!upper);
  const nb=box.querySelector('button[data-new]');
  if(nb)nb.addEventListener('click',()=>chooseDiv({ticker:upper,name:upper,type:'Outro'},true));
  box.querySelectorAll('button[data-index]').forEach(b=>b.addEventListener('click',()=>chooseDiv(matches[Number(b.dataset.index)],false)));
  $('divChosenTicker').value='';
  $('divSelectedBox').classList.add('hidden');
});

$('divForm').addEventListener('submit',e=>{
  e.preventDefault();
  let ticker=$('divChosenTicker').value;
  if(!ticker){
    const raw=$('divTickerSearch').value.trim().toUpperCase().replace(/[^A-Z0-9]/g,'');
    if(raw&&raw.length>=3)ticker=raw;
  }
  const amount=num($('divAmount').value),
        date=$('divDate').value||today(),
        kind=$('divKind').value;
  if(!ticker||amount<=0){alert('Escolha um ativo e informe um valor válido.');return}
  ensureTickerInCatalog(ticker);
  state.dividends.push({id:Date.now()+Math.floor(Math.random()*1000),ticker,amount,date,kind});
  save();e.target.reset();
  $('divChosenTicker').value='';
  $('divTickerSearch').value='';
  $('divSelectedBox').classList.add('hidden');
  $('divDate').value=today();
  $('divFormBox').classList.add('hidden');
});

$('saveApiKey').addEventListener('click',()=>{
  const k=$('apiKeyInput').value.trim();
  if(!k){alert('Cole uma chave válida.');return}
  state.apiKey=k;save();alert('Chave pessoal salva.');
});

$('removeApiKey').addEventListener('click',()=>{
  if(confirm('Voltar para a chave padrão do app?')){
    state.apiKey=DEFAULT_API_KEY;save();alert('Usando a chave padrão do app.');
  }
});

$('autoRefreshSelect').addEventListener('change',e=>{
  state.autoRefresh=Number(e.target.value);save();setupAutoRefresh();
});

let autoRefreshTimer=null;
function setupAutoRefresh(){
  if(autoRefreshTimer){clearInterval(autoRefreshTimer);autoRefreshTimer=null}
  const min=Number(state.autoRefresh||0);
  if(min>0){
    autoRefreshTimer=setInterval(()=>{
      if(document.visibilityState==='visible')refreshQuotes().catch(()=>{});
    },min*60*1000);
  }
}

$('exportBtn').addEventListener('click',()=>{
  const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});
  const u=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=u;a.download='enyao-backup.json';a.click();URL.revokeObjectURL(u);
});

$('importFile').addEventListener('change',async e=>{
  const f=e.target.files[0];if(!f)return;
  try{
    const d=JSON.parse(await f.text());
    if(d.trades&&Array.isArray(d.trades)){
      const keepApi=state.apiKey;
      if(Array.isArray(d.catalog))state.catalog=d.catalog;
      if(Array.isArray(d.trades))state.trades=d.trades;
      if(Array.isArray(d.dividends))state.dividends=d.dividends;
      if(d.prices&&typeof d.prices==='object')state.prices=d.prices;
      if(d.lastUpdated)state.lastUpdated=d.lastUpdated;
      state.apiKey=d.apiKey||keepApi;
      save();alert('Backup importado.');
    }else alert('Formato não reconhecido.');
  }catch(err){alert('Não foi possível ler esse arquivo JSON.')}
  e.target.value='';
});

$('diagBtn').addEventListener('click',()=>{
  try{
    const raw=localStorage.getItem(KEY)||'(vazio)';
    const parsed=raw!=='(vazio)'?JSON.parse(raw):null;
    const summary=parsed
      ? `Operações: ${(parsed.trades||[]).length}\nProventos: ${(parsed.dividends||[]).length}\nCatálogo pessoal: ${(parsed.catalog||[]).length}\nPreços salvos: ${Object.keys(parsed.prices||{}).length}`
      : '(sem dados)';
    alert('📦 Dados no aparelho:\n\n'+summary+'\n\nTamanho total: '+raw.length+' caracteres');
  }catch(e){alert('Erro ao ler dados: '+e.message)}
});

$('clearBtn').addEventListener('click',()=>{
  if(confirm('Apagar carteira, operações, proventos e catálogo pessoal deste aparelho?')){
    state={catalog:[],trades:[],dividends:[],prices:{},apiKey:DEFAULT_API_KEY,lastUpdated:null,autoRefresh:0,lastSource:''};
    save();
  }
});

render();
setupAutoRefresh();

if('serviceWorker' in navigator){
  window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
}