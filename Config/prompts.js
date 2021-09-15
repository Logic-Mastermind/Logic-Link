const Discord = require("discord.js");
const code = "```";

module.exports = class Prompts {
  constructor(client) {
    this.client = client;
  }

  async deleteConfirmation(message, command, responses) {
    const client = this.client;
    const conditionsEmbed = client.embeds.orange(command, responses.conditions);
    const filter = () => true;
    var clicked = false;

    const acceptButton = client.buttons.accept("Delete_Conditions_Accept");
    const declineButton = client.buttons.decline("Delete_Conditions_Decline");

    const msg = await message.channel.send(conditionsEmbed, { buttons: [acceptButton, declineButton] });
    const collector = msg.createButtonCollector(filter, { idle: 60000 });

    collector.on("collect", async (button) => {
      const btnClicker = await button.clicker.user;
      const acceptEmbed = client.embeds.success(command,`Accepted the command conditions.`);
      const declineEmbed = client.embeds.error(command, `Declined the command conditions.`);

      if (btnClicker.id == message.author.id) {
        clicked = true
        if (button.id == "Delete_Conditions_Accept") {
          client.db.first.set(btnClicker.id, false, "deleteCmd");
          msg.edit(acceptEmbed, null);
          button.reply.defer();

        } else if (button.id == "Delete_Conditions_Decline") {
          msg.edit(declineEmbed, null);
          button.reply.defer();
        }
      } else {
        if (button.id == "Delete_Conditions_Accept") {
          client.db.first.set(btnClicker.id, false, "deleteCmd")
          button.reply.send(``, { embed: acceptEmbed, ephemeral: true });

        } else if (button.id == "Delete_Conditions_Decline") {
          button.reply.send(``, { embed: declineEmbed, ephemeral: true });
        }
      }
    })

    collector.on("end", async (collected) => {
      if (!clicked) {
        const errorEmbed = client.embeds.error(command, `This prompt has ended due to inactivity.`);
        msg.edit(errorEmbed, null);
      }
    })
  }

  async helpMenu(msg, message, modPermissions, adminPermissions, ticketPermissions, supportPermissions, guildPrefix, noPanel) {
    const filter = () => true;
    const collector = msg.createMenuCollector(filter, { idle: 60 * 1000 });
    const original = msg.embeds[0];
    const select = msg.components[0].components[0];

    collector.on("collect", async (menu) => {
      if (menu.clicker.id !== message.author.id) return menu.reply.defer();
      const client = this.client;
      const backBtn = client.buttons.grey("Back", "Help_Menu:Back");
      await menu.reply.defer();

      switch (menu.values[0]) {
        case "Help_Menu:General":
        {
          const helpEmbed = client.embeds.helpCategory("General", `${client.util.members} `, guildPrefix);
          await msg.edit(helpEmbed, { button: backBtn });
          break;
        }
        case "Help_Menu:Moderator":
        {
          const helpEmbed = client.embeds.helpCategory("Moderator", modPermissions, guildPrefix);
          await msg.edit(helpEmbed, { button: backBtn });
          break;
        }
        case "Help_Menu:Administrator":
        {
          const helpEmbed = client.embeds.helpCategory("Administrator", adminPermissions, guildPrefix);
          await msg.edit(helpEmbed, { button: backBtn });
          break;
        }
        case "Help_Menu:Ticket":
        {
          const helpEmbed = client.embeds.helpCategory("Ticket", `${client.util.members} `, guildPrefix, ticketPermissions, adminPermissions, noPanel);
          await msg.edit(helpEmbed, { button: backBtn });
          break;
        }
        case "Help_Menu:Support":
        {
          const helpEmbed = client.embeds.helpCategory("Support", supportPermissions, guildPrefix);
          await msg.edit(helpEmbed, { button: backBtn });
          break;
        }
        case "Help_Menu:Developer":
        {
          const helpEmbed = client.embeds.helpCategory("Developer", `${client.util.integration} `, guildPrefix);
          await msg.edit(helpEmbed, { button: backBtn });
          break;
        }
      }

      const btnCollector = await msg.createButtonCollector(filter, { idle: 60 * 6000 });
      btnCollector.on("collect", async (btn) => {
        if (btn.clicker.id !== message.author.id) return;
        await btn.reply.defer();

        msg.edit(original, select);
      })

    })

    collector.on("end", async () => {
      msg.edit(original, null);
    })
  }

  async bugReport(message, command) {
    const clientMember = message.guild.me;
    const prompt = {
      description: `Please describe the bug in full detail.\nProvide images or videos if you can.`,
      reproduction: `What are the steps that were taken to produce the bug?\nType out each step individually in a separate message.`,
      expected: `What result was expected to happen?`,
      actual: `What result actually happened?`
    }

    const title = {
      description: `Bug Description`,
      reproduction: `Reproduction Steps`,
      expected: `Expected Results`,
      actual: `Actual Results`
    }

    const startEmbed = this.client.embeds.pending(command, `Starting bug report prompt...`);
    const embeds = [
      this.client.embeds.blue(title.name, prompt.name),
      this.client.embeds.blue(title.opened, prompt.opened),
      this.client.embeds.blue(title.closed, prompt.closed),
      this.client.embeds.blue(title.claiming, prompt.claiming),
      this.client.embeds.blue(title.support, prompt.support),
      this.client.embeds.blue(title.additional, prompt.additional),
      this.client.embeds.blue(title.channel, prompt.channel)
    ];

    const filter = (m) => m.author.id == message.author.id;
    const collector = message.channel.createMessageCollector(filter, { idle: 60 * 1000 });
    const startMsg = await message.lineReply(startEmbed);
    startMsg.edit(embeds[0]);

    var current = 1;
    var cancelled = false;
    var finished = false;
    var attempted = false;

    var msgId = [
      startMsg.id,
      null,
      null,
      null,
      null,
      null,
      null
    ]

    var collected = {};
    await this.client.db.userInfo.set(`${message.author.id}-${message.guild.id}`, true, "inPrompt");

    collector.on("collect", async (msg) => {
      const msgArgs = msg.content.split(/ +/g);

      if (current == 1) {
        const editMsg = msg.channel.messages.cache.get(msgId[0]);

        if (this.client.util.skipAliases.includes(msg.content.toLowerCase())) {
          const embed = this.client.embeds.error(title.description, `Skipping is disallowed in this prompt, please try again.\n\n**Original Question**\n${prompt.description}`);
          return editMsg.edit(embed);

        } else if (this.client.util.cancelAliases.includes(msg.content.toLowerCase())) {
          const embed = this.client.embeds.error(title.description, `This question has stopped looking for responses.`);

          editMsg.edit(embed);
          cancelled = true;
          return collector.stop();
        }

        collected.description = msg.content;
        const embed = this.client.embeds.success(title.name, `Bug description set to:\n${code}${msg.content}${code}`);
        editMsg.edit(embed);

        current = 2;
        msgId = await this.client.functions.next(message.channel, msgId, embeds, 2);

      }
    })
  }

  async newPanel(settings, tsettings, message, command) {
    const clientMember = message.guild.me;
    const prompt = {
      name: `What should be the name of this panel?\nThe name must be within 3 and 50 characters long.`,
      opened: `Where would you like opened tickets to go?\nType the name or ID of a category you want to set this to.`,
      closed: `Where would you like closed tickets to go?\nType the name or ID of a category you want to set this to.`,
      claiming: `Would you like panel claiming to be on, or off?\nType the option that you would like this to set to.`,
      support: `What are some support roles that you would like for this panel?\nMembers who have these roles will be able to view and manage support tickets.\nMention or type the names of those roles below.`,
      additional: `What are some additional roles that you would like for this panel?\nBy default, members who have these roles will be able to view support tickets.\nMention or type the names of those roles below.`,
      channel: `Where should this panel be sent?\nMention or type the name of the channel that you would like this panel to be sent.`
    }

    const title = {
      name: `Panel Name`,
      opened: `Opened Category`,
      closed: `Closed Category`,
      claiming: `Ticket Claiming`,
      support: `Support Roles`,
      additional: `Additional Roles`,
      channel: `Panel Channel`
    }

    const startEmbed = this.client.embeds.pending(command, `Starting panel setup prompt...`);
    if (settings.panelSetup) {
      const embed = this.client.embeds.error(command.option.new, `A panel is already being created in this server.`);
      return message.lineReply(embed);
    }
    
    const embeds = [
      this.client.embeds.blue(title.name, prompt.name),
      this.client.embeds.blue(title.opened, prompt.opened),
      this.client.embeds.blue(title.closed, prompt.closed),
      this.client.embeds.blue(title.claiming, prompt.claiming),
      this.client.embeds.blue(title.support, prompt.support),
      this.client.embeds.blue(title.additional, prompt.additional),
      this.client.embeds.blue(title.channel, prompt.channel)
    ];

    const filter = (m) => m.author.id == message.author.id;
    const collector = message.channel.createMessageCollector(filter, { idle: 60 * 1000 });
    const startMsg = await message.lineReply(startEmbed);
    startMsg.edit(embeds[0])

    var current = 1;
    var cancelled = false;
    var finished = false;
    var attempted = false;

    var msgId = [
      startMsg.id,
      null,
      null,
      null,
      null,
      null,
      null
    ]

    var attempts = {
      name: 1,
      opened: 1,
      closed: 1,
      claiming: 1,
      support: 1,
      additional: 1,
      channel: 1
    }

    var collected = {};
    await this.client.db.settings.set(message.guild.id, true, "panelSetup");
    await this.client.db.userInfo.set(`${message.author.id}-${message.guild.id}`, true, "inPrompt");

    collector.on("collect", async (msg) => {
      const msgArgs = msg.content.split(/ +/g);

      if (current == 1) {
        const editMsg = msg.channel.messages.cache.get(msgId[0]);
        ++attempts.name;

        if (attempts.name > 4) {
          const embed = this.client.embeds.error(title.name, `You have attempted this question too many times.`);

          editMsg.edit(embed);
          attempted = true;
          return collector.stop();
        }

        if (this.client.util.skipAliases.includes(msg.content.toLowerCase())) {
          const embed = this.client.embeds.error(title.name, `Skipping is disallowed in this prompt, please try again.\n\n**Original Question**\n${prompt.name}`);
          return editMsg.edit(embed);

        } else if (this.client.util.cancelAliases.includes(msg.content.toLowerCase())) {
          const embed = this.client.embeds.error(title.name, `This question has stopped looking for responses.`);

          editMsg.edit(embed);
          cancelled = true;
          return collector.stop();
        }

        if (msg.content.length > 50) {
          const embed = this.client.embeds.error(title.name, `This name is greater than 50 characters, please try again.\n\n**Original Question**\n${prompt.name}`);
          return editMsg.edit(embed);

        } else if (msg.content.length < 3) {
          const embed = this.client.embeds.error(title.name, `This name is less than 3 characters, please try again.\n\n**Original Question**\n${prompt.name}`);
          return editMsg.edit(embed);
        }

        var taken = null;
        for (const pan of tsettings.panels.all.values()) {
          if (pan.name == msg.content) {
            taken = true;
            break;
          }
        }

        if (taken) {
          const embed = this.client.embeds.error(title.name, `This name has already been used in another panel, please try again.\n\n**Original Question**\n${prompt.name}`);
          return editMsg.edit(embed);
        }

        collected.name = msg.content;
        const embed = this.client.embeds.success(title.name, `Panel name has been set to: \`${collected.name}\`.`);
        editMsg.edit(embed);

        current = 2;
        msgId = await this.client.functions.next(message.channel, msgId, embeds, 2);

      } else if (current == 2) {
        const editMsg = msg.channel.messages.cache.get(msgId[1]);
        ++attempts.opened;

        if (attempts.opened > 4) {
          const embed = this.client.embeds.error(title.opened, `You have attempted this question too many times.`);

          editMsg.edit(embed);
          attempted = true;
          return collector.stop();
        }

        if (this.client.util.skipAliases.includes(msg.content.toLowerCase())) {
          const embed = this.client.embeds.error(title.opened, `Skipping is disallowed in this prompt, please try again.\n\n**Original Question**\n${prompt.opened}`);
          return editMsg.edit(embed);

        } else if (this.client.util.cancelAliases.includes(msg.content.toLowerCase())) {
          const embed = this.client.embeds.error(title.opened, `This question has stopped looking for responses.`);

          editMsg.edit(embed);
          cancelled = true;
          return collector.stop();
        }

        var category = await this.client.functions.findCategory(msgArgs.join(" "), msg.guild);
        if (!category) {
          const embed = this.client.embeds.error(title.opened, `I could not record any categories from your message, please try again.\n\n**Original Question**\n${prompt.opened}`);
          return editMsg.edit(embed);
        }

        if (!category.permissionsFor(clientMember).has("MANAGE_CHANNELS")) {
          const embed = this.client.embeds.error(title.opened, `I do not have the required permissions in this category, please try again.\n\n**Original Question**\n${prompt.opened}`);
          return editMsg.edit(embed);
        }

        collected.opened = category.id;
        const embed = this.client.embeds.success(title.opened, `Panel opened category has been set to: \`#${category.name}\`.`);
        editMsg.edit(embed);

        current = 3;
        msgId = await this.client.functions.next(message.channel, msgId, embeds, 3);

      } else if (current == 3) {
        const editMsg = msg.channel.messages.cache.get(msgId[2]);
        ++attempts.closed;

        if (attempts.closed > 4) {
          const embed = this.client.embeds.error(title.closed, `You have attempted this question too many times.`);

          editMsg.edit(embed);
          attempted = true;
          return collector.stop();
        }

        if (this.client.util.skipAliases.includes(msg.content.toLowerCase())) {
          const embed = this.client.embeds.error(title.closed, `Skipping is disallowed in this prompt, please try again.\n\n**Original Question**\n${prompt.closed}`);
          return editMsg.edit(embed);

        } else if (this.client.util.cancelAliases.includes(msg.content.toLowerCase())) {
          const embed = this.client.embeds.error(title.closed, `This question has stopped looking for responses.`);

          editMsg.edit(embed);
          cancelled = true;
          return collector.stop();
        }

        var category = await this.client.functions.findCategory(msgArgs.join(" "), msg.guild);
        if (!category) {
          const embed = this.client.embeds.error(title.closed, `I could not record any categories from your message, please try again.\n\n**Original Question**\n${prompt.closed}`);
          return editMsg.edit(embed);
        }

        if (!category.permissionsFor(clientMember).has("MANAGE_CHANNELS")) {
          const embed = this.client.embeds.error(title.closed, `I do not have the \`MANAGE_CHANNELS\` permission in this category, please try again.\n\n**Original Question**\n${prompt.closed}`);
          return editMsg.edit(embed);
        }

        collected.closed = category.id;
        const embed = this.client.embeds.success(title.closed, `Panel closed category has been set to: \`#${category.name}\`.`);
        editMsg.edit(embed);

        current = 4;
        msgId = await this.client.functions.next(message.channel, msgId, embeds, 4);
        
      } else if (current == 4) {
        const editMsg = msg.channel.messages.cache.get(msgId[3]);
        ++attempts.claiming;

        if (attempts.claiming > 4) {
          const embed = this.client.embeds.error(title.claiming, `You have attempted this question too many times.`);

          editMsg.edit(embed);
          attempted = true;
          return collector.stop();
        }

        if (this.client.util.skipAliases.includes(msg.content.toLowerCase())) {
          const embed = this.client.embeds.error(title.claiming, `Skipping is disallowed in this prompt, please try again.\n\n**Original Question**\n${prompt.claiming}`);
          return editMsg.edit(embed);

        } else if (this.client.util.cancelAliases.includes(msg.content.toLowerCase())) {
          const embed = this.client.embeds.error(title.claiming, `This question has stopped looking for responses.`);

          editMsg.edit(embed);
          cancelled = true;
          return collector.stop();
        }

        var option = null;
        if (msg.content.includes("yes") || msg.content.includes("on")) option = "true";
        if (msg.content.includes("no") || msg.content.includes("off")) option = "false";

        if (!option) {
          const embed = this.client.embeds.error(title.claiming, `An invalid option was recieved, please type \`on\` or \`off\`.\n\n**Original Question**\n${prompt.claiming}`);
          return editMsg.edit(embed);
        }
        
        collected.claiming = option == "true" ? true : false;
        const embed = this.client.embeds.success(title.claiming, `Ticket claiming in this panel has been turned \`${option == "true" ? `on` : `off`}\`.`);
        editMsg.edit(embed);

        current = 5;
        msgId = await this.client.functions.next(message.channel, msgId, embeds, 5);

      } else if (current == 5) {
        const editMsg = msg.channel.messages.cache.get(msgId[4]);
        ++attempts.support;

        if (attempts.support > 4) {
          const embed = this.client.embeds.error(title.support, `You have attempted this question too many times.`);

          editMsg.edit(embed);
          attempted = true;
          return collector.stop();
        }

        if (this.client.util.skipAliases.includes(msg.content.toLowerCase())) {
          const embed = this.client.embeds.error(title.support, `Skipping is disallowed in this prompt, please try again.\n\n**Original Question**\n${prompt.support}`);
          return editMsg.edit(embed);

        } else if (this.client.util.cancelAliases.includes(msg.content.toLowerCase())) {
          const embed = this.client.embeds.error(title.support, `This question has stopped looking for responses.`);

          editMsg.edit(embed);
          cancelled = true;
          return collector.stop();
        }

        var mentionedRoles = await msg.mentions.roles.map(r => r.id)
        var roles = msgArgs;
        var roleObj = [];

        await roles.unshift(...mentionedRoles);
        roles = roles.filter((v) => (!v.startsWith("<@&") || !v.startsWith("<@!")) && !v.endsWith(">"));
        roles = [...new Set(roles)];

        await roles.forEach(async (v) => {
          var role = await this.client.functions.findRole(v, msg.guild);
          if (role) roleObj.push(role.id);
        })

        roleObj = [...new Set(roleObj)];
        if (roleObj.length < 1) {
          const embed = this.client.embeds.error(title.support, `I couldn't record any roles from your message, please try again.\n\n**Original Question**\n${prompt.support}`);
          return editMsg.edit(embed);
        }

        collected.support = roleObj;
        const embed = this.client.embeds.success(title.support, `I have collected \`${roleObj.length}\` role${roleObj.length == 1 ? `` : `s`} from your message.\n\n**Roles**\n<@&${roleObj.join(">\n<@&")}>`);
        editMsg.edit(embed);

        current = 6;
        msgId = await this.client.functions.next(message.channel, msgId, embeds, 6);

      } else if (current == 6) {
        const editMsg = msg.channel.messages.cache.get(msgId[5]);
        ++attempts.additional;

        if (attempts.additional > 4) {
          const embed = this.client.embeds.error(title.additional, `You have attempted this question too many times.`);

          editMsg.edit(embed);
          attempted = true;
          return collector.stop();
        }

        if (this.client.util.skipAliases.includes(msg.content.toLowerCase())) {
          const embed = this.client.embeds.success(title.additional, `This question has been skipped.`);
          editMsg.edit(embed);
          current = 7;
          msgId = await this.client.functions.next(message.channel, msgId, embeds, 7);
          return;

        } else if (this.client.util.cancelAliases.includes(msg.content.toLowerCase())) {
          const embed = this.client.embeds.error(title.additional, `This question has stopped looking for responses.`);

          editMsg.edit(embed);
          cancelled = true;
          return collector.stop();
        }

        var mentionedRoles = await msg.mentions.roles.map(r => r.id)
        var roles = msgArgs;
        var roleObj = [];

        await roles.unshift(...mentionedRoles);
        roles = roles.filter((v) => (!v.startsWith("<@&") || !v.startsWith("<@!")) && !v.endsWith(">"));
        roles = [...new Set(roles)];

        await roles.forEach(async (v) => {
          var role = await this.client.functions.findRole(v, msg.guild);
          if (role) roleObj.push(role.id);
        })

        roleObj = [...new Set(roleObj)];
        if (roleObj.length < 1) {
          const embed = this.client.embeds.error(title.additional, `I couldn't record any roles from your message, please try again.\n\n**Original Question**\n${prompt.additional}`);
          return editMsg.edit(embed);
        }

        collected.additional = roleObj;
        const embed = this.client.embeds.success(title.additional, `I have collected \`${roleObj.length}\` role${roleObj.length == 1 ? `` : `s`} from your message.\n\n**Roles**\n<@&${roleObj.join(">\n<@&")}>`);
        editMsg.edit(embed);

        current = 7;
        msgId = await this.client.functions.next(message.channel, msgId, embeds, 7);

      } else if (current == 7) {
        const editMsg = msg.channel.messages.cache.get(msgId[6]);
        ++attempts.channel;

        if (attempts.channel > 4) {
          const embed = this.client.embeds.error(title.channel, `You have attempted this question too many times.`);

          editMsg.edit(embed);
          attempted = true;
          return collector.stop();
        }

        if (this.client.util.skipAliases.includes(msg.content.toLowerCase())) {
          const embed = this.client.embeds.error(title.channel, `Skipping is disallowed in this prompt, please try again.\n\n**Original Question**\n${prompt.channel}`);
          return editMsg.edit(embed);

        } else if (this.client.util.cancelAliases.includes(msg.content.toLowerCase())) {
          const embed = this.client.embeds.error(title.channel, `This question has stopped looking for responses.`);

          editMsg.edit(embed);
          cancelled = true;
          return collector.stop();
        }

        var channel = msg.mentions.channels.first();
        if (!channel) channel = await this.client.functions.findChannel(msgArgs.join(" "), msg.guild);

        if (!channel) {
          const embed = this.client.embeds.error(title.channel, `I could not record any channels from your message, please try again.\n\n**Original Question**\n${prompt.channel}`);
          return editMsg.edit(embed);
        }

        if (!channel.permissionsFor(clientMember).has("SEND_MESSAGES")) {
          const embed = this.client.embeds.error(title.channel, `I do not have the \`SEND_MESSAGES\` permission in this channel, please try again.\n\n**Original Question**\n${prompt.channel}`);
          return editMsg.edit(embed);
        }

        collected.channel = channel.id;
        const embed = this.client.embeds.success(title.channel, `Panel channel has been set to: <#${channel.id}>.`);
        editMsg.edit(embed);

        finished = true;
        collector.stop();
      }
    });

    collector.on("end", async () => {
      await this.client.db.settings.set(message.guild.id, false, "panelSetup");
      await this.client.db.userInfo.set(`${message.author.id}-${message.guild.id}`, false, "inPrompt");

      if (finished) {
        var categoryOpened = message.guild.channels.cache.get(collected.opened);
        var categoryClosed = message.guild.channels.cache.get(collected.closed);

        const fields = [
          { name: `General Configuration`, value: `${this.client.util.text} Name: \`${collected.name}\`\n${this.client.util.category} Opened Category: \`#${categoryOpened.name}\`\n${this.client.util.category} Closed Category: \`#${categoryClosed.name}\`\n${this.client.util.override} Claiming: \`${collected.claiming ? `On` : `Off`}\`\n${this.client.util.channel} Panel Channel: <#${collected.channel}>\n\u200b`, inline: false },
          { name: `Role Configuration`, value: `${this.client.util.moderator} Support Roles:\n<@&${collected.support.join(">\n<@&")}>${collected.additional ? `\n\n${this.client.util.moderator} Additional Roles:\n<@&${collected.additional.join(">\n<@&")}>` : ``}` }
        ];

        const confirmBtn = this.client.buttons.confirm("Panel_Config_Confirm");
        const cancelBtn = this.client.buttons.cancel("Panel_Config_Cancel");
        const btnFilter = () => true;
        var clicked = false;

        const embed = this.client.embeds.fieldGreen(command.option.new, `This prompt has been completed.\nClick on a button below to confirm or cancel the configuration.\n\u200b`, fields);

        const confirmMsg = await message.channel.send({ embed: embed, buttons: [confirmBtn, cancelBtn] });
        const confirmCollector = confirmMsg.createButtonCollector(btnFilter, { idle: 60 * 1000 });

        confirmCollector.on("collect", async (button) => {
          if (button.clicker.user.id !== message.author.id) {
            const embed = this.client.embeds.permission(command, `ADMINISTRATOR`);
            return button.reply.send({ embed: embed, ephemeral: true });
          }

          if (button.id == "Panel_Config_Confirm") {
            const newCount = (tsettings.panels.count + 1).toString();
            const panels = Object.fromEntries(tsettings.panels.all)

            panels[newCount] = {
              name: collected.name,
              opened: collected.opened,
              closed: collected.closed,
              claiming: collected.claiming,
              channel: collected.channel,
              support: collected.support,
              additional: collected.additional || [],
              ticket: `ticket-[number]`,
              claimed: `claimed-[number]`,
              createdAt: Date.now(),
              createdBy: message.author.id,
              id: newCount
            }

            await this.client.db.panels.set(message.guild.id, panels, "panels");
            const embed = this.client.embeds.success(command.option.new, `Created a new panel with the name: \`${collected.name}\`.`);
            await button.reply.send(embed);

            clicked = true;
            confirmMsg.delete();
            confirmCollector.stop();

          } else {
            const embed = this.client.embeds.success(command.option.new, `Cancelled the panel setup prompt.`);
            await button.reply.send(embed);

            clicked = true;
            confirmMsg.delete();
            confirmCollector.stop();
          }
        })

        confirmCollector.on("end", async () => {
          if (!clicked) {
            const embed = this.client.embeds.error(command.option.new, `This prompt has timed out due to inactivity.`);
            await message.channel.send(embed);
            confirmMsg.delete();
          }
        })

      } else if (cancelled) {
        const embed = this.client.embeds.success(command.option.new, `This prompt has been cancelled.`);
        message.channel.send(embed);

      } else if (attempted) {
        const embed = this.client.embeds.error(command.option.new, `This prompt has been stopped.`);
        message.channel.send(embed);

      } else {
        const embed = this.client.embeds.error(command.option.new, `This prompt has timed out due to inactivity.`);
        message.channel.send(embed);
      }
    });
  }

  async deletePanel(message, tsettings, panel, command, userMsg) {
    const btnFilter = () => true;
    const collector = message.createButtonCollector(btnFilter, { idle: 60000 });
    var clicked = false;

    collector.on("collect", async (button) => {
      if (button.clicker.user.id !== userMsg.author.id) {
        const embed = this.client.embeds.permission(command, `ADMINISTRATOR`);
        return button.reply.send({ embed: embed, ephemeral: true });
      }

      if (button.id == "Panel_Delete_Confirm") {
        clicked = true;
        await tsettings.panels.all.delete(panel.id);
        const panels = Object.fromEntries(tsettings.panels.all);

        this.client.db.panels.set(message.guild.id, panels, "panels");
        const embed = this.client.embeds.success(command.option.delete, `Deleted the panel with ID: \`${panel.id}\`.`);
        await button.reply.send(embed);
        message.delete();
        collector.stop();

      } else {
        clicked = true;
        const embed = this.client.embeds.success(command.option.delete, `Cancelled the panel deletetion.`);
        await button.reply.send(embed);
        message.delete();
        collector.stop();
      }
    })

    collector.on("end", async () => {
      if (!clicked) {
        const embed = this.client.embeds.error(command.option.delete, `This prompt has timed out due to inactivity.`);
        await message.channel.send(embed);
        message.delete();
      }
    })
  }
}