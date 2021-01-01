import { IClient } from "pg-promise/typescript/pg-subset";
import initMailgun from "mailgun-js";
import { env } from "process";
import { ToriEntry } from "./parseTori";
import pMapSeries from "p-map-series";
import { IDatabase } from "pg-promise";

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

export class EmailDao {
  constructor(private database: IDatabase<any, IClient>) {}

  public async fetchAllUsers() {
    const users = await this.database.manyOrNone<AppUser[]>(
      "SELECT id, email FROM app_user"
    );
    return users;
  }

  /**
   * Save new items and return new inserted items, which do not already exist.
   * Emais should be sent for the new items.
   */
  public async saveNewItems(
    newToriItems: ToriEntry[],
    queryId: number
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

export const sendEmailsForUser = async (
  email: string,
  emailDao: EmailDao,
  newToriEntries: ToriEntry[]
) => {
  const sendData = {
    from: `${EMAIL_SENDER_NAME} <${EMAIL_SENDER_ADDRESS}>`,
    to: email,
    subject: "testing",
    text: "Testing testing",
  };
  await mailgun.messages().send(sendData);
  console.log(`sent email to ${email}`);
};
