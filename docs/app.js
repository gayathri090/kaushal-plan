const view = document.getElementById("view");
const sidebar = document.getElementById("sidebar");
const menuBtn = document.getElementById("menuBtn");

menuBtn.addEventListener("click", () => sidebar.classList.toggle("open"));

function setActive(route){
  document.querySelectorAll(".nav").forEach(a=>{
    a.classList.toggle("active", a.getAttribute("data-route")===route);
  });
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, m => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[m]));
}

function pill(person) {
  return `<a class="pill" href="${person.url}" target="_blank" rel="noopener">👤 ${esc(person.name)}</a>`;
}

async function loadPeople(){
  const res = await fetch("./data/people_index.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Missing docs/data/people_index.json");
  return await res.json();
}

/* Bilingual labels matching YOUR keys */
const GROUP_LABELS = {
  authors: "Forfattere / Authors",
  musicians: "Musikere / Musicians",
  kingsQueens: "Konger og Dronninger / Kings & Queens",
  politicians: "Politikere / Politicians",
  architectsDesigners: "Arkitekter & designere / Architects & designers",
  filmPeople: "Folk i film / Film people",
  scientistsPhilosophers: "Videnskabsmænd & filosoffer / Scientists & philosophers"
};

const SUBGROUP_LABELS = {
  // Authors
  general: "Generelt / General",
  nobelPrizeWinners: "Nobelprisvindere / Nobel Prize winners",
  poets: "Digtere / Poets",

  // Musicians
  psalmists: "Salmedigtere / Psalmists",
  composers: "Komponister / Composers",
  jazz: "Jazz / Jazz",
  rock: "Rock / Rock",
  pop: "Pop / Pop",
  eurovisionWinners: "Eurovision-vindere / Eurovision winners",

  // Kings & Queens
  vikingKings: "Vikingekonger / Viking kings",
  medieval: "Middelalder / Medieval",
  reformation: "Reformation / Reformation",
  absoluteMonarchy: "Enevælde / Absolute monarchy",
  constitutionalMonarchy: "Konstitutionelt monarki / Constitutional monarchy",

  // Politicians
  primeMinisters: "Statsministre / Prime ministers",
  otherPoliticians: "Andre politikere / Other politicians",

  // Film
  actors: "Skuespillere / Actors",
  directors: "Instruktører / Directors",
  screenwriters: "Manuskriptforfattere / Screenwriters",
  oscarWinningDirectors: "Oscar-vindende instruktører / Oscar-winning directors",

  // Science
  earlyScientists: "Tidlige videnskabsmænd / Early scientists",
  philosophers: "Filosoffer / Philosophers",
  modernScientists: "Nylige videnskabsmænd / Modern scientists",
  nobelPrizeWinners: "Nobelprisvindere / Nobel Prize winners"
};

function renderForside(){
  view.innerHTML = `
    <h1>Forside</h1>
    <div class="card">
      <p class="muted">Samlet side til Indfødsretsprøven: kapitler, danske værdier, aktuelle emner og personer.</p>
      <div class="pills">
        <a class="pill" href="#/kapitler">📚 Kapitel 1–6</a>
        <a class="pill" href="#/vaerdier">🇩🇰 Danske værdier</a>
        <a class="pill" href="#/aktuelt">📰 Aktuelle emner</a>
        <a class="pill" href="#/personer">👤 Personer / People</a>
      </div>
    </div>
  `;
}

function renderKapitler(){
  view.innerHTML = `
    <h1>Kapitel 1–6</h1>
    <div class="card">
      <div class="pills">
        <a class="pill" href="https://nearlydanish.com/ind/kapitel-1/" target="_blank" rel="noopener">Kapitel 1</a>
        <a class="pill" href="https://nearlydanish.com/ind/kapitel-2/" target="_blank" rel="noopener">Kapitel 2</a>
        <a class="pill" href="https://nearlydanish.com/ind/kapitel-3/" target="_blank" rel="noopener">Kapitel 3</a>
        <a class="pill" href="https://nearlydanish.com/ind/kapitel-4/" target="_blank" rel="noopener">Kapitel 4</a>
        <a class="pill" href="https://nearlydanish.com/ind/kapitel-5/" target="_blank" rel="noopener">Kapitel 5</a>
        <a class="pill" href="https://nearlydanish.com/ind/kapitel-6/" target="_blank" rel="noopener">Kapitel 6</a>
      </div>
    </div>
  `;
}

function renderVaerdier(){
  view.innerHTML = `
    <h1>Danske værdier</h1>
    <div class="card">
      <div class="pills">
        <a class="pill" href="https://nearlydanish.com/ind/dansk-vaerdier/" target="_blank" rel="noopener">Dansk værdier</a>
        <a class="pill" href="https://nearlydanish.com/ind/dansk-vaerdier-videos/" target="_blank" rel="noopener">Dansk værdier (Video)</a>
      </div>
    </div>
  `;
}

function renderAktuelt(){
  view.innerHTML = `
    <h1>Aktuelle emner</h1>
    <div class="card">
      <div class="pills">
        <a class="pill" href="https://nearlydanish.com/ind/current-affairs/" target="_blank" rel="noopener">NearlyDanish – Current Affairs</a>
        <a class="pill" href="./index.html" target="_blank" rel="noopener">Din daglige test (Current Affairs)</a>
      </div>
    </div>
  `;
}

async function renderPersoner(){
  let data;
  try {
    data = await loadPeople();
  } catch (e) {
    view.innerHTML = `
      <h1>Personer / People</h1>
      <div class="card">
        <p class="muted">Kunne ikke indlæse <code>docs/data/people_index.json</code>.</p>
      </div>
    `;
    return;
  }

  const people = data.people || {};
  let html = `<h1>Personer / People</h1><p class="muted">Overskrifter vises på dansk og engelsk.</p>`;

  for (const [groupKey, content] of Object.entries(people)) {
    const groupTitle = GROUP_LABELS[groupKey] || `${groupKey} / ${groupKey}`;
    html += `<div class="card"><h2>${esc(groupTitle)}</h2>`;

    // architectsDesigners is an array in your JSON
    if (Array.isArray(content)) {
      html += `<div class="pills">${content.map(pill).join("")}</div>`;
      html += `</div>`;
      continue;
    }

    // others are objects of arrays
    for (const [subKey, arr] of Object.entries(content || {})) {
      if (!Array.isArray(arr)) continue;
      const subTitle = SUBGROUP_LABELS[subKey] || `${subKey} / ${subKey}`;
      html += `<h3>${esc(subTitle)}</h3><div class="pills">${arr.map(pill).join("")}</div>`;
    }

    html += `</div>`;
  }

  view.innerHTML = html;
}

const routes = {
  "forside": () => { setActive("forside"); renderForside(); },
  "kapitler": () => { setActive("kapitler"); renderKapitler(); },
  "vaerdier": () => { setActive("vaerdier"); renderVaerdier(); },
  "aktuelt": () => { setActive("aktuelt"); renderAktuelt(); },
  "personer": () => { setActive("personer"); renderPersoner(); }
};

function nav(){
  const r = (location.hash || "#/forside").replace("#/","");
  (routes[r] || routes.forside)();
  sidebar.classList.remove("open");
}
window.addEventListener("hashchange", nav);
nav();
