import Discord from "discord.js";
import Types from "../Typings/types";
import Enmap from "enmap";
import fs from "fs";

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

export default class Client extends Discord.Client {
  components = new Components();
  functions = new Functions();
  embeds = new Embeds();
  prompts = new Prompts();
  schemas = new Schemas();
  logger = new Logger();
  cooldown = new Enmap();

  commands = null;
  category = null;
  config = Config;
  db = Database;
  util = Util;

  server: any;
  readySince: number;
  ready: boolean;

  constructor(options) {
    super(options);

    let categories = new Discord.Collection();
    categories.set("Administrator", []);
    categories.set("Developer", []);
    categories.set("General", []);
    categories.set("Moderator", []);
    categories.set("Support", []);
    categories.set("Ticket", {
      Administrator: [],
      Support: [],
      General: []
    });

    for (const category of Commands.categories) {
      if (category == "Ticket") {
        for (let tckCategory of Commands.ticketCategories) {
          fs.readdir(`../Commands/Ticket/${tckCategory}/`, async (error, files) => {
            if (error) throw error;

            for (let file of files) {
              if (!file.endsWith(".ts")) return;
              let name = file.split(".")[0];
              let cmd = await import(`../Commands/Ticket/${tckCategory}/${name}`);

              this.functions.log(`CMD: ${name}`, "bold");
              this.commands.ticket[tckCategory][name].run = cmd;
              categories[category][tckCategory].push(name);
            }
          });
        }
      } else {
        fs.readdir(`../Commands/${category}/`, async (error, files) => {
          if (error) throw error;

          for (let file of files) {
            if (!file.endsWith(".ts")) return;
            let name = file.split(".")[0];
            let cmd = await import(`../Commands/${category}/${name}`);

            this.functions.log(`CMD: ${name}`);
            this.commands[category][name].run = cmd;
            categories[category].push(name);
          }
        });
      }
    }
  }
}