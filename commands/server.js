const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")

async function server(interaction) {
    await interaction.reply(
        `Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`
    );
}

module.exports = {
    server,
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription('Get server info'),
}