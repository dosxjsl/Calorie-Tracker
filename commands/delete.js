const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")
const db = require("../sql.js");
var { totalCalories, foodList } = require("../globals.js");

async function deleteExecute(interaction) {
    const enteredFood = interaction.options.getString("food");
    var tempDate = new Date().toLocaleString().split(",");
    db.deleteFoodTable({ food: enteredFood, date: tempDate[0] });
    console.log(foodList);
    console.log(enteredFood);
    var indexOfObject;
    var deletedTF = false;

    for (let i = 0; i < foodList.length; i++) {
        if (foodList[i].food === enteredFood) {
            indexOfObject = i;
            deletedTF = true;
            totalCalories -= foodList[i].calories;
            break;
        }
    }

    console.log("index: ", indexOfObject);
    foodList.splice(indexOfObject, 1);

    console.log(foodList);
    if (deletedTF) {
        await interaction.reply(`\`${enteredFood}\` has been removed.`);
    } else {
        await interaction.reply(
            `**ERROR**: No entry found. \`${enteredFood}\` was not removed.`
        );
    }
}

module.exports = {
    deleteExecute,
    data: new SlashCommandBuilder().setName('notify').setDescription('Specify user to ping')
        .addUserOption((option) =>
            option.setName('user').setDescription('user to be notified')
                .setRequired(true)
        )
}