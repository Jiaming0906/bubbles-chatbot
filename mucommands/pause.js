const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder().setName("pause").setDescription("Pauses the music"),
    run: async ({ client, interaction }) => {
        const queue = client.player.getQueue(interaction.guildId)

        if (!queue){
            return await interaction.editReply("there are no songs in the queue");
        }
        queue.setPaused(true);
    await interaction.editReply("I have paused the music. Use `/resume` to resume the music");
    },
};