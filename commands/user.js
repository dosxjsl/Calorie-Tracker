const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")

async function user(interaction) {
    await interaction.reply(
        `Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`
    );
}

module.exports = {
    user,
    data: new SlashCommandBuilder()
        .setName('user')
        .setDescription('Get user info'),
}