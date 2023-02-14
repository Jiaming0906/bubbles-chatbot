//flips a coin and returns heads or tails

const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('flip')
        .setDescription('Flips a coin'),
    async execute(interaction) {
        const n = Math.random();

        if (n < 0.5){
            return interaction.reply("Heads")
        } else {
            return interaction.reply("Tails")
        }
    }
};
