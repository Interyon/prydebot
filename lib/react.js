import {db} from './db.js'
import {BOT_USERNAME, CHANNEL_NAME, BLOCKED_WORDS, MOD_ACCOUNTS} from '../src/constants';
import * as econ from './cmds/economy.js';
import * as misc from './cmds/misc.js';
var colors = require('colors');

var version = "1.0.1";
var warning_timers = [1, 5, 60];
var permitted = "";
var perm_time;

export function add_user(user){
  if(user){
    db.run("INSERT OR IGNORE INTO users (UserID, UserName) VALUES (?, ?)",
    user['user-id'], user.username);
  }
}

export async function perform(channel, user, cmd, args, client){
  //update coin count for user and check message count
  update_records(user);
  check_activity(channel, user, client);

  if(user.mod == true && cmd === '!permit'){
    permitted = args[0];
    perm_time = Date.now() + 60000;
  }

  if (!automod(user, cmd, args, channel, client, permitted, perm_time)){
    /*
    if (cmd === '!hello'){
      client.say(channel, `/me ${user.username}, heya!`);
      console.log(`* Executed ${cmd} command`.green);
    }
  */
    if (cmd === '!about'){
      client.say(channel, `/me version: ${version}; Developed by interyon. https://linktr.ee/interyon`);
      console.log(`* Executed ${cmd} command`.green);
    }

    if (cmd === '!commands' ||
    cmd === "!comms"){
      client.say(channel,
        `${user.username}, a list of commands can be found here! https://pastebin.com/m43RYcir`
      );
      console.log(`* Executed ${cmd} command`.green);
    }

    if(channel == '#ggpryde'){
      if (cmd === '!prydecoin' || 
      cmd === '!points' ||
      cmd === '!coins'){
        econ.return_coins(channel, user, cmd, args, client);
      }

      if (cmd === "!gamble" || 
      cmd === '!bid' ||
      cmd === '!bet'){
        econ.gamble(channel, user, cmd, args, client);
      }

      if (cmd === "!addpoints" ||
      cmd === "!add"){
        econ.addpoints(channel, user, cmd, args, client);
      }

      if (cmd === "!setpoints" || 
      cmd === "!set"){
        econ.setpoints(channel, user, cmd, args, client);
      }

      if (cmd === "!givepoints" ||
      cmd === "!give"){
        econ.givepoints(channel, user, cmd, args, client);
      }
    }

    /*
    if (cmd === '!katt'){
      misc.katt(channel, cmd, client);
    }
  
    if (cmd === '!leia'){
      misc.leia(channel, cmd, client);
    }
  
    if (cmd === '!nyla'){
      misc.nyla(channel, cmd, client);
    }
  
    if (cmd === '!ley'){
      misc.ley(channel, cmd, client);
    }
  
    if (cmd === '!malachi'){
      misc.malachi(channel, cmd, client);
    }
  
    if (cmd === '!randa'){
      misc.randa(channel, cmd, client);
    }
  
    if (cmd === '!luna'){
      misc.luna(channel, user, cmd, args, client);
    }
  */

    if (cmd === '!myd'){
      misc.myd(channel, user, cmd, args, client);
    }
  
    if (cmd === '!warn'){
      warn(channel, user, cmd, args, client);
    }
  
    if (cmd === '!rmwarn'){
      rmwarn(channel, user, cmd, args, client);
    }
  
    

    
    /*
    if (cmd === "!interyon"){
      misc.interyon(channel, cmd, client);
    }

    if (cmd === "!ash" ||
        cmd === "!ashley"){
          misc.ashley(channel, cmd, client);
    }


    if (cmd === "!exotix"){
      misc.exotix(channel, cmd, client);
    }
*/
    if (cmd === "!hit" || cmd === "!bonk"){
      misc.hit(channel, user, cmd, args, client);
    }

    if(cmd === "!hug"){
      misc.hug(channel, user, cmd, args, client);
    }
  }
}

function automod(user, cmd, args, channel, client, permitted, time){
  let shouldSendMessage = false;
  if (user.username === BOT_USERNAME || CHANNEL_NAME.includes(user.username) || user.mod == true || MOD_ACCOUNTS.includes(user.username)){
    return shouldSendMessage;}
  
  //check message
  
  shouldSendMessage = BLOCKED_WORDS.some(blockedWord =>
    args.includes(blockedWord.toLowerCase()));
    
  //delete message
  if (shouldSendMessage || BLOCKED_WORDS.some(blockedWord => cmd.includes(blockedWord.toLowerCase()))){
    shouldSendMessage = true;
    client.deletemessage(channel, user.id)
    .then((data) => {
      //tell user message is getting deleted
      client.say(channel, `${user.username}, your message has been deleted.`);

      warn(channel, user, cmd, args, client, 1);
    }).catch((err) => {
      client.say(channel, `cannot delete message: ${err}`);
    });
  }

  var matches = cmd.match(/(([a-z]+:\/\/)?(([a-z0-9\-]+\.)+([a-z]{2}|aero|arpa|biz|com|coop|edu|gov|info|int|jobs|mil|museum|name|nato|net|org|pro|travel|local|internal))(:[0-9]{1,5})?(\/[a-z0-9_\-\.~]+)*(\/([a-z0-9_\-\.]*)(\?[a-z0-9+_\-\.%=&amp;]*)?)?(#[a-zA-Z0-9!$&'()*+.=-_~:@/?]*)?)(\s+|$)/gi);
  for(var i = 0; i < args.length; i++){
    matches += args[i].match(/(([a-z]+:\/\/)?(([a-z0-9\-]+\.)+([a-z]{2}|aero|arpa|biz|com|coop|edu|gov|info|int|jobs|mil|museum|name|nato|net|org|pro|travel|local|internal))(:[0-9]{1,5})?(\/[a-z0-9_\-\.~]+)*(\/([a-z0-9_\-\.]*)(\?[a-z0-9+_\-\.%=&amp;]*)?)?(#[a-zA-Z0-9!$&'()*+.=-_~:@/?]*)?)(\s+|$)/gi);
  }


  if(user.username == permitted && Date.now() < time){
    return shouldSendMessage;
  }

  if(matches){
    if(matches.length == 1){
      if(matches[0].includes('clips.twitch.tv')){
        return shouldSendMessage;
      }
    }
    client.deletemessage(channel, user.id)
    .then(data => {
      client.say(channel, `${user.username}, don't post links!`);
    }).catch((err) => {
      console.log(`* could not delete message from ${user.username} => ${err}`.red);
    });
    shouldSendMessage = true;
  }

  return shouldSendMessage;
}

function update_records(user){
  db.run("UPDATE users SET UserName = ?, MessagesSent = MessagesSent + 1 WHERE UserID = ?",
  user.username, user['user-id']);
  db.run("UPDATE users SET UserName = ?, Coins = Coins + ? WHERE UserID = ?",
  user.username, Math.floor(Math.random() * 4), user['user-id']);
}

function check_activity(channel, user, client){
  if(user.username != 'ggpryde'){
    db.get("SELECT MessagesSent FROM users WHERE UserID = ?", user['user-id'], (err, row) => {
      if(err || row == undefined){
        return;
      }
      var count = row.MessagesSent;
      if (count != 0 && count % 500 == 0){
        client.say(channel, `/me Thanks for being active in Pryde chats, ${user.username}- You've sent ${count} messages! Wowee`);
      }
    });
  }
}

function warn(channel, user, cmd, args, client, automod){
  if(automod == null){
    if (`#${user.username}` === channel || user.mod === true || MOD_ACCOUNTS.includes(user.username)){
      if (!args[0]){
        client.say(channel,
          `Must specify a target`
        );
      }else{
        let target = args.shift().toLowerCase();
        if (target[0] == '@'){
          target.shift();
        }
        console.log(`${target}`);
        let reason = args.join(' ');
        var warnings;
        
        new Promise(resolve => {
          db.get("SELECT Warnings FROM users WHERE UserName = ?",
            target, (err, row) => {
              if(err){
                client.say(channel,
                  `${target} has not typed in chat`
                );
                console.log(`exit on error 1: ${err.message}`.red);
                return;
              }else{
                try{
                  warnings = row.Warnings;
                  resolve(warnings);
                }
                catch(err){
                  client.say(channel,
                    `undefined user`
                  );
                  console.log(`exit on error 2: undefined user`.red);
                  return;
                }
              }
            });
        }).then((warnings) => {
          if (warnings < warning_timers.length){
            let tot = warning_timers[warnings]; //tot = time out time
            client.say(channel,
              `/timeout ${target} ${tot}m`
            );
            client.say(channel,
              `${target}, you have been muted for the following reason: ${reason}. You will be unmuted in ${tot} minute(s)`
            );
            console.log(`${target} timed out for ${tot}m in ${channel} for ${reason}\n
            ${target} now has ${warnings} warnings`.green);
  
            db.run("UPDATE users SET Warnings = Warnings + 1 WHERE UserName = ?", target);
          }else{
            client.say(channel,
              `/ban ${target} repeat infractions`
            );
            client.say(channel,
              `${target}, you have been banned for repeat infractions`
            );
            console.log(`${target} banned in ${channel}`.green);
          }
        });
      }
    }
  }else{
    let target = user.username;
    let reason = 'use of a blocked word';
    var warnings;
    
    new Promise(resolve => {
      db.get("SELECT Warnings FROM users WHERE UserName = ?",
        target, (err, row) => {
          if(err){
            client.say(channel,
              `${target} has not typed in chat`
            );
            console.log(`exit on error 1: ${err.message}`.red);
            return;
          }else{
            try{
              warnings = row.Warnings;
              resolve(warnings);
            }
            catch(err){
              client.say(channel,
                `undefined user`
              );
              console.log(`exit on error 2: undefined user`.red);
              return;
            }
          }
        });
    }).then((warnings) => {
      if (warnings < warning_timers.length){
        let tot = warning_timers[warnings]; //tot = time out time
        client.say(channel,
          `/timeout ${target} ${tot}m`
        );
        client.say(channel,
          `${target}, you have been muted for the following reason: ${reason}. You will be unmuted in ${tot} minute(s)`
        );
        console.log(`${target} timed out for ${tot}m in ${channel} for ${reason}\n
        ${target} now has ${warnings} warnings`.green);

        db.run("UPDATE users SET Warnings = Warnings + 1 WHERE UserName = ?", target);
      }else{
        client.say(channel,
          `/ban ${target} repeat infractions`
        );
        client.say(channel,
          `${target}, you have been banned for repeat infractions`
        );
        console.log(`${target} banned in ${channel}`.green);
      }
    });
  }
  
  console.log(`* Executed ${cmd} command`.green);
}

function rmwarn(channel, user, cmd, args, client){
  if (`#${user.username}` === channel || user.mod === true || MOD_ACCOUNTS.includes(user.username)){
    if (!args[0]){
      client.say(channel,
        `Must specify a target`
      );
    }else{
      let target = args.shift().toLowerCase();
      if(target[0] == '@'){
        target.shift();
      }
      var warnings;
      new Promise(resolve => {
        db.get("SELECT Warnings FROM users WHERE UserName = ?",
          target, (err, row) => {
            if(err){
              client.say(channel,
                `${target} has not typed in chat`
              );
              console.log(`exit on error 1: ${err.message}`.red);
              return;
            }else{
              warnings = row.Warnings;
              resolve(warnings);
            }
          });
      }).then((warnings) => {
        if (warnings === 0){
          client.say(channel,
            `${target} has 0 warnings`);
        }else{
          db.run("UPDATE users SET Warnings = Warnings - 1 WHERE UserName = ?", target);
          client.say(channel,
            `/untimeout ${target}`
          );
          client.say(channel,
            `Warning for ${target} revoked.`
          );
          console.log(`Removed warning for ${target}: ${warnings - 1}`.green);
        }
      });
    }
  }
  console.log(`* Executed ${cmd} command`.green);
}