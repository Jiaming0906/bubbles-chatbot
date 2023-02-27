const { SlashCommandBuilder, Embed } = require("discord.js");
const { EmbedBuilder } = require("discord.js");
const { QueryType } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("loads songs from YouTube")
        .addSubcommand((subcommand) => 
            subcommand
                .setName("song")
                .setDescription("Loads a single song from a URL")
                .addStringOption((option) => option.setName("url").setDescription("The song's URL").setRequired(true))
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("playlist")
                .setDescription("Loads a playlist of songs from a URL")
                .addStringOption((option) => option.setName("url").setDescription("The playlist's url").setRequired(true))
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("search")
                .setDescription("Searches for song based on provide keywords")
                .addStringOption((option) =>
                    option.setName("searchterms").setDescription("The search keywords").setRequired(true)
                )
        ),

    run: async ({ client, interaction }) => {
        if (!interaction.member.voice.channel) return interaction.editReply("You are not in a VC, please join a VC to use this command!");

        const queue = await client.player.createQueue(interaction.guild);
        if (!queue.connection) await queue.connect(interaction.member.voice.channel);

        let embed = new EmbedBuilder();

        if (interaction.options.getSubcommand() === "song"){
            let url = interaction.options.getString("url");
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_VIDEO
            })
            if (result.tracks.length === 0){
                return interaction.editReply("Is your link correct? I couldn't find any music to play [sad face]")
            }

            const song = result.tracks[0];
            await queue.addTrack(song)
            embed
                .setDescription(`I have added [${song.title}](${song.url}) to the queue`)
                .setTitle(`${song.title}`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Duration of the song is ${song.duration}. Requested by ${song.requestedBy.username}` })
                .setColor("f7c3d7")
                //.setAuthor({ name: song.author })

        } else if (interaction.options.getSubcommand() === "playlist"){
            let url = interaction.options.getString("url");
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_PLAYLIST
            })
            if (result.tracks.length === 0){
                return interaction.editReply("Is your link correct? I couldn't find a playlist to play [sad face]");
            }

            const playlst = result.playlist;

            await queue.addTracks(result.tracks);
            //console.log(queue.tracks)

            embed 
                .setDescription(`I have added **${result.tracks.length} songs** from **[${playlst.title}](${playlst.url})** to the queue`)
                .setThumbnail(result.tracks[0].thumbnail)
                .setFooter({ text: `Requested by ${interaction.user.username}` })
                .setColor("75e8eb")

        } else if (interaction.options.getSubcommand() === "search"){
            let url = interaction.options.getString("searchterms");
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
            })
            if (result.tracks.length === 0){
                return interaction.editReply("No results");
            }
            const song = result.tracks[0];
            await queue.addTrack(song)
            embed
                .setDescription(`I have added [${song.title}](${song.url}) to the queue`)
                .setThumbnail(song.thumbnail)
                .setTitle(`${song.title}`)
                .setFooter({ text: `Duration of the song is ${song.duration}. Requested by ${song.requestedBy.username}` })
                .setColor("eac0fc")
        }
    
    if (!queue.playing) await queue.play();
    await interaction.editReply({
        embeds: [embed]
    })
    },
};
