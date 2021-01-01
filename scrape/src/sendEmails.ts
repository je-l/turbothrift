import { IClient } from "pg-promise/typescript/pg-subset";
import initMailgun from "mailgun-js";
import { env } from "process";
import { ToriEntry } from "./parseTori";
import pMapSeries from "p-map-series";
import { IDatabase } from "pg-promise";
import camelcaseKeys from "camelcase-keys";

interface AppUser {
  id: string;
  email: string;
}

const MAILGUN_API_KEY = env.MAILGUN_API_KEY;
const MAILGUN_DOMAIN = env.MAILGUN_DOMAIN;
const EMAIL_SENDER_NAME = env.EMAIL_SENDER_NAME;
const EMAIL_SENDER_ADDRESS = env.EMAIL_SENDER_ADDRESS;

if (
  !MAILGUN_API_KEY ||
  !MAILGUN_DOMAIN ||
  !EMAIL_SENDER_ADDRESS ||
  !EMAIL_SENDER_NAME
) {
  console.error("check .env file for missing configuration");
  process.exit(1);
}

const mailgun = initMailgun({
  apiKey: MAILGUN_API_KEY,
  domain: MAILGUN_DOMAIN,
});

interface ToriQuery {
  url: string;
  id: string;
  appUser: string;
}

export class EmailDao {
  constructor(private database: IDatabase<unknown, IClient>) {}

  public async fetchAllUsers() {
    const users = await this.database.manyOrNone<AppUser[]>(
      "SELECT id, email, app_user FROM app_user"
    );
    return camelcaseKeys(users);
  }

  public async fetchAllQueries(): Promise<ToriQuery[]> {
    const query = "SELECT url, id FROM toriquery";

    return this.database.manyOrNone(query);
  }

  public async emailForId(id: string): Promise<string> {
    const query = "SELECT email FROM app_user WHERE id = $[id]";
    return this.database.one(query, { id });
  }

  /**
   * Save new items and return new inserted items, which do not already exist.
   * Emais should be sent for the new items.
   */
  public async saveNewItems(
    newToriItems: ToriEntry[],
    queryId: string
  ): Promise<number[]> {
    const insertedToriItems = await this.database.tx(async (t) => {
      const results = await pMapSeries(newToriItems, async (item) => {
        const insertedToriItem = await t.oneOrNone(
          `INSERT INTO toriitem (
              item_url,
              title,
              search_query
            ) values (
              $[url],
              $[title],
              $[queryId]
            )
            ON CONFLICT (item_url, search_query)
            DO NOTHING RETURNING id`,
          { url: item.url, title: item.title, queryId }
        );

        return insertedToriItem ? insertedToriItem.id : null;
      });

      return results.filter((i) => i);
    });

    return insertedToriItems;
  }
}

export const sendEmailsForUser = async (email: string, message: string) => {
  const sendData = {
    from: `${EMAIL_SENDER_NAME} <${EMAIL_SENDER_ADDRESS}>`,
    to: email,
    subject: "New items in Turbothrift",
    text: message,
  };
  await mailgun.messages().send(sendData);
  console.log(`sent email to ${email}`);
};
