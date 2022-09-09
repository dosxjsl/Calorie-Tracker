const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const db = require("..sql/js");
var {
    calorieGoal,
    totalCalories,
    foodList,
} = require("../globals.js");


async function inputFood(interaction) {
    const enteredFood = interaction.options.getString("food");
    const enteredCalories = interaction.options.getInteger("calories");

    totalCalories += enteredCalories;
    await interaction.reply(
        `Great Job! Keep getting your calories in! \`${enteredCalories} calories\` has been inputed`
    );

    foodList.push({ food: enteredFood, calories: enteredCalories });

    var tempDate = new Date().toLocaleString().split(",");
    db.insertFoodTable({
        date: tempDate[0],
        food: enteredFood,
        calories: enteredCalories,
    });

    if (totalCalories >= calorieGoal) {
        await interaction.followUp(
            "You have successfully reached your calorie goal for the day! Keep getting those calories in!"
        );
    }
}

module.exports = {
    inputFood,
    data: new SlashCommandBuilder()
        .setName('input_food')
        .setDescription('Input food eaten')
        .addStringOption((option) =>
            option.setName('food').setDescription('name of food')
                .setRequired(true)
        )
        .addIntegerOption((option) =>
            option.setName('calories').setDescription('amount of calories of the entered food')
                .setRequired(true)
        ),
}