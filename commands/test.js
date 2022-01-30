const { SlashCommandBuilder } = require('@discordjs/builders');
const { get } = require("axios").default
const utils = require("../library/utils")
const { MessageEmbed } = require("discord.js") 
const pako = require('pako');
var nbt = require('nbt');
const util = require('util')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('Dev Testing.')
        .addStringOption(option =>
            option.setName('input')
                .setDescription('input')
                .setRequired(false)),
    async execute(interaction) {
        let base64string = interaction.options.getString('input')
        const base64Decoded = Buffer.from(base64string, 'base64');
        // Decode via Base64.
        gzipDecompressed = pako.ungzip(base64Decoded, {to: 'Uint8Array'});
        // Decompress the file, into an array of 8-bit unsigned integers.
        nbtParsed = nbt.parse(gzipDecompressed, function(err, data) {
            console.log(util.inspect(data.value.i.value.value, {showHidden: false, depth: null, colors: true}));
        });
    }
}
