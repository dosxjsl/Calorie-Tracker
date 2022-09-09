const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

var {
    morningHour,
    morningMinutes,

    afternoonHour,
    afternoonMinutes,

    nightHour,
    nightMinutes,
} = require("../globals");

const {
    addZero,
    convert24to12Hour,
    ifAMorPM,

} = require("../utilities.js");

async function mealTime(interaction) {
    console.log(morningHour);

    var mealTimes = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle("Meal Time")
        .setDescription("Current Times of Meals")
        .setThumbnail(
            "https://cdn.discordapp.com/attachments/1014283703876333568/1015015594229243935/111.png"
        )
        .setFields({
            name: "__Breakfast__",
            value: `${convert24to12Hour(morningHour)}:${addZero(morningMinutes)} ${ifAMorPM(morningHour, morningMinutes, 0)}`,
            inline: true,
        })
        .addFields({
            name: "__Lunch__",
            value: `${convert24to12Hour(afternoonHour)}:${addZero(afternoonMinutes)} ${ifAMorPM(afternoonHour, afternoonMinutes, 0)}`,
            inline: false,
        })
        .addFields({
            name: "__Dinner__",
            value: `${convert24to12Hour(nightHour)}:${addZero(nightMinutes)} ${ifAMorPM(nightHour, nightMinutes, 0)}`,
            inline: false,
        })
        .setTimestamp()
        .setFooter({
            text: "Presented by Alex Hoang",
            iconURL:
                "https://lindyhealth.b-cdn.net/wp-content/uploads/2022/05/zyzz-pose-how-to-iconic.png",
        });

    await interaction.reply({ embeds: [mealTimes] });
}

module.exports = {
    mealTime,
    data: new SlashCommandBuilder()
        .setName('meal_times')
        .setDescription('Get current meal times'),
}