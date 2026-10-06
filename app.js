/* ============================================================
   Repostería Mentor — Prototipo Hi-Fi · app.js
   SOLO navegación entre pantallas + toggles de presentación.
   Nada calcula de verdad.
   ============================================================ */
const stack = [];
const TAB_SCREENS = ['home', 'recetas', 'costeo', 'precios', 'mas'];

/* ---------- mapa de pantallas S1..S25 (contrato estable, ver PANTALLAS.md) ----------
   S1-S6 conservan el significado de la UI v1. Las nuevas se agregan AL FINAL,
   nunca se renumeran las existentes.
   S7 = saludo del mentor estilo v1 (foto + nombre dinámicos), va tras S2. */
const SCREENS = [
  ['onb-welcome','S1'], ['onb-mentor','S2'], ['onb-back','S3'],
  ['costeo','S4'], ['precios','S5'], ['convertidor','S6'],
  ['onb-hello','S7'], ['onb-pin','S8'], ['onb-disclaimer','S9'],
  ['onb-recovery','S10'], ['onb-question','S11'], ['home','S12'],
  ['recetas','S13'], ['receta-detalle','S14'], ['colab','S15'],
  ['tour','S16'], ['ajustes','S17'], ['mas','S18'], ['clientes','S19'], ['cliente-detalle','S20'],
  ['canjes','S21'], ['canje-detalle','S22'],
  ['ingredientes','S23'], ['ingrediente-detalle','S24'], ['lista-compras','S25'],
  ['recetas-biblio','S26'], ['receta-ficha','S27'],
  ['tarjetas','S28'], ['qr-pago','S29']
];
function sNum(id) { const f = SCREENS.find(s => s[0] === id); return f ? f[1] : ''; }

function currentId() {
  const el = document.querySelector('.screen.active');
  return el ? el.id.replace(/^s-/, '') : null;
}

function show(id) {
  document.querySelectorAll('.screen').forEach(s => {
    s.classList.remove('active', 'enter');
  });
  const el = document.getElementById('s-' + id);
  if (!el) return;
  el.classList.add('active');
  // reinicia la animación de entrada (cine solo en transición)
  void el.offsetWidth;
  el.classList.add('enter');
  el.scrollTop = 0;
  document.getElementById('tabbar').classList.toggle('show', TAB_SCREENS.includes(id));
  // tab activo
  document.querySelectorAll('#tabbar button').forEach(b =>
    b.classList.toggle('on', b.dataset.go === id));
  // selector del chrome
  const sel = document.getElementById('screenJump');
  if (sel) sel.value = id;
  // S8 (PIN): al entrar, mostrar siempre la pregunta, no el teclado
  if (id === 'onb-pin' && typeof pinAskShow === 'function') pinAskShow(true);
  // S3 (welcome back): al entrar, arte del mentor elegido + idioma actual
  if (id === 'onb-back' && typeof renderBack === 'function') renderBack();
  // botón S activo en el jump-row
  document.querySelectorAll('#jumpRow button[data-go]').forEach(b =>
    b.classList.toggle('on', b.dataset.go === id));
}

function go(id) {
  const cur = currentId();
  if (cur && cur !== id) stack.push(cur);
  show(id);
}

function back() {
  const prev = stack.pop();
  show(prev || 'home');
}

/* ---------- toast ---------- */
let toastTimer = null;
function toast(msgKey) {
  const el = document.getElementById('toast');
  el.textContent = t(msgKey);
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
}
function toastRound2() { toast('toast.r2'); }

/* ---- S28/S29 (v4 2026-10-03): selección de tarjeta, pestañas QR, demo QR ---- */
function pickCard(el) {
  el.parentElement.querySelectorAll('.tk-card').forEach(c => c.classList.remove('on'));
  el.classList.add('on');
}
function qrTab(el, paneId) {
  el.parentElement.querySelectorAll('.chip').forEach(c => c.classList.remove('on'));
  el.classList.add('on');
  document.querySelectorAll('.qr-pane').forEach(p => { p.hidden = (p.id !== paneId); });
}
function qrGen(boxId) {
  const b = document.getElementById(boxId);
  if (b) b.hidden = false;
}

/* ---------- idioma ---------- */
function setLang(l) {
  LANG = (l === 'en') ? 'en' : 'es';
  applyLang();
}

/* ---------- tema ---------- */
function setTheme(mode) {
  document.documentElement.dataset.theme = (mode === 'dark') ? 'dark' : 'light';
  document.querySelectorAll('#themeSeg button, .themeSegX button').forEach(b =>
    b.classList.toggle('on', b.dataset.theme === mode));
}

/* ---------- tamaño del texto · accesibilidad ---------- */
function setTextSize(size) {
  const s = (size === 'large' || size === 'xl') ? size : 'normal';
  document.documentElement.dataset.textsize = s;
  document.querySelectorAll('.textSegX button').forEach(b =>
    b.classList.toggle('on', b.dataset.textsize === s));
}

/* ---------- convertidor (demo funcional) ---------- */
const CONV_DEFAULT_QTY = 2;
function convCalc() {
  const per = parseFloat(document.getElementById('convIng').value) || 0;
  const qty = parseFloat(document.getElementById('convQty').value) || 0;
  document.getElementById('convOut').textContent = Math.round(per * qty) + ' g';
}

/* ---------- PIN pad (visual) ---------- */
let pinLen = 0;
function pinPress(d) {
  const dots = document.querySelectorAll('#pinDots i');
  if (d === 'del') {
    if (pinLen > 0) { pinLen--; dots[pinLen].classList.remove('fill'); }
    return;
  }
  if (pinLen >= 4) return;
  dots[pinLen].classList.add('fill');
  pinLen++;
  if (pinLen === 4) {
    setTimeout(() => { pinLen = 0; dots.forEach(x => x.classList.remove('fill')); go('onb-disclaimer'); }, 450);
  }
}

/* ---------- PIN opcional: pregunta → teclado ---------- */
function pinAskShow(choice) {
  document.getElementById('pinChoice').hidden = !choice;
  document.getElementById('pinPadWrap').hidden = choice;
  if (choice) {
    pinLen = 0;
    document.querySelectorAll('#pinDots i').forEach(x => x.classList.remove('fill'));
  }
}
function pinAskYes() { pinAskShow(false); }
function pinAskBack() { pinAskShow(true); }

/* ---------- selección de mentor ---------- */
function pickMentor(el) {
  document.querySelectorAll('.mentor-opt').forEach(o => o.classList.remove('sel'));
  el.classList.add('sel');
  document.getElementById('mentorPick').classList.add('has-sel');
  var cta = document.getElementById('mentorCta');
  if (cta) cta.removeAttribute('disabled');
}

/* ---------- S7: saludo del mentor (foto + nombre dinámicos) ---------- */
var helloMentor = { img: 'img/mentor-matt-hello.jpg', name: 'Matt' };
function goHello() {
  var sel = document.querySelector('#mentorPick .mentor-opt.sel img');
  var custom = document.getElementById('mentorNameInput');
  if (sel) {
    helloMentor.img = sel.getAttribute('src').replace('-solo.png', '-hello.jpg');
    var dflt = sel.getAttribute('alt') || 'Matt';
    var typed = custom ? custom.value.trim() : '';
    helloMentor.name = typed || dflt;
  }
  renderHello();
  go('onb-hello');
}
function renderHello() {
  var img = document.getElementById('helloImg');
  if (img) { img.setAttribute('src', helloMentor.img); img.setAttribute('alt', helloMentor.name); }
  var h = document.getElementById('helloTitle');
  if (h) h.textContent = t('onb.hello.title').replace('{name}', helloMentor.name);
}

/* ---------- S3: welcome back (arte según mentor + idioma) ---------- */
function renderBack() {
  var m = 'matt';
  var sel = document.querySelector('#mentorPick .mentor-opt.sel img');
  if (sel) {
    var alt = (sel.getAttribute('alt') || '').toLowerCase();
    m = (alt.indexOf('sofi') === 0) ? 'sofi' : 'matt';
  }
  var img = document.getElementById('backImg');
  var lang = LANG;
  if (img) {
    img.setAttribute('src', 'img/welcome-back-' + m + '-' + lang + '.jpg');
    img.setAttribute('alt', t('onb.back.alt'));
  }
  var art = document.getElementById('backArt');
  if (art) art.setAttribute('aria-label', t('onb.back.aria'));
}

/* ---------- pregunta secreta ---------- */
function pickQ(el, custom) {
  document.querySelectorAll('.q-opt').forEach(o => o.classList.remove('sel'));
  el.classList.add('sel');
  document.getElementById('qCustomWrap').style.display = custom ? 'block' : 'none';
}

/* ---------- escalado modo A/B (visual) ---------- */
function setMode(m, btn) {
  document.querySelectorAll('#modeSeg button').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  document.getElementById('modeA').style.display = (m === 'a') ? 'block' : 'none';
  document.getElementById('modeB').style.display = (m === 'b') ? 'block' : 'none';
}
/* selector genérico de segmento (ej. tipo de canje en S22) */
function segPick(btn) {
  btn.parentNode.querySelectorAll('button').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
}

/* ---------- backup: recordatorio + pop-up (diseño v4) ---------- */
let BFREQ = 'weekly';
try { BFREQ = localStorage.getItem('mentor_bfreq') || 'weekly'; } catch(e) {}
function setBfreq(v){
  BFREQ = v;
  try { localStorage.setItem('mentor_bfreq', v); } catch(e) {}
  const s = document.getElementById('bfreqSel'); if (s) s.value = v;
  toast('ajustes.bfreq.saved');
}
function openBpop(){
  const o = document.getElementById('bpopOvl');
  if (o) { o.classList.add('show'); o.setAttribute('aria-hidden','false'); }
}
function closeBpop(){
  const o = document.getElementById('bpopOvl');
  if (o) { o.classList.remove('show'); o.setAttribute('aria-hidden','true'); }
}
function bpopBackup(){ closeBpop(); toast('bpop.cta'); }
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeBpop(); });

/* ---------- recetas de la usuaria · S26b/S26c (funcional 2026-10-05) ----------
   Offline-first: todo vive en localStorage ('mentor_recipes_v1').
   Las pantallas nuevas NO entran al mapa SCREENS para no tocar el chrome
   de revisión (jumpRow/screenJump); go()/back() funcionan igual. */
const RKEY = 'mentor_recipes_v1';
function loadRecipes() {
  try { return JSON.parse(localStorage.getItem(RKEY)) || []; }
  catch (e) { return []; }
}
function saveRecipes(list) {
  try { localStorage.setItem(RKEY, JSON.stringify(list)); } catch (e) {}
}
function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}
function fmtMoney(n) {
  return '$' + (Math.round(n * 100) / 100).toFixed(2);
}
function recipeCost(r) {
  return r.ingredients.reduce(function (s, i) { return s + (parseFloat(i.cost) || 0); }, 0);
}
function recipeUnitSing(r) {
  if (r.cat === 'panes') return t('nr.unit.loaf');
  if (r.cat === 'tortas') return t('nr.unit.serv');
  return t('nr.unit.units');
}
var THUMBS = [
  ['#F7DDD2', '#E8B4A0', '#A85640'], ['#EAD9C9', '#C9A24B', '#7A5A1E'],
  ['#F7ECD4', '#EAD9AE', '#9A7420'], ['#D9C6CF', '#A68E9B', '#5B3A4E']
];
function thumbFor(id) {
  var h = 0;
  for (var i = 0; i < id.length; i++) h += id.charCodeAt(i);
  return THUMBS[h % THUMBS.length];
}

/* lista de recetas creadas → tarjetas en S26 (mismo markup que las demo) */
function renderUserRecipes() {
  var box = document.getElementById('userRecipes');
  if (!box) return;
  var list = loadRecipes();
  box.innerHTML = list.map(function (r) {
    var th = thumbFor(r.id);
    var total = recipeCost(r);
    var per = total / Math.max(1, r.yield);
    return '<div class="recipe-card" onclick="openRecipe(\'' + r.id + '\')">' +
      '<div class="recipe-thumb" style="background:linear-gradient(135deg,' + th[0] + ',' + th[1] + ')">' +
      '<svg width="40" height="40" style="color:' + th[2] + '"><use href="#i-cup"/></svg></div>' +
      '<div class="info"><b>' + esc(r.name) + '</b>' +
      '<span class="cat">' + esc(t('rb.chip.' + r.cat)) + ' &middot; ' + r.yield + ' ' + esc(t('nr.yield.lab')) + '</span>' +
      '<div class="nums"><span><span>' + esc(t('rb.costlab')) + '</span> <b class="num">' +
      fmtMoney(per) + ' / ' + esc(recipeUnitSing(r)) + '</b></span></div>' +
      '</div></div>';
  }).join('');
  nrSyncPlaceholders();
}

/* formulario: filas de ingredientes */
function nrAddIng() {
  var box = document.getElementById('nrIngs');
  if (!box) return;
  var row = document.createElement('div');
  row.className = 'ing-row';
  row.innerHTML =
    '<input type="text" class="ing-name">' +
    '<input type="number" class="ing-qty" min="0" step="any" inputmode="decimal">' +
    '<select class="ing-unit"><option>g</option><option>kg</option><option>ml</option>' +
    '<option>L</option><option>u</option><option>taza</option><option>cda</option><option>cdta</option></select>' +
    '<input type="number" class="ing-cost" min="0" step="any" inputmode="decimal">' +
    '<button class="ing-del" onclick="nrDelIng(this)" aria-label="' + esc(t('nr.ing.del')) + '">&times;</button>';
  box.appendChild(row);
  nrSyncPlaceholders();
  row.querySelector('.ing-name').focus();
}
function nrDelIng(btn) {
  var box = document.getElementById('nrIngs');
  if (box && box.children.length > 1) btn.closest('.ing-row').remove();
}
function nrEnsureRows() {
  var box = document.getElementById('nrIngs');
  if (box && !box.children.length) { nrAddIng(); nrAddIng(); }
}
function nrSyncPlaceholders() {
  document.querySelectorAll('#nrIngs .ing-row').forEach(function (row) {
    row.querySelector('.ing-name').placeholder = t('nr.ing.name');
    row.querySelector('.ing-qty').placeholder = t('nr.ing.qty');
    row.querySelector('.ing-cost').placeholder = t('nr.ing.cost');
  });
}
function nrPickCat(btn) {
  btn.parentElement.querySelectorAll('.chip').forEach(function (c) { c.classList.remove('on'); });
  btn.classList.add('on');
}
function nrReset() {
  document.getElementById('nrName').value = '';
  document.getElementById('nrYield').value = '12';
  document.getElementById('nrSteps').value = '';
  document.getElementById('nrNotes').value = '';
  var chips = document.querySelectorAll('#nrCats .chip');
  chips.forEach(function (c, i) { c.classList.toggle('on', i === 0); });
  var box = document.getElementById('nrIngs');
  if (box) { box.innerHTML = ''; nrEnsureRows(); }
}
function nrSave() {
  var name = document.getElementById('nrName').value.trim();
  if (!name) { toast('nr.err.name'); return; }
  var catBtn = document.querySelector('#nrCats .chip.on');
  var cat = catBtn ? catBtn.dataset.cat : 'tortas';
  var yld = Math.max(1, parseInt(document.getElementById('nrYield').value, 10) || 1);
  var ings = [];
  document.querySelectorAll('#nrIngs .ing-row').forEach(function (row) {
    var nm = row.querySelector('.ing-name').value.trim();
    if (!nm) return;
    ings.push({
      name: nm,
      qty: row.querySelector('.ing-qty').value.trim(),
      unit: row.querySelector('.ing-unit').value,
      cost: parseFloat(row.querySelector('.ing-cost').value) || 0
    });
  });
  if (!ings.length) { toast('nr.err.ing'); return; }
  var list = loadRecipes();
  list.unshift({
    id: 'r' + Date.now().toString(36),
    name: name, cat: cat, yield: yld, ingredients: ings,
    steps: document.getElementById('nrSteps').value.trim(),
    notes: document.getElementById('nrNotes').value.trim(),
    createdAt: Date.now()
  });
  saveRecipes(list);
  nrReset();
  renderUserRecipes();
  toast('nr.saved');
  go('recetas-biblio');
}

/* detalle de receta creada (S26c) */
var currentRecipeId = null;
function openRecipe(id) {
  currentRecipeId = id;
  renderRecipeDetail(id);
  go('receta-ver');
}
function renderRecipeDetail(id) {
  var r = loadRecipes().find(function (x) { return x.id === id; });
  if (!r) return;
  var body = document.getElementById('rvBody');
  if (!body) return;
  document.getElementById('rvTitle').textContent = r.name;
  var th = thumbFor(r.id);
  var total = recipeCost(r);
  var per = total / Math.max(1, r.yield);
  var unitS = recipeUnitSing(r);
  var d = new Date(r.createdAt).toLocaleDateString(LANG === 'en' ? 'en-US' : 'es-ES',
    { day: 'numeric', month: 'short', year: 'numeric' });
  var rows = r.ingredients.map(function (g) {
    var q = (g.qty ? esc(g.qty) + ' ' + esc(g.unit) : '—');
    return '<tr><td>' + esc(g.name) + '</td><td class="num">' + q + '</td><td class="num">' + fmtMoney(g.cost) + '</td></tr>';
  }).join('');
  var steps = r.steps.split('\n').map(function (s) { return s.trim(); }).filter(Boolean);
  var stepsHtml = steps.length
    ? steps.map(function (s, i) {
        return '<div class="step-row"><span class="step-n">' + (i + 1) + '</span><span>' + esc(s) + '</span></div>';
      }).join('')
    : '<p style="color:var(--faint);font-size:var(--t-small)">—</p>';
  var notesHtml = r.notes
    ? '<div class="card" style="padding:6px 16px"><p style="font-size:var(--t-body)">' + esc(r.notes).replace(/\n/g, '<br>') + '</p></div>'
    : '';
  body.innerHTML =
    '<div class="detail-hero">' +
      '<div class="ph-img" style="background:linear-gradient(135deg,' + th[0] + ',' + th[1] + ');display:flex;align-items:center;justify-content:center">' +
      '<svg width="86" height="86" style="color:' + th[2] + '"><use href="#i-cup"/></svg></div>' +
      '<div class="body"><h2>' + esc(r.name) + '</h2>' +
      '<div class="meta-row">' +
      '<span class="meta-pill"><svg width="14" height="14"><use href="#i-users"/></svg><span>' + r.yield + ' ' + esc(t('nr.yield.lab')) + '</span></span>' +
      '<span class="meta-pill"><svg width="14" height="14"><use href="#i-tag"/></svg><span>' + esc(t('rb.chip.' + r.cat)) + '</span></span>' +
      '</div>' +
      '<div class="stat-duo">' +
      '<div class="stat"><b class="num">' + fmtMoney(per) + '</b><span>' + esc(t('rv.cost.per')) + ' ' + esc(unitS) + '</span></div>' +
      '<div class="stat"><b class="num">' + fmtMoney(total) + '</b><span>' + esc(t('rv.cost.total')) + '</span></div>' +
      '</div>' +
      '<p style="font-size:var(--t-small);color:var(--faint);margin-top:8px">' + esc(t('rv.created')) + ' ' + esc(d) + '</p>' +
      '</div>' +
    '</div>' +
    '<div class="kicker">' + esc(t('rf.k.ing')) + '</div>' +
    '<div class="card" style="padding:8px 14px"><table class="cost">' +
    '<tr><th>' + esc(t('rf.th.ing')) + '</th><th>' + esc(t('rf.th.qty')) + '</th><th>' + esc(t('rf.th.cost')) + '</th></tr>' +
    rows +
    '<tr><td><b>' + esc(t('rf.total')) + '</b></td><td></td><td class="num"><b>' + fmtMoney(total) + '</b></td></tr>' +
    '</table></div>' +
    '<div class="kicker">' + esc(t('rf.k.steps')) + '</div>' +
    '<div class="card" style="padding:6px 16px">' + stepsHtml + '</div>' +
    (notesHtml ? '<div class="kicker">' + esc(t('rf.k.notes')) + '</div>' + notesHtml : '') +
    '<div class="btn-row"><button class="btn ghost" onclick="delRecipe()">' +
    '<svg width="16" height="16"><use href="#i-dots"/></svg><span>' + esc(t('rv.delete')) + '</span></button></div>' +
    '<div class="ver-tag">Mentor UI v4 (2026-10-03)</div>';
}
function delRecipe() {
  if (!currentRecipeId) return;
  if (!confirm(t('rv.confirm.del'))) return;
  saveRecipes(loadRecipes().filter(function (x) { return x.id !== currentRecipeId; }));
  currentRecipeId = null;
  renderUserRecipes();
  toast('rv.deleted');
  back();
}
document.addEventListener('DOMContentLoaded', function () {
  renderUserRecipes();
  nrEnsureRows();
});

/* ---------- init ---------- */
document.addEventListener('DOMContentLoaded', () => {
  applyLang();
  setTheme('light');
  const bfs = document.getElementById('bfreqSel'); if (bfs) bfs.value = BFREQ;
  setTextSize('normal');
  const sel = document.getElementById('screenJump');
  if (sel) sel.addEventListener('change', e => { stack.length = 0; show(e.target.value); });
  // construye el jump-row S1..S18 desde el mapa (fuente única de verdad)
  const jr = document.getElementById('jumpRow');
  if (jr) SCREENS.forEach(([id, sn]) => {
    const b = document.createElement('button');
    b.textContent = sn; b.dataset.go = id; b.title = id;
    b.addEventListener('click', () => { stack.length = 0; show(id); });
    jr.appendChild(b);
  });
  convCalc();
  show('onb-welcome');
});
