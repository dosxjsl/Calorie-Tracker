const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")
var { calorieGoal } = require("../globals.js");

async function changeCalorieGoal(interaction) {
    const newGoal = interaction.options.getInteger("new_goal");
    calorieGoal = newGoal;
    await interaction.reply(`The new calorie goal is now \`${newGoal} cal.\``);
}

module.exports = {
    changeCalorieGoal,
    data: new SlashCommandBuilder()
        .setName('change_calorie_goal')
        .setDescription('Change current calorie goal')
        .addIntegerOption((option) =>
            option.setName('new_goal').setDescription('new calorie goal')
                .setRequired(true)
        ),
}