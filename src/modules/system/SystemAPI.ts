import { API_ENDPOINTS } from '../../config/constants';
import type { BotXClient } from '../../core/BotXClient';

/**
 * System-level API methods for BotX service information
 */
export class SystemAPI {
  private readonly client: BotXClient;

  /**
   * Create SystemAPI module instance
   * @param client - Parent BotXClient instance
   */
  constructor(client: BotXClient) {
    this.client = client;
  }

  /**
   * Get BotX service version information
   * @returns Version string from release builds
   */
  async get_version(): Promise<string> {
    const response = await this.client.request<{ version: string }>(
      'GET',
      API_ENDPOINTS.SYSTEM.VERSION
    );
    return response.version;
  }
}