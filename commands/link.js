const { SlashCommandBuilder } = require('@discordjs/builders');
const { get } = require("axios").default
const utils = require("../library/utils")
const fs = require('fs');
var accountsList = require("../data/registry.json")

module.exports = {
	data: new SlashCommandBuilder()
    .setName('link')
    .setDescription('Link your Discord to your Minecraft account.')
    .addStringOption(option =>
        option.setName('player')
            .setDescription('The targetted player\'s IGN.')
            .setRequired(false))
    .addStringOption(option =>
        option.setName('profile')
            .setDescription('The targetted player\'s profile.')
            .setRequired(false)),
    async execute(interaction) {
        if (interaction.options.getString('player')) {
            uuidMC = await (await get(`https://api.minetools.eu/uuid/${interaction.options.getString('player')}`)).data
            if (uuidMC.id) {
                uuidDiscord = interaction.user.id;
                if (typeof accountsList[uuidDiscord] == 'undefined') {
                    let profileInteractionURL = interaction.options.getString('profile')
                    if (profileInteractionURL) {
                        profileList = await (await get(`https://api.hypixel.net/skyblock/profiles?key=${process.env.APIKEY}&uuid=${uuidMC.id}`)).data.profiles
                        profileMap = profileList.map(name => name.cute_name)
                        let capitalizeName = utils.capitalizeFirstLetter(profileInteractionURL)
                        if (profileMap.indexOf(capitalizeName) !== -1) {
                            profileName = capitalizeName;
                        } else {
                            interaction.reply({ embeds: [utils.Error('No profile with that name.')]})
                            setTimeout(() => {  process.exit() }, 100);
                        }
                    } else {
                        profileName = '';
                    }
                    accountsList[`${uuidDiscord}`] = {"uuidmc":`${uuidMC.id}`, "profile_name": `${profileName}`};
                    const json = JSON.stringify(accountsList);  
                    fs.writeFile("./data/registry.json", json, (err) => {
                        if (err) {console.log(err);}
                    })
                    interaction.reply({ embeds: [utils.Success(`Successfully linked <@!${uuidDiscord}> to ${uuidMC.name}`)]})
                } else {
                    uuidMC = await (await get(`https://api.minetools.eu/uuid/${accountsList[uuidDiscord].uuidmc}`)).data
                    interaction.reply({ embeds: [utils.Warning(`You are already linked to ${uuidMC.name}`)]})
                }
            } else {
                interaction.reply({ embeds: [utils.Error("This IGN could not be found.")]})
            }
        } else {interaction.reply({ embeds: [utils.Error('You need to input a IGN')]})}
    } // Async
} // Module.Export