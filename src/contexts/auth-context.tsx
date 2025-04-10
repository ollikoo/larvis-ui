import { createContext } from "react";
import { User } from "../types";

type AuthContextType = {
  user: User | null;
  token: string | null;
  setAuth: (user: User | null, token: string | null) => void;
  isLoading: boolean;
};

/**
 * Auth context. Provides authentication state and methods to update it.
 * This context is used to manage user authentication and provide
 * authentication-related data throughout the application.
 */
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
