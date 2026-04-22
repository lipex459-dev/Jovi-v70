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
let currentTopicName = '';

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
      
      currentTopicName = title;
      
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

// ── DATA: FLASHCARDS POR TÓPICO ──
const flashcardsByTopic = {
  "Leis de Newton": [
    { q: "O que diz a 1ª Lei de Newton (Inércia)?", a: "Um corpo em repouso permanece em repouso e em movimento permanece em movimento, a menos que uma força atue sobre ele." },
    { q: "Qual a fórmula da 2ª Lei de Newton?", a: "Força Resultante = massa × aceleração\n(F = m · a)" },
    { q: "O que diz a 3ª Lei de Newton (Ação e Reação)?", a: "Para toda força de ação, existe uma força de reação com a mesma intensidade, mesma direção, mas sentidos opostos." },
    { q: "O que é Trabalho (T) na Física?", a: "É a energia transferida para um corpo por aplicar uma força ao longo de um deslocamento. T = F · d" },
    { q: "Qual a unidade de medida padrão da Força no SI?", a: "Newton (N)" },
    { q: "O que caracteriza um Movimento Retilíneo Uniforme (MRU)?", a: "É um movimento em linha reta onde a velocidade é sempre constante e a aceleração é zero." }
  ],
  "Eletromagnetismo": [
    { q: "O que é um campo elétrico?", a: "É a região ao redor de uma carga elétrica onde outra carga sofre a influência de uma força elétrica." },
    { q: "Qual a fórmula da Lei de Coulomb?", a: "F = k · (q₁ · q₂) / d²\nOnde k é a constante eletrostática, q são as cargas e d a distância." },
    { q: "O que é um campo magnético?", a: "É a região ao redor de um ímã ou corrente elétrica onde forças magnéticas podem ser observadas." },
    { q: "O que diz a Lei de Faraday?", a: "A variação do fluxo magnético através de uma espira gera uma força eletromotriz (fem) induzida." },
    { q: "Qual a unidade de carga elétrica no SI?", a: "Coulomb (C)" },
    { q: "O que é corrente elétrica?", a: "É o fluxo ordenado de cargas elétricas (geralmente elétrons) através de um condutor. Unidade: Ampère (A)." }
  ],
  "Termodinâmica": [
    { q: "O que é temperatura?", a: "É a medida da agitação térmica (energia cinética média) das moléculas de um corpo." },
    { q: "Qual a diferença entre calor e temperatura?", a: "Calor é a energia térmica em trânsito entre corpos com temperaturas diferentes. Temperatura é a medida da agitação molecular." },
    { q: "O que diz a 1ª Lei da Termodinâmica?", a: "A energia interna de um sistema varia conforme o calor recebido e o trabalho realizado: ΔU = Q - W" },
    { q: "O que diz a 2ª Lei da Termodinâmica?", a: "É impossível construir uma máquina térmica que converta todo calor em trabalho. A entropia de um sistema isolado tende a aumentar." },
    { q: "O que é entropia?", a: "É a medida da desordem ou aleatoriedade de um sistema termodinâmico. Em processos naturais, a entropia tende a aumentar." },
    { q: "Quais são as escalas termométricas mais usadas?", a: "Celsius (°C), Fahrenheit (°F) e Kelvin (K). A relação é: K = °C + 273,15" }
  ],
  "Ondulatória": [
    { q: "O que é uma onda?", a: "É uma perturbação que se propaga transportando energia sem transportar matéria." },
    { q: "Qual a diferença entre onda transversal e longitudinal?", a: "Na transversal, a vibração é perpendicular à propagação (ex.: luz). Na longitudinal, a vibração é paralela à propagação (ex.: som)." },
    { q: "O que é frequência de uma onda?", a: "É o número de oscilações completas por segundo. Unidade: Hertz (Hz)." },
    { q: "Qual a relação entre velocidade, frequência e comprimento de onda?", a: "v = λ · f (velocidade = comprimento de onda × frequência)" },
    { q: "O que é o efeito Doppler?", a: "É a variação aparente da frequência de uma onda quando há movimento relativo entre a fonte emissora e o observador." },
    { q: "O que é ressonância?", a: "Ocorre quando um corpo é submetido a vibrações na sua frequência natural, causando aumento significativo na amplitude." }
  ]
};

// ── DATA: EXAMES POR TÓPICO ──
const examsByTopic = {
  "Leis de Newton": [
    {
      q: "Qual é a fórmula fundamental da 2ª Lei de Newton?",
      opts: ["E = mc²", "F = m · a", "V = v0 + at", "P = m · g"],
      ans: 1
    },
    {
      q: "Se a força resultante sobre um corpo é zero, o que acontece com ele?",
      opts: ["Ele acelera rapidamente", "Ele para imediatamente", "Mantém velocidade constante (MRU)", "Aumenta de peso"],
      ans: 2
    },
    {
      q: "A 3ª Lei de Newton (Ação e Reação) afirma que as forças de ação e reação:",
      opts: ["Atuam no mesmo corpo", "Têm intensidades diferentes", "Atuam em corpos diferentes e sentidos opostos", "Se anulam mutuamente"],
      ans: 2
    },
    {
      q: "A inércia de um corpo está diretamente ligada a qual grandeza?",
      opts: ["Velocidade", "Aceleração", "Volume", "Massa"],
      ans: 3
    },
    {
      q: "Qual a unidade de Força no Sistema Internacional (SI)?",
      opts: ["Joule (J)", "Newton (N)", "Watt (W)", "Pascal (Pa)"],
      ans: 1
    }
  ],
  "Eletromagnetismo": [
    {
      q: "Qual a fórmula da Lei de Coulomb para a força entre duas cargas?",
      opts: ["F = m · a", "F = k · q₁q₂ / d²", "F = q · v · B", "F = μ₀ · I / 2πr"],
      ans: 1
    },
    {
      q: "Qual é a unidade de carga elétrica no Sistema Internacional?",
      opts: ["Volt (V)", "Ampère (A)", "Coulomb (C)", "Ohm (Ω)"],
      ans: 2
    },
    {
      q: "A Lei de Faraday trata sobre qual fenômeno?",
      opts: ["Atração entre cargas", "Indução eletromagnética", "Resistência elétrica", "Pressão nos fluidos"],
      ans: 1
    },
    {
      q: "O que acontece quando um condutor percorrido por corrente é colocado em um campo magnético?",
      opts: ["Nada, ele permanece parado", "Surge uma força magnética sobre o condutor", "A corrente para de fluir", "O campo magnético desaparece"],
      ans: 1
    },
    {
      q: "Qual dos itens NÃO é um exemplo de onda eletromagnética?",
      opts: ["Luz visível", "Raios X", "Ondas de rádio", "Som"],
      ans: 3
    }
  ],
  "Termodinâmica": [
    {
      q: "A 1ª Lei da Termodinâmica é essencialmente uma aplicação de qual princípio?",
      opts: ["Conservação da quantidade de movimento", "Conservação da energia", "Ação e Reação", "Princípio de Arquimedes"],
      ans: 1
    },
    {
      q: "Qual a fórmula da 1ª Lei da Termodinâmica?",
      opts: ["ΔU = Q - W", "F = m · a", "E = mc²", "P · V = n · R · T"],
      ans: 0
    },
    {
      q: "A 2ª Lei da Termodinâmica afirma que em processos naturais, a entropia:",
      opts: ["Sempre diminui", "Permanece constante", "Tende a aumentar", "É sempre zero"],
      ans: 2
    },
    {
      q: "Qual é o zero absoluto na escala Kelvin?",
      opts: ["0 K (≈ -273,15 °C)", "100 K", "273 K", "-100 K"],
      ans: 0
    },
    {
      q: "Uma máquina térmica ideal (Carnot) tem rendimento de 100%?",
      opts: ["Sim, sempre que bem projetada", "Não, é impossível pela 2ª Lei", "Sim, desde que use gás ideal", "Depende da temperatura ambiente"],
      ans: 1
    }
  ],
  "Ondulatória": [
    {
      q: "Qual a relação correta entre velocidade (v), frequência (f) e comprimento de onda (λ)?",
      opts: ["v = λ / f", "v = λ · f", "v = f / λ", "v = λ + f"],
      ans: 1
    },
    {
      q: "O som é um exemplo de qual tipo de onda?",
      opts: ["Transversal", "Eletromagnética", "Longitudinal", "Estacionária"],
      ans: 2
    },
    {
      q: "O efeito Doppler descreve a variação de qual característica da onda?",
      opts: ["Amplitude", "Velocidade de propagação", "Frequência percebida pelo observador", "Comprimento do meio"],
      ans: 2
    },
    {
      q: "O que acontece na ressonância?",
      opts: ["A onda desaparece completamente", "A amplitude aumenta muito ao igualar a frequência natural", "A frequência diminui pela metade", "A onda muda de longitudinal para transversal"],
      ans: 1
    },
    {
      q: "Ondas eletromagnéticas podem se propagar no vácuo?",
      opts: ["Não, precisam de um meio material", "Sim, não precisam de meio material", "Apenas ondas de rádio podem", "Apenas a luz visível pode"],
      ans: 1
    }
  ]
};

// Variáveis de compatibilidade (usada pelo estado atual)
let flashcardsData = flashcardsByTopic["Leis de Newton"];
let examData = examsByTopic["Leis de Newton"];

// ── FLASHCARDS LOGIC ──
let fcCurrent = 1;
let fcTotal = flashcardsData.length;

function startFlashcards() {
  // Carrega flashcards do tópico atual
  if (currentTopicName && flashcardsByTopic[currentTopicName]) {
    flashcardsData = flashcardsByTopic[currentTopicName];
  }
  fcTotal = flashcardsData.length;
  fcCurrent = 1;
  // Atualiza subtítulo com nome do tópico
  const fcSub = document.getElementById('fc-topic-sub');
  if (fcSub) fcSub.textContent = `Flashcards · ${currentTopicName || 'Tópico atual'}`;
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
    showNotif('Revisão concluída! 🎉');
    goBack();
    return;
  }
  fcCurrent++;
  updateFlashcardUI();
}

// ── EXAM LOGIC ──
let exCurrent = 1;
let exTotal = examData.length;
let exScore = 0;
let exResults = []; 

function startExam() {
  // Carrega exame do tópico atual
  if (currentTopicName && examsByTopic[currentTopicName]) {
    examData = examsByTopic[currentTopicName];
  }
  exTotal = examData.length;
  exCurrent = 1;
  exScore = 0;
  exResults = [];
  // Atualiza subtítulo com nome do tópico
  const exSub = document.getElementById('ex-topic-sub');
  if (exSub) exSub.textContent = `Simulado · ${currentTopicName || 'Exercícios práticos'}`;
  updateExamUI();
  goTo('s-exam');
}

function updateExamUI() {
  const qData = examData[exCurrent - 1];
  
  document.getElementById('ex-prog-text').textContent = `Questão ${exCurrent}/${exTotal}`;
  document.getElementById('ex-prog-fill').style.width = `${(exCurrent / exTotal) * 100}%`;
  
  document.getElementById('ex-qnum').textContent = `Questão ${exCurrent}`;
  document.getElementById('ex-qtext').textContent = qData.q;
  
  const optionsDiv = document.getElementById('ex-options');
  optionsDiv.innerHTML = '';
  optionsDiv.style.pointerEvents = 'auto'; // re-enable clicking
  
  const letters = ['A', 'B', 'C', 'D'];
  qData.opts.forEach((optText, index) => {
    const isCorrect = (index === qData.ans);
    const letter = letters[index];
    
    const optEl = document.createElement('div');
    optEl.className = 'ex-option';
    optEl.onclick = () => selectOption(optEl, isCorrect, qData.ans, index);
    
    optEl.innerHTML = `
      <div class="ex-opt-letter">${letter}</div>
      <div class="ex-opt-text">${optText}</div>
    `;
    
    optionsDiv.appendChild(optEl);
  });
  
  document.getElementById('ex-next-btn').classList.remove('show');
}

function selectOption(el, isCorrect, correctIdx, chosenIdx) {
  const optionsDiv = document.getElementById('ex-options');
  optionsDiv.style.pointerEvents = 'none'; // prevent multiple clicks
  
  const allOpts = optionsDiv.querySelectorAll('.ex-option');
  
  if (isCorrect) {
    el.classList.add('correct');
    exScore++;
  } else {
    el.classList.add('wrong');
    allOpts[correctIdx].classList.add('correct');
  }
  
  exResults.push({
    q: examData[exCurrent - 1].q,
    chosen: chosenIdx,
    correct: correctIdx,
    isCorrect: isCorrect
  });
  
  const nextBtn = document.getElementById('ex-next-btn');
  if (exCurrent === exTotal) {
    nextBtn.textContent = 'Ver Resultado';
  } else {
    nextBtn.textContent = 'Próxima questão';
  }
  nextBtn.classList.add('show');
}

function nextQuestion() {
  if (exCurrent >= exTotal) {
    finishExam();
  } else {
    exCurrent++;
    updateExamUI();
  }
}

function finishExam() {
  document.getElementById('res-score').textContent = `${exScore}/${exTotal}`;
  
  let pct = exScore / exTotal;
  let titleText = 'Bom trabalho!';
  if (pct === 1) titleText = 'Perfeito! 🏆';
  else if (pct < 0.5) titleText = 'Continue praticando! 💪';
  
  document.getElementById('res-title-text').textContent = titleText;
  
  const resList = document.getElementById('res-list');
  resList.innerHTML = '';
  
  exResults.forEach((res, i) => {
    const itemEl = document.createElement('div');
    itemEl.style.display = 'flex';
    itemEl.style.gap = '10px';
    itemEl.style.background = 'var(--surface)';
    itemEl.style.padding = '12px';
    itemEl.style.borderRadius = '12px';
    itemEl.style.border = '1px solid var(--border)';
    
    const iconColor = res.isCorrect ? 'var(--green)' : 'var(--red)';
    const iconMark = res.isCorrect ? '✓' : '✗';
    const bg = res.isCorrect ? 'rgba(0,223,162,0.1)' : 'rgba(255,79,106,0.1)';
    
    itemEl.innerHTML = `
      <div style="width:24px;height:24px;border-radius:6px;background:${bg};color:${iconColor};display:flex;align-items:center;justify-content:center;font-weight:bold;flex-shrink:0;margin-top:2px;">
        ${iconMark}
      </div>
      <div>
        <div style="font-size:12px;font-weight:600;color:var(--text);margin-bottom:4px;">Questão ${i + 1}</div>
        <div style="font-size:11px;color:var(--text3);line-height:1.4;">${res.q}</div>
      </div>
    `;
    
    resList.appendChild(itemEl);
  });
  
  goTo('s-exam-result');
}
