import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update Cuaderno 1 Card in dashboard
c1_pattern = r'(<div class="dash-card notebook-card" onclick="appState\.openNotebook\(1\)").*?(<div class="dash-card add-card")'
c1_replacement = r'''\1>
          <div class="iframe-preview-wrapper" style="height: 120px; border-radius: 8px; margin-bottom: 15px; overflow: hidden; position: relative;">
            <iframe src="animaciones/ondas-estacionarias.html" loading="lazy" style="width:100%; height:100%; border:none; pointer-events:none;"></iframe>
            <div style="position:absolute; top:0; left:0; width:100%; height:100%; z-index:10;"></div>
          </div>
          <h3 style="margin-top:0;">Ondas Estacionarias e Interferencias</h3>
          <p>Cuaderno interactivo sobre Ondas Estacionarias y Superposición.</p>
          <div class="glow-effect"></div>
        </div>

        \2'''
text = re.sub(c1_pattern, c1_replacement, text, flags=re.DOTALL)

# 3. Sidebar Theme Menu
# Remove the old themeToggleBtn and put the grid
theme_btn_pat = r'<button class="theme-toggle-btn" id="themeToggleBtn"[^>]*>.*?</button>'
theme_grid = r'''
      <div style="padding: 10px 15px; margin-top: auto; display: flex; flex-direction: column; gap: 8px;">
        <p style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: bold; margin: 0 0 5px 0;"><i class="fas fa-palette"></i> Tema</p>
        <div class="theme-selector-grid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;">
          <div class="theme-option" onclick="appState.applyTheme('aurora')" title="Aurora"><div class="theme-circle" style="background:linear-gradient(45deg, #8b5cf6, #ec4899);width:22px;height:22px;border-radius:50%;cursor:pointer;"></div></div>
          <div class="theme-option" onclick="appState.applyTheme('neon')" title="Neón"><div class="theme-circle" style="background:#0f172a;border:2px solid #00f3ff;width:22px;height:22px;border-radius:50%;cursor:pointer;"></div></div>
          <div class="theme-option" onclick="appState.applyTheme('ocean')" title="Océano"><div class="theme-circle" style="background:#006994;width:22px;height:22px;border-radius:50%;cursor:pointer;"></div></div>
          <div class="theme-option" onclick="appState.applyTheme('sunset')" title="Atardecer"><div class="theme-circle" style="background:linear-gradient(45deg, #ff7e5f, #feb47b);width:22px;height:22px;border-radius:50%;cursor:pointer;"></div></div>
          <div class="theme-option" onclick="appState.applyTheme('forest')" title="Bosque"><div class="theme-circle" style="background:#2d4a22;width:22px;height:22px;border-radius:50%;cursor:pointer;"></div></div>
          <div class="theme-option" onclick="appState.applyTheme('dark')" title="Oscuro"><div class="theme-circle" style="background:#121212;border:1px solid #333;width:22px;height:22px;border-radius:50%;cursor:pointer;"></div></div>
          <div class="theme-option" onclick="appState.applyTheme('light')" title="Claro"><div class="theme-circle" style="background:#f8f9fa;border:1px solid #ddd;width:22px;height:22px;border-radius:50%;cursor:pointer;"></div></div>
        </div>
      </div>
'''
text = re.sub(theme_btn_pat, theme_grid, text, flags=re.DOTALL)

# 4. Remove old animations from the anim-grid
old_anim_pat = r'<!-- Animaciones Históricas \(MAS y Péndulos\) -->.*?(</div>\s*<!-- ── Videos Guía ── -->)'
text = re.sub(old_anim_pat, r'\1', text, flags=re.DOTALL)

# 5. Extract Notebook 3 HTML, replace 'nb3' with 'nb1', delete 'nb1' and 'nb2'
# view-nb1
nb1_pat = r'<!-- ── VIEW 2: NOTEBOOK 1 \(MAS\) ── -->.*?<!-- ── VIEW 3: NOTEBOOK 2 \(PÉNDULOS\) ── -->'
text = re.sub(nb1_pat, '<!-- ── VIEW 3: NOTEBOOK 2 (PÉNDULOS) ── -->', text, flags=re.DOTALL)

# view-nb2
nb2_pat = r'<!-- ── VIEW 3: NOTEBOOK 2 \(PÉNDULOS\) ── -->.*?<!-- ── VIEW 4: NOTEBOOK 3 \(AMORTIGUADAS\) ── -->'
text = re.sub(nb2_pat, '<!-- ── VIEW 4: NOTEBOOK 3 (AMORTIGUADAS) ── -->', text, flags=re.DOTALL)

# view-nb3 -> view-nb1
nb3_pat = r'(<!-- ── VIEW 4: NOTEBOOK 3 \(AMORTIGUADAS\) ── -->\s*<div id="view-)nb3(" class="view-panel notebook-view">.*?(<div id="view-sim"))'

def nb3_replacer(match):
    block = match.group(0)
    # Replace variables from nb3 to nb1 to adopt Cuaderno 1's identity
    block = block.replace('nb3', 'nb1')
    block = block.replace('Cuaderno 3', 'Cuaderno 1')
    block = block.replace('view-nb3', 'view-nb1')
    return block

text = re.sub(nb3_pat, nb3_replacer, text, flags=re.DOTALL)

# 6. Remove the themeOverlay modal entirely
theme_overlay_pat = r'<!-- Theme Selector Modal -->\s*<div class="settings-overlay" id="themeOverlay">.*?</div>\s*</div>'
text = re.sub(theme_overlay_pat, '', text, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)
