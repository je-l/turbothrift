import { setContext } from "@apollo/client/link/context";

export const getCurrentUser = () => {
  if (gapi.auth2) {
    return gapi.auth2.getAuthInstance().currentUser.get();
  }

  return null;
};

export const authorizationLink = setContext(async (_, { headers }) => {
  const user = getCurrentUser();
  if (!user) {
    return;
  }

  const token = user.isSignedIn() ? user.getAuthResponse().id_token : null;

  return {
    headers: {
      ...headers,
      authorization: token ? "bearer " + token : "",
    },
  };
});
