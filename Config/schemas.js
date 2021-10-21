const Discord = require("discord.js");
const Fetch = require("node-fetch");
const Chalk = require("chalk");
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

      const commands = require("/home/runner/Logic-Link/Config/commands.js");
      const config = require("/home/runner/Logic-Link/Config/config.js");
      const database = require("/home/runner/Logic-Link/Config/database.js");
      const util = require("/home/runner/Logic-Link/Config/util.js");
      const discordFn = require("/home/runner/Logic-Link/Config/discordFn.js");

      for (const [key, opt] of Object.entries(discordFn)) {
        Discord[key] = opt;
      }

      client.command = commands;
      client.config = config;
      client.db = database;
      client.util = util;

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
            FS.readdir(`/home/runner/Logic-Link/Commands/Ticket/${category}/`, (error, files) => {
              if (error) return console.error(error);
              files.forEach((file) => {
                if (!file.endsWith(".js")) return;
                let cmd = require(`/home/runner/Logic-Link/Commands/Ticket/${category}/${file}`);
                let name = file.split(".")[0];
                
                client.functions.log(`CMD: ${Chalk["bold"](name)}`);
                client.commands.set(name, cmd);
                cmds["Ticket"][category].push(name);
              });
              client.category.set("Ticket", cmds["Ticket"]);
            })
          }
          continue;
        }

        FS.readdir(`/home/runner/Logic-Link/Commands/${category}/`, (error, files) => {
          if (error) return console.error(error);
          files.forEach((file) => {
            if (!file.endsWith(".js")) return;
            let cmd = require(`/home/runner/Logic-Link/Commands/${category}/${file}`);
            let name = file.split(".")[0];
            
            client.functions.log(`CMD: ${Chalk["bold"](name)}`);
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

      await client.login(config.token);
      return true;
    } catch (error) {
      client.functions.sendError(error);
      return false;
    }
  }
}