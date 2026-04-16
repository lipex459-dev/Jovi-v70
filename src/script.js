// ── CLOCK ──
function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2,'0');
  const m = String(now.getMinutes()).padStart(2,'0');
  document.getElementById('clock').textContent = h + ':' + m;
}
updateClock();
setInterval(updateClock, 10000);

// ── NAVIGATION ──
let currentScreen = 's-home';
let currentNav = 'nav-home';
const history = [];

function goTo(screenId) {
  if (screenId === currentScreen) return;
  const prev = document.getElementById(currentScreen);
  const next = document.getElementById(screenId);
  prev.classList.add('slide-out');
  next.classList.add('active');
  setTimeout(() => prev.classList.remove('active','slide-out'), 380);
  history.push(currentScreen);
  currentScreen = screenId;

  // sync nav
  const navMap = { 's-home':'nav-home','s-cam':'nav-cam','s-resumo':'nav-resumo','s-inet':'nav-inet','s-config':'nav-config' };
  if (navMap[screenId]) setActiveNav(navMap[screenId]);
}

function goBack() {
  if (history.length === 0) return;
  const prev = history.pop();
  const curr = document.getElementById(currentScreen);
  const target = document.getElementById(prev);
  curr.classList.remove('active');
  target.classList.add('active');
  currentScreen = prev;
  const navMap = { 's-home':'nav-home','s-cam':'nav-cam','s-resumo':'nav-resumo','s-inet':'nav-inet','s-config':'nav-config' };
  if (navMap[prev]) setActiveNav(navMap[prev]);
}

function setActiveNav(navId) {
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('on'));
  document.getElementById(navId).classList.add('on');
  currentNav = navId;
}

function navTo(screenId, navId) {
  history.length = 0; // clear history on nav tap
  const prev = document.getElementById(currentScreen);
  const next = document.getElementById(screenId);
  if (prev === next) return;
  prev.classList.remove('active');
  next.classList.add('active');
  currentScreen = screenId;
  setActiveNav(navId);
  // hide badge on resumo
  if (screenId === 's-resumo') document.getElementById('badge-resumo').classList.remove('show');
}

// ── MODE TOGGLE ──
let modeOn = false;
let modeSeconds = 0;
let modeTimer = null;

function toggleMode() {
  modeOn = !modeOn;
  const toggle = document.getElementById('main-toggle');
  const modeText = document.getElementById('mode-text');
  const focusRing = document.getElementById('focus-ring');

  toggle.classList.toggle('on', modeOn);
  modeText.textContent = modeOn ? 'Ativado' : 'Desativado';
  modeText.classList.toggle('on', modeOn);
  focusRing.classList.toggle('on', modeOn);

  if (modeOn) {
    modeSeconds = 0;
    modeTimer = setInterval(() => {
      modeSeconds++;
      const h = Math.floor(modeSeconds / 3600);
      const m = Math.floor((modeSeconds % 3600) / 60);
      const s = modeSeconds % 60;
      let display = '';
      if (h > 0) display = h + 'h ' + m + 'm';
      else if (m > 0) display = m + 'm ' + s + 's';
      else display = s + 's';
      document.getElementById('stat-time').textContent = display;
    }, 1000);
    showNotif('Modo Estudo ativado! 🎓');
  } else {
    clearInterval(modeTimer);
    document.getElementById('stat-time').textContent = '0h';
    showNotif('Modo Estudo desativado');
  }
}

// ── CAMERA / SHOOT ──
function shootPhoto() {
  const overlay = document.getElementById('ai-overlay');
  const shutter = document.getElementById('shutter-inner');
  // flash
  shutter.style.background = '#fff';
  shutter.style.boxShadow = '0 0 30px rgba(255,255,255,0.8)';
  setTimeout(() => {
    shutter.style.background = '';
    shutter.style.boxShadow = '';
  }, 150);
  // show ai processing
  overlay.classList.add('show');
  // after 2.5s go to resumo
  setTimeout(() => {
    overlay.classList.remove('show');
    document.getElementById('badge-resumo').classList.add('show');
    goTo('s-resumo');
    showNotif('Resumo gerado com sucesso! ✨');
  }, 2500);
}

// ── DYNAMIC ISLAND NOTIFICATIONS ──
let notifTimeout;
const diIcons = {
  'estudo': '🎓', 'desativado': '✋', 'resumo': '✨',
  'salvo': '💾', 'flash': '⚡', 'padr': '🔔'
};
function showNotif(msg, icon) {
  const island = document.getElementById('di-island');
  const textEl  = document.getElementById('di-text');
  const iconEl  = document.getElementById('di-icon');
  // pick icon automatically if not given
  if (!icon) {
    const key = Object.keys(diIcons).find(k => msg.toLowerCase().includes(k));
    icon = key ? diIcons[key] : '🔔';
  }
  iconEl.textContent = icon;
  textEl.textContent = msg;
  island.classList.remove('di-hide');
  island.classList.add('di-show');
  clearTimeout(notifTimeout);
  notifTimeout = setTimeout(() => {
    island.classList.remove('di-show');
    island.classList.add('di-hide');
  }, 3400);
}
function hideNotif() {
  const island = document.getElementById('di-island');
  island.classList.remove('di-show');
  island.classList.add('di-hide');
}

// ── SLIDER ──
function updateSlider(val) {
  const h = Math.floor(val / 60);
  const m = val % 60;
  document.getElementById('slider-val').textContent = m === 0 ? h + 'h' : h + 'h ' + m + 'm';
}

// ── CONFIG TOGGLE ──
function toggleCR(el) {
  el.classList.toggle('on');
  const ball = el.querySelector('.toggle-ball');
  ball.style.transform = el.classList.contains('on') ? 'translateX(20px)' : 'translateX(0)';
}

// ── IDIOMA DO RESUMO ──
let selectedLang = { code: 'PT-BR', name: 'Português Brasileiro' };

function openLangModal() {
  document.getElementById('lang-overlay').classList.add('show');
  document.getElementById('lang-sheet').classList.add('show');
  // highlight current
  document.querySelectorAll('.lang-item').forEach(el => {
    const isSelected = el.dataset.code === selectedLang.code;
    el.classList.toggle('lang-item-active', isSelected);
    el.querySelector('.lang-check').textContent = isSelected ? '✓' : '';
  });
}

function closeLangModal() {
  document.getElementById('lang-overlay').classList.remove('show');
  document.getElementById('lang-sheet').classList.remove('show');
}

function selectLang(el) {
  // remove previous
  document.querySelectorAll('.lang-item').forEach(i => {
    i.classList.remove('lang-item-active');
    i.querySelector('.lang-check').textContent = '';
  });
  // set new
  el.classList.add('lang-item-active');
  el.querySelector('.lang-check').textContent = '✓';
  selectedLang = { code: el.dataset.code, name: el.dataset.name };
  // update config row display immediately
  document.getElementById('lang-val').textContent = selectedLang.code;
  document.getElementById('lang-desc').textContent = selectedLang.name;
  // small haptic-like flash
  el.style.transition = 'background 0.1s';
}

// ── DYNAMIC GREETING ──
(function() {
  const h = new Date().getHours();
  const greet = h < 12 ? 'Bom dia 👋' : h < 18 ? 'Boa tarde 👋' : 'Boa noite 👋';
  const el = document.querySelector('.home-greeting');
  if (el) el.textContent = greet;
})();

// ── TOPIC DETAILS ──
document.body.addEventListener('click', (e) => {
  const topicoItem = e.target.closest('.topico-item');
  if (topicoItem) {
    const nameEl = topicoItem.querySelector('.topico-name');
    const iconEl = topicoItem.querySelector('.topico-icon');
    if (nameEl && iconEl) {
      const title = nameEl.textContent;
      const iconStr = iconEl.textContent;
      const colorStr = iconEl.style.color;
      const bgStr = iconEl.style.background;
      
      const topicTitle = document.getElementById('topic-title');
      const topicIcon = document.getElementById('topic-icon');
      const topicDot = document.getElementById('topic-resumo-dot');
      
      if (topicTitle) topicTitle.textContent = title;
      if (topicIcon) {
        topicIcon.textContent = iconStr;
        topicIcon.style.color = colorStr || 'var(--text)';
        topicIcon.style.background = bgStr || 'rgba(255,255,255,0.05)';
      }
      if (topicDot) {
        topicDot.style.background = colorStr || 'var(--accent)';
      }
      
      goTo('s-topico');
    }
  }
});

// ── DATA: FLASHCARDS & EXAMS ──
const flashcardsData = [
  { q: "O que diz a 1ª Lei de Newton (Inércia)?", a: "Um corpo em repouso permanece em repouso e em movimento permanece em movimento, a menos que uma força atue sobre ele." },
  { q: "Qual a fórmula da 2ª Lei de Newton?", a: "Força Resultante = massa × aceleração\n(F = m · a)" },
  { q: "O que diz a 3ª Lei de Newton (Ação e Reação)?", a: "Para toda força de ação, existe uma força de reação com a mesma intensidade, mesma direção, mas sentidos opostos." },
  { q: "O que é Trabalho (T) na Física?", a: "É a energia transferida para um corpo por aplicar uma força ao longo de um deslocamento. T = F · d" },
  { q: "Qual a unidade de medida padrão da Força no SI?", a: "Newton (N)" },
  { q: "O que caracteriza um Movimento Retilíneo Uniforme (MRU)?", a: "É um movimento em linha reta onde a velocidade é sempre constante e a aceleração é zero." }
];

const examData = [
  {
    q: "Qual é a fórmula fundamental da 2ª Lei de Newton?",
    opts: ["E = mc²", "F = m · a", "V = v0 + at", "P = m · g"],
    ans: 1
  },
  {
    q: "Se a força resultante de um corpo em movimento é zero, o que ocorrerá com ele?",
    opts: ["Ele vai acelerar rapidamente", "Ele vai parar imediatamente", "Manterá sempre velocidade vetorial constante", "Aumentará o seu peso"],
    ans: 2
  },
  {
    q: "Qual é a unidade correta para medir a energia ou Trabalho no Sistema Internacional?",
    opts: ["Watts", "Newtons", "Joules", "Metros/Segundo"],
    ans: 2
  },
  {
    q: "A força de atrito (cinético) sempre atuará em qual direção/sentido em relação ao corpo da superfície?",
    opts: ["Na mesma direção e sentido do vetor velocidade", "Na mesma direção e sentido oposto à tendência de movimento", "Perpendicular ao movimento", "Para baixo, na direção da gravidade"],
    ans: 1
  },
  {
    q: "A inércia observada de qualquer corpo no universo está fisicamente ligada a qual destas grandezas?",
    opts: ["Apenas à sua Velocidade", "Somente à Aceleração atual", "Ao Volume do corpo exato", "Geralmente associada à sua Massa (Inercial)"],
    ans: 3
  }
];

// ── FLASHCARDS LOGIC ──
let fcCurrent = 1;
const fcTotal = flashcardsData.length;

function startFlashcards() {
  fcCurrent = 1;
  updateFlashcardUI();
  goTo('s-flashcards');
}

function updateFlashcardUI() {
  document.getElementById('fc-progress').textContent = `Cartão ${fcCurrent} de ${fcTotal}`;
  document.getElementById('active-flashcard').classList.remove('flipped');
  
  const currentCard = flashcardsData[fcCurrent - 1];
  document.getElementById('fc-q').textContent = currentCard.q;
  document.getElementById('fc-a').textContent = currentCard.a;
}

function flipCard() {
  const card = document.getElementById('active-flashcard');
  if (!card.classList.contains('flipped')) {
    card.classList.add('flipped');
  }
}

function nextCard(event, isCorrect) {
  event.stopPropagation(); // prevent flip toggle
  if (fcCurrent >= fcTotal) {
    return;
  }
  exCurrent++;
  updateExamUI();
}
