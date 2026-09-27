/* ============================================================
   Repostería Mentor — Prototipo Hi-Fi · app.js
   SOLO navegación entre pantallas + toggles de presentación.
   Nada calcula de verdad.
   ============================================================ */
const stack = [];
const TAB_SCREENS = ['home', 'recetas', 'costeo', 'precios', 'mas'];

/* ---------- mapa de pantallas S1..S18 (contrato estable, ver PANTALLAS.md) ----------
   S1-S6 conservan el significado de la UI v1. Las nuevas se agregan AL FINAL,
   nunca se renumeran las existentes. */
const SCREENS = [
  ['onb-welcome','S1'], ['onb-mentor','S2'], ['onb-back','S3'],
  ['costeo','S4'], ['precios','S5'], ['convertidor','S6'],
  ['onb-app','S7'], ['onb-pin','S8'], ['onb-disclaimer','S9'],
  ['onb-recovery','S10'], ['onb-question','S11'], ['home','S12'],
  ['recetas','S13'], ['receta-detalle','S14'], ['colab','S15'],
  ['tour','S16'], ['ajustes','S17'], ['mas','S18']
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

/* ---------- selección de mentor ---------- */
function pickMentor(el) {
  document.querySelectorAll('.mentor-opt').forEach(o => o.classList.remove('sel'));
  el.classList.add('sel');
  document.getElementById('mentorPick').classList.add('has-sel');
  var cta = document.getElementById('mentorCta');
  if (cta) cta.removeAttribute('disabled');
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

/* ---------- init ---------- */
document.addEventListener('DOMContentLoaded', () => {
  applyLang();
  setTheme('light');
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
  show('onb-app');
});
