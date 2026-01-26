export interface AuthResponse {
  user: {
    id: string;
    email: string;
    fullName: string;
    role: string;
  };
  session?: {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    expires_at: number;
  } | null;
  emailConfirmed?: boolean;
  message?: string;
}

export interface UserPayload {
  id: string;
  email: string;
  role: string;
  fullName?: string;
}
