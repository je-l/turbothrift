import React from "react";
import GoogleLogin, {
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from "react-google-login";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

if (!GOOGLE_CLIENT_ID) {
  throw new Error("client id missing");
}

const signIn = (args: GoogleLoginResponse | GoogleLoginResponseOffline) => {
  if (!("getAuthResponse" in args)) {
    console.error(args);
    throw new Error("failed to login");
  }

  const token = args.getAuthResponse().id_token;

  console.log("args ", args);
  console.log("idtoken ", token);

  localStorage.setItem("token", token);
};

const SignInPage = () => (
  <div>
    <GoogleLogin clientId={GOOGLE_CLIENT_ID} onSuccess={signIn} />
  </div>
);

export default SignInPage;
