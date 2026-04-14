import { API_ENDPOINTS } from '../../config/constants';
import { generate_legacy_signature } from './types';
import type { BotXClient } from '../../core/BotXClient';
import type { UUID, ISODate } from '../../types/common';
import type { BotCatalogQuery, BotCatalogResponse, LegacyTokenResponse } from './types';

/**
 * Bot management API methods for catalog and authentication
 */
export class BotsAPI {
  private readonly client: BotXClient;
  private readonly bot_id: UUID;

  /**
   * Create BotsAPI module instance
   * @param client - Parent BotXClient instance
   * @param bot_id - Current bot identifier
   */
  constructor(client: BotXClient, bot_id: UUID) {
    this.client = client;
    this.bot_id = bot_id;
  }

  /**
   * Get catalog of bots on current server
   * @param query - Optional query parameters
   * @returns List of bot entries with metadata
   */
  async get_catalog(query?: BotCatalogQuery): Promise<BotCatalogResponse> {
    return await this.client.request<BotCatalogResponse>(
      'GET',
      API_ENDPOINTS.BOTS.CATALOG,
      { query_params: query as any }
    );
  }

  /**
   * Get legacy authentication token (deprecated, requires bot setting enabled)
   * @param secret_key - Bot secret key for signature generation
   * @returns Legacy token string
   */
  async get_legacy_token(secret_key: string): Promise<LegacyTokenResponse> {
    const signature = generate_legacy_signature(this.bot_id, secret_key);
    return await this.client.request<LegacyTokenResponse>(
      'GET',
      API_ENDPOINTS.BOTS.LEGACY_TOKEN(this.bot_id),
      { query_params: { signature } }
    );
  }
}