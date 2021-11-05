const Discord = require('discord.js')
const database = require('dbdjs.db')
const fs = require('fs')
const chalk = require('chalk')

const db = new database.Database({
    path: "database",
    tables: [{
        name: "main"
    }]
})
const intents = new Discord.Intents(32509)
const client = new Discord.Client({
    intents: intents/*,
    ws: {
        properties: {
            $browser: 'Discord Android'
        }
    }*/
})

let prefix = `,` //change prefix

async function reloadCommands() {
    console.log(chalk.yellow('Reloading commands!'))

    client.commands = new Discord.Collection();
    const folders = fs.readdirSync("./commands/");
    for (const files of folders) {
        console.log(chalk.green('Entering directory: ') + chalk.blue(`./commands/${files}/`))
        const folder = fs
            .readdirSync(`./commands/${files}/`)
            .filter(file => file.endsWith(".js"));

        for (const commands of folder) {
            delete require.cache[require.resolve(`./commands/${files}/${commands}`)];
            const command = require(`./commands/${files}/${commands}`);
            client.commands.set(command.name, command);

            if (command.aliases) {
            	console.log(chalk.green('Loaded command: ') + chalk.blue(`./commands/${files}/${commands}`) + ' : ' + chalk.cyan(`${command.name} , ` + command.aliases.join()))
            } else {
                console.log(chalk.green('Loaded command: ') + chalk.blue(`./commands/${files}/${commands}`) + ' : ' + chalk.cyan(`${command.name}`))
            }
        }
    }

    console.log(chalk.green('Commands reloaded!'))
}

client.db = db
client.reloadCommands = reloadCommands
module.exports = client

db.on('ready', async () => {
    console.log(chalk.green('Database Ready!'))
})
client.on('ready', async () => {
    await client.reloadCommands()
    console.log(chalk.green('Bot Ready!'))
})

client.on('messageCreate', async (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    let cmd = client.commands.get(command) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command))

    if (cmd) {
        try {
            await cmd.execute(message, args)
              .catch(function (e) {
                console.log(chalk.red('An error occured! \n') + error)
                message.reply({
                  content: "There was an error executing that command!",
                  allowedMentions: { repliedUser: true }
                })
              })
        } catch (error) {
            console.log(chalk.red('An error occured! \n') + error)
            message.reply({
                content: "There was an error executing that command!",
                allowedMentions: { repliedUser: true }
            })
        }
    } else {
        /*message.reply({
            content: "I didn't find that command!",
            allowedMentions: { repliedUser: false }
        })*/
    }
})

db.connect()
client.login(process.env.TOKEN)
