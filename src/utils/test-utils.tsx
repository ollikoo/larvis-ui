import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from "@tanstack/react-router";
import { router } from "../app";
import { render } from "@testing-library/react";

export function renderWithTanstackRouter<T>(node: React.ReactElement<T>) {
  const rootRoute = createRootRoute({
    component: Outlet,
  });

  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component: () => node,
  });

  const routeTree = rootRoute.addChildren([indexRoute]);
  const mockedRouter = createRouter({
    routeTree,
    context: {
      isAuthenticated: false,
    },
  }) as unknown as typeof router;

  return render(<RouterProvider router={mockedRouter} />);
}
