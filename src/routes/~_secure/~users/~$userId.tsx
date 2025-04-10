import { createFileRoute, Outlet } from "@tanstack/react-router";
import * as v from "valibot";

export const Route = createFileRoute("/_secure/users/$userId")({
  parseParams: (params) =>
    v.parse(
      v.object({
        userId: v.pipe(v.string()),
      }),
      params,
    ),
  component: () => <RouteComponent />,
});

function RouteComponent() {
  return <Outlet />;
}
