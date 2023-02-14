//rolls a six sided dice 

const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roll')
        .setDescription('Rolls a six sided dice'),
    async execute(interaction) {
        const n = Math.random();

        if (n < 1/6){
            return interaction.reply("1")
        } else if (n < 2/6){
            return interaction.reply("2")
        } else if (n < 3/6){
            return interaction.reply("3")
        } else if (n < 4/6){
            return interaction.reply("4")
        } else if (n < 5/6){
            return interaction.reply("5")
        } else {
            return interaction.reply("6")
        }
    }
};
