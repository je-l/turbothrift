import betterAxiosStacktrace from "axios-better-stacktrace";
import axios from "axios";

module.exports = async () => {
  betterAxiosStacktrace(axios);
};
