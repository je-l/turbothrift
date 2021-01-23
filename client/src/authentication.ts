import { setContext } from "@apollo/client/link/context";

export const getCurrentUser = () => {
  return gapi.auth2.getAuthInstance().currentUser.get();
};

export const authorizationLink = setContext(async (_, { headers }) => {
  const user = getCurrentUser();
  const token = user.isSignedIn() ? user.getAuthResponse().id_token : null;

  return {
    headers: {
      ...headers,
      authorization: token ? "bearer " + token : "",
    },
  };
});
