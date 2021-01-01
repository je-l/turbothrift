import pgPromise from "pg-promise";

const pgp = pgPromise({});

const postgresConnectionOptions = {
  username: "postgres",
  host: "database",
  database: "postgres",
  user: "postgres",
  password: "1234",
};

export const createDbSession = () => {
  return pgp(postgresConnectionOptions);
};
