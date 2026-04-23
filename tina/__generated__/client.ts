import { createClient } from "tinacms/dist/client";
import { queries } from "./types";
export const client = createClient({ cacheDir: '/home/kravchenski/projects/NEXT.JS/psychotherapist-website/tina/__generated__/.cache/1776965565592', url: 'http://localhost:4001/graphql', token: 'undefined', queries,  });
export default client;
  