import { API_ENDPOINTS } from '../../config/constants';
import { validate_direct_notification_request, validate_request_size } from '../../utils/validators';
import type { BotXClient } from '../../core/BotXClient';
import type { Button, UUID } from '../../types/common';
import type {
  DirectNotificationRequest,
  NotificationResponse,
  InternalNotificationRequest,
} from './types';

/**
 * Notifications API module for sending messages to chats and bots
 */
export class NotificationsAPI {
  private readonly client: BotXClient;

  /**
   * Create NotificationsAPI module instance
   * @param client - Parent BotXClient instance
   */
  constructor(client: BotXClient) {
    this.client = client;
  }

  /**
   * Send direct notification to chat (asynchronous, callback-based result)
   * @param payload - Notification request with message content and options
   * @returns Sync ID for tracking delivery status via callback
   */
  async send_direct(payload: DirectNotificationRequest): Promise<NotificationResponse> {
    validate_direct_notification_request(payload);
    
    const json_size = this.client.get_request_handler().calculate_json_size(payload);
    const file_size = payload.file 
      ? this.client.get_request_handler().calculate_base64_size(payload.file.data) 
      : 0;
    validate_request_size(json_size, file_size);

    return await this.client.request<NotificationResponse, DirectNotificationRequest>(
      'POST',
      API_ENDPOINTS.NOTIFICATIONS.DIRECT_V4,
      { body: payload }
    );
  }

  /**
   * Send direct notification to chat (synchronous, immediate result)
   * @param payload - Notification request with message content and options
   * @returns Sync ID and delivery result in same response
   */
  async send_direct_sync(payload: DirectNotificationRequest): Promise<NotificationResponse> {
    validate_direct_notification_request(payload);
    
    const json_size = this.client.get_request_handler().calculate_json_size(payload);
    const file_size = payload.file 
      ? this.client.get_request_handler().calculate_base64_size(payload.file.data) 
      : 0;
    validate_request_size(json_size, file_size);

    return await this.client.request<NotificationResponse, DirectNotificationRequest>(
      'POST',
      API_ENDPOINTS.NOTIFICATIONS.DIRECT_SYNC_V4,
      { body: payload }
    );
  }

  /**
   * Send internal notification to other bots in chat
   * @param payload - Internal notification with custom data payload
   * @returns Sync ID for tracking internal message delivery
   */
  async send_internal(payload: InternalNotificationRequest): Promise<NotificationResponse> {
    if (!payload.group_chat_id) {
      throw new Error('group_chat_id is required for internal notification');
    }

    return await this.client.request<NotificationResponse, InternalNotificationRequest>(
      'POST',
      API_ENDPOINTS.NOTIFICATIONS.INTERNAL_V4,
      { body: payload }
    );
  }

  /**
   * Build keyboard layout from flat button array
   * @param buttons - Array of button definitions
   * @param row_size - Number of buttons per row (default: 2)
   * @returns Two-dimensional array for keyboard rendering
   */
  build_keyboard(buttons: Array<{ command: string; label: string; data?: Record<string, unknown>; opts?: Record<string, unknown> }>, row_size = 2): Button[][] {
    const keyboard: Button[][] = [];
    for (let i = 0; i < buttons.length; i += row_size) {
      keyboard.push(buttons.slice(i, i + row_size).map(btn => ({
        command: btn.command,
        label: btn.label,
        data: btn.data,
        opts: btn.opts,
      })));
    }
    return keyboard;
  }

  /**
   * Build bubble layout (buttons under message) from flat array
   * @param buttons - Array of button definitions
   * @param row_size - Number of buttons per row (default: 2)
   * @returns Two-dimensional array for bubble rendering
   */
  build_bubble(buttons: Array<{ command: string; label: string; data?: Record<string, unknown>; opts?: Record<string, unknown> }>, row_size = 2): Button[][] {
    return this.build_keyboard(buttons, row_size);
  }
}