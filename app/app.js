// DealSift app logic: renders the deal grid and wires up search, filters and
// sorting. All state lives in the URL query string, so a filtered view is a
// shareable link and the page reloads to the same view.

import { DEALS, CATEGORIES, STORES, SIGNALS, CHECKED_AT_SHORT, discountPct, savedAmount, dealScore, fmtUsd } from "./deals.js";

const grid = document.getElementById("deal-grid");
const countLine = document.getElementById("result-count");
const emptyState = document.getElementById("empty-state");
const searchInput = document.getElementById("search");
const categorySelect = document.getElementById("category");
const storeSelect = document.getElementById("store");
const discountSelect = document.getElementById("discount");
const signalSelect = document.getElementById("signal");
const sortSelect = document.getElementById("sort");

function fillSelect(select, values, allLabel) {
  for (const v of values) {
    const opt = document.createElement("option");
    opt.value = v;
    opt.textContent = v;
    select.appendChild(opt);
  }
  select.insertBefore(Object.assign(document.createElement("option"), { value: "", textContent: allLabel }), select.firstChild);
}
fillSelect(categorySelect, CATEGORIES, "All categories");
fillSelect(storeSelect, STORES, "All stores");
fillSelect(signalSelect, SIGNALS, "Any signal");

function readParams() {
  const p = new URLSearchParams(location.search);
  return {
    q: (p.get("q") || "").trim(),
    category: p.get("category") || "",
    store: p.get("store") || "",
    discount: p.get("discount") || "",
    signal: p.get("signal") || "",
    sort: p.get("sort") || "best",
  };
}

function writeParams(state) {
  const p = new URLSearchParams();
  if (state.q) p.set("q", state.q);
  if (state.category) p.set("category", state.category);
  if (state.store) p.set("store", state.store);
  if (state.discount) p.set("discount", state.discount);
  if (state.signal) p.set("signal", state.signal);
  if (state.sort && state.sort !== "best") p.set("sort", state.sort);
  const url = p.toString() ? "?" + p.toString() : location.pathname;
  history.replaceState(null, "", url);
}

function applyFilters(deals, s) {
  const q = s.q.toLowerCase();
  let out = deals.filter((d) => {
    if (s.category && d.category !== s.category) return false;
    if (s.store && d.store !== s.store) return false;
    if (s.signal && d.signal !== s.signal) return false;
    if (s.discount) {
      const min = parseInt(s.discount, 10);
      if (discountPct(d) < min) return false;
    }
    if (q) {
      const hay = (d.name + " " + d.store + " " + d.category + " " + d.note).toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
  const by = {
    best: (a, b) => dealScore(b) - dealScore(a) || discountPct(b) - discountPct(a),
    pct: (a, b) => discountPct(b) - discountPct(a) || savedAmount(b) - savedAmount(a),
    saved: (a, b) => savedAmount(b) - savedAmount(a),
    price: (a, b) => a.sale - b.sale,
    az: (a, b) => a.name.localeCompare(b.name),
  };
  return out.sort(by[s.sort] || by.best);
}

function signalClass(signal) {
  return "sig-" + signal.toLowerCase().replace(/ /g, "-");
}

function storeClass(store) {
  return "store-" + store.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function card(d) {
  const el = document.createElement("article");
  el.className = "card";
  el.dataset.id = d.id;
  const pct = discountPct(d);
  const saved = savedAmount(d);
  const compareLine = d.compare
    ? `<p class="compare">Also at ${d.compare.store} — ${fmtUsd(d.compare.sale)}</p>`
    : "";
  el.innerHTML = `
    <div class="card-top">
      <span class="chip cat">${d.category}</span>
      <span class="chip store ${storeClass(d.store)}">${d.store}</span>
      <span class="chip signal ${signalClass(d.signal)}">${d.signal}</span>
    </div>
    <h3 class="card-name">${d.name}</h3>
    <div class="price-row">
      <span class="sale">${fmtUsd(d.sale)}</span>
      <span class="usual">${fmtUsd(d.usual)}</span>
      <span class="pct">−${pct}%</span>
    </div>
    <p class="saved">You save ${fmtUsd(saved)}</p>
    <p class="note">${d.note}</p>
    ${compareLine}
    <p class="meta">Checked ${d.checked} · Source: ${d.source}</p>
    <a class="cta" href="${d.link}" target="_blank" rel="noopener">View at ${d.store} &rarr;</a>`;
  return el;
}

function render() {
  const state = readParams();
  searchInput.value = state.q;
  categorySelect.value = state.category;
  storeSelect.value = state.store;
  discountSelect.value = state.discount;
  signalSelect.value = state.signal;
  sortSelect.value = state.sort;
  const shown = applyFilters(DEALS, state);
  grid.replaceChildren(...shown.map(card));
  countLine.textContent = `Showing ${shown.length} of ${DEALS.length} deals · Prices checked ${CHECKED_AT_SHORT}`;
  emptyState.hidden = shown.length !== 0;
  grid.hidden = shown.length === 0;
}

function onControlChange() {
  const state = {
    q: searchInput.value.trim(),
    category: categorySelect.value,
    store: storeSelect.value,
    discount: discountSelect.value,
    signal: signalSelect.value,
    sort: sortSelect.value,
  };
  writeParams(state);
  render();
}

searchInput.addEventListener("input", onControlChange);
for (const sel of [categorySelect, storeSelect, discountSelect, signalSelect, sortSelect]) {
  sel.addEventListener("change", onControlChange);
}
document.getElementById("clear-filters").addEventListener("click", () => {
  searchInput.value = "";
  categorySelect.value = "";
  storeSelect.value = "";
  discountSelect.value = "";
  signalSelect.value = "";
  sortSelect.value = "best";
  onControlChange();
});

render();
