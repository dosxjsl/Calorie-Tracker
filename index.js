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

const help = require("./commands/help");
const list = require("./commands/list");
const { changeCalorieGoal } = require("./commands/change_calorie_goal");
const { inputFood } = require("./commands/input_food");
const { getFoodData } = require("./commands/get_food_data");
const { deleteExecute } = require("./commands/delete");
const { count } = require("./commands/count");
const { changeTime } = require("./commands/change_time");

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

      if (dt.getHours() == morningHour && dt.getMinutes() == morningMinutes && dt.getSeconds() == 0) {
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
  console.log("NOMBRE ", interaction.commandName);


  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  }
  catch (err) {
    if (err) console.log(err)
  }

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
    help(interaction)
  }
  else if (commandName === "list") {
    list(interaction)
  }
  else if (commandName === "change_calorie_goal") {
    changeCalorieGoal(interaction)
  }
  else if (commandName === "input_food") {
    inputFood(interaction)
  }
  else if (commandName === "get_food_data") {
    getFoodData(interaction)
  }
  else if (commandName === "delete") {
    deleteExecute(interaction)
  }
  else if (commandName === "change_time") {
    changeTime(interaction)
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

