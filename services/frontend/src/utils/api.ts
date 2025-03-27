import { getSession } from "next-auth/react";

export const fetchProtectedData = async <T>(
  endpoint: string,
  queryParams: string = "",
): Promise<T> => {
  const session = await getSession();
  console.log("Session Data:", session);
  if (!session?.accessToken) {
    throw new Error("User is not authenticated");
  }

  const token = session.accessToken as string;
  console.log("Backend URL:", process.env.GO_BACKEND_URL);
  const url = `http://localhost:8080/${endpoint}${queryParams ? `?${queryParams}` : ""}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.statusText}`);
  }

  return response.json();
};
