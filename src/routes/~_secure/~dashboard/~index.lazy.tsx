import { createLazyFileRoute } from "@tanstack/react-router";
import Dashboard from "./dashboard";

export const Route = createLazyFileRoute("/_secure/dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Dashboard />;
}
