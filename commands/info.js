const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { get } = require("axios").default
const utils = require("../library/utils")
const fs = require('fs');
var accountsList = JSON.parse(fs.readFileSync("./data/registry.json"));
const colors = require("../library/colors")



module.exports = {
	data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('Get a basic overview of a skyblock profile.')
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
					if (profileLook) {profileLook = utils.capitalizeFirstLetter(profileLook.toLowerCase())}
					let profileReturnData = utils.getProfile(profileList, uuid, profileLook)
					if (profileReturnData == 'Error') {
						interaction.reply({ embeds: [utils.Error('No profile exists with that name.')]})
					} else {
						let selectedProfile = profileList.profiles[profileReturnData[2]]
						if (selectedProfile['banking']) {
							bankValue = utils.abbreviateNumber(selectedProfile.banking.balance.toString())[0]
						} else {
							bankValue = 'N/A'
						}
							let coinValue = utils.abbreviateNumber(selectedProfile.members[uuid].coin_purse)[0]
							if (coinValue == 'NaN') {
							coinValue = 'N/A'
						}
							infoEmbed = new MessageEmbed()
									.setColor('#0099ff')
									.setTitle(`Info | ${uuidGET.name} on ${profileReturnData[0]}`)
									.setThumbnail(`https://mc-heads.net/head/${uuid}`)
									.addFields(
										{ name: '<:fairy_soul:926489556327473213> Fairy Souls', value: `${selectedProfile.members[uuid].fairy_souls_collected}/228`, inline: true },
										{ name: '<:coins:926489616486391819> Purse', value: `${coinValue}`, inline: true },
										{ name: '<:bank:926489529119035432> Bank', value: bankValue, inline: true },
									)
									.setTimestamp();
							interaction.reply({ embeds: [infoEmbed] });
						}
					}
				}
		} else {
			interaction.reply({ embeds: [utils.Error('You must enter an IGN or register.')]})
		}
	}
}