const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder().setName("quit").setDescription("Stops all music and clears the queue"),
    run: async ({ client, interaction }) => {
        const queue = client.player.getQueue(interaction.guildId);

        if (!queue){
            return await interaction.editReply("The queue is empty")
        }

        queue.destroy()
    
    await interaction.editReply("Imma off")
    },
};
