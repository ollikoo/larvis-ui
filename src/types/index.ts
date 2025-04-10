export type AuthState = {
  isAuthenticated: boolean;
  user: string | null;
  token: string | null;
};

export interface TokenResponse {
  access: string;
}

export interface Acquisition {
  timestamp: number;
  ore_sites: number;
}

export type User = {
  user_id: string;
  name: string;
  password?: string;
};

export const timeframes = [
  "all_time",
  "last_24h",
  "last_7d",
  "last_30d",
  "last_90d",
] as const;
export type Timeframe = (typeof timeframes)[number];
