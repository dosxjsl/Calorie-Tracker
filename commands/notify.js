const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")

async function notify(interaction, userID) {
    const user = interaction.options.getUser("user");

    userID = user.id;
    await interaction.reply(
        `<@${userID}> will now be notified for daily meal tracking!`
    );
}

module.exports = {
    notify,
    data: new SlashCommandBuilder().setName('notify').setDescription('Specify user to ping')
        .addUserOption((option) =>
            option.setName('user').setDescription('user to be notified')
                .setRequired(true)
        )
}