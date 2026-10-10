import { filterModels, parseSelection, printGroups } from "./catalog-core.js";

const boot = document.getElementById("experience-data");
const data = boot ? JSON.parse(boot.textContent) : null;
const text = data?.copy;
const SELECTED_KEY = "little-nature.study-cards.v1";
const SESSION_KEY = "little-nature.website-session.v1";
const $ = selector => document.querySelector(selector);
const icons = () => window.LittleNatureIcons?.();
const substitute = (value, replacements) => Object.entries(replacements).reduce((result, [key, item]) => result.replaceAll("{" + key + "}", String(item)), value);
const storage = kind => { try { return window[kind]; } catch { return null; } };
const readStorage = (store, key) => { try { return store?.getItem(key) ?? null; } catch { return null; } };
const writeStorage = (store, key, value) => { try { store?.setItem(key, value); } catch { /* The in-memory experience also works without storage. */ } };
let selected = new Set(parseSelection(readStorage(storage("localStorage"), SELECTED_KEY)));
let selectedHasStorage = readStorage(storage("localStorage"), SELECTED_KEY) !== null;

function updateSelection() {
  for (const button of document.querySelectorAll("[data-card-id]")) {
    const active = selected.has(button.dataset.cardId);
    button.setAttribute("aria-pressed", String(active));
    const label = active ? text.removeCard : text.addCard;
    const model = data.models.find(item => item.id === button.dataset.cardId);
    button.title = label;
    button.setAttribute("aria-label", label + (model ? ": " + model.name : ""));
    button.querySelector("svg, i")?.remove();
    const icon = document.createElement("i");
    icon.setAttribute("data-lucide", active ? "check" : "plus");
    button.prepend(icon);
    const caption = button.querySelector("[data-card-label]");
    if (caption) caption.textContent = label;
  }
  for (const badge of document.querySelectorAll("[data-selection-count]")) {
    badge.textContent = selected.size;
    badge.hidden = selected.size === 0;
  }
  icons();
  if ($("#study-preview")) renderStudyPreview();
}

function saveSelection() {
  selectedHasStorage = true;
  writeStorage(storage("localStorage"), SELECTED_KEY, JSON.stringify([...selected]));
  updateSelection();
}

function startCatalog() {
  const input = $("#model-search");
  if (!input) return;
  const category = $("#category-filter"), theme = $("#theme-filter"), animation = $("#animated-filter");
  const query = new URLSearchParams(location.search);
  theme.value = data.theme || "";
  input.value = query.get("q") || "";
  if ([...category.options].some(option => option.value === query.get("category"))) category.value = query.get("category");
  if ([...theme.options].some(option => option.value === query.get("theme"))) theme.value = query.get("theme");
  animation.checked = query.get("animated") === "1";
  function filter() {
    const matches = filterModels(data.models, { query: input.value, category: category.value, theme: theme.value, animated: animation.checked });
    const ids = new Set(matches.map(model => model.id));
    for (const card of document.querySelectorAll(".specimen-tile")) card.hidden = !ids.has(card.dataset.modelId);
    $("#result-count").textContent = substitute(text.results, { count: matches.length, total: data.models.length });
    $("#catalog-empty").hidden = matches.length !== 0;
    const allLink = $("#search-all-link");
    if (allLink) {
      allLink.hidden = !data.home;
      allLink.href = "/" + data.locale + "/models/?" + new URLSearchParams({ q: input.value });
    }
  }
  for (const element of [input, category, theme, animation]) element.addEventListener("input", filter);
  category.addEventListener("change", () => {
    if (!data.initialCategory || category.value === data.initialCategory) return;
    const suffix = { animal: "animals/", plant: "plants/", special: "special/" }[category.value] || "";
    location.assign("/" + data.locale + "/models/" + suffix);
  });
  theme.addEventListener("change", () => {
    if (!data.theme || theme.value === data.theme) return;
    location.assign("/" + data.locale + (theme.value ? "/collections/" + theme.value + "/" : "/models/"));
  });
  $("#reset-filters")?.addEventListener("click", () => {
    input.value = ""; category.value = data.initialCategory || ""; theme.value = data.theme || ""; animation.checked = false;
    filter(); input.focus();
  });
  input.closest("form").addEventListener("submit", event => { event.preventDefault(); filter(); input.blur(); });
  filter();
}

function element(tag, className, value) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (value != null) node.textContent = value;
  return node;
}

function selectedModels() {
  const byID = new Map(data.models.map(model => [model.id, model]));
  return [...selected].map(id => byID.get(id)).filter(Boolean);
}

function printCard(model, kind, showScientific) {
  const card = element("article", "print-card print-card-" + kind);
  if (kind !== "names") {
    const image = element("img");
    image.src = model.image;
    image.alt = substitute(text.imageAlt, { name: model.name });
    image.width = 1024; image.height = 576;
    card.append(image);
  }
  if (kind !== "pictures") {
    card.append(element("h3", "", model.name));
    if (showScientific && model.scientific) card.append(element("p", "print-scientific", model.scientific));
    card.append(element("p", "print-category", model.categoryLabel));
  }
  return card;
}

function buildPrintable(output) {
  output.replaceChildren();
  const models = selectedModels();
  const mode = $("#card-layout").value;
  const scientific = $("#scientific-names").checked;
  const groups = printGroups(models, mode);
  for (const [index, group] of groups.entries()) {
    const page = element("section", "print-page");
    const header = element("header", "print-heading");
    header.append(element("strong", "", "Little Nature · " + text.studyTitle), element("span", "", (index + 1) + " / " + groups.length));
    const grid = element("div", "print-grid");
    for (const model of group.models) grid.append(printCard(model, group.kind, scientific));
    page.append(header, grid, element("footer", "print-footer", "ar-asia.luopeike.com · ffish.asia / floraZia.com · Sketchfab · CC0"));
    output.append(page);
  }
  $("#print-page-size").textContent = "@page { size: " + ($("#paper-size").value === "Letter" ? "Letter" : "A4") + "; margin: 12mm; }";
}

function renderStudyPreview() {
  const output = $("#study-preview"), models = selectedModels();
  const mode = $("#card-layout").value, scientific = $("#scientific-names").checked;
  output.replaceChildren();
  $("#study-count").textContent = substitute(text.selected, { count: models.length });
  $("#study-empty").hidden = models.length !== 0;
  $("#print-cards").disabled = models.length === 0;
  for (const model of models) {
    const card = printCard(model, mode === "matching" ? "pictures" : "named", scientific);
    const remove = element("button", "icon-button");
    remove.type = "button"; remove.title = text.removeCard;
    remove.setAttribute("aria-label", text.removeCard + ": " + model.name);
    const icon = element("i"); icon.setAttribute("data-lucide", "x"); remove.append(icon);
    remove.addEventListener("click", () => { selected.delete(model.id); saveSelection(); });
    card.append(remove); output.append(card);
  }
  icons();
}

function startStudy() {
  if (!$("#study-preview")) return;
  const known = new Set(data.models.map(model => model.id));
  selected = new Set([...selected].filter(id => known.has(id)));
  if (!selectedHasStorage) selected = new Set(data.models.filter(model => model.featured).slice(0, 6).map(model => model.id));
  for (const id of ["card-layout", "scientific-names", "paper-size"]) $("#" + id).addEventListener("change", renderStudyPreview);
  $("#clear-cards").addEventListener("click", () => { selected.clear(); saveSelection(); });
  $("#select-featured").addEventListener("click", () => { selected = new Set(data.models.filter(model => model.featured).map(model => model.id)); saveSelection(); });
  $("#study-theme").addEventListener("change", event => {
    if (!event.target.value) return;
    selected = new Set(data.models.filter(model => model.themes.includes(event.target.value)).map(model => model.id));
    saveSelection();
  });
  window.addEventListener("beforeprint", () => buildPrintable($("#print-output")));
  $("#print-cards").addEventListener("click", async () => {
    if (!selectedModels().length) return;
    buildPrintable($("#print-output"));
    await Promise.all([...$("#print-output").querySelectorAll("img")].map(image => image.decode().catch(() => {})));
    await document.fonts.ready;
    track("cards_print", { surface: "study", card_count: Math.min(200, selectedModels().length), layout: $("#card-layout").value });
    window.print();
  });
  saveSelection();
}

let sketchfabLoader;
function loadSketchfab() {
  if (window.Sketchfab) return Promise.resolve();
  if (sketchfabLoader) return sketchfabLoader;
  sketchfabLoader = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://static.sketchfab.com/api/sketchfab-viewer-1.12.1.js";
    const timer = setTimeout(() => { script.remove(); reject(new Error("Viewer SDK timed out")); }, 20000);
    script.onload = () => { clearTimeout(timer); resolve(); };
    script.onerror = () => { clearTimeout(timer); script.remove(); reject(new Error("Viewer SDK unavailable")); };
    document.head.append(script);
  }).catch(error => { sketchfabLoader = null; throw error; });
  return sketchfabLoader;
}

function sketchfabViewer(model, stage, onInteraction) {
  return new Promise((resolve, reject) => {
    const frame = element("iframe", "model-frame");
    frame.title = model.name;
    frame.allow = "autoplay; fullscreen; xr-spatial-tracking";
    stage.replaceChildren(frame);
    const timer = setTimeout(() => reject(new Error("Model timed out")), 45000);
    const client = new window.Sketchfab("1.12.1", frame);
    client.init(model.id, {
      autostart: 1, animation_autoplay: 0, ui_infos: 0, ui_stop: 0,
      success(api) {
        api.addEventListener("viewerready", () => {
          clearTimeout(timer);
          api.getCameraLookAt((error, initial) => {
            api.getAnimations((animationError, animations) => {
              const available = !animationError && animations?.length > 0;
              let playing = false;
              resolve({
                animated: available,
                setPlaying(value) {
                  playing = value;
                  if (value) api.play(() => {}); else api.pause(() => {});
                },
                reset() { if (!error && initial) api.setCameraLookAt(initial.position, initial.target, 0.5, () => {}); },
                setVisible(value) {
                  if (value && playing) api.play(() => {});
                  else api.pause(() => {});
                },
                dispose() { api.stop(() => {}); frame.remove(); },
              });
            });
          });
          api.addEventListener("camerastart", onInteraction);
        });
        api.start(() => {});
      },
      error(reason) { clearTimeout(timer); reject(new Error("Model unavailable: " + String(reason))); },
    });
  });
}

async function glbViewer(model, stage, onInteraction) {
  await import("./vendor/model-viewer.js");
  customElements.get("model-viewer").dracoDecoderLocation = "/assets/vendor/draco/";
  const viewer = element("model-viewer");
  viewer.setAttribute("alt", model.name);
  viewer.setAttribute("camera-controls", "");
  viewer.setAttribute("interaction-prompt", "none");
  viewer.setAttribute("shadow-intensity", "0.3");
  viewer.setAttribute("environment-image", "neutral");
  viewer.setAttribute("poster", model.image);
  const loaded = new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Model timed out")), 45000);
    viewer.addEventListener("load", () => { clearTimeout(timer); resolve(); }, { once: true });
    viewer.addEventListener("error", () => { clearTimeout(timer); reject(new Error("Model unavailable")); }, { once: true });
  });
  viewer.addEventListener("camera-change", event => { if (event.detail?.source === "user-interaction") onInteraction(); });
  viewer.src = model.glb;
  stage.replaceChildren(viewer);
  await loaded;
  let playing = false;
  return {
    animated: viewer.availableAnimations.length > 0,
    setPlaying(value) { playing = value; if (value) viewer.play(); else viewer.pause(); },
    reset() { viewer.cameraOrbit = "auto auto auto"; viewer.cameraTarget = "auto auto auto"; viewer.fieldOfView = "auto"; },
    setVisible(value) { if (value && playing) viewer.play(); else viewer.pause(); },
    dispose() { viewer.pause(); viewer.remove(); },
  };
}

async function startViewer() {
  const container = $("#specimen-viewer");
  if (!container) return;
  const model = data.models.find(item => item.id === container.dataset.modelId);
  const stage = $("#viewer-stage"), status = $("#viewer-status"), retry = $("#retry-viewer");
  const poster = container.querySelector(".viewer-poster"), controls = $("#viewer-controls"), toggle = $("#animation-toggle");
  $("#fullscreen-view").hidden = !document.fullscreenEnabled;
  let controller, loading = false, playing = false, observedInteraction = false;
  const onInteraction = () => {
    if (!observedInteraction && controller) {
      observedInteraction = true;
      track("model_interaction", { model_id: model.id, surface: "model" });
    }
  };
  function setPlaying(value, record = true) {
    if (!controller?.animated) return;
    playing = value; controller.setPlaying(value);
    const label = value ? text.pause : text.play;
    toggle.title = label; toggle.setAttribute("aria-label", label); toggle.setAttribute("aria-pressed", String(value));
    toggle.replaceChildren();
    const icon = element("i"); icon.setAttribute("data-lucide", value ? "pause" : "play"); toggle.append(icon); icons();
    if (record) track(value ? "animation_play" : "animation_pause", { model_id: model.id, surface: "model" });
  }
  async function load() {
    if (loading) return;
    loading = true;
    delete container.dataset.error;
    delete container.dataset.ready;
    controller?.dispose(); controller = null;
    const started = performance.now();
    poster.hidden = true; stage.hidden = false; status.hidden = false; controls.hidden = true; retry.hidden = true;
    $("#viewer-status-text").textContent = text.loading;
    track("viewer_start", { model_id: model.id, surface: "model" });
    try {
      if (model.glb) {
        try { controller = await glbViewer(model, stage, onInteraction); }
        catch { stage.replaceChildren(); }
      }
      if (!controller) {
        $(".provider-note").hidden = false;
        await loadSketchfab();
        controller = await sketchfabViewer(model, stage, onInteraction);
      }
      status.hidden = true; controls.hidden = false; toggle.hidden = !controller.animated;
      container.dataset.ready = "true";
      track("viewer_ready", { model_id: model.id, surface: "model", duration_ms: Math.min(120000, Math.round((performance.now() - started) / 250) * 250) });
      // Start source animations only after the actual viewer reports them.
      if (controller.animated) setPlaying(true);
    } catch (error) {
      controller?.dispose(); controller = null;
      container.dataset.error = error instanceof Error ? error.message : "Model unavailable";
      stage.replaceChildren(); stage.hidden = true; poster.hidden = false;
      $("#load-viewer").hidden = true;
      $("#viewer-status-text").textContent = text.loadError;
      retry.hidden = false;
      track("viewer_error", { model_id: model.id, surface: "model" });
    } finally { loading = false; }
  }
  $("#load-viewer").addEventListener("click", load);
  retry.addEventListener("click", load);
  toggle.addEventListener("click", () => setPlaying(!playing));
  $("#reset-view").addEventListener("click", () => controller?.reset());
  $("#fullscreen-view").addEventListener("click", async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await container.requestFullscreen();
    } catch { /* Browsers without fullscreen keep the normal inline view. */ }
  });
  const observer = new IntersectionObserver(entries => {
    if (controller) controller.setVisible(entries[0].isIntersecting && !document.hidden);
  }, { threshold: 0.05 });
  observer.observe(container);
  document.addEventListener("visibilitychange", () => controller?.setVisible(!document.hidden && container.getBoundingClientRect().bottom > 0));
  // The browser owns iframe teardown during navigation; do not send RPCs to a closing frame.
  window.addEventListener("pagehide", () => observer.disconnect(), { once: true });
}

let events = [], flushTimer, sessionID, eventCount = 0;
const analyticsEnabled = location.hostname === "ar-asia.luopeike.com"
  && !navigator.webdriver && !navigator.globalPrivacyControl
  && navigator.doNotTrack !== "1" && window.doNotTrack !== "1";

function track(name, properties = {}) {
  if (!analyticsEnabled || !data || eventCount >= 100) return;
  try {
    if (!sessionID) {
      sessionID = readStorage(storage("sessionStorage"), SESSION_KEY) || crypto.randomUUID();
      writeStorage(storage("sessionStorage"), SESSION_KEY, sessionID);
    }
    events.push({ id: crypto.randomUUID(), name, occurredAt: new Date().toISOString(), properties });
    eventCount++;
    if (!flushTimer) flushTimer = setTimeout(flush, 1500);
  } catch { /* Usage collection must never interrupt browsing. */ }
}

function flush() {
  clearTimeout(flushTimer); flushTimer = null;
  if (!events.length) return;
  const batch = events.splice(0, 20);
  const payload = { schemaVersion: 1, sessionID, locale: data.locale,
    device: matchMedia("(max-width: 600px)").matches ? "mobile" : matchMedia("(max-width: 1024px)").matches ? "tablet" : "desktop",
    events: batch };
  fetch("https://littlenature-api.luopeike.com/v1/web-events", {
    method: "POST", credentials: "omit", keepalive: true,
    headers: { "content-type": "application/json" }, body: JSON.stringify(payload)
  }).catch(() => {});
  if (events.length) flushTimer = setTimeout(flush, 1500);
}

if (data) {
  for (const button of document.querySelectorAll("[data-card-id]")) {
    button.addEventListener("click", () => {
      const id = button.dataset.cardId;
      if (selected.has(id)) selected.delete(id); else selected.add(id);
      saveSelection();
    });
  }
  window.addEventListener("storage", event => {
    if (event.key === SELECTED_KEY) { selected = new Set(parseSelection(event.newValue)); updateSelection(); }
  });
  for (const link of document.querySelectorAll(".app-store-link")) {
    link.addEventListener("click", () => { track("store_click", { surface: link.dataset.surface || data.surface }); flush(); });
  }
  if (/iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)) {
    for (const link of document.querySelectorAll(".quick-look-link")) link.hidden = false;
  }
  startCatalog(); startStudy(); updateSelection(); startViewer();
  if (data.surface === "model") track("model_open", { model_id: data.models[0].id, surface: "model" });
  else if (data.theme) track("theme_view", { theme: data.theme, surface: "theme" });
  else track("catalog_view", { surface: data.home ? "home" : data.surface });
  window.addEventListener("pagehide", flush);
}
