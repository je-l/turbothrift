import cheerio from "cheerio";

export interface ToriItem {
  itemUrl: string;
  title: string;
}

export const parseToriListing = (html: string): ToriItem[] => {
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

      return { itemUrl: url, title };
    });

  return linksForPage;
};
