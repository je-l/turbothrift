import pgPromise from "pg-promise";

const postgresConnectionOptions = {
  username: "postgres",
  host: "database",
  database: "postgres",
  user: "postgres",
  password: "1234",
};

const pgp = pgPromise({});

export const createDatabaseSession = async () => {
  return pgp(postgresConnectionOptions);
};
