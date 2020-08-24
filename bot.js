require("dotenv").config();
const { Telegraf } = require('telegraf');
const api = require("covid19-api");
const Markup = require("telegraf/markup")
const COUNTRIES_LIST = require("./constants");


const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) =>  ctx.reply(`Привет ${ctx.message.from.username}!\n
Если хочешь узнать статистику по странам, просто напиши страну на английском.
Что бы узнать название доступных стран, напиши /help и выбери страну из списка\n
For English - Person: 
If you want to know statistics by country, just write the country in English.
To find out name of the available countries, write / help and select a country from the list`, Markup.keyboard([
    ["US", "Ukraine"],
    ["Russia", "Belarus"],
    ["/help"]
    ]).resize()
    .extra()
));
bot.help((ctx) => ctx.reply("Выбирай:\n" + COUNTRIES_LIST));
bot.on('sticker', (ctx) => ctx.reply('👍'));
bot.on("text", async (ctx) => {
    let data = {};
    try {
        data = await api.getReportsByCountries(`${(ctx.message.text).toLowerCase()}`);
        let country = data[0][0].country
        let formattedData = `
Страна - ${country[0].toUpperCase() + country.slice(1)};
Колл-во заболевших - ${data[0][0].cases};
Смертей - ${data[0][0].deaths};
Колл-во выздоровевших - ${data[0][0].recovered};
${data[0][0].flag}
`
        ctx.reply(formattedData)
    }catch (e) {
        ctx.reply("Извините, такой страны к сожалению нет в списке.\nПопробуйте написать команду /help")
        console.log(e)
    }
    console.log(data);

})
bot.launch();
console.log("Bot started 👍");