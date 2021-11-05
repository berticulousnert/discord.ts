import DiscordJS, { Intents } from 'discord.js'
imports dotenv from 'dotenv'
dotenv.config()

const client = new DiscordJS.client({
  Intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES
  ]
})


client.on('messsageCreate', (message) => {
  if(message.content === 'ping') {
    message.reply({
      content: 'pong',
    })
  }
}}


client.on('ready, () => {
   console.log('I am online')
})

client.login(process.env.TOKEN)
