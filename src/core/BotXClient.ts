import { resolve_config } from '../config/BotXConfig';
import { AuthManager } from './AuthManager';
import { RequestHandler } from './RequestHandler';
import { ResponseHandler } from './ResponseHandler';
import { ErrorHandler } from './ErrorHandler';
import { SystemAPI } from '../modules/system/SystemAPI';
import { BotsAPI } from '../modules/bots/BotsAPI';
import { NotificationsAPI } from '../modules/notifications/NotificationsAPI';
import { EventsAPI } from '../modules/events/EventsAPI';
import { ChatsAPI } from '../modules/chats/ChatsAPI';
import { UsersAPI } from '../modules/users/UsersAPI';
import { FilesAPI } from '../modules/files/FilesAPI';
import type { BotXConfig, ResolvedBotXConfig } from '../config/BotXConfig';
import type { UUID } from '../types/common';

/**
 * Main facade class for BotX API client with module accessors
 */
export class BotXClient {
  private readonly config: ResolvedBotXConfig;
  private readonly auth_manager: AuthManager;
  private readonly request_handler: RequestHandler;
  private readonly response_handler: ResponseHandler;
  private readonly error_handler: ErrorHandler;

  private readonly _system: SystemAPI;
  private readonly _bots: BotsAPI;
  private readonly _notifications: NotificationsAPI;
  private readonly _events: EventsAPI;
  private readonly _chats: ChatsAPI;
  private readonly _users: UsersAPI;
  private readonly _files: FilesAPI;

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

    this._system = new SystemAPI(this);
    this._bots = new BotsAPI(this, this.config.bot_id);
    this._notifications = new NotificationsAPI(this);
    this._events = new EventsAPI(this);
    this._chats = new ChatsAPI(this);
    this._users = new UsersAPI(this);
    this._files = new FilesAPI(this);
  }

  /**
   * Get System API module
   */
  get system(): SystemAPI {
    return this._system;
  }

  /**
   * Get Bots API module
   */
  get bots(): BotsAPI {
    return this._bots;
  }

  /**
   * Get Notifications API module
   */
  get notifications(): NotificationsAPI {
    return this._notifications;
  }

  /**
   * Get Events API module
   */
  get events(): EventsAPI {
    return this._events;
  }

  /**
   * Get Chats API module
   */
  get chats(): ChatsAPI {
    return this._chats;
  }

  /**
   * Get Users API module
   */
  get users(): UsersAPI {
    return this._users;
  }

  /**
   * Get Files API module
   */
  get files(): FilesAPI {
    return this._files;
  }

  /**
   * Get authentication manager for token operations
   */
  get_auth_manager(): AuthManager {
    return this.auth_manager;
  }

  /**
   * Get request handler for custom HTTP operations
   */
  get_request_handler(): RequestHandler {
    return this.request_handler;
  }

  /**
   * Get response handler for manual response processing
   */
  get_response_handler(): ResponseHandler {
    return this.response_handler;
  }

  /**
   * Get error handler for error classification
   */
  get_error_handler(): ErrorHandler {
    return this.error_handler;
  }

  /**
   * Get resolved client configuration
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
      query_params?: Record<string, string | number | boolean | null>;
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