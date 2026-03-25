export type UserRole = 'customer' | 'admin';

export type UserSummary = {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  phone?: string;
  status: string;
};

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
  phone: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RefreshRequest = {
  refreshToken: string;
};

export type AuthSessionResponse = {
  accessToken: string;
  refreshToken: string;
  user: UserSummary;
};
