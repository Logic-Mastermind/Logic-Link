const Discord = require('discord.js');
const Enmap = require("enmap");
const _ = require("lodash");
const FS = require("fs");

const buttons = require("./Config/buttons.js");
const commands = require("./Config/commands.js");
const config = require("./Config/config.js");
const embeds = require("./Config/embeds.js");
const functions = require("./Config/functions.js");
const prompts = require("./Config/prompts.js");
const database = require("./Config/database.js");
const logger = require("./Config/logger.js");
const util = require("./Config/util.js");
const schemas = require("./Config/schemas.js");
const clear = require("clear-module");
const os = require("os");

const client = new Discord.Client({
  fetchAllMembers: false, 
  presence: {
    status: "online",
    activity: {
      name: `>help`,
      type: "LISTENING"
    }
  },
  ws: {
    intents: new Discord.Intents(32767).toArray()
  },
});

client.command = commands;
client.config = config;
client.db = database;
client.util = util;
client.clearMod = clear;
client.os = os;
client._ = _;

client.buttons = new buttons(client);
client.embeds = new embeds(client);
client.functions = new functions(client);
client.logger = new logger(client);
client.prompts = new prompts(client);
client.schemas = new schemas(client);

client.commands = new Enmap();
client.category = new Enmap();

client.ready = false;
client.readySince = null;
client.readySinceMS = null;
client.server = require('./server')();

require("discord-buttons")(client);
require("discord-reply");

const cmds = {
  Administrator: [],
  Developer: [],
  General: [],
  Moderator: [],
  Support: [],
  Ticket: []
};

for (const category of client.command.categories) {
  FS.readdir(`./Commands/${category}/`, (error, files) => {
    if (error) return console.error(error);
    files.forEach((file) => {
      if (!file.endsWith(".js")) return;
      let cmd = require(`./Commands/${category}/${file}`);
      let name = file.split(".")[0];
      
      client.functions.log(`Loading ${name}.`);
      client.commands.set(name, cmd);
      cmds[category].push(name);
    });

    client.category.set(category, cmds[category]);
  })
}

FS.readdir("./Events/", (error, files) => {
  if (error) return console.error(error);
  files.forEach((file) => {
    const event = require(`./Events/${file}`);
    const bound = event.bind(null, client);
    const name = file.split(".")[0];
    client.on(name, bound);
  });
});

process.on("unhandledRejection", async (error) => {
  if (client.ready) {
    client.functions.sendError(error);
  } else {
    console.log(error)
  }
})

process.on("unhandledException", async (error) => {
  if (client.ready) {
    client.functions.sendError(error);
  } else {
    console.log(error)
  }
})

client.login(config.token);