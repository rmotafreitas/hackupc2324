import axios from "axios";
export const apiBaseURL =
  "https://trembl-independent-holland-segments.trycloudflare.com/";

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
