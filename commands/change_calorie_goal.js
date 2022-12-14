const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")
const globals = require("../utilities/globals.js");
const db = require("../utilities/sql.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('change_calorie_goal')
        .setDescription('Change current calorie goal')
        .addIntegerOption((option) =>
            option.setName('new_goal').setDescription('new calorie goal')
                .setRequired(true)
        ),

    async execute(interaction) {
        const newGoal = interaction.options.getInteger("new_goal");
        globals.calorieGoal = newGoal;

        var tempDate = new Date().toLocaleString().split(",");
        db.insertTCalTable({
            date: tempDate[0],
            totalCal: globals.calorieGoal,
        });

        await interaction.reply(`The new calorie goal is now \`${globals.calorieGoal} cal\`.`);
    }
}