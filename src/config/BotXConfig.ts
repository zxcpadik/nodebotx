import type { UUID } from '../types/common';

/**
 * Configuration interface for initializing BotX client
 */
export interface BotXConfig {
  /**
   * Unique bot identifier in BotX system (UUID format)
   */
  bot_id: UUID;

  /**
   * Optional text-based bot identifier for application logic
   */
  app_id?: string;

  /**
   * Secret key for JWT authentication (HS256 signing)
   */
  secret_key: string;

  /**
   * Base URL of BotX server (e.g., https://cts.example.com)
   */
  base_url: string;

  /**
   * Protocol version for BotX to Bot communication (default: 4)
   */
  proto_version?: number;

  /**
   * Request timeout in milliseconds (default: 30000)
   */
  timeout_ms?: number;

  /**
   * Enable BotX CA certificate for TLS verification (default: false)
   */
  use_botx_ca_cert?: boolean;

  /**
   * Custom headers to include in all API requests
   */
  custom_headers?: Record<string, string>;

  /**
   * Enable PDS token generation for requests (default: false)
   */
  use_pds_token?: boolean;

  /**
   * RSA private key for PDS JWT signing (required if use_pds_token is true)
   */
  pds_key?: string;

  /**
   * Forward user OpenID access token in requests (default: false)
   */
  use_open_id_access_token?: boolean;
}

/**
 * Resolved configuration with all defaults applied
 */
export interface ResolvedBotXConfig extends Required<Omit<BotXConfig, 'app_id' | 'pds_key'>> {
  app_id?: string;
  pds_key?: string;
}

/**
 * Extract BotX host (FQDN) from base URL for JWT audience claim
 * @param base_url - Full BotX server URL
 * @returns Hostname without protocol and path
 */
export function extract_botx_host(base_url: string): string {
  try {
    const url = new URL(base_url);
    return url.host;
  } catch {
    return base_url;
  }
}

/**
 * Resolve configuration with default values applied
 * @param config - Partial user-provided configuration
 * @returns Fully resolved configuration object
 */
export function resolve_config(config: BotXConfig): ResolvedBotXConfig {
  return {
    bot_id: config.bot_id,
    app_id: config.app_id,
    secret_key: config.secret_key,
    base_url: config.base_url,
    proto_version: config.proto_version ?? 4,
    timeout_ms: config.timeout_ms ?? 30000,
    use_botx_ca_cert: config.use_botx_ca_cert ?? false,
    custom_headers: config.custom_headers ?? {},
    use_pds_token: config.use_pds_token ?? false,
    pds_key: config.pds_key,
    use_open_id_access_token: config.use_open_id_access_token ?? false,
  };
}