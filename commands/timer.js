const { SlashCommandBuilder } = require('@discordjs/builders');
const { get } = require("axios").default
const utils = require("../library/utils")
const { MessageEmbed } = require("discord.js")  

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timers')
        .setDescription('Get an estimated time of coming Skyblock events.'),
    async execute(interaction) {
    }
}