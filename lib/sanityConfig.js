import { createClient } from "next-sanity";

const config = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: process.env.NODE_ENV === "production",
  apiVersion: "2023-03-19",
  token: process.env.SANITY_API_TOKEN,
};

if (!config.projectId) {
  throw Error("The Project ID is not set. Check your environment variables.");
}

const client = createClient(config);

export default client;
