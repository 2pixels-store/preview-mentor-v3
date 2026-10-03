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
  ['ingredientes','S23'], ['ingrediente-detalle','S24'], ['lista-compras','S25']
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
