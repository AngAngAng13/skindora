import type { AxiosRequestConfig } from "axios";
import { Result } from "neverthrow";
import { ApiError } from "./error";
/**
 * @interface ExtendedAxiosRequestConfig
 *@extends AxiosRequestConfig
 *@property {number} [_retry] - so luong da thu lai
 *@property {number} [_maxRetries] - so lan thu lai toi da
 *@property {number} [_delayMs] - thoi gian cho giua cac lan thu lai don vi ms
 *@property {boolean} [skipAuth] - bo qua qua trinh xac thuc VD: Beaber token
 */
export interface ExtendedAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: number;
  _maxRetries?: number;
  _delayMs?: number;
  skipAuth?: boolean;
}

/**
 * @interface Apiresponse
 *@template T - kieu du lieu cua data
 *@property {T} data - du lieu tra ve
 *@property {number} status - ma status
 *@property {string} statusText - thong bao status
 *@property {Record<string, string>} header - header cua response hoi thua
 */

export interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string | undefined>;
}

/**
 *  @interface RequestOptions
 *  @extends Omit<AxiosRequestConfig, "baseURL" | "url" | "method">
 *  @property {object} [retry] - object chua thong tin ve so lan thu lai va thoi gian cho giua cac lan thu lai
 *  @property {number} retry.maxRetries - so lan thu lai toi da
 *  @property {number} retry.delayMs - thoi gian cho giua cac lan thu lai don vi ms
 *  @property {boolean} [skipAuth] - bo qua qua trinh xac thuc VD: Beaber token
 */
export interface RequestOptions extends Omit<AxiosRequestConfig, "baseURL" | "url" | "method"> {
  retry?: {
    maxRetries: number;
    delayMs: number;
  };

  skipAuth?: boolean;
}
/**
 * @interface AuthConfig
 * @property {() => string | null | Promise<string | null>} tokenProvider - ham tra ve token tu provider
 * @property {string} [tokenType] - kieu token VD: Bearer
 * @property {() => Promise<string | null>} [refreshToken] - ham refresh token
 * @property {() => void} [onRefreshFailure] - ham xu ly khi refresh token that bai
 *
 */

export interface AuthConfig {
  tokenProvider: () => string | null | Promise<string | null>;
  tokenType?: string;
  refreshToken?: () => Promise<string | null>;
  onRefreshFailure?: () => void;
}
/**
 * @interface HttpClientConfig
 * @property {string} baseURL - url co ban cua API
 * @property {number} [timeout] - thoi gian timeout don vi ms
 * @property {Record<string, string>} [headers] - header mac dinh cua request
 * @property {AuthConfig} [auth] - tho
 * @property {object} [defaultRetry] - thong tin ve so lan thu lai va thoi gian cho giua cac lan thu lai mac dinh
 * @property {number} defaultRetry.maxRetries - so lan thu lai toi dang tin ve xac thuc
 * @property {number} defaultRetry.delayMs - thoi gian cho giua cac lan thu lai don vi ms
 */

export interface HttpClientConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
  auth?: AuthConfig;
  defaultRetry?: {
    maxRetries: number;
    delayMs: number;
  };
  DEBUG?: boolean;
}
/**
 * @interface HttpClientService
 * @property {(url: string, options?: RequestOptions) => Promise<ApiResponse<T>>} get - ham thuc hien request GET
 * @property {(url: string, data?: D, options?: RequestOptions) => Promise<ApiResponse<T>>} post - ham thuc hien request POST PHAI CO DATA TYOE
 * @property {(url: string, data?: D, options?: RequestOptions) => Promise<ApiResponse<T>>} put - ham thuc hien request PUT
 * @property {(url: string, data?: D, options?: RequestOptions) => Promise<ApiResponse<T>>} patch - ham thuc hien request PATCH
 * @property {(url: string, options?: RequestOptions) => Promise<ApiResponse<T>>} delete - ham thuc hien request DELETE
 */
export interface HttpClientService {
  get<T = unknown>(url: string, options?: RequestOptions): Promise<Result<ApiResponse<T>, ApiError>>;
  post<T = unknown, D = unknown>(url: string, data?: D, options?: RequestOptions): Promise<Result<ApiResponse<T>, ApiError>>;
  put<T = unknown, D = unknown>(url: string, data?: D, options?: RequestOptions): Promise<Result<ApiResponse<T>, ApiError>>;
  patch<T = unknown, D = unknown>(url: string, data?: D, options?: RequestOptions): Promise<Result<ApiResponse<T>, ApiError>>;
  delete<T = unknown>(url: string, options?: RequestOptions): Promise<Result<ApiResponse<T>, ApiError>>;
}
