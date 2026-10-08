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
      '<span class="cat">' + esc(catLabel(r.cat)) + ' &middot; ' + r.yield + ' ' + esc(t('nr.yield.lab')) + '</span>' +
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
  nrRenderCats();
  var box = document.getElementById('nrIngs');
  if (box) { box.innerHTML = ''; nrEnsureRows(); }
}
function nrSave() {
  var name = document.getElementById('nrName').value.trim();
  if (!name) { toast('nr.err.name'); return; }
  var catBtn = document.querySelector('#nrCats .chip.on');
  var cat = catBtn ? catBtn.dataset.cat : nrSelCat();
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

/* ---------- categorías de la usuaria (funcional 2026-10-05) ----------
   Offline-first: viven en localStorage ('mentor_categories_v1') como array
   de nombres tal cual los escribió la usuaria. Las 4 por defecto se resuelven
   por i18n (rb.chip.*); las de usuaria se muestran tal cual. */
var CKEY = 'mentor_categories_v1';
var DEFCATS = ['tortas', 'cupcakes', 'galletas', 'panes'];
function loadCats() {
  try { var l = JSON.parse(localStorage.getItem(CKEY)); return Array.isArray(l) ? l : []; }
  catch (e) { return []; }
}
function saveCats(list) {
  try { localStorage.setItem(CKEY, JSON.stringify(list)); } catch (e) {}
}
function catLabel(cat) {
  if (DEFCATS.indexOf(cat) !== -1) return t('rb.chip.' + cat);
  return cat;
}
function addCategory(name) {
  name = String(name == null ? '' : name).trim().replace(/\s+/g, ' ');
  if (!name) return { error: 'cat.err.empty' };
  var low = name.toLowerCase();
  var taken = DEFCATS.some(function (k) {
    return k === low || String(t('rb.chip.' + k)).toLowerCase() === low;
  });
  var list = loadCats();
  if (taken || list.some(function (c) { return String(c).toLowerCase() === low; })) {
    return { error: 'cat.err.dup' };
  }
  list.push(name);
  saveCats(list);
  renderUserCats();
  return { name: name };
}
/* categoría seleccionada en el formulario */
function nrSelCat() {
  var b = document.querySelector('#nrCats .chip.on');
  return b ? b.dataset.cat : 'tortas';
}
/* render de chips del formulario: por defecto + usuaria + "+ Nueva" */
function nrRenderCats(sel) {
  var box = document.getElementById('nrCats');
  if (!box) return;
  if (!sel) sel = 'tortas';
  var html = DEFCATS.map(function (k) {
    return '<button type="button" class="chip' + (sel === k ? ' on' : '') +
      '" data-cat="' + k + '" onclick="nrPickCat(this)">' + esc(t('rb.chip.' + k)) + '</button>';
  }).join('');
  html += loadCats().map(function (c) {
    return '<button type="button" class="chip' + (sel === c ? ' on' : '') +
      '" data-cat="' + esc(c) + '" data-custom="1" onclick="nrPickCat(this)">' + esc(c) + '</button>';
  }).join('');
  html += '<button type="button" class="chip add" onclick="nrNewCatInline(this)">' + esc(t('nr.cat.new')) + '</button>';
  box.innerHTML = html;
}
/* "+ Nueva" dentro del formulario: el chip se vuelve input, Enter guarda */
function nrNewCatInline(btn) {
  var cur = nrSelCat();
  var input = document.createElement('input');
  input.type = 'text';
  input.id = 'nrCatInput';
  input.className = 'chip-edit';
  input.maxLength = 30;
  input.placeholder = t('cat.form.ph');
  input.setAttribute('aria-label', t('cat.form.ph'));
  btn.replaceWith(input);
  input.focus();
  var done = false;
  function commit() {
    if (done) return;
    done = true;
    var v = input.value;
    if (v.trim()) {
      var r = addCategory(v);
      if (r.error) { toast(r.error); nrRenderCats(cur); return; }
      nrRenderCats(r.name);
      toast('cat.saved');
    } else {
      nrRenderCats(cur);
    }
  }
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { e.preventDefault(); commit(); }
    else if (e.key === 'Escape') { done = true; nrRenderCats(cur); }
  });
  input.addEventListener('blur', commit);
}
/* pinta las categorías de usuaria en S13, S26 y el formulario */
function renderUserCats() {
  var cats = loadCats();
  var s13 = document.getElementById('s13Cats');
  if (s13) {
    s13.querySelectorAll('.chip.user').forEach(function (c) { c.remove(); });
    var addBtn = document.getElementById('s13NewCat');
    cats.forEach(function (c) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'chip user';
      b.textContent = c;
      s13.insertBefore(b, addBtn);
    });
  }
  var bib = document.getElementById('bibCats');
  if (bib) {
    bib.querySelectorAll('.chip.user').forEach(function (c) { c.remove(); });
    cats.forEach(function (c) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'chip user';
      b.textContent = c;
      bib.appendChild(b);
    });
  }
  var box = document.getElementById('nrCats');
  if (box) {
    var on = box.querySelector('.chip.on');
    nrRenderCats(on ? on.dataset.cat : null);
  }
}
/* S13: receta de ejemplo opcional (primer uso) — no toca los datos de la usuaria */
var SAMPLE_KEY = 'mentor_sample_v1';
function s13SampleOn() {
  try { return localStorage.getItem(SAMPLE_KEY) === '1'; } catch (e) { return false; }
}
function s13SampleRender() {
  var on = s13SampleOn();
  var w = document.getElementById('s13SampleWrap');
  var e = document.getElementById('s13Empty');
  if (w) { if (on) w.removeAttribute('hidden'); else w.setAttribute('hidden', ''); }
  if (e) { if (on) e.setAttribute('hidden', ''); else e.removeAttribute('hidden'); }
}
function s13SampleShow() {
  try { localStorage.setItem(SAMPLE_KEY, '1'); } catch (e) {}
  s13SampleRender();
}
function s13SampleHide() {
  try { localStorage.removeItem(SAMPLE_KEY); } catch (e) {}
  s13SampleRender();
}
/* S13: mini-formulario inline para nueva categoría */
function s13CatToggle() {
  var f = document.getElementById('s13CatForm');
  if (!f) return;
  var show = f.hasAttribute('hidden');
  if (show) {
    f.removeAttribute('hidden');
    var inp = document.getElementById('s13CatInput');
    inp.value = '';
    setTimeout(function () { inp.focus(); }, 50);
  } else {
    f.setAttribute('hidden', '');
  }
}
function s13CatSave() {
  var inp = document.getElementById('s13CatInput');
  var r = addCategory(inp ? inp.value : '');
  if (r.error) { toast(r.error); return; }
  inp.value = '';
  document.getElementById('s13CatForm').setAttribute('hidden', '');
  toast('cat.saved');
}
function s13CatCancel() {
  var f = document.getElementById('s13CatForm');
  var inp = document.getElementById('s13CatInput');
  if (inp) inp.value = '';
  if (f) f.setAttribute('hidden', '');
}

/* detalle de receta creada (S26c) */
var currentRecipeId = null;
function openRecipe(id) {
  currentRecipeId = id;
  renderRecipeDetail(id);
  go('receta-ver');
}
function rvPhotoHtml(r) {
  if (r.photo) {
    return '<img src="' + r.photo + '" alt="" style="width:100%;border-radius:12px;display:block">' +
      '<span>' + esc(t('rv.photo.cap')) + '</span>' +
      '<button class="btn soft sm" onclick="rvPhotoPick()">' +
      '<svg width="15" height="15"><use href="#i-plus"/></svg><span>' + esc(t('rf.photo.add')) + '</span></button>';
  }
  return '<svg width="34" height="34" style="opacity:.55"><use href="#i-cup"/></svg>' +
    '<span>' + esc(t('rv.photo.cap')) + '</span>' +
    '<button class="btn soft sm" onclick="rvPhotoPick()">' +
    '<svg width="15" height="15"><use href="#i-plus"/></svg><span>' + esc(t('rf.photo.add')) + '</span></button>';
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
      '<span class="meta-pill"><svg width="14" height="14"><use href="#i-tag"/></svg><span>' + esc(catLabel(r.cat)) + '</span></span>' +
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
    '<div class="kicker">' + esc(t('rv.scale.k')) + '</div>' +
    '<div class="card"><div class="field"><span class="lbl">' + esc(t('rv.scale.lab')) + '</span>' +
    '<input type="number" id="rvScalePortions" value="' + r.yield + '" min="1" oninput="rvScaleCalc()"></div>' +
    '<div id="rvScaleOut"></div></div>' +
    '<div class="kicker">' + esc(t('rv.photo.k')) + '</div>' +
    '<div class="photo-slot" id="rvPhotoSlot">' + rvPhotoHtml(r) + '</div>' +
    '<input type="file" id="rvPhotoInput" accept="image/*" hidden onchange="rvPhotoChange(this)">' +
    '<div class="btn-row">' +
    '<button class="btn ghost" onclick="rvPrintCard()"><svg width="16" height="16"><use href="#i-print"/></svg><span>' + esc(t('rf.act.card')) + '</span></button>' +
    '<button class="btn ghost" onclick="rvShare()"><svg width="16" height="16"><use href="#i-link"/></svg><span>' + esc(t('rf.act.share')) + '</span></button>' +
    '</div>' +
    '<div class="btn-row"><button class="btn ghost" onclick="delRecipe()">' +
    '<svg width="16" height="16"><use href="#i-dots"/></svg><span>' + esc(t('rv.delete')) + '</span></button></div>' +
    '<div class="ver-tag">' + esc(t('version.tag')) + '</div>';
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
  if (typeof renderFichaPhoto === 'function') renderFichaPhoto();
  renderUserCats();
  s13SampleRender();
  nrEnsureRows();
});


/* ============================================================
   v5 (2026-10-07) · Quitar muros: acciones reales en el camino
   de la repostera (detalle demo, ficha demo, costeo, precios,
   y vista real de receta de usuaria s-receta-ver).
   ============================================================ */

/* ---------- datos demo para escalado (Torta de vainilla, base 12 porciones) ---------- */
const DEMO_BASE_YIELD = 12;
const DEMO_INGS = [
  { name: 'Harina', qty: 500, unit: 'g' },
  { name: 'Azúcar', qty: 400, unit: 'g' },
  { name: 'Mantequilla', qty: 250, unit: 'g' },
  { name: 'Huevos', qty: 4, unit: 'u' },
  { name: 'Leche', qty: 200, unit: 'ml' },
  { name: 'Vainilla', qty: 10, unit: 'ml' },
  { name: 'Polvo de hornear', qty: 15, unit: 'g' }
];
function fmtQty(qty, unit) {
  var q = qty, u = unit;
  if (unit === 'g' && qty >= 1000) { q = qty / 1000; u = 'kg'; }
  if (unit === 'ml' && qty >= 1000) { q = qty / 1000; u = 'L'; }
  q = Math.round(q * 10) / 10;
  return q + ' ' + u;
}
function demoWeight(f) {
  var g = 0;
  DEMO_INGS.forEach(function (it) {
    g += (it.unit === 'u' ? it.qty * 50 : it.qty) * f;
  });
  return g >= 1000 ? (Math.round(g / 100) / 10) + ' kg' : Math.round(g) + ' g';
}

/* ---------- escalado demo s-receta-detalle · Modo A (por porciones) ---------- */
function demoScaleCalc() {
  var target = parseFloat(document.getElementById('demoPortions').value);
  if (!(target > 0)) target = DEMO_BASE_YIELD;
  var f = target / DEMO_BASE_YIELD;
  var fr = Math.round(f * 10) / 10;
  document.getElementById('demoScaleFactor').textContent = '×' + fr + ' · ' + t('sc.times');
  document.getElementById('demoScaleBig').textContent = target + ' ' + t('sc.serv') + ' ≈ ' + demoWeight(f);
  document.getElementById('demoScaleNote').textContent = DEMO_INGS.slice(0, 3).map(function (g) {
    return g.name + ' ' + fmtQty(g.qty, g.unit) + ' → ' + fmtQty(g.qty * f, g.unit);
  }).join(' · ');
}
function demoScaleFocus() {
  var inp = document.getElementById('demoPortions');
  if (!inp) return;
  inp.scrollIntoView({ behavior: 'smooth', block: 'center' });
  setTimeout(function () { try { inp.focus({ preventScroll: true }); inp.select(); } catch (e) {} }, 350);
}

/* ---------- escalado demo · Modo B (por ingrediente disponible) ---------- */
function demoScaleBCalc() {
  var sel = document.getElementById('demoIngSel');
  var opt = sel.options[sel.selectedIndex];
  var base = parseFloat(opt.getAttribute('data-base')) || 500;
  var name = opt.textContent.trim();
  var raw = (document.getElementById('demoIngQty').value || '').trim().toLowerCase().replace(',', '.');
  var m = raw.match(/([\d.]+)\s*(lbra|lb|kg|oz|g)?/);
  var grams = 0;
  if (m) {
    var v = parseFloat(m[1]) || 0, u = m[2] || 'g';
    grams = v * (u === 'kg' ? 1000 : (u === 'lb' || u === 'lbra') ? 453.6 : u === 'oz' ? 28.35 : 1);
  }
  var perPortion = base / DEMO_BASE_YIELD;
  var portions = perPortion > 0 ? Math.floor(grams / perPortion) : 0;
  var batches = base > 0 ? Math.round((grams / base) * 10) / 10 : 0;
  document.getElementById('demoScaleBBig').textContent = '≈ ' + portions + ' ' + t('sc.serv');
  document.getElementById('demoScaleBNote').textContent =
    t('sc.bnote1') + ' ' + raw + ' ' + t('sc.bnote2') + ' ' + name +
    ' (' + Math.round(grams) + ' g) ' + t('sc.bnote3') + ' ' + batches + ' ' + t('sc.bnote4');
}

/* ---------- costeo: cajones expandibles ---------- */
function toggleCostDetail(id, btn) {
  var el = document.getElementById(id);
  if (!el) return;
  var open = el.hidden;
  el.hidden = !open;
  btn.textContent = open ? '−' : '+';
  btn.setAttribute('aria-expanded', open ? 'true' : 'false');
}

/* ---------- precios: calculadora con margen (demo) ---------- */
var PRICE_BASE_COST = 19.48;
function priceCalc() {
  var m = parseFloat(document.getElementById('priceMargin').value);
  if (isNaN(m)) m = 40;
  var calc = m >= 100 ? PRICE_BASE_COST : PRICE_BASE_COST / (1 - m / 100);
  var psy = Math.floor(calc) - 0.01;
  if (psy < PRICE_BASE_COST) psy = Math.ceil(calc * 100) / 100;
  var profit = psy - PRICE_BASE_COST;
  document.getElementById('priceMarginVal').textContent = m + '%';
  document.getElementById('priceCalcVal').textContent = fmtMoney(calc);
  document.getElementById('pricePsyVal').textContent = fmtMoney(psy);
  document.getElementById('priceProfitVal').textContent = fmtMoney(profit);
  document.getElementById('priceHeroVal').textContent = fmtMoney(psy);
}

/* ---------- tarjeta imprimible ---------- */
function printCard(title, sub, bodyHtml) {
  var area = document.getElementById('printArea');
  if (!area) {
    area = document.createElement('div');
    area.id = 'printArea';
    document.body.appendChild(area);
  }
  area.innerHTML = '<div class="print-card"><div class="print-brand">' + esc(t('print.brand')) + '</div>' +
    '<h1>' + esc(title) + '</h1><p class="print-sub">' + esc(sub) + '</p>' + bodyHtml + '</div>';
  document.body.classList.add('printing');
  window.print();
}
window.addEventListener('afterprint', function () { document.body.classList.remove('printing'); });

function demoCardRows() {
  return '<table class="cost">' + DEMO_INGS.map(function (g) {
    return '<tr><td>' + esc(g.name) + '</td><td class="num">' + fmtQty(g.qty, g.unit) + '</td></tr>';
  }).join('') + '</table>';
}
function demoPrintCard() {
  printCard(t('rec.c1.t'), DEMO_BASE_YIELD + ' ' + t('sc.serv'), demoCardRows());
}

/* ---------- compartir ---------- */
function shareText(title, text) {
  var full = title + '\n' + text;
  if (navigator.share) {
    navigator.share({ title: title, text: text }).catch(function () {});
  } else if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(full).then(function () { toast('share.copied'); },
      function () { toast('share.copied'); });
  } else {
    window.prompt(t('share.copytitle'), full);
  }
}
function demoShare() {
  var lines = DEMO_INGS.map(function (g) { return '• ' + g.name + ': ' + fmtQty(g.qty, g.unit); });
  shareText(t('rec.c1.t'), t('sc.serv') + ': ' + DEMO_BASE_YIELD + '\n' + lines.join('\n'));
}

/* ---------- foto: leer y reducir antes de guardar ---------- */
function readAndShrink(file, cb) {
  var rd = new FileReader();
  rd.onload = function (e) {
    var img = new Image();
    img.onload = function () {
      var s = Math.min(1, 800 / Math.max(img.width, img.height));
      var c = document.createElement('canvas');
      c.width = Math.max(1, Math.round(img.width * s));
      c.height = Math.max(1, Math.round(img.height * s));
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      cb(c.toDataURL('image/jpeg', 0.82));
    };
    img.src = e.target.result;
  };
  rd.readAsDataURL(file);
}

/* ---------- ficha demo (s-receta-ficha): foto ---------- */
function fichaPhotoPick() { var i = document.getElementById('fichaPhotoInput'); if (i) i.click(); }
function fichaPhotoChange(input) {
  var f = input.files && input.files[0];
  if (!f) return;
  readAndShrink(f, function (url) {
    try { localStorage.setItem('mentor_demo_ficha_photo', url); } catch (e) {}
    renderFichaPhoto();
    toast('rv.photo.saved');
  });
}
function renderFichaPhoto() {
  var slot = document.getElementById('fichaPhotoSlot');
  if (!slot) return;
  var url = null;
  try { url = localStorage.getItem('mentor_demo_ficha_photo'); } catch (e) {}
  if (url) {
    slot.innerHTML = '<img src="' + url + '" alt="" style="width:100%;border-radius:12px;display:block">' +
      '<span>' + esc(t('rf.photo.cap')) + '</span>' +
      '<button class="btn soft sm" onclick="fichaPhotoPick()">' +
      '<svg width="15" height="15"><use href="#i-plus"/></svg><span>' + esc(t('rf.photo.add')) + '</span></button>';
  }
}

/* ---------- ficha demo: escalado ---------- */
function fichaScaleToggle() {
  var box = document.getElementById('fichaScaleBox');
  if (!box) return;
  box.hidden = !box.hidden;
  if (!box.hidden) {
    fichaScaleCalc();
    box.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}
function fichaScaleCalc() {
  var target = parseFloat(document.getElementById('fichaPortions').value);
  if (!(target > 0)) target = DEMO_BASE_YIELD;
  var f = target / DEMO_BASE_YIELD;
  var rows = DEMO_INGS.map(function (g) {
    return '<tr><td>' + esc(g.name) + '</td><td class="num">' + fmtQty(g.qty * f, g.unit) + '</td></tr>';
  }).join('');
  document.getElementById('fichaScaleOut').innerHTML =
    '<p class="num" style="font-weight:700;margin:0 0 8px">×' + (Math.round(f * 10) / 10) + ' · ' + esc(t('sc.times')) + '</p>' +
    '<table class="cost">' + rows + '</table>';
}

/* ---------- vista real de receta (s-receta-ver): foto ---------- */
function rvPhotoPick() { var i = document.getElementById('rvPhotoInput'); if (i) i.click(); }
function rvPhotoChange(input) {
  var f = input.files && input.files[0];
  if (!f || !currentRecipeId) return;
  readAndShrink(f, function (url) {
    var list = loadRecipes();
    var r = list.find(function (x) { return x.id === currentRecipeId; });
    if (r) {
      r.photo = url;
      saveRecipes(list);
      renderRecipeDetail(currentRecipeId);
      toast('rv.photo.saved');
    }
  });
}

/* ---------- vista real: escalado ---------- */
function rvScaleCalc() {
  var list = loadRecipes();
  var r = list.find(function (x) { return x.id === currentRecipeId; });
  var out = document.getElementById('rvScaleOut');
  if (!r || !out) return;
  var target = parseFloat(document.getElementById('rvScalePortions').value);
  if (!(target > 0)) target = r.yield;
  var f = target / Math.max(1, r.yield);
  var rows = r.ingredients.map(function (g) {
    var qn = parseFloat(g.qty);
    var q = isNaN(qn) ? esc(g.qty || '—') + (g.unit ? ' ' + esc(g.unit) : '')
                      : fmtQty(qn * f, g.unit || '');
    var c = isNaN(qn) ? fmtMoney(g.cost) : fmtMoney((parseFloat(g.cost) || 0) * f);
    return '<tr><td>' + esc(g.name) + '</td><td class="num">' + q + '</td><td class="num">' + c + '</td></tr>';
  }).join('');
  out.innerHTML = '<p class="num" style="font-weight:700;margin:0 0 8px">×' + (Math.round(f * 10) / 10) +
    ' · ' + esc(t('sc.times')) + '</p>' +
    '<table class="cost"><tr><th>' + esc(t('rf.th.ing')) + '</th><th>' + esc(t('rf.th.qty')) +
    '</th><th>' + esc(t('rf.th.cost')) + '</th></tr>' + rows + '</table>';
}

/* ---------- vista real: tarjeta y compartir ---------- */
function rvPrintCard() {
  var r = loadRecipes().find(function (x) { return x.id === currentRecipeId; });
  if (!r) return;
  var rows = r.ingredients.map(function (g) {
    return '<tr><td>' + esc(g.name) + '</td><td class="num">' + esc(g.qty || '') + ' ' + esc(g.unit || '') + '</td></tr>';
  }).join('');
  var steps = (r.steps || '').split('\n').map(function (s) { return s.trim(); }).filter(Boolean)
    .map(function (s, i) { return '<p><b>' + (i + 1) + '.</b> ' + esc(s) + '</p>'; }).join('');
  printCard(r.name, r.yield + ' ' + t('sc.serv') + ' · ' + fmtMoney(recipeCost(r)),
    '<table class="cost">' + rows + '</table>' + steps);
}
function rvShare() {
  var r = loadRecipes().find(function (x) { return x.id === currentRecipeId; });
  if (!r) return;
  var lines = r.ingredients.map(function (g) { return '• ' + g.name + ': ' + (g.qty || '') + ' ' + (g.unit || ''); });
  shareText(r.name, t('sc.serv') + ': ' + r.yield + '\n' + lines.join('\n'));
}

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
