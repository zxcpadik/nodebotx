import { API_ENDPOINTS } from '../../config/constants';
import { validate_edit_payload_rules } from './types';
import type { BotXClient } from '../../core/BotXClient';
import type { UUID } from '../../types/common';
import type {
  EditEventPayload,
  ReplyEventPayload,
  ReplyEventResponse,
  TypingEventResponse,
  DeleteEventResponse,
  EventStatus,
} from './types';

/**
 * Events API module for message lifecycle management
 */
export class EventsAPI {
  private readonly client: BotXClient;

  /**
   * Create EventsAPI module instance
   * @param client - Parent BotXClient instance
   */
  constructor(client: BotXClient) {
    this.client = client;
  }

  /**
   * Edit content of previously sent event/message
   * @param payload - Edit request with fields to update
   * @returns Void on success (async processing)
   */
  async edit_event(payload: EditEventPayload): Promise<void> {
    validate_edit_payload_rules(payload);
    
    await this.client.request<void, EditEventPayload>(
      'POST',
      API_ENDPOINTS.EVENTS.EDIT,
      { body: payload }
    );
  }

  /**
   * Send reply to existing message
   * @param payload - Reply request with source sync_id and response content
   * @returns Confirmation of reply delivery
   */
  async reply_event(payload: ReplyEventPayload): Promise<ReplyEventResponse> {
    const content_type = payload.file ? 'multipart/form-data' : 'application/json';
    
    return await this.client.request<ReplyEventResponse, ReplyEventPayload>(
      'POST',
      API_ENDPOINTS.EVENTS.REPLY,
      { 
        body: payload,
        content_type,
      }
    );
  }

  /**
   * Get delivery status of sent message by sync_id
   * @param sync_id - Unique identifier of the event
   * @returns Status with sent/read/received tracking data
   */
  async get_event_status(sync_id: UUID): Promise<EventStatus> {
    return await this.client.request<EventStatus>(
      'GET',
      API_ENDPOINTS.EVENTS.STATUS(sync_id)
    );
  }

  /**
   * Send typing indicator to chat participants
   * @param group_chat_id - Target chat identifier
   * @returns Confirmation of typing event delivery
   */
  async send_typing(group_chat_id: UUID): Promise<TypingEventResponse> {
    return await this.client.request<TypingEventResponse>(
      'POST',
      API_ENDPOINTS.EVENTS.TYPING,
      { body: { group_chat_id } }
    );
  }

  /**
   * Send stop typing indicator to chat participants
   * @param group_chat_id - Target chat identifier
   * @returns Confirmation of stop typing event delivery
   */
  async send_stop_typing(group_chat_id: UUID): Promise<TypingEventResponse> {
    return await this.client.request<TypingEventResponse>(
      'POST',
      API_ENDPOINTS.EVENTS.STOP_TYPING,
      { body: { group_chat_id } }
    );
  }

  /**
   * Delete message by sync_id
   * @param sync_id - Unique identifier of message to delete
   * @returns Confirmation of deletion
   */
  async delete_event(sync_id: UUID): Promise<DeleteEventResponse> {
    return await this.client.request<DeleteEventResponse>(
      'POST',
      API_ENDPOINTS.EVENTS.DELETE,
      { body: { sync_id } }
    );
  }
}