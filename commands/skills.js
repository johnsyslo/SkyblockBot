const { SlashCommandBuilder } = require('@discordjs/builders');
const { get } = require("axios").default
const utils = require("../library/utils")
const { MessageEmbed } = require("discord.js")
const fs = require('fs');
var accountsList = JSON.parse(fs.readFileSync("./data/registry.json"));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skills')
        .setDescription('View the skills of a player.')
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
                profileLook = accountsList[uuidDiscord].profile_name
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
                    interaction.deferReply();
                    let profileReturnData = utils.getProfile(profileList, uuid, profileLook)
                    let soopyProfile = await (await get(`https://soopymc.my.to/api/v2/player_skyblock/${uuid}`)).data
                        let soopySkills = soopyProfile.data.profiles[profileReturnData[1]].members[uuid].skills
                        if (soopySkills.totalExp !== 0) {
                            nextCombatLvl = (Number(soopySkills.levels.combat.level) + 1).toString()
                            nextMiningLvl = (Number(soopySkills.levels.mining.level) + 1).toString()
                            nextForagingLvl = (Number(soopySkills.levels.foraging.level) + 1).toString()
                            nextFarmingLvl = (Number(soopySkills.levels.foraging.level) + 1).toString()
                            nextAlchemyLvl = (Number(soopySkills.levels.alchemy.level) + 1).toString()
                            nextEnchantingLvl = (Number(soopySkills.levels.enchanting.level) + 1).toString()
                            nextTamingLvl = (Number(soopySkills.levels.taming.level) + 1).toString()
                            nextFishingLvl = (Number(soopySkills.levels.fishing.level) + 1).toString()
                            skillsEmbed = new MessageEmbed()
                                            .setColor('#0099ff')
                                            .setTitle(`Skills | ${uuidGET.name} on ${profileReturnData[0]}`)
                                            .setDescription(`Skill Average: **${soopySkills.skillAvg.toFixed(2)}** \nTotal Exp:  **${[utils.abbreviateNumber(`${soopySkills.totalExp}`)]}**`)
                                            .addFields(
                                                { name: '<:Combat:932739311395295292> Combat', value: `Level **${soopySkills.levels.combat.level} \n` + (soopySkills.levels.combat.progress * 100).toFixed(1) + `%**` + ` to level **` + nextCombatLvl + `\n${[utils.abbreviateNumber(`${soopySkills.levels.combat.xpCurrent}`)]} / ${[utils.abbreviateNumber(`${soopySkills.levels.combat.xpForNext}`)]}**` , inline: true },
                                                { name: '<:Mining:932739311365943296> Mining', value: `Level **${soopySkills.levels.mining.level} \n` + (soopySkills.levels.mining.progress * 100).toFixed(1) + `%**` + ` to level **` + nextMiningLvl + `\n${[utils.abbreviateNumber(`${soopySkills.levels.mining.xpCurrent}`)]} / ${[utils.abbreviateNumber(`${soopySkills.levels.mining.xpForNext}`)]}**` , inline: true },
                                                { name: '<:Foraging:932739311357530233> Foraging', value: `Level **${soopySkills.levels.foraging.level} \n` + (soopySkills.levels.foraging.progress * 100).toFixed(1) + `%**` + ` to level **` + nextForagingLvl + `\n${[utils.abbreviateNumber(`${soopySkills.levels.foraging.xpCurrent}`)]} / ${[utils.abbreviateNumber(`${soopySkills.levels.foraging.xpForNext}`)]}**` , inline: true },
                                                { name: '<:Farming:932739311177187389> Farming', value: `Level **${soopySkills.levels.farming.level} \n` + (soopySkills.levels.farming.progress * 100).toFixed(1) + `%**` + ` to level **` + nextFarmingLvl + `\n${[utils.abbreviateNumber(`${soopySkills.levels.farming.xpCurrent}`)]} / ${[utils.abbreviateNumber(`${soopySkills.levels.farming.xpForNext}`)]}**` , inline: true },
                                                { name: '<:Alchemy:932739311139434496> Alchemy', value: `Level **${soopySkills.levels.alchemy.level} \n` + (soopySkills.levels.alchemy.progress * 100).toFixed(1) + `%**` + ` to level **` + nextAlchemyLvl + `\n${[utils.abbreviateNumber(`${soopySkills.levels.alchemy.xpCurrent}`)]} / ${[utils.abbreviateNumber(`${soopySkills.levels.alchemy.xpForNext}`)]}**` , inline: true },
                                                { name: '<:Enchanting:932739311227506728> Enchanting', value: `Level **${soopySkills.levels.enchanting.level} \n` + (soopySkills.levels.enchanting.progress * 100).toFixed(1) + `%**` + ` to level **` + nextEnchantingLvl + `\n${[utils.abbreviateNumber(`${soopySkills.levels.enchanting.xpCurrent}`)]} / ${[utils.abbreviateNumber(`${soopySkills.levels.enchanting.xpForNext}`)]}**` , inline: true },
                                                { name: '<:Taming:932739311445614662> Taming', value: `Level **${soopySkills.levels.taming.level} \n` + (soopySkills.levels.taming.progress * 100).toFixed(1) + `%**` + ` to level **` + nextTamingLvl + `\n${[utils.abbreviateNumber(`${soopySkills.levels.taming.xpCurrent}`)]} / ${[utils.abbreviateNumber(`${soopySkills.levels.taming.xpForNext}`)]}**` , inline: true },
                                                { name: '<:Fishing:932739311319789688> Fishing', value: `Level **${soopySkills.levels.fishing.level} \n` + (soopySkills.levels.fishing.progress * 100).toFixed(1) + `%**` + ` to level **` + nextFishingLvl + `\n${[utils.abbreviateNumber(`${soopySkills.levels.fishing.xpCurrent}`)]} / ${[utils.abbreviateNumber(`${soopySkills.levels.fishing.xpForNext}`)]}**` , inline: true },
                                            );
                            interaction.editReply({ embeds: [skillsEmbed]})
                        } else {
                            interaction.editReply({ embeds: [utils.Error('Skills API Disabled.')]})
                        }
                }
            }
        } else {
            interaction.reply({ embeds: [utils.Error('You must enter an IGN or register.')]})
        }
    }
}