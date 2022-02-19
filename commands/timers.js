const { SlashCommandBuilder } = require('@discordjs/builders');
const { get } = require("axios").default
const utils = require("../library/utils")
const { MessageEmbed } = require("discord.js")  

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timers')
        .setDescription('Get an estimated time of coming Skyblock events.'),
    async execute(interaction) {
        interaction.deferReply();
        let zooTime = await (await get(`https://hypixel-api.inventivetalent.org/api/skyblock/zoo/estimate`)).data.estimateRelative;
        let winterTime = await (await get(`https://hypixel-api.inventivetalent.org/api/skyblock/winter/estimate`)).data.estimateRelative;
        let spookyTime = await (await get(`https://hypixel-api.inventivetalent.org/api/skyblock/spookyFestival/estimate`)).data.estimateRelative;
        let darkTime = await (await get(`https://hypixel-api.inventivetalent.org/api/skyblock/darkauction/estimate`)).data.estimateRelative;
        let magmaTime = await (await get(`https://hypixel-api.inventivetalent.org/api/skyblock/bosstimer/magma/estimatedSpawn`)).data.estimateRelative;
        let bankTime = await (await get(`https://hypixel-api.inventivetalent.org/api/skyblock/bank/interest/estimate`)).data.estimateRelative;
        let newyearTime = await (await get(`https://hypixel-api.inventivetalent.org/api/skyblock/newyear/estimate`)).data.estimateRelative;

        let timersEmbed = new MessageEmbed()
            .setTitle("Timers")
            .setDescription('')
            .addFields(
                { name: `<:whale:922954476770431037> Traveling Zoo`, value: `${zooTime}`, inline: true},
                { name: `<:snowball:923257134098038794> Season of Jerry`, value: `${winterTime}`, inline: true},
                { name: `<:pie:926484707636543488> Spooky Festival`, value: `${spookyTime}`, inline: true},
                { name: `<:sirius:922955987370004521> Dark Auction`, value: `${darkTime}`, inline: true},
                { name: `<:magma:923257187701256242> Magma Boss`, value: `${magmaTime}`, inline: true},
                { name: `<:emerald:923257171267956816> Bank Interest`, value: `${bankTime}`, inline: true},
                { name: `<:cake:926484678490325003> New Year`, value: `${newyearTime}`, inline: true}
            )
            .setColor('#0099ff')
        interaction.editReply({ embeds: [timersEmbed]})
        
    }
}
