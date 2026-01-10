

async function loadPeopleIndex() {
  const res = await fetch("./data/people_index.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Could not load ./data/people_index.json");
  return await res.json();
}

const view = document.getElementById("view");
const sidebar = document.getElementById("sidebar");
document.getElementById("menuBtn").onclick = () =>
  sidebar.classList.toggle("open");

function setActive(route) {
  document.querySelectorAll(".nav").forEach(a =>
    a.classList.toggle("active", a.dataset.route === route)
  );
}

function renderForside() {
  view.innerHTML = `
    <h1>Forside</h1>
    <p class="muted">
      Alt materiale samlet ét sted til forberedelse af Indfødsretsprøven.
    </p>

    <div class="card">
      <ul>
        <li><a href="#/aktuelt">Aktuelle emner (Daily Test)</a></li>
        <li><a href="#/kapitler">Kapitel-quizzer</a></li>
        <li><a href="#/gemte-proever">Gemte prøver</a></li>
      </ul>
    </div>
  `;
}

async function loadConfig() {
  const res = await fetch("./data/citizenship_resources.json");
  return res.json();
}

async function renderKapitler() {
  const cfg = await loadConfig();
  view.innerHTML = `
    <h1>Kapitel-quizzer</h1>
    <div class="card">
      ${cfg.chapters.map(c =>
        `<a class="pill" href="${c.url}" target="_blank">📘 ${c.title}</a>`
      ).join("")}
    </div>
  `;
}

async function renderRessourcer() {
  const cfg = await loadConfig();
  view.innerHTML = `
    <h1>Ressourcer</h1>
    <div class="card">
      <ul>
        ${cfg.resources.map(r =>
          `<li><a href="${r.url}" target="_blank">${r.title}</a></li>`
        ).join("")}
      </ul>
    </div>
  `;
}

function renderDanskeVaerdier() {
  view.innerHTML = `
    <h1>Danske værdier</h1>
    <div class="card">
      Demokrati, retsstat, ligestilling, ytringsfrihed,
      religionsfrihed, tillid og fællesskab.
    </div>
  `;
}

function renderAktuelt() {
  view.innerHTML = `
    <h1>Aktuelle emner</h1>
    <iframe class="embed" src="./index.html"></iframe>
  `;
}

function renderGemteProever() {
  view.innerHTML = `
    <h1>Gemte prøver</h1>
    <div class="card">
      <p>Eksempel:</p>
      <a class="pill" href="./2025_nov_09.html?date=2025-11-09" target="_blank">
        Åbn prøve 2025-11-09
      </a>
    </div>
  `;
}

const routes = {
  "forside": renderForside,
  "kapitler": renderKapitler,
  "danske-vaerdier": renderDanskeVaerdier,
  "ressourcer": renderRessourcer,
  "aktuelt": renderAktuelt,
  "gemte-proever": renderGemteProever
};

function navigate() {
  const route = (location.hash || "#/forside").replace("#/", "");
  setActive(route);
  (routes[route] || renderForside)();
  sidebar.classList.remove("open");
}

window.addEventListener("hashchange", navigate);
navigate();
