const sqlite3 = require('sqlite3').verbose();
var colors = require('colors');

let pathto = __dirname;

let db = new sqlite3.Database(`${pathto}/pryde_bot.db`, (err) => {
  if (err) {
    console.error(`${err.message}`.red);
  }
  console.log('Connected to the chinook database.'.green);
});
db.run(`CREATE TABLE IF NOT EXISTS users (
  UserID text PRIMARY KEY,
  UserName text UNIQUE,
  MessagesSent integer DEFAULT 0,
  Coins integer DEFAULT 0,
  Warnings integer DEFAULT 0
);`);

export {db};