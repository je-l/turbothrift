/**
 * See "cache.ts" in https://www.apollographql.com/docs/tutorial/local-state/
 */

import { makeVar } from "@apollo/client";

const token = localStorage.getItem("token");

export const userTokenCache = makeVar<string | null>(token);
