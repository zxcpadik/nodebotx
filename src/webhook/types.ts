import type { UUID } from '../types/common';
import { BotContext } from './BotContext';

export interface IncomingAttachmentData {
  file_name?: string;
  content?: string;
  id?: UUID;
  version?: number;
  link?: string;
  pack?: UUID;
  mime_type?: string;
  [key: string]: unknown;
}

export interface IncomingAttachment {
  type: 'image' | 'sticker' | 'file' | string;
  data: IncomingAttachmentData;
}

export interface IncomingDeviceMeta {
  permissions?: Record<string, boolean>;
  pushes?: boolean;
  timezone?: string;
  [key: string]: unknown;
}

export interface IncomingSender {
  device: string;
  host: string;
  username: string;
  user_huid: UUID;
  group_chat_id: UUID;
  chat_type: string;
  ad_login: string;
  ad_domain: string;
  manufacturer: string;
  device_software: string;
  device_meta: IncomingDeviceMeta;
  platform: string;
  platform_package_id: string;
  app_version: string;
  locale: string;
  user_udid: UUID;
  is_admin: boolean;
  is_creator: boolean;
  source_server_id: UUID;
  [key: string]: unknown;
}

export interface IncomingCommand {
  data: Record<string, unknown>;
  metadata: Record<string, unknown>;
  body: string;
  command_type: 'user' | 'system' | string;
  opts?: Record<string, unknown>;
  mentions?: Array<{ mention_id: UUID; mention_type: string }>;
}

export interface IncomingWebhookPayload {
  command: IncomingCommand;
  from: IncomingSender;
  bot_id: UUID;
  sync_id: UUID;
  source_sync_id: UUID | null;
  entities: unknown[];
  proto_version: number;
  attachments: IncomingAttachment[];
  async_files: unknown[];
  [key: string]: unknown;
}

export type WebhookHandlerFn = (ctx: BotContext) => void | Promise<void>;