import {MOD_ACCOUNTS} from '../../src/constants';
var colors = require('colors');
var fetch = require('node-fetch');
/*
! Disabled for Pryde Bot
export function katt(channel, cmd, client){
  client.say(channel, `/me hot hot hot hot hot TehePelo`);
  console.log(`* Executed ${cmd} command`.green);
}

export function leia(channel, cmd, client){
  client.say(channel, `/me professional irl in game dodger leiabeNala`);
  console.log(`* Executed ${cmd} command`.green);
}

export function nyla(channel, cmd, client){
  client.say(channel, `/me daddy nylawuLove`);
  console.log(`* Executed ${cmd} command`.green);
}

export function ley(channel, cmd, client){
  client.say(channel, `/me ley is godlike vleyAmazed`);
  console.log(`* Executed ${cmd} command`.green);
}

export function randa(channel, cmd, client){
  client.say(channel, `/me cooler than you CoolCat`);
  console.log(`* Executed ${cmd} command`.green);
}

export function malachi(channel, cmd, client){
  client.say(channel, `/me hot eboy with a juicy ass NomNom`);
  console.log(`* Executed ${cmd} command`.green);
}
*/
export function luna(channel, user, cmd, args, client){
  if (!args[0]){
    client.say(channel,
      `/me ${user.username}, donate here to help Leia and Nathan with paying for treatment for their dog, Luna. https://bit.ly/3l5Kb91`
    );
  }else{
    client.say(channel,
      `/me ${args[0]}, donate here to help Leia and Nathan with paying for treatment for their dog, Luna. https://bit.ly/3l5Kb91`
    );
  }
  console.log(`* Executed ${cmd} command`.green);
}

export function myd(channel, user, cmd, args, client){
  let randy = Math.floor(Math.random() * 36) + 1;
  if (!args[0]){
    if(MOD_ACCOUNTS.includes(user.username) || MOD_ACCOUNTS.includes(user.username.substring(1))){
      client.say(channel, `/me ${user.username}'s D is approximately 50 cm long!  Squid1 Squid2 Squid3 Squid2 Squid4`);
    }else{
      client.say(channel, `/me ${user.username}'s D is approximately ${randy} cm long! ${randemote()}`);
    } 
  }
  console.log(`* Executed ${cmd} command`.green);
}
/*
! Disabled for Pryde Bot
export function interyon(channel, cmd, client){
  client.say(channel, "/me nyanPls BEST BOT nyanPls BEST BOT nyanPls BEST BOT nyanPls BEST BOT nyanPls BEST BOT nyanPls BEST BOT nyanPls");
  console.log(`* Executed ${cmd} command`.green);
}

export function ashley(channel, cmd, client){
  client.say(channel,
    `/me WIFEY interyPOP ashlee16Love`
    );
  console.log(`* Executed ${cmd} commands`.green);
}

export function exotix(channel, cmd, client){
  client.say(channel, "exotixlogic is most cracked minor alive");
  console.log(`* Executed ${cmd} commands`.green);
}
*/
export async function hit(channel, user, cmd, args, client){
  var target;
  if(!args[0]){
    var chn = channel.substring(1);
    let url = `https://2g.be/twitch/randomviewer.php?channel=${chn}`;
    target = await fetch(url)
      .then(response => response.text())
      .then(data => {return data});
    console.log(target);
  }else{
    target = args[0];
  }

  let key = (cmd === "!hit") ? "hit":"bonked";

  client.say(channel,
    `/me ${user.username} has ${key} ${target} with a ${randitem()}`);
  console.log(`* Executed ${cmd} commands`.green);
}

export async function hug(channel, user, cmd, args, client){
  var target;
  if(!args[0]){
    var chn = channel.substring(1);
    let url = `https://2g.be/twitch/randomviewer.php?channel=${chn}`;
    target = await fetch(url)
      .then(response => response.text())
      .then(data => {return data});
    console.log(target);
  }else{
    target = args[0];
  }


  client.say(channel,
    `/me ${user.username} has given ${target} a BIG HUG GivePLZ TakeNRG`);
  console.log(`* Executed ${cmd} command`.green);
}

// TODO: need more BTTV Emotes
export function randemote(){
  let emotes = [
    'FortOne', 'PogChamp', 'BOP',
    'TPFufun', 'Squid1 Squid2 Squid3 Squid2 Squid4',
    'PunOko', 'KonCha', 'BegWan',
    'BrainSlug', 'LUL', 'Jebaited',
    'cmonBruh', 'OhMyDog', 'CoolCat',
    'SoBayed', 'BibleThump', 'PJSalt',
    'Keepo', 'nyanPls', 'ggprydPryde',
    'TehePelo'
  ];
  return emotes[Math.floor(Math.random() * (emotes.length - 1))];
}

function randitem(){
  let items = [
    'CD', 'alarm clock', 'armoire',
    'backpack', "bag of delicious snickers. you're not you when you're hungry",
    'bag of gummy bears', 'banana', 'bar of soap',
    'bare hands', 'bed', 'bedding', 'bedspread',
    'binder', 'blanket', 'blinds',
    'book', 'bookcase', 'boom box',
    'bottle', 'box', 'boxing glove',
    'bread', 'broom', 'brush',
    'bucket', 'butter-filled sock',
    'calendar', 'candle', 'car',
    'chair', 'chancla', 'clock',
    'comfortor', 'computer', 'controller',
    'cookie', 'couch cushion', 'couch',
    'credenza', 'cup', 'desk',
    'dish towel', 'dishwasher', 'dog',
    'door stop', 'drape', 'drill',
    'dryer', 'dust pan', 'end table',
    'extension cord', 'fan', 'figurine',
    'file cabinet', 'fire extinguisher', 'flashlight',
    'flatware', 'flower', 'fork',
    'frying pan', 'furnace', 'gallon of milk',
    'garlic clove', 'glove', 'glowstick',
    'grape', 'hairbrush', 'hammer',
    'headset', 'heater', 'helmet',
    'high dosage of KETAMINE', 'hockey puck', 'houseplant',
    'iphone', 'ipod', 'iron',
    'ironing board', 'keyboard', 'knife',
    'lamp', 'light bulb', 'light switch',
    'magnet', 'marker', 'marriage proposal',
    'microwave', 'mobile home', 'monopoly thimble',
    'mop', 'mug', 'nothing but love and affection ah ha ha',
    'oven', 'painting', 'pair of glasses',
    'pair of pants', "pair of yo momma's underwear", 'pan',
    'pen', 'pencil', 'piano',
    'pickle', 'potato', 'purse',
    'raw egg', 'roll of toilet paper', 'rubber duck',
    'sandal', 'screw', 'screwdriver',
    'shelf', 'shoe', 'slipper',
    'snare drum', 'sousaphone', 'sponge',
    'spoon', 'stop sign', 'traffic light',
    'suitcase', 'table', 'teddy bear',
    'telephone', 'television', 'tissue box',
    'toaster', 'toilet', 'tomato',
    'toothbrush', 'toothpaste', 'toothpick',
    'toy', 'train', 'trashcan',
    'tree', 'trombone', 'truck',
    'trumpet', 'turkey', 'tv',
    'vacuum', 'vase', 'wagon',
    'wallet', 'walnut', 'walrus',
    'washer', 'washing machine'
  ];

  return items[Math.floor(Math.random() * (items.length - 1))];
}