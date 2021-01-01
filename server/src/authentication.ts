import { AuthenticationError } from "apollo-server";
import { OAuth2Client, TokenPayload } from "google-auth-library";
import { env } from "process";

const GOOGLE_CLIENT_ID = env.GOOGLE_CLIENT_ID;

if (!GOOGLE_CLIENT_ID) {
  throw new Error("google client id missing");
}

const googleAuthClient = new OAuth2Client(GOOGLE_CLIENT_ID);

/**
 * Verify id token received from Google and return verified user info.
 *
 * https://developers.google.com/identity/sign-in/web/backend-auth
 */
export const verifyGoogleIdToken = async (
  token: string
): Promise<TokenPayload> => {
  const loginTicket = await googleAuthClient.verifyIdToken({
    idToken: token,
    audience: GOOGLE_CLIENT_ID,
  });

  const payload = loginTicket.getPayload();

  if (!payload) {
    console.error(payload);
    throw new AuthenticationError("no payload");
  }

  return payload;
};
