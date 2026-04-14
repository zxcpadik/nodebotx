import { generate_auth_token, is_token_expired } from '../utils/jwt';
import { extract_botx_host } from '../config/BotXConfig';
import type { UUID } from '../types/common';
import type { ResolvedBotXConfig } from '../config/BotXConfig';

/**
 * Manages JWT v2 authentication token generation for BotX API requests
 */
export class AuthManager {
  private readonly bot_id: UUID;
  private readonly secret_key: string;
  private readonly botx_host: string;
  private current_token: string | null = null;
  private token_expires_at: number | null = null;

  /**
   * Create new authentication manager instance
   * @param config - Resolved BotX client configuration
   */
  constructor(config: ResolvedBotXConfig) {
    this.bot_id = config.bot_id;
    this.secret_key = config.secret_key;
    this.botx_host = extract_botx_host(config.base_url);
  }

  /**
   * Generate fresh JWT v2 token for API request authorization
   * @returns Signed JWT token string
   */
  generate_token(): string {
    const now = Math.floor(Date.now() / 1000);
    this.current_token = generate_auth_token(this.bot_id, this.botx_host, this.secret_key, now);
    this.token_expires_at = now + 60;
    return this.current_token;
  }

  /**
   * Get valid authorization token, regenerating if expired or missing
   * @returns JWT token string ready for Authorization header
   */
  get_authorization_header(): string {
    const now = Math.floor(Date.now() / 1000);
    if (!this.current_token || !this.token_expires_at || now >= this.token_expires_at) {
      return `Bearer ${this.generate_token()}`;
    }
    return `Bearer ${this.current_token}`;
  }

  /**
   * Check if current token is still valid
   * @returns True if token exists and not expired
   */
  has_valid_token(): boolean {
    if (!this.current_token || !this.token_expires_at) return false;
    const now = Math.floor(Date.now() / 1000);
    return now < this.token_expires_at;
  }

  /**
   * Get bot identifier for request context
   * @returns Bot UUID string
   */
  get_bot_id(): UUID {
    return this.bot_id;
  }

  /**
   * Get BotX hostname for token audience claim
   * @returns FQDN string used in JWT aud field
   */
  get_botx_host(): string {
    return this.botx_host;
  }
}