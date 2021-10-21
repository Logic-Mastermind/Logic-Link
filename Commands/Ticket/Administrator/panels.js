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
    const panelIds = Array.from(tsettings.panels.all.keys());
    const panelCount = tsettings.panels.count;

    if (!secArg) {
      const fields = [];
      tsettings.panels.all.forEach((v, k) => {
        if (v.id <= "2") {
          var opened = message.guild.channels.cache.get(v.opened);
          var closed = message.guild.channels.cache.get(v.closed);

          fields[k - 1] = {
            name: `${client.util.panel} Panel: \`${v.id}\``,
            value: `${client.util.text} Name: \`${v.name}\`\n${client.util.category} Opened Category: \`#${opened.name}\`\n${client.util.category} Closed Category: \`#${closed.name}\`\n${client.util.override} Claiming: \`${v.claiming ? `On` : `Off`}\`\n${client.util.channel} Panel Channel: <#${v.channel}>`,
            inline: true
          }
        }
      });

      if (panelCount == 0) {
        fields[0] = {
          name: `${client.util.panel} Panel: \`None\``,
          value: `\u200b\nThere are no panels to show for now.\nWhen you do create some, they will be showcased here.`,
          inline: false
        }
      }

      const embed = client.embeds.blue(command, `${client.util.welcomeBotInfo}\n\n**Panels**\nBelow shows a list of ticket panels.\nTo view information about a specific panel, run: \`${guildPrefix}panel <id>\`.\nThis server has ${panelCount == 0 ? `no` : `\`${panelCount}\``} panel${panelCount == 1 ? `` : `s`}.\n\n${code}Panels${code}${(panelCount == 0 && (message.member.permissions.has("ADMINISTRATOR") || message.member.roles.cache.has(settings.adminRole))) ? `\n${client.util.warn} This server does not have any panels. Run \`${guildPrefix}panels new\` to create one.` : ``}\u200b`, fields);
      message.reply({ embeds: [embed] });

    } else {
      if (!isNaN(secArg)) {
        if (panelIds.includes(secArg)) {
          if (!thirdArg) {
            const panelInfo = tsettings.panels.all.get(secArg);
            var opened = message.guild.channels.cache.get(panelInfo.opened);
            var closed = message.guild.channels.cache.get(panelInfo.closed);
            
            const fields = [
              { name: `Panel Configuration`, value: `${client.util.text} Name: \`${panelInfo.name}\`\n${client.util.category} Opened Category: \`#${opened.name}\`\n${client.util.category} Closed Category: \`#${closed.name}\`\n${client.util.message} Ticket Format: \`${panelInfo.ticket}\`${panelInfo.claiming ? `\n${client.util.message} Claimed Format: \`${panelInfo.claimed}\`` : ``}\n${client.util.override} Claiming: \`${panelInfo.claiming ? `On` : `Off`}\`\n${client.util.channel} Panel Channel: <#${panelInfo.channel}>\n\u200b` },

              { name: `Role Configuration`, value: `${client.util.moderator} Support Roles:\n<@&${panelInfo.support.join(">\n<@&")}>\n\n${client.util.moderator} Additional Roles:\n<@&${panelInfo.additional.join(">\n<@&")}>` }
            ];

            const embed = client.embeds.blue(command, `Showing info for the panel with the ID: \`${secArg}\`.\nThis panel was created <t:${Math.round(panelInfo.createdAt / 1000)}:R> by <@${panelInfo.createdBy}>.\nTo modify this panel's configuration, run: \`${guildPrefix}panel modify ${panelInfo.id}\`.\n\u200b`, fields);
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
            if (panelIds.includes(thirdArg)) {
              const embed = client.embeds.orange(command.option.modify, `What panel option would you like to modify?\nSelect the option(s) that you would like to modify from the menu below.`);

              const select = await client.buttons.selectMenu("Select options...", [
                { label: "Name", value: "Change the name of the panel.", id: "Panel_Modify:Name", emoji: "" },
                { label: "Opened Category", value: "Change the opened ticket category.", id: "Panel_Modify:Opened", emoji: "" },
                { label: "Closed Category", value: "Change the closed ticket category.", id: "Panel_Modify:Closed", emoji: "" },
                { label: "Claiming", value: "Enable or disable ticket claiming", id: "Panel_Modify:Claiming", emoji: "" },
                { label: "Panel Channel", value: "Change the channel where the panel is sent to.", id: "Panel_Modify:Channel", emoji: "" },
                { label: "Support Roles", value: "Change the support roles for this panel.", id: "Panel_Modify:Support", emoji: "" },
                { label: "Additional Roles", value: "Change the additional roles for this panel.", id: "Panel_Modify:Additional", emoji: "" },
                { label: "Ticket Format", value: "Change the ticket format for new tickets.", id: "Panel_Modify:Ticket", emoji: "" },
                { label: "Claimed Format", value: "Change the ticket format for claimed tickets.", id: "Panel_Modify:Claimed", emoji: "" },
              ], "Panel_Settings:Modify", 1);
              
              const row = client.buttons.actionRow([select]);
              const msg = await message.reply({ embeds: [embed], components: [row] });
              client.prompts.modifyPanel(command, msg, thirdArg, tsettings);
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
            if (panelIds.includes(thirdArg)) {
              const panelInfo = tsettings.panels.all.get(thirdArg);
              const confirmBtn = client.buttons.confirm("Panel_Delete:Confirm");
              const cancelBtn = client.buttons.cancel("Panel_Delete:Cancel");

              const embed = client.embeds.blue(command.option.delete, `Are you sure you would like to delete this panel?\nClick on a button below to either confirm or cancel your choice.\n\n**Panel Info**\n${client.util.clock} Created At: <t:${Math.round(panelInfo.createdAt / 1000)}:R>\n${client.util.moderator} Created By: <@${panelInfo.createdBy}>\n${client.util.text} Panel Name: \`${panelInfo.name}\``);

              const confirmMsg = await message.channel.send({ embed: embed, buttons: [confirmBtn, cancelBtn] });
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