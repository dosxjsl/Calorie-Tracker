const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")

//import { totalCalories, calorieGoal } from './index.js';

//var { totalCalories, calorieGoal } = require('./index.js');

var {
    calorieGoal,
    totalCalories,
} = require("./globals.js");

async function count(interaction) {
    var caloriesCount = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle("Calories")
        .setDescription("Amount of Calories Consumed")
        .setThumbnail(
            "https://cdn.discordapp.com/attachments/1014283703876333568/1015015594229243935/111.png"
        )
        .setTimestamp()
        .setFooter({
            text: "Presented by Alex Hoang",
            iconURL:
                "https://lindyhealth.b-cdn.net/wp-content/uploads/2022/05/zyzz-pose-how-to-iconic.png",
        });

    if (totalCalories < calorieGoal) {
        caloriesCount.addFields({
            name: "Total Calorie Count",
            value: `\`${totalCalories}\`/\`${calorieGoal}\` <:x:1015355078615502909>`,
            inline: true,
        });
    } else {
        caloriesCount.addFields({
            name: "Total Calorie Count",
            value: `\`${totalCalories}\`/\`${calorieGoal}\` <:white_check_mark:1015126964945821757>`,
            inline: true,
        });
    }
    await interaction.reply({ embeds: [caloriesCount] });
}

module.exports = {
    count,
    data: new SlashCommandBuilder()
        .setName('count')
        .setDescription('Get calorie count'),
}