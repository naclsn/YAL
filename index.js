require('dotenv').config()

const Discord = require('discord.js');
const client = new Discord.Client();

const YAL = require('./yal/that.js');
const that = new YAL();

const Helper = require('./yal/helper.js');
const hold = {};

const Rcrap = require('./yal/rcrap.js');

client.on('ready', () => {
    console.log('I is ready!');
});

client.on('error', error => {
    console.log(error);
});

client.on('message', message => {
    if (message.author.bot) return;

    let msg = message.content.trim();
    let id = message.author.id;
    let sendMessage = c => message.channel.send(c);

    if (Rcrap.processMsg(message)) return; // useless hardcoded random crap

    // debug
    if (msg == "yal, coucou") {
        sendMessage(JSON.stringify(hold, null, 4));
        return;
    } else if (msg == "yal, tu sais quoi") {
        sendMessage(JSON.stringify(that.refs, null, 4));
        return;
    } else if (msg == "yal, range ta chambre") {
        hold = {};
        return;
    }

    if (msg.startsWith("yal?") || msg.startsWith("yal ?")) {
        that.getHelp(sendMessage);
        return;
    }

    // command process
    if (msg.startsWith("yal")) {
        hold[id] = new Helper(message.author, msg.replace(/yal *,?/i, ""));
        that.mainSwitch(hold[id], sendMessage, message);
    } else if (hold[id] !== undefined && hold[id].keep()) {
        hold[id].followup(msg);
        that.followSwitch(hold[id], sendMessage, message);
    }

    if (hold[id] !== undefined && !hold[id].keep())
        hold[id] = undefined;
});

client.login(process.env.TOKEN).catch(err => console.log(err) + process.exit(1));
