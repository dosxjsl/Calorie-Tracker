const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription('Get server info'),
    async execute(interaction) {
        await interaction.reply(
            `Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`
        );
    }
}