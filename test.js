//command timer with subcommand time, which sends a message tagging the user when timer is up

const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timer')
        .setDescription('Set a timer in minutes (max 10 minutes) and you will be tagged in a message when timer is up')
        .addSubcommand((subcommand) => 
            subcommand
                .setName("time")
                .setDescription("Set a time in minutes")
                .addStringOption((option) => option.setName("settimer").setRequired(true))
        ),
    async execute(interaction) {
        const t = interaction.options.getSubcommand();
        if (!Number.isInteger(t)){
            return interaction.reply(`The given input value **${t}** is not a whole number. Please input a whole number up to 10.`);
        };

        if (t > 10){
            return interaction.reply("I am only able to do timer for up to 10 minutes, sorry!");
        };

        if (t === 0){
            return interaction.reply("Did you set a 0 minutes timer? So, umm, time's up?");
        };

        if (t < 0){
            return interaction.reply("No negative numbers please!")
        }

        //t is an integer
        const time = t * 1000 * 60 - 200
        //time is in milliseconds, 1000 milliseconds = 1 second

        await interaction.reply(`Your timer for ${t} minutes have started. You'll be tagged here when timer is up.`);

        setTimeout(timeUp(), time);

        function timeUp(){
            return interaction.reply(`${t} minutes is up <@${interaction.user.id}>`);
        }

    }
};
