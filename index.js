const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Client, Intents, Collection, MessageEmbed } = require('discord.js');
const intents = new Intents(32767)
const client = new Client({ intents })
const utils = require("./library/utils")
require('dotenv').config()

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const commands = [];
client.commands = new Collection();
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
    client.commands.set(command.data.name, command);
}

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    try {
        await command.execute(interaction);
    } catch (error) {
        if (error) console.error(error);
        interaction.reply({ embeds: [utils.Error("There was an error running this command.")]});
    }
});

client.once('ready', () => {
    console.log('Ready!');
    const CLIENT_ID = client.user.id;
    const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);
    (async () => {
        try {
        	await rest.put(
                Routes.applicationCommands(CLIENT_ID), {
                    body: commands
            	});
                console.log('Application Commands Registered.');
        	} catch (error) {
            	if (error) console.error(error);
                interaction.reply({ embeds: [utils.Error('Error running this command.')]})
       		}
    })();
    client.user.setActivity({ type: "PLAYING", name: `Skyblock | v1.0.3` })
});

client.on('messageCreate', message => {
    if (message.content == "ping") {
      message.channel.send('‎').then((resultMessage) => {
            let ping = resultMessage.createdTimestamp - message.createdTimestamp
            let apiPing = `${client.ws.ping}`
            let pings = [ping.toString(), apiPing.toString()]
            resultMessage.edit({ embeds: [utils.Ping(pings)]})
        }
      )
    }
  });

client.login(process.env.TOKEN);