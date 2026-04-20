import { createServer, Server } from 'node:http';
import type { BotXClient } from '../core/BotXClient';
import { Router } from './Router';
import { WebhookHandler } from './WebhookHandler';

export class WebhookServer {
  private readonly handler: WebhookHandler;
  private readonly server: Server;
  private readonly port: number;
  private readonly path: string;
  private readonly listen_addr: string;

  constructor(client: BotXClient, router: Router, options?: { port?: number; path?: string, listen_addr?: string }) {
    this.port = options?.port ?? 3000;
    this.path = options?.path ?? '/command';
    this.listen_addr = options?.listen_addr ?? '0.0.0.0';
    this.handler = new WebhookHandler(client, router, { path: this.path });
    this.server = createServer(async (req, res) => {
      await this.handler.handle_http_request(req, res);
    });
  }

  start(): void {
    this.server.listen(this.port, this.listen_addr, () => {
      console.log(`BotX Webhook Server listening at ${this.listen_addr}:${this.port} at ${this.path}`);
    });
  }

  stop(): Promise<void> {
    return new Promise(resolve => this.server.close(() => resolve()));
  }

  get url(): string {
    return `http://${this.listen_addr}:${this.port}${this.path}`;
  }
}