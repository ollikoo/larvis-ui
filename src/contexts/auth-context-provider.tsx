import { useState, useEffect } from "react";
import { User } from "../types";
import { AuthContext } from "./auth-context";

/**
 * AuthProvider component. Provides authentication state and methods to update it.
 * This component wraps the application and provides authentication-related data
 * throughout the application using React Context.
 */
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Function to initialize auth state from sessionStorage
    const initializeAuth = () => {
      const storedToken = window.sessionStorage.getItem("token");
      const storedUser = window.sessionStorage.getItem("user");

      if (storedToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser) as User;
          setUser(parsedUser);
          setToken(storedToken);
        } catch (error) {
          console.error("Failed to parse user from sessionStorage", error);
          window.sessionStorage.removeItem("token");
          window.sessionStorage.removeItem("user");
        }
      }
      setIsLoading(false); // Mark initialization as complete
    };

    initializeAuth();
  }, []);

  const setAuth = (user: User | null, token: string | null) => {
    console.log("Setting auth state: ", { user, token });
    setUser(user);
    setToken(token);
  };

  return (
    <AuthContext.Provider value={{ user, token, setAuth, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
