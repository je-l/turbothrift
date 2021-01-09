import axios from "axios";
import { parseToriListing, ToriItem } from "./parseTori";

export const fetchNewItemsForUrl = async (url: string): Promise<ToriItem[]> => {
  const { data } = await axios.get(url);
  return parseToriListing(data);
};
