import cheerio from "cheerio";

export interface ToriEntry {
  url: string;
  title: string;
}

export const parseToriListing = (html: string): ToriEntry[] => {
  const $ = cheerio.load(html);
  const linksForPage = $(
    "div.list_mode_thumb > a:not(:has(div.polepos_marker))"
  )
    .toArray()
    .map((element) => {
      const url = element.attribs.href;
      const title = $(element)
        .find("div.ad-details-left")
        .text()
        .trim()
        .replace(/\s+/g, " ");

      return { url, title };
    });

  return linksForPage;
};
