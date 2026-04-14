import { BotXError, create_api_error } from '../errors/BotXError';
import type { ErrorResponse } from '../types/api';

/**
 * Centralized error classification and mapping for BotX API responses
 */
export class ErrorHandler {
  /**
   * Map API error response to typed BotXError instance
   * @param error_response - Error response from BotX API
   * @returns Appropriate BotXError subclass instance
   */
  map_error_response(error_response: ErrorResponse): BotXError {
    const message = error_response.error_data?.error_description || 'BotX API error';
    return create_api_error(error_response.reason || 'unknown_error', message, error_response.error_data);
  }

  /**
   * Check if error is retryable based on reason code
   * @param error - BotXError instance to evaluate
   * @returns True if error may be transient and retryable
   */
  is_retryable_error(error: BotXError): boolean {
    const retryable_reasons = [
      'timeout',
      'network_error',
      'error_from_messaging_service',
      'error_from_file_service',
      'error_from_ad_phonebook_service',
    ];
    return retryable_reasons.includes(error.reason || '');
  }

  /**
   * Check if error indicates client-side validation failure
   * @param error - BotXError instance to evaluate
   * @returns True if error is due to invalid request payload
   */
  is_validation_error(error: BotXError): boolean {
    return error.name === 'ValidationError' || error.reason === 'validation_error';
  }

  /**
   * Check if error indicates authentication failure
   * @param error - BotXError instance to evaluate
   * @returns True if error is due to invalid or expired credentials
   */
  is_authentication_error(error: BotXError): boolean {
    return error.name === 'AuthenticationError' || error.reason === 'authentication_failed';
  }

  /**
   * Format error for logging with context
   * @param error - BotXError instance
   * @param context - Additional context for log message
   * @returns Formatted log string
   */
  format_for_log(error: BotXError, context?: Record<string, unknown>): string {
    const parts = [`[BotXError] ${error.name}: ${error.message}`];
    if (error.reason) parts.push(`reason=${error.reason}`);
    if (error.error_data) parts.push(`data=${JSON.stringify(error.error_data)}`);
    if (context) parts.push(`context=${JSON.stringify(context)}`);
    return parts.join(' | ');
  }

  /**
   * Extract user-facing message from error
   * @param error - BotXError instance
   * @returns Simplified message suitable for end-user display
   */
  get_user_message(error: BotXError): string {
    const user_messages: Record<string, string> = {
      chat_not_found: 'Chat not found',
      user_not_found: 'User not found',
      bot_is_not_a_chat_member: 'Bot is not a member of this chat',
      stealth_mode_disabled: 'Stealth mode is disabled in this chat',
      authentication_failed: 'Authentication failed',
      validation_error: 'Invalid request parameters',
      timeout: 'Request timed out',
    };
    return user_messages[error.reason || ''] || error.message;
  }
}