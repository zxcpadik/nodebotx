import type { ErrorData } from '../types/api';

/**
 * Base error class for all BotX client exceptions
 */
export class BotXError extends Error {
  /**
   * BotX API reason code for this error
   */
  public readonly reason?: string;

  /**
   * Structured error context from API response
   */
  public readonly error_data?: ErrorData;

  /**
   * Create new BotX error instance
   * @param message - Human-readable error description
   * @param reason - BotX API reason code (optional)
   * @param error_data - Additional error context from API (optional)
   */
  constructor(message: string, reason?: string, error_data?: ErrorData) {
    super(message);
    this.name = 'BotXError';
    this.reason = reason;
    this.error_data = error_data;
  }
}

/**
 * Authentication or JWT token validation failure
 */
export class AuthenticationError extends BotXError {
  constructor(message: string, error_data?: ErrorData) {
    super(message, 'authentication_failed', error_data);
    this.name = 'AuthenticationError';
  }
}

/**
 * Request payload validation error (client-side)
 */
export class ValidationError extends BotXError {
  constructor(message: string, error_data?: ErrorData) {
    super(message, 'validation_error', error_data);
    this.name = 'ValidationError';
  }
}

/**
 * Chat not found error from BotX API
 */
export class ChatNotFoundError extends BotXError {
  constructor(group_chat_id: string, error_data?: ErrorData) {
    super(`Chat not found: ${group_chat_id}`, 'chat_not_found', {
      ...error_data,
      group_chat_id,
    });
    this.name = 'ChatNotFoundError';
  }
}

/**
 * Event or message not found error from BotX API
 */
export class EventNotFoundError extends BotXError {
  constructor(sync_id: string, error_data?: ErrorData) {
    super(`Event not found: ${sync_id}`, 'event_not_found', {
      ...error_data,
      sync_id,
    });
    this.name = 'EventNotFoundError';
  }
}

/**
 * User not found error from BotX API
 */
export class UserNotFoundError extends BotXError {
  constructor(user_huid: string, error_data?: ErrorData) {
    super(`User not found: ${user_huid}`, 'user_not_found', {
      ...error_data,
      user_huid,
    });
    this.name = 'UserNotFoundError';
  }
}

/**
 * Bot is not a member of specified chat
 */
export class BotNotMemberError extends BotXError {
  constructor(group_chat_id: string, bot_id: string, error_data?: ErrorData) {
    super(`Bot is not a chat member: ${bot_id}`, 'bot_is_not_a_chat_member', {
      ...error_data,
      group_chat_id,
      bot_id,
    });
    this.name = 'BotNotMemberError';
  }
}

/**
 * Stealth mode required but disabled in chat
 */
export class StealthModeDisabledError extends BotXError {
  constructor(group_chat_id: string, error_data?: ErrorData) {
    super(`Stealth mode disabled in chat: ${group_chat_id}`, 'stealth_mode_disabled', {
      ...error_data,
      group_chat_id,
    });
    this.name = 'StealthModeDisabledError';
  }
}

/**
 * File-related error during upload or download
 */
export class FileError extends BotXError {
  constructor(message: string, reason: string, error_data?: ErrorData) {
    super(message, reason, error_data);
    this.name = 'FileError';
  }
}

/**
 * Factory function to create typed errors from API error responses
 * @param reason - BotX API reason code
 * @param message - Error message
 * @param error_data - Error context from API
 * @returns Appropriate BotXError subclass instance
 */
export function create_api_error(reason: string, message: string, error_data?: ErrorData): BotXError {
  switch (reason) {
    case 'chat_not_found':
      return new ChatNotFoundError(error_data?.group_chat_id as string || 'unknown', error_data);
    case 'event_not_found':
      return new EventNotFoundError(error_data?.sync_id as string || 'unknown', error_data);
    case 'user_not_found':
      return new UserNotFoundError(error_data?.user_huid as string || 'unknown', error_data);
    case 'bot_is_not_a_chat_member':
      return new BotNotMemberError(
        error_data?.group_chat_id as string || 'unknown',
        error_data?.bot_id as string || 'unknown',
        error_data
      );
    case 'stealth_mode_disabled':
      return new StealthModeDisabledError(error_data?.group_chat_id as string || 'unknown', error_data);
    case 'authentication_failed':
      return new AuthenticationError(message, error_data);
    case 'validation_error':
      return new ValidationError(message, error_data);
    default:
      return new BotXError(message, reason, error_data);
  }
}