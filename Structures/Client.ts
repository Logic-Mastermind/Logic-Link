import Discord from "discord.js";
import Enmap from "enmap";
import fs from "fs";
import path from "path";

import Components from "../Modules/Components";
import Commands from "../Structures/Commands";
import Config from "../Structures/Config";
import Embeds from "../Modules/Embeds";
import Functions from "../Modules/Functions";
import Prompts from "../Modules/Prompts";
import Database from "../Structures/Database";
import Logger from "../Modules/Logger";
import Util from "../Structures/Util";
import Schemas from "../Modules/Schemas";
import server from "../server";
import { file } from "googleapis/build/src/apis/file";

/**
 * An extended discord.js client used for Logic Link.
 * @class AdvancedClient
 */
export default class AdvancedClient extends Discord.Client {
  components = new Components();
  functions = new Functions();
  embeds = new Embeds();
  schemas = new Schemas();
  logger = new Logger();
  cooldown = new Enmap();

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
  
  prompts = Prompts;
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
    this.server = server();
  }

  /**
   * Imports command and event files for use and logins into the bot.
   * @async
   * @function initialize
   * @returns {boolean}
   */
  initialize(): boolean {

    for (const category in Commands) {
      if (category == "Ticket") continue;
      let cmds = [];

      fs.readdir(path.resolve(__dirname, `../Commands/${category}`), async (error, files) => {
        if (error) return console.log(error);

        for (const file of files) {
          if (!file.endsWith(".ts")) continue;

          let name = file.split(".")[0];
          let cmd = (await import(path.resolve(__dirname, `../Commands/${category}/${name}`))).default;

          console.log(`CMD: ${name}`);
          this.commands[category][name].run = cmd;
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
            this.commands.Ticket[name].run = cmd;
            cmds.push(name);
          }
        });

        categoryCmds[category] = cmds;
      }

      this.category.set("Ticket", categoryCmds);
    });

    return true;
  }
}