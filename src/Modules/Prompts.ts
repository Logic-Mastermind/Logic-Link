import Discord from "discord.js";
import client from "../index";
import Types from "../types";

interface collectorOptions {
  botMessage?: Discord.Message,
  userMessage?: Discord.Message,
  channel?: Discord.TextChannel,
  command?: Types.commandData
}

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
  constructor(options: collectorOptions) {
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
  setOptions(options: collectorOptions) {
    this.botMessage ||= options.botMessage;
    this.userMessage ||= options.userMessage;
    this.channel ||= options.channel;
    this.command ||= options.command;
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
  async startMessageCollector(options: Types.messageCollectorOptions) {
    const channel = this.userMessage.channel || this.botMessage.channel || this.channel;
    const collector = channel.createMessageCollector(options.collectorOptions);
    const user = this.userMessage.author;

    let attempts = [];
    let lastMessage: Discord.Message;
    let current = 0;

    const startMsg = await channel.send({ embeds: [options.promptData.startEmbed] });
    client.functions.sleep(1000);

    await startMsg.edit({ embeds: [options.promptData.embeds[0]] });
    lastMessage = startMsg;

    if (client.tempUsers.has(user.id)) {
      const channelsArray: string[] = client.tempUsers.get(user.id, "promptChannels");
      channelsArray.push(channel.id);
      client.tempUsers.set(user.id, channelsArray, "promptChannels");

    } else {
      client.tempUsers.set(user.id, [channel.id], "promptChannels");
    }

    collector.on("collect", async (msg): Promise<any> => {
      if (msg.author.id !== user.id) return;
      if (options._collect) options._collect();

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
          current++;
        },
        embed: (type: "success" | "error", description: string, fields?: boolean | Types.fieldData[]) => {
          if (fields === true) {
            fields = [];
            fields.push({ name: "Original Question", value: question.question });
          }

          const embed = client.embeds[type](question.title, description, fields == false ? [] : fields);
          lastMessage.edit({ embeds: [embed] });
        },
        functions: {
          validateOption: (collected) => {
            const tsettings = client.functions.getTicketData(msg.guild);

            if (currentKey == "name") {
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
              
              collected[currentKey] = msg.content;
              args.embed("success", `Panel name has been set to: \`${collected.name}\`.`);
              args.next();
    
            } else if (currentKey == "opened" || currentKey == "closed") {
              let category = client.functions.findChannel(args.msgArgs.join(" "), msg.guild, {
                searchFilter: (c) => c.type == "GUILD_CATEGORY"
              });
    
              if (!category) {
                args.embed("error",  `I could not record any categories from your message, please try again.`, true);
                return 1;
              }
    
              if (!category.permissionsFor(msg.guild.me).has("MANAGE_CHANNELS")) {
                args.embed("error", `I do not have the \`MANAGE_CHANNELS\` permission in this category, please try again.`, true);
                return 1;
              }
    
              collected[currentKey] = category.id;
              args.embed("success", `Panel ${args.current == 1 ? "opened" : "closed"} category has been set to: \`#${category.name}\`.`);
              args.next();
    
            } else if (currentKey == "claiming") {
              let option = null;
              if (msg.content.includes("yes") || msg.content.includes("on")) option = true;
              if (msg.content.includes("no") || msg.content.includes("off")) option = false;
    
              if (option == null) {
                args.embed("error", `An invalid option was recieved, please type \`on\` or \`off\`.`, true);
                return 1;
              }
              
              collected[currentKey] = option;
              args.embed("success", `Ticket claiming in this panel has been turned \`${option ? `on` : `off`}\`.`);
              args.next();
    
            } else if (currentKey == "support" || currentKey == "additional") {
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
    
              collected[currentKey] = roles;
              args.embed("success", `I have collected \`${roles.length}\` role${roles.length == 1 ? `` : `s`} from your message.`, [{
                name: "Roles",
                value: `<@&${roles.join(">\n<@&")}>`
              }]);
              args.next();
    
            } else if (currentKey == "channel") {
              let channel = msg.mentions.channels.first() as Types.guildChannel;
              if (!channel) channel = client.functions.findChannel(args.msgArgs.join(" "), msg.guild, {
                searchFilter: (c) => c.isText()
              });
    
              if (!channel) {
                args.embed("error", `I could not record any text channels from your message, please try again.`, true);
                return 1;
              }
    
              if (!channel.permissionsFor(msg.guild.me).has("SEND_MESSAGES")) {
                args.embed("error", `I do not have the \`SEND_MESSAGES\` permission in this channel, please try again.`, true);
                return 1;
              }
    
              collected[currentKey] = channel.id;
              args.embed("success", `Panel channel has been set to: <#${channel.id}>.`);
              
              if ((current + 1) == options.promptData.embeds.length) return 0;
              else args.next();

            } else if (currentKey == "ticketFormat" || currentKey == "claimedFormat") {

            }
          }
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
      if (options._end) options._end();

      if (client.tempUsers.has(user.id)) {
        const channelsArray: string[] = client.tempUsers.get(user.id, "promptChannels");
        channelsArray.filter((g) => g !== this.userMessage.guildId);
        client.tempUsers.set(user.id, channelsArray || [], "promptChannels");
      }

      const currentKey = Object.keys(options.promptData.info)[current];
      const question = options.promptData.info[currentKey];

      const args = {
        collector,
        lastMessage,
        question
      }

      if (result == "cancelled") {
        const embed = client.embeds.success(this.command, `This prompt has been cancelled.`);
        this.userMessage.channel.send({ embeds: [embed] });

      } else if (result == "stopped") {
        const embed = client.embeds.error(this.command.option.new, `This prompt has been stopped, please try again.`);
        this.userMessage.channel.send({ embeds: [embed] });

      } else if (result == "finished") {
        options.end(collected, result, args);

      } else {
        const embed = client.embeds.inactivity(this.command);
        const embed1 = client.embeds.warn(question.title, `This question has stopped looking for responses.`);

        this.userMessage.channel.send({ embeds: [embed] });
        lastMessage.edit({ embeds: [embed1] });
      }
    });
  }
}

/**
 * A class with methods that run specific prompts.
 * @class Prompts
 */
 export default class Prompts {
  userMessage: Discord.Message;
  command: Types.commandData;
  user: Discord.User;

  collector = Collector;
  filter = () => true;
  messageFilter = (m) => m.author.id == this.user.id;

  /**
   * Used to set class properties.
   * @constructor
   * @param {Object} options - Constructor options.
   * @param {Discord.Message} options.message - The message the user sent.
   * @param {Types.commandData} options.command - The command the user ran.
   * @param {Discord.User} options.user - The user.
   */
  constructor(options: { userMessage: Discord.Message, command: Types.commandData, user: Discord.User }) {
    this.userMessage = options.userMessage;
    this.command = options.command;
    this.user = options.user;
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

    const msg = await this.userMessage.reply({ embeds: [embed], components: [row] });
    const collector = msg.createMessageComponentCollector({ filter, idle: 90 * 1000 });

    collector.on("collect", async (int) => {
      if (int.user.id !== this.user.id) {
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
      if (int.user.id !== this.user.id) {
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
   * Creates a new ticket panel in a guild.
   * @async
   * @function newPanel
   * @param {Discord.Guild} guild - The guild to create the panel in.
   * @returns {Promise<void>}
   */
  async newPanel(guild: Discord.Guild) {
    if (client.tempGuild.get(guild.id)?.panelSetup === true) {
      const embed = client.embeds.error(this.command.option.new, `A panel is already being created in this server.`);
      return this.userMessage.reply({ embeds: [embed] });
    }

    const info = client.util.promptData.panel;
    delete info.ticketFormat;
    delete info.claimedFormat;

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

    let collected = {} as Types.panelData;
    client.tempGuild.set(guild.id, true, "panelSetup");

    const tsettings = client.functions.getTicketData(guild);
    const startEmbed = client.embeds.green(this.command.option.new, `${client.util.emojis.pending} Starting the panel setup prompt.`, [{
      name: "Additional Info",
      value: `You are limited to 5 attempts per question.\nType \`cancel\` to cancel the prompt.`
    }]);

    const prompt = new this.collector({
      userMessage: this.userMessage,
      command: this.command
    });

    prompt.startMessageCollector({
      collectorOptions: {
        filter: this.messageFilter,
        idle: 60_000
      },
      promptData: {
        info,
        embeds,
        startEmbed
      },
      collect: (msg, args) => {
        return args.functions.validateOption(collected)
      },
      end: async () => {
        let categoryOpened = this.userMessage.guild.channels.cache.get(collected.opened);
        let categoryClosed = this.userMessage.guild.channels.cache.get(collected.closed);

        const fields = [
          {
            name: `General Configuration`,
            value: `${client.util.emojis.text} Name: \`${collected.name}\`\n${client.util.emojis.category} Opened Category: \`#${categoryOpened.name}\`\n${client.util.emojis.category} Closed Category: \`#${categoryClosed.name}\`\n${client.util.emojis.override} Claiming: \`${collected.claiming ? `On` : `Off`}\`\n${client.util.emojis.channel} Panel Channel: <#${collected.channel}>\n\u200b`,
          },
          {
            name: `Role Configuration`,
            value: `${client.util.emojis.roleIcon} Support Roles:\n<@&${collected.support.join(">\n<@&")}>${collected.additional ? `\n\n${client.util.emojis.roleIcon} Additional Roles:\n<@&${collected.additional.join(">\n<@&")}>` : ``}`
          }
        ];

        const confirmBtn = client.components.button({ label: "Confirm", style: "SUCCESS", id: "Panel_Config:Confirm" });
        const cancelBtn = client.components.button({ label: "Cancel", style: "DANGER", id: "Panel_Config:Cancel" });
        const row = client.components.actionRow(confirmBtn, cancelBtn);

        const embed = client.embeds.green(this.command.option.new, `This prompt has been completed.\nClick on a button below to confirm or cancel the configuration.\n\u200b`, fields);
        
        const confirmMsg = await this.userMessage.channel.send({ embeds: [embed], components: [row] });
        const confirmCollector = confirmMsg.createMessageComponentCollector({ filter: this.filter, time: 60_000 });

        confirmCollector.on("collect", async (int) => {
          if (int.user.id !== this.user.id) {
            const embed = client.embeds.notComponent();
            return int.reply({ embeds: [embed], ephemeral: true });
          }

          if (int.customId.endsWith("Confirm")) {
            const panels = tsettings.panels;
            const panelId = panels.last()?.id || 1;
            
            const data: Types.panelData = {
              name: collected.name,
              opened: collected.opened,
              closed: collected.closed,
              claiming: collected.claiming,
              support: collected.support,
              additional: collected.additional,
              channel: collected.channel,
              
              createdAt: Date.now(),
              createdBy: this.user.id,
              tickets: new Discord.Collection(),
              totalTicketCount: 0,
              ticketLimit: 1,
              
              claimedName: `claimed-[number]`,
              ticketName: `ticket-[number]`,
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
            
            const embed = client.embeds.success(this.command, `Created a new panel with the name: \`${collected.name}\`.`, fields);
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
          if (reason == "clicked") return;

          const embed = client.embeds.inactivity(this.command);
          this.userMessage.channel.send({ embeds: [embed] });
          confirmMsg.delete();
        });
      },
      _end: () => client.tempGuild.set(guild.id, false, "panelSetup"),
    });
  }

  /**
   * Modifies a specific ticket panel in a guild
   * @async
   * @function modifyPanel
   * @param {Discord.Message} botMessage - The message sent from the command.
   * @param {number} panelId - The panel to modify.
   * @returns {Promise<void>}
   */
  async modifyPanel(botMessage: Discord.Message, panelId: number) {
    const guild = botMessage.guild;
    const componentCollector = botMessage.createMessageComponentCollector({ filter: this.filter, time: 60_000 });
    const constantInfo = client.util.promptData.panel;

    componentCollector.on("collect", async (int: Discord.SelectMenuInteraction) => {
      if (this.user.id !== int.user.id) {
        const embed = client.embeds.notComponent();
        return int.reply({ embeds: [embed], ephemeral: true });
      }
      
      let collected = {} as Types.panelData;
      const embeds = [];
      const info = {};
      const tsettings = client.functions.getTicketData(guild);

      for await (const option of int.values) {
        const embed = client.embeds.question(info[option].title, info[option].question, [{
          name: "Details",
          value: info[option].description
        }]);

        embeds.push(embed);
        info[option] = constantInfo[option];
      }

      const startEmbed = client.embeds.green(this.command.option.modify, `${client.util.emojis.pending} Starting the panel modify prompt.`, [{
        name: "Additional Info",
        value: `You are limited to 5 attempts per question.\nType \`cancel\` to cancel the prompt.`
      }]);

      const prompt = new this.collector({
        userMessage: this.userMessage,
        command: this.command
      });

      prompt.startMessageCollector({
        collectorOptions: {
          filter: this.messageFilter
        },
        promptData: {
          info,
          embeds,
          startEmbed
        },
        collect: (msg, args) => {
          return args.functions.validateOption(collected);
        },
        end: async () => {
          let panelInfo = tsettings.panels.get(panelId);
          let categoryOpened = this.userMessage.guild.channels.cache.get(panelInfo.opened);
          let categoryClosed = this.userMessage.guild.channels.cache.get(panelInfo.closed);
    
          for (const [key, val] of Object.entries(collected)) {
            panelInfo[key] = val;
          }
    
          const fields = [
            {
              name: `General Configuration`,
              value: `${collected.name ? `${client.util.emojis.dash}` : ``} ${client.util.emojis.text} Name: \`${panelInfo.name}\`\n${collected.opened ? `${client.util.emojis.dash}` : ``} ${client.util.emojis.category} Opened Category: \`#${categoryOpened.name}\`\n${collected.closed ? `${client.util.emojis.dash}` : ``} ${client.util.emojis.category} Closed Category: \`#${categoryClosed.name}\`\n${collected.ticketName ? `${client.util.emojis.dash}` : ``} ${client.util.emojis.message} Ticket Format: \`${panelInfo.ticketName}\`\n${panelInfo.claiming ? `${collected.claiming ? `${client.util.emojis.dash}` : ``} ${client.util.emojis.message} Claimed Format: \`${panelInfo.claimedName}\n` : ``}\`${collected.claiming ? `${client.util.emojis.dash}` : ``} ${client.util.emojis.override} Claiming: \`${panelInfo.claiming ? `On` : `Off`}\`\n${collected.channel ? `${client.util.emojis.dash}` : ``} ${client.util.emojis.channel} Panel Channel: <#${panelInfo.channel}>\n\u200b`
            },
            {
              name: `Role Configuration`,
              value: `${collected.support ? `${client.util.emojis.dash}` : ``} ${client.util.emojis.roleIcon} Support Roles:\n<@&${panelInfo.support.join(">\n<@&")}>${panelInfo.additional ? `\n\n${collected.additional ? `${client.util.emojis.dash}` : ``} ${client.util.emojis.roleIcon} Additional Roles:\n<@&${panelInfo.additional.join(">\n<@&")}>` : ``}`
            }
          ];
    
          const confirmBtn = client.components.button({ label: "Confirm", style: "SUCCESS", id: "Panel_Config:Confirm" });
          const cancelBtn = client.components.button({ label: "Cancel", style: "DANGER", id: "Panel_Config:Cancel" });
          const row = client.components.actionRow(confirmBtn, cancelBtn);
    
          const embed = client.embeds.green(this.command.option.new, `This prompt has been completed.\nClick on a button below to confirm or cancel the configuration.\n\u200b`, fields);
    
          const confirmMsg = await this.userMessage.channel.send({ embeds: [embed], components: [row] });
          const confirmCollector = confirmMsg.createMessageComponentCollector({ filter: this.filter, idle: 60_000 });
    
          confirmCollector.on("collect", async (component) => {
            if (component.user.id !== this.user.id) {
              const embed = client.embeds.permission("ADMINISTRATOR");
              return component.reply({ embeds: [embed], ephemeral: true });
            }
    
            if (component.customId == "Panel_Config:Confirm") {
              const panels = tsettings.panels;
              panels.set(panelId, panelInfo);
    
              client.db.tickets.set(this.userMessage.guild.id, panels, "panels");
              await client.schemas.sendPanel(panelId, guild.id, collected.channel);
    
              const embed = client.embeds.success(this.command.option.modify, `Successfully modified the \`${panelInfo.name}\` panel.`);
              await component.reply({ embeds: [embed] });
              
            } else {
              const embed = client.embeds.success(this.command.option.new, `Cancelled the panel modify prompt.`);
              await component.reply({ embeds: [embed] });
            }

            confirmMsg.delete();
            confirmCollector.stop("clicked");
          });
    
          confirmCollector.on("end", async (_, reason) => {
            componentCollector.stop("finished")
            if (reason == "clicked") return;

            const embed = client.embeds.inactivity(this.command.option.new);
            await this.userMessage.channel.send({ embeds: [embed] });
          });
        }
      });
    });

    componentCollector.on("end", async (_, reason) => {
      if (reason == "finished") return;
      const embed = client.embeds.inactivity(this.command.option.modify);
      const embed1 = client.embeds.warn(this.command.option.modify, "");

      botMessage.channel.send({ embeds: [embed] });
      botMessage.edit({ embeds: [embed1] });
    });
  }

  // async deletePanel(confirmMsg, tsettings, panel) {
  //   const filter = () => true;
  //   const collector = confirmMsg.createMessageComponentCollector({ filter, idle: 60000 });
  //   let clicked = false;

  //   collector.on("collect", async (component) => {
  //     if (component.user.id !== this.user.id) {
  //       const embed = client.embeds.permission(["ADMINISRATOR"]);
  //       return component.reply({ embeds: [embed], ephemeral: true });
  //     }

  //     clicked = true;
  //     if (component.customId == "Panel_Delete:Confirm") {
  //       tsettings.panels.delete(panel.id);
  //       const panels = tsettings.panels;

  //       client.db.tickets.set(confirmMsg.guild.id, panels, "panels");
  //       const embed = client.embeds.success(this.command.option.delete, `Deleted the \`${panel.name}\` panel.`);
  //       await component.update({ embeds: [embed] });

  //       try {
  //         let panelChannel = await client.channels.fetch(panel.channel) as Discord.TextChannel;
  //         let panelMsg = panelChannel ? await panelChannel.messages.fetch(panel.msg) : null;
  //         if (panelMsg) panelMsg.delete();
  //       } catch (e) {
          
  //       }

  //     } else {
  //       const embed = client.embeds.success(this.command.option.delete, `Cancelled the panel deletetion.`);
  //       await component.update({ embeds: [embed] });
  //     }

  //     confirmMsg.delete();
  //     collector.stop();
  //   })

  //   collector.on("end", async () => {
  //     if (!clicked) {
  //       const embed = client.embeds.inactivity(this.command.option.delete);
  //       await confirmMsg.channel.send({ embeds: [embed] });
  //       confirmMsg.delete();
  //     }
  //   })
  // }

  // async resetSettings(msg) {
  //   const filter = () => true;
  //   const collector = msg.createMessageComponentCollector({ filter, idle: 60 * 1000 });
  //   const channel = msg.channel;
  //   const guildId = msg.guild.id;
    
  //   const option = this.command.option.reset;
  //   let clicked = false;

  //   collector.on("collect", async (int) => {
  //     if (int.member.id !== this.user.id) {
  //       const embed = client.embeds.notComponent();
  //       return int.reply({ embeds: [embed], ephemeral: true });
  //     }

  //     if (int.customId == "Settings_Reset:Confirm") {
  //       client.db.settings.delete(guildId);
  //       const embed = client.embeds.success(option, `Reset this server's settings.`);
  //       await int.reply({ embeds: [embed] });
  //       msg.delete();

  //     } else {
  //       const embed = client.embeds.success(option, `Cancelled the prompt.`);
  //       await int.reply({ embeds: [embed] });
  //       msg.delete();
  //     }

  //     clicked = true;
  //   });

  //   collector.on("end", async () => {
  //     if (clicked) return;
  //     const embed = client.embeds.inactivity(this.command);
  //     channel.send({ embeds: [embed] });
  //   });
  // }
}