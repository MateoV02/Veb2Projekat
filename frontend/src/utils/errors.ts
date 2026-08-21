import { AxiosError } from "axios";

interface ApiMessageError {
  message?: string;
}

interface ApiValidationProblem {
  title?: string;
  errors?: Record<string, string[]>;
}

export function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as (ApiMessageError & ApiValidationProblem) | undefined;

    if (data?.message) {
      return data.message;
    }

    if (data?.errors) {
      const firstError = Object.values(data.errors)[0]?.[0];
      if (firstError) {
        return firstError;
      }
    }

    if (data?.title) {
      return data.title;
    }
  }
  return fallback;
}
