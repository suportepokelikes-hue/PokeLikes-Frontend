import type {
  AuthSessionResponse,
  LoginRequest,
  RefreshRequest,
  RegisterRequest,
  UserSummary,
} from '@/lib/api/contracts';
import { apiRequest } from '@/lib/api/http';

export function registerCustomer(payload: RegisterRequest): Promise<AuthSessionResponse> {
  return apiRequest<AuthSessionResponse>({
    path: '/auth/register',
    method: 'POST',
    body: payload,
  });
}

export function login(payload: LoginRequest): Promise<AuthSessionResponse> {
  return apiRequest<AuthSessionResponse>({
    path: '/auth/login',
    method: 'POST',
    body: payload,
  });
}

export function refreshSession(payload: RefreshRequest): Promise<AuthSessionResponse> {
  return apiRequest<AuthSessionResponse>({
    path: '/auth/refresh',
    method: 'POST',
    body: payload,
  });
}

export function logout(payload: RefreshRequest): Promise<void> {
  return apiRequest<void>({
    path: '/auth/logout',
    method: 'POST',
    body: payload,
  });
}

export function getAuthMe(accessToken: string): Promise<UserSummary> {
  return apiRequest<UserSummary>({
    path: '/auth/me',
    accessToken,
  });
}

export function getCurrentUser(accessToken: string): Promise<UserSummary> {
  return apiRequest<UserSummary>({
    path: '/me',
    accessToken,
  });
}
