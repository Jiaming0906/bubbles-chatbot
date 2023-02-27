const { SlashCommandBuilder, Embed } = require("discord.js");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder().setName("info").setDescription("Gives info about the current playing song"),
    run: async ({ client, interaction }) => {
        const queue = client.player.getQueue(interaction.guildId);

        if (!queue){
            return await interaction.editReply("There are no songs in the queue");
        };

        let bar = queue.createProgressBar({
            queue: true,
            length: 19,
            timecodes: true,
        })
    
    const song = queue.nowPlaying();

    await interaction.editReply({
        embeds: [new EmbedBuilder().setThumbnail(song.thumbnail).setColor("ff9669").setDescription(`I am playing [${song.title}](${song.url})\n\n` + bar)],
    })
    },
};