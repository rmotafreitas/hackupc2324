import axios from "axios";
export const apiBaseURL =
  "https://adapters-ati-venice-hometown.trycloudflare.com/";

const api = axios.create({
  baseURL: apiBaseURL,
});

export interface caloriesPostResponse {
  nutrionValue: number;
  energyValue: number;
  carbonValue: number;
  sugarValue: number;
  proteinValue: number;
  saltValue: number;
}

export { api };
