import axios from "axios";
import betterAxiosTrace from "axios-better-stacktrace";
import pMapSeries from "p-map-series";
import { IDatabase } from "pg-promise";
import { IClient } from "pg-promise/typescript/pg-subset";
import { flatten } from "ramda";

import { ToriItem } from "./src/parseTori";
import { sendEmailsForUser, EmailMesssage } from "./src/sendEmails";
import { fetchNewItemsForUrl } from "./src/toriApi";
import ToriDao from "./src/toriDao";

betterAxiosTrace(axios);

const formatMessage = (insertedItems: ToriItem[]): string => {
  return insertedItems
    .map((item) => `${item.title}\n${item.itemUrl}`)
    .join("\n\n");
};

export const createMessages = async (
  db: IDatabase<unknown, IClient>
): Promise<EmailMesssage[]> => {
  const toriDao = new ToriDao(db);
  const users = await toriDao.fetchAllUsers();

  const nestedMessages = await pMapSeries(users, async (user) => {
    const queriesForUser = await toriDao.fetchQueriesForUserId(user.id);

    return await pMapSeries(queriesForUser, async (query) => {
      const currentItems = await fetchNewItemsForUrl(query.url);
      const savedNewItems = await toriDao.saveNewItems(currentItems, query.id);
      const insertedToriItems = await toriDao.findToriItems(savedNewItems);

      return {
        to: user.email,
        message: `${query.title}\n\n${formatMessage(insertedToriItems)}`,
      };
    });
  });

  return flatten(nestedMessages);
};

export const main = async (db: IDatabase<unknown, IClient>) => {
  const messages = await createMessages(db);
  await pMapSeries(messages, async (message) => {
    await sendEmailsForUser(message);
  });
};
