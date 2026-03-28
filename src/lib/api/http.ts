import { getPublicEnv } from '../config/env';

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

type ApiRequestOptions = {
  path: string;
  method?: HttpMethod;
  body?: unknown;
  accessToken?: string;
  headers?: HeadersInit;
  cache?: RequestCache;
};

export class ApiClientError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly details?: unknown;

  constructor(message: string, status: number, code?: string, details?: unknown) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export async function apiRequest<T>({
  path,
  method = 'GET',
  body,
  accessToken,
  headers,
  cache = 'no-store',
}: ApiRequestOptions): Promise<T> {
  const { apiBaseUrl } = getPublicEnv();
  const url = new URL(stripLeadingSlash(path), ensureTrailingSlash(apiBaseUrl));
  const requestHeaders = new Headers(headers);

  if (body !== undefined && !requestHeaders.has('Content-Type')) {
    requestHeaders.set('Content-Type', 'application/json');
  }

  if (accessToken) {
    requestHeaders.set('Authorization', `Bearer ${accessToken}`);
  }

  const response = await fetch(url, {
    method,
    headers: requestHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache,
  });

  if (!response.ok) {
    const payload = await readJsonBody<{ error?: { code?: string; message?: string; details?: unknown } }>(
      response,
    );

    throw new ApiClientError(
      payload?.error?.message ?? `Backend request failed with status ${response.status}.`,
      response.status,
      payload?.error?.code,
      payload?.error?.details,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await readJsonBody<T>(response)) as T;
}

async function readJsonBody<T>(response: Response): Promise<T | undefined> {
  const text = await response.text();

  if (!text) {
    return undefined;
  }

  return JSON.parse(text) as T;
}

function ensureTrailingSlash(value: string): string {
  return value.endsWith('/') ? value : `${value}/`;
}

function stripLeadingSlash(value: string): string {
  return value.startsWith('/') ? value.slice(1) : value;
}
