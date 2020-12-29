/**
 * See "cache.ts" in https://www.apollographql.com/docs/tutorial/local-state/
 */

import { makeVar } from "@apollo/client";

export const isSignedIn = makeVar(false);
