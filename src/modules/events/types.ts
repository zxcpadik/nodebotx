import type {
  UUID,
  NotificationStatus,
  Metadata,
  MessageOpts,
  Button,
  Mention,
  AttachedFile,
  SendOpts,
  EventStatus,
} from '../../types/common';
export * from '../../types/common';

/**
 * Payload for editing existing event/message
 */
export interface EditEventPayload {
  sync_id: UUID;
  payload: {
    status?: NotificationStatus;
    body?: string;
    metadata?: Metadata;
    opts?: MessageOpts;
    keyboard?: Button[][] | null;
    bubble?: Button[][] | null;
    mentions?: Mention[] | null;
  };
  file?: AttachedFile | null;
  opts?: {
    silent_response?: boolean;
    raw_mentions?: boolean;
  };
}

/**
 * Payload for replying to existing message
 */
export interface ReplyEventPayload {
  source_sync_id: UUID;
  reply: {
    status: NotificationStatus;
    body: string;
    metadata?: Metadata;
    opts?: MessageOpts;
    keyboard?: Button[][];
    bubble?: Button[][];
    mentions?: Mention[];
  };
  file?: AttachedFile | null;
  opts?: SendOpts;
}

/**
 * Response for reply event endpoint
 */
export interface ReplyEventResponse {
  result: 'bot_reply_pushed';
}

/**
 * Response for typing event endpoints
 */
export interface TypingEventResponse {
  result: 'typing_event_pushed' | 'stop_typing_event_pushed';
}

/**
 * Response for delete event endpoint
 */
export interface DeleteEventResponse {
  result: 'event_deleted';
}

/**
 * Query parameters for event status request
 */
export interface EventStatusQuery {
  sync_id: UUID;
}

/**
 * Validate edit payload field update rules
 * @param payload - Edit event payload to validate
 * @throws Error if invalid update pattern detected
 */
export function validate_edit_payload_rules(payload: EditEventPayload): void {
  if (payload.payload.mentions && payload.payload.body) {
    console.warn('Updating both mentions and body: existing mentions will be replaced in text');
  }
  if (payload.payload.keyboard?.length == 0 || payload.payload.bubble?.length == 0 || payload.payload.mentions?.length == 0) {
    console.warn('Empty array provided: corresponding field will be cleared');
  }
}

/**
 * Format mention placeholder for message body insertion
 * @param mention_id - UUID of mentioned entity
 * @param mention_type - Type: user, chat, channel, contact, or all
 * @returns Formatted mention string for body text
 */
export function format_mention_placeholder(mention_id: UUID, mention_type: string): string {
  const prefix = mention_type === 'contact' ? '@@' : mention_type === 'chat' || mention_type === 'channel' ? '##' : '@';
  return `${prefix}{mention:${mention_id}}`;
}