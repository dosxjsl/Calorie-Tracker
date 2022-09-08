//------------------------INITIALIZATION-------------------------------------

const { timeStamp } = require("console");
const Discord = require("discord.js");
const fs = require("fs");
const path = require("path");
const config = require("./config.json");
const { Client, GatewayIntentBits, ActivityType, Routes } = require("discord.js");
const { EmbedBuilder } = require("discord.js");
const { channel } = require("diagnostics_channel");
const db = require("./sql.js");
const sql = require("sqlite3");
const { setDefaultResultOrder } = require("dns");
const commandList = require("./commands.json");
const { REST } = require('@discordjs/rest');

var {
  calorieGoal,
  totalCalories,
  foodList,
  userID, //bot ID for now

  morningHour, //11 am
  morningMinutes,

  afternoonHour, //3 pm
  afternoonMinutes,

  nightHour, //8 pm
  nightMinutes,
} = require("./globals.js");

const {
  addZero,
  convert24to12Hour,
  ifAMorPM,
  isValidTime,
  checkChangeNumErrors,
} = require("./utilities.js");


const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

const token = config.token;
const prefix = config.prefix;
const guildId = config.guildId;
const channelId = config.channel;
const clientID = config.clientId;
client.login(token);

// var calorieGoal = 2500;
// var totalCalories = 0;
// var foodList = [];
// var userID = "1014430950282764320"; //bot ID for now

// var morningHour = 11; //11 am
// var morningMinutes = 0;

// var afternoonHour = 15; //3 pm
// var afternoonMinutes = 0;

// var nightHour = 20; //8 pm
// var nightMinutes = 0;

client.commands = new Discord.Collection();

const files = fs.readdirSync("./commands").filter((file) => file.endsWith(".js"));
const commands = [];

for (const file of files) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
  client.commands.set(command.data.name, command);
}

client.once("ready", () => {
  // Alternatively, you can set the activity to any of the following:
  // PLAYING, STREAMING, LISTENING, WATCHING
  client.user.setPresence({
    activities: [{ name: `Calories`, type: ActivityType.Watching }],
    status: "dnd",
  });

  var currentDate = new Date();
  console.log(`Ready ${currentDate.toLocaleString()}`);

  const rest = new REST({ version: '10' }).setToken(token);

  (async () => {
    try {
      if (process.env.ENV === 'production') {
        rest.put(Routes.applicationGuildCommands(clientID), { body: commands })
          .then((data) => console.log(`Successfully registered ${data.length} application commands.`))
          .catch(console.error);
      }
      else {
        await rest.put(Routes.applicationGuildCommands(clientID, guildId), { body: commands })
          .then((data) => console.log(`Successfully registered ${data.length} application commands.`))
          .catch(console.error);
      }
    }
    catch (err) {
      if (err) console.error(err);
    }
  })


  var listedChannel = client.guilds.cache
    .find((guild) => guild.id == guildId)
    .channels.cache.find((channel) => channel.id == channelId);

  const embed = new EmbedBuilder()
    .setTitle("WE'RE ALL GONNA MAKE IT. GET YOUR CALORIES IN")
    .setDescription("Input calories using the slash command `/input_food`")
    .setColor("#0099ff")
    .setImage(
      "https://lindyhealth.b-cdn.net/wp-content/uploads/2022/05/zyzz-pose-how-to-iconic.png"
    );
  listedChannel.send({ embeds: [embed] });

  listedChannel.send(
    `The current calorie goal is \`${calorieGoal} cal\`. Would you like to change it?\nUse the slash command \`/change_calorie_goal\` to modify the calorie goal to your desire.`
  );

  //------------------------REMINDER/PROMPT FUNCTIONS-------------------------------------

  setInterval(() => {
    var dt = new Date();
    if (dt.getHours() == 0 && dt.getMinutes() == 0 && dt.getSeconds() == 0) {
      //when the time turns 12:00 A.M.
      var listedChannel = client.guilds.cache
        .find((guild) => guild.id == guildId)
        .channels.cache.find((channel) => channel.id == channelId);

      const embed = new EmbedBuilder()
        .setTitle("WE'RE ALL GONNA MAKE IT. GET YOUR CALORIES IN")
        .setColor("#0099ff")
        .setImage(
          "https://lindyhealth.b-cdn.net/wp-content/uploads/2022/05/zyzz-pose-how-to-iconic.png"
        );
      listedChannel.send({ embeds: [embed] });
      totalCalories = 0;
    }

    client.channels.fetch(channelId).then((channel) => {
      //console.log(`Hours: ${dt.getHours()}\nMinutes: ${dt.getMinutes()}\nSeconds: ${dt.getSeconds()}`);

      if (
        dt.getHours() == morningHour &&
        dt.getMinutes() == morningMinutes &&
        dt.getSeconds() == 0
      ) {
        channel.send(
          `<@${userID}> Good Morning! What did you eat for breakfast today? (Use \`/input_food\` to input food and calories)`
        );
        channel.send(
          `You are \`${totalCalories}\`/\`${calorieGoal}\` calories of the way there!`
        );
      }

      if (
        dt.getHours() == afternoonHour &&
        dt.getMinutes() == afternoonMinutes &&
        dt.getSeconds() == 0
      ) {
        channel.send(
          `<@${userID}> Good Afternoon! What did you eat for lunch today? (Use \`/input_food\` to input food and calories)`
        );
        channel.send(
          `You are \`${totalCalories}\`/\`${calorieGoal}\` calories of the way there!`
        );
      }

      if (
        dt.getHours() == nightHour &&
        dt.getMinutes() == nightMinutes &&
        dt.getSeconds() == 0
      ) {
        channel.send(
          `<@${userID}> Good Evening! What did you eat for dinner today? (Use \`/input_food\` to input food and calories)`
        );
        channel.send(
          `You are \`${totalCalories}\`/\`${calorieGoal}\` calories of the way there!`
        );
      }

      if (
        dt.getHours() == 23 &&
        dt.getMinutes() == 59 &&
        dt.getSeconds() == 59
      ) {
        var flag;
        if (totalCalories < calorieGoal) {
          channel.send(
            `<@${userID}> You have failed to reach your calorie goal for the day. Try again tomorrow!`
          );
          flag = 0;
        } else {
          channel.send(
            `<@${userID}> Congrats! You successfully reached your calorie goal for the day!`
          );
          flag = 1;
        }

        var tempDate = new Date().toLocaleString().split(",");
        totalCalories = 0;
      }
    });
  }, 1000); // interval (1 second)
});

//------------------------COMMAND FUNCTIONS-------------------------------------

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  console.log("NOMBRE ", interaction.commandName);

  // try {
  //   await command.execute(interaction);
  // }
  // catch (err) {
  //   if (err) console.log(err)
  // }

  if (commandName == 'count') {
    count(interaction);
  }
  else if (commandName === "notify") {
    notify(interaction, userID)
  }
  else if (commandName === "server") {
    server(interaction)
  }
  else if (commandName === "user") {
    user(interaction)
  }
  else if (commandName === "meal_times") {
    mealTime(interaction)
  }
  else if (commandName === "help") {
    var names = "";
    var descriptions = "";
    var order = 1;

    for (let i = 0; i < commandList.length; i++) {
      names += `${order}. \`${commandList[i].name.trim()}\`\n`;
      descriptions += `\`${commandList[i].description}\`\n`;
      order++;
    }

    const menuEmbed = new EmbedBuilder() //menu of all slash commands (hopefully)
      .setColor(0x0099ff)
      .setTitle("Help Menu")
      .setDescription("List of Commands")
      .addFields(
        { name: "Name", value: names, inline: true },
        { name: "Description", value: descriptions, inline: true }
      )
      .setTimestamp()
      .setFooter({
        text: "Presented by Alex Hoang",
        iconURL:
          "https://lindyhealth.b-cdn.net/wp-content/uploads/2022/05/zyzz-pose-how-to-iconic.png",
      });

    await interaction.reply({ embeds: [menuEmbed] });
  }
  else if (commandName === "list") {
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
  } else if (commandName === "change_calorie_goal") {
    const newGoal = interaction.options.getInteger("new_goal");
    calorieGoal = newGoal;
    await interaction.reply(`The new calorie goal is now \`${newGoal} cal.\``);
  } else if (commandName === "input_food") {
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
  } else if (commandName === "get_food_data") {
    const enteredDate = interaction.options.getString("date");

    let tempList = db.getFoodFromDate(enteredDate);

    tempList.then(function (result) {
      var foods = "";
      var calories = "";
      var order = 1;

      var selectedDayCalories = 0;

      for (let i = 0; i < result.length; i++) {
        foods += `${order}. \`${result[i].food.trim()}\`\n`;
        calories += `\`${result[i].calories} cal\`\n`;
        selectedDayCalories += parseInt(result[i].calories);
        order++;
      }
      var calorieList = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle(`${enteredDate} Food List`)
        .setDescription(`List of Food & Calories Consumed on ${enteredDate}`)
        .setThumbnail(
          "https://cdn.discordapp.com/attachments/1014283703876333568/1015015594229243935/111.png"
        )
        .addFields(
          { name: "Food", value: foods == "" ? "None" : foods, inline: true },
          {
            name: "Calories",
            value: calories == "" ? "None" : calories,
            inline: true,
          }
        )
        .setTimestamp()
        .setFooter({
          text: "Presented by Alex Hoang",
          iconURL:
            "https://lindyhealth.b-cdn.net/wp-content/uploads/2022/05/zyzz-pose-how-to-iconic.png",
        });

      if (selectedDayCalories < calorieGoal) {
        calorieList.addFields({
          name: "Total Calorie Count",
          value: `\`${selectedDayCalories}\`/\`${calorieGoal}\` <:x:1015355078615502909>`,
          inline: false,
        });
      } else {
        calorieList.addFields({
          name: "Total Calorie Count",
          value: `\`${selectedDayCalories}\`/\`${calorieGoal}\` <:white_check_mark:1015126964945821757>`,
          inline: false,
        });
      }

      interaction.reply({ embeds: [calorieList] });
    });
  } else if (commandName === "delete") {
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
  } else if (commandName === "change_time") {
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
            `Dinner time has changed to ${convert24to12Hour(
              nightHour
            )}:${addZero(nightMinutes)} ${ifAMorPM(nightHour, nightMinutes, 0)}`
          );
        } else if (enteredHour == null && enteredMinutes != null) {
          nightMinutes = enteredMinutes;
          await interaction.reply(
            `Dinner time has changed to ${convert24to12Hour(
              nightHour
            )}:${addZero(nightMinutes)} ${ifAMorPM(nightHour, nightMinutes, 0)}`
          );
        } else if (enteredHour != null && enteredMinutes != null) {
          nightHour = enteredHour;
          nightMinutes = enteredMinutes;
          await interaction.reply(
            `Dinner time has changed to ${convert24to12Hour(
              nightHour
            )}:${addZero(nightMinutes)} ${ifAMorPM(
              nightHour,
              nightMinutes,
              0
            )}.`
          );
        }
      } else {
        checkChangeNumErrors(enteredHour, enteredMinutes, interaction);
      }
    }
  }
});

client.on("messageCreate", (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content
    .slice(prefix.length)
    .trim()
    .replaceAll(" ", "")
    .split("-");
  const argsWS = message.content.slice(prefix.length).trim().split("-");

  console.log(args);
});

