import type {
  UUID,
  NotificationStatus,
  Metadata,
  MessageOpts,
  Button,
  Mention,
  AttachedFile,
  SendOpts,
  NotificationOpts,
} from '../../types/common';

/**
 * Payload for direct notification to chat
 */
export interface DirectNotificationPayload {
  status: NotificationStatus;
  body: string;
  metadata?: Metadata;
  opts?: MessageOpts;
  keyboard?: Button[][];
  bubble?: Button[][];
  mentions?: Mention[];
}

/**
 * Complete request payload for direct notification v4
 */
export interface DirectNotificationRequest {
  group_chat_id: UUID;
  recipients?: UUID[] | null;
  notification: DirectNotificationPayload;
  file?: AttachedFile | null;
  opts?: {
    stealth_mode?: boolean;
    notification_opts?: NotificationOpts;
  };
}

/**
 * Response from direct notification endpoints
 */
export interface NotificationResponse {
  sync_id: UUID;
}

/**
 * Payload for internal bot-to-bot notification
 */
export interface InternalNotificationRequest {
  group_chat_id: UUID;
  data: Record<string, unknown>;
  opts?: Record<string, unknown>;
  recipients?: UUID[] | null;
}

/**
 * Mention data for user or contact mention type
 */
export interface UserMentionData {
  user_huid: UUID;
  name?: string | null;
}

/**
 * Mention data for chat or channel mention type
 */
export interface ChatMentionData {
  group_chat_id: UUID;
  name?: string | null;
}

/**
 * Complete mention definition with type-specific data
 */
export interface FullMention {
  mention_type?: 'user' | 'chat' | 'channel' | 'contact' | 'all';
  mention_id?: UUID;
  mention_data: UserMentionData | ChatMentionData | null;
}

/**
 * Button with extended client options
 */
export interface FullButton {
  command: string;
  label: string;
  data?: Record<string, unknown>;
  opts?: {
    silent?: boolean;
    h_size?: number;
    show_alert?: boolean;
    alert_text?: string | null;
    font_color?: string | null;
    background_color?: string | null;
    align?: 'left' | 'center' | 'right';
  };
}

/**
 * Validate mention template format in message body
 * @param mention_id - UUID of the mentioned entity
 * @param mention_type - Type of mention (user/chat/channel/contact/all)
 * @returns Template string for embedding in message body
 */
export function get_mention_template(mention_id: UUID, mention_type: string): string {
  if (mention_type === 'contact') {
    return `@@{mention:${mention_id}}`;
  }
  if (mention_type === 'chat' || mention_type === 'channel') {
    return `##{mention:${mention_id}}`;
  }
  return `@{mention:${mention_id}}`;
}

/**
 * Calculate estimated size of notification payload for request limits
 * @param payload - Notification request object
 * @returns Estimated JSON size in bytes
 */
export function calculate_notification_payload_size(payload: DirectNotificationRequest): number {
  return new TextEncoder().encode(JSON.stringify(payload)).length;
}