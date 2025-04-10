import axios from "axios";
import { TokenResponse, User, Acquisition } from "../types";

const API_URL = "http://localhost:8080"; // TODO: Move to env variable

const api = axios.create({
  baseURL: API_URL,
});

const getHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
});

/**
 * For user authentication.
 * @param username - The username of the user.
 * @param password - The password of the user.
 * @returns A promise that resolves to the token response.
 */
export const login = (username: string, password: string) =>
  api.post<TokenResponse>("/token", { user_id: username, password });

/**
 * Fetches the current user data.
 * @param token - The authentication token.
 * @returns A promise that resolves to the users data.
 */
export const getUsers = (token: string) =>
  api.get<User[]>("/users", { headers: getHeaders(token) });

/**
 * Fetches a specific user by ID.
 * @param user_id - The ID of the user to fetch.
 * @param token - The authentication token.
 * @returns A promise that resolves to the user data.
 */
export const getUser = (user_id: string, token: string) =>
  api.get<User>(`/users/${user_id}`, {
    headers: getHeaders(token),
  });

/**
 * Updates a specific user by ID.
 * @param user_id - The ID of the user to update.
 * @param data - The data to update the user with.
 * @param token - The authentication token.
 * @returns A promise that resolves to the updated user data.
 */
export const updateUser = (
  user_id: string,
  data: Partial<User>,
  token: string,
) =>
  api.post<User>(`/users/${user_id}`, data, {
    headers: getHeaders(token),
  });

/**
 * Fetches the acquisition data.
 * @param token - The authentication token.
 * @returns A promise that resolves to the acquisition data.
 */
export const getAcquisitions = (token: string) =>
  api.get<Acquisition[]>("/acquisitions", {
    headers: getHeaders(token),
  });
