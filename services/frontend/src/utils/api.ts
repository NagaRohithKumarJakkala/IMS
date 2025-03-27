import { getSession } from "next-auth/react";

export const fetchProtectedData = async <T>(
  endpoint: string,
  queryParams: string = "",
  options: RequestInit = {}, // Accepts custom fetch options
): Promise<T> => {
  const session = await getSession();
  if (!session?.accessToken) {
    throw new Error("User is not authenticated");
  }

  const token = session.accessToken as string;
  const url = `http://localhost:8080/${endpoint}${queryParams ? `?${queryParams}` : ""}`;

  const response = await fetch(url, {
    method: options.method || "GET", // Default to GET if no method is provided
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...options.headers, // Merge additional headers
    },
    body: options.body || undefined, // Ensure GET requests do not send body
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.statusText}`);
  }

  return response.json();
};
