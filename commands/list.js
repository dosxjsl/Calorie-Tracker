const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")

var { foodList } = require("../globals.js");

async function list(interaction) {
    if (foodList.length === 0) {
        await interaction.reply(`You havent eaten anything yet!`);
    } else {
        var foods = "";
        var calories = "";
        var order = 1;

        console.log(foodList);
        for (var index in foodList) {
            foods += `${order}. \`${foodList[index].food}\`\n`;
            calories += `\`${foodList[index].calories} cal\`\n`;
            order++;
        }

        var calorieList = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle("Food List")
            .setDescription("List of Food & Calories Consumed")
            .setThumbnail(
                "https://cdn.discordapp.com/attachments/1014283703876333568/1015015594229243935/111.png"
            )
            .addFields(
                { name: "Food", value: foods, inline: true },
                { name: "Calories", value: calories, inline: true }
            )
            .setTimestamp()
            .setFooter({
                text: "Presented by Alex Hoang",
                iconURL:
                    "https://lindyhealth.b-cdn.net/wp-content/uploads/2022/05/zyzz-pose-how-to-iconic.png",
            });

        await interaction.reply({ embeds: [calorieList] });
    }
}

module.exports = {
    list,
    data: new SlashCommandBuilder()
        .setName('list')
        .setDescription('Get list of food eaten'),
}