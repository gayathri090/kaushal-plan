const view = document.getElementById("view");
const sidebar = document.getElementById("sidebar");
document.getElementById("menuBtn").onclick = () =>
  sidebar.classList.toggle("open");

function setActive(route){
  document.querySelectorAll(".nav").forEach(n =>
    n.classList.toggle("active", n.dataset.route === route)
  );
}

function pill(p){ 
  return `<a class="pill" href="${p.url}" target="_blank">👤 ${p.name}</a>`; 
}

async function loadPeople(){
  const res = await fetch("./data/people_index.json");
  return await res.json();
}

function renderForside(){
  view.innerHTML = `
    <h1>Forside</h1>
    <div class="card">
      Samlet dansk viden til Indfødsretsprøven:
      kapitler, danske værdier, aktuelle emner og alle personer.
    </div>`;
}

function renderKapitler(){
  view.innerHTML = `
    <h1>Kapitel 1–6</h1>
    <div class="card">
      <div class="pills">
        <a class="pill" href="https://nearlydanish.com/ind/kapitel-1/" target="_blank">Kapitel 1</a>
        <a class="pill" href="https://nearlydanish.com/ind/kapitel-2/" target="_blank">Kapitel 2</a>
        <a class="pill" href="https://nearlydanish.com/ind/kapitel-3/" target="_blank">Kapitel 3</a>
        <a class="pill" href="https://nearlydanish.com/ind/kapitel-4/" target="_blank">Kapitel 4</a>
        <a class="pill" href="https://nearlydanish.com/ind/kapitel-5/" target="_blank">Kapitel 5</a>
        <a class="pill" href="https://nearlydanish.com/ind/kapitel-6/" target="_blank">Kapitel 6</a>
      </div>
    </div>`;
}

function renderVaerdier(){
  view.innerHTML = `
    <h1>Danske værdier</h1>
    <div class="card">
      <div class="pills">
        <a class="pill" href="https://nearlydanish.com/ind/dansk-vaerdier/" target="_blank">Dansk værdier</a>
        <a class="pill" href="https://nearlydanish.com/ind/dansk-vaerdier-videos/" target="_blank">Værdier – Video</a>
      </div>
    </div>`;
}

function renderAktuelt(){
  view.innerHTML = `
    <h1>Aktuelle emner</h1>
    <div class="card">
      <div class="pills">
        <a class="pill" href="https://nearlydanish.com/ind/current-affairs/" target="_blank">Current Affairs</a>
        <a class="pill" href="./index.html" target="_blank">Din daglige test</a>
      </div>
    </div>`;
}

async function renderPersoner(){
  const data = await loadPeople();
  let html = `<h1>Personer</h1>`;
  for (const [group, content] of Object.entries(data.people)) {
    html += `<div class="card"><h2>${group}</h2>`;
    for (const [sub, arr] of Object.entries(content)) {
      if (Array.isArray(arr)) {
        html += `<h3>${sub}</h3><div class="pills">${arr.map(pill).join("")}</div>`;
      }
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
}
window.onhashchange = nav;
nav();
