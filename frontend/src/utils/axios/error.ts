import type { AxiosError } from "axios";

interface CommonApiErrorResponseData {
  code?: number;
  errorCode?: number;
  message?: string;
  stack?: string;
  [key: string]: any;
}

export class ApiError extends Error {
  public readonly status: number;
  public readonly data: CommonApiErrorResponseData | unknown;

  public readonly headers: Record<string, string | undefined>;

  constructor(error: AxiosError) {
    const errorResponseData = error.response?.data as CommonApiErrorResponseData | undefined;
    const errorMessage = errorResponseData?.message || error.message || "API Error occurred";

    super(errorMessage);

    this.status = error.response?.status || 500;
    this.data = errorResponseData || error.response?.data;
    this.headers = (error.response?.headers || {}) as Record<string, string | undefined>;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }

    this.name = "ApiError";
  }
}
