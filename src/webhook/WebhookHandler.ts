import type { IncomingMessage, ServerResponse } from 'node:http';
import type { BotXClient } from '../core/BotXClient';
import type { IncomingWebhookPayload } from './types';
import { Router } from './Router';
import { BotContext } from './BotContext';

export class WebhookHandler {
  private readonly client: BotXClient;
  private readonly router: Router;
  private readonly path: string;

  constructor(client: BotXClient, router: Router, options?: { path?: string }) {
    this.client = client;
    this.router = router;
    this.path = options?.path ?? '/command';
  }

  parse_payload(body: string): IncomingWebhookPayload {
    const parsed = JSON.parse(body);
    if (!parsed.command || !parsed.from || !parsed.sync_id) {
      throw new Error('Invalid webhook payload: missing required fields');
    }
    return parsed as IncomingWebhookPayload;
  }

  async handle_http_request(req: IncomingMessage, res: ServerResponse): Promise<void> {
    if (req.method !== 'POST' || !req.url?.startsWith(this.path)) {
      res.writeHead(404, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ status: 'not_found' }));
      return;
    }

    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', async () => {
      try {
        const payload = this.parse_payload(body);
        const ctx = new BotContext(payload, this.client);
        await this.router.route(ctx);
        res.writeHead(200, { 'content-type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok' }));
      } catch (error) {
        console.error('[BotX Webhook] Payload parse error:', error);
        res.writeHead(400, { 'content-type': 'application/json' });
        res.end(JSON.stringify({ status: 'parse_error' }));
      }
    });

    req.on('error', error => {
      console.error('[BotX Webhook] Request error:', error);
      res.writeHead(500, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ status: 'error' }));
    });
  }

  middleware() {
    return async (req: any, res: any, next: any) => {
      if (req.method !== 'POST' || !req.url?.startsWith(this.path)) {
        return next();
      }
      try {
        const payload = req.body as IncomingWebhookPayload;
        if (!payload.command || !payload.from) {
          return res.status(400).json({ status: 'invalid_payload' });
        }
        const ctx = new BotContext(payload, this.client);
        await this.router.route(ctx);
        return res.status(200).json({ status: 'ok' });
      } catch (error) {
        console.error('[BotX Webhook Middleware] Error:', error);
        return res.status(500).json({ status: 'error' });
      }
    };
  }
}