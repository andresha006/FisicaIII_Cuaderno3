// ═══════════════════════════════════════════════════════════════
//  PhysicsLab app.js
//  Routing, LaTeX rendering, and Simulation Engine
// ═══════════════════════════════════════════════════════════════

(function () {
  'use strict';

  // ── THEME TOGGLE ──
  window.toggleTheme = function() {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('physics_theme', next);
    updateThemeUI(next);
  };

  function updateThemeUI(theme) {
    const icon = document.getElementById('themeIcon');
    const label = document.getElementById('themeLabel');
    if (icon) {
      icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
    if (label) {
      label.textContent = theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro';
    }
  }

  // Load saved theme on startup
  function initTheme() {
    const saved = localStorage.getItem('physics_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
    updateThemeUI(saved);
  }
  // Run immediately
  initTheme();
  // ── APP ROUTER STATE ──
  window.appState = {
    currentView: 'home',
    goHome: function() { showView('home'); },
    openNotebook: function(id) { showView('nb' + id); renderMath(); },
    openSimulation: function() {
      showView('sim');
      // Fix canvas size when it becomes visible
      setTimeout(resizeSimCanvas, 50); 
    },
    openSimulation2: function() {
      showView('sim2');
      setTimeout(() => { if(window.Simulator) window.Simulator.resizeCanvas(); }, 50);
    },
    openIframe: function(src, title) {
      document.getElementById('iframe-title').textContent = title;
      document.getElementById('fullscreen-iframe').src = src;
      showView('iframe');
    }
  };

  function showView(viewId) {
    document.querySelectorAll('.view-panel').forEach(el => el.classList.remove('active'));
    document.getElementById('view-' + viewId).classList.add('active');
    appState.currentView = viewId;
    window.scrollTo(0,0);
  }

  // ── LaTeX Render ──
  function renderMath() {
    if (window.renderMathInElement) {
      document.querySelectorAll('.tex-content').forEach(el => {
        renderMathInElement(el, {
          delimiters: [
            {left: '$$', right: '$$', display: true},
            {left: '\\[', right: '\\]', display: true},
            {left: '$', right: '$', display: false},
            {left: '\\(', right: '\\)', display: false}
          ],
          throwOnError: false
        });
      });
    }
  }


  // ── SIMULATION ENGINE (Velocity-Verlet) ──
  const DPR = window.devicePixelRatio || 1;
  const SPRING_COILS = 18;
  const BLOCK_W = 60, BLOCK_H = 48, WALL_W = 16;
  const EQ_COLOR = 'rgba(0, 243, 255, 0.4)'; // neon-blue alpha
  const SPRING_CLR = '#c0c0d0';
  const BLOCK_GRAD1 = '#005f73';
  const BLOCK_GRAD2 = '#0a9396';
  const FORCE_CLR = '#ff2a2a';
  const TRAIL_LEN = 2000;
  const NICE_STEPS = [0.001,0.002,0.005,0.01,0.02,0.05,0.1,0.2,0.5,1,2,5,10,20,50];

  const S = {
    k: 20, m: 2, x0: 0, x: 0, v: 0, running: false, t: 0, dt: 1/240,
    forceScale: 1, dragActive: false, eqX: 0,
    history: { t: [], x: [], v: [], a: [], ke: [], pe: [] },
  };

  let simCanvas, simCtx;
  let kSlider, kVal, massSlider, massVal, scaleSlider, scaleVal;
  let toggleAnim, btnReset;
  let dForce, dElong, dVel, dAcc, dKE, dPE, dTE;
  let modalOverlays = {}, graphCanvases = {}, graphStates = {};

  document.addEventListener('DOMContentLoaded', () => {
    // Canvas setup
    simCanvas = document.getElementById('simCanvas');
    simCtx = simCanvas.getContext('2d');
    
    // We only resize if the view is active, otherwise height is 0
    window.addEventListener('resize', () => {
      if(appState.currentView === 'sim') resizeSimCanvas();
    });

    // Sliders
    kSlider = document.getElementById('kSlider'); kVal = document.getElementById('kVal');
    massSlider = document.getElementById('massSlider'); massVal = document.getElementById('massVal');
    scaleSlider = document.getElementById('scaleSlider'); scaleVal = document.getElementById('scaleVal');

    kSlider.addEventListener('input', () => { S.k = +kSlider.value; kVal.textContent = S.k.toFixed(1); if (!S.running) resetSim(); });
    massSlider.addEventListener('input', () => { S.m = +massSlider.value; massVal.textContent = S.m.toFixed(2); if (!S.running) resetSim(); });
    scaleSlider.addEventListener('input', () => { S.forceScale = +scaleSlider.value; scaleVal.textContent = S.forceScale.toFixed(1); });

    // Buttons
    toggleAnim = document.getElementById('toggleAnim');
    toggleAnim.addEventListener('click', toggleRun);
    btnReset = document.getElementById('btnReset');
    btnReset.addEventListener('click', resetSim);

    // Data displays
    dForce = document.getElementById('dForce'); dElong = document.getElementById('dElong');
    dVel = document.getElementById('dVel'); dAcc = document.getElementById('dAcc');
    dKE = document.getElementById('dKE'); dPE = document.getElementById('dPE');
    dTE = document.getElementById('dTE');

    // Drag
    simCanvas.addEventListener('mousedown', onDragStart);
    simCanvas.addEventListener('mousemove', onDragMove);
    simCanvas.addEventListener('mouseup', onDragEnd);
    simCanvas.addEventListener('mouseleave', onDragEnd);
    simCanvas.addEventListener('touchstart', e => { e.preventDefault(); onDragStart(e.touches[0]); }, { passive: false });
    simCanvas.addEventListener('touchmove', e => { e.preventDefault(); onDragMove(e.touches[0]); }, { passive: false });
    simCanvas.addEventListener('touchend', onDragEnd);

    // Modals Initialization
    const graphIds = ['elongation', 'velocity', 'acceleration', 'kinetic', 'potential'];
    graphIds.forEach(id => {
      const trig = document.getElementById('trig_' + id);
      const overlay = document.getElementById('modal_' + id);
      const closeBtn = overlay.querySelector('.close-btn');
      const canvas = overlay.querySelector('canvas');
      
      if(overlay && trig) {
        modalOverlays[id] = overlay; graphCanvases[id] = canvas;
        graphStates[id] = { panX: 0, panY: 0, zoom: 1, dragging: false, lastMouse: null };

        trig.addEventListener('click', () => { overlay.classList.add('open'); });
        closeBtn.addEventListener('click', () => { overlay.classList.remove('open'); });
        overlay.addEventListener('click', e => { if (e.target === overlay) overlay.classList.remove('open'); });

        // Toolbar
        overlay.querySelector('.gz-in').addEventListener('click', () => { graphStates[id].zoom *= 1.4; });
        overlay.querySelector('.gz-out').addEventListener('click', () => { graphStates[id].zoom /= 1.4; });
        overlay.querySelector('.gz-reset').addEventListener('click', () => { graphStates[id] = { panX: 0, panY: 0, zoom: 1, dragging: false, lastMouse: null }; });
        
        // Pan & Zoom events
        canvas.addEventListener('mousedown', e => { graphStates[id].dragging = true; graphStates[id].lastMouse = { x: e.offsetX, y: e.offsetY }; });
        canvas.addEventListener('mousemove', e => {
          if (!graphStates[id].dragging) return;
          graphStates[id].panX += (e.offsetX - graphStates[id].lastMouse.x);
          graphStates[id].panY += (e.offsetY - graphStates[id].lastMouse.y);
          graphStates[id].lastMouse = { x: e.offsetX, y: e.offsetY };
        });
        canvas.addEventListener('mouseup', () => { graphStates[id].dragging = false; });
        canvas.addEventListener('mouseleave', () => { graphStates[id].dragging = false; });
        canvas.addEventListener('wheel', e => { e.preventDefault(); graphStates[id].zoom *= (e.deltaY < 0 ? 1.15 : 1/1.15); }, { passive: false });
      }
    });

    resetSim();
    requestAnimationFrame(loop);
    
    // Initial Math render for open views
    setTimeout(renderMath, 500);
  });

  // ══════════════════════════════════════════════════
  //  BOOK CONTROLLER (3D Page-Turning)
  // ══════════════════════════════════════════════════
  const books = {};

  window.BookCtrl = {
    init(bookId) {
      const bookEl = document.getElementById('book-' + bookId);
      if (!bookEl) return;
      const pages = bookEl.querySelectorAll('.page');
      books[bookId] = { pages, current: 0, total: pages.length };
      this.updateIndicator(bookId);
    },
    next(bookId) {
      const b = books[bookId]; if (!b || b.current >= b.total) return;
      const page = b.pages[b.current];
      page.classList.add('flipped');
      page.style.zIndex = b.current;
      b.current++;
      this.updateIndicator(bookId);
      renderMath();
    },
    prev(bookId) {
      const b = books[bookId]; if (!b || b.current <= 0) return;
      b.current--;
      const page = b.pages[b.current];
      page.classList.remove('flipped');
      page.style.zIndex = b.total - b.current;
      this.updateIndicator(bookId);
      renderMath();
    },
    goToStart(bookId) {
      const b = books[bookId]; if (!b) return;
      while (b.current > 0) { this.prev(bookId); }
    },
    fullscreen(bookId) {
      const nbId = bookId.startsWith('nb') ? bookId.replace('nb','') : bookId;
      const viewEl = document.getElementById('view-nb' + nbId);
      if (!viewEl) return;
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        viewEl.requestFullscreen().catch(() => {});
      }
    },
    updateIndicator(bookId) {
      const b = books[bookId]; if (!b) return;
      const ind = document.getElementById('page-ind-' + bookId);
      if (!ind) return;
      const totalPages = b.total * 2;
      const showingStart = b.current * 2 + 1;
      const showingEnd = Math.min(showingStart + 1, totalPages);
      ind.textContent = `Pág ${showingStart}-${showingEnd} / ${totalPages}`;
    },
    reset(bookId) {
      const b = books[bookId]; if (!b) return;
      b.pages.forEach((p, i) => {
        p.classList.remove('flipped');
        p.style.zIndex = b.total - i;
      });
      b.current = 0;
      this.updateIndicator(bookId);
    }
  };

  // Generate spiral rings
  function generateSpirals() {
    document.querySelectorAll('.spiral-spine').forEach(spine => {
      spine.innerHTML = '';
      const ringCount = 14;
      for (let i = 0; i < ringCount; i++) {
        const ring = document.createElement('div');
        ring.className = 'spiral-ring';
        spine.appendChild(ring);
      }
    });
  }

  // Override openNotebook to also init book
  const origOpenNb = appState.openNotebook;
  appState.openNotebook = function(id) {
    origOpenNb(id);
    const bookId = 'nb' + id;
    if (!books[bookId]) BookCtrl.init(bookId);
    else BookCtrl.reset(bookId);
    generateSpirals();
    setTimeout(renderMath, 200);
  };

  // Init spirals once on load
  document.addEventListener('DOMContentLoaded', generateSpirals);

  // ══════════════════════════════════════════════════
  //  AI CHATBOT MODULE
  // ══════════════════════════════════════════════════
  const SCIENTISTS = {
    newton: {
      name: 'Isaac Newton',
      image: 'imagenes/isaac newton.png',
      color: '#00f3ff',
      quote: '"Si he visto más lejos, es poniéndome sobre hombros de gigantes."',
      system: 'Eres Isaac Newton, el gran físico y matemático inglés. Hablas en primera persona, como si fueras el verdadero Newton. Cuentas anécdotas sobre la manzana, la gravitación universal, las leyes del movimiento, y el cálculo. Eres serio pero apasionado por la ciencia. Respondes preguntas de física con rigor pero de forma accesible. Siempre en español.'
    },
    hertz: {
      name: 'Heinrich Hertz',
      image: 'imagenes/Heinrich Hertz.png',
      color: '#39ff14',
      quote: '"Las ondas eléctricas que he descubierto transformarán la comunicación humana."',
      system: 'Eres Heinrich Hertz, el físico alemán que demostró la existencia de las ondas electromagnéticas. Hablas en primera persona sobre tus experimentos con ondas, frecuencias y electromagnetismo. Eres metódico y preciso. Respondes preguntas de física con entusiasmo por las ondas y el electromagnetismo. Siempre en español.'
    },
    einstein: {
      name: 'Albert Einstein',
      image: 'imagenes/Albert Einstein.png',
      color: '#ab80ff',
      quote: '"La imaginación es más importante que el conocimiento."',
      system: 'Eres Albert Einstein, el genio de la relatividad. Hablas en primera persona con humor y profundidad. Cuentas sobre la relatividad especial, general, el efecto fotoeléctrico y tu famosa ecuación E=mc². Eres filosófico y curioso. Respondes preguntas de física con analogías brillantes. Siempre en español.'
    },
    curie: {
      name: 'Marie Curie',
      image: 'imagenes/Marie Curie.png',
      color: '#ff6b9d',
      quote: '"Nada en la vida debe ser temido, solo comprendido."',
      system: 'Eres Marie Curie, la primera mujer en ganar un Premio Nobel y la única en ganarlo en dos campos distintos. Hablas en primera persona sobre radioactividad, el polonio, el radio, y la importancia de la perseverancia en la ciencia. Eres determinada e inspiradora. Respondes preguntas de física con pasión. Siempre en español.'
    }
  };

  window.ChatBot = {
    isOpen: false,
    selectedScientist: null,

    toggle() {
      this.isOpen = !this.isOpen;
      const win = document.getElementById('chatWindow');
      win.classList.toggle('open', this.isOpen);
    },

    showSelector() {
      document.getElementById('scientistOverlay').classList.add('open');
    },
    hideSelector() {
      document.getElementById('scientistOverlay').classList.remove('open');
    },

    showSettings() {
      const overlay = document.getElementById('settingsOverlay');
      overlay.classList.add('open');
      // Load saved values
      const saved = localStorage.getItem('physics_api_key') || '';
      const provider = localStorage.getItem('physics_api_provider') || 'openai';
      const model = localStorage.getItem('physics_api_model') || 'gemini-2.5-flash';
      document.getElementById('apiKeyInput').value = saved;
      document.getElementById('apiProvider').value = provider;
      if (document.getElementById('apiModel')) {
          document.getElementById('apiModel').value = model;
      }
    },
    hideSettings() {
      document.getElementById('settingsOverlay').classList.remove('open');
    },
    saveApiKey() {
      const key = document.getElementById('apiKeyInput').value.trim();
      const provider = document.getElementById('apiProvider').value;
      const model = document.getElementById('apiModel') ? document.getElementById('apiModel').value : 'gemini-2.5-flash';
      localStorage.setItem('physics_api_key', key);
      localStorage.setItem('physics_api_provider', provider);
      localStorage.setItem('physics_api_model', model);
      this.hideSettings();
      this.addBotMessage('✅ Configuración guardada correctamente.');
    },

    selectScientist(id) {
      const sci = SCIENTISTS[id];
      if (!sci) return;
      this.selectedScientist = id;
      this.hideSelector();

      // Cinematic intro
      const overlay = document.getElementById('cinematicOverlay');
      const iconEl = document.getElementById('cinematicIcon');
      const nameEl = document.getElementById('cinematicName');
      const quoteEl = document.getElementById('cinematicQuote');

      iconEl.innerHTML = `<img src="${sci.image}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`;
      iconEl.style.borderColor = sci.color;
      iconEl.style.overflow = 'hidden';
      nameEl.textContent = sci.name;
      quoteEl.textContent = sci.quote;

      overlay.classList.add('active');

      // After animation, update chat and hide overlay
      setTimeout(() => {
        overlay.classList.remove('active');
        // Update chat header
        document.getElementById('chatName').textContent = sci.name;
        document.getElementById('chatAvatar').innerHTML = `<img src="${sci.image}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`;
        document.getElementById('chatAvatar').style.borderColor = sci.color;

        // Clear and add welcome message
        const msgs = document.getElementById('chatMessages');
        msgs.innerHTML = '';
        this.addBotMessage(`¡Saludos! Soy ${sci.name}. ${sci.quote} ¿En qué puedo ayudarte hoy con tus estudios de física?`);

        if (!this.isOpen) this.toggle();
      }, 2600);
    },

    addBotMessage(text) {
      const msgs = document.getElementById('chatMessages');
      const div = document.createElement('div');
      div.className = 'chat-msg bot';
      div.innerHTML = `<div class="msg-bubble">${text}</div>`;
      msgs.appendChild(div);
      msgs.scrollTop = msgs.scrollHeight;
    },

    addUserMessage(text) {
      const msgs = document.getElementById('chatMessages');
      const div = document.createElement('div');
      div.className = 'chat-msg user';
      div.innerHTML = `<div class="msg-bubble">${text}</div>`;
      msgs.appendChild(div);
      msgs.scrollTop = msgs.scrollHeight;
    },

    async send() {
      const input = document.getElementById('chatInput');
      const text = input.value.trim();
      if (!text) return;
      input.value = '';
      this.addUserMessage(text);

      const apiKey = localStorage.getItem('physics_api_key') || 'gen-lang-client-0334339450';
      let provider = localStorage.getItem('physics_api_provider') || 'gemini';
      
      // Force gemini provider if the key is a gen-lang-* key (from Google AI Studio)
      if (apiKey.startsWith('gen-lang-')) {
        provider = 'gemini';
      }

      if (!this.selectedScientist) {
        this.addBotMessage('Por favor selecciona un científico primero haciendo clic en <i class="fas fa-users"></i>.');
        return;
      }

      const sci = SCIENTISTS[this.selectedScientist];
      
      const uiInstructions = `\n\nIMPORTANTE: Puedes controlar la interfaz de la página. Si el usuario te pide abrir un cuaderno, una animación, ir al inicio o ver una imagen, DEBES incluir al final de tu respuesta uno de los siguientes comandos exactos entre corchetes:
- [CMD:openNotebook(1)] (para Cuaderno 1: Movimiento Armónico Simple)
- [CMD:openNotebook(2)] (para Cuaderno 2: Péndulos)
- [CMD:openNotebook(3)] (para Cuaderno 3: Oscilaciones Amortiguadas y Forzadas)
- [CMD:openSimulation()] (para Laboratorio Interactivo: Sistema Masa-Resorte)
- [CMD:openSimulation2()] (para Simulador M.A.S. Ultimate)
- [CMD:goHome()] (para volver al inicio de la página)
Si necesitas mostrar imágenes (como un código QR, foto de laboratorio, etc.), hazlo escribiendo la etiqueta HTML: <img src='imagenes/nombre_imagen.png' style='width:100%; border-radius:8px'>. Recuerda, siempre incluye los comandos CMD si la solicitud del usuario implica navegar en la app.`;
      const systemPrompt = sci.system + uiInstructions;

      this.addBotMessage('<i class="fas fa-spinner fa-spin"></i> Pensando...');

      // Function to handle Gemini API with retries and fallbacks
      const callGemini = async (modelName, retryCount = 0) => {
        try {
          const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: systemPrompt + '\n\nUsuario: ' + text }] }]
            })
          });

          const data = await response.json();

          if (response.status === 429) {
            if (retryCount < 2) {
              const waitTime = (retryCount + 1) * 2000;
              console.warn(`Rate limit hit. Retrying in ${waitTime}ms...`);
              await new Promise(resolve => setTimeout(resolve, waitTime));
              return callGemini(modelName, retryCount + 1);
            } else if (modelName !== 'gemini-1.5-flash') {
              console.warn("Switching to fallback model gemini-1.5-flash...");
              return callGemini('gemini-1.5-flash', 0);
            }
          }

          if (data.error) {
            throw new Error(data.error.message || 'Error desconocido');
          }

          if (data.candidates && data.candidates[0]) {
            return data.candidates[0].content.parts[0].text;
          } else {
            throw new Error('Sin respuesta del modelo');
          }
        } catch (err) {
          if (retryCount < 1 && err.message.includes('Quota exceeded')) {
              // Try one fallback immediately on quota error
              if (modelName !== 'gemini-1.5-flash') {
                  return callGemini('gemini-1.5-flash', 0);
              }
          }
          throw err;
        }
      };

      try {
        let responseText;
        if (provider === 'openai') {
          const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
            body: JSON.stringify({
              model: 'gpt-3.5-turbo',
              messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: text }
              ],
              max_tokens: 500
            })
          });
          const data = await response.json();
          if (data.choices && data.choices[0]) {
            responseText = data.choices[0].message.content;
          } else {
            throw new Error(data.error?.message || 'Respuesta inesperada');
          }
        } else {
          // Try user requested model first, then fallback
          // Note: Using gemini-2.0-flash as primary for stability, 
          // but prioritizing gemini-2.5-flash if that's what user prefers.
          const preferredModel = localStorage.getItem('physics_api_model') || 'gemini-2.5-flash';
          responseText = await callGemini(preferredModel);
        }

        // --- COMMAND PARSING ---
        const cmdRegex = /\[CMD:([a-zA-Z0-9_]+\([0-9]*\))\]/g;
        const commandsToRun = [];
        responseText = responseText.replace(cmdRegex, (match, cmd) => {
          commandsToRun.push(cmd);
          return '';
        });

        // Remove thinking indicator
        const msgs = document.getElementById('chatMessages');
        msgs.removeChild(msgs.lastChild);
        this.addBotMessage(responseText.trim());

        // Execute parsed commands with visual feedback
        commandsToRun.forEach(cmd => {
          try {
            const fnName = cmd.split('(')[0];
            const argStr = cmd.split('(')[1].replace(')', '');
            if (typeof appState[fnName] === 'function') {
               if (argStr) {
                 appState[fnName](parseInt(argStr, 10));
               } else {
                 appState[fnName]();
               }
               // Show visual badge for the action
               const actionNames = {
                 'openNotebook': '📖 Cuaderno ' + argStr,
                 'openSimulation': '🔬 Laboratorio',
                 'openSimulation2': '⚡ Simulador M.A.S.',
                 'goHome': '🏠 Inicio'
               };
               const label = actionNames[fnName] || fnName;
               const badge = document.createElement('div');
               badge.className = 'chat-cmd-badge';
               badge.innerHTML = '<i class="fas fa-external-link-alt"></i> Abriendo: ' + label;
               msgs.appendChild(badge);
               msgs.scrollTop = msgs.scrollHeight;
            }
          } catch (e) { console.error('Error executing AI command:', cmd, e); }
        });

      } catch (err) {
        const msgs = document.getElementById('chatMessages');
        msgs.removeChild(msgs.lastChild);
        
        let errorMsg = err.message;
        if (errorMsg.includes('Quota exceeded')) {
          errorMsg = '⚠️ Se ha agotado la cuota gratuita temporalmente. Por favor, intenta de nuevo en un momento o usa una API Key diferente.';
        }
        this.addBotMessage('❌ Error: ' + errorMsg);
      }
    },

    quickAction(fnName, arg) {
      if (typeof appState[fnName] === 'function') {
        if (arg !== undefined) {
          appState[fnName](arg);
          this.addBotMessage('✅ ¡Listo! He abierto el recurso para ti.');
        } else {
          appState[fnName]();
          this.addBotMessage('✅ ¡Navegación completada!');
        }
      }
    }
  };

  // ── DRAGGABLE CHAT WINDOW ──
  (function initDrag() {
    const win = document.getElementById('chatWindow');
    const handle = document.getElementById('chatDragHandle');
    if (!win || !handle) return;

    let isDragging = false, startX, startY, origX, origY;

    handle.addEventListener('mousedown', e => {
      if (e.target.closest('.chat-btn')) return; // don't drag on buttons
      isDragging = true;
      const rect = win.getBoundingClientRect();
      startX = e.clientX; startY = e.clientY;
      origX = rect.left; origY = rect.top;
      win.style.transition = 'none';
      e.preventDefault();
    });

    document.addEventListener('mousemove', e => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      win.style.left = (origX + dx) + 'px';
      win.style.top = (origY + dy) + 'px';
      win.style.right = 'auto';
      win.style.bottom = 'auto';
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
      win.style.transition = '';
    });
  })();

  window.resizeSimCanvas = function() {
    if(!simCanvas || !simCanvas.parentElement) return;
    const rect = simCanvas.parentElement.getBoundingClientRect();
    if(rect.width === 0) return; // View hidden
    simCanvas.width = rect.width * DPR;
    simCanvas.height = rect.height * DPR;
    S.eqX = simCanvas.width * 0.42;
  }

  function getCanvasPos(e) { const r = simCanvas.getBoundingClientRect(); return { x: (e.clientX - r.left)*DPR, y: (e.clientY - r.top)*DPR }; }
  function blockScreenX() { return S.eqX + S.x * 150 * DPR; }

  function onDragStart(e) {
    if (S.running) return;
    const p = getCanvasPos(e);
    if (Math.abs(p.x - blockScreenX()) < BLOCK_W*DPR && Math.abs(p.y - simCanvas.height/2) < BLOCK_H*DPR) {
      S.dragActive = true; simCanvas.style.cursor = 'grabbing';
    }
  }
  function onDragMove(e) {
    if (!S.dragActive) return;
    const p = getCanvasPos(e);
    S.x = Math.max(-2.2, Math.min(2.2, (p.x - S.eqX) / (150 * DPR)));
    S.x0 = S.x;
  }
  function onDragEnd() { S.dragActive = false; simCanvas.style.cursor = 'grab'; }

  function toggleRun() {
    S.running = !S.running;
    toggleAnim.classList.toggle('active', S.running);
    document.getElementById('toggleLabel').textContent = S.running ? 'Ejecutando' : 'Pausado';
    if (S.running) { S.v = 0; S.x0 = S.x; S.t = 0; S.history = { t: [], x: [], v: [], a: [], ke: [], pe: [] }; }
  }
  function resetSim() {
    S.running = false; S.x = 0; S.v = 0; S.t = 0; S.x0 = 0;
    toggleAnim.classList.remove('active');
    document.getElementById('toggleLabel').textContent = 'Pausado';
    S.history = { t: [], x: [], v: [], a: [], ke: [], pe: [] };
  }

  function physicsStep() {
    if (!S.running) return;
    const steps = 4, sdt = S.dt / steps;
    for (let i=0; i<steps; i++) {
      S.v += (-(S.k/S.m)*S.x) * sdt;
      S.x += S.v * sdt;
      S.t += sdt;
    }
    const a = -(S.k/S.m)*S.x, ke = 0.5*S.m*S.v*S.v, pe = 0.5*S.k*S.x*S.x;
    const h = S.history;
    h.t.push(S.t); h.x.push(S.x); h.v.push(S.v); h.a.push(a); h.ke.push(ke); h.pe.push(pe);
    if (h.t.length > TRAIL_LEN) { h.t.shift(); h.x.shift(); h.v.shift(); h.a.shift(); h.ke.shift(); h.pe.shift(); }
  }

  function updatePanel() {
    const F = -S.k * S.x, a = -(S.k/S.m)*S.x, ke = 0.5*S.m*S.v*S.v, pe = 0.5*S.k*S.x*S.x;
    dForce.textContent = F.toFixed(3) + ' N';
    dElong.textContent = S.x.toFixed(4) + ' m';
    dVel.textContent = S.v.toFixed(4) + ' m/s';
    dAcc.textContent = a.toFixed(3) + ' m/s²';
    dKE.textContent = ke.toFixed(4) + ' J';
    dPE.textContent = pe.toFixed(4) + ' J';
    dTE.textContent = (ke+pe).toFixed(4) + ' J';
  }

  function drawSim() {
    if(appState.currentView !== 'sim') return; // Don't draw if hidden

    const W = simCanvas.width, H = simCanvas.height, ctx = simCtx;
    ctx.clearRect(0,0,W,H);

    // Subtle grid
    ctx.strokeStyle = 'rgba(255,255,255,0.03)'; ctx.lineWidth = 1;
    const gs = 30*DPR;
    for(let i=0; i<W; i+=gs) { ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i,H); ctx.stroke(); }
    for(let i=0; i<H; i+=gs) { ctx.beginPath(); ctx.moveTo(0,i); ctx.lineTo(W,i); ctx.stroke(); }

    const cy = H/2, wallX = 40*DPR, bx = blockScreenX(), halfB = (BLOCK_W/2)*DPR, halfBH = (BLOCK_H/2)*DPR;

    // Equilibrium line
    ctx.setLineDash([6*DPR, 4*DPR]); ctx.strokeStyle = EQ_COLOR; ctx.lineWidth = 1.5*DPR;
    ctx.beginPath(); ctx.moveTo(S.eqX, cy-70*DPR); ctx.lineTo(S.eqX, cy+70*DPR); ctx.stroke(); ctx.setLineDash([]);

    // Wall
    ctx.fillStyle = '#161622'; ctx.beginPath(); ctx.roundRect(wallX-WALL_W*DPR, cy-55*DPR, WALL_W*DPR, 110*DPR, [4*DPR,0,0,4*DPR]); ctx.fill();
    ctx.strokeStyle = '#334'; ctx.stroke();

    // Floor
    ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.lineWidth = 2*DPR;
    ctx.beginPath(); ctx.moveTo(wallX-WALL_W*DPR, cy+halfBH+2*DPR); ctx.lineTo(Math.max(bx+halfB+80*DPR, S.eqX+200*DPR), cy+halfBH+2*DPR); ctx.stroke();

    // Spring
    const spStart = wallX, spEnd = bx-halfB, coilW = (spEnd-spStart)/SPRING_COILS;
    ctx.strokeStyle = SPRING_CLR; ctx.lineWidth = 2.5*DPR; ctx.lineJoin = 'bevel';
    ctx.beginPath(); ctx.moveTo(spStart, cy); ctx.lineTo(spStart+coilW*0.5, cy);
    for(let i=0; i<SPRING_COILS-1; i++) ctx.lineTo(spStart+coilW*(i+0.5)+coilW*0.5, cy + (i%2===0?-1:1)*12*DPR);
    ctx.lineTo(spEnd, cy); ctx.stroke();

    // Block
    const gr = ctx.createLinearGradient(bx-halfB, cy-halfBH, bx+halfB, cy+halfBH);
    gr.addColorStop(0, BLOCK_GRAD1); gr.addColorStop(1, BLOCK_GRAD2);
    ctx.fillStyle = gr; ctx.beginPath(); ctx.roundRect(bx-halfB, cy-halfBH, BLOCK_W*DPR, BLOCK_H*DPR, 6*DPR); ctx.fill();
    ctx.strokeStyle = '#00f3ff'; ctx.lineWidth = 1.5*DPR; ctx.stroke();
    ctx.fillStyle = '#fff'; ctx.font = `bold ${11*DPR}px 'JetBrains Mono'`; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(S.m.toFixed(1)+'kg', bx, cy);

    // Force vector
    const F = -S.k * S.x, fPx = F * S.forceScale * 40*DPR;
    if(Math.abs(fPx)>2) {
      const s = bx + (F>0?halfB+4*DPR:-halfB-4*DPR), e = s+fPx, dir=F>0?1:-1, aSize=10*DPR;
      ctx.strokeStyle = FORCE_CLR; ctx.lineWidth = 3*DPR; ctx.beginPath(); ctx.moveTo(s,cy); ctx.lineTo(e,cy); ctx.stroke();
      ctx.fillStyle = FORCE_CLR; ctx.beginPath(); ctx.moveTo(e,cy); ctx.lineTo(e-dir*aSize, cy-aSize*0.5); ctx.lineTo(e-dir*aSize, cy+aSize*0.5); ctx.fill();
      ctx.font = `bold ${11*DPR}px 'JetBrains Mono'`; ctx.fillText('F='+F.toFixed(1)+'N', (s+e)/2, cy-18*DPR);
    }
  }

  function drawGraph(id, yArr, color, ylabel) {
    const canvas = graphCanvases[id]; if(!canvas || !canvas.offsetParent) return;
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width*DPR; canvas.height = 350*DPR; canvas.style.height='350px';
    const ctx = canvas.getContext('2d'), W=canvas.width, H=canvas.height, gs=graphStates[id], tArr=S.history.t;
    if(tArr.length<2) { ctx.clearRect(0,0,W,H); ctx.fillStyle='#555'; ctx.font=`${13*DPR}px Inter`; ctx.textAlign='center'; ctx.fillText('Inicia la simulación para graficar', W/2, H/2); return; }
    
    ctx.clearRect(0,0,W,H);
    const tMin=tArr[0], tMax=tArr[tArr.length-1];
    let yMin=Infinity, yMax=-Infinity; for(let i=0;i<yArr.length;i++){if(yArr[i]<yMin)yMin=yArr[i]; if(yArr[i]>yMax)yMax=yArr[i];}
    if(yMax-yMin<1e-6){yMin-=1;yMax+=1;}
    const pad=(yMax-yMin)*0.15; yMin-=pad; yMax+=pad;
    const tRange=(tMax-tMin)||1, eTR=tRange/gs.zoom, eYR=(yMax-yMin)/gs.zoom;
    const padL=65*DPR, padR=20*DPR, padT=30*DPR, padB=45*DPR, gW=W-padL-padR, gH=H-padT-padB;
    const cx=padL + gW/2 + gs.panX*DPR, cy=padT + gH/2 + gs.panY*DPR;

    function mapX(t){return cx+((t-(tMin+tMax)/2)/eTR)*gW;}
    function mapY(y){return cy-((y-(yMin+yMax)/2)/eYR)*gH;}
    
    // Grid Lines (major & minor)
    function nice(r,m){const ro=r/m; for(const s of NICE_STEPS)if(s>=ro)return s; return ro;}
    const tS=nice(eTR,12), yS=nice(eYR,8);
    
    ctx.strokeStyle='rgba(255,255,255,0.04)'; ctx.lineWidth=0.5*DPR;
    for(let ts=Math.floor(((tMin+tMax)/2-eTR)/(tS/5))*(tS/5); ts<=(tMin+tMax)/2+eTR; ts+=tS/5){ const px=mapX(ts); if(px>=padL && px<=W-padR){ctx.beginPath();ctx.moveTo(px,padT);ctx.lineTo(px,H-padB);ctx.stroke();} }
    for(let ys=Math.floor(((yMin+yMax)/2-eYR)/(yS/5))*(yS/5); ys<=(yMin+yMax)/2+eYR; ys+=yS/5){ const py=mapY(ys); if(py>=padT && py<=H-padB){ctx.beginPath();ctx.moveTo(padL,py);ctx.lineTo(W-padR,py);ctx.stroke();} }

    ctx.strokeStyle='rgba(255,255,255,0.1)'; ctx.lineWidth=1*DPR;
    for(let ts=Math.floor(((tMin+tMax)/2-eTR)/tS)*tS; ts<=(tMin+tMax)/2+eTR; ts+=tS){ const px=mapX(ts); if(px>=padL && px<=W-padR){ctx.beginPath();ctx.moveTo(px,padT);ctx.lineTo(px,H-padB);ctx.stroke(); ctx.fillStyle='#888';ctx.font=`${10*DPR}px 'JetBrains Mono'`;ctx.textAlign='center';ctx.fillText(ts.toFixed(ts>=10?0:ts>=1?1:2),px,H-padB+16*DPR);} }
    for(let ys=Math.floor(((yMin+yMax)/2-eYR)/yS)*yS; ys<=(yMin+yMax)/2+eYR; ys+=yS){ const py=mapY(ys); if(py>=padT && py<=H-padB){ctx.beginPath();ctx.moveTo(padL,py);ctx.lineTo(W-padR,py);ctx.stroke(); ctx.fillStyle='#888';ctx.font=`${10*DPR}px 'JetBrains Mono'`;ctx.textAlign='right';ctx.textBaseline='middle';ctx.fillText(ys.toFixed(Math.abs(ys)>=10?1:Math.abs(ys)>=1?2:3),padL-8*DPR,py);} }

    // axes
    const zX=mapX(0), zY=mapY(0);
    ctx.strokeStyle='rgba(255,255,255,0.3)'; ctx.lineWidth=1.5*DPR;
    if(zX>=padL&&zX<=W-padR){ctx.beginPath();ctx.moveTo(zX,padT);ctx.lineTo(zX,H-padB);ctx.stroke();}
    if(zY>=padT&&zY<=H-padB){ctx.beginPath();ctx.moveTo(padL,zY);ctx.lineTo(W-padR,zY);ctx.stroke();}

    // Line
    ctx.save(); ctx.beginPath(); ctx.rect(padL,padT,gW,gH); ctx.clip();
    ctx.strokeStyle=color; ctx.lineWidth=2*DPR; ctx.lineJoin='round'; ctx.beginPath();
    let s=false; for(let i=0;i<tArr.length;i++){const px=mapX(tArr[i]), py=mapY(yArr[i]); if(!s){ctx.moveTo(px,py);s=true;}else ctx.lineTo(px,py);}
    ctx.stroke(); ctx.globalAlpha=0.15; ctx.lineWidth=6*DPR; ctx.stroke(); ctx.restore();

    ctx.fillStyle='#aaa'; ctx.font=`bold ${11*DPR}px Inter`; ctx.textAlign='center'; ctx.fillText('t (s)', W/2, H-6*DPR);
    ctx.save(); ctx.translate(16*DPR, H/2); ctx.rotate(-Math.PI/2); ctx.fillText(ylabel, 0,0); ctx.restore();
  }

  function loop() {
    physicsStep();
    if(appState.currentView === 'sim') { drawSim(); updatePanel(); }
    
    // Draw open modals
    Object.keys(modalOverlays).forEach(id => {
      if(modalOverlays[id].classList.contains('open')) {
        const C = { elongation:'#00f3ff', velocity:'#39ff14', acceleration:'#ffab40', kinetic:'#ff6b9d', potential:'#ab80ff' };
        const L = { elongation:'x(m)', velocity:'v(m/s)', acceleration:'a(m/s²)', kinetic:'Ek(J)', potential:'Ep(J)' };
        const D = { elongation:S.history.x, velocity:S.history.v, acceleration:S.history.a, kinetic:S.history.ke, potential:S.history.pe };
        drawGraph(id, D[id], C[id], L[id]);
      }
    });
    requestAnimationFrame(loop);
  }

})();

// ═══════════════════════════════════════════════════════════════
//  Simulación 2: MAS Ultimate (Onda temporal & Fasores)
// ═══════════════════════════════════════════════════════════════
window.Simulator = (() => {
    const state = {
        A: 2.0, w: 1.0, p: 0.0, t: 0,
        isPlaying: true, showGraph: true, showPhasor: false,
        scale: 60, offsetX: 0, offsetY: 0,
        isDragging: false, lastMouse: { x: 0, y: 0 }
    };

    let canvas, ctx, container, mathOutput;

    function init() {
        // Wait for DOM
        canvas = document.getElementById('simCanvas2');
        if(!canvas) return;
        ctx = canvas.getContext('2d');
        container = document.getElementById('sim2-canvas-container');
        mathOutput = document.getElementById('math-output-sim2');

        bindEvents();
        resizeCanvas();
        if (window.lucide) lucide.createIcons();
        updateEquation();
        requestAnimationFrame(loop);
    }

    function bindEvents() {
        window.addEventListener('resize', () => { if(appState.currentView === 'sim2') resizeCanvas(); });
        
        bindInput('input-a-sim2', 'val-a-sim2', v => state.A = parseFloat(v));
        bindInput('input-w-sim2', 'val-w-sim2', v => state.w = parseFloat(v));
        bindInput('input-p-sim2', 'val-p-sim2', v => state.p = parseFloat(v));

        document.getElementById('toggle-play-sim2').onchange = (e) => state.isPlaying = e.target.checked;
        document.getElementById('toggle-graph-sim2').onchange = (e) => state.showGraph = e.target.checked;
        document.getElementById('toggle-phasor-sim2').onchange = (e) => state.showPhasor = e.target.checked;

        document.getElementById('btn-reset-sim2').onclick = resetCamera;
        document.getElementById('btn-zoom-in-sim2').onclick = () => zoom(1.2);
        document.getElementById('btn-zoom-out-sim2').onclick = () => zoom(0.8);

        container.addEventListener('mousedown', startDrag);
        window.addEventListener('mousemove', doDrag);
        window.addEventListener('mouseup', endDrag);
        container.addEventListener('wheel', handleWheel, { passive: false });
    }

    function bindInput(id, labelId, callback) {
        const el = document.getElementById(id);
        const label = document.getElementById(labelId);
        if(!el) return;
        el.addEventListener('input', (e) => {
            callback(e.target.value);
            label.innerText = parseFloat(e.target.value).toFixed(2);
            updateEquation();
        });
    }

    function resizeCanvas() {
        if(!canvas || !container) return;
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        if (state.t === 0) resetCamera();
    }

    function resetCamera() { state.offsetX = canvas.width / 4; state.offsetY = canvas.height / 2; state.scale = 60; }
    function zoom(factor) { state.scale = Math.max(20, Math.min(200, state.scale * factor)); }
    function startDrag(e) { state.isDragging = true; state.lastMouse = { x: e.clientX, y: e.clientY }; container.style.cursor = 'grabbing'; }
    function doDrag(e) {
        if (!state.isDragging) return;
        state.offsetX += e.clientX - state.lastMouse.x;
        state.offsetY += e.clientY - state.lastMouse.y;
        state.lastMouse = { x: e.clientX, y: e.clientY };
    }
    function endDrag() { state.isDragging = false; container.style.cursor = 'grab'; }
    function handleWheel(e) { e.preventDefault(); zoom(e.deltaY > 0 ? 0.9 : 1.1); }

    function updateEquation() {
        if (!window.katex || !mathOutput) return;
        const A_str = state.A.toFixed(1), w_str = state.w.toFixed(1);
        const p_sign = state.p >= 0 ? '+' : '-', p_val = Math.abs(state.p).toFixed(2);
        const latex = `x(t) = ${A_str} \\cdot \\sin(${w_str}t ${p_sign} ${p_val})`;
        try { katex.render(latex, mathOutput, { throwOnError: false }); } catch(e) {}
    }

    function loop() {
        if(appState.currentView === 'sim2' && ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawGrid();
            if (state.showGraph) drawWave();
            if (state.showPhasor) drawPhasor();
            drawParticle();
            if (state.isPlaying) state.t += 0.02;
        }
        requestAnimationFrame(loop);
    }

    function drawGrid() {
        const { offsetX, offsetY, scale } = state, w = canvas.width, h = canvas.height;
        ctx.lineWidth = 1; ctx.font = "12px 'JetBrains Mono'"; ctx.textAlign = "center"; ctx.textBaseline = "top";
        const drawLine = (x1, y1, x2, y2, color, width=1) => { ctx.beginPath(); ctx.strokeStyle = color; ctx.lineWidth = width; ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); };
        const step = scale, subStep = step / 5;
        for (let x = offsetX % subStep; x < w; x += subStep) drawLine(x, 0, x, h, 'rgba(255,255,255,0.03)');
        for (let y = offsetY % subStep; y < h; y += subStep) drawLine(0, y, w, y, 'rgba(255,255,255,0.03)');
        for (let x = offsetX % step; x < w; x += step) {
            drawLine(x, 0, x, h, 'rgba(255,255,255,0.08)');
            const val = Math.round((x - offsetX) / scale);
            if (val !== 0) { ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.fillText(val, x, offsetY + 8); drawLine(x, offsetY - 4, x, offsetY + 4, 'rgba(255,255,255,0.5)'); }
        }
        for (let y = offsetY % step; y < h; y += step) {
            drawLine(0, y, w, y, 'rgba(255,255,255,0.08)');
            const val = Math.round(-(y - offsetY) / scale);
            if (val !== 0) { ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.fillText(val, offsetX - 15, y - 5); drawLine(offsetX - 4, y, offsetX + 4, y, 'rgba(255,255,255,0.5)'); }
        }
        drawLine(0, offsetY, w, offsetY, '#94a3b8', 2);
        drawLine(offsetX, 0, offsetX, h, '#94a3b8', 2);
    }

    function drawWave() {
        const { offsetX, offsetY, scale, A, w, p } = state;
        ctx.beginPath(); ctx.strokeStyle = '#06b6d4'; ctx.lineWidth = 3;
        let first = true;
        for (let px = 0; px < canvas.width; px += 2) {
            const plotY = offsetY - (A * Math.sin(w * ((px - offsetX) / scale) + p) * scale);
            if (first) { ctx.moveTo(px, plotY); first = false; } else { ctx.lineTo(px, plotY); }
        }
        ctx.stroke();
    }

    function drawPhasor() {
        const { offsetX, offsetY, scale, A, w, t, p } = state, phasorCX = 120, phasorCY = offsetY;
        ctx.beginPath(); ctx.strokeStyle = 'rgba(236, 72, 153, 0.3)'; ctx.lineWidth = 2; ctx.setLineDash([5, 5]);
        ctx.arc(phasorCX, phasorCY, A * scale, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
        const phase = w * t + p, vx = phasorCX + Math.cos(phase) * (A * scale), vy = phasorCY - Math.sin(phase) * (A * scale);
        ctx.beginPath(); ctx.strokeStyle = '#ec4899'; ctx.lineWidth = 2; ctx.moveTo(phasorCX, phasorCY); ctx.lineTo(vx, vy); ctx.stroke();
        ctx.beginPath(); ctx.fillStyle = '#ec4899'; ctx.arc(vx, vy, 4, 0, Math.PI*2); ctx.fill();
        const particleX = offsetX + t * scale, particleY = offsetY - (A * Math.sin(phase) * scale);
        ctx.beginPath(); ctx.strokeStyle = 'rgba(236, 72, 153, 0.5)'; ctx.setLineDash([2, 4]);
        ctx.moveTo(vx, vy); ctx.lineTo(particleX, particleY); ctx.stroke(); ctx.setLineDash([]);
    }

    function drawParticle() {
        const { offsetX, offsetY, scale, A, w, t, p } = state;
        const px = offsetX + t * scale, py = offsetY - (A * Math.sin(w * t + p) * scale);
        ctx.beginPath(); ctx.strokeStyle = 'rgba(139, 92, 246, 0.5)'; ctx.moveTo(px, offsetY); ctx.lineTo(px, py); ctx.stroke();
        ctx.shadowBlur = 15; ctx.shadowColor = '#8b5cf6'; ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(px, py, 8, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
    }

    return { init, resizeCanvas };
})();

document.addEventListener('DOMContentLoaded', () => {
    if(window.Simulator) window.Simulator.init();
});
