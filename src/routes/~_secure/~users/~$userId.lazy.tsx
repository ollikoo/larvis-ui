import { createLazyFileRoute } from "@tanstack/react-router";
import User from "./user";

export const Route = createLazyFileRoute("/_secure/users/$userId")({
  component: RouteComponent,
});

function RouteComponent() {
  return <User />;
}
