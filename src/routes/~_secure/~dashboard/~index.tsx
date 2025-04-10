import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_secure/dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_secure/dashboard/"!</div>;
}
