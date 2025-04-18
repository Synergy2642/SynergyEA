const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN); // Token set in Railway env vars
const OWNER_ID = process.env.OWNER_ID; // Your Telegram numeric ID

bot.start((ctx) => {
  console.log('Received /start command from:', ctx.from.username);
  console.log('Full message context:', ctx.message);

  ctx.reply(
    `Welcome to the Synergy EA bot!

This EA can use a few different strategies: hedging, martingale, and grid.

Price: $499 (One-Time)

Choose an option below:`,
    {
      reply_markup: {
        keyboard: [['🛒 Buy EA', 'ℹ️ Info']],
        resize_keyboard: true,
      },
    }
  );
});

bot.hears('ℹ️ Info', (ctx) => {
  ctx.reply(`📈 **Synergy PAMM EA**

This is the exact EA I used to reach #1 on the Sway Markets Leaderboard (now Liquid Brokers). It's a high-performance, fully automated trading system built to optimize profits while managing risk through real-time market adaptation.

✅ Strategies: Hedging, Grid, and Martingale  
✅ Compatible with all forex pairs  
✅ Works on MT4 & MT5  
✅ No VPS required (but recommended)  
✅ One-Time Purchase: $499

After payment is confirmed, you'll receive the EA file, full setup guide, and direct support to help you get started.`);
});
bot.hears('🛒 Buy EA', (ctx) => {
  ctx.reply(`To buy, send $499 to one of the following:

PayPal: apopdeedee@gmail.com
BTC Wallet: bc1qeyfpgu7rpwzzmned2txyt59rhkazyhvdgh64xk

After payment, reply here with a screenshot or transaction ID.`);

  const name = ctx.from.first_name;
  const username = ctx.from.username || 'no username';
  const msg = `User ${name} (@${username}) is interested in buying this EA.`;

  bot.telegram.sendMessage(OWNER_ID, msg);
});

// ✅ Photo handler should be outside the other handlers
bot.on('photo', async (ctx) => {
  ctx.reply('Thanks! Your payment will be reviewed shortly.');

  const file_id = ctx.message.photo[ctx.message.photo.length - 1].file_id;
  await bot.telegram.sendPhoto(OWNER_ID, file_id, {
    caption: `Payment screenshot from ${ctx.from.first_name} (@${ctx.from.username || 'no username'})`,
  });
});

// ✅ Start the bot here, once everything is set up
bot.launch();
console.log('Bot is running...');

