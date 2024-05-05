import axios from "axios";
export const apiBaseURL =
  "https://trembl-independent-holland-segments.trycloudflare.com/";

const api = axios.create({
  baseURL: apiBaseURL,
});

export interface caloriesPostResponse {
  photo: string;
  name: string;
  nutrionValue: number;
  energyValue: number;
  carbonValue: number;
  sugarValue: number;
  proteinValue: number;
  saltValue: number;
}

export interface foodInterfaceType {
  id: string;
  name: string;
  time: string;
  photo: string;
  nutrionValue: number;
  energyValue: number;
  carbonValue: number;
  sugarValue: number;
  proteinValue: number;
  saltValue: number;
  type: "BREAKFAST" | "LUNCH" | "DINNER" | "OTHER";
  userId: string;
}

/*

	"Weight": [
			{
				"id": "6636c40e8e326ba9747e8d04",
				"weight": 10,
				"time": "2024-05-04T23:26:06.372Z",
				"userId": "663699519a5aa20927aa5850"
			}
		]
      */

export interface weightInterfaceType {
  id: string;
  weight: number;
  time: string;
  userId: string;
}

export interface userInterfaceType {
  id: string;
  email: string;
  name: string;
  nutrionValue: number;
  energyValue: number;
  carbonValue: number;
  sugarValue: number;
  proteinValue: number;
  saltValue: number;
  stats: {
    nutrionValue: number;
    carbonValue: number;
    sugarValue: number;
    proteinValue: number;
    saltValue: number;
    foods: foodInterfaceType[];
    Weight: weightInterfaceType[];
  };
}

export { api };
