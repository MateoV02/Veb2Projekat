import axios, { type AxiosInstance } from "axios";

function createHttpClient(baseURL: string): AxiosInstance {
  const client = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  client.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return client;
}

export const identityApi = createHttpClient(import.meta.env.VITE_IDENTITY_API_URL);
export const tripApi = createHttpClient(import.meta.env.VITE_TRIP_API_URL);
export const expenseApi = createHttpClient(import.meta.env.VITE_EXPENSE_API_URL);
export const sharingApi = createHttpClient(import.meta.env.VITE_SHARING_API_URL);
