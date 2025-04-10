import { Navigate, createFileRoute } from "@tanstack/react-router";
import { useAuth } from "../hooks/use-auth";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const { token } = useAuth();
  const isAuthenticated = !!token;

  return (
    <>
      {isAuthenticated ? (
        <Navigate to={"/dashboard"} />
      ) : (
        <Navigate to="/login" />
      )}
    </>
  );
}
