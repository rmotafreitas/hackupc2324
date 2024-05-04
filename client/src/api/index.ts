import axios from "axios";
export const apiBaseURL =
  "https://adapters-ati-venice-hometown.trycloudflare.com/";

const api = axios.create({
  baseURL: apiBaseURL,
});

export { api };
