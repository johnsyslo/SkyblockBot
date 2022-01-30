const { MessageEmbed } = require("discord.js")
const colors = require("./colors.js")

module.exports = {
    getProfile: (profileList, uuid, profileLook) => {
        let profileData = profileList.profiles
				let profile_names = profileData.map(name => name.cute_name)
				let profile_ids = profileData.map(ids => ids.profile_id)
				let last_saves = profileData.map(last => last.members[uuid].last_save)
                if (profileLook) {
                    var profileIndex = profile_names.indexOf(profileLook)
                    if (profileIndex == -1) {return 'Error'} 
                } else {
                    var profileIndex = last_saves.indexOf(Math.max(...last_saves));
                }
                let profile_name = profile_names[profileIndex];
                let profile_id = profile_ids[profileIndex];
                return [profile_name, profile_id, profileIndex]
    },
    Error: (d) => {
        return new MessageEmbed()
            .setTitle("Error")
            .setDescription(d)
            .setColor(colors.red)
    },
    Warning: (d) => {
        return new MessageEmbed()
            .setTitle("Warning")
            .setDescription(d)
            .setColor(colors.yellow2)
    },
    Success: (d) => {
        return new MessageEmbed()
            .setTitle("Success")
            .setDescription(d)
            .setColor(colors.lime)
    },

    Ping: (pings) => {
        return new MessageEmbed()
            .setTitle("Pong :ping_pong: ")
            .setColor(colors.lime)
            .addFields(
                { name: 'Bot Latency', value: pings[0]},
                { name: 'API Latency', value: pings[1]},
            )
            .setTimestamp();
    },

    whatLvl: (lvl, type) => {

    },

    abbreviateNumber: (value) => {
        let newValue = value;
        const suffixes = ["", "K", "M", "B","T"];
        let suffixNum = 0;
        while (newValue >= 1000) {
          newValue /= 1000;
          suffixNum++;
        }
        newValue = Number(newValue).toFixed(1);
        newValue += suffixes[suffixNum];
        
        return [newValue];
      },

    capitalizeFirstLetter: (string) => {
            string = string.toLowerCase().split('_').join(' ')
            return string.replace(/\w\S*/g, function(txt){
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
        }
}