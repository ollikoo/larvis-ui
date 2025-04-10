import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_secure/users/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}
