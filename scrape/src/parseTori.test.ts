import { parseToriListing } from "./parseTori";
import { readFileSync } from "fs";

// https://www.tori.fi/uusimaa?ca=18&s=1&w=1
const BASIC_TORI_HTML = readFileSync("./src/tori.fixture.html").toString();

// https://www.tori.fi/koko_suomi?q=chemex&cg=0&w=107&st=s&ca=18&l=0&md=th
const STRICT_TORI_SEARCH_HTML = readFileSync(
  "./src/strictToriQuery.fixture.html"
).toString();

// eslint-disable-next-line max-len
// https://www.tori.fi/uusimaa?q=&cg=5010&w=1&st=s&c=5014&ps=5&pe=8&des=1&ca=18&l=0&md=th
const COMPLEX_TORI_QUERY_HTML = readFileSync(
  "./src/complexToriQuery.fixture.html"
).toString();

test("very basic tori query", () => {
  const items = parseToriListing(BASIC_TORI_HTML);

  expect(items.length).toBe(40);
  expect(items[0].url).toBe(
    "https://www.tori.fi/uusimaa/Fjallraven_Kaipak_58_76186264.htm?ca=18&w=1"
  );
});

test("strict tori search", () => {
  const entries = parseToriListing(STRICT_TORI_SEARCH_HTML);

  expect(entries.length).toBe(1);
  expect(entries[0].title).toBe("Chemex Classic kahvinkeitin 40 €");
});

test("complex tori search", () => {
  const entries = parseToriListing(COMPLEX_TORI_QUERY_HTML);

  expect(entries.length).toBe(5);
  expect(entries[entries.length - 1].url).toBe(
    // eslint-disable-next-line max-len
    "https://www.tori.fi/uusimaa/Yli_300kpl_Bone_Collection_puhelimen_suojakuoria_75042645.htm?ca=18&w=1&last=1"
  );
});
