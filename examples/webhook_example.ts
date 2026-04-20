import { BotXClient, Router, WebhookServer, BotContext } from '@zxcpadik/nodebotx';

const client = new BotXClient({
  bot_id: process.env.BOT_ID!,
  secret_key: process.env.SECRET_KEY!,
  base_url: process.env.BASE_URL!,
});

const router = new Router();

router.on_command('echo', async (ctx: BotContext) => {
  const text = ctx.command_args.join(' ') || 'No text provided';
  await ctx.reply(`Echo: ${text}`);
});

router.on_command('time', async (ctx) => {
  await ctx.reply(`Current time: ${new Date().toLocaleTimeString()}`);
});

router.on_any(async (ctx) => {
  await ctx.reply('Unknown command. Try /echo or /time');
});

const server = new WebhookServer(client, router, { port: 3000, path: '/command' });
server.start();