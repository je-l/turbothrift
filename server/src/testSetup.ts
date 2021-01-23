import { verifyGoogleIdToken } from "./authentication";

export const fakeVerifyGoogleIdToken: typeof verifyGoogleIdToken = (_) => {
  return Promise.resolve({
    iss: "moi",
    aud: "moi",
    sub: "moi",
    iat: 1,
    exp: 1,
    email: "testuser@example.com",
  });
};
