const { Telegraf } = require('telegraf');
const Stripe = require('stripe');
const express = require('express');

const bot = new Telegraf(process.env.BOT_TOKEN, {
  telegram: { webhookReply: true }
});

const OWNER_ID = process.env.OWNER_ID;
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// /start command
bot.start((ctx) => {
  console.log('Received /start command from:', ctx.from.username);
  console.log('Full message context:', ctx.message);

  ctx.reply(
    `👋 Welcome to the Synergy EA Bot!

This is the same EA that helped me reach #1 on the Sway Markets Leaderboard (now Liquid Brokers). It combines hedging, martingale, and grid strategies to adapt in real time to market conditions.

Choose an option below to learn more or make a purchase.`,
    {
      reply_markup: {
        keyboard: [
          ['🛒 Buy EA', 'ℹ️ Info'],
          ['📞 Contact Support']
        ],
        resize_keyboard: true,
      },
    }
  );
});

// ℹ️ Info command
bot.hears('ℹ️ Info', (ctx) => {
  ctx.reply(`📈 Synergy PAMM EA Overview

This powerful, fully automated system is designed to generate consistent returns while minimizing risk. Used to grow Synergy PAMM, it’s battle-tested in live market conditions.

✅ Strategies: Hedging, Grid, Martingale  
✅ Works with all Forex pairs  
✅ MT4 & MT5 Compatible  
✅ No VPS required (but recommended)`);
});

// 🛒 Buy EA command
bot.hears('🛒 Buy EA', async (ctx) => {
  const shortStripeUrl = 'https://buy.stripe.com/4gw8xk1tCgQo73qaEE'; // Short Stripe Payment Link

  ctx.reply(`💳 Click below to complete your payment:
${shortStripeUrl}`);

  const name = ctx.from.first_name;
  const username = ctx.from.username || 'no username';
  const msg = `📢 New buyer interest!

User ${name} (@${username}) clicked "Buy EA" and is proceeding to Stripe Checkout.`;

  bot.telegram.sendMessage(OWNER_ID, msg);
});

// 📞 Contact Support command
bot.hears('📞 Contact Support', (ctx) => {
  ctx.reply('Tap the button below to contact support:', {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: '📮 Message Support',
            url: 'https://t.me/Ash9618'
          }
        ]
      ]
    }
  });
});

// Photo upload handler
bot.on('photo', async (ctx) => {
  ctx.reply('Thanks! Your payment will be reviewed shortly.');

  const file_id = ctx.message.photo[ctx.message.photo.length - 1].file_id;
  const username = ctx.from.username || 'no username';

  await bot.telegram.sendPhoto(OWNER_ID, file_id, {
    caption: `Payment screenshot from ${ctx.from.first_name} (@${username})`,
  });
});

// Express Web Server
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bot.webhookCallback('/telegram'));

// Healthcheck root path
app.get('/', (req, res) => {
  res.status(200).send('ok');
});

// Manually define domain to prevent undefined errors
const domain = process.env.DOMAIN || 'synergyea-production.up.railway.app';

app.listen(PORT, () => {
  console.log(`Server is running at https://${domain}/telegram`);

  // Delay setting webhook slightly to ensure endpoint is ready
  setTimeout(async () => {
    try {
      await bot.telegram.setWebhook(`https://${domain}/telegram`);
      console.log('✅ Webhook successfully set with Telegram');
    } catch (err) {
      console.error('❌ Failed to set webhook:', err);
    }
  }, 1500);
});
