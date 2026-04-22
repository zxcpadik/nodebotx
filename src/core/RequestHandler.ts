import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import * as http from 'http';
import * as https from 'https';
import { AUTH, HEADERS } from '../config/constants';
import { AuthManager } from './AuthManager';
import { create_api_error } from '../errors/BotXError';
import type { ResolvedBotXConfig } from '../config/BotXConfig';
import type { APIResponse, RequestOptions, MultipartField } from '../types/api';
import type { HttpMethod } from '../types/common';

/**
 * Handles HTTP request construction, execution, and response processing for BotX API
 */
export class RequestHandler {
  private readonly base_url: string;
  private readonly auth_manager: AuthManager;
  private readonly default_timeout_ms: number;
  private readonly custom_headers: Record<string, string>;
  private readonly http_agent: http.Agent;
  private readonly https_agent: https.Agent;
  private readonly axios_instance: AxiosInstance;

  /**
   * Create new request handler instance
   * @param config - Resolved BotX client configuration
   * @param auth_manager - Authentication manager for token generation
   */
  constructor(config: ResolvedBotXConfig, auth_manager: AuthManager) {
    this.base_url = config.base_url;
    this.auth_manager = auth_manager;
    this.default_timeout_ms = config.timeout_ms;
    this.custom_headers = config.custom_headers;
    
    // Create keep-alive HTTP agents
    this.http_agent = new http.Agent({ keepAlive: true });
    this.https_agent = new https.Agent({ keepAlive: true });
    
    // Create axios instance with default configuration
    this.axios_instance = axios.create({
      httpAgent: this.http_agent,
      httpsAgent: this.https_agent,
      validateStatus: () => true,
    });
  }

  /**
   * Build full request URL with query parameters
   * @param endpoint - API path relative to base URL
   * @param query_params - Optional URL query parameters
   * @returns Complete URL string
   */
  private build_url(endpoint: string, query_params?: Record<string, string | number | boolean | null>): string {
    const url = new URL(endpoint, this.base_url);
    if (query_params) {
      Object.entries(query_params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    return url.toString();
  }

  /**
   * Build request headers with authentication and content type
   * @param content_type - MIME type for request body
   * @param use_auth - Include Authorization header
   * @param extra_headers - Additional custom headers
   * @returns Headers object for axios request
   */
  private build_headers(content_type: string, use_auth: boolean, extra_headers?: Record<string, string>): Record<string, string> {
    const headers: Record<string, string> = {
      'content-type': content_type,
      ...this.custom_headers,
      ...extra_headers,
    };

    if (use_auth) {
      headers[AUTH.AUTH_HEADER_NAME] = `${AUTH.AUTH_HEADER_PREFIX}${this.auth_manager.get_authorization_header()}`;
    }

    return headers;
  }

  /**
   * Execute HTTP request with error handling and response parsing
   * @param method - HTTP method
   * @param endpoint - API endpoint path
   * @param options - Request configuration options
   * @returns Parsed API response or throws BotXError
   */
  async request<TResponse, TBody = unknown>(
    method: HttpMethod,
    endpoint: string,
    options?: RequestOptions<TBody>
  ): Promise<APIResponse<TResponse>> {
    const {
      body,
      headers: extra_headers,
      query_params,
      use_auth = true,
      content_type = HEADERS.CONTENT_TYPE_JSON,
      timeout_ms = this.default_timeout_ms,
    } = options || {};

    const url = this.build_url(endpoint, query_params);
    const headers = this.build_headers(content_type, use_auth, extra_headers);

    const controller = new AbortController();
    const timeout_id = setTimeout(() => controller.abort(), timeout_ms);

    try {
      const axios_config: AxiosRequestConfig = {
        method,
        url,
        headers,
        //@ts-ignore
        data: (body ? (content_type === HEADERS.CONTENT_TYPE_JSON ? JSON.stringify(body) : body) : undefined),
        timeout: timeout_ms,
        signal: controller.signal,
        responseType: 'text',
      };

      const response = await this.axios_instance.request(axios_config);

      clearTimeout(timeout_id);

      const response_text = response.data as string;
      const response_data = response_text ? JSON.parse(response_text) : {};

      if (response.status < 200 || response.status >= 300) {
        const error_reason = response_data.reason || `http_${response.status}`;
        const error_message = response_data.error_data?.error_description || response.statusText;
        throw create_api_error(error_reason, error_message, response_data.error_data);
      }

      return response_data as APIResponse<TResponse>;
    } catch (error) {
      clearTimeout(timeout_id);
      if (axios.isAxiosError(error) && (error.code === 'ECONNABORTED' || error.message?.includes('timeout') || error.message?.includes('aborted'))) {
        throw create_api_error('timeout', `Request timeout after ${timeout_ms}ms`);
      }
      if (error instanceof Error && error.name !== 'BotXError') {
        throw create_api_error('network_error', error.message);
      }
      throw error;
    }
  }

  /**
   * Create multipart form data for file upload requests
   * @param fields - Form fields with string or Blob values
   * @param file_field_name - Name of the file input field (default: 'content')
   * @returns FormData object ready for multipart request
   */
  create_multipart_form(fields: Record<string, string | Blob>, file_field_name = 'content'): FormData {
    const form_data = new FormData();
    Object.entries(fields).forEach(([name, value]) => {
      form_data.append(name, value);
    });
    return form_data;
  }

  /**
   * Calculate byte size of JSON-serializable object
   * @param obj - Object to measure
   * @returns Estimated size in bytes
   */
  calculate_json_size(obj: unknown): number {
    return new TextEncoder().encode(JSON.stringify(obj)).length;
  }

  /**
   * Extract base64 content size from data URL
   * @param data_url - RFC 2397 data URL string
   * @returns Estimated decoded byte size
   */
  calculate_base64_size(data_url: string): number {
    const base64_content = data_url.split(',')[1];
    if (!base64_content) return 0;
    return Math.ceil((base64_content.length * 3) / 4);
  }
}