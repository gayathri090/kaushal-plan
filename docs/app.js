const view = document.getElementById("view");
const sidebar = document.getElementById("sidebar");
const menuBtn = document.getElementById("menuBtn");
const nulstilBtn = document.getElementById("nulstilBtn");

menuBtn.addEventListener("click", () => sidebar.classList.toggle("open"));

const STORAGE_KEY = "kaushal_mom_plan_v1";

/**
 * Minimal AI-plan struktur (du kan ændre teksterne)
 */
const MOM_PLAN = [
  { id: "m1", titel: "Uge 1: Fundament", opgaver: [
      "Daglig 30 min: Læsning / repetition",
      "Daglig 15 min: Quiz-træning",
      "Weekend: Opsummering + svage områder"
    ]
  },
  { id: "m2", titel: "Uge 2: Stabilitet", opgaver: [
      "Daglig 30 min: Kapitelquiz",
      "Daglig 15 min: 'Danske værdier'",
      "Weekend: Mock test"
    ]
  },
  { id: "m3", titel: "Uge 3: Intensiv", opgaver: [
      "Daglig 45 min: Mixed quiz",
      "Daglig 15 min: Fejl-liste",
      "Weekend: 2 mock tests"
    ]
  }
];

function loadState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function pctDone(state) {
  const allTasks = MOM_PLAN.flatMap(w => w.opgaver.map((_, idx) => `${w.id}_${idx}`));
  const done = allTasks.filter(k => state[k]).length;
  return Math.round((done / allTasks.length) * 100);
}

nulstilBtn.addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEY);
  navigate(); // rerender
});

function renderForside() {
  const state = loadState();
  view.innerHTML = `
    <h1>Forside</h1>
    <p class="muted">Alt i app’en er på dansk. Mom Plan har tracking.</p>

    <div class="card">
      <h2>Status</h2>
      <div class="progressRow">
        <div class="progress">
          <div class="bar" style="width:${pctDone(state)}%"></div>
        </div>
        <div class="pct">${pctDone(state)}%</div>
      </div>
      <p class="muted">Fuldførelse af Mom Plan.</p>
      <a class="btnPrimary" href="#/mom-plan">Gå til Mom Plan</a>
    </div>
  `;
}

function renderIndfoedsret() {
  // Her kan du enten:
  // A) linke ud til dine chapter quizzes/resources
  // B) indlejre en side med iframe (hurtigst)
  view.innerHTML = `
    <h1>Indfødsretsprøven</h1>
    <div class="card">
      <p>Kapitel-quizzer og ressourcer.</p>
      <ul>
        <li><a href="../mom.html" target="_blank" rel="noopener">Åbn (ekstern) mom.html</a></li>
        <li><a href="./index.html" target="_blank" rel="noopener">Åbn Daily Test (docs/index.html)</a></li>
      </ul>
      <p class="muted">Tip: Vi kan senere flytte alt ind i app’en uden iframes.</p>
    </div>
  `;
}

function renderDanskVaerdier() {
  view.innerHTML = `
    <h1>Danske værdier</h1>
    <div class="card">
      <p>Her kan du samle materialer om demokrati, retsstat, ligestilling, religionsfrihed osv.</p>
      <p class="muted">Hvis du vil, kan vi automatisk tagge kun 5/45 spørgsmål pr. test som “danske værdier”.</p>
    </div>
  `;
}

function renderRessourcer() {
  view.innerHTML = `
    <h1>Ressourcer</h1>
    <div class="card">
      <ul>
        <li><a href="./index.html" target="_blank" rel="noopener">Daily Test (historik)</a></li>
        <li><a href="../mom.html" target="_blank" rel="noopener">Danish Citizenship Exam (i mom.html)</a></li>
      </ul>
    </div>
  `;
}

function renderMomPlan() {
  const state = loadState();

  const weeksHtml = MOM_PLAN.map(week => {
    const items = week.opgaver.map((txt, idx) => {
      const key = `${week.id}_${idx}`;
      const checked = state[key] ? "checked" : "";
      return `
        <label class="task">
          <input type="checkbox" data-key="${key}" ${checked} />
          <span>${txt}</span>
        </label>
      `;
    }).join("");

    return `
      <div class="card">
        <h2>${week.titel}</h2>
        <div class="tasks">${items}</div>
      </div>
    `;
  }).join("");

  view.innerHTML = `
    <h1>Mom Plan</h1>
    <p class="muted">AI-plan + completion tracking (gemmes lokalt i browseren).</p>

    <div class="card">
      <h2>Overblik</h2>
      <div class="progressRow">
        <div class="progress">
          <div class="bar" style="width:${pctDone(state)}%"></div>
        </div>
        <div class="pct">${pctDone(state)}%</div>
      </div>
      <p class="muted">Klik af når opgaverne er gennemført.</p>
    </div>

    ${weeksHtml}
  `;

  // bind checkboxes
  view.querySelectorAll('input[type="checkbox"][data-key]').forEach(cb => {
    cb.addEventListener("change", (e) => {
      const key = e.target.getAttribute("data-key");
      const s = loadState();
      s[key] = e.target.checked;
      saveState(s);

      // update progress instantly
      const p = pctDone(s);
      view.querySelector(".bar").style.width = p + "%";
      view.querySelector(".pct").textContent = p + "%";
    });
  });
}

const routes = {
  "forside": renderForside,
  "indfoedsret": renderIndfoedsret,
  "dansk-vaerdier": renderDanskVaerdier,
  "ressourcer": renderRessourcer,
  "mom-plan": renderMomPlan
};

function navigate() {
  const hash = (location.hash || "#/forside").replace("#/", "");
  (routes[hash] || renderForside)();
  sidebar.classList.remove("open");
}

window.addEventListener("hashchange", navigate);
navigate();
