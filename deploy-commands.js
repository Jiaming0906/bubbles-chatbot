const { REST, Routes } = require('discord.js');
const fs = require('node:fs');

require('dotenv').config();//npm i dotenv

//extract commands
const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const mucommandFiles = fs.readdirSync("./mucommands").filter(file => file.endsWith(".js"));

//extract commands from commands folder
for (const file of commandFiles){
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
};

//extract commands from mucommands folder
for (const mufile of mucommandFiles) {
    const mucmd = require(`./mucommands/${mufile}`);
    commands.push(mucmd.data.toJSON());
}

//REST
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

//deploy commands
(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        //put method to fully refresh all commands
        const data = await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands },
        );

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (err){
        console.log(err);
    }
})();

//for global commands
//Routes.applicationCommands(process.env.CLIENT_ID),

//for guild commands
//Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),

//delete guild commands
// rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: [] })
// 	.then(() => console.log('Successfully deleted all guild commands.'))
// 	.catch(console.error);

//delete all commands
// rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: [] })
// 	.then(() => console.log('Successfully deleted all application commands.'))
// 	.catch(console.error);
