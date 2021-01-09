import pgPromise from "pg-promise";
import bluebird from "bluebird";
import camelcaseKeys from "camelcase-keys";

bluebird.config({ longStackTraces: true });

const postgresConnectionOptions = {
  username: "postgres",
  host: "database",
  database: "postgres",
  user: "postgres",
  password: "1234",
};

export const createDatabaseSession = async () => {
  // eslint-disable-next-line max-len
  // What is the point of bluebird here? See: https://github.com/vitaly-t/pg-promise/issues/342#issuecomment-305315123
  const pgp = pgPromise({
    promiseLib: bluebird,
    receive: (data, result) => {
      result.rows = camelcaseKeys(data);
    },
  });
  return pgp(postgresConnectionOptions);
};
