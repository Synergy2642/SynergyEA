const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN); // Token set in Railway env vars
const OWNER_ID = process.env.OWNER_ID; // Your Telegram numeric ID

bot.start((ctx) => {
  ctx.reply(
    `Welcome to the Synergy EA bot!

This EA can use a few different strategies hedging, martingale, and grid.

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
  ctx.reply(`Synergy EA is optimized for risk-managed gains using martingale hedging.

→ One-Time Purchase: $499  
→ Lifetime Updates: Free  

You will receive the EA file + setup instructions after manual payment confirmation.`);
});

bot.hears('🛒 Buy EA', (ctx) => {
  ctx.reply(`To buy, send $99 to one of the following:

PayPal: apopdeedee@gmail.com  
BTC Wallet: bc1qeyfpgu7rpwzzmned2txyt59rhkazyhvdgh64xk

After payment, reply here with a screenshot or transaction ID.`);

 const name = ctx.from.first_name;
const username = ctx.from.username || 'no username';
const msg = `User ${name} (@${username}) is interested in buying this EA.`;
bot.sendMessage(ctx.chat.id, msg);
bot.on('photo', async (ctx) => {
  ctx.reply('Thanks! Your payment will be reviewed shortly.');

  const file_id = ctx.message.photo[ctx.message.photo.length - 1].file_id;
  await bot.telegram.sendPhoto(OWNER_ID, file_id, {
    caption: `Payment screenshot from ${ctx.from.first_name} (@${ctx.from.username || `no username`})`,
  });
});

bot.launch();
console.log('Bot is running...');
});
