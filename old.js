//create a discord bot
require('dotenv').config();//npm i dotenv

// things to do on discord.com/developers/applications
// 1. create an application
// 2. avatar
// 3. bot, then add bot
// 4. reset token, add token to .env
// 5. message content intent turn on 
// 6. OAuth2, custom URL
// https://discord.com/oauth2/authorize?scope=bot&permissions=8&client_id=YOUR_CLIENT_ID

//https://discord.com/oauth2/authorize?scope=bot&permissions=8&client_id=1071980540837765320

const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
]});

const { Configuration, OpenAIApi } = require('openai');
const configuration = new Configuration ({
    organization: process.env.OPENAI_ORG,
    apiKey: process.env.OPENAI_KEY,
});

const openai = new OpenAIApi(configuration);

client.on('messageCreate', async function(message){
    try {
        //dont reply to yourself or other bots
        if(message.author.bot) return;

        //!flip function
        if(message.content.substring(0,5) === "!flip") {
            const number = Math.random();
            if(message.author.username === 'sneaky' || number >= 0.5) {
                message.reply("**heads** \n\
                *trust*");
                return;
            } else {
                message.reply("**tails** \n\
                *trust*");
                return;
            };
        };

        const gptResponse = await openai.createCompletion({
            model: "text-davinci-003",
            prompt:`Bubbles is a very intelligent, helpful, creative, and friendly chatbot.\n\
            Bubbles: Hello, how are you?\n\
            ${message.author.username}: ${message.content}\n\
            Bubbles:`,
            temperature:0.9,
            max_tokens: 100,
            stop: ["Bubbles:", "sneaky:"],
            //echo: true,
        })
        message.reply(`${gptResponse.data.choices[0].text}`);
        return;
    } catch(err){
        console.log(err)
        message.reply("Sorry, I didn't get that, can you tell me again?")
    }
});

// log bot onto discord
client.login(process.env.DISCORD_TOKEN);
console.log("ChatGPT Bot is Online on Discord");

//node .\index.js

// "start": "node bot.js" 
