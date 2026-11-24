/* ==========================================================================
   OSL Practicals Interactive Study Guide — App Logic
   ========================================================================== */
(function () {
  "use strict";

  const EXPERIMENTS = [
    ...(window.OSL_EXPERIMENTS_1_4 || []),
    ...(window.OSL_EXPERIMENTS_5_8 || []),
  ];

  const state = {
    expIndex: 0,
    mode: "viva", // "viva" | "code"
    fileId: null,
    showAllExplanations: true,
    revised: loadRevised(),
  };

  // DOM refs
  const expPillsEl = document.getElementById("expPills");
  const expHeroEl = document.getElementById("expHero");
  const vivaViewEl = document.getElementById("vivaView");
  const codeViewEl = document.getElementById("codeView");
  const tabVivaEl = document.getElementById("tabViva");
  const tabCodeEl = document.getElementById("tabCode");
  const floatingCtaBtn = document.getElementById("floatingCtaBtn");
  const floatingCtaLabel = document.getElementById("floatingCtaLabel");
  const floatingCtaArrow = document.getElementById("floatingCtaArrow");
  const progressSummaryEl = document.getElementById("progressSummary");
  const searchToggleBtn = document.getElementById("searchToggleBtn");
  const searchPanelEl = document.getElementById("searchPanel");
  const searchInputEl = document.getElementById("globalSearchInput");
  const clearSearchBtn = document.getElementById("clearSearchBtn");
  const searchResultsEl = document.getElementById("searchResults");
  const themeToggleBtn = document.getElementById("themeToggleBtn");
  const toastEl = document.getElementById("toast");

  function loadRevised() {
    try {
      const raw = localStorage.getItem("osl-revised");
      return new Set(raw ? JSON.parse(raw) : []);
    } catch (_) {
      return new Set();
    }
  }

  function saveRevised() {
    try {
      localStorage.setItem("osl-revised", JSON.stringify([...state.revised]));
    } catch (_) {}
  }

  function showToast(msg) {
    toastEl.textContent = msg;
    toastEl.hidden = false;
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => {
      toastEl.hidden = true;
    }, 2000);
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // Format inline `code` and **bold** in explanations & answers safely
  function formatRich(text) {
    let s = escapeHtml(text);
    s = s.replace(/`([^`]+)`/g, "<code>$1</code>");
    s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    return s;
  }

  // Lightweight safe syntax highlighter for C / C++ / Bash
  function highlightSyntax(line, lang) {
    const raw = escapeHtml(line);
    if (lang === "bash") {
      if (/^\s*#/.test(line)) return `<span class="tok-cmt">${raw}</span>`;
      return raw
        .replace(/("[^"]*"|'[^']*')/g, '<span class="tok-str">$1</span>')
        .replace(
          /\b(if|then|else|elif|fi|for|while|do|done|case|esac|in|return|break|continue|function|local|echo|read|grep|sed|awk|column|touch|mv|rm)\b/g,
          '<span class="tok-kw">$1</span>'
        );
    }
    // C / C++
    if (/^\s*#/.test(line)) return `<span class="tok-pp">${raw}</span>`;
    // Split off trailing // comment
    const cmtIdx = raw.indexOf("//");
    let codePart = cmtIdx >= 0 ? raw.slice(0, cmtIdx) : raw;
    const cmtPart = cmtIdx >= 0 ? `<span class="tok-cmt">${raw.slice(cmtIdx)}</span>` : "";

    // Protect string literals with placeholders
    const strings = [];
    codePart = codePart.replace(/(&quot;[^&]*?&quot;|'[^']*?')/g, (m) => {
      strings.push(m);
      return `\x00STR${strings.length - 1}\x00`;
    });

    codePart = codePart
      .replace(
        /\b(if|else|for|while|do|switch|case|break|continue|return|struct|using|namespace|sizeof|NULL)\b/g,
        '<span class="tok-kw">$1</span>'
      )
      .replace(
        /\b(int|void|char|float|double|long|unsigned|bool|pid_t|key_t|sem_t|pthread_t|pthread_mutex_t|vector|pair|string)\b/g,
        '<span class="tok-type">$1</span>'
      )
      .replace(/\b(\d+)\b/g, '<span class="tok-num">$1</span>');

    codePart = codePart.replace(/\x00STR(\d+)\x00/g, (_, idx) => `<span class="tok-str">${strings[idx]}</span>`);
    return codePart + cmtPart;
  }

  // =========================================================================
  // Theme Toggle (per modern-web-guidance dark-mode-toggle)
  // =========================================================================
  function getSystemScheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function applyColorSchemeMeta(value) {
    const meta = document.querySelector('meta[name="color-scheme"]');
    if (meta) meta.content = value || "light dark";
  }

  themeToggleBtn.addEventListener("click", () => {
    let stored = null;
    try {
      stored = localStorage.getItem("color-scheme");
    } catch (_) {}

    const currentRendered = stored === "light" || stored === "dark" ? stored : getSystemScheme();
    const target = currentRendered === "dark" ? "light" : "dark";
    const system = getSystemScheme();

    if (target === system) {
      try { localStorage.removeItem("color-scheme"); } catch (_) {}
      applyColorSchemeMeta("light dark");
      showToast(`Theme: System (${system})`);
    } else {
      try { localStorage.setItem("color-scheme", target); } catch (_) {}
      applyColorSchemeMeta(target);
      showToast(`Theme: ${target[0].toUpperCase() + target.slice(1)}`);
    }
  });

  window.addEventListener("storage", (e) => {
    if (e.key === "color-scheme") {
      applyColorSchemeMeta(e.newValue === "light" || e.newValue === "dark" ? e.newValue : "light dark");
    }
  });

  // =========================================================================
  // Rendering
  // =========================================================================
  function currentExp() {
    return EXPERIMENTS[state.expIndex] || EXPERIMENTS[0];
  }

  function updateProgressUI() {
    progressSummaryEl.textContent = `${state.revised.size} / ${EXPERIMENTS.length} revised`;
  }

  function renderPills() {
    expPillsEl.innerHTML = EXPERIMENTS.map((exp, idx) => {
      const active = idx === state.expIndex ? "active" : "";
      const done = state.revised.has(exp.id) ? '<span class="pill-check" aria-label="Revised">✓</span>' : "";
      return `<button type="button" class="exp-pill ${active}" data-exp-idx="${idx}">${done}${exp.num} · ${escapeHtml(exp.shortTitle)}</button>`;
    }).join("");

    const activePill = expPillsEl.querySelector(".exp-pill.active");
    if (activePill) {
      activePill.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }

  function renderHero() {
    const exp = currentExp();
    const isDone = state.revised.has(exp.id);
    const otherModeLabel = state.mode === "viva" ? "Go to Code & Highlights →" : "← Back to Viva & Concepts";
    expHeroEl.innerHTML = `
      <div class="exp-hero-top">
        <span class="exp-tag">Experiment ${exp.num} · ${escapeHtml(exp.co)}</span>
        <button type="button" class="revise-btn ${isDone ? "done" : ""}" id="reviseBtn">
          ${isDone ? "✓ Revised" : "○ Mark Revised"}
        </button>
      </div>
      <h2>${escapeHtml(exp.title)}</h2>
      <p class="exp-hero-desc">${formatRich(exp.subtitle)}</p>
      <div class="hero-cta-row">
        <button type="button" class="primary-btn" id="heroSwitchBtn">${otherModeLabel}</button>
        <button type="button" class="secondary-btn" id="heroCopyCmdBtn">📋 Copy Run Cmd</button>
      </div>
    `;

    document.getElementById("reviseBtn").addEventListener("click", () => {
      if (state.revised.has(exp.id)) {
        state.revised.delete(exp.id);
        showToast(`Unmarked Exp ${exp.num}`);
      } else {
        state.revised.add(exp.id);
        showToast(`Marked Exp ${exp.num} as revised ✓`);
      }
      saveRevised();
      updateProgressUI();
      renderPills();
      renderHero();
    });

    document.getElementById("heroSwitchBtn").addEventListener("click", () => {
      setMode(state.mode === "viva" ? "code" : "viva", true);
    });

    document.getElementById("heroCopyCmdBtn").addEventListener("click", () => {
      copyText(exp.compileCmd, "Compile & run command copied!");
    });
  }

  function renderViva() {
    const exp = currentExp();
    let html = "";

    // 1. 30-Second Big Picture
    html += `
      <section class="card">
        <div class="card-header">
          <h3 class="card-title">⚡ 30-Second Big Picture</h3>
        </div>
        <ul class="bullet-list">
          ${exp.bigPicture.map((item) => `<li>${formatRich(item)}</li>`).join("")}
        </ul>
      </section>
    `;

    // 2. Viva Traps
    if (exp.traps && exp.traps.length) {
      for (const trap of exp.traps) {
        html += `
          <aside class="callout callout-trap">
            <p class="callout-title">⚠️ VIVA TRAP: ${escapeHtml(trap.title)}</p>
            <p>${formatRich(trap.body)}</p>
          </aside>
        `;
      }
    }

    // 3. Reference / Comparison Tables
    if (exp.tables && exp.tables.length) {
      for (const tbl of exp.tables) {
        html += `
          <section class="card">
            <div class="card-header">
              <h3 class="card-title">📊 ${escapeHtml(tbl.title)}</h3>
            </div>
            <div class="table-wrap">
              <table>
                <thead>
                  <tr>${tbl.headers.map((h) => `<th>${escapeHtml(h)}</th>`).join("")}</tr>
                </thead>
                <tbody>
                  ${tbl.rows
                    .map(
                      (row) =>
                        `<tr>${row.map((cell) => `<td>${formatRich(cell)}</td>`).join("")}</tr>`
                    )
                    .join("")}
                </tbody>
              </table>
            </div>
          </section>
        `;
      }
    }

    // 4. Top 20 Rapid-Fire Viva Q&A (Accordion with native <details>)
    const accordionId = `viva-acc-${exp.num}`;
    html += `
      <section class="card" aria-labelledby="viva-heading-${exp.num}">
        <div class="card-header">
          <h3 class="card-title" id="viva-heading-${exp.num}">🎯 Top ${exp.vivaQA.length} Rapid-Fire Viva Q&amp;A</h3>
          <div class="qa-controls">
            <button type="button" class="qa-toggle-btn" id="toggleAllQaBtn" commandfor="${accordionId}" command="--toggle-all" aria-expanded="false">
              <span class="label-expand">Expand all</span>
              <span class="label-collapse">Collapse all</span>
            </button>
          </div>
        </div>
        <div class="accordion" id="${accordionId}">
          ${exp.vivaQA
            .map((qa, i) => {
              const codeBtn = qa.codeRef
                ? `<div><button type="button" class="see-code-link" data-file="${escapeHtml(qa.codeRef.fileId)}" data-hl="${escapeHtml(qa.codeRef.hlId)}">💻 See in Code ↗</button></div>`
                : "";
              return `
                <details data-qa-idx="${i}">
                  <summary><span><span class="qa-num">Q${i + 1}.</span> ${formatRich(qa.q)}</span></summary>
                  <div class="qa-body">
                    <div>${formatRich(qa.a)}</div>
                    ${codeBtn}
                  </div>
                </details>
              `;
            })
            .join("")}
        </div>
      </section>
    `;

    // 5. Pro Tips & Compile Command
    html += `
      <aside class="callout callout-tip">
        <p class="callout-title">🔥 Last-Minute Viva Pro Tips</p>
        <ul>
          ${exp.proTips.map((t) => `<li>${formatRich(t)}</li>`).join("")}
        </ul>
        <div class="cmd-box">
          <code>${escapeHtml(exp.compileCmd)}</code>
          <button type="button" class="copy-mini-btn" id="copyRunCmdFooter">Copy</button>
        </div>
      </aside>
    `;

    vivaViewEl.innerHTML = html;

    // Wire "See in Code" links inside Q&A
    vivaViewEl.querySelectorAll(".see-code-link").forEach((btn) => {
      btn.addEventListener("click", () => {
        jumpToCodeHighlight(exp.num, btn.dataset.file, btn.dataset.hl);
      });
    });

    // Wire copy command
    const copyFooterBtn = document.getElementById("copyRunCmdFooter");
    if (copyFooterBtn) {
      copyFooterBtn.addEventListener("click", () => copyText(exp.compileCmd, "Command copied!"));
    }

    // Fallback for browsers without invoker commands (per modern-web-guidance accordion)
    const toggleAllBtn = document.getElementById("toggleAllQaBtn");
    if (toggleAllBtn && !Object.hasOwn(HTMLButtonElement.prototype, "commandForElement")) {
      toggleAllBtn.addEventListener("click", () => {
        const acc = document.getElementById(accordionId);
        const expand = toggleAllBtn.getAttribute("aria-expanded") !== "true";
        for (const d of acc.querySelectorAll(":scope > details")) {
          d.open = expand;
        }
        toggleAllBtn.setAttribute("aria-expanded", String(expand));
      });
    }
  }

  function renderCode() {
    const exp = currentExp();
    if (!state.fileId || !exp.files.some((f) => f.id === state.fileId)) {
      state.fileId = exp.files[0].id;
    }
    const file = exp.files.find((f) => f.id === state.fileId) || exp.files[0];

    // File tabs (if >1 file)
    const fileTabsHtml =
      exp.files.length > 1
        ? `<div class="file-tabs" role="tablist" aria-label="Source files">
            ${exp.files
              .map(
                (f) =>
                  `<button type="button" role="tab" class="file-tab ${f.id === file.id ? "active" : ""}" aria-selected="${f.id === file.id}" data-file-id="${escapeHtml(f.id)}">${escapeHtml(f.name)}</button>`
              )
              .join("")}
          </div>`
        : "";

    // Quick-jump highlight chips
    const chipsHtml = file.highlights.length
      ? `<div class="highlight-chips">
          ${file.highlights
            .map((h) => {
              const cls = h.badge === "VIVA TRAP" ? "hl-chip trap" : "hl-chip";
              return `<button type="button" class="${cls}" data-jump-hl="${escapeHtml(h.id)}">★ ${escapeHtml(h.label)} (L${h.startLine}${h.endLine > h.startLine ? `–${h.endLine}` : ""})</button>`;
            })
            .join("")}
        </div>`
      : "";

    // Render code lines grouped with highlighted bands
    const lines = file.code.replace(/\r\n/g, "\n").split("\n");
    const hlByStart = new Map();
    const covered = new Set();
    for (const h of file.highlights) {
      hlByStart.set(h.startLine, h);
      for (let ln = h.startLine; ln <= h.endLine; ln++) covered.add(ln);
    }

    let codeBodyHtml = "";
    for (let i = 0; i < lines.length; i++) {
      const lineNo = i + 1;
      if (hlByStart.has(lineNo)) {
        const h = hlByStart.get(lineNo);
        const badgeClass =
          h.badge === "VIVA TRAP"
            ? "badge-trap"
            : h.badge === "CORE ALGO"
            ? "badge-algo"
            : h.badge === "SYSCALL"
            ? "badge-syscall"
            : "";

        let groupLinesHtml = "";
        for (let ln = h.startLine; ln <= Math.min(h.endLine, lines.length); ln++) {
          groupLinesHtml += `
            <div class="code-line">
              <span class="line-num">${ln}</span>
              <span class="line-text">${highlightSyntax(lines[ln - 1], file.lang)}</span>
            </div>
          `;
        }

        const isOpen = state.showAllExplanations;
        codeBodyHtml += `
          <div class="hl-group ${badgeClass}" id="hl-${escapeHtml(h.id)}" data-hl-id="${escapeHtml(h.id)}">
            <button type="button" class="hl-banner" aria-expanded="${isOpen}">
              <span class="hl-banner-left">
                <span class="hl-badge">${escapeHtml(h.badge || "KEY")}</span>
                <span>${escapeHtml(h.label)}</span>
              </span>
              <span class="hl-toggle-hint">${isOpen ? "Hide note ▲" : "Tap to explain ▼"}</span>
            </button>
            ${groupLinesHtml}
            <div class="hl-explain" ${isOpen ? "" : "hidden"}>${formatRich(h.explanation)}</div>
          </div>
        `;
        i = Math.min(h.endLine, lines.length) - 1;
      } else if (!covered.has(lineNo)) {
        codeBodyHtml += `
          <div class="code-line">
            <span class="line-num">${lineNo}</span>
            <span class="line-text">${highlightSyntax(lines[i], file.lang)}</span>
          </div>
        `;
      }
    }

    codeViewEl.innerHTML = `
      ${fileTabsHtml}
      <section class="card">
        <div class="code-toolbar">
          <h3 class="card-title">💻 ${escapeHtml(file.name)}</h3>
          <div class="qa-controls">
            <button type="button" class="qa-toggle-btn" id="toggleAllNotesBtn">
              ${state.showAllExplanations ? "Hide all notes" : "Show all notes"}
            </button>
            <button type="button" class="qa-toggle-btn" id="copyCodeBtn">📋 Copy Code</button>
          </div>
        </div>
        <p class="code-file-desc">${formatRich(file.desc)}</p>
        ${chipsHtml}
        <div class="code-shell">
          <div class="code-shell-header">
            <span class="code-filename">${escapeHtml(file.path)}</span>
            <span>${file.highlights.length} highlighted parts</span>
          </div>
          <div class="code-scroll">${codeBodyHtml}</div>
        </div>
        <div class="cmd-box">
          <code>${escapeHtml(exp.compileCmd)}</code>
          <button type="button" class="copy-mini-btn" id="copyCodeRunCmd">Copy</button>
        </div>
      </section>
    `;

    // Wire file tabs
    codeViewEl.querySelectorAll(".file-tab").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.fileId = btn.dataset.fileId;
        renderCode();
        updateHash();
      });
    });

    // Wire jump chips
    codeViewEl.querySelectorAll(".hl-chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        focusHighlight(chip.dataset.jumpHl);
      });
    });

    // Wire individual highlight explanation toggles
    codeViewEl.querySelectorAll(".hl-banner").forEach((banner) => {
      banner.addEventListener("click", () => {
        const group = banner.closest(".hl-group");
        const explain = group.querySelector(".hl-explain");
        const hint = banner.querySelector(".hl-toggle-hint");
        const nextOpen = explain.hidden;
        explain.hidden = !nextOpen;
        banner.setAttribute("aria-expanded", String(nextOpen));
        hint.textContent = nextOpen ? "Hide note ▲" : "Tap to explain ▼";
      });
    });

    // Wire Show/Hide all notes
    document.getElementById("toggleAllNotesBtn").addEventListener("click", () => {
      state.showAllExplanations = !state.showAllExplanations;
      renderCode();
    });

    // Wire Copy Code
    document.getElementById("copyCodeBtn").addEventListener("click", () => {
      copyText(file.code, `Copied ${file.name}!`);
    });

    document.getElementById("copyCodeRunCmd").addEventListener("click", () => {
      copyText(exp.compileCmd, "Compile & run command copied!");
    });
  }

  function focusHighlight(hlId) {
    const el = document.getElementById(`hl-${hlId}`);
    if (!el) return;
    const explain = el.querySelector(".hl-explain");
    const banner = el.querySelector(".hl-banner");
    const hint = el.querySelector(".hl-toggle-hint");
    if (explain) explain.hidden = false;
    if (banner) banner.setAttribute("aria-expanded", "true");
    if (hint) hint.textContent = "Hide note ▲";

    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.classList.add("flash");
    setTimeout(() => el.classList.remove("flash"), 1400);
  }

  function jumpToCodeHighlight(expNum, fileId, hlId) {
    const idx = EXPERIMENTS.findIndex((e) => e.num === expNum);
    if (idx >= 0) state.expIndex = idx;
    if (fileId) state.fileId = fileId;
    setMode("code", false);
    if (hlId) {
      requestAnimationFrame(() => focusHighlight(hlId));
    }
  }

  function setMode(mode, scrollTop) {
    state.mode = mode;
    const isViva = mode === "viva";
    tabVivaEl.setAttribute("aria-selected", String(isViva));
    tabCodeEl.setAttribute("aria-selected", String(!isViva));
    vivaViewEl.hidden = !isViva;
    codeViewEl.hidden = isViva;

    floatingCtaLabel.textContent = isViva ? "Go to Code" : "Back to Viva";
    floatingCtaArrow.textContent = isViva ? "→" : "←";

    renderHero();
    if (isViva) {
      renderViva();
    } else {
      renderCode();
    }
    updateHash();
    if (scrollTop) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function selectExperiment(idx, mode) {
    state.expIndex = Math.max(0, Math.min(idx, EXPERIMENTS.length - 1));
    state.fileId = EXPERIMENTS[state.expIndex].files[0].id;
    renderPills();
    setMode(mode || state.mode, true);
  }

  function updateHash() {
    const exp = currentExp();
    const parts = [`exp-${exp.num}`, state.mode];
    if (state.mode === "code" && state.fileId) parts.push(state.fileId);
    const nextHash = "#" + parts.join("/");
    if (location.hash !== nextHash) {
      history.replaceState(null, "", nextHash);
    }
  }

  function applyHash() {
    const h = location.hash.replace(/^#/, "");
    if (!h) return;
    const [expPart, modePart, filePart] = h.split("/");
    const num = parseInt((expPart || "").replace("exp-", ""), 10);
    const idx = EXPERIMENTS.findIndex((e) => e.num === num);
    if (idx >= 0) state.expIndex = idx;
    if (modePart === "code" || modePart === "viva") state.mode = modePart;
    if (filePart) state.fileId = filePart;
  }

  function copyText(text, toastMsg) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        () => showToast(toastMsg),
        () => fallbackCopy(text, toastMsg)
      );
    } else {
      fallbackCopy(text, toastMsg);
    }
  }

  function fallbackCopy(text, toastMsg) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      showToast(toastMsg);
    } catch (_) {
      showToast("Copy failed");
    }
    document.body.removeChild(ta);
  }

  // =========================================================================
  // Native Invoker Command & Toggle Sync (per modern-web-guidance accordion)
  // =========================================================================
  document.addEventListener(
    "command",
    (event) => {
      if (event.command !== "--toggle-all") return;
      const expand = event.source.getAttribute("aria-expanded") !== "true";
      for (const details of event.target.querySelectorAll(":scope > details")) {
        details.open = expand;
      }
      event.source.setAttribute("aria-expanded", String(expand));
    },
    { capture: true }
  );

  document.addEventListener(
    "toggle",
    (event) => {
      if (!event.target.matches(".accordion > details")) return;
      const accordion = event.target.parentElement;
      const btn = document.querySelector(`[commandfor="${accordion.id}"]`);
      if (!btn) return;
      const items = accordion.querySelectorAll(":scope > details");
      const allOpen = Array.prototype.every.call(items, (d) => d.open);
      btn.setAttribute("aria-expanded", String(allOpen));
    },
    { capture: true }
  );

  // =========================================================================
  // Global Search across all 8 practicals
  // =========================================================================
  searchToggleBtn.addEventListener("click", () => {
    const opening = searchPanelEl.hidden;
    searchPanelEl.hidden = !opening;
    searchToggleBtn.setAttribute("aria-expanded", String(opening));
    if (opening) {
      searchInputEl.focus();
    } else {
      searchResultsEl.hidden = true;
    }
  });

  clearSearchBtn.addEventListener("click", () => {
    searchInputEl.value = "";
    clearSearchBtn.hidden = true;
    searchResultsEl.hidden = true;
    searchInputEl.focus();
  });

  searchInputEl.addEventListener("input", () => {
    const q = searchInputEl.value.trim().toLowerCase();
    clearSearchBtn.hidden = !q;
    if (q.length < 2) {
      searchResultsEl.hidden = true;
      return;
    }

    const hits = [];
    for (const exp of EXPERIMENTS) {
      // Search Viva Q&A
      exp.vivaQA.forEach((qa, qi) => {
        if (qa.q.toLowerCase().includes(q) || qa.a.toLowerCase().includes(q)) {
          hits.push({
            expNum: exp.num,
            type: "Viva Q&A",
            title: `Q${qi + 1}. ${qa.q}`,
            snippet: qa.a,
            action: () => {
              const idx = EXPERIMENTS.findIndex((e) => e.num === exp.num);
              state.expIndex = idx;
              renderPills();
              setMode("viva", false);
              requestAnimationFrame(() => {
                const det = vivaViewEl.querySelector(`details[data-qa-idx="${qi}"]`);
                if (det) {
                  det.open = true;
                  det.scrollIntoView({ behavior: "smooth", block: "center" });
                }
              });
            },
          });
        }
      });

      // Search Code Highlights
      for (const file of exp.files) {
        for (const hl of file.highlights) {
          if (hl.label.toLowerCase().includes(q) || hl.explanation.toLowerCase().includes(q)) {
            hits.push({
              expNum: exp.num,
              type: `Code · ${file.name}`,
              title: hl.label,
              snippet: hl.explanation,
              action: () => {
                const idx = EXPERIMENTS.findIndex((e) => e.num === exp.num);
                state.expIndex = idx;
                renderPills();
                jumpToCodeHighlight(exp.num, file.id, hl.id);
              },
            });
          }
        }
      }
    }

    if (!hits.length) {
      searchResultsEl.innerHTML = `<div class="search-result-item"><div class="search-result-title">No matches for "${escapeHtml(q)}"</div></div>`;
    } else {
      searchResultsEl.innerHTML = hits
        .slice(0, 18)
        .map(
          (h, idx) => `
          <button type="button" class="search-result-item" data-hit-idx="${idx}">
            <div class="search-result-meta">Exp ${h.expNum} · ${escapeHtml(h.type)}</div>
            <div class="search-result-title">${escapeHtml(h.title)}</div>
            <div class="search-result-snippet">${escapeHtml(h.snippet.slice(0, 110))}${h.snippet.length > 110 ? "…" : ""}</div>
          </button>`
        )
        .join("");

      searchResultsEl.querySelectorAll(".search-result-item").forEach((btn) => {
        btn.addEventListener("click", () => {
          const hit = hits[Number(btn.dataset.hitIdx)];
          if (hit) {
            searchPanelEl.hidden = true;
            searchResultsEl.hidden = true;
            searchToggleBtn.setAttribute("aria-expanded", "false");
            hit.action();
          }
        });
      });
    }
    searchResultsEl.hidden = false;
  });

  // =========================================================================
  // Event Listeners & Init
  // =========================================================================
  expPillsEl.addEventListener("click", (e) => {
    const pill = e.target.closest(".exp-pill");
    if (!pill) return;
    selectExperiment(Number(pill.dataset.expIdx), state.mode);
  });

  tabVivaEl.addEventListener("click", () => setMode("viva", false));
  tabCodeEl.addEventListener("click", () => setMode("code", false));
  floatingCtaBtn.addEventListener("click", () => setMode(state.mode === "viva" ? "code" : "viva", true));

  applyHash();
  updateProgressUI();
  renderPills();
  setMode(state.mode, false);
})();
