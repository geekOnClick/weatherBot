const { default: axios } = require('axios');
const { Telegraf } = require('telegraf')

const bot = new Telegraf('5220483241:AAF3vf78QObrhQY1t-jSlgQxJUeBEKHMM8o', {polling: true});


bot.start( (ctx) => {
    ctx.reply('Привет, давай я подскажу тебе погоду. Введи название города и получай температуру');
})

bot.on('text', (ctx) => {
    let chatId = ctx.chat.id
    ctx.reply('Поглядим...');

    async function request() {
        try {
        let response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
        params: {
            q: ctx.message.text,
            appid: '2b3870ad565e4422feb3a05ae0efda79',
            units: 'metric'
        }
        })
        await ctx.reply(`В ${response.data.name} сейчас ${parseInt(response.data.main.temp)}`)

        const keyboard = [
            [
                {
                  text: 'Подробнее',
                  callback_data: 'additional' 
                }
              ],
              [
                {
                  text: 'Ощущается как',
                  callback_data: 'feels'
                }
              ],
              [
                {
                    text: 'Давление',
                    callback_data: 'preasure'
                  } 
              ]
        ]
                
        await ctx.reply('что вы хотите узнать?', {
            reply_markup: {
                inline_keyboard: keyboard
              }
        })
        
        bot.on('callback_query', (ctx) => {
            switch(ctx.callbackQuery.data) {
                case 'additional': 
                    ctx.reply('Сейчас на улице ' + response.data.weather[0].description)
                    break;
                case 'feels':
                    ctx.reply('Ощущается как '+ parseInt(response.data.main.feels_like))
                    break;
                case 'preasure':
                    ctx.reply('Атмосферное давление '+ parseInt(response.data.main.pressure))
                    break;
            }
        })
        
        bot.on('chosen_inline_result', () => {
            bot.stop()
        })
             
        }
        catch {
            ctx.reply('Не понял, какой город?')
        }
    }
    request()
})
bot.launch()