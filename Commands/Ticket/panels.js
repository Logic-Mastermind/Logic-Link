const Discord = require("discord.js");
const Buttons = require("discord-buttons");
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
          value: `\u200b\nThere are no panels to show for now.\nWhen you do create some, they will be showcased here.`,
          inline: false
        }
      }

      const embed = client.embeds.field(command, `${client.util.welcomeBotInfo}\n\n**Panels**\nBelow shows a list of ticket panels.\nTo view information about a specific panel, run: \`${guildPrefix}panel <id>\`.\nThis server has ${panelCount == 0 ? `no` : `\`${panelCount}\``} panel${panelCount == 1 ? `` : `s`}.\n\n${code}Panels${code}${(panelCount == 0 && (message.member.hasPermission("ADMINISTRATOR") || message.member.roles.cache.has(settings.adminRole))) ? `\n${client.util.warn} This server does not have any panels. Run \`${guildPrefix}panels new\` to create one.` : ``}\u200b`, fields);
      message.lineReply(embed);

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

            const embed = client.embeds.field(command, `Showing info for the panel with the ID: \`${secArg}\`.\nThis panel was created <t:${Math.round(panelInfo.createdAt / 1000)}:R> by <@${panelInfo.createdBy}>.\nTo modify this panel's configuration, run: \`${guildPrefix}panel modify ${panelInfo.id}\`.\n\u200b`, fields);
            message.lineReply(embed);
          } else {

          }
        } else {
          const embed = client.embeds.error(command, `\`${secArg}\` is not a valid panel ID.`);
          message.lineReply(embed);
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
          break;
        }
        case "d":
        case "del":
        case "delete":
        {
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
          message.lineReply(embed);
        }
      }
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, true, message, command);
  }
}