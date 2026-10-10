import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { filterModels, parseSelection, printGroups } from "../assets/catalog-core.js";

const models = [
  { id: "35559c2236d04c1a80ccbe08cae863c6", name: "Japanische Süßwasserkrabbe", names: ["Japanese Freshwater Crab", "日本泽蟹", "サワガニ"], scientific: "Geothelphusa dehaani", category: "special", animated: true, themes: ["motion", "pond-life"] },
  { id: "a9c23391171c4e1abd859b05887e00af", name: "Forest Green Tree Frog", names: ["森林绿树蛙", "モリアオガエル"], scientific: "Rhacophorus arboreus", category: "animal", animated: false, themes: ["pond-life"] },
];

test("search accepts localized names, scientific names, and separate words", () => {
  for (const query of ["日本泽蟹", "サワガニ", "Geothelphusa dehaani", "freshwater crab", "susswasser"]) {
    assert.deepEqual(filterModels(models, { query }).map(model => model.id), [models[0].id]);
  }
  assert.equal(filterModels(models, { query: "Geothelphusa frog" }).length, 0);
});

test("animation filtering is independent of special classification and combines with themes", () => {
  assert.deepEqual(filterModels(models, { animated: true, theme: "pond-life" }).map(model => model.id), [models[0].id]);
  assert.equal(filterModels(models, { category: "animal", animated: true }).length, 0);
});

test("invalid persisted selection cannot become a card or duplicate a model", () => {
  assert.deepEqual(parseSelection(JSON.stringify([models[0].id, models[0].id, "<script>", {}, null])), [models[0].id]);
  assert.deepEqual(parseSelection('{"id":"not an array"}'), []);
  assert.deepEqual(parseSelection("{broken"), []);
});

test("matching cards retain every picture and name across the page boundary", () => {
  const selected = Array.from({ length: 10 }, (_, index) => ({ id: index, name: "Card " + index }));
  const result = printGroups(selected, "matching");
  assert.deepEqual(result.map(group => [group.kind, group.models.length]), [["pictures", 9], ["names", 9], ["pictures", 1], ["names", 1]]);
  for (const kind of ["pictures", "names"]) {
    assert.deepEqual(result.filter(group => group.kind === kind).flatMap(group => group.models).map(model => model.id).sort((a, b) => a - b), selected.map(model => model.id));
  }
});

test("all six languages have the same UI and theme content keys", () => {
  const translations = JSON.parse(readFileSync(new URL("../data/web-copy.json", import.meta.url)));
  const expected = Object.keys(translations["en-US"]).sort();
  assert.equal(Object.keys(translations).length, 6);
  for (const value of Object.values(translations)) {
    assert.deepEqual(Object.keys(value).sort(), expected);
    for (const theme of ["motion", "small-creatures", "pond-life", "flowers"]) {
      assert.deepEqual(Object.keys(value.themes[theme]).sort(), ["description", "prompts", "title"]);
      assert.equal(value.themes[theme].prompts.length, 3);
    }
  }
});
