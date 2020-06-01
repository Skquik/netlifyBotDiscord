const Discord = require('discord.js')
const axios = require("axios")
const fs = require('fs')
require('dotenv').config()


const client = new Discord.Client()
client.login(process.env.DISCORD_KEY)

client.once('ready', () => {
    console.log('ready !')
})

let prefix = "!"

client.on('message', payload =>{
    if (payload.author.bot || !payload.content.startsWith(prefix)) {
        return
    }
   
    const args = payload.content.slice(prefix.length).split(/ +/);
    const command = args[0].toLowerCase();
    
    if (command === "hook") {
        let hook = args[1]
        let Hook = {
            createbBy: payload.author.username,
            url: hook
        }
        fs.writeFile("hook.json", JSON.stringify(Hook), err => {console.log(err)} )
        payload.reply('Hook ajouté')
    }

    if (command === "build") {
        payload.channel.send('build in progress')
        fs.readFile("hook.json",  "utf8",   (err, data) => {
            if (err) {
                payload.reply('aucun hook existant')
                return 
            }
           
            const hook = JSON.parse(data)
            axios.post(hook.url)
            .then(() => {
                payload.channel.send("build in progress")
            })
            .catch(err => {
                console.log(err)
                payload.channel.send('Erreur webhook')
            })
        })
    }

})