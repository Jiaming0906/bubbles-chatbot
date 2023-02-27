const { SlashCommandBuilder, Embed } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder().setName("shuffle").setDescription("Shuffles the queue"),
    run: async ({ client, interaction }) => {
        const queue = client.player.getQueue(interaction.guildId);

        if (!queue){
            return await interaction.editReply("There are no songs in the queue");
        };

        queue.shuffle();
    
        await interaction.editReply(`I have shuffled ${queue.tracks.length} songs`);
    },
};