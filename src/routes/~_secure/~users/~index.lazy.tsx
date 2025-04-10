import { createLazyFileRoute } from "@tanstack/react-router";
import UsersTable from "./users-table";

export const Route = createLazyFileRoute("/_secure/users/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <UsersTable />;
}
