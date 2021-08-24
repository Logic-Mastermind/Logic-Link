const Discord = require("discord.js");
const Buttons = require("discord-buttons");
const Prefix = require("discord-prefix");

exports.run = async (client, message, args, command, settings, tsettings, extra) => {
  var guildPrefix = Prefix.getPrefix(message.guild.id);
  if (!guildPrefix) guildPrefix = client.util.defaultPrefix;

  const clientMember = message.guild.me;
  const noArgs = await client.functions.getNoArgs(command, message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = await client.functions.getArgs(args);
  const code = `\`\`\``;

  const responses = {

  }

  try {
    if (!secArg) {
      const panelCount = tsettings.panels.count;
      const fields = [];

      tsettings.panels.all.forEach((v, k) => {
        if (v.id == "1" || v.id == "2") {
          var opened = message.guild.channels.cache.get(v.opened);
          var closed = message.guild.channels.cache.get(v.closed);

          fields[k - 1] = {
            name: `${client.util.panel} Panel: \`${v.id}\``,
            value: `${client.util.text} Name: \`${v.name}\`\n${client.util.category} Opened Category: \`#${opened.name}\`\n${client.util.category} Closed Category: \`#${closed.name}\`\n${client.util.override} Claiming: \`${v.claiming ? `On` : `Off`}\`\n${client.util.channel} Panel Channel: <#${v.channel}>`,
            inline: true
          }
        }
      })

      if (panelCount == 0) {
        fields[0] = {
          name: `${client.util.panel} Panel: \`None\``,
          value: `There are no panels to show for now.`,
          inline: false
        }
      }

      const embed = client.embeds.field(command, `${client.util.welcomeBotInfo}\n\n**Panels**\nBelow shows a list of ticket panels.\nIf you would like details about this command, run: \`${guildPrefix}help panels\`.\nThis server has ${panelCount == 0 ? `no` : `\`${panelCount}\``} panel${panelCount == 1 ? `` : `s`}.\n\n${code}Panels${code}${(panelCount == 0 && (message.member.hasPermission("ADMINISTRATOR") || message.member.roles.cache.has(settings.adminRole))) ? `\n${client.util.warn} This server does not have any panels. Run \`${guildPrefix}panels new\` to create one.` : ``}\u200b`, fields);
      message.lineReply(embed);

    } else {
      switch (secArg) {
        case "n":
        case "new":
        {
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

          const startEmbed = client.embeds.pending(command, `Starting panel setup prompt...`);
          if (settings.panelSetup) {
            const embed = client.embeds.error(command.option.new, `A panel is already being created in this server.`);
            return message.lineReply(embed);
          }
          
          const embeds = [
            client.embeds.blue(title.name, prompt.name),
            client.embeds.blue(title.opened, prompt.opened),
            client.embeds.blue(title.closed, prompt.closed),
            client.embeds.blue(title.claiming, prompt.claiming),
            client.embeds.blue(title.support, prompt.support),
            client.embeds.blue(title.additional, prompt.additional),
            client.embeds.blue(title.channel, prompt.channel)
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
          await client.db.settings.set(message.guild.id, true, "panelSetup");
          await client.db.userInfo.set(`${message.author.id}-${message.guild.id}`, true, "inPrompt");

          collector.on("collect", async (msg) => {
            const msgArgs = msg.content.split(/ +/g);

            if (current == 1) {
              const editMsg = msg.channel.messages.cache.get(msgId[0]);
              ++attempts.name;

              if (attempts.name > 4) {
                const embed = client.embeds.error(title.name, `You have attempted this question too many times.`);

                editMsg.edit(embed);
                attempted = true;
                return collector.stop();
              }

              if (client.util.skipAliases.includes(msg.content.toLowerCase())) {
                const embed = client.embeds.error(title.name, `Skipping is disallowed in this prompt, please try again.\n\n**Original Question**\n${prompt.name}`);
                return editMsg.edit(embed);

              } else if (client.util.cancelAliases.includes(msg.content.toLowerCase())) {
                const embed = client.embeds.error(title.name, `This question has stopped looking for responses.`);

                editMsg.edit(embed);
                cancelled = true;
                return collector.stop();
              }

              if (msg.content.length > 50) {
                const embed = client.embeds.error(title.name, `This name is greater than 50 characters, please try again.\n\n**Original Question**\n${prompt.name}`);
                return editMsg.edit(embed);

              } else if (msg.content.length < 3) {
                const embed = client.embeds.error(title.name, `This name is less than 3 characters, please try again.\n\n**Original Question**\n${prompt.name}`);
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
                const embed = client.embeds.error(title.name, `This name has already been used in another panel, please try again.\n\n**Original Question**\n${prompt.name}`);
                return editMsg.edit(embed);
              }

              collected.name = msg.content;
              const embed = client.embeds.success(title.name, `Panel name has been set to: \`${collected.name}\`.`);
              editMsg.edit(embed);

              current = 2;
              msgId = await client.functions.next(message.channel, msgId, embeds, 2);

            } else if (current == 2) {
              const editMsg = msg.channel.messages.cache.get(msgId[1]);
              ++attempts.opened;

              if (attempts.opened > 4) {
                const embed = client.embeds.error(title.opened, `You have attempted this question too many times.`);

                editMsg.edit(embed);
                attempted = true;
                return collector.stop();
              }

              if (client.util.skipAliases.includes(msg.content.toLowerCase())) {
                const embed = client.embeds.error(title.opened, `Skipping is disallowed in this prompt, please try again.\n\n**Original Question**\n${prompt.opened}`);
                return editMsg.edit(embed);

              } else if (client.util.cancelAliases.includes(msg.content.toLowerCase())) {
                const embed = client.embeds.error(title.opened, `This question has stopped looking for responses.`);

                editMsg.edit(embed);
                cancelled = true;
                return collector.stop();
              }

              var category = await client.functions.findCategory(msgArgs.join(" "), msg.guild);
              if (!category) {
                const embed = client.embeds.error(title.opened, `I could not record any categories from your message, please try again.\n\n**Original Question**\n${prompt.opened}`);
                return editMsg.edit(embed);
              }

              if (!category.permissionsFor(clientMember).has("MANAGE_CHANNELS")) {
                const embed = client.embeds.error(title.opened, `I do not have the required permissions in this category, please try again.\n\n**Original Question**\n${prompt.opened}`);
                return editMsg.edit(embed);
              }

              collected.opened = category.id;
              const embed = client.embeds.success(title.opened, `Panel opened category has been set to: \`#${category.name}\`.`);
              editMsg.edit(embed);

              current = 3;
              msgId = await client.functions.next(message.channel, msgId, embeds, 3);

            } else if (current == 3) {
              const editMsg = msg.channel.messages.cache.get(msgId[2]);
              ++attempts.closed;

              if (attempts.closed > 4) {
                const embed = client.embeds.error(title.closed, `You have attempted this question too many times.`);

                editMsg.edit(embed);
                attempted = true;
                return collector.stop();
              }

              if (client.util.skipAliases.includes(msg.content.toLowerCase())) {
                const embed = client.embeds.error(title.closed, `Skipping is disallowed in this prompt, please try again.\n\n**Original Question**\n${prompt.closed}`);
                return editMsg.edit(embed);

              } else if (client.util.cancelAliases.includes(msg.content.toLowerCase())) {
                const embed = client.embeds.error(title.closed, `This question has stopped looking for responses.`);

                editMsg.edit(embed);
                cancelled = true;
                return collector.stop();
              }

              var category = await client.functions.findCategory(msgArgs.join(" "), msg.guild);
              if (!category) {
                const embed = client.embeds.error(title.closed, `I could not record any categories from your message, please try again.\n\n**Original Question**\n${prompt.closed}`);
                return editMsg.edit(embed);
              }

              if (!category.permissionsFor(clientMember).has("MANAGE_CHANNELS")) {
                const embed = client.embeds.error(title.closed, `I do not have the \`MANAGE_CHANNELS\` permission in this category, please try again.\n\n**Original Question**\n${prompt.closed}`);
                return editMsg.edit(embed);
              }

              collected.closed = category.id;
              const embed = client.embeds.success(title.closed, `Panel closed category has been set to: \`#${category.name}\`.`);
              editMsg.edit(embed);

              current = 4;
              msgId = await client.functions.next(message.channel, msgId, embeds, 4);
              
            } else if (current == 4) {
              const editMsg = msg.channel.messages.cache.get(msgId[3]);
              ++attempts.claiming;

              if (attempts.claiming > 4) {
                const embed = client.embeds.error(title.claiming, `You have attempted this question too many times.`);

                editMsg.edit(embed);
                attempted = true;
                return collector.stop();
              }

              if (client.util.skipAliases.includes(msg.content.toLowerCase())) {
                const embed = client.embeds.error(title.claiming, `Skipping is disallowed in this prompt, please try again.\n\n**Original Question**\n${prompt.claiming}`);
                return editMsg.edit(embed);

              } else if (client.util.cancelAliases.includes(msg.content.toLowerCase())) {
                const embed = client.embeds.error(title.claiming, `This question has stopped looking for responses.`);

                editMsg.edit(embed);
                cancelled = true;
                return collector.stop();
              }

              var option = null;
              if (msg.content.includes("yes") || msg.content.includes("on")) option = "true";
              if (msg.content.includes("no") || msg.content.includes("off")) option = "false";

              if (!option) {
                const embed = client.embeds.error(title.claiming, `An invalid option was recieved, please type \`on\` or \`off\`.\n\n**Original Question**\n${prompt.claiming}`);
                return editMsg.edit(embed);
              }
              
              collected.claiming = option == "true" ? true : false;
              const embed = client.embeds.success(title.claiming, `Ticket claiming in this panel has been turned \`${option == "true" ? `on` : `off`}\`.`);
              editMsg.edit(embed);

              current = 5;
              msgId = await client.functions.next(message.channel, msgId, embeds, 5);

            } else if (current == 5) {
              const editMsg = msg.channel.messages.cache.get(msgId[4]);
              ++attempts.support;

              if (attempts.support > 4) {
                const embed = client.embeds.error(title.support, `You have attempted this question too many times.`);

                editMsg.edit(embed);
                attempted = true;
                return collector.stop();
              }

              if (client.util.skipAliases.includes(msg.content.toLowerCase())) {
                const embed = client.embeds.error(title.support, `Skipping is disallowed in this prompt, please try again.\n\n**Original Question**\n${prompt.support}`);
                return editMsg.edit(embed);

              } else if (client.util.cancelAliases.includes(msg.content.toLowerCase())) {
                const embed = client.embeds.error(title.support, `This question has stopped looking for responses.`);

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
                var role = await client.functions.findRole(v, msg.guild);
                if (role) roleObj.push(role.id);
              })

              roleObj = [...new Set(roleObj)];
              if (roleObj.length < 1) {
                const embed = client.embeds.error(title.support, `I couldn't record any roles from your message, please try again.`);
                return editMsg.edit(embed);
              }

              collected.support = roleObj;
              const embed = client.embeds.success(title.support, `I have collected \`${roleObj.length}\` role${roleObj.length == 1 ? `` : `s`} from your message.\n\n**Roles**\n<@&${roleObj.join(">\n<@&")}>`);
              editMsg.edit(embed);

              current = 6;
              msgId = await client.functions.next(message.channel, msgId, embeds, 6);

            } else if (current == 6) {
              const editMsg = msg.channel.messages.cache.get(msgId[5]);
              ++attempts.additional;

              if (attempts.additional > 4) {
                const embed = client.embeds.error(title.additional, `You have attempted this question too many times.`);

                editMsg.edit(embed);
                attempted = true;
                return collector.stop();
              }

              if (client.util.skipAliases.includes(msg.content.toLowerCase())) {
                const embed = client.embeds.error(title.additional, `Skipping is disallowed in this prompt, please try again.\n\n**Original Question**\n${prompt.additional}`);
                return editMsg.edit(embed);

              } else if (client.util.cancelAliases.includes(msg.content.toLowerCase())) {
                const embed = client.embeds.error(title.additional, `This question has stopped looking for responses.`);

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
                var role = await client.functions.findRole(v, msg.guild);
                if (role) roleObj.push(role.id);
              })

              roleObj = [...new Set(roleObj)];
              if (roleObj.length < 1) {
                const embed = client.embeds.error(title.additional, `I couldn't record any roles from your message, please try again.`);
                return editMsg.edit(embed);
              }

              collected.additional = roleObj;
              const embed = client.embeds.success(title.additional, `I have collected \`${roleObj.length}\` role${roleObj.length == 1 ? `` : `s`} from your message.\n\n**Roles**\n<@&${roleObj.join(">\n<@&")}>`);
              editMsg.edit(embed);

              current = 7;
              msgId = await client.functions.next(message.channel, msgId, embeds, 7);

            } else if (current == 7) {
              const editMsg = msg.channel.messages.cache.get(msgId[6]);
              ++attempts.channel;

              if (attempts.channel > 4) {
                const embed = client.embeds.error(title.channel, `You have attempted this question too many times.`);

                editMsg.edit(embed);
                attempted = true;
                return collector.stop();
              }

              if (client.util.skipAliases.includes(msg.content.toLowerCase())) {
                const embed = client.embeds.error(title.channel, `Skipping is disallowed in this prompt, please try again.\n\n**Original Question**\n${prompt.channel}`);
                return editMsg.edit(embed);

              } else if (client.util.cancelAliases.includes(msg.content.toLowerCase())) {
                const embed = client.embeds.error(title.channel, `This question has stopped looking for responses.`);

                editMsg.edit(embed);
                cancelled = true;
                return collector.stop();
              }

              var channel = msg.mentions.channels.first();
              if (!channel) channel = await client.functions.findChannel(msgArgs.join(" "), msg.guild);

              if (!channel) {
                const embed = client.embeds.error(title.channel, `I could not record any channels from your message, please try again.\n\n**Original Question**\n${prompt.closed}`);
                return editMsg.edit(embed);
              }

              if (!channel.permissionsFor(clientMember).has("SEND_MESSAGES")) {
                const embed = client.embeds.error(title.channel, `I do not have the \`SEND_MESSAGES\` permission in this channel, please try again.\n\n**Original Question**\n${prompt.closed}`);
                return editMsg.edit(embed);
              }

              collected.channel = channel.id;
              const embed = client.embeds.success(title.channel, `Panel channel has been set to: <#${channel.id}>.`);
              editMsg.edit(embed);

              finished = true;
              collector.stop();
            }
          });

          collector.on("end", async () => {
            await client.db.settings.set(message.guild.id, false, "panelSetup");
            await client.db.userInfo.set(`${message.author.id}-${message.guild.id}`, false, "inPrompt");

            if (finished) {
              var categoryOpened = message.guild.channels.cache.get(collected.opened);
              var categoryClosed = message.guild.channels.cache.get(collected.closed);

              const fields = [
                { name: `General Configuration`, value: `${client.util.text} Name: \`${collected.name}\`\n${client.util.category} Opened Category: \`#${categoryOpened.name}\`\n${client.util.category} Closed Category: \`#${categoryClosed.name}\`\n${client.util.override} Claiming: \`${collected.claiming ? `On` : `Off`}\`\n${client.util.channel} Panel Channel: <#${collected.channel}>\n\u200b`, inline: false },
                { name: `Role Configuration`, value: `${client.util.moderator} Support Roles:\n<@&${collected.support.join(">\n<@&")}>\n\n${client.util.moderator} Additional Roles:\n<@&${collected.additional.join(">\n<@&")}>` }
              ];

              const confirmBtn = client.buttons.confirm("Panel_Config_Confirm");
              const cancelBtn = client.buttons.cancel("Panel_Config_Cancel");
              const btnFilter = () => true;
              var clicked = false;

              const embed = client.embeds.fieldGreen(command.option.new, `This prompt has been completed.\nClick on a button below to confirm or cancel the configuration.\n\u200b`, fields);

              const confirmMsg = await message.channel.send({ embed: embed, buttons: [confirmBtn, cancelBtn] });
              const confirmCollector = confirmMsg.createButtonCollector(btnFilter, { idle: 60 * 1000 });

              confirmCollector.on("collect", async (button) => {
                if (button.clicker.user.id !== message.author.id) {
                  const embed = client.embeds.permission(command.option.new, `ADMINISTRATOR`);
                  return button.reply.send({ embed: embed, ephemeral: true });
                }

                if (button.id == "Panel_Config_Confirm") {
                  const newCount = tsettings.panels.count + 1;
                  const panels = Object.fromEntries(tsettings.panels.all)

                  panels[newCount] = {
                    name: collected.name,
                    opened: collected.opened,
                    closed: collected.closed,
                    claiming: collected.claiming,
                    channel: collected.channel,
                    support: collected.support,
                    additional: collected.additional,
                    id: newCount
                  }

                  await client.db.panels.set(message.guild.id, newCount, "count");
                  await client.db.panels.set(message.guild.id, panels, "panels");

                  const embed = client.embeds.success(command.option.new, `Created a new panel with the name: \`${collected.name}\`.`);
                  await button.reply.send(embed);

                  clicked = true;
                  confirmMsg.delete();
                  confirmCollector.stop();

                } else {
                  const embed = client.embeds.success(command.option.new, `Cancelled the panel setup prompt.`);
                  await button.reply.send(embed);

                  clicked = true;
                  confirmMsg.delete();
                  confirmCollector.stop();
                }
              })

              confirmCollector.on("end", async () => {
                if (!clicked) {
                  const embed = client.embeds.error(command.option.new, `This prompt has timed out due to inactivity.`);
                  await message.channel.send(embed);
                  confirmMsg.delete();
                }
              })

            } else if (cancelled) {
              const embed = client.embeds.success(command.option.new, `This prompt has been cancelled.`);
              message.channel.send(embed);

            } else if (attempted) {
              const embed = client.embeds.error(command.option.new, `This prompt has been stopped.`);
              message.channel.send(embed);

            } else {
              const embed = client.embeds.error(command.option.new, `This prompt has timed out due to inactivity.`);
              message.channel.send(embed);
            }
          });

          break;
        }
        case "m":
        case "modify":
        {
          break;
        }
        case "d":
        case "delete":
        {
          break;
        }
      }
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, true, message, command);
  }
}