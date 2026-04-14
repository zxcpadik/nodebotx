import { resolve_config } from '../config/BotXConfig';
import { AuthManager } from './AuthManager';
import { RequestHandler } from './RequestHandler';
import { ResponseHandler } from './ResponseHandler';
import { ErrorHandler } from './ErrorHandler';
import type { BotXConfig, ResolvedBotXConfig } from '../config/BotXConfig';

/**
 * Main facade class for BotX API client with module accessors
 */
export class BotXClient {
  private readonly config: ResolvedBotXConfig;
  private readonly auth_manager: AuthManager;
  private readonly request_handler: RequestHandler;
  private readonly response_handler: ResponseHandler;
  private readonly error_handler: ErrorHandler;

  /**
   * Create new BotX client instance with configuration
   * @param config - BotX client configuration options
   */
  constructor(config: BotXConfig) {
    this.config = resolve_config(config);
    this.auth_manager = new AuthManager(this.config);
    this.request_handler = new RequestHandler(this.config, this.auth_manager);
    this.response_handler = new ResponseHandler();
    this.error_handler = new ErrorHandler();
  }

  /**
   * Get authentication manager for token operations
   * @returns AuthManager instance
   */
  get_auth_manager(): AuthManager {
    return this.auth_manager;
  }

  /**
   * Get request handler for custom HTTP operations
   * @returns RequestHandler instance
   */
  get_request_handler(): RequestHandler {
    return this.request_handler;
  }

  /**
   * Get response handler for manual response processing
   * @returns ResponseHandler instance
   */
  get_response_handler(): ResponseHandler {
    return this.response_handler;
  }

  /**
   * Get error handler for error classification
   * @returns ErrorHandler instance
   */
  get_error_handler(): ErrorHandler {
    return this.error_handler;
  }

  /**
   * Get resolved client configuration
   * @returns ResolvedBotXConfig with defaults applied
   */
  get_config(): ResolvedBotXConfig {
    return this.config;
  }

  /**
   * Execute generic authenticated request to BotX API
   * @template TResponse - Expected response result type
   * @template TBody - Request body type
   * @param method - HTTP method
   * @param endpoint - API endpoint path
   * @param options - Request options
   * @returns Parsed API response
   */
  async request<TResponse, TBody = unknown>(
    method: string,
    endpoint: string,
    options?: {
      body?: TBody;
      headers?: Record<string, string>;
      query_params?: Record<string, string | number | boolean>;
      use_auth?: boolean;
      content_type?: string;
      timeout_ms?: number;
    }
  ): Promise<TResponse> {
    const response = await this.request_handler.request<TResponse, TBody>(
      method as 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
      endpoint,
      options
    );
    return this.response_handler.handle_response(response);
  }
}