import type { BotXClient } from '../core/BotXClient';
import type { UUID, DirectNotificationRequest, Button, AttachedFile, MessageOpts, NotificationOpts } from '../types/common';
import type { IncomingWebhookPayload } from './types';

export class BotContext {
  readonly payload: IncomingWebhookPayload;
  private readonly client: BotXClient;

  constructor(payload: IncomingWebhookPayload, client: BotXClient) {
    this.payload = payload;
    this.client = client;
  }

  get chat_id(): UUID {
    return this.payload.from.group_chat_id;
  }

  get user_id(): UUID {
    return this.payload.from.user_huid;
  }

  get username(): string {
    return this.payload.from.username;
  }

  get text(): string {
    return this.payload.command.body;
  }

  get has_attachments(): boolean {
    return this.payload.attachments.length > 0;
  }

  get attachments() {
    return this.payload.attachments;
  }

  get command(): string | null {
    const trimmed = this.text.trim();
    if (!trimmed.startsWith('/')) return null;
    const first_space = trimmed.indexOf(' ');
    const cmd = first_space === -1 ? trimmed.slice(1) : trimmed.slice(1, first_space);
    return cmd.toLowerCase();
  }

  get command_args(): string[] {
    const trimmed = this.text.trim();
    if (!trimmed.startsWith('/')) return [];
    const args = trimmed.slice(1).split(/\s+/);
    return args.length > 1 ? args.slice(1) : [];
  }

  async reply(text: string, opts?: { metadata?: Record<string, unknown>; message_opts?: MessageOpts; notification_opts?: NotificationOpts }): Promise<{ sync_id: UUID }> {
    const payload: DirectNotificationRequest = {
      group_chat_id: this.chat_id,
      notification: {
        status: 'ok',
        body: text,
        metadata: opts?.metadata,
        opts: opts?.message_opts ?? { silent_response: false },
      },
      opts: opts?.notification_opts ? { notification_opts: opts.notification_opts } : undefined,
    };
    return this.client.notifications.send_direct(payload);
  }

  async reply_with_file(file: AttachedFile, text?: string, opts?: { metadata?: Record<string, unknown>; message_opts?: MessageOpts }): Promise<{ sync_id: UUID }> {
    const payload: DirectNotificationRequest = {
      group_chat_id: this.chat_id,
      notification: {
        status: 'ok',
        body: text ?? '',
        metadata: opts?.metadata,
        opts: opts?.message_opts ?? { silent_response: false },
      },
      file,
    };
    return this.client.notifications.send_direct(payload);
  }

  async reply_with_keyboard(keyboard: Button[][], text: string, opts?: { metadata?: Record<string, unknown>; message_opts?: MessageOpts }): Promise<{ sync_id: UUID }> {
    const payload: DirectNotificationRequest = {
      group_chat_id: this.chat_id,
      notification: {
        status: 'ok',
        body: text,
        keyboard,
        metadata: opts?.metadata,
        opts: opts?.message_opts ?? { silent_response: false },
      },
    };
    return this.client.notifications.send_direct(payload);
  }

  async edit(text: string, opts?: MessageOpts): Promise<void> {
    await this.client.events.edit_event({
      sync_id: this.payload.sync_id,
      payload: { body: text, opts },
    });
  }

  async delete(): Promise<void> {
    await this.client.events.delete_event(this.payload.sync_id);
  }

  async send_typing(): Promise<void> {
    await this.client.events.send_typing(this.chat_id);
  }

  async send_stop_typing(): Promise<void> {
    await this.client.events.send_stop_typing(this.chat_id);
  }
}