import type { BotContext } from './BotContext';
import type { WebhookHandlerFn } from './types';

type TextMatcher = { regex: RegExp; handler: WebhookHandlerFn };
type ErrorHandler = (ctx: BotContext, error: Error) => void | Promise<void>;

export class Router {
  private command_handlers: Map<string, WebhookHandlerFn> = new Map();
  private text_rules: TextMatcher[] = [];
  private fallback_handler?: WebhookHandlerFn;
  private error_handler?: ErrorHandler;

  on_command(command: string, handler: WebhookHandlerFn): void {
    this.command_handlers.set(command.toLowerCase(), handler);
  }

  on_text(regex: RegExp, handler: WebhookHandlerFn): void {
    this.text_rules.push({ regex, handler });
  }

  on_any(handler: WebhookHandlerFn): void {
    this.fallback_handler = handler;
  }

  on_error(handler: ErrorHandler): void {
    this.error_handler = handler;
  }

  async route(ctx: BotContext): Promise<boolean> {
    const command = ctx.command;
    if (command && this.command_handlers.has(command)) {
      const handler = this.command_handlers.get(command)!;
      return await this.execute_handler(ctx, handler);
    }

    for (const rule of this.text_rules) {
      if (rule.regex.test(ctx.text)) {
        return await this.execute_handler(ctx, rule.handler);
      }
    }

    if (this.fallback_handler) {
      return await this.execute_handler(ctx, this.fallback_handler);
    }

    return false;
  }

  private async execute_handler(ctx: BotContext, handler: WebhookHandlerFn): Promise<boolean> {
    try {
      await handler(ctx);
      return true;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      if (this.error_handler) {
        await this.error_handler(ctx, err);
      } else {
        console.error('[BotX Router] Unhandled error:', err);
      }
      return true;
    }
  }
}