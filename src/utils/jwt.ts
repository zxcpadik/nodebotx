import { createHmac, randomBytes } from 'node:crypto';
import { Buffer } from 'node:buffer';
import { AUTH } from '../config/constants';
import type { UUID } from '../types/common';

/**
 * Payload structure for BotX JWT v2 authentication tokens
 */
export interface JWTPayload {
  iss: UUID;
  aud: string;
  exp: number;
  nbf: number;
  jti: string;
  iat: number;
  version: 2;
}

/**
 * Encode data object to base64url format (RFC 4648)
 * @param data - Object to encode as JSON
 * @returns Base64url encoded string without padding
 */
function base64url_encode(data: unknown): string {
  const json = JSON.stringify(data);
  return Buffer.from(json, 'utf-8').toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Generate unique JWT ID string
 * @returns Random alphanumeric identifier
 */
function generate_jti(): string {
  return randomBytes(16).toString('hex');
}

/**
 * Create JWT v2 payload for BotX authentication
 * @param bot_id - Bot UUID as issuer claim
 * @param botx_host - BotX server FQDN as audience claim
 * @param issued_at - Unix timestamp when token is created
 * @returns Complete JWT payload object
 */
export function create_jwt_payload(bot_id: UUID, botx_host: string, issued_at?: number): JWTPayload {
  const iat = issued_at ?? Math.floor(Date.now() / 1000);
  return {
    iss: bot_id,
    aud: botx_host,
    exp: iat + AUTH.JWT_TTL_SECONDS,
    nbf: iat,
    jti: generate_jti(),
    iat,
    version: AUTH.JWT_VERSION,
  };
}

/**
 * Sign payload using HS256 algorithm with secret key
 * @param payload - JWT claims object
 * @param secret_key - Bot secret key for HMAC-SHA256 signing
 * @returns Complete JWT token string (header.payload.signature)
 */
export function sign_jwt(payload: JWTPayload, secret_key: string): string {
  const header = {
    alg: AUTH.JWT_ALGORITHM,
    typ: 'JWT',
  };

  const encoded_header = base64url_encode(header);
  const encoded_payload = base64url_encode(payload);
  const signing_input = `${encoded_header}.${encoded_payload}`;

  const signature = createHmac('sha256', secret_key)
    .update(signing_input)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  return `${signing_input}.${signature}`;
}

/**
 * Generate complete JWT v2 token for BotX request authentication
 * @param bot_id - Bot UUID identifier
 * @param botx_host - BotX server hostname for audience claim
 * @param secret_key - Bot secret key for signing
 * @param issued_at - Optional Unix timestamp for token creation time
 * @returns Signed JWT token string ready for Authorization header
 */
export function generate_auth_token(bot_id: UUID, botx_host: string, secret_key: string, issued_at?: number): string {
  const payload = create_jwt_payload(bot_id, botx_host, issued_at);
  return sign_jwt(payload, secret_key);
}

/**
 * Decode JWT payload without verification (for inspection only)
 * @param token - JWT token string
 * @returns Decoded payload object or null if invalid format
 */
export function decode_jwt_payload(token: string): JWTPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload_json = Buffer.from(parts[1], 'base64').toString('utf-8');
    return JSON.parse(payload_json) as JWTPayload;
  } catch {
    return null;
  }
}

/**
 * Check if JWT token is expired based on exp claim
 * @param token - JWT token string
 * @param current_time - Optional current Unix timestamp for comparison
 * @returns True if token is expired, false if still valid
 */
export function is_token_expired(token: string, current_time?: number): boolean {
  const payload = decode_jwt_payload(token);
  if (!payload) return true;
  const now = current_time ?? Math.floor(Date.now() / 1000);
  return now >= payload.exp;
}