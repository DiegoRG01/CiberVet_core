export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  session: {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    expires_at: number;
  };
}

export interface UserPayload {
  id: string;
  email: string;
  role: string;
}
