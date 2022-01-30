const { SlashCommandBuilder } = require('@discordjs/builders');
const { get } = require("axios").default
const utils = require("../library/utils")
const fs = require('fs');
var accountsList = require("../data/registry.json")

module.exports = {
	data: new SlashCommandBuilder()
    .setName('unlink')
    .setDescription('Unlink your Discord to your Minecraft account.'),
    async execute(interaction) {
        let uuidDiscord = interaction.user.id
        if (accountsList[uuidDiscord]){
            delete accountsList[uuidDiscord]
            const json = JSON.stringify(accountsList);
            fs.writeFile("./data/registry.json", json, (err) => {
                if (err) {console.log(err);}
            })
            interaction.reply({ embeds: [utils.Success(`Successfully unlinked.`)]})
        } else {
            interaction.reply({ embeds: [utils.Error('You are not registered!')]})
        }
    }
}