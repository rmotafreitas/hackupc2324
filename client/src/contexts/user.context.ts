import { createContext } from "react";
import { userInterfaceType } from "../api";

export interface UserContextProps {
  user: userInterfaceType | null;
  setUser: (user: userInterfaceType | null) => void;
}

export const UserContext: React.Context<UserContextProps | null> =
  createContext<UserContextProps | null>(null);
