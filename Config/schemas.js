const Discord = require("discord.js");
const Buttons = require("discord-buttons");
const Fetch = require("node-fetch");
const FS = require("fs");

module.exports = class Schemas {
  constructor(client) {
    this.client = client;
  }
  
  async restart() {
    try {
      const client = this.client;
      await client.destroy();
      await client.clearMod.all();
      client.functions.log("\n----------\n");

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
            client.commands.delete(name);
            client.commands.set(name, cmd);
            cmds[category].push(name);
          });

          client.category.set(category, cmds[category]);
        })
      } 

      FS.readdir("/home/runner/Logic-Link/Events/", (error, files) => {
        if (error) return console.error(error);
        files.forEach((file) => {
          const event = require(`/home/runner/Logic-Link/Events/${file}`);
          const bound = event.bind(null, client);
          const name = file.split(".")[0];

          client.removeAllListeners(name);
          client.on(name, bound);
        });
      });

      const commands = require("/home/runner/Logic-Link/Config/commands.js");
      const config = require("/home/runner/Logic-Link/Config/config.js");
      const database = require("/home/runner/Logic-Link/Config/database.js");
      const util = require("/home/runner/Logic-Link/Config/util.js");

      client.command = commands;
      client.config = config;
      client.db = database;
      client.util = util;

      await client.login(client.config.token);
      client.functions.log(`\n[${client.user.tag}]\nTotal Channels: ${client.channels.cache.size}\nTotal Servers: ${client.guilds.cache.size}\nTotal Users: ${client.users.cache.size}`);
      
      return true;
    } catch (error) {
      return error
    }
  }
}