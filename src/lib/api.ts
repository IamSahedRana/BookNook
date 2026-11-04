import { getAuthToken } from "@/lib/auth-token";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type ApiOptions = Omit<RequestInit, "body"> & {
  /** JSON body (stringified for you) */
  body?: unknown;
  /** BetterAuth JWT for protected routes (added in the server zip) */
  token?: string | null;
};

/** Small fetch wrapper for the Express API. */
export async function apiFetch<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { body, token, headers, ...rest } = options;

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...rest,
      headers: {
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(
      "Could not reach the BookNook server. Please check that it is running.",
      0
    );
  }

  if (!response.ok) {
    let message = response.statusText || "Request failed";
    try {
      const data = await response.json();
      if (typeof data?.message === "string") message = data.message;
    } catch {
      /* response had no JSON body */
    }
    throw new ApiError(message, response.status);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

/**
 * Same as apiFetch, but adds the logged-in user's JWT.
 * If the server says 401 (token just expired) it gets a fresh token and tries once more.
 */
export async function authFetch<T>(path: string, options: Omit<ApiOptions, "token"> = {}): Promise<T> {
  const token = await getAuthToken();
  if (!token) throw new ApiError("Please log in to continue.", 401);

  try {
    return await apiFetch<T>(path, { ...options, token });
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      const fresh = await getAuthToken({ forceRefresh: true });
      if (fresh && fresh !== token) return apiFetch<T>(path, { ...options, token: fresh });
    }
    throw error;
  }
}
