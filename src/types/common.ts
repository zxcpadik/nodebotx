/**
 * Universally Unique Identifier string format
 */
export type UUID = string;

/**
 * ISO 8601 date-time string format
 */
export type ISODate = string;

/**
 * API response status indicator
 */
export type APIStatus = 'ok' | 'error';

/**
 * Bot allowed data reception mode
 */
export type AllowedData = 'all' | 'commands' | 'none';

/**
 * Bot communication availability scope
 */
export type CommunicationAvailability = 'corporate' | 'trust' | 'local' | 'all';

/**
 * Bot contour for file service interaction
 */
export type BotContour = 'corporate' | 'foreign' | 'any';

/**
 * Chat type identifier
 */
export type ChatType = 'chat' | 'group_chat' | 'channel';

/**
 * User kind classification
 */
export type UserKind = 'cts_user' | 'unregistered' | 'botx';

/**
 * Mention type for message annotations
 */
export type MentionType = 'user' | 'chat' | 'channel' | 'contact' | 'all';

/**
 * Notification status for command execution result
 */
export type NotificationStatus = 'ok' | 'error';

/**
 * Link type for chat invitation generation
 */
export type LinkType = 'public' | 'corporate' | 'trusts' | 'server';

/**
 * HTTP method enumeration for API requests
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

/**
 * File encryption algorithm identifier
 */
export type FileEncryptionAlgo = 'stream';

/**
 * Base64 encoded file data with RFC 2397 data URL prefix
 */
export type Base64FileData = string;

/**
 * Generic key-value metadata container
 */
export type Metadata = Record<string, unknown>;

/**
 * Button client-side options configuration
 */
export interface ButtonOpts {
  silent?: boolean;
  h_size?: number;
  show_alert?: boolean;
  alert_text?: string | null;
  font_color?: string | null;
  background_color?: string | null;
  align?: 'left' | 'center' | 'right';
}

/**
 * Interactive button definition for keyboard or bubble layout
 */
export interface Button {
  command: string;
  label: string;
  data?: Record<string, unknown>;
  opts?: ButtonOpts;
}

/**
 * Mention data for user or contact type
 */
export interface UserMentionData {
  user_huid: UUID;
  name?: string | null;
}

/**
 * Mention data for chat or channel type
 */
export interface ChatMentionData {
  group_chat_id: UUID;
  name?: string | null;
}

/**
 * Mention definition for message annotation
 */
export interface Mention {
  mention_type?: MentionType;
  mention_id?: UUID;
  mention_data: UserMentionData | ChatMentionData | null;
}

/**
 * Message display and behavior options
 */
export interface MessageOpts {
  silent_response?: boolean;
  buttons_auto_adjust?: boolean;
}

/**
 * Push notification delivery options
 */
export interface NotificationOpts {
  send?: boolean;
  force_dnd?: boolean;
}

/**
 * Request-level options for message sending
 */
export interface SendOpts {
  stealth_mode?: boolean;
  raw_mentions?: boolean;
  notification_opts?: NotificationOpts;
}

/**
 * File attachment with base64 encoding
 */
export interface AttachedFile {
  file_name: string;
  data: Base64FileData;
  caption?: string | null;
}

/**
 * Notification content payload structure
 */
export interface NotificationPayload {
  status: NotificationStatus;
  body: string;
  metadata?: Metadata;
  opts?: MessageOpts;
  keyboard?: Button[][];
  bubble?: Button[][];
  mentions?: Mention[];
}

/**
 * Complete direct notification request payload
 */
export interface DirectNotificationRequest {
  group_chat_id: UUID;
  recipients?: UUID[] | null;
  notification: NotificationPayload;
  file?: AttachedFile | null;
  opts?: SendOpts;
}

/**
 * Internal bot-to-bot notification payload
 */
export interface InternalNotificationRequest {
  group_chat_id: UUID;
  data: Record<string, unknown>;
  opts?: Record<string, unknown>;
  recipients?: UUID[] | null;
}

/**
 * Event editing payload with partial update support
 */
export interface EditEventPayload {
  sync_id: UUID;
  payload: Partial<NotificationPayload> & {
    keyboard?: Button[][] | null;
    bubble?: Button[][] | null;
    mentions?: Mention[] | null;
  };
  opts?: {
    silent_response?: boolean;
    raw_mentions?: boolean;
  };
}

/**
 * Reply to existing message payload
 */
export interface ReplyEventPayload {
  source_sync_id: UUID;
  reply: NotificationPayload;
  file?: AttachedFile | null;
  opts?: SendOpts;
}

/**
 * Event delivery status tracking result
 */
export interface EventStatus {
  group_chat_id: UUID;
  sent_to: UUID[];
  read_by: {
    user_huid: UUID;
    read_at: ISODate;
  }[];
  received_by: {
    user_huid: UUID;
    received_at: ISODate;
  }[];
}

/**
 * Chat member information with role
 */
export interface ChatMember {
  admin: boolean;
  server_id: UUID;
  user_huid: UUID;
  user_kind: UserKind;
}

/**
 * Chat information structure
 */
export interface ChatInfo {
  group_chat_id: UUID;
  chat_type: ChatType;
  name: string;
  description: string | null;
  members: (UUID | ChatMember)[];
  shared_history: boolean;
  inserted_at: ISODate;
  updated_at: ISODate;
  creator?: UUID;
}

/**
 * User profile data structure
 */
export interface UserProfile {
  user_huid: UUID;
  ad_login: string;
  ad_domain: string;
  name: string;
  company: string | null;
  company_position: string | null;
  department: string | null;
  emails: string[];
  other_id: string | null;
  user_kind: UserKind;
  active: boolean;
  created_at: ISODate;
  cts_id: UUID;
  description: string | null;
  ip_phone: number | null;
  manager: string | null;
  office: string | null;
  other_ip_phone: string | null;
  other_phone: string | null;
  public_name: string | null;
  rts_id: UUID | null;
  updated_at: ISODate;
}

/**
 * Uploaded file metadata result
 */
export interface UploadedFile {
  type: string;
  file: string;
  file_mime_type: string;
  file_name: string;
  file_preview: string | null;
  file_preview_height: number | null;
  file_preview_width: number | null;
  file_size: number;
  file_hash: string;
  file_encryption_algo: FileEncryptionAlgo;
  chunk_size: number;
  file_id: UUID;
  caption: string | null;
  duration: number | null;
}

/**
 * File metadata for upload request
 */
export interface FileMeta {
  duration?: number | null;
  caption?: string | null;
}

/**
 * Chat link creation parameters
 */
export interface LinkParams {
  link_type: LinkType;
  access_code?: string | null;
  link_ttl?: number | null;
}

/**
 * Created chat link result
 */
export interface CreatedLink {
  url: string;
  link_type: LinkType;
  access_code: string | null;
  link_ttl: number | null;
}

/**
 * Bot catalog entry for listing
 */
export interface BotCatalogEntry {
  user_huid: UUID;
  name: string;
  description: string;
  avatar: string;
  enabled: boolean;
}

/**
 * Bot catalog response container
 */
export interface BotCatalogResult {
  generated_at: ISODate;
  bots: BotCatalogEntry[];
}

/**
 * Bot configuration properties from admin panel
 */
export interface BotProperties {
  allowed_data: AllowedData;
  allow_chat_creating: boolean;
  show_in_catalog: boolean;
  communication_availability: CommunicationAvailability;
  use_botx_ca_cert: boolean;
  use_pds_token: boolean;
  pds_key?: string;
  use_open_id_access_token: boolean;
  contour: BotContour;
}

/**
 * Full bot entity representation
 */
export interface Bot {
  id: UUID;
  app_id: string;
  url: string;
  name: string;
  description: string;
  enabled: boolean;
  status_message: string;
  secret_key: string;
  proto_version: number;
  properties?: BotProperties;
}