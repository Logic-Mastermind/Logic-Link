const Discord = require("discord.js");
const Fetch = require("node-fetch");

exports.run = async (client, message, args, command, settings, tsettings, extra) => {
  const clientMember = message.guild.me;
  const guildPrefix = await client.functions.fetchPrefix(message.guild);
  
  const noArgs = await client.functions.getNoArgs(command, message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = await client.functions.getArgs(args);
  const code = `\`\`\``;
  const responses = {};

  try {
    const panelIds = Array.from(tsettings.panels.keys());
    const panelCount = tsettings.panels.size;

    if (!secArg) {
      const fields = [];
      tsettings.panels.forEach((v, k) => {
        if (v.id <= 2) {
          fields.push({
            name: `${client.util.panel} Panel: \`${v.id}\``,
            value: `${client.util.text} Name: \`${v.name}\`\n${client.util.moderator} Created By: <@${v.createdBy}>\n${client.util.clock} Created At: <t:${Math.round(v.createdAt / 1000)}:R>\n${client.util.ticket} Active Tickets: \`${v.tickets.size}\``,
            inline: true
          });
        }
      });
      
      if (panelCount == 0) {
        fields[0] = {
          name: `${client.util.panel} Panel: \`None\``,
          value: `\u200b\nThere are no panels to show for now.\nWhen you do create some, they will be showcased here.`,
          inline: false
        }
      }

      const embed = client.embeds.blue(command, `${client.util.welcomeBotInfo}\n\n**Panels**\nBelow shows a list of ticket panels.\nTo view a list of further commands, run \`${guildPrefix}panels help\`.\nThis server has ${panelCount == 0 ? `no` : `\`${panelCount}\``} panel${panelCount == 1 ? `` : `s`}.\n\n${code}Panels${code}${(panelCount == 0 && (message.member.permissions.has("ADMINISTRATOR") || message.member.roles.cache.has(settings.adminRole))) ? `\n${client.util.warn} This server does not have any panels. Run \`${guildPrefix}panels new\` to create one.` : ``}\u200b`, fields);
      message.reply({ embeds: [embed] });

    } else {
      if (!isNaN(secArg)) {
        let id = Number(secArg);

        if (panelIds.includes(id)) {
          if (!thirdArg) {
            const panelInfo = tsettings.panels.get(id);
            let opened = message.guild.channels.cache.get(panelInfo.opened);
            let closed = message.guild.channels.cache.get(panelInfo.closed);
            
            const fields = [
              { name: `Panel Configuration`, value: `${client.util.text} Name: \`${panelInfo.name}\`\n${client.util.category} Opened Category: \`#${opened.name}\`\n${client.util.category} Closed Category: \`#${closed.name}\`\n${client.util.message} Ticket Format: \`${panelInfo.ticket}\`${panelInfo.claiming ? `\n${client.util.message} Claimed Format: \`${panelInfo.claimed}\`` : ``}\n${client.util.override} Claiming: \`${panelInfo.claiming ? `On` : `Off`}\`\n${client.util.channel} Panel Channel: <#${panelInfo.channel}>\n\u200b` },

              { name: `Role Configuration`, value: `${client.util.moderator} Support Roles:\n<@&${panelInfo.support.join(">\n<@&")}>\n\n${client.util.moderator} Additional Roles:\n<@&${panelInfo.additional.join(">\n<@&")}>` }
            ];

            const embed = client.embeds.blue(command, `Showing info for the panel with the ID: \`${panelInfo.id}\`.\nThis panel was created <t:${Math.round(panelInfo.createdAt / 1000)}:R> by <@${panelInfo.createdBy}>.\nTo modify this panel's configuration, run: \`${guildPrefix}panel modify ${panelInfo.id}\`.\n\u200b`, fields);
            message.reply({ embeds: [embed] });
          }
        } else {
          const embed = client.embeds.error(command, `\`${secArg}\` is not a valid panel ID.`);
          message.reply({ embeds: [embed] });
        }
        return;
      }

      switch (secArg) {
        case "n":
        case "new":
        {
          client.prompts.newPanel(settings, tsettings, message, command);
          break;
        }
        case "m":
        case "mod":
        case "modify":
        {
          if (thirdArg) {
            let id = Number(thirdArg);
            if (panelIds.includes(id)) {
              const embed = client.embeds.blue(command.option.modify, `What panel option would you like to modify?\nSelect the option(s) that you would like to modify from the menu below.`);

              const select = await client.buttons.selectMenu("Select options...", [
                { label: "Name", value: "Change the name of the panel.", id: "name", emoji: "868119251897163786" },
                { label: "Opened Category", value: "Change the opened ticket category.", id: "opened", emoji: "868119798620512297" },
                { label: "Closed Category", value: "Change the closed ticket category.", id: "closed", emoji: "868119798620512297" },
                { label: "Claiming", value: "Enable or disable ticket claiming", id: "claiming", emoji: "868118920140300339" },
                { label: "Panel Channel", value: "Change the channel where the panel is sent to.", id: "channel", emoji: "868119367689334834" },
                { label: "Support Roles", value: "Change the support roles for this panel.", id: "support", emoji: "868117933237358642" },
                { label: "Additional Roles", value: "Change the additional roles for this panel.", id: "additional", emoji: "868117933237358642" },
                { label: "Ticket Format", value: "Change the ticket format for new tickets.", id: "ticket", emoji: "868113305565278218" },
                { label: "Claimed Format", value: "Change the ticket format for claimed tickets.", id: "claimed", emoji: "868113305565278218" },
              ], "Panel_Settings:Modify", 1);
              
              const row = client.buttons.actionRow([select]);
              const msg = await message.reply({ embeds: [embed], components: [row] });
              client.prompts.modifyPanel(command, message, msg, id, tsettings);
            } else {
              const embed = client.embeds.error(command.option.modify, `\`${thirdArg}\` is not a valid panel ID.`);
              message.reply({ embeds: [embed] });
            }
          } else {
            const embed = await client.embeds.noArgs(command.option.modify, message.guild);
            message.reply({ embeds: [embed] });
          }
          break;
        }
        case "d":
        case "del":
        case "delete":
        {
          if (thirdArg) {
            let id = Number(thirdArg);

            if (panelIds.includes(id)) {
              const panelInfo = tsettings.panels.get(id);
              const confirmBtn = client.buttons.confirm("Panel_Delete:Confirm");
              const cancelBtn = client.buttons.cancel("Panel_Delete:Cancel");
              const row = client.buttons.actionRow([confirmBtn, cancelBtn]);

              const embed = client.embeds.blue(command.option.delete, `Are you sure you would like to delete this panel?\nClick on a button below to either confirm or cancel your choice.`, [{
                name: "Panel Info",
                value: `${client.util.clock} Created At: <t:${Math.round(panelInfo.createdAt / 1000)}:R>\n${client.util.moderator} Created By: <@${panelInfo.createdBy}>\n${client.util.text} Panel Name: \`${panelInfo.name}\``,
                inline: false
              }]);

              const confirmMsg = await message.channel.send({ embeds: [embed], components: [row] });
              client.prompts.deletePanel(confirmMsg, tsettings, panelInfo, command, message);
            } else {
              const embed = client.embeds.error(command.option.delete, `\`${thirdArg}\` is not a valid panel ID.`);
              message.reply({ embeds: [embed] });
            }
          } else {
            const embed = await client.embeds.noArgs(command.option.delete, message.guild);
            message.reply({ embeds: [embed] });
          }
          break;
        }
        case "a":
        case "all":
        {
          if (tsettings.panels.size == 0) {
            const embed = client.embeds.error(command, `This server has no panels, use the \`${guildPrefix}panels new\` command to create one.`);
            return message.reply({ embeds: [embed] });
          }

          let pages = [];
          for await (const [key, panelInfo] of tsettings.panels.entries()) {
            let opened = message.guild.channels.cache.get(panelInfo.opened);
            let closed = message.guild.channels.cache.get(panelInfo.closed);
            
            const fields = [
              { name: `Panel Configuration`, value: `${client.util.text} Name: \`${panelInfo.name}\`\n${client.util.category} Opened Category: \`#${opened.name}\`\n${client.util.category} Closed Category: \`#${closed.name}\`\n${client.util.message} Ticket Format: \`${panelInfo.ticket}\`${panelInfo.claiming ? `\n${client.util.message} Claimed Format: \`${panelInfo.claimed}\`` : ``}\n${client.util.override} Claiming: \`${panelInfo.claiming ? `On` : `Off`}\`\n${client.util.channel} Panel Channel: <#${panelInfo.channel}>\n\u200b` },

              { name: `Role Configuration`, value: `${client.util.moderator} Support Roles:\n<@&${panelInfo.support.join(">\n<@&")}>\n\n${client.util.moderator} Additional Roles:\n<@&${panelInfo.additional.join(">\n<@&")}>` }
            ];

            const embed = client.embeds.blue(command, `Showing info for the panel with the ID: \`${panelInfo.id}\`.\nThis panel was created <t:${Math.round(panelInfo.createdAt / 1000)}:R> by <@${panelInfo.createdBy}>.\nTo modify this panel's configuration, run: \`${guildPrefix}panel modify ${panelInfo.id}\`.\n\u200b`, fields);
            pages.push(embed);
          }

          const leftBtn = client.buttons.emoji("Button_Left:Panels", client.util.arrowLeft, "SECONDARY");
          const rightBtn = client.buttons.emoji("Button_Right:Panels", client.util.arrowRight, "SECONDARY");

          leftBtn.setDisabled();
          if (!pages[1]) rightBtn.setDisabled();
          const row = client.buttons.actionRow([leftBtn, rightBtn]);
          
          const msg = await message.reply({ embeds: [pages[0]], components: [row] });
          pages = await pages.slice(1);

          if (pages[0]) client.functions.paginate(msg, pages, (m) => m.id == message.author.id);
          break;
        }
        case "h":
        case "help":
        {
          const options = command.option;
          const embed = client.embeds.success(options.help, `Showing a list of all available command options.`, [
            {
              name: `\`${guildPrefix}${options.new.usage}\``,
              value: options.new.description,
              inline: false
            },
            {
              name: `\`${guildPrefix}${options.modify.usage}\``,
              value: options.modify.description,
              inline: false
            },
            {
              name: `\`${guildPrefix}${options.delete.usage}\``,
              value: options.delete.description,
              inline: false
            },
            {
              name: `\`${guildPrefix}${options.all.usage}\``,
              value: options.delete.description,
              inline: false
            },
            {
              name: `\`${guildPrefix}panels <id>\``,
              value: "Shows panel information for the selected panel.",
              inline: false
            }
          ]);
          message.reply({ embeds: [embed] });
          break;
        }
        default:
        {
          const embed = client.embeds.error(command, `\`${secArg}\` is not a valid command option.`);
          message.reply({ embeds: [embed] });
        }
      }
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, message, command, extra.logId);
  }
}