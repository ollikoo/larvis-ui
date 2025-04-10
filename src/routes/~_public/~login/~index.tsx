import { createFileRoute, redirect } from "@tanstack/react-router";
import Login from "./login";
import * as v from "valibot";

export const Route = createFileRoute("/_public/login/")({
  component: RouteComponent,
  validateSearch: (search) =>
    v.parse(
      v.object({
        redirect: v.optional(v.fallback(v.string(), "")),
      }),
      search,
    ),
  beforeLoad: ({ context, search }) => {
    if (context.isAuthenticated) {
      throw redirect({ to: search.redirect || "/" });
    }
  },
});

function RouteComponent() {
  return <Login />;
}
