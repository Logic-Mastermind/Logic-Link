import Discord from "discord.js";
import client from "../index";
import Types from "../Typings/types";

/**
 * A message collector with advanced functions for custom prompts.
 * @class Prompt
 */
 class Collector {
  botMessage: Discord.Message;
  userMessage: Discord.Message;
  command: Types.commandData;
  channel: Discord.TextChannel;

  /**
   * Sets the class properties that respond to collector events.
   * @constructor
   * @param {Options} options - An object containing the names of collector events.
   * @param {Discord.Message} options.botMessage - The message to start the collector from.
   * @param {Discord.Message} options.userMessage - The message that the user sent.
   * @param {Discord.Channel} options.channel - The channel.
   * @param {Types.commandData} [options.command] - The command that was executed.
   */
  constructor(options: Types.collectorConstructorOptions) {
    this.botMessage = options.botMessage;
    this.userMessage = options.userMessage;
    this.channel = options.channel;
    this.command = options.command;
  }

  /**
   * Sets the class properties that respond to collector events.
   * @constructor
   * @param {Options} options - An object containing the names of collector events.
   * @param {Discord.Message} options.botMessage - The message to start the collector from.
   * @param {Discord.Message} options.userMessage - The message that the user sent.
   * @param {Discord.Channel} options.channel - The channel.
   * @param {Types.commandData} [options.command] - The command that was executed.
   */
  setOptions(options: Types.collectorConstructorOptions) {
    this.botMessage = options.botMessage;
    this.userMessage = options.userMessage;
    this.channel = options.channel;
    this.command = options.command;
  }

  /**
   * Creates a new message collector.
   * @function startMessageCollector
   * @param {Object} options - An object containing options relating to the message collector.
   * @param {Function} options.collect - The function that responds to the 'collect' event.
   * @param {Function} options.end - The function that responds to the 'end' event.
   * @param {Types.promptData} options.promptData - Data used to represent prompt questions.
   * @param {Discord.MessageComponentCollectorOptions} [options.collectorOptions] - Options for the collector.
   */
  startMessageCollector(options: Types.messageCollectorOptions) {
    const channel = this.userMessage.channel || this.channel;
    const collector = channel.createMessageCollector(options.collectorOptions);
    client.tempUsers.push(this.userMessage.id, channel.id, "promptChannels");

    let attempts = [];
    let lastMessage: Discord.Message;
    let current = 0;

    collector.on("collect", async (msg): Promise<any> => {
      if (msg.author.id !== this.userMessage.author.id) return;
      const currentKey = Object.keys(options.promptData.info)[current];
      const question = options.promptData.info[currentKey];
      const msgArgs = msg.content.split(" ");

      const args = {
        collector,
        current,
        lastMessage,
        msgArgs,
        next: async () => {
          const embed = options.promptData.embeds[current + 1];
          const newMessage = await this.userMessage.channel.send({ embeds: [embed] });

          lastMessage = newMessage;
          current++
        },
        embed: (type: "success" | "error", description: string, fields?: boolean | Types.fieldData[]) => {
          if (fields === true) {
            fields = [];
            fields.push({ name: "Original Question", value: question.question });
          }

          const embed = client.embeds[type](question.title, description, fields == false ? [] : fields);
          lastMessage.edit({ embeds: [embed] });
        }
      }

      if (attempts[current] >= 5) {
        const embed = client.embeds.error(question.title, `You have attempted this question too many times.`);
        lastMessage.edit({ embeds: [embed] });

        return collector.stop("stopped");
      }

      if (msg.content.split(" ")[0].includes("skip")) {
        args.embed("error", `Skipping is disallowed in this prompt, please try again.`, true);
        return 1;

      } else if (msg.content.split(" ")[0].includes("cancel")) {
        args.embed("error", `This question has stopped looking for responses.`);
        collector.stop("cancelled");

        return 1;
      }

      const returned = options.collect(msg, args);
      if (returned !== 0) return;

      collector.stop("finished");
    });

    collector.on("end", async (collected, result) => {
      const currentKey = Object.keys(options.promptData.info)[current];
      const question = options.promptData.info[currentKey];

      const args = {
        collector,
        lastMessage,
        question
      }

      if (collected.size == 0) {
        this.botMessage.reply({ embeds: [client.embeds.inactivity(this.command || "Prompt")] });

      } else {
        if (result == "cancelled") {
          const embed = client.embeds.success(this.command, `This prompt has been cancelled.`);
          this.botMessage.channel.send({ embeds: [embed] });

        } else if (result == "stopped") {
          const embed = client.embeds.error(this.command.option.new, `This prompt has been stopped, please try again.`);
          this.botMessage.channel.send({ embeds: [embed] });

        } else if (result == "finished") {
          options.end(collected, result, args);

        } else {
          const embed = client.embeds.inactivity(this.command);
          const embed1 = client.embeds.warn(question.title, `This question has stopped looking for responses.`);

          this.userMessage.channel.send({ embeds: [embed] });
          lastMessage.edit({ embeds: [embed1] });
        }
      }
    });
  }
}

/**
 * A class with methods that run specific prompts.
 * @class Prompts
 */
 export default class Prompts {
  client: Discord.Client;
  message: Discord.Message;
  command: Types.commandData;

  collector = Collector;
  filter = () => true;

  /**
   * Used to set class properties.
   * @constructor
   * @param {Discord.Message} message - The user message.
   * @param {Types.commandData} command - The command.
   */
  constructor(message: Discord.Message, command: Types.commandData) {
    this.message = message;
    this.command = command;
  }

  /**
   * Sends a button prompt asking whether the user agrees to the delete command terms.
   * @async
   * @function deleteConfirmation
   * @returns {Promise<void>}
   */
  async deleteConfirmation(): Promise<void> {
    const embed = client.embeds.orange(this.command, client.util.messages.deleteConfirmation);
    const filter = () => true;

    const accept = client.components.button({ label: "Accept", style: "SUCCESS", id: "Delete_Conditions:Accept" });
    const decline = client.components.button({ label: "Decline", style: "DANGER", id: "Delete_Conditions:Decline" });
    const row = client.components.actionRow(accept, decline);

    const acceptEmbed = client.embeds.success(this.command,`Accepted the command conditions.`);
    const declineEmbed = client.embeds.warn(this.command, `Declined the command conditions.`);

    const msg = await this.message.reply({ embeds: [embed], components: [row] });
    const collector = msg.createMessageComponentCollector({ filter, idle: 90 * 1000 });

    collector.on("collect", async (int) => {
      if (int.user.id !== this.message.author.id) {
        const embed = client.embeds.notComponent();
        return int.reply({ embeds: [embed], ephemeral: true });
      }

      collector.stop("clicked");
      if (int.customId == "Delete_Conditions:Accept") {
        client.db.userGlobal.set(int.user.id, true, "deleteCmdWarning");
        int.update({ embeds: [acceptEmbed], components: [] });

      } else {
        int.update({ embeds: [declineEmbed], components: [] });
      }
    });

    collector.on("end", async (_, reason) => {
      if (reason !== "user") return;

      const embed = client.embeds.inactivity(this.command);
      msg.edit({ embeds: [embed], components: [] });
    });
  }

  /**
   * Controls the help embed message component prompts.
   * @async
   * @function helpMenu
   * @param {Discord.Message} botMessage - The message originally sent by the bot.
   * @param {Object} obj - An overflow object with properties used for permissions.
   * @returns {Promise<void>}
   */
  async helpMenu(botMessage: Discord.Message, obj: Types.helpCategoryInfo): Promise<void> {
    const collector = botMessage.createMessageComponentCollector({ filter: this.filter, idle: 60 * 1000 });
    const original = botMessage.embeds[0];
    const select = botMessage.components[0].components[0];

    const btnRow = client.components.actionRow(client.components.button({ label: "Back", style: "SECONDARY", id: "Help_Menu:Back" }));
    const selectRow = client.components.actionRow(select);

    collector.on("collect", async (int: Discord.ButtonInteraction | Discord.SelectMenuInteraction) => {
      if (int.user.id !== this.message.author.id) {
        const embed = client.embeds.notComponent();
        return int.reply({ embeds: [embed], ephemeral: true });
      }

      if (int.componentType == "BUTTON") {
        return int.update({ embeds: [original], components: [selectRow] });
      }

      switch (int.values[0]) {
        case "Help_Menu:General":
        {
          const helpEmbed = client.embeds.helpCategory("General", obj);
          await int.update({ embeds: [helpEmbed], components: [btnRow] });
          break;
        }
        case "Help_Menu:Moderator":
        {
          const helpEmbed = client.embeds.helpCategory("Moderator", obj);
          await int.update({ embeds: [helpEmbed], components: [btnRow] });
          break;
        }
        case "Help_Menu:Administrator":
        {
          const helpEmbed = client.embeds.helpCategory("Administrator", obj);
          await int.update({ embeds: [helpEmbed], components: [btnRow] });
          break;
        }
        case "Help_Menu:Ticket":
        {
          const helpEmbed = client.embeds.helpCategory("Ticket", obj);
          await int.update({ embeds: [helpEmbed], components: [btnRow] });
          break;
        }
        case "Help_Menu:Support":
        {
          const helpEmbed = client.embeds.helpCategory("Support", obj);
          await int.update({ embeds: [helpEmbed], components: [btnRow] });
          break;
        }
        case "Help_Menu:Developer":
        {
          const helpEmbed = client.embeds.helpCategory("Developer", obj);
          await int.update({ embeds: [helpEmbed], components: [btnRow] });
          break;
        }
      }
    });

    collector.on("end", async () => {
      botMessage.edit({ embeds: [original], components: [client.components.actionRow(select.setDisabled())] });
    })
  }

  /**
   * Creates a new ticket panel in a guild
   * @async
   * @function newPanel
   * @param {Discord.Guild} guild - The guild to create the panel in.
   * @returns {Promise<void>}
   */
  async newPanel(guild: Discord.Guild) {
    if (client.tempGuild.get(guild.id)?.panelSetup) {
      const embed = client.embeds.error(this.command.option.new, `A panel is already being created in this server.`);
      return this.message.reply({ embeds: [embed] });
    }

    const info: Types.promptData = {
      name: {
        title: `Panel Name`,
        question: `What should be the name of this panel?`,
        description: `The name must be within 3 and 32 characters long.\nThe name must also be unique to other panels.`
      },
      opened: {
        title: `Opened Category`,
        question: `Where would you like opened tickets to go?`,
        description: `Type the name or ID of a category you want to set this to.\nTickets will be moved here once they are opened.`
      },
      closed: {
        title: `Closed Category`,
        question: `Where would you like closed tickets to go?`,
        description: `Type the name or ID of a category you want to set this to.\nTickets will be moved here once they are closed.`
      },
      claiming: {
        title: `Ticket Claiming`,
        question: `Would you like to enable or disable panel claiming? (\`on\` or \`off\`)`,
        description: `Type the option that you would like this to set to.\nWhen enabled, support team roles will be able to claim tickets.`
      },
      support: {
        title: `Support Roles`,
        question: `What are some support roles that you would like for this panel?`,
        description: `Members with these roles will be able to view and manage support tickets.\nMention or type the names of those roles below.`
      },
      additional: {
        title: `Additional Roles`,
        question: `What are some additional roles that you would like for this panel?`,
        description: `By default, members with these roles will be able to view support tickets.\nMention or type the names of those roles below.`
      },
      channel: {
        title: `Panel Channel`,
        question: `Where would you like this panel to be sent to?`,
        description: `Mention or type the name of a channel for this setting.\nMake sure that I have the required permissions to send messages here.`
      }
    }

    const embeds = [
      client.embeds.question(info.name.title, info.name.question, [{
        name: "Details",
        value: info.name.description,
        inline: false
      }]),
      client.embeds.question(info.opened.title, info.opened.question, [{
        name: "Details",
        value: info.opened.description,
        inline: false
      }]),
      client.embeds.question(info.closed.title, info.closed.question, [{
        name: "Details",
        value: info.closed.description,
        inline: false
      }]),
      client.embeds.question(info.claiming.title, info.claiming.question, [{
        name: "Details",
        value: info.claiming.description,
        inline: false
      }]),
      client.embeds.question(info.support.title, info.support.question, [{
        name: "Details",
        value: info.support.description,
        inline: false
      }]),
      client.embeds.question(info.additional.title, info.additional.question, [{
        name: "Details",
        value: info.additional.description,
        inline: false
      }]),
      client.embeds.question(info.channel.title, info.channel.question, [{
        name: "Details",
        value: info.channel.description,
        inline: false
      }])
    ];

    let collected = {};
    client.tempGuild.set(guild.id, true, "panelSetup");
    client.tempUsers.push(this.message.author.id, guild.id, "inPromptGuilds");

    const tsettings = client.functions.getTicketData(guild);
    const startEmbed = client.embeds.green(this.command.option.new, `${client.util.emojis.pending} Starting the panel setup prompt.`, [{
      name: "Additional Info",
      value: `You are limited to 5 attempts per question.\nType \`cancel\` to cancel the prompt.`
    }]);

    const startMsg = await this.message.reply({ embeds: [startEmbed] });
    startMsg.edit({ embeds: [embeds[0]] });

    const prompt = new this.collector({
      userMessage: this.message,
      command: this.command
    });

    prompt.startMessageCollector({
      collectorOptions: {
        filter: (msg) => msg.author.id == this.message.author.id
      },
      promptData: {
        info,
        embeds
      },
      collect: (msg, args) => {
        if (args.current == 0) {
          if (msg.content.length > 32) {
            args.embed("error", `This name is greater than 32 characters, please try again.`, true);
            return 1;
  
          } else if (msg.content.length < 3) {
            args.embed("error", `This name is less than 3 characters, please try again.`, true);
            return 1;
          }
  
          let taken = null;
          for (const pan of tsettings.panels.values()) {
            if (pan.name == msg.content) {
              taken = true;
              break;
            }
          }
  
          if (taken) {
            args.embed("error", `This name has already been used in another panel, please try again.`, true);
            return 1;
          }
          
          collected[args.current] = msg.content;
          args.embed("success", `Panel name has been set to: \`${collected[args.current]}\`.`);
          args.next();

        } else if (args.current == 1 || args.current == 2) {
          let category = client.functions.findChannel(args.msgArgs.join(" "), msg.guild, {
            searchFilter: (c) => c.type == "GUILD_CATEGORY"
          });

          if (!category) {
            args.embed("error",  `I could not record any categories from your message, please try again.`, true);
            return 1;
          }

          if (!category.permissionsFor(guild.me).has("MANAGE_CHANNELS")) {
            args.embed("error", `I do not have the \`MANAGE_CHANNELS\` permission in this category, please try again.`, true);
            return 1;
          }

          collected[args.current] = category.id;
          args.embed("success", `Panel ${args.current == 1 ? "opened" : "closed"} category has been set to: \`#${category.name}\`.`);
          args.next();

        } else if (args.current == 3) {
          let option = null;
          if (msg.content.includes("yes") || msg.content.includes("on")) option = true;
          if (msg.content.includes("no") || msg.content.includes("off")) option = false;

          if (option == null) {
            args.embed("error", `An invalid option was recieved, please type \`on\` or \`off\`.`, true);
            return 1;
          }
          
          collected[args.current] = option;
          args.embed("success", `Ticket claiming in this panel has been turned \`${option ? `on` : `off`}\`.`);
          args.next();

        } else if (args.current == 4 || args.current == 5) {
          let roles = [];
          let strings = args.msgArgs.filter((v) => (!v.startsWith("<@&") || !v.startsWith("<@!")) && !v.endsWith(">"));
          let mentions = msg.mentions.roles;

          for (const array of mentions) {
            roles.push(array[0]); // Role ID
          }

          for (const arg of strings) {
            let role = client.functions.findRole(arg, msg.guild);
            if (role) roles.push(role.id);
          }

          roles = [...new Set(roles)];
          if (roles.length < 1) {
            args.embed("error", `I could not record any roles from your message, please try again.`);
            return 1;
          }

          collected[args.current] = roles;
          args.embed("success", `I have collected \`${roles.length}\` role${roles.length == 1 ? `` : `s`} from your message.`, [{
            name: "Roles",
            value: `<@&${roles.join(">\n<@&")}>`
          }]);
          args.next();

        } else if (args.current == 7) {
          let channel = msg.mentions.channels.first() as Types.guildChannel;
          if (!channel) channel = client.functions.findChannel(args.msgArgs.join(" "), msg.guild, {
            searchFilter: (c) => c.isText()
          });

          if (!channel) {
            args.embed("error", `I could not record any text channels from your message, please try again.`, true);
            return 1;
          }

          if (!channel.permissionsFor(guild.me).has("SEND_MESSAGES")) {
            args.embed("error", `I do not have the \`SEND_MESSAGES\` permission in this channel, please try again.`, true);
            return 1;
          }

          collected[args.current] = channel.id;
          args.embed("success", `Panel channel has been set to: <#${channel.id}>.`);
          
          return 0;
        }
      },
      end: async (collection, _, args) => {
        client.tempGuild.set(guild.id, false, "panelSetup");
        client.tempUsers.set(this.message.author.id, client.tempUsers.get("inPromptGuilds").filter((v) => v !== guild.id, "inPromptGuilds"));

        let categoryOpened = this.message.guild.channels.cache.get(collected[1]);
        let categoryClosed = this.message.guild.channels.cache.get(collected[2]);

        const fields = [
          {
            name: `General Configuration`,
            value: `${client.util.emojis.text} Name: \`${collected[0]}\`\n${client.util.emojis.category} Opened Category: \`#${categoryOpened.name}\`\n${client.util.emojis.category} Closed Category: \`#${categoryClosed.name}\`\n${client.util.emojis.override} Claiming: \`${collected[3] ? `On` : `Off`}\`\n${client.util.emojis.channel} Panel Channel: <#${collected[6]}>\n\u200b`,
          },
          {
            name: `Role Configuration`,
            value: `${client.util.emojis.roleIcon} Support Roles:\n<@&${collected[4].join(">\n<@&")}>${collected[5] ? `\n\n${client.util.emojis.roleIcon} Additional Roles:\n<@&${collected[5].join(">\n<@&")}>` : ``}`
          }
        ];

        const confirmBtn = client.components.button({ label: "Confirm", style: "SUCCESS", id: "Panel_Config:Confirm" });
        const cancelBtn = client.components.button({ label: "Cancel", style: "DANGER", id: "Panel_Config:Cancel" });
        const row = client.components.actionRow(confirmBtn, cancelBtn);

        const embed = client.embeds.green(this.command.option.new, `This prompt has been completed.\nClick on a button below to confirm or cancel the configuration.\n\u200b`, fields);

        const confirmMsg = await this.message.channel.send({ embeds: [embed], components: [row] });
        const confirmCollector = confirmMsg.createMessageComponentCollector({ filter: this.filter, time: 60 * 1000 });

        confirmCollector.on("collect", async (int) => {
          if (int.user.id !== this.message.author.id) {
            const embed = client.embeds.notComponent();
            return int.reply({ embeds: [embed], ephemeral: true });
          }

          if (int.customId.endsWith("Confirm")) {
            const panels = tsettings.panels;
            const panelId = panels.last()?.id || 1;
            
            const data: Types.panelData = {
              name: collected[0],
              opened: collected[1],
              closed: collected[2],
              claiming: collected[3],
              support: collected[4],
              additional: collected[5],
              channel: collected[6],

              createdAt: Date.now(),
              createdBy: this.message.author.id,
              tickets: new Discord.Collection(),
              totalTicketCount: 0,
              ticketLimit: 1,

              claimedFormat: `claimed-[number]`,
              ticketFormat: `ticket-[number]`,
              panelMessage: null,
              ticketMessage: null,

              createdMessage: null,
              id: panelId
            }

            panels.set(panelId, data);
            client.db.tickets.set(guild.id, panels, "panels");

            const result = await client.schemas.sendPanel(panelId, guild.id);
            const fields = [];

            if (typeof result == "string") fields.push({ name: "Status", value: `An error has occured trying to send the panel message.\nInsufficient Permissions: \`${result}\`` });

            const embed = client.embeds.success(this.command, `Created a new panel with the name: \`${collected[0]}\`.`, fields);
            await int.reply({ embeds: [embed] });
            
            confirmMsg.delete();
            confirmCollector.stop("clicked");

          } else {
            const embed = client.embeds.success(this.command, `Cancelled the panel setup prompt.`);
            await int.reply({ embeds: [embed] });

            confirmMsg.delete();
            confirmCollector.stop("clicked");
          }
        });

        confirmCollector.on("end", (_, reason) => {
          if (reason !== "clicked") {
            const embed = client.embeds.inactivity(this.command);
            this.message.channel.send({ embeds: [embed] });
            confirmMsg.delete();
          }
        })
      }
    });
  }

  async modifyPanel(command, message, msg, id, tsettings) {
    
    const clientMember = message.guild.me;
    const filter = () => true;
    let clicked1 = false;
    const collector1 = msg.createMessageComponentCollector({ filter, idle: 60000 });

    collector1.on("collect", async (component) => {
      if (message.author.id !== component.user.id) {
        const embed = client.embeds.notComponent();
        return component.reply({ embeds: [embed], ephemeral: true });
      }

      msg.delete();
      clicked1 = true;

      const prompt = {
        name: [`What should be the name of this panel?`, `The name must be within 3 and 32 characters long.\nThe name must also be unique to other panels.`],
        opened: [`Where would you like opened tickets to go?`, `Type the name or ID of a category you want to set this to.\nTickets will be moved here once they are opened.`],
        closed: [`Where would you like closed tickets to go?`, `Type the name or ID of a category you want to set this to.\nTickets will be moved here once they are closed.`],
        claiming: [`Would you like to enable or disable panel claiming? (\`on\` or \`off\`)`, `Type the option that you would like this to set to.\nWhen enabled, support team roles will be able to claim tickets.`],
        support: [`What are some support roles that you would like for this panel?`, `Members with these roles will be able to view and manage support tickets.\nMention or type the names of those roles below.`],
        additional: [`What are some additional roles that you would like for this panel?`, `By default, members with these roles will be able to view support tickets.\nMention or type the names of those roles below.`],
        channel: [`Where would you like this panel to be sent to?`, `Mention or type the name of a channel for this setting.\nMake sure that I have the required permissions to send messages here.`],
        ticket: [`What format should ticket names follow?`, `The format must be within 3 and 32 characters long.\nText that includes \`[number]\` will be replaced with the current ticket number.`],
        claimed: [`What format should claimed ticket names follow?`, `The format must be within 3 and 32 characters long.\nText that includes \`[number]\` will be replaced with the current ticket number.`]
      }

      const title = {
        name: `Panel Name`,
        opened: `Opened Category`,
        closed: `Closed Category`,
        claiming: `Ticket Claiming`,
        support: `Support Roles`,
        additional: `Additional Roles`,
        channel: `Panel Channel`,
        ticket: `Ticket Format`,
        claimed: `Claimed Format`
      }

      const embeds = [];
      const values = [];
      let num = 0;

      for await (const option of component.values) {
        values.push({ name: option, number: ++num });

        switch (option) {
          case "name":
          {
            const embed = client.embeds.question(title.name, prompt.name[0], [{
              name: "Details",
              value: prompt.name[1],
              inline: false
            }]);
            embeds.push(embed);
            break;
          }
          case "opened":
          {
            const embed = client.embeds.question(title.opened, prompt.opened[0], [{
              name: "Details",
              value: prompt.opened[1],
              inline: false
            }]);
            embeds.push(embed);
            break;
          }
          case "closed":
          {
            const embed = client.embeds.question(title.closed, prompt.closed[0], [{
              name: "Details",
              value: prompt.closed[1],
              inline: false
            }]);
            embeds.push(embed);
            break;
          }
          case "claiming":
          {
            const embed = client.embeds.question(title.claiming, prompt.claiming[0], [{
              name: "Details",
              value: prompt.claiming[1],
              inline: false
            }]);
            embeds.push(embed);
            break;
          }
          case "channel":
          {
            const embed = client.embeds.question(title.channel, prompt.channel[0], [{
              name: "Details",
              value: prompt.channel[1],
              inline: false
            }]);
            embeds.push(embed);
            break;
          }
          case "support":
          {
            const embed = client.embeds.question(title.support, prompt.support[0], [{
              name: "Details",
              value: prompt.support[1],
              inline: false
            }]);
            embeds.push(embed);
            break;
          }
          case "additional":
          {
            const embed = client.embeds.question(title.additional, prompt.additional[0], [{
              name: "Details",
              value: prompt.additional[1],
              inline: false
            }]);
            embeds.push(embed);
            break;
          }
          case "ticket":
          {
            const embed = client.embeds.question(title.ticket, prompt.ticket[0], [{
              name: "Details",
              value: prompt.ticket[1],
              inline: false
            }]);
            embeds.push(embed);
            break;
          }
          case "claimed":
          {
            const embed = client.embeds.question(title.claimed, prompt.claimed[0], [{
              name: "Details",
              value: prompt.claimed[1],
              inline: false
            }]);
            embeds.push(embed);
            break;
          }
        }
      }
      
      const filter = (m) => m.author.id == message.author.id;
      const collector = message.channel.createMessageCollector({ filter, idle: 60 * 1000 });
      const startEmbed = client.embeds.green(command.option.modify, `${client.util.emojis.pending} Starting the panel modify prompt.`, [{
        name: "Additional Info",
        value: `You are limited to 5 attempts per question.\nType \`cancel\` to cancel the prompt.`,
        inline: false
      }]);
      
      const startMsg = await message.reply({ embeds: [startEmbed] });
      await client.functions.sleep(800);
      startMsg.edit({ embeds: [embeds[0]] });

      let current = values[0].name;
      let currentNum = values[0].number;
      let cancelled = false;
      let finished = false;
      let attempted = false;

      let msgId = [
        startMsg.id,
        null,
        null,
        null,
        null,
        null,
        null
      ]

      let attempts = {
        name: 0,
        opened: 0,
        closed: 0,
        claiming: 0,
        support: 0,
        additional: 0,
        channel: 0,
        ticket: 0,
        claimed: 0
      }

      let collected: Types.ticketPanel = {};
      client.db.userInfo.set(`${message.author.id}-${message.guild.id}`, message.channel.id, "inPrompt");

      collector.on("collect", async (m) => {
        const msgArgs = m.content.split(/ +/g);
        const editMsg = m.channel.messages.cache.get(msgId[currentNum - 1]);
        const originalQuestion = [{ name: "Original Question", value: `${prompt[current][0]}\n\n${prompt[current][1]}`, inline: false }];
        const currentAttempt = ++attempts[current];

        if (currentAttempt >= 5) {
          const embed = client.embeds.error(title[current], `You have attempted this question too many times.`);
          editMsg.edit({ embeds: [embed] });

          attempted = true;
          return collector.stop();
        }

        if (m.content.split(" ")[0].includes("skip")) {
          const embed = client.embeds.error(title[current], `Skipping is disallowed in this prompt, please try again.`, [{ name: "Original Question", value: prompt[current], inline: false }]);
          return editMsg.edit({ embeds: [embed] });

        } else if (m.content.split(" ")[0].includes("cancel")) {
          const embed = client.embeds.error(title[current], `This question has stopped looking for responses.`);
          editMsg.edit({ embeds: [embed] });

          cancelled = true;
          return collector.stop();
        }

        // -------------------------

        async function validateOption(value) {
          if (value == "name") {
            if (m.content.length > 32) {
              const embed = client.embeds.error(title[current], `This name is greater than 32 characters, please try again.`, originalQuestion);
              return editMsg.edit({ embeds: [embed] });

            } else if (m.content.length < 3) {
              const embed = client.embeds.error(title[current], `This name is less than 3 characters, please try again.`, originalQuestion);
              return editMsg.edit({ embeds: [embed] });
            }

            let taken = null;
            for (const pan of tsettings.panels.values()) {
              if (pan.name == m.content) {
                taken = true;
                break;
              }
            }

            if (taken) {
              const embed = client.embeds.error(title[current], `This name has already been used in another panel, please try again.`, originalQuestion);
              return editMsg.edit({ embeds: [embed] });
            }

            collected[current] = m.content;
            const embed = client.embeds.success(title[current], `Panel name has been set to: \`${collected[current]}\`.`);
            editMsg.edit({ embeds: [embed] });

          } else if (value == "opened") {
            let category = client.functions.findChannel(msgArgs.join(" "), m.guild, { searchFilter: (c) => c.type == "GUILD_CATEGORY" });
            if (!category) {
              const embed = client.embeds.error(title[current], `I could not record any categories from your message, please try again.`, originalQuestion);
              return editMsg.edit({ embeds: [embed] });
            }

            if (!category.permissionsFor(clientMember).has("MANAGE_CHANNELS")) {
              const embed = client.embeds.error(title[current], `I do not have the \`MANAGE_CHANNELS\` permission in this category, please try again.`, originalQuestion);
              return editMsg.edit({ embeds: [embed] });
            }

            collected[current] = category.id;
            const embed = client.embeds.success(title[current], `Panel opened category has been set to: \`#${category.name}\`.`);
            editMsg.edit({ embeds: [embed] });

          } else if (value == "closed") {
            let category = client.functions.findChannel(msgArgs.join(" "), m.guild, { searchFilter: (c) => c.type == "GUILD_CATEGORY" });
            if (!category) {
              const embed = client.embeds.error(title[current], `I could not record any categories from your message, please try again.`, originalQuestion);
              return editMsg.edit({ embeds: [embed] });
            }

            if (!category.permissionsFor(clientMember).has("MANAGE_CHANNELS")) {
              const embed = client.embeds.error(title[current], `I do not have the \`MANAGE_CHANNELS\` permission in this category, please try again.`, originalQuestion);
              return editMsg.edit({ embeds: [embed] });
            }

            collected[current] = category.id;
            const embed = client.embeds.success(title[current], `Panel closed category has been set to: \`#${category.name}\`.`);
            editMsg.edit({ embeds: [embed] });
            
          } else if (value == "claiming") {
            let option = null;
            if (m.content.includes("yes") || m.content.includes("on")) option = true;
            if (m.content.includes("no") || m.content.includes("off")) option = false;

            if (option == null) {
              const embed = client.embeds.error(title[current], `An invalid option was recieved, please type \`on\` or \`off\`.`, originalQuestion);
              return editMsg.edit({ embeds: [embed] });
            }
            
            collected[current] = option;
            const embed = client.embeds.success(title[current], `Ticket claiming in this panel has been turned \`${option ? `on` : `off`}\`.`);
            editMsg.edit({ embeds: [embed] });

          } else if (value == "support") {
            let roles = [];
            let args = msgArgs.filter((v) => (!v.startsWith("<@&") || !v.startsWith("<@!")) && !v.endsWith(">"));
            let mentions = m.mentions.roles;

            for (const array of mentions) {
              roles.push(array[0]); // Role ID
            }

            for await (const arg of args) {
              let role = client.functions.findRole(arg, m.guild);
              if (role) roles.push(role.id);
            }

            roles = [...new Set(roles)];
            if (roles.length < 1) {
              const embed = client.embeds.error(title[current], `I could not record any roles from your message, please try again.`, originalQuestion);
              return editMsg.edit({ embeds: [embed] });
            }

            collected[current] = roles;
            const embed = client.embeds.success(title[current], `I have collected \`${roles.length}\` role${roles.length == 1 ? `` : `s`} from your message.`, [{
              name: "Roles",
              value: `<@&${roles.join(">\n<@&")}>`,
              inline: false
            }]);
            editMsg.edit({ embeds: [embed] });

          } else if (value == "additional") {
            let roles = [];
            let args = msgArgs.filter((v) => (!v.startsWith("<@&") || !v.startsWith("<@!")) && !v.endsWith(">"));
            let mentions = m.mentions.roles;

            for (const array of mentions) {
              roles.push(array[0]); // Role ID
            }

            for await (const arg of args) {
              let role = client.functions.findRole(arg, m.guild);
              if (role) roles.push(role.id);
            }

            roles = [...new Set(roles)];
            if (roles.length < 1) {
              const embed = client.embeds.error(title[current], `I could not record any roles from your message, please try again.`, originalQuestion);
              return editMsg.edit({ embeds: [embed] });
            }

            collected[current] = roles;
            const embed = client.embeds.success(title[current], `I have collected \`${roles.length}\` role${roles.length == 1 ? `` : `s`} from your message.`, [{
              name: "Roles",
              value: `<@&${roles.join(">\n<@&")}>`,
              inline: false
            }]);
            editMsg.edit({ embeds: [embed] });

          } else if (value == "channel") {
            let channel = m.mentions.channels.first();
            if (!channel) channel = client.functions.findChannel(msgArgs.join(" "), m.guild);

            if (!channel) {
              const embed = client.embeds.error(title[current], `I could not record any channels from your message, please try again.`, originalQuestion);
              return editMsg.edit({ embeds: [embed] });
            }

            if (!channel.isText()) {
              const embed = client.embeds.error(title[current], `<#${channel.id}> is not a text channel, please try again.`, originalQuestion);
              return editMsg.edit({ embeds: [embed] });
            }

            if (!channel.permissionsFor(clientMember).has("SEND_MESSAGES")) {
              const embed = client.embeds.error(title[current], `I do not have the \`SEND_MESSAGES\` permission in this channel, please try again.`, originalQuestion);
              return editMsg.edit({ embeds: [embed] });
            }

            collected[current] = channel.id;
            const embed = client.embeds.success(title[current], `Panel channel has been set to: <#${channel.id}>.`);
            editMsg.edit({ embeds: [embed] });

          } else if (value == "ticket") {
            if (m.content.length < 3) {
              const embed = client.embeds.error(title[current], `This format is less than 3 characters, please try again.`, originalQuestion);
              return editMsg.edit({ embeds: [embed] });
            }

            if (m.content.length > 32) {
              const embed = client.embeds.error(title[current], `This format is greater than 32 characters, please try again.`, originalQuestion);
              return editMsg.edit({ embeds: [embed] });
            }

            collected[current] = m.content;
            const embed = client.embeds.success(title[current], `Ticket format has been set to: \`${m.content}\`.`);
            editMsg.edit({ embeds: [embed] });

          } else if (value == "claimed") {
            if (m.content.length < 3) {
              const embed = client.embeds.error(title[current], `This format is less than 3 characters, please try again.`, originalQuestion);
              return editMsg.edit({ embeds: [embed] });
            }

            if (m.content.length > 32) {
              const embed = client.embeds.error(title[current], `This format is greater than 32 characters, please try again.`, originalQuestion);
              return editMsg.edit({ embeds: [embed] });
            }

            collected[current] = m.content;
            const embed = client.embeds.success(title[current], `Claimed format has been set to: \`${m.content}\`.`);
            editMsg.edit({ embeds: [embed] });
          }

          if (!values[currentNum]) {
            finished = true;
            return collector.stop();
          }

          currentNum++;
          current = values[currentNum - 1].name;
          //client.functions.next(m.channel, msgId, embeds, currentNum);
        }

        await validateOption(current);
      });

      collector.on("end", async () => {
        client.db.userInfo.set(`${message.author.id}-${message.guild.id}`, null, "inPrompt");

        if (finished) {
          let panelInfo = tsettings.panels.get(id);
          let categoryOpened = message.guild.channels.cache.get(panelInfo.opened);
          let categoryClosed = message.guild.channels.cache.get(panelInfo.closed);

          let panelChannel = await client.channels.fetch(panelInfo.channel).catch(() => {}) as Discord.TextChannel;
          let panelMsg = panelChannel ? await panelChannel.messages.fetch(panelInfo.msg).catch(() => {}) : null;

          for (const [key, val] of Object.entries(collected)) {
            panelInfo[key] = val;
          }

          const fields = [
            { name: `General Configuration`, value: `${collected.name ? `${client.util.emojis.dash}` : ``} ${client.util.emojis.text} Name: \`${panelInfo.name}\`\n${collected.opened ? `${client.util.emojis.dash}` : ``} ${client.util.emojis.category} Opened Category: \`#${categoryOpened.name}\`\n${collected.closed ? `${client.util.emojis.dash}` : ``} ${client.util.emojis.category} Closed Category: \`#${categoryClosed.name}\`\n${collected.ticket ? `${client.util.emojis.dash}` : ``} ${client.util.emojis.message} Ticket Format: \`${panelInfo.ticket}\`\n${panelInfo.claiming ? `${collected.claiming ? `${client.util.emojis.dash}` : ``} ${client.util.emojis.message} Claimed Format: \`${panelInfo.claimed}\n` : ``}\`${collected.claiming ? `${client.util.emojis.dash}` : ``} ${client.util.emojis.override} Claiming: \`${panelInfo.claiming ? `On` : `Off`}\`\n${collected.channel ? `${client.util.emojis.dash}` : ``} ${client.util.emojis.channel} Panel Channel: <#${panelInfo.channel}>\n\u200b`, inline: false },
            { name: `Role Configuration`, value: `${collected.support ? `${client.util.emojis.dash}` : ``} ${client.util.emojis.roleIcon} Support Roles:\n<@&${panelInfo.support.join(">\n<@&")}>${panelInfo.additional ? `\n\n${collected.additional ? `${client.util.emojis.dash}` : ``} ${client.util.emojis.roleIcon} Additional Roles:\n<@&${panelInfo.additional.join(">\n<@&")}>` : ``}` }
          ];

          const confirmBtn = client.components.button({ label: "Confirm", style: "SUCCESS", id: "Panel_Config:Confirm" });
          const cancelBtn = client.components.button({ label: "Cancel", style: "DANGER", id: "Panel_Config:Cancel" });
          const row = client.components.actionRow(confirmBtn, cancelBtn);
          const btnFilter = () => true;
          let clicked = false;

          const embed = client.embeds.green(command.option.new, `This prompt has been completed.\nClick on a button below to confirm or cancel the configuration.\n\u200b`, fields);

          const confirmMsg = await message.channel.send({ embeds: [embed], components: [row] });
          const confirmCollector = confirmMsg.createMessageComponentCollector({ filter: btnFilter, idle: 60 * 1000 });

          confirmCollector.on("collect", async (component) => {
            if (component.user.id !== message.author.id) {
              const embed = client.embeds.permission("ADMINISTRATOR");
              return component.reply({ embeds: [embed], ephemeral: true });
            }

            if (component.customId == "Panel_Config:Confirm") {
              const panels = tsettings.panels;
              panels.set(id, panelInfo);

              client.db.tickets.set(message.guild.id, panels, "panels");
              if (collected.channel) {
                await client.schemas.sendPanel(id, message.guild.id);
                if (panelMsg) await panelMsg.delete();

              } else {
                if (panelMsg) {
                  await client.schemas.editPanelMsg(panelInfo, tsettings, message.guild.id);
                } else {
                  if (panelChannel) {
                    await client.schemas.sendPanel(id, message.guild.id);
                  }
                }
              }

              const embed = client.embeds.success(command.option.modify, `Successfully modified the \`${panelInfo.name}\` panel.`);
              await component.reply({ embeds: [embed] });

              clicked = true;
              confirmMsg.delete();
              confirmCollector.stop();

            } else {
              const embed = client.embeds.success(command.option.new, `Cancelled the panel modify prompt.`);
              await component.reply({ embeds: [embed] });

              clicked = true;
              confirmMsg.delete();
              confirmCollector.stop();
            }
          });

          confirmCollector.on("end", async () => {
            if (!clicked) {
              const embed = client.embeds.inactivity(command.option.new);
              await message.channel.send({ embeds: [embed] });
              confirmMsg.delete();
            }
          });
        } else if (cancelled) {
          const embed = client.embeds.success(command.option.new, `This prompt has been cancelled.`);
          message.channel.send({ embeds: [embed] });

        } else if (attempted) {
          const embed = client.embeds.error(command.option.new, `This prompt has been stopped.`);
          message.channel.send({ embeds: [embed] });

        } else {
          const embed = client.embeds.inactivity(command.option.new);
          message.channel.send({ embeds: [embed] });

          const editMsg = message.channel.messages.cache.get(msgId[currentNum - 1]);
          const embed1 = client.embeds.warn(title[current], `This question has stopped looking for responses.`);
          editMsg.edit({ embeds: [embed1] });
        }
      });
    });

    collector1.on("end", async () => {
      if (clicked1) return;
      const embed = client.embeds.inactivity(command.option.modify);
      const embed1 = client.embeds.warn(command.option.modify, "");

      msg.channel.send({ embeds: [embed] });
      msg.edit({ embeds: [embed1] });
    });
  }

  async deletePanel(confirmMsg, tsettings, panel) {
    const filter = () => true;
    const collector = confirmMsg.createMessageComponentCollector({ filter, idle: 60000 });
    let clicked = false;

    collector.on("collect", async (component) => {
      if (component.user.id !== this.message.author.id) {
        const embed = client.embeds.permission(["ADMINISRATOR"]);
        return component.reply({ embeds: [embed], ephemeral: true });
      }

      clicked = true;
      if (component.customId == "Panel_Delete:Confirm") {
        tsettings.panels.delete(panel.id);
        const panels = tsettings.panels;

        client.db.tickets.set(confirmMsg.guild.id, panels, "panels");
        const embed = client.embeds.success(this.command.option.delete, `Deleted the \`${panel.name}\` panel.`);
        await component.update({ embeds: [embed] });

        try {
          let panelChannel = await client.channels.fetch(panel.channel) as Discord.TextChannel;
          let panelMsg = panelChannel ? await panelChannel.messages.fetch(panel.msg) : null;
          if (panelMsg) panelMsg.delete();
        } catch (e) {
          
        }

      } else {
        const embed = client.embeds.success(this.command.option.delete, `Cancelled the panel deletetion.`);
        await component.update({ embeds: [embed] });
      }

      confirmMsg.delete();
      collector.stop();
    })

    collector.on("end", async () => {
      if (!clicked) {
        const embed = client.embeds.inactivity(this.command.option.delete);
        await confirmMsg.channel.send({ embeds: [embed] });
        confirmMsg.delete();
      }
    })
  }

  async resetSettings(msg) {
    const filter = () => true;
    const collector = msg.createMessageComponentCollector({ filter, idle: 60 * 1000 });
    const channel = msg.channel;
    const guildId = msg.guild.id;
    
    const option = this.command.option.reset;
    let clicked = false;

    collector.on("collect", async (int) => {
      if (int.member.id !== this.message.author.id) {
        const embed = client.embeds.notComponent();
        return int.reply({ embeds: [embed], ephemeral: true });
      }

      if (int.customId == "Settings_Reset:Confirm") {
        client.db.settings.delete(guildId);
        const embed = client.embeds.success(option, `Reset this server's settings.`);
        await int.reply({ embeds: [embed] });
        msg.delete();

      } else {
        const embed = client.embeds.success(option, `Cancelled the prompt.`);
        await int.reply({ embeds: [embed] });
        msg.delete();
      }

      clicked = true;
    });

    collector.on("end", async () => {
      if (clicked) return;
      const embed = client.embeds.inactivity(this.command);
      channel.send({ embeds: [embed] });
    });
  }
}