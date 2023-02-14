// things to do on discord.com/developers/applications
// 1. create an application
// 2. avatar
// 3. bot, then add bot
// 4. reset token, add token to .env
// 5. message content intent turn on 
// 6. OAuth2, custom URL
//https://discord.com/oauth2/authorize?scope=bot&permissions=8&client_id=1071980540837765320

//create a discord bot
require('dotenv').config();//npm i dotenv

//get image function
//const generateImage = require("./generateImage.js");
//const Canvas = require("canvas");

//commands
const fs = require('node:fs');
const path = require('node:path');

const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');

const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
]});

//commands path
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles){
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.data.name, command);
};

//open ai replies 
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

        //test welcome function
        if(message.content.substring(0,1) === "1") {
            //get current date time
            var currentDate = new Date().toLocaleString();

            message.reply({
                content: `It is ${currentDate}. You are barely on time, <@${message.author.id}>`,
                files: [{
                    attachment: "./pictures/cat2.png",
                }]
            })
            return;
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

//npm i canvas
//for adding images

//commands interaction
client.once(Events.ClientReady, () => {
    console.log("Ready to accept commands!")
});

//commands interaction
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (err){
        console.log(err);
        await interaction.reply({
            content: "There was an error while executing this command!"
        })
    }
});

// log bot onto discord
client.login(process.env.DISCORD_TOKEN);
console.log("ChatGPT Bot is Online on Discord")

//node .\index.js

//"start": "node bot.js" 

