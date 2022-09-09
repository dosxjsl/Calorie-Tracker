const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
var {
    morningHour, //11 am
    morningMinutes,

    afternoonHour, //3 pm
    afternoonMinutes,

    nightHour, //8 pm
    nightMinutes,
} = require("../globals.js");

const {
    addZero,
    convert24to12Hour,
    ifAMorPM,
    isValidTime,
    checkChangeNumErrors,
} = require("../utilities.js");

async function changeTime(interaction) {
    if (interaction.options.getSubcommand() === "breakfast") {
        const enteredHour = interaction.options.getInteger("hours");
        const enteredMinutes = interaction.options.getInteger("minutes");

        if (isValidTime(enteredHour, enteredMinutes, 0)) {
            if (enteredHour != null && enteredMinutes == null) {
                morningHour = enteredHour;
                await interaction.reply(
                    `Breakfast time has changed to ${convert24to12Hour(
                        morningHour
                    )}:${addZero(morningMinutes)} ${ifAMorPM(
                        morningHour,
                        morningMinutes,
                        0
                    )}.`
                );
            } else if (enteredHour == null && enteredMinutes != null) {
                morningMinutes = enteredMinutes;
                await interaction.reply(
                    `Breakfast time has changed to ${convert24to12Hour(
                        morningHour
                    )}:${addZero(morningMinutes)} ${ifAMorPM(
                        morningHour,
                        morningMinutes,
                        0
                    )}.`
                );
            } else if (enteredHour != null && enteredMinutes != null) {
                morningHour = enteredHour;
                morningMinutes = enteredMinutes;
                await interaction.reply(
                    `Breakfast time has changed to ${convert24to12Hour(
                        morningHour
                    )}:${addZero(morningMinutes)} ${ifAMorPM(
                        morningHour,
                        morningMinutes,
                        0
                    )}.`
                );
            }
        } else {
            checkChangeNumErrors(enteredHour, enteredMinutes, interaction);
        }
    } else if (interaction.options.getSubcommand() === "lunch") {
        const enteredHour = interaction.options.getInteger("hours");
        const enteredMinutes = interaction.options.getInteger("minutes");

        if (isValidTime(enteredHour, enteredMinutes, 0)) {
            if (enteredHour != null && enteredMinutes == null) {
                afternoonHour = enteredHour;
                await interaction.reply(
                    `Lunchtime has changed to ${convert24to12Hour(
                        afternoonHour
                    )}:${addZero(afternoonMinutes)} ${ifAMorPM(
                        afternoonHour,
                        afternoonMinutes,
                        0
                    )}.`
                );
            } else if (enteredHour == null && enteredMinutes != null) {
                afternoonMinutes = enteredMinutes;
                await interaction.reply(
                    `Lunchtime time has changed to ${convert24to12Hour(
                        afternoonHour
                    )}:${addZero(afternoonMinutes)} ${ifAMorPM(
                        afternoonHour,
                        afternoonMinutes,
                        0
                    )}.`
                );
            } else if (enteredHour != null && enteredMinutes != null) {
                afternoonHour = enteredHour;
                afternoonMinutes = enteredMinutes;
                await interaction.reply(
                    `Lunchtime time has changed to ${convert24to12Hour(
                        afternoonHour
                    )}:${addZero(afternoonMinutes)} ${ifAMorPM(
                        afternoonHour,
                        afternoonMinutes,
                        0
                    )}.`
                );
            }
        } else {
            checkChangeNumErrors(enteredHour, enteredMinutes, interaction);
        }
    } else if (interaction.options.getSubcommand() === "dinner") {
        const enteredHour = interaction.options.getInteger("hours");
        const enteredMinutes = interaction.options.getInteger("minutes");

        if (isValidTime(enteredHour, enteredMinutes, 0)) {
            if (enteredHour != null && enteredMinutes == null) {
                nightHour = enteredHour;
                await interaction.reply(
                    `Dinner time has changed to ${convert24to12Hour(nightHour)}:${addZero(
                        nightMinutes
                    )} ${ifAMorPM(nightHour, nightMinutes, 0)}`
                );
            } else if (enteredHour == null && enteredMinutes != null) {
                nightMinutes = enteredMinutes;
                await interaction.reply(
                    `Dinner time has changed to ${convert24to12Hour(nightHour)}:${addZero(
                        nightMinutes
                    )} ${ifAMorPM(nightHour, nightMinutes, 0)}`
                );
            } else if (enteredHour != null && enteredMinutes != null) {
                nightHour = enteredHour;
                nightMinutes = enteredMinutes;
                await interaction.reply(
                    `Dinner time has changed to ${convert24to12Hour(nightHour)}:${addZero(
                        nightMinutes
                    )} ${ifAMorPM(nightHour, nightMinutes, 0)}.`
                );
            }
        } else {
            checkChangeNumErrors(enteredHour, enteredMinutes, interaction);
        }
    }
}

module.exports = {
    changeTime,
    data: new SlashCommandBuilder()
        .setName("change_time")
        .setDescription("Change meal times")
        .addSubcommand((subcommand) =>
            subcommand
                .setName("breakfast")
                .setDescription("changes breakfast time")
                .addIntegerOption((option) =>
                    option
                        .setName("hours")
                        .setDescription("hours to be set (24 hour time)")
                )
                .addIntegerOption((option) =>
                    option.setName("minutes").setDescription("minutes to be set")
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("lunch")
                .setDescription("changes lunch time")
                .addIntegerOption((option) =>
                    option
                        .setName("hours")
                        .setDescription("hours to be set (24 hour time)")
                )
                .addIntegerOption((option) =>
                    option.setName("minutes").setDescription("minutes to be set")
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("dinner")
                .setDescription("changes dinner time")
                .addIntegerOption((option) =>
                    option
                        .setName("hours")
                        .setDescription("hours to be set (24 hour time)")
                )
                .addIntegerOption((option) =>
                    option.setName("minutes").setDescription("minutes to be set")
                )
        ),
};
