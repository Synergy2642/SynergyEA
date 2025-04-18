const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN); // Token set in Railway env vars
const OWNER_ID = process.env.OWNER_ID; // Your Telegram numeric ID

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
bot.hears('🛒 Buy EA', (ctx) => {
  ctx.reply(`🧾 To purchase the Synergy EA, please send $499 to one of the following:

PayPal: apopdeedee@gmail.com  
BTC Wallet: bc1qeyfpgu7rpwzzmned2txyt59rhkazyhvdgh64xk

After payment, reply here with a screenshot or transaction ID.  
Your EA file and setup guide will be sent after manual confirmation.`);

  const name = ctx.from.first_name;
  const username = ctx.from.username || 'no username';
  const msg = `📢 New buyer interest!\n\nUser ${name} (@${username}) clicked "Buy EA" and may be completing payment.`;

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
              text: '📨 Message Support',
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

// Launch the bot
bot.launch();
console.log('Bot is running...');
