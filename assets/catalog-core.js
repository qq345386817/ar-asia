export const MODEL_ID = /^[a-f0-9]{32}$/i;

export function normalizeSearch(value) {
  return String(value ?? "").normalize("NFKD").replace(/\p{M}/gu, "").toLocaleLowerCase().replaceAll("ß", "ss").trim();
}

export function filterModels(models, { query = "", category = "", theme = "", animated = false } = {}) {
  const terms = normalizeSearch(query).split(/\s+/).filter(Boolean);
  return models.filter(model => {
    if (category && model.category !== category) return false;
    if (theme && !model.themes.includes(theme)) return false;
    if (animated && !model.animated) return false;
    const text = normalizeSearch([model.name, ...model.names, model.scientific].join(" "));
    return terms.every(term => text.includes(term));
  });
}

export function parseSelection(value) {
  try {
    const result = JSON.parse(value);
    if (!Array.isArray(result)) return [];
    return [...new Set(result.filter(item => typeof item === "string" && MODEL_ID.test(item)).map(item => item.toLowerCase()))].slice(0, 200);
  } catch {
    return [];
  }
}

export function printGroups(models, mode = "named", perPage = 9) {
  const groups = [];
  for (let offset = 0; offset < models.length; offset += perPage) {
    const page = models.slice(offset, offset + perPage);
    groups.push({ kind: mode === "matching" ? "pictures" : "named", models: page });
    if (mode === "matching") groups.push({ kind: "names", models: [...page].sort((a, b) => a.name.localeCompare(b.name)) });
  }
  return groups;
}
