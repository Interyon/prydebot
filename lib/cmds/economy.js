import { Client } from 'tmi.js';
import {db} from '../db.js';
var curr = "Lions";
var colors = require('colors');

function get_coins(target, callback){
  db.get("SELECT Coins FROM users WHERE UserName = ?", target, function(err, row) {
    if(err || row == undefined){
      return callback(null, null);
    }else{
      console.log(`got curr`.green);
      return callback(row.Coins);
    }
  });
}

export function return_coins(channel, user, cmd, args, client){
  var coins;

  if(!args[0]){
    get_coins(user.username, function(res){
      if(res == null){
        console.log("undefined user");
        client.say(channel,`/me undefined user BibleThump`);
      }else{
        coins = res;
        client.say(channel,
          `/me ${user.username} has ${coins} ${curr}!`);
        console.log(`${user.username}: `.cyan, `${coins}`.yellow);
      }
    });
  }else{
    var target = (args[0][0] == '@') ? args[0].substring(1):args[0];
    get_coins(target, function(res){
      if(res == null){
        console.log("undefined user");
        client.say(channel, `/me undefined user BibleThump`);
      }else{
        coins = res;
        client.say(channel,
          `/me ${args[0]} has ${coins} ${curr}!`);
        console.log(`${args[0]}: `.cyan, `${coins}`.yellow);
      }
    });
  }
  console.log(`* Executed ${cmd} command`.green);
}

function update_coins(target, amount){
  db.run("UPDATE users SET Coins = Coins + ? WHERE UserName = ?", amount, target, err => {
      if(err){
        console.log(`${err}`.red);
      }
    });
}


export function gamble(channel, user, cmd, args, client){
  if(!args[0]){
    client.say(channel,
      `me ${user.username}, you must specify a bidding amount`);
  }else{
    get_coins(user.username, function(res){
      if(res == null){
        console.log("undefined user");
        client.say(channel,`/me undefined user BibleThump`);
      }else{
        let coins = res;
        const roll = 50;
        let bet = parseInt(args[0], 10);
        let randy = Math.floor(Math.random() * 101);

        if(isNaN(bet) && args[0] != "all"){
          client.say(channel,
            `/me ${user.username}, you must specify a bidding amount`);
        }else if(bet < 10 && args[0] != "all"){
          client.say(channel,
            `/me ${user.username}, you have to bid more than 10 points`);
        }else if(args[0] == "all" && coins < 10){
          client.say(channel,
            `/me ${user.username}, you don't have enough ${curr} to make a bid`);
        }else if(bet > coins && args[0] != "all"){
          client.say(channel,
            `/me ${user.username}, you are trying to bet more than you have! PunOko`);
        }else{
          if(args[0] == "all"){
            bet = coins;
          }
          if(randy >= roll){
            console.log(`${user.username}: `.cyan, `${coins} => ${coins + bet}`.yellow);
            coins = coins + bet;
            update_coins(user.username, bet);
            client.say(channel,
              `/me Winner! ${user.username} just bet ${bet} ${curr}, and now has ${coins} ${curr}!`);
          }else{
            console.log(`${user.username}: `.cyan, `${coins} => ${coins - bet}`.yellow);
            coins = coins - bet;
            update_coins(user.username, bet * -1);
            client.say(channel,
              `/me Too bad! ${user.username} bet and lost ${bet} ${curr}. They now have ${coins} ${curr}`);
          }
        }
      }
    });
  }
    
  console.log(`* Executed ${cmd} command`.green);
}

export function addpoints(channel, user, cmd, args, client){
  if(!MOD_ACCOUNTS.includes(user.username)){
    client.say(channel,
      `/me YOU HAVE NOT THE POWER TO USE THAT COMMAND!`
    );
  }else{
    if(!args[1] || !args[0]){
      client.say(channel,
        `/me you gotta specify a name and amount, dummy`
      );
    }else{
      let target = args[0];
      let amount = parseInt(args[1], 10);
      if(isNaN(amount)){
        client.say(channel,
          `/me did it wrong dumbass`);
      }else{
        get_coins(target, function(res){
          if(res == null){
            console.log(`undefined user`.red);
            client.say(channel,`/me undefined user BibleThump`);
          }else{
            let coins = res;
            let ncoins = coins + amount;
            console.log(`${target}: `.cyan, `${coins} => ${ncoins}`.yellow);
            update_coins(target, amount);
            client.say(channel,
              `/me gave ${target} ${amount} ${curr}. they now have ${ncoins}`);
          }
        });
      }
    }
  }
  console.log(`* Executed ${cmd} command`.green);
}

export async function givepoints(channel, user, cmd, args, client){
  if(!args[0]){
    client.say(channel,
      `${user.username} you must specify a target to give coins to`);
  }else if(args[0] && !args[1]){
    client.say(channel,
      `${user.username} you must specify an amount to give to ${args[0]}`);
  }else{
    var amnt = parseInt(args[1]);
    var user1 = user.username;
    var user2 = (args[0][0] == '@') ? args[0].substring(1):args[0];
    var u1coins;
    var u2coins;

    get_coins(user1, function(res){
      if(res == null){
        console.log(`undefined user`.red);
        client.say(channel,`/me undefined user BibleThump`);
      }else{
        u1coins = res;

        if(isNaN(amnt) && args[1] != 'all'){
          console.log(`amount not a number`.red);
          client.say(channel, `/me ${user.username}, amount to give must be a number`);
        }else if(u1coins < amnt){
          console.log(`not enough ${curr} to transfer`.red);
          client.say(channel, `/me ${user.username}, you don't have enough ${curr} to transfer!`);
        }else if(amnt < 0){
          console.log(`amount too low`.red);
          client.say(channel, `/me ${user.username}, must give greater than 0`);
        }else{
          if(args[1] == 'all'){
            amnt = u1coins;
          }
          get_coins(user2, function(res2){
            if(res2 == null){
              console.log(`undefined user`.red);
              client.say(channel,`/me undefined user BibleThump`);
            }else{
              u2coins = res2;
              update_coins(user1, amnt *-1);
              update_coins(user2, amnt);
              console.log(`${user1}: `.cyan, `${u1coins} => ${u1coins - amnt}`.yellow);
              console.log(`${user2}: `.cyan, `${u2coins} => ${u2coins + amnt}`.yellow);
              client.say(channel, `/me ${user1} has given ${amnt} ${curr} to ${user2}!`);
            }
          });
        }
      }
    });
  }
}