import { screen, fireEvent, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import "@testing-library/jest-dom";
import Login from "../login";
import { login, getUser } from "../../../../services/api";
import { renderWithTanstackRouter } from "../../../../utils/test-utils";
import { AxiosError } from "axios";

vi.mock("../../../../services/api", () => ({
  login: vi.fn(),
  getUser: vi.fn(),
}));

vi.mock("../../../../hooks/use-auth", () => ({
  useAuth: () => ({
    user: null,
    token: null,
    isLoading: false,
    setAuth: vi.fn(),
  }),
}));

const mockNotification = {
  success: vi.fn(),
  error: vi.fn(),
};

vi.mock("antd", async () => {
  const actual = await vi.importActual("antd");
  return {
    ...actual,
    App: {
      useApp: () => ({
        notification: mockNotification, // Use a stable reference
      }),
    },
  };
});

vi.mock("@tanstack/react-router", async () => {
  const actual = await vi.importActual("@tanstack/react-router");
  return {
    ...actual,
    useNavigate: vi.fn(() => vi.fn()),
    useRouter: vi.fn(() => ({
      invalidate: vi.fn(() => Promise.resolve()),
    })),
    createFileRoute: vi.fn(() => () => ({
      useSearch: vi.fn(() => ({})),
    })),
    lazyRouteComponent: vi.fn((component) => component),
  };
});

describe("Login Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the login form", () => {
    renderWithTanstackRouter(<Login />);
    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  it("shows validation errors for empty fields", async () => {
    renderWithTanstackRouter(<Login />);
    fireEvent.click(screen.getByText("Login"));
    expect(
      await screen.findByText("Please enter your username"),
    ).toBeInTheDocument();
    expect(
      await screen.findByText("Please enter your password"),
    ).toBeInTheDocument();
  });

  it("calls login and getUser on successful login", async () => {
    const mockToken = "mockToken";
    const mockUser = { user_id: "123", name: "John Doe" };
    (login as Mock).mockResolvedValue({ data: { access: mockToken } });
    (getUser as Mock).mockResolvedValue({ data: mockUser });

    renderWithTanstackRouter(<Login />);

    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "john" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password" },
    });
    fireEvent.click(screen.getByText("Login"));

    //console.log("DOM: ", prettyDOM(document.body));

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith("john", "password");

      expect(getUser).toHaveBeenCalledWith("john", mockToken);
      expect(mockNotification.success).toHaveBeenCalledWith({
        message: "Log in successful",
        placement: "bottom",
      });

      expect(window.sessionStorage.getItem("token")).toBe(mockToken);
      expect(window.sessionStorage.getItem("user")).toBe(
        JSON.stringify(mockUser),
      );
    });
  });

  it("shows error notification on login failure", async () => {
    (login as Mock).mockReturnValue(new AxiosError("Unauthorized", "401"));
    renderWithTanstackRouter(<Login />);
    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "john" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password" },
    });

    fireEvent.click(screen.getByText("Login"));

    await waitFor(() => {
      expect(mockNotification.error).toHaveBeenCalledWith({
        message: "An error occurred. Please try again.",
        placement: "bottom",
      });
    });
    expect(mockNotification.success).not.toHaveBeenCalled();
  });
});
