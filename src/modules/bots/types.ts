import { createHmac } from 'node:crypto';
import type { UUID, ISODate, BotCatalogEntry } from '../../types/common';

/**
 * Query parameters for bot catalog request
 */
export interface BotCatalogQuery {
  since?: ISODate;
}

/**
 * Legacy token request parameters
 */
export interface LegacyTokenRequest {
  signature: string;
}

/**
 * Response from legacy token endpoint
 */
export interface LegacyTokenResponse {
  token: string;
}

/**
 * Bot catalog response container
 */
export interface BotCatalogResponse {
  generated_at: ISODate;
  bots: BotCatalogEntry[];
}

/**
 * Generate HMAC-SHA256 signature for legacy auth
 * @param bot_id - Bot UUID to sign
 * @param secret_key - Bot secret key
 * @returns Uppercase hex signature string
 */
export function generate_legacy_signature(bot_id: UUID, secret_key: string): string {
  return createHmac('sha256', secret_key)
    .update(bot_id)
    .digest('hex')
    .toUpperCase();
}