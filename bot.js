const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = '!'

var dotenv = require('dotenv');
dotenv.load();

client.on('ready', ()=> {
    console.log('logged in as SHFT!');
});

client.on('message', msg => {
    if (msg.author.bot) return;
    if (msg.deleted) return;
    if (msg.content[0] !== prefix) return;

    const args = msg.content.slice(1).trim().split(/ +/g);
    const command = args[0].toLowerCase();

    if (args[0] === 'tag') {
        if(args.length == 1){
            msg.channel.send(`You forgot the who. 😕`);
            return;
        }
        //if(args[1])
        var tag = msg.mentions.members;
        var tagged = tag.first(1);
        var target = '';
        if ((tagged === null) || (tagged === undefined)){
            return;
        }
        if (tagged != 0){
            target = tagged[0].user;
            //console.log(target);
        }
        if (target != ''){
            if (target == msg.author){
                msg.reply("Why would you even do this?🤔");
                return;
            }
            if (target.bot){
                msg.reply("We don't go after bots.");
                return;
            }
            msg.delete();
            var postID = null;
            const postedPromise = msg.channel.send({
                files: 
                    [{attachment: './CallOut.png'}],
                    reply: target
            }).then(result => {
                postID = result;
            });

            var promise = new Promise(function(resolve, reject) {
                const gottem = new Discord.MessageCollector(msg.channel, m => m.author === target, {time: 10000});
                //console.log(gottem);
                gottem.on('collect', clct => {
                    //console.log('collected');
                    gottem.stop('reply');
                });
                gottem.on('end', (col, reason) => {
                    //console.log('ending');
                    resolve(reason);
                });
            });
            promise.then(function(value) {
                if (value == 'reply'){
                    postID.react('⭕');
                }else{
                    postID.react('❌');
                }
            });

        } else {
            msg.channel.send("Doesn't seem like you mentioned anyone.")
        }

    }
});

client.login(process.env.BOT_TOKEN);