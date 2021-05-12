import tmi from 'tmi.js';
import {BOT_USERNAME, CHANNEL_NAME, BLOCKED_WORDS} from './constants';
import {OAUTH_TOKEN} from '../../twitch_bot_files/data/token';
import * as react from '../lib/react.js';
import * as tool from './tools.js';
var colors = require('colors');

// Define configuration options
const opts = {
  options: {debug: true },
  connection: {
    reconnect: true,
    secure: true,
    timeout: 180000,
    reconnectDecay: 1.4,
    reconneectInterval: 1000
  },
  identity: {
    username: BOT_USERNAME,
    password: OAUTH_TOKEN
  },
  channels: CHANNEL_NAME
};

// Create a client with our options
const client = new tmi.client(opts);

// Connect to Twitch:
client.connect();

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);
client.on('disconnected', (reason) => {
  onDisconnectedHandler(reason)
});
client.on('reconnect', () => {
  reconnectHandler();
});


//events
client.on('hosted', (channel, username, viewers, autohost) => {
  onHostedHandler(channel, username, viewers, autohost);
});

client.on('subscription', (channel, username, method, msg, user) => {
  onSubscriptionHandler(channel, username, method, msg, user);
});

client.on('raided', (channel, username, viewers) => {
  onRaidedHandler(channel, username, viewers);
});

client.on('cheer', (channel, user, msg) => {
  onCheerHandler(channel, user, msg);
});

client.on('giftpaidupgrade', (channel, username, sender, user) => {
  onGiftPaidUpgradeHandler(channel, username, sender, user);
});

client.on('hosting', (channel, target, viewers) => {
  onHostingHandler(channel, target, viewers);
});

client.on('resub', (channel, username, months, msg, user, methods) => {
  resubHandler(channel, username, months, msg, user, methods);
});

client.on('subgift', (channel, username, streakMonths, recipient, methods, user) => {
  subGiftHandler(channel, username, streakMonths, recipient, methods, user);
});




// Called every time a message comes in
async function onMessageHandler (channel, user, msg, self) {
  // Remove whitespace from chat message
  msg = msg.toLowerCase().split(' ');
  let commandName = msg[0];
  msg.shift();
  let args = msg;

  //console.log(user);
  //console.log(channel);
  react.add_user(user);
  if (BOT_USERNAME === user.username && user.mod === false){
    await tool.sleep(2000);
  }
  react.perform(channel, user, commandName, args, client);
  
}




  // Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
  console.log(`* Connected to ${addr}:${port}`.green);
}

function onDisconnectedHandler(reason){
  console.log(`* Disconnected: ${reason}`.red);
}

function reconnectHandler(){
  console.log(`Reconnecting...`.green);
}

function onHostedHandler(channel, username, viewers, autohost){
  client.say(channel,
    `/me Thank you ${username} for the host of ${viewers}!`
  );
  console.log(`${channel} was hosted by ${username} with ${viewers} viewers`.green);
}

function onRaidedHandler(channel, username, viewers){
  client.say(channel,
    `/me interyPOP A RAID OF ${viewers}! interyPOP Thank you ${username} for the RAID!!! leiabeLove`
  );
  client.say(channel,
    `/me GO DROP A FOLLOW! https://www.twitch.tv/${username}! PogChamp`
  );
  console.log(`${channel} was raided by ${username} with ${viewers} viewers`.green);
}

function onSubscriptionHandler(channel, username, method, msg, user){
  if (user['msg-param-sub-plan'] === 'Prime'){
    client.say(channel,
      `/me interyPOP NEW PRIME SUB interyPOP ${username}, thank you for supporting the stream! leiabeLove`
    );
    console.log(`${username} has subbed to ${channel} with PRIME`.green);
  }else if (user['msg-param-sub-plan'] === '1000'){
    client.say(channel,
      `/me interyPOP NEW TIER 1 SUB! interyPOP ${username}, thank you for supporting the stream!`
    );
    console.log(`${username} has subbed to ${channel} with TIER 1`.green);
  }else if (user['msg-param-sub-plan'] === '2000'){
    client.say(channel,
      `/me interyPOP NEW TIER 2 SUB! interyPOP ${username}, thank you for supporting the stream!`
    );
    console.log(`${username} has subbed to ${channel} with TIER 2`.green);
  }else if (user['msg-param-sub-plan'] === '3000'){
    client.say(channel,
      `/me interyPOP NEW TIER 3 SUB! interyPOP ${username}, thank you for supporting the stream!`
    );
    console.log(`${username} has subbed to ${channel} with TIER 3`.green);
  }
}

function onCheerHandler(channel, user, msg){
  client.say(channel,
    `/me interyPOP OMG OMG OMG interyPOP ${user.username} with the ${user.bits} bits! leiabeLove`
  );
  console.log(`${user.username} has cheered ${user.bits} to ${channel}`.green);
}

function onGiftPaidUpgradeHandler(channel, username, sender, user){
  client.say(channel,
    `/me Thank you ${username} for continuing your gifted sub from ${user['msg-param-sender-name']}!`
  );
  console.log(`${username} has continued gifted sub to ${channel}`.green);
}

function onHostingHandler(channel, target, viewers){
  client.say(channel,
    `/me We are now hosting ${target} with ${viewers} viewers!`
  );
  console.log(`${channel} is hosting ${target} with ${viewers} viewers!`.green);
}

function resubHandler(channel, username, months, msg, user, methods){
  const cumulativeMonths = user['msg-param-cumulative-months'];

  if (user['msg-param-sub-plan'] === 'Prime'){
    client.say(channel,
      `/me interyPOP PRIME SUB interyPOP ${username}, thanks for the ${cumulativeMonths} month sub! leiabeLove`
    );
    console.log(`${username} has resubbed to ${channel} with PRIME`.green);
  }else if (user['msg-param-sub-plan'] === '1000'){
    client.say(channel,
      `/me interyPOP TIER 1 SUB interyPOP ${username}, thanks for the ${cumulativeMonths} month sub! leiabeLove`
    );
    console.log(`${username} has resubbed to ${channel} with TIER 1`.green);
  }else if (user['msg-param-sub-plan'] === '2000'){
    client.say(channel,
      `/me interyPOP TIER 2 SUB interyPOP ${username}, thanks for the ${cumulativeMonths} month sub! leiabeLove`
    );
    console.log(`${username} has resubbed to ${channel} with TIER 2`.green);
  }else if (user['msg-param-sub-plan'] === '3000'){
    client.say(channel,
      `/me interyPOP TIER 3 SUB interyPOP ${username}, thanks for the ${cumulativeMonths} month sub! leiabeLove`
    );
    console.log(`${username} has resubbed to ${channel} with TIER 3`.green);
  }
}

function subGiftHandler(channel, username, streakMonths, recipient, methods, user){
  if (user['msg-param-sub-plan'] === '1000'){
    client.say(channel,
      `/me interyPOP GIFTED TIER 1 SUB interyPOP ${username}, thank you for gifting a TIER 1 SUB to ${recipient}! leiabeLove`
    );
    console.log(`${username} has gifted sub to ${recipient} in ${channel} with TIER 1`.green);
  }else if (user['msg-param-sub-plan'] === '2000'){
    client.say(channel,
      `/me interyPOP GIFTED TIER 2 SUB interyPOP ${username}, thank you for gifting a TIER 2 SUB to ${recipient}! leiabeLove`
    );
    console.log(`${username} has gifted sub to ${recipient} in ${channel} with TIER 2`.green);
  }else if (user['msg-param-sub-plan'] === '3000'){
    client.say(channel,
      `/me interyPOP GIFTED TIER 3 SUB interyPOP ${username}, thank you for gifting a TIER 3 SUB to ${recipient}! leiabeLove`
    );
    console.log(`${username} has gifted sub to ${recipient} in ${channel} with TIER 3`.green);
  }
}