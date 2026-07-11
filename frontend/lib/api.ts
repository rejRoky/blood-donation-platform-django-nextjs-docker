import { CLIENT_API_BASE, SERVER_API_BASE } from "@/lib/config";
import type { ApiErrorBody } from "@/lib/types";

/** Error thrown for any non-2xx API response, carrying the standard envelope. */
export class ApiError extends Error {
  status: number;
  code: string;
  errors?: Record<string, string[]>;

  constructor(status: number, body: Partial<ApiErrorBody>) {
    super(body.message ?? "Request failed. Please try again.");
    this.name = "ApiError";
    this.status = status;
    this.code = body.code ?? "error";
    this.errors = body.errors;
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string;
  /** Next.js fetch cache options for server-side calls. */
  next?: NextFetchRequestConfig;
  cache?: RequestCache;
}

async function request<T>(base: string, path: string, opts: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, token, next, cache } = opts;

  const res = await fetch(`${base}${path}`, {
    method,
    headers: {
      Accept: "application/json",
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    next,
    cache,
  });

  let data: unknown = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!res.ok) {
    throw new ApiError(res.status, (data ?? {}) as Partial<ApiErrorBody>);
  }
  return data as T;
}

/** API call from the browser (same origin, proxied by nginx). */
export function api<T>(path: string, opts?: RequestOptions): Promise<T> {
  return request<T>(CLIENT_API_BASE, path, opts);
}

/** API call from the Next.js server (direct to the backend container). */
export function serverApi<T>(path: string, opts?: RequestOptions): Promise<T> {
  return request<T>(SERVER_API_BASE, path, opts);
}
