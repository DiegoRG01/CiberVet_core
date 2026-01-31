export interface AuthResponse {
  user: {
    id: string;
    email: string;
    fullName: string;
    role: "owner" | "operator" | "admin";
    phone?: string | null;
    veterinaryId?: string | null;
    isActive: boolean;
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
  role: "owner" | "operator" | "admin";
  fullName?: string;
  phone?: string | null;
  veterinaryId?: string | null;
  isActive: boolean;
}
