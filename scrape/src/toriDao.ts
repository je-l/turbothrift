import pMapSeries from "p-map-series";
import { IDatabase } from "pg-promise";
import { IClient } from "pg-promise/typescript/pg-subset";
import { ToriItem } from "./parseTori";

interface AppUser {
  id: string;
  email: string;
}

interface ToriQuery {
  url: string;
  id: string;
  appUser: string;
  title: string;
}

export default class ToriDao {
  constructor(private database: IDatabase<unknown, IClient>) {}

  public async fetchAllUsers() {
    return await this.database.manyOrNone<AppUser>(
      "SELECT id, email, app_user FROM app_user"
    );
  }

  public async fetchQueriesForUserId(userId: string): Promise<ToriQuery[]> {
    const query = `
      SELECT url, id, app_user, title FROM toriquery WHERE app_user = $[userId]
    `;

    return await this.database.manyOrNone(query, { userId });
  }

  public async fetchAllQueries(): Promise<ToriQuery[]> {
    const query = "SELECT url, id FROM toriquery";

    return this.database.manyOrNone(query);
  }

  public async emailForId(id: string): Promise<string> {
    const query = "SELECT email FROM app_user WHERE id = $[id]";
    return this.database.one(query, { id });
  }

  public async findToriItems(ids: string[]): Promise<ToriItem[]> {
    if (ids.length === 0) return [];

    const query = "SELECT * FROM toriitem WHERE id IN ($[ids:list])";

    return await this.database.manyOrNone(query, { ids });
  }

  /**
   * Save new items and return new inserted items, which do not already exist.
   * Emais should be sent for the new items.
   */
  public async saveNewItems(
    newToriItems: ToriItem[],
    queryId: string
  ): Promise<string[]> {
    const insertedToriItems = await this.database.tx(async (t) => {
      return (
        await pMapSeries(newToriItems, async (item) => {
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
            { url: item.itemUrl, title: item.title, queryId }
          );

          return insertedToriItem ? insertedToriItem.id : null;
        })
      ).filter((i) => i);
    });

    return insertedToriItems;
  }
}
