/**
 * See "cache.ts" in https://www.apollographql.com/docs/tutorial/local-state/
 */

import { makeVar } from "@apollo/client";
import jsonwebtoken from "jsonwebtoken";

const token = localStorage.getItem("token");

const decodedToken = token ? jsonwebtoken.decode(token) : null;

export const email = makeVar<string>("");
