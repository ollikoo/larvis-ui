import "@testing-library/jest-dom/vitest";
import { afterEach, vi, vitest } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup();
  vitest.useRealTimers();
});

window.HTMLElement.prototype.scrollIntoView = vitest.fn();

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn(() => ({
    matches: false,
    addListener: vi.fn(),
    removeListener: vi.fn(),
  })),
});

/*
 * Mock all GraphQL clients to return undefined in order not to have real clients
 * overriding the mock clients.
 */
vitest.mock("./src/utils/graphql-client/clients", () => ({
  SecureClient: undefined,
  FederatedClient: undefined,
  deduplicatedSecureClient: undefined,
}));
