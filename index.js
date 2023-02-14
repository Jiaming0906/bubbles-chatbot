// things to do on discord.com/developers/applications
// 1. create an application
// 2. avatar
// 3. bot, then add bot
// 4. reset token, add token to .env
// 5. message content intent turn on 
// 6. OAuth2, custom URL
//https://discord.com/oauth2/authorize?scope=bot&permissions=8&client_id=1071980540837765320

//create a discord bot
require('dotenv').config();
//npm i dotenv
//npm i discord.js
//npm i discord-player

//define
const dotenv = require("dotenv");
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');

const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10")
const { Player } = require("discord-player");

const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates
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

//channel ids
const announcementsChannelId = "1073043983724453961";
const generalChannelId = "1071955339324440609";
const commandsChannelId = "1073055799653445776";
const bubblesChannelId = "1073062424602746970";
const rulesChannelId = "1073475362501165056";
const channelDescriptionId = "1072676212985569360";

const noReplyLst = [announcementsChannelId, generalChannelId, rulesChannelId, channelDescriptionId];

client.on('messageCreate', async function(message){
    try {
        //dont reply to yourself or other bots
        if(message.author.bot) return;

        //dont reply to system message
        if(message.system) return;

        //if message.channel.id is in noReplyLst
        if (noReplyLst.includes(message.channel.id)){
            return;
        };

        //ignore messages if no words, like a picture/gif/sticker
        if(message.content === '') return;

        //creative messages
        if(message.content.substring(0,7).toLowerCase() === "bubbles"){
            try {
                const creativeResponse = await openai.createCompletion({
                    model: "davinci",
                    prompt:`bubbles is a very friendly and creative chatbot. \n\
                    ${message.author.username}: What are polar bears? \n\
                    bubbles: They are big, fluffy animals. \n\
                    ${message.author.username}: ${message.content} \n\
                    bubbles:`,
                    temperature: 0.9,
                    max_tokens: 100,
                    stop: ["bubbles", "sneaky"],
                })
                message.reply(`${creativeResponse.data.choices[0].text}`);
                return;
            } catch(err){
                console.log(err);
                message.reply("Have literally no idea what you're saying [sadface].")
            }
        };

        const gptResponse = await openai.createCompletion({
            model: "text-davinci-003",
            prompt:`Bubbles is a very intelligent, helpful and friendly chatbot.\n\
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
        console.log(err);
        message.reply("Sorry, I didn't get that, can you tell me again?");
    }
});

//welcome channel
const welcomeChannelId = "1072701627477282937";

//add welcome message 
client.on("guildMemberAdd", (member) => {
    //current date
    var currentDate = new Date().toLocaleString();

    member.guild.channels.cache.get(welcomeChannelId).send({
        content: `It is currently ${currentDate}. You're on time, <@${member.id}>.`,
        files: [{
            attachment: "./pictures/cat2.png",
        }]
    })
});

//npm i canvas
//for adding images

//music interaction
client.slashcommands = new Collection();
const mucommandsPath = path.join(__dirname, "mucommands");
const mucommandFiles = fs.readdirSync(mucommandsPath).filter(file => file.endsWith(".js"));

for (const mufile of mucommandFiles){
    const mufilePath = path.join(mucommandsPath, mufile);
    const mucmd = require(mufilePath);
    client.slashcommands.set(mucmd.data.name, mucmd);
};

//npm install ffmpeg-static
//npm install @discordjs/opus
//npm install ytdl-core

client.player = new Player(client, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25
    }
});

//commands interaction
client.once(Events.ClientReady, () => {
    console.log("Ready to accept commands!")
});

//commands interaction
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    //console.log(interaction.commandName);
    //check if it is music command
    const mu = ["play", "pause", "resume","skip"];
    if (mu.includes(interaction.commandName)){
        const slashcmd = client.slashcommands.get(interaction.commandName);
        console.log(slashcmd);

        if (!slashcmd) return;

        await interaction.deferReply()
        await slashcmd.run({ client, interaction })
        return;
    };

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
console.log("Bubbles is Online on Discord")

//node .\index.js

//"start": "node bot.js" 
