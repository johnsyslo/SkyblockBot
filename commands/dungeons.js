const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const { get } = require("axios").default
const utils = require("../library/utils")
var accountsList = JSON.parse(fs.readFileSync("./data/registry.json"));
var data = JSON.parse(fs.readFileSync("./data/data.json"));

module.exports = {
	data: new SlashCommandBuilder()
    .setName('dungeons')
    .setDescription('Get dungeon stats for a player.')
    .addStringOption(option =>
        option.setName('player')
            .setDescription('The targetted player\'s IGN.')
            .setRequired(false))
    .addStringOption(option =>
        option.setName('profile')
            .setDescription('The targetted player\'s profile.')
            .setRequired(false)),
    async execute(interaction) {
        let profileLook = ''
        if (interaction.options.getString('player')) {
            username = interaction.options.getString('player')
            if (interaction.options.getString('profile')) {
                profileLook = utils.capitalizeFirstLetter(interaction.options.getString('profile').toLowerCase())
            }
        } else {
            uuidDiscord = interaction.user.id;
            if(accountsList[uuidDiscord]) {
                username = accountsList[uuidDiscord].uuidmc
                if (interaction.options.getString('profile')) {
                    profileLook = interaction.options.getString('profile')
                } else {
                    profileLook = accountsList[uuidDiscord].profile_name
                }
            } else {
                username = '';
            }
        }
        if (username) {
            uuidGET = await (await get(`https://api.minetools.eu/uuid/${username}`)).data
			let uuid = uuidGET.id
			if (!uuid) {
			    interaction.reply({ embeds: [utils.Error("This IGN could not be found.")]})
			} else {
				profileList = await (await get(`https://api.hypixel.net/skyblock/profiles?key=${process.env.APIKEY}&uuid=${uuid}`)).data
				if (profileList.success == false) {
                    interaction.reply({ embeds: [utils.Error(`Error with Hypixel API!. \nReason: ${profileList.cause}`)]})
                } else {
                    let catacombsEXP = data.dungeonLvlXP
                    let playerXP = 1301
                    let cumEXP = 0
                    let loop = 'No'
                    for (index = 0; loop !== 'Exit'; index++) {
                        cumEXP = cumEXP + catacombsEXP[`${index}`]
                        if (cumEXP >= playerXP) {
                            loop = 'Exit'
                            interaction.reply({ content: cumEXP + ' ' + (index + 1)})
                            console.log(index)
                            console.log(catacombsEXP[`${index}`])
                        } else {
                            console.log(index)
                            console.log(catacombsEXP[`${index}`])
                        }
                    }
                    // let profileReturnData = utils.getProfile(profileList, uuid, profileLook)
                }
            }
        } else {
            interaction.reply({ embeds: [utils.Error('You must enter an IGN or register.')]})
        }
    } // Async
} // Module.Export