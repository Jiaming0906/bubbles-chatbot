//return rock paper or scissors

const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rockpaperscissors')
        .setDescription('As the name describes'),
    async execute(interaction) {
        const n = Math.random();

        if (n < 1/3){
            return interaction.reply("Rock");
        } else if (n < 2/3){
            return interaction.reply("Paper");
        } else {
            return interaction.reply("Scissors");
        }
    }
};