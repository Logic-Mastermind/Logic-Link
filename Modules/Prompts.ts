import Discord from "discord.js";
import client from "../index";
import Types from "../Typings/types";
const code = "```";

/**
 * A class with methods that run specific prompts.
 * @class Prompts
 */
 export default class Prompts {
  client: Discord.Client;
  message: Discord.Message;
  command: Types.commandData;

  /**
   * Used to set class properties.
   * @constructor
   * @param {Discord.Message} message - The message.
   * @param {Types.commandData} command - The command.
   */
  constructor(message: Discord.Message, command: Types.commandData) {
    this.message = message;
    this.command = command;
  }

  /**
   * Creates a new prompt instance.
   * @param {Discord.Message} message - The message that started the prompt.
   * @param {Types.commandData} command - The command that ran the prompt.
   * @returns {Prompts} The new Prompts instance.
   */
  static new(message: Discord.Message, command: Types.commandData): Prompts {
    return new this(message, command);
  }

  /**
   * Sends a button prompt asking whether the user agrees to the delete command terms.
   * @async
   * @function deleteConfirmation
   * @return {Promise<void>}
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
        client.db.first.set(int.user.id, false, "deleteCmd");
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

//   /**
//    * Controls the help embed message component prompts.
//    * @async
//    * @function helpMenu
//    * @param obj 
//    */
//   async helpMenu(obj) {
//     const filter = () => true;
//     const collector = msg.createMessageComponentCollector({ filter, idle: 60 * 1000 });
//     const original = msg.embeds[0];
//     const select = msg.components[0].components[0];

//     const backBtn = client.components.button({ label: "Back", style: "SECONDARY", id: "Help_Menu:Back" });
//     const btnRow = client.components.actionRow(backBtn);
//     const selectRow = client.components.actionRow(select);

//     collector.on("collect", async (int) => {
//       if (int.member.id !== message.author.id) {
//         const embed = client.embeds.notComponent();
//         return int.reply({ embeds: [embed], ephemeral: true });
//       }

//       if (int.componentType == "BUTTON") {
//         return int.update({ embeds: [original], components: [selectRow] });
//       }

//       switch (int.values[0]) {
//         case "Help_Menu:General":
//         {
//           const helpEmbed = client.embeds.helpCategory("General", obj.gen, obj.prefix);
//           await int.update({ embeds: [helpEmbed], components: [btnRow] });
//           break;
//         }
//         case "Help_Menu:Moderator":
//         {
//           const helpEmbed = client.embeds.helpCategory("Moderator", obj.mod, obj.prefix);
//           await int.update({ embeds: [helpEmbed], components: [btnRow] });
//           break;
//         }
//         case "Help_Menu:Administrator":
//         {
//           const helpEmbed = client.embeds.helpCategory("Administrator", obj.admin, obj.prefix);
//           await int.update({ embeds: [helpEmbed], components: [btnRow] });
//           break;
//         }
//         case "Help_Menu:Ticket":
//         {
//           const helpEmbed = client.embeds.helpCategory("Ticket", obj.tck, obj.prefix, obj.sup, obj.noPanel);
//           await int.update({ embeds: [helpEmbed], components: [btnRow] });
//           break;
//         }
//         case "Help_Menu:Support":
//         {
//           const helpEmbed = client.embeds.helpCategory("Support", obj.support, obj.prefix);
//           await int.update({ embeds: [helpEmbed], components: [btnRow] });
//           break;
//         }
//         case "Help_Menu:Developer":
//         {
//           const helpEmbed = client.embeds.helpCategory("Developer", obj.dev, obj.prefix);
//           await int.update({ embeds: [helpEmbed], components: [btnRow] });
//           break;
//         }
//       }
//     });

//     collector.on("end", async () => {
//       msg.edit({ embeds: [original], components: [client.buttons.actionRow([select.setDisabled()])] });
//     })
//   }

//   async bugReport(message, command) {
    
//     const clientMember = message.guild.me;
//     const prompt = {
//       description: `Please describe the bug in full detail.\nProvide images or videos if you can.`,
//       reproduction: `What are the steps that were taken to produce the bug?\nType out each step individually in a separate message.`,
//       expected: `What result was expected to happen?`,
//       actual: `What result actually happened?`
//     }

//     const title = {
//       description: `Bug Description`,
//       reproduction: `Reproduction Steps`,
//       expected: `Expected Results`,
//       actual: `Actual Results`
//     }

//     const startEmbed = client.embeds.pending(command, `Starting bug report prompt...`);
//     const embeds = [
//       client.embeds.blue(title.name, prompt.name),
//       client.embeds.blue(title.opened, prompt.opened),
//       client.embeds.blue(title.closed, prompt.closed),
//       client.embeds.blue(title.claiming, prompt.claiming),
//       client.embeds.blue(title.support, prompt.support),
//       client.embeds.blue(title.additional, prompt.additional),
//       client.embeds.blue(title.channel, prompt.channel)
//     ];

//     const filter = (m) => m.author.id == message.author.id;
//     const collector = message.channel.createMessageCollector({ filter, idle: 60 * 1000 });
//     const startMsg = await message.reply({ embeds: [startEmbed] });
//     startMsg.edit({ embeds: [embeds[0]] });

//     var current = 1;
//     var cancelled = false;
//     var finished = false;
//     var attempted = false;

//     var msgId = [
//       startMsg.id,
//       null,
//       null,
//       null,
//       null,
//       null,
//       null
//     ]

//     var collected = {};
//     client.db.userInfo.set(`${message.author.id}-${message.guild.id}`, true, "inPrompt");

//     collector.on("collect", async (msg) => {

//     })
//   }

//   async newPanel(settings, tsettings, message, command) {
    
//     const clientMember = message.guild.me;

//     if (settings.panelSetup) {
//       const embed = client.embeds.error(command.option.new, `A panel is already being created in this server.`);
//       return message.reply({ embeds: [embed] });
//     }

//     const prompt = {
//       name: [`What should be the name of this panel?`, `The name must be within 3 and 32 characters long.\nThe name must also be unique to other panels.`],
//       opened: [`Where would you like opened tickets to go?`, `Type the name or ID of a category you want to set this to.\nTickets will be moved here once they are opened.`],
//       closed: [`Where would you like closed tickets to go?`, `Type the name or ID of a category you want to set this to.\nTickets will be moved here once they are closed.`],
//       claiming: [`Would you like to enable or disable panel claiming? (\`on\` or \`off\`)`, `Type the option that you would like this to set to.\nWhen enabled, support team roles will be able to claim tickets.`],
//       support: [`What are some support roles that you would like for this panel?`, `Members with these roles will be able to view and manage support tickets.\nMention or type the names of those roles below.`],
//       additional: [`What are some additional roles that you would like for this panel?`, `By default, members with these roles will be able to view support tickets.\nMention or type the names of those roles below.`],
//       channel: [`Where would you like this panel to be sent to?`, `Mention or type the name of a channel for this setting.\nMake sure that I have the required permissions to send messages here.`]
//     }

//     const title = {
//       name: `Panel Name`,
//       opened: `Opened Category`,
//       closed: `Closed Category`,
//       claiming: `Ticket Claiming`,
//       support: `Support Roles`,
//       additional: `Additional Roles`,
//       channel: `Panel Channel`
//     }
    
//     const embeds = [
//       client.embeds.question(title.name, prompt.name[0], [{
//         name: "Details",
//         value: prompt.name[1],
//         inline: false
//       }]),
//       client.embeds.question(title.opened, prompt.opened[0], [{
//         name: "Details",
//         value: prompt.opened[1],
//         inline: false
//       }]),
//       client.embeds.question(title.closed, prompt.closed[0], [{
//         name: "Details",
//         value: prompt.closed[1],
//         inline: false
//       }]),
//       client.embeds.question(title.claiming, prompt.claiming[0], [{
//         name: "Details",
//         value: prompt.claiming[1],
//         inline: false
//       }]),
//       client.embeds.question(title.support, prompt.support[0], [{
//         name: "Details",
//         value: prompt.support[1],
//         inline: false
//       }]),
//       client.embeds.question(title.additional, prompt.additional[0], [{
//         name: "Details",
//         value: prompt.additional[1],
//         inline: false
//       }]),
//       client.embeds.question(title.channel, prompt.channel[0], [{
//         name: "Details",
//         value: prompt.channel[1],
//         inline: false
//       }])
//     ];

//     const filter = (m) => m.author.id == message.author.id;
//     const collector = message.channel.createMessageCollector({ filter, idle: 60 * 1000 });
//     const startEmbed = client.embeds.green(command.option.new, `${client.util.pending} Starting the panel setup prompt.`, [{
//       name: "Additional Info",
//       value: `You are limited to 5 attempts per question.\nType \`cancel\` to cancel the prompt.`,
//       inline: false
//     }]);
//     const startMsg = await message.reply({ embeds: [startEmbed] });
//     await client.functions.sleep(800);
//     startMsg.edit({ embeds: [embeds[0]] });

//     var current = "name";
//     var currentNum = 1;
//     var cancelled = false;
//     var finished = false;
//     var attempted = false;

//     var msgId = [
//       startMsg.id,
//       null,
//       null,
//       null,
//       null,
//       null,
//       null
//     ]

//     var attempts = {
//       name: 0,
//       opened: 0,
//       closed: 0,
//       claiming: 0,
//       support: 0,
//       additional: 0,
//       channel: 0
//     }

//     var collected = {};
//     client.db.settings.set(message.guild.id, true, "panelSetup");
//     client.db.userInfo.set(`${message.author.id}-${message.guild.id}`, message.channel.id, "inPrompt");

//     collector.on("collect", async (msg) => {
//       const msgArgs = msg.content.split(/ +/g);
//       const editMsg = msg.channel.messages.cache.get(msgId[currentNum - 1]);
//       const originalQuestion = [{ name: "Original Question", value: `${prompt[current][0]}\n\n${prompt[current][1]}`, inline: false }];
//       const currentAttempt = ++attempts[current];

//       if (currentAttempt >= 5) {
//         const embed = client.embeds.error(title[current], `You have attempted this question too many times.`);
//         editMsg.edit({ embeds: [embed] });

//         attempted = true;
//         return collector.stop();
//       }

//       if (client.util.skipAliases.includes(msg.content.toLowerCase())) {
//         const embed = client.embeds.error(title[current], `Skipping is disallowed in this prompt, please try again.`, [{ name: "Original Question", value: prompt[current], inline: false }]);
//         return editMsg.edit({ embeds: [embed] });

//       } else if (client.util.cancelAliases.includes(msg.content.toLowerCase())) {
//         const embed = client.embeds.error(title[current], `This question has stopped looking for responses.`);
//         editMsg.edit({ embeds: [embed] });

//         cancelled = true;
//         return collector.stop();
//       }

//       // -------------------------

//       if (current == "name") {
//         if (msg.content.length > 32) {
//           const embed = client.embeds.error(title[current], `This name is greater than 32 characters, please try again.`, originalQuestion);
//           return editMsg.edit({ embeds: [embed] });

//         } else if (msg.content.length < 3) {
//           const embed = client.embeds.error(title[current], `This name is less than 3 characters, please try again.`, originalQuestion);
//           return editMsg.edit({ embeds: [embed] });
//         }

//         var taken = null;
//         for (const pan of tsettings.panels.values()) {
//           if (pan.name == msg.content) {
//             taken = true;
//             break;
//           }
//         }

//         if (taken) {
//           const embed = client.embeds.error(title[current], `This name has already been used in another panel, please try again.`, originalQuestion);
//           return editMsg.edit({ embeds: [embed] });
//         }

//         collected[current] = msg.content;
//         const embed = client.embeds.success(title[current], `Panel name has been set to: \`${collected[current]}\`.`);
//         editMsg.edit({ embeds: [embed] });

//         current = "opened";
//         currentNum = 2;
//         client.functions.next(msg.channel, msgId, embeds, currentNum);

//       } else if (current == "opened") {
//         var category = await client.functions.findCategory(msgArgs.join(" "), msg.guild);
//         if (!category) {
//           const embed = client.embeds.error(title[current], `I could not record any categories from your message, please try again.`, originalQuestion);
//           return editMsg.edit({ embeds: [embed] });
//         }

//         if (!category.permissionsFor(clientMember).has("MANAGE_CHANNELS")) {
//           const embed = client.embeds.error(title[current], `I do not have the \`MANAGE_CHANNELS\` permission in this category, please try again.`, originalQuestion);
//           return editMsg.edit({ embeds: [embed] });
//         }

//         collected[current] = category.id;
//         const embed = client.embeds.success(title[current], `Panel opened category has been set to: \`#${category.name}\`.`);
//         editMsg.edit({ embeds: [embed] });

//         current = "closed";
//         currentNum = 3
//         client.functions.next(msg.channel, msgId, embeds, currentNum);

//       } else if (current == "closed") {
//         var category = await client.functions.findCategory(msgArgs.join(" "), msg.guild);
//         if (!category) {
//           const embed = client.embeds.error(title[current], `I could not record any categories from your message, please try again.`, originalQuestion);
//           return editMsg.edit({ embeds: [embed] });
//         }

//         if (!category.permissionsFor(clientMember).has("MANAGE_CHANNELS")) {
//           const embed = client.embeds.error(title[current], `I do not have the \`MANAGE_CHANNELS\` permission in this category, please try again.`, originalQuestion);
//           return editMsg.edit({ embeds: [embed] });
//         }

//         collected[current] = category.id;
//         const embed = client.embeds.success(title[current], `Panel closed category has been set to: \`#${category.name}\`.`);
//         editMsg.edit({ embeds: [embed] });

//         current = "claiming";
//         currentNum = 4;
//         client.functions.next(msg.channel, msgId, embeds, currentNum);
        
//       } else if (current == "claiming") {
//         var option = null;
//         if (msg.content.includes("yes") || msg.content.includes("on")) option = true;
//         if (msg.content.includes("no") || msg.content.includes("off")) option = false;

//         if (option == null) {
//           const embed = client.embeds.error(title[current], `An invalid option was recieved, please type \`on\` or \`off\`.`, originalQuestion);
//           return editMsg.edit({ embeds: [embed] });
//         }
        
//         collected[current] = option;
//         const embed = client.embeds.success(title[current], `Ticket claiming in this panel has been turned \`${option ? `on` : `off`}\`.`);
//         editMsg.edit({ embeds: [embed] });

//         current = "support";
//         currentNum = 5;
//         client.functions.next(msg.channel, msgId, embeds, currentNum);

//       } else if (current == "support") {
//         var roles = [];
//         var args = msgArgs.filter((v) => (!v.startsWith("<@&") || !v.startsWith("<@!")) && !v.endsWith(">"));
//         var mentions = msg.mentions.roles;

//         for (const array of mentions) {
//           roles.push(array[0]); // Role ID
//         }

//         for await (const arg of args) {
//           var role = await client.functions.findRole(arg, msg.guild);
//           if (role) roles.push(role.id);
//         }

//         roles = [...new Set(roles)];
//         if (roles.length < 1) {
//           const embed = client.embeds.error(title[current], `I could not record any roles from your message, please try again.`, originalQuestion);
//           return editMsg.edit({ embeds: [embed] });
//         }

//         collected[current] = roles;
//         const embed = client.embeds.success(title[current], `I have collected \`${roles.length}\` role${roles.length == 1 ? `` : `s`} from your message.`, [{
//           name: "Roles",
//           value: `<@&${roles.join(">\n<@&")}>`,
//           inline: false
//         }]);
//         editMsg.edit({ embeds: [embed] });

//         current = "additional";
//         currentNum = 6;
//         client.functions.next(msg.channel, msgId, embeds, currentNum);

//       } else if (current == "additional") {
//         var roles = [];
//         var args = msgArgs.filter((v) => (!v.startsWith("<@&") || !v.startsWith("<@!")) && !v.endsWith(">"));
//         var mentions = msg.mentions.roles;

//         for (const array of mentions) {
//           roles.push(array[0]); // Role ID
//         }

//         for await (const arg of args) {
//           var role = await client.functions.findRole(arg, msg.guild);
//           if (role) roles.push(role.id);
//         }

//         roles = [...new Set(roles)];
//         if (roles.length < 1) {
//           const embed = client.embeds.error(title[current], `I could not record any roles from your message, please try again.`, originalQuestion);
//           return editMsg.edit({ embeds: [embed] });
//         }

//         collected[current] = roles;
//         const embed = client.embeds.success(title[current], `I have collected \`${roles.length}\` role${roles.length == 1 ? `` : `s`} from your message.`, [{
//           name: "Roles",
//           value: `<@&${roles.join(">\n<@&")}>`,
//           inline: false
//         }]);
//         editMsg.edit({ embeds: [embed] });

//         current = "channel";
//         currentNum = 7;
//         client.functions.next(msg.channel, msgId, embeds, currentNum);

//       } else if (current == "channel") {
//         var channel = msg.mentions.channels.first();
//         if (!channel) channel = await client.functions.findChannel(msgArgs.join(" "), msg.guild);

//         if (!channel) {
//           const embed = client.embeds.error(title[current], `I could not record any channels from your message, please try again.`, originalQuestion);
//           return editMsg.edit({ embeds: [embed] });
//         }

//         if (!channel.isText()) {
//           const embed = client.embeds.error(title[current], `<#${channel.id}> is not a text channel, please try again.`, originalQuestion);
//           return editMsg.edit({ embeds: [embed] });
//         }

//         if (!channel.permissionsFor(clientMember).has("SEND_MESSAGES")) {
//           const embed = client.embeds.error(title[current], `I do not have the \`SEND_MESSAGES\` permission in this channel, please try again.`, originalQuestion);
//           return editMsg.edit({ embeds: [embed] });
//         }

//         collected[current] = channel.id;
//         const embed = client.embeds.success(title[current], `Panel channel has been set to: <#${channel.id}>.`);
//         editMsg.edit({ embeds: [embed] });

//         finished = true;
//         collector.stop();
//       }
//     });

//     collector.on("end", async () => {
//       client.db.settings.set(message.guild.id, false, "panelSetup");
//       client.db.userInfo.set(`${message.author.id}-${message.guild.id}`, null, "inPrompt");

//       if (finished) {
//         var categoryOpened = message.guild.channels.cache.get(collected.opened);
//         var categoryClosed = message.guild.channels.cache.get(collected.closed);

//         const fields = [
//           { name: `General Configuration`, value: `${client.util.text} Name: \`${collected.name}\`\n${client.util.category} Opened Category: \`#${categoryOpened.name}\`\n${client.util.category} Closed Category: \`#${categoryClosed.name}\`\n${client.util.override} Claiming: \`${collected.claiming ? `On` : `Off`}\`\n${client.util.channel} Panel Channel: <#${collected.channel}>\n\u200b`, inline: false },
//           { name: `Role Configuration`, value: `${client.util.moderator} Support Roles:\n<@&${collected.support.join(">\n<@&")}>${collected.additional ? `\n\n${client.util.moderator} Additional Roles:\n<@&${collected.additional.join(">\n<@&")}>` : ``}` }
//         ];

//         const confirmBtn = client.buttons.confirm("Panel_Config:Confirm");
//         const cancelBtn = client.buttons.cancel("Panel_Config:Cancel");
//         const row = client.buttons.actionRow([confirmBtn, cancelBtn]);
//         const btnFilter = () => true;
//         var clicked = false;

//         const embed = client.embeds.green(command.option.new, `This prompt has been completed.\nClick on a button below to confirm or cancel the configuration.\n\u200b`, fields);

//         const confirmMsg = await message.channel.send({ embeds: [embed], components: [row] });
//         const confirmCollector = confirmMsg.createMessageComponentCollector({ filter: btnFilter, idle: 60 * 1000 });

//         confirmCollector.on("collect", async (component) => {
//           if (component.user.id !== message.author.id) {
//             const embed = client.embeds.notComponent();
//             return component.reply({ embeds: [embed], ephemeral: true });
//           }

//           if (component.customId == "Panel_Config:Confirm") {
//             const newCount = tsettings.panels.last() ? tsettings.panels.last().id + 1 : 1;
//             const panels = tsettings.panels;

//             collected.createdAt = Date.now();
//             collected.createdBy = message.author.id;
//             collected.tickets = new Discord.Collection();
//             collected.totalTicketCount = 0;
//             collected.ticketLimit = 1;
//             collected.claimed = `claimed-[number]`;
//             collected.ticket = `ticket-[number]`;
//             collected.panelMessage = null;
//             collected.ticketMessage = null;
//             collected.id = newCount;
            
//             panels.set(newCount, collected);
//             client.db.panels.set(message.guild.id, panels, "panels");
//             const result = await client.schemas.sendPanel(collected, tsettings, message.guild.id);
//             const fields1 = [];

//             if (!result) fields1.push({ name: "Status", value: "An error has occured sending the panel message.", inline: false });

//             const embed = client.embeds.success(command.option.new, `Created a new panel with the name: \`${collected.name}\`.`);
//             await component.reply({ embeds: [embed] });

//             clicked = true;
//             confirmMsg.delete();
//             confirmCollector.stop();

//           } else {
//             const embed = client.embeds.success(command.option.new, `Cancelled the panel setup prompt.`);
//             await component.reply({ embeds: [embed] });

//             clicked = true;
//             confirmMsg.delete();
//             confirmCollector.stop();
//           }
//         });

//         confirmCollector.on("end", async () => {
//           if (!clicked) {
//             const embed = client.embeds.inactivity(command.option.new);
//             await message.channel.send({ embeds: [embed] });
//             confirmMsg.delete();
//           }
//         });

//       } else if (cancelled) {
//         const embed = client.embeds.success(command.option.new, `This prompt has been cancelled.`);
//         message.channel.send({ embeds: [embed] });

//       } else if (attempted) {
//         const embed = client.embeds.error(command.option.new, `This prompt has been stopped.`);
//         message.channel.send({ embeds: [embed] });

//       } else {
//         const embed = client.embeds.inactivity(command.option.new);
//         message.channel.send({ embeds: [embed] });

//         const editMsg = message.channel.messages.cache.get(msgId[currentNum - 1]);
//         const embed1 = client.embeds.warn(title[current], `This question has stopped looking for responses.`);
//         editMsg.edit({ embeds: [embed1] });
//       }
//     });
//   }

//   async modifyPanel(command, message, msg, id, tsettings) {
    
//     const clientMember = message.guild.me;
//     const filter = () => true;
//     var clicked1 = false;
//     const collector1 = msg.createMessageComponentCollector({ filter, idle: 60000 });

//     collector1.on("collect", async (component) => {
//       if (message.author.id !== component.user.id) {
//         const embed = client.embeds.notComponent();
//         return component.reply({ embeds: [embed], ephemeral: true });
//       }

//       msg.delete();
//       clicked1 = true;

//       const prompt = {
//         name: [`What should be the name of this panel?`, `The name must be within 3 and 32 characters long.\nThe name must also be unique to other panels.`],
//         opened: [`Where would you like opened tickets to go?`, `Type the name or ID of a category you want to set this to.\nTickets will be moved here once they are opened.`],
//         closed: [`Where would you like closed tickets to go?`, `Type the name or ID of a category you want to set this to.\nTickets will be moved here once they are closed.`],
//         claiming: [`Would you like to enable or disable panel claiming? (\`on\` or \`off\`)`, `Type the option that you would like this to set to.\nWhen enabled, support team roles will be able to claim tickets.`],
//         support: [`What are some support roles that you would like for this panel?`, `Members with these roles will be able to view and manage support tickets.\nMention or type the names of those roles below.`],
//         additional: [`What are some additional roles that you would like for this panel?`, `By default, members with these roles will be able to view support tickets.\nMention or type the names of those roles below.`],
//         channel: [`Where would you like this panel to be sent to?`, `Mention or type the name of a channel for this setting.\nMake sure that I have the required permissions to send messages here.`],
//         ticket: [`What format should ticket names follow?`, `The format must be within 3 and 32 characters long.\nText that includes \`[number]\` will be replaced with the current ticket number.`],
//         claimed: [`What format should claimed ticket names follow?`, `The format must be within 3 and 32 characters long.\nText that includes \`[number]\` will be replaced with the current ticket number.`]
//       }

//       const title = {
//         name: `Panel Name`,
//         opened: `Opened Category`,
//         closed: `Closed Category`,
//         claiming: `Ticket Claiming`,
//         support: `Support Roles`,
//         additional: `Additional Roles`,
//         channel: `Panel Channel`,
//         ticket: `Ticket Format`,
//         claimed: `Claimed Format`
//       }

//       const embeds = [];
//       const values = [];
//       var num = 0;

//       for await (const option of component.values) {
//         values.push({ name: option, number: ++num });

//         switch (option) {
//           case "name":
//           {
//             const embed = client.embeds.question(title.name, prompt.name[0], [{
//               name: "Details",
//               value: prompt.name[1],
//               inline: false
//             }]);
//             embeds.push(embed);
//             break;
//           }
//           case "opened":
//           {
//             const embed = client.embeds.question(title.opened, prompt.opened[0], [{
//               name: "Details",
//               value: prompt.opened[1],
//               inline: false
//             }]);
//             embeds.push(embed);
//             break;
//           }
//           case "closed":
//           {
//             const embed = client.embeds.question(title.closed, prompt.closed[0], [{
//               name: "Details",
//               value: prompt.closed[1],
//               inline: false
//             }]);
//             embeds.push(embed);
//             break;
//           }
//           case "claiming":
//           {
//             const embed = client.embeds.question(title.claiming, prompt.claiming[0], [{
//               name: "Details",
//               value: prompt.claiming[1],
//               inline: false
//             }]);
//             embeds.push(embed);
//             break;
//           }
//           case "channel":
//           {
//             const embed = client.embeds.question(title.channel, prompt.channel[0], [{
//               name: "Details",
//               value: prompt.channel[1],
//               inline: false
//             }]);
//             embeds.push(embed);
//             break;
//           }
//           case "support":
//           {
//             const embed = client.embeds.question(title.support, prompt.support[0], [{
//               name: "Details",
//               value: prompt.support[1],
//               inline: false
//             }]);
//             embeds.push(embed);
//             break;
//           }
//           case "additional":
//           {
//             const embed = client.embeds.question(title.additional, prompt.additional[0], [{
//               name: "Details",
//               value: prompt.additional[1],
//               inline: false
//             }]);
//             embeds.push(embed);
//             break;
//           }
//           case "ticket":
//           {
//             const embed = client.embeds.question(title.ticket, prompt.ticket[0], [{
//               name: "Details",
//               value: prompt.ticket[1],
//               inline: false
//             }]);
//             embeds.push(embed);
//             break;
//           }
//           case "claimed":
//           {
//             const embed = client.embeds.question(title.claimed, prompt.claimed[0], [{
//               name: "Details",
//               value: prompt.claimed[1],
//               inline: false
//             }]);
//             embeds.push(embed);
//             break;
//           }
//         }
//       }
      
//       const filter = (m) => m.author.id == message.author.id;
//       const collector = message.channel.createMessageCollector({ filter, idle: 60 * 1000 });
//       const startEmbed = client.embeds.green(command.option.modify, `${client.util.pending} Starting the panel modify prompt.`, [{
//         name: "Additional Info",
//         value: `You are limited to 5 attempts per question.\nType \`cancel\` to cancel the prompt.`,
//         inline: false
//       }]);
      
//       const startMsg = await message.reply({ embeds: [startEmbed] });
//       await client.functions.sleep(800);
//       startMsg.edit({ embeds: [embeds[0]] });

//       var current = values[0].name;
//       var currentNum = values[0].number;
//       var cancelled = false;
//       var finished = false;
//       var attempted = false;

//       var msgId = [
//         startMsg.id,
//         null,
//         null,
//         null,
//         null,
//         null,
//         null
//       ]

//       var attempts = {
//         name: 0,
//         opened: 0,
//         closed: 0,
//         claiming: 0,
//         support: 0,
//         additional: 0,
//         channel: 0,
//         ticket: 0,
//         claimed: 0
//       }

//       var collected = {};
//       client.db.userInfo.set(`${message.author.id}-${message.guild.id}`, message.channel.id, "inPrompt");

//       collector.on("collect", async (m) => {
//         const msgArgs = m.content.split(/ +/g);
//         const editMsg = m.channel.messages.cache.get(msgId[currentNum - 1]);
//         const originalQuestion = [{ name: "Original Question", value: `${prompt[current][0]}\n\n${prompt[current][1]}`, inline: false }];
//         const currentAttempt = ++attempts[current];

//         if (currentAttempt >= 5) {
//           const embed = client.embeds.error(title[current], `You have attempted this question too many times.`);
//           editMsg.edit({ embeds: [embed] });

//           attempted = true;
//           return collector.stop();
//         }

//         if (client.util.skipAliases.includes(m.content.toLowerCase())) {
//           const embed = client.embeds.error(title[current], `Skipping is disallowed in this prompt, please try again.`, [{ name: "Original Question", value: prompt[current], inline: false }]);
//           return editMsg.edit({ embeds: [embed] });

//         } else if (client.util.cancelAliases.includes(m.content.toLowerCase())) {
//           const embed = client.embeds.error(title[current], `This question has stopped looking for responses.`);
//           editMsg.edit({ embeds: [embed] });

//           cancelled = true;
//           return collector.stop();
//         }

//         // -------------------------

//         async function validateOption(value) {
//           if (value == "name") {
//             if (m.content.length > 32) {
//               const embed = client.embeds.error(title[current], `This name is greater than 32 characters, please try again.`, originalQuestion);
//               return editMsg.edit({ embeds: [embed] });

//             } else if (m.content.length < 3) {
//               const embed = client.embeds.error(title[current], `This name is less than 3 characters, please try again.`, originalQuestion);
//               return editMsg.edit({ embeds: [embed] });
//             }

//             var taken = null;
//             for (const pan of tsettings.panels.values()) {
//               if (pan.name == m.content) {
//                 taken = true;
//                 break;
//               }
//             }

//             if (taken) {
//               const embed = client.embeds.error(title[current], `This name has already been used in another panel, please try again.`, originalQuestion);
//               return editMsg.edit({ embeds: [embed] });
//             }

//             collected[current] = m.content;
//             const embed = client.embeds.success(title[current], `Panel name has been set to: \`${collected[current]}\`.`);
//             editMsg.edit({ embeds: [embed] });

//           } else if (value == "opened") {
//             var category = await client.functions.findCategory(msgArgs.join(" "), m.guild);
//             if (!category) {
//               const embed = client.embeds.error(title[current], `I could not record any categories from your message, please try again.`, originalQuestion);
//               return editMsg.edit({ embeds: [embed] });
//             }

//             if (!category.permissionsFor(clientMember).has("MANAGE_CHANNELS")) {
//               const embed = client.embeds.error(title[current], `I do not have the \`MANAGE_CHANNELS\` permission in this category, please try again.`, originalQuestion);
//               return editMsg.edit({ embeds: [embed] });
//             }

//             collected[current] = category.id;
//             const embed = client.embeds.success(title[current], `Panel opened category has been set to: \`#${category.name}\`.`);
//             editMsg.edit({ embeds: [embed] });

//           } else if (value == "closed") {
//             var category = await client.functions.findCategory(msgArgs.join(" "), m.guild);
//             if (!category) {
//               const embed = client.embeds.error(title[current], `I could not record any categories from your message, please try again.`, originalQuestion);
//               return editMsg.edit({ embeds: [embed] });
//             }

//             if (!category.permissionsFor(clientMember).has("MANAGE_CHANNELS")) {
//               const embed = client.embeds.error(title[current], `I do not have the \`MANAGE_CHANNELS\` permission in this category, please try again.`, originalQuestion);
//               return editMsg.edit({ embeds: [embed] });
//             }

//             collected[current] = category.id;
//             const embed = client.embeds.success(title[current], `Panel closed category has been set to: \`#${category.name}\`.`);
//             editMsg.edit({ embeds: [embed] });
            
//           } else if (value == "claiming") {
//             var option = null;
//             if (m.content.includes("yes") || m.content.includes("on")) option = true;
//             if (m.content.includes("no") || m.content.includes("off")) option = false;

//             if (option == null) {
//               const embed = client.embeds.error(title[current], `An invalid option was recieved, please type \`on\` or \`off\`.`, originalQuestion);
//               return editMsg.edit({ embeds: [embed] });
//             }
            
//             collected[current] = option;
//             const embed = client.embeds.success(title[current], `Ticket claiming in this panel has been turned \`${option ? `on` : `off`}\`.`);
//             editMsg.edit({ embeds: [embed] });

//           } else if (value == "support") {
//             var roles = [];
//             var args = msgArgs.filter((v) => (!v.startsWith("<@&") || !v.startsWith("<@!")) && !v.endsWith(">"));
//             var mentions = m.mentions.roles;

//             for (const array of mentions) {
//               roles.push(array[0]); // Role ID
//             }

//             for await (const arg of args) {
//               var role = await client.functions.findRole(arg, m.guild);
//               if (role) roles.push(role.id);
//             }

//             roles = [...new Set(roles)];
//             if (roles.length < 1) {
//               const embed = client.embeds.error(title[current], `I could not record any roles from your message, please try again.`, originalQuestion);
//               return editMsg.edit({ embeds: [embed] });
//             }

//             collected[current] = roles;
//             const embed = client.embeds.success(title[current], `I have collected \`${roles.length}\` role${roles.length == 1 ? `` : `s`} from your message.`, [{
//               name: "Roles",
//               value: `<@&${roles.join(">\n<@&")}>`,
//               inline: false
//             }]);
//             editMsg.edit({ embeds: [embed] });

//           } else if (value == "additional") {
//             var roles = [];
//             var args = msgArgs.filter((v) => (!v.startsWith("<@&") || !v.startsWith("<@!")) && !v.endsWith(">"));
//             var mentions = m.mentions.roles;

//             for (const array of mentions) {
//               roles.push(array[0]); // Role ID
//             }

//             for await (const arg of args) {
//               var role = await client.functions.findRole(arg, m.guild);
//               if (role) roles.push(role.id);
//             }

//             roles = [...new Set(roles)];
//             if (roles.length < 1) {
//               const embed = client.embeds.error(title[current], `I could not record any roles from your message, please try again.`, originalQuestion);
//               return editMsg.edit({ embeds: [embed] });
//             }

//             collected[current] = roles;
//             const embed = client.embeds.success(title[current], `I have collected \`${roles.length}\` role${roles.length == 1 ? `` : `s`} from your message.`, [{
//               name: "Roles",
//               value: `<@&${roles.join(">\n<@&")}>`,
//               inline: false
//             }]);
//             editMsg.edit({ embeds: [embed] });

//           } else if (value == "channel") {
//             var channel = m.mentions.channels.first();
//             if (!channel) channel = await client.functions.findChannel(msgArgs.join(" "), m.guild);

//             if (!channel) {
//               const embed = client.embeds.error(title[current], `I could not record any channels from your message, please try again.`, originalQuestion);
//               return editMsg.edit({ embeds: [embed] });
//             }

//             if (!channel.isText()) {
//               const embed = client.embeds.error(title[current], `<#${channel.id}> is not a text channel, please try again.`, originalQuestion);
//               return editMsg.edit({ embeds: [embed] });
//             }

//             if (!channel.permissionsFor(clientMember).has("SEND_MESSAGES")) {
//               const embed = client.embeds.error(title[current], `I do not have the \`SEND_MESSAGES\` permission in this channel, please try again.`, originalQuestion);
//               return editMsg.edit({ embeds: [embed] });
//             }

//             collected[current] = channel.id;
//             const embed = client.embeds.success(title[current], `Panel channel has been set to: <#${channel.id}>.`);
//             editMsg.edit({ embeds: [embed] });

//           } else if (value == "ticket") {
//             if (m.content.length < 3) {
//               const embed = client.embeds.error(title[current], `This format is less than 3 characters, please try again.`, originalQuestion);
//               return editMsg.edit({ embeds: [embed] });
//             }

//             if (m.content.length > 32) {
//               const embed = client.embeds.error(title[current], `This format is greater than 32 characters, please try again.`, originalQuestion);
//               return editMsg.edit({ embeds: [embed] });
//             }

//             collected[current] = m.content;
//             const embed = client.embeds.success(title[current], `Ticket format has been set to: \`${m.content}\`.`);
//             editMsg.edit({ embeds: [embed] });

//           } else if (value == "claimed") {
//             if (m.content.length < 3) {
//               const embed = client.embeds.error(title[current], `This format is less than 3 characters, please try again.`, originalQuestion);
//               return editMsg.edit({ embeds: [embed] });
//             }

//             if (m.content.length > 32) {
//               const embed = client.embeds.error(title[current], `This format is greater than 32 characters, please try again.`, originalQuestion);
//               return editMsg.edit({ embeds: [embed] });
//             }

//             collected[current] = m.content;
//             const embed = client.embeds.success(title[current], `Claimed format has been set to: \`${m.content}\`.`);
//             editMsg.edit({ embeds: [embed] });
//           }

//           if (!values[currentNum]) {
//             finished = true;
//             return collector.stop();
//           }

//           currentNum++;
//           current = values[currentNum - 1].name;
//           client.functions.next(m.channel, msgId, embeds, currentNum);
//         }

//         await validateOption(current);
//       });

//       collector.on("end", async () => {
//         client.db.userInfo.set(`${message.author.id}-${message.guild.id}`, null, "inPrompt");

//         if (finished) {
//           var panelInfo = tsettings.panels.get(id);
//           var categoryOpened = message.guild.channels.cache.get(panelInfo.opened);
//           var categoryClosed = message.guild.channels.cache.get(panelInfo.closed);

//           var panelChannel = await client.channels.fetch(panelInfo.channel).catch(() => {});
//           var panelMsg = panelChannel ? await panelChannel.messages.fetch(panelInfo.msg).catch(() => {}) : null;

//           for (const [key, val] of Object.entries(collected)) {
//             panelInfo[key] = val;
//           }

//           const fields = [
//             { name: `General Configuration`, value: `${collected.name ? `${client.util.dash}` : ``} ${client.util.text} Name: \`${panelInfo.name}\`\n${collected.opened ? `${client.util.dash}` : ``} ${client.util.category} Opened Category: \`#${categoryOpened.name}\`\n${collected.closed ? `${client.util.dash}` : ``} ${client.util.category} Closed Category: \`#${categoryClosed.name}\`\n${collected.ticket ? `${client.util.dash}` : ``} ${client.util.message} Ticket Format: \`${panelInfo.ticket}\`\n${panelInfo.claiming ? `${collected.claiming ? `${client.util.dash}` : ``} ${client.util.message} Claimed Format: \`${panelInfo.claimed}\n` : ``}\`${collected.claiming ? `${client.util.dash}` : ``} ${client.util.override} Claiming: \`${panelInfo.claiming ? `On` : `Off`}\`\n${collected.channel ? `${client.util.dash}` : ``} ${client.util.channel} Panel Channel: <#${panelInfo.channel}>\n\u200b`, inline: false },
//             { name: `Role Configuration`, value: `${collected.support ? `${client.util.dash}` : ``} ${client.util.moderator} Support Roles:\n<@&${panelInfo.support.join(">\n<@&")}>${panelInfo.additional ? `\n\n${collected.additional ? `${client.util.dash}` : ``} ${client.util.moderator} Additional Roles:\n<@&${panelInfo.additional.join(">\n<@&")}>` : ``}` }
//           ];

//           const confirmBtn = client.buttons.confirm("Panel_Config:Confirm");
//           const cancelBtn = client.buttons.cancel("Panel_Config:Cancel");
//           const row = client.buttons.actionRow([confirmBtn, cancelBtn]);
//           const btnFilter = () => true;
//           var clicked = false;

//           const embed = client.embeds.green(command.option.new, `This prompt has been completed.\nClick on a button below to confirm or cancel the configuration.\n\u200b`, fields);

//           const confirmMsg = await message.channel.send({ embeds: [embed], components: [row] });
//           const confirmCollector = confirmMsg.createMessageComponentCollector({ filter: btnFilter, idle: 60 * 1000 });

//           confirmCollector.on("collect", async (component) => {
//             if (component.user.id !== message.author.id) {
//               const embed = client.embeds.permission("ADMINISTRATOR");
//               return component.reply({ embeds: [embed], ephemeral: true });
//             }

//             if (component.customId == "Panel_Config:Confirm") {
//               const panels = tsettings.panels;
//               panels.set(id, panelInfo);

//               client.db.panels.set(message.guild.id, panels, "panels");
//               if (collected.channel) {
//                 await client.schemas.sendPanel(panelInfo, tsettings, message.guild.id);
//                 if (panelMsg) await panelMsg.delete();

//               } else {
//                 if (panelMsg) {
//                   await client.schemas.editPanelMsg(panelInfo, tsettings, message.guild.id);
//                 } else {
//                   if (panelChannel) {
//                     await client.schemas.sendPanel(panelInfo, tsettings, message.guild.id);
//                   }
//                 }
//               }

//               const embed = client.embeds.success(command.option.modify, `Successfully modified the \`${panelInfo.name}\` panel.`);
//               await component.reply({ embeds: [embed] });

//               clicked = true;
//               confirmMsg.delete();
//               confirmCollector.stop();

//             } else {
//               const embed = client.embeds.success(command.option.new, `Cancelled the panel modify prompt.`);
//               await component.reply({ embeds: [embed] });

//               clicked = true;
//               confirmMsg.delete();
//               confirmCollector.stop();
//             }
//           });

//           confirmCollector.on("end", async () => {
//             if (!clicked) {
//               const embed = client.embeds.inactivity(command.option.new);
//               await message.channel.send({ embeds: [embed] });
//               confirmMsg.delete();
//             }
//           });
//         } else if (cancelled) {
//           const embed = client.embeds.success(command.option.new, `This prompt has been cancelled.`);
//           message.channel.send({ embeds: [embed] });

//         } else if (attempted) {
//           const embed = client.embeds.error(command.option.new, `This prompt has been stopped.`);
//           message.channel.send({ embeds: [embed] });

//         } else {
//           const embed = client.embeds.inactivity(command.option.new);
//           message.channel.send({ embeds: [embed] });

//           const editMsg = message.channel.messages.cache.get(msgId[currentNum - 1]);
//           const embed1 = client.embeds.warn(title[current], `This question has stopped looking for responses.`);
//           editMsg.edit({ embeds: [embed1] });
//         }
//       });
//     });

//     collector1.on("end", async () => {
//       if (clicked1) return;
//       const embed = client.embeds.inactivity(command.option.modify);
//       const embed1 = client.embeds.warn(command.option.modify);

//       msg.channel.send({ embeds: [embed] });
//       msg.edit({ embeds: [embed1] });
//     });
//   }

//   async deletePanel(message, tsettings, panel, command, userMsg) {
    
//     const filter = () => true;
//     const collector = message.createMessageComponentCollector({ filter, idle: 60000 });
//     var clicked = false;

//     collector.on("collect", async (component) => {
//       if (component.user.id !== userMsg.author.id) {
//         const embed = client.embeds.permission(["ADMINISRATOR"]);
//         return component.reply({ embeds: [embed], ephemeral: true });
//       }

//       clicked = true;
//       if (component.customId == "Panel_Delete:Confirm") {
//         tsettings.panels.delete(panel.id);
//         const panels = tsettings.panels;

//         client.db.panels.set(message.guild.id, panels, "panels");
//         const embed = client.embeds.success(command.option.delete, `Deleted the \`${panel.name}\` panel.`);
//         await component.update({ embeds: [embed] });

//         try {
//           var panelChannel = await client.channels.fetch(panel.channel);
//           var panelMsg = panelChannel ? await panelChannel.messages.fetch(panel.msg) : null;
//           if (panelMsg) panelMsg.delete();
//         } catch (e) {
          
//         }

//       } else {
//         const embed = client.embeds.success(command.option.delete, `Cancelled the panel deletetion.`);
//         await component.update({ embeds: [embed] });
//       }

//       message.delete();
//       collector.stop();
//     })

//     collector.on("end", async () => {
//       if (!clicked) {
//         const embed = client.embeds.inactivity(command.option.delete);
//         await message.channel.send({ embeds: [embed] });
//         message.delete();
//       }
//     })
//   }

//   async resetSettings(msg, command, message) {
//     const filter = () => true;
//     const collector = msg.createMessageComponentCollector({ filter, idle: 60 * 1000 });
//     const channel = msg.channel;
//     const guildId = msg.guild.id;
    
//     const option = command.option.reset;
//     var clicked = false;

//     collector.on("collect", async (int) => {
//       if (int.member.id !== message.author.id) {
//         const embed = client.embeds.notComponent();
//         return int.reply({ embeds: [embed], ephemeral: true });
//       }

//       if (int.customId == "Settings_Reset:Confirm") {
//         client.db.settings.delete(guildId);
//         const embed = client.embeds.success(option, `Reset this server's settings.`);
//         await int.reply({ embeds: [embed] });
//         msg.delete();

//       } else {
//         const embed = client.embeds.success(option, `Cancelled the prompt.`);
//         await int.reply({ embeds: [embed] });
//         msg.delete();
//       }

//       clicked = true;
//     });

//     collector.on("end", async () => {
//       if (clicked) return;
//       const embed = client.embeds.inactivity(command);
//       channel.send({ embeds: [embed] });
//     });
//   }
}