import { useContext } from "react";
import { AuthContext } from "../contexts/auth-context";

/**
 * Custom hook to access the authentication context.
 * This hook provides a convenient way to access the authentication state
 * and methods defined in the AuthProvider.
 * @returns {AuthContextType} The authentication context.
 * @property {User | null} user - The authenticated user object or null if not authenticated.
 * @property {string | null} token - The authentication token or null if not authenticated.
 * @property {function} setAuth - Function to set the authentication state.
 * @property {boolean} isLoading - Indicates whether the authentication state is being loaded.
 * @throws {Error} If used outside of an AuthProvider.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
