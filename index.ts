import Discord from "discord.js";
import Enmap from "enmap";
import Lod from "lodash";
import FS from "fs";

import Client from "./Structures/Client"
import buttons from "./Modules/Components";
import commands from "./Structures/Commands";
import config from "./Structures/Config";
import embeds from "./Modules/Embeds";
import functions from "./Modules/Functions";
import prompts from "./Modules/Prompts";
import database from "./Structures/Database";
import logger from "./Modules/Logger";
import util from "./Structures/Util";
import schemas from "./Modules/Schemas";
import discord from "./Modules/Discord";
import clear from "clear-module";
import server from "./server";
import os from "os";

for (const [key, opt] of Object.entries(discord)) {
  Discord[key] = opt;
}

const client: any = new Client({
  intents: [] /*util.intents*/,
  restGlobalRateLimit: 50,
  presence: {
    status: "online",
    afk: false,
    activities: [{
      name: `>help`,
      type: "LISTENING"
    }]
  }
});

console.time("Login");
client.command = commands;
client.config = config;
client.db = database;
client.util = util;
client.clearMod = clear;
client.os = os;
client._ = Lod;

client.buttons = new buttons(client);
client.embeds = new embeds(client);
client.functions = new functions(client);
client.logger = new logger(client);
client.prompts = new prompts(client);
client.schemas = new schemas(client);
client.server = server();

client.commands = new Discord.Collection();
client.category = new Discord.Collection();
client.cooldown = new Enmap();

client.ready = false;
client.readySince = null;
client.readySinceMS = null;

const cmds = {
  Administrator: [],
  Developer: [],
  General: [],
  Moderator: [],
  Support: [],
  Ticket: { Basic: [], Support: [], Administrator: [] }
};

for (const category of client.command.categories) {
  if (category == "Ticket") {
    for (const category of client.command.ticketCategories) {
      FS.readdir(`./Commands/Ticket/${category}/`, (error, files) => {
        if (error) return console.error(error);
        files.forEach((file) => {
          if (!file.endsWith(".js")) return;
          let cmd = require(`./Commands/Ticket/${category}/${file}`);
          let name = file.split(".")[0];
          
          client.functions.log(`CMD: ${name}`, "bold");
          client.commands.set(name, cmd);
          cmds["Ticket"][category].push(name);
        });
        client.category.set("Ticket", cmds["Ticket"]);
      })
    }
    continue;
  }

  FS.readdir(`./Commands/${category}/`, (error, files) => {
    if (error) return console.error(error);
    files.forEach((file) => {
      if (!file.endsWith(".js")) return;
      let cmd = require(`./Commands/${category}/${file}`);
      let name = file.split(".")[0];
      
      client.functions.log(`CMD: ${name}`, "bold");
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
  if (client.ready) client.functions.sendError(error);
  else console.log(error);
});

process.on("unhandledException", async (error) => {
  if (client.ready) client.functions.sendError(error);
  else console.log(error);
});

client.login(config.token);
export default client;