import { getCookie, setCookie, deleteCookie } from "@/utils/cookies";
import useUserSession from "@/stores/user";
import { jwtDecode } from "jwt-decode";

const API_BASE_URL = "http://localhost:8000";

type JwtPayload = {
  exp: number;
};

function isTokenExpired(token: string | null): boolean {
  if (!token) return true; // No token = expired

  try {
    const decoded: JwtPayload = jwtDecode(token);
    return decoded.exp * 1000 < Date.now(); // Convert `exp` to milliseconds
  } catch (error) {
    return true; // If decoding fails, assume expired
  }
}

export const TOKEN_EXPIRED = "TOKEN_EXPIRED"

export async function apiFetch<T>(
  path: string,
  method: string = "GET",
  body?: any
): Promise<T | typeof TOKEN_EXPIRED> {

  let accessToken = getCookie("accessToken");

  if (accessToken && isTokenExpired(accessToken)) {
    console.log("Token expired, attempting refresh...");

    const refreshed = await refreshAccessToken();
    if (refreshed) {
      accessToken = getCookie("accessToken");

    } else {
      console.log("Session expired, logging out...");
      useUserSession.getState().logout();
      return TOKEN_EXPIRED;
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: accessToken ? `Bearer ${accessToken}` : "",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (response.status === 401) {
    console.log("Token expired, attempting refresh...");

    const refreshed = await refreshAccessToken();
    if (refreshed) {
      accessToken = getCookie("accessToken");

      // Retry the request with new token
      return apiFetch<T>(path, method, body);
    } else {
      console.log("Session expired, logging out...");
      useUserSession.getState().logout();
      return TOKEN_EXPIRED
    }
  }

  if (!response.ok) {
    let errorMessage = "An error occurred";

    try {
      const data = await response.json();
      if (typeof data === "object" && data !== null) {
        errorMessage = Object.entries(data)
          .map(([field, messages]) => `${field}: ${messages}`)
          .join(" | ");
      } else {
        errorMessage = String(data);
      }
    } catch (error) {
      errorMessage = await response.text(); // Fallback for non-JSON responses
    }

    throw new Error(errorMessage);
  }

  try {
    return await response.json();
  } catch (error) {
    throw new Error("Invalid JSON response from API");
  }
}

async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = getCookie("refreshToken");
  if (!refreshToken) return false;

  try {
    const response = await fetch(`${API_BASE_URL}/api/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    const data = await response.json();
    setCookie("accessToken", data.access, { expires: 7, path: "/" });

    return true;
  } catch (error) {
    console.error("Token refresh failed:", error);
    deleteCookie("accessToken");
    deleteCookie("refreshToken");
    return false;
  }
}