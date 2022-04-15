import Discord from "discord.js";
import Enmap from "enmap";
import fs from "fs";
import path from "path";
import clear from "clear-module";

import Components from "../Modules/Components";
import Commands from "./Commands";
import Config from "./Config";
import Embeds from "../Modules/Embeds";
import Functions from "../Modules/Functions";
import Prompts from "../Modules/Prompts";
import Database from "./Database";
import Logger from "../Modules/Logger";
import Util from "./Util";
import Schemas from "../Modules/Schemas";
import server from "../server";

/**
 * An extended discord.js client used for Logic Link.
 * @class LogicLink
 */
export default class LogicLink extends Discord.Client {
  components = new Components();
  functions = new Functions();
  embeds = new Embeds();
  schemas = new Schemas();
  logger = new Logger();
  cooldown = new Enmap();
  tempGuild = new Enmap();
  tempUsers = new Enmap();

  category = new Discord.Collection([
    ["Administrator", []],
    ["Developer", []],
    ["General", []],
    ["Moderator", []],
    ["Support", []],
    ["Ticket", {
      Administrator: [],
      Support: [],
      Basic: []
    }],
  ]);
  
  prompt = Prompts;
  commands = Commands;
  config = Config;
  db = Database;
  util = Util;

  server: any;
  readySince: number;
  cmdScheme: any[];

  /**
   * Creates the client and starts the server, the initialize function must be called next.
   * @constructor
   * @param {Object} options - The original discord.js Client options.
   */
  constructor(options) {
    super(options);
  }

  /**
   * Imports command and event files for use and logins into the bot.
   * @async
   * @function initialize
   * @param {boolean} [skipServer] - Skips starting the server, useful if it's already running.
   * @returns {boolean}
   */
  initialize(skipServer?: boolean): boolean {
    for (const category in this.commands) {
      if (category == "Ticket") continue;
      let cmds = [];

      fs.readdir(path.resolve(__dirname, `../Commands/${category}`), async (error, files) => {
        if (error) return console.log(error);

        for (const file of files) {
          if (!file.endsWith(".ts")) continue;

          let name = file.split(".")[0];
          let cmd = (await import(path.resolve(__dirname, `../Commands/${category}/${name}`))).default;

          console.log(`CMD: ${name}`);
          this.commands[category].get(name).run = cmd;
          cmds.push(name);
        }
      });
      
      this.category.set(category, cmds);
    }

    fs.readdir(path.resolve(__dirname, `../Commands/Ticket`), async (error, catergoryFiles) => {
      if (error) return console.log(error);
      let categoryCmds = {
        Administrator: [],
        Support: [],
        Basic: []
      };

      for (const category of catergoryFiles) {
        let cmds = [];

        fs.readdir(path.resolve(__dirname, `../Commands/Ticket/${category}`), async (error, files) => {
          if (error) return console.log(error);

          for (const file of files) {
            if (!file.endsWith(".ts")) continue;
  
            let name = file.split(".")[0];
            let cmd = (await import(path.resolve(__dirname, `../Commands/Ticket/${category}/${name}`))).default;
  
            console.log(`CMD: ${name}`);
            this.commands.Ticket.get(name).run = cmd;
            cmds.push(name);
          }
        });

        categoryCmds[category] = cmds;
      }

      this.category.set("Ticket", categoryCmds);
    });

    if (!skipServer) this.server = server();
    this.login(this.config.token);

    return true;
  }

  async restart() {
    for (const moduleId of Object.keys(require.cache)) {
      if (moduleId.includes("node_modules")) continue;
      delete require.cache[moduleId];
    }

    this.destroy();
    this.initialize(true);
    this.login(this.config.token);
  }
}