const Reply = require("discord-reply");
const Discord = require('discord.js');
const Enmap = require("enmap");
const Chalk = require("chalk");
const FS = require("fs");

const buttons = require("./Config/buttons.js");
const cmd = require("./Config/cmd.js");
const commands = require("./Config/commands.js");
const config = require("./Config/config.js");
const embeds = require("./Config/embeds.js");
const functions = require("./Config/functions.js");
const prompts = require("./Config/prompts.js");
const database = require("./Config/database.js");
const logger = require("./Config/logger.js");
const util = require("./Config/util.js");
const schemas = require("./Config/schemas.js");
const os = require("os");

const client = new Discord.Client({
  fetchAllMembers: true, 
  presence: {
    status: "online",
    activity: {
      name: `>help`,
      type: "LISTENING"
    }
  },
  ws: {
    intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_BANS", "GUILD_EMOJIS", "GUILD_INTEGRATIONS", "GUILD_WEBHOOKS", "GUILD_INVITES", "GUILD_VOICE_STATES", "GUILD_PRESENCES", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS", "GUILD_MESSAGE_TYPING", "DIRECT_MESSAGES", "DIRECT_MESSAGE_REACTIONS"]
  },
});

client.cmd = cmd;
client.command = commands;
client.config = config;
client.db = database;
client.util = util;
client.os = os;

client.buttons = new buttons(client);
client.embeds = new embeds(client);
client.functions = new functions(client);
client.logger = new logger(client);
client.prompts = new prompts(client);
client.schemas = new schemas(client);
client.commands = new Enmap();

client.ready = false;
client.readySince = null;
client.readySinceMS = null;

require("discord-buttons")(client);
require('./server')();

FS.readdir("./Events/", (error, files) => {
  if (error) return console.error(error);
  files.forEach((file) => {
    const event = require(`./Events/${file}`);
    let eventName = file.split(".")[0];
    client.on(eventName, event.bind(null, client));
  });
});

FS.readdir("./Commands/Administrator/", (error, files) => {
  if (error) return console.error(error);
  files.forEach((file) => {
    if (!file.endsWith(".js")) return;
    let props = require(`./Commands/Administrator/${file}`);
    let commandName = file.split(".")[0];
    
    client.functions.log(`Loading ${commandName}.`);
    client.commands.set(commandName, props);
  });
});

FS.readdir("./Commands/Developer/", (error, files) => {
  if (error) return console.error(error);
  files.forEach((file) => {
    if (!file.endsWith(".js")) return;
    let props = require(`./Commands/Developer/${file}`);
    let commandName = file.split(".")[0];
    
    client.functions.log(`Loading ${commandName}.`);
    client.commands.set(commandName, props);
  });
});

FS.readdir("./Commands/General/", (error, files) => {
  if (error) return console.error(error);
  files.forEach((file) => {
    if (!file.endsWith(".js")) return;
    let props = require(`./Commands/General/${file}`);
    let commandName = file.split(".")[0];

    client.functions.log(`Loading ${commandName}.`);
    client.commands.set(commandName, props);
  });
});

FS.readdir("./Commands/Moderator/", (error, files) => {
  if (error) return console.error(error);
  files.forEach((file) => {
    if (!file.endsWith(".js")) return;
    let props = require(`./Commands/Moderator/${file}`);
    let commandName = file.split(".")[0];
    
    client.functions.log(`Loading ${commandName}.`);
    client.commands.set(commandName, props);
  });
});

FS.readdir("./Commands/Support/", (error, files) => {
  if (error) return console.error(error);
  files.forEach((file) => {
    if (!file.endsWith(".js")) return;
    let props = require(`./Commands/Support/${file}`);
    let commandName = file.split(".")[0];
    
    client.functions.log(`Loading ${commandName}.`);
    client.commands.set(commandName, props);
  });
});

FS.readdir("./Commands/Ticket/", (error, files) => {
  if (error) return console.error(error);
  files.forEach((file) => {
    if (!file.endsWith(".js")) return;
    let props = require(`./Commands/Ticket/${file}`);
    let commandName = file.split(".")[0];
    
    client.functions.log(`Loading ${commandName}.`);
    client.commands.set(commandName, props);
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
