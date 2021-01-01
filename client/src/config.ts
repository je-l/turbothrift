/**
 * Validated environment variables.
 */
interface Config {
  GOOGLE_CLIENT_ID: string;
}

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

if (!GOOGLE_CLIENT_ID) {
  throw new Error("GOOGLE_CLIENT_ID is empty");
}

export const config: Config = {
  GOOGLE_CLIENT_ID,
};
