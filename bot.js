const { Telegraf } = require('telegraf');
const Stripe = require('stripe');
const express = require('express');

const bot = new Telegraf({
  token: process.env.BOT_TOKEN,
  telegram: { webhookReply: true }
});

const OWNER_ID = process.env.OWNER_ID; // Telegram numeric ID
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // Stripe Secret Key in Railway env vars

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

// 🛒 Buy EA command with Stripe Checkout integration
bot.hears('🛒 Buy EA', async (ctx) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price: 'price_1RFR6102s2jzDrFzZ08bXyb2',
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: 'https://t.me/SynergyEABot?start=paid',
    cancel_url: 'https://t.me/SynergyEABot?start=cancel',
    metadata: {
      telegram_id: ctx.from.id,
      telegram_username: ctx.from.username,
    },
  });

  ctx.reply(`💳 Click below to complete your payment: ${session.url}`);

  const name = ctx.from.first_name;
  const username = ctx.from.username || 'no username';
  const msg = `📢 New buyer interest!

User ${name} (@${username}) clicked "Buy EA" and is proceeding to Stripe Checkout.`;

  bot.telegram.sendMessage(OWNER_ID, msg);
});

// 📞 Contact Support command
bot.hears('📞 Contact Support', (ctx) => {
  ctx.reply(
    'Tap the button below to contact support:',
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: '📮 Message Support',
              url: 'https://t.me/Ash9618' // Replace with your actual Telegram username
            }
          ]
        ]
      }
    }
  );
});

// Photo upload handler (for payment screenshots)
bot.on('photo', async (ctx) => {
  ctx.reply('Thanks! Your payment will be reviewed shortly.');

  const file_id = ctx.message.photo[ctx.message.photo.length - 1].file_id;
  await bot.telegram.sendPhoto(OWNER_ID, file_id, {
    caption: `Payment screenshot from ${ctx.from.first_name} (@${ctx.from.username || 'no username'})`,
  });
});

// Express Web Server for Webhook
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bot.webhookCallback('/telegram'));
bot.telegram.setWebhook(`https://${process.env.RAILWAY_STATIC_URL}/telegram`);

app.get('/', (req, res) => {
  res.send('Synergy EA Bot is live.');
});

app.listen(PORT, () => {
  console.log(`Bot is running on webhook at https://${process.env.RAILWAY_STATIC_URL}/telegram`);
});


