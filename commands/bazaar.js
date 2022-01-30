const { SlashCommandBuilder } = require('@discordjs/builders');
const { get } = require("axios").default
const utils = require("../library/utils")
const { MessageEmbed } = require("discord.js")  

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bazaar')
        .setDescription('View the prices of an item in Bazaar.')
        .addStringOption(option =>
            option.setName('item')
                .setDescription('Targetted items name.')
                .setRequired(true)),
    async execute(interaction) {
        if (interaction.options.getString('item')) {
            let item_id = interaction.options.getString('item').toUpperCase().split(' ').join('_');
            let bzData = await (await get(`https://api.hypixel.net/skyblock/bazaar?key=${process.env.APIKEY}`)).data.products
            if (!bzData[item_id]) {
                interaction.reply({ embds: [utils.Error('The item you tried to find doesn\'t exist.')]})
            } else {
                let instaBuyPrice = utils.abbreviateNumber(`${bzData[item_id].buy_summary[0].pricePerUnit}`)[0];
                let instaSellPrice = utils.abbreviateNumber(`${bzData[item_id].sell_summary[0].pricePerUnit}`)[0];
                let sellVolume = utils.abbreviateNumber(`${bzData[item_id].quick_status.sellVolume}`)[0];
                let buyVolume = utils.abbreviateNumber(`${bzData[item_id].quick_status.buyVolume}`)[0];
                infoEmbed = new MessageEmbed()
                            .setColor('#0099ff')
                            .setTitle(utils.capitalizeFirstLetter(`${item_id}`))
                            .setThumbnail(`https://sky.shiiyu.moe/item/${item_id}`)
                            .addFields(
                                { name: 'Insta Buy x1', value: `${instaBuyPrice}`, inline: true },
                                { name: '\u200b', value: '\u200b', inline: true},
                                { name: 'Insta Sell x1', value: `${instaSellPrice}`, inline: true },
                                { name: 'Buy Volume', value: `${buyVolume}`, inline: true},
                                { name: '\u200b', value: '\u200b', inline: true},
                                { name: 'Sell Volume', value: `${sellVolume}`, inline: true },
                            )
                            .setTimestamp();
                interaction.reply({ embeds: [infoEmbed]})
            }
        } else {
            interaction.reply({ embds: [utils.Error('Enter a valid item.')]})
        }
    }
}