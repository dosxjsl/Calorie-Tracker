const { SlashCommandBuilder, Routes, SharedSlashCommandOptions } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { clientId, guildId, token } = require('./config.json');
const fs = require('fs');

const commands = [
	new SlashCommandBuilder().setName('count').setDescription('Get calorie count'),
	new SlashCommandBuilder().setName('server').setDescription('Get server info'),
	new SlashCommandBuilder().setName('user').setDescription('Get user info'),
	new SlashCommandBuilder().setName('list').setDescription('Get list of food eaten'),
	new SlashCommandBuilder().setName('help').setDescription('Get command menu'),
	new SlashCommandBuilder().setName('meal_times').setDescription('Get current meal times'),

	new SlashCommandBuilder().setName('notify').setDescription('Specify user to ping')
		.addUserOption((option) =>
			option.setName('user').setDescription('user to be notified')
				.setRequired(true)
		),

	new SlashCommandBuilder().setName('get_food_data').setDescription('Get food data from certain date')
		.addStringOption((option) =>
			option.setName('date').setDescription('desired date (format: 9/6/2022)')
				.setRequired(true)
		),

	new SlashCommandBuilder().setName('input_food').setDescription('Input food eaten')
		.addStringOption((option) =>
			option.setName('food').setDescription('name of food')
				.setRequired(true)
		)
		.addIntegerOption((option) =>
			option.setName('calories').setDescription('amount of calories of the entered food')
				.setRequired(true)
		),

	new SlashCommandBuilder().setName('change_calorie_goal').setDescription('Change current calorie goal')
		.addIntegerOption((option) =>
			option.setName('new_goal').setDescription('new calorie goal')
				.setRequired(true)
		),

	new SlashCommandBuilder().setName('delete').setDescription('Remove food from list')
		.addStringOption((option) =>
			option.setName('food').setDescription('food you want to delete')
				.setRequired(true)
		),

	new SlashCommandBuilder().setName('change_time').setDescription('Change meal times')
		.addSubcommand((subcommand) =>
			subcommand
				.setName('breakfast')
				.setDescription('changes breakfast time')
				.addIntegerOption((option) =>
					option.setName('hours').setDescription('hours to be set (24 hour time)')
				)
				.addIntegerOption((option) =>
					option.setName('minutes').setDescription('minutes to be set')
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('lunch')
				.setDescription('changes lunch time')
				.addIntegerOption((option) =>
					option.setName('hours').setDescription('hours to be set (24 hour time)')
				)
				.addIntegerOption((option) =>
					option.setName('minutes').setDescription('minutes to be set')
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('dinner')
				.setDescription('changes dinner time')
				.addIntegerOption((option) =>
					option.setName('hours').setDescription('hours to be set (24 hour time)')
				)
				.addIntegerOption((option) =>
					option.setName('minutes').setDescription('minutes to be set')
				)
		)
]
	.map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then((data) => console.log(`Successfully registered ${data.length} application commands.`))
	.catch(console.error);

const commandsToString = JSON.stringify(commands);
fs.writeFile('commands.json', commandsToString, (e, res) => {
	if (e) console.log('ERROR: ' + e);
});