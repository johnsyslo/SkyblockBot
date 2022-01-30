const { SlashCommandBuilder } = require('@discordjs/builders');
const { get } = require("axios").default
const utils = require("../library/utils")
const { MessageEmbed } = require("discord.js")  

module.exports = {
    data: new SlashCommandBuilder()
        .setName('average')
        .setDescription('View the 3 or 7 day average price of an item.')
        .addStringOption(option =>
            option.setName('item')
                .setDescription('The targetted item\'s name.')
                .setRequired(true)),
    async execute(interaction) {
    }
}