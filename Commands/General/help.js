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
    var hasSupportRole = false;

    for await (const [key, val] of tsettings.panels.all) {
      for await (const role of val.support) {
        if (message.member.roles.cache.has(role)) {
          hasSupportRole = true;
          break;
        }
      }
    }

    const supportMember = await client.guilds.cache.get(client.util.supportServer).members.cache.get(message.author.id);
    const noPanels = tsettings.panels.count == 0;

    const moderatorPermissions = `${message.member.roles.cache.has(settings.modRole) || message.member.roles.cache.has(settings.adminRole) || message.member.hasPermission("BAN_MEMBERS") || message.member.hasPermission("KICK_MEMBERS") || message.member.hasPermission("MANAGE_CHANNELS") || message.member.hasPermission("MANAGE_MESSAGES") ? `<:IconLock:868118375170211852> ` : `${client.util.error} `}`;

    const adminPermissions = `${message.member.roles.cache.has(settings.adminRole) || message.member.hasPermission("MANAGE_ROLES") || message.member.hasPermission("ADMINISTRATOR") ? `<:IconSettings:868117828341997588> ` : `${client.util.error} `}`;

    const ticketPermissions = `${(hasSupportRole || message.member.hasPermission("ADMINISTRATOR") || message.member.roles.cache.has(settings.adminRole)) ? `${client.util.panel} ` : `${client.util.error} `}`;
    const supportPermissions = `${supportMember.roles.cache.has(client.util.supportRole) && (message.guild.id == client.util.supportServer) ? `${client.util.support} ` : `${client.util.error} `}`;
    const devPermissions = message.author.id == client.util.devId ? `${client.util.integration} ` : null;

    const cmdArray = [
      { name: `<:IconMembers:868118276310437898> General Commands`, value: `${code}\n${guildPrefix}help general${code}\u200b`, inline: true },
      { name: `${moderatorPermissions}Moderator Commands`, value: `${code}\n${guildPrefix}help moderator${code}`, inline: true },
      { name: `${adminPermissions}Administrator Commands`, value: `${code}\n${guildPrefix}help administrator${code}`, inline: true },
      { name: `${ticketPermissions}Ticket Commands`, value: `${code}\n${guildPrefix}help ticket${code}`, inline: true },
      { name: `${supportPermissions}Support Commands`, value: `${code}\n${guildPrefix}help support${code}`, inline: true },
    ]

    if (devPermissions) {
      cmdArray[5] = { name: `${devPermissions}Developer Commands`, value: `${code}\n${guildPrefix}help developer${code}`, inline: true }
    }

    if (!secArg) {
      const helpEmbed = client.embeds.field(command, `${client.util.welcomeBotInfo}\n\n**Command List**\nBelow shows a list of command categories.\nTo view commands in each category, run the command associated with it.\nIf you would like a detailed guide on the help menu, run \`${guildPrefix}help guide\`.\n\n${code}Commands${code}\u200b`, cmdArray)

      message.lineReply(helpEmbed)
    } else {
      switch (secArg) {
        case "g":
        case "gen":
        case "general":
        {
          const cmdArray = [
            { name: `${client.util.members} General Commands`, value: `${code}\n${client.command.total.general.join("\n")}${code}`, inline: true },
            { name: client.util.whitespace, value: `\u200b`, inline: true },
            { name: client.util.whitespace, value: `\u200b`, inline: true }
          ]

          const helpEmbed = client.embeds.field(command, `${client.util.welcomeBotInfo}\n\n**Command List**\nBelow shows a list of available general commands.\nTo get more details about a particular command, run: \`${guildPrefix}help [command]\`.\nIf you would like a detailed guide on the help menu, run \`${guildPrefix}help guide\`.\n\n${code}General Commands${code}\u200b`, cmdArray);

          message.lineReply(helpEmbed);
          break;
        }
        case "m":
        case "mod":
        case "moderator":
        case "moderation":
        {
          const cmdArray = [
            { name: `${moderatorPermissions}Moderator Commands`, value: `${code}\n${client.command.total.moderator.join("\n")}${code}`, inline: true },
            { name: client.util.whitespace, value: `\u200b`, inline: true },
            { name: client.util.whitespace, value: `\u200b`, inline: true }
          ]

          const helpEmbed = client.embeds.field(command, `${client.util.welcomeBotInfo}\n\n**Command List**\nBelow shows a list of available moderator commands.\nTo get more details about a particular command, run: \`${guildPrefix}help [command]\`.\nIf you would like a detailed guide on the help menu, run \`${guildPrefix}help guide\`.\n\n${code}Moderator Commands${code}\u200b`, cmdArray);

          message.lineReply(helpEmbed);
          break;
        }
        case "a":
        case "adm":
        case "admin":
        case "administrator":
        case "administration":
        {
          const cmdArray = [
            { name: `${adminPermissions}Administrator Commands`, value: `${code}\n${client.command.total.administrator.join("\n")}${code}`, inline: true },
            { name: client.util.whitespace, value: `\u200b`, inline: true },
            { name: client.util.whitespace, value: `\u200b`, inline: true }
          ]

          const helpEmbed = client.embeds.field(command, `${client.util.welcomeBotInfo}\n\n**Command List**\nBelow shows a list of available administrator commands.\nTo get more details about a particular command, run: \`${guildPrefix}help [command]\`.\nIf you would like a detailed guide on the help menu, run \`${guildPrefix}help guide\`.\n\n${code}Administrator Commands${code}\u200b`, cmdArray);

          message.lineReply(helpEmbed);
          break;
        }
        case "t":
        case "tck":
        case "ticket":
        case "tickets":
        {
          const cmdArray = [
            { name: `${client.util.members} Basic Commands`, value: `${code}\n${client.command.total.ticket.basic.join("\n")}${code}`, inline: true },
            { name: `${ticketPermissions}Support Commands`, value: `${code}\n${client.command.total.ticket.support.join("\n")}${code}`, inline: true },
            { name: `${adminPermissions}Administrator Commands`, value: `${code}\n${client.command.total.ticket.admin.join("\n")}${code}`, inline: true }
          ]

          const embed = client.embeds.field(command, `${client.util.welcomeBotInfo}\n\n**Command List**\nBelow shows a list of available ticket commands.\nTo get more details about a particular command, run: \`${guildPrefix}help [command]\`.\nIf you would like a detailed guide on the help menu, run \`${guildPrefix}help guide\`.\n\n${code}Ticket Commands${code}\u200b${(noPanels && (message.member.hasPermission("ADMINISTRATOR") || message.member.roles.cache.has(settings.adminRole))) ? `\n${client.util.warn} This server does not have any panels. Run \`${guildPrefix}panels new\` to create one.\n` : ``}`, cmdArray);
          message.lineReply(embed);
          break;
        }
        case "s":
        case "sup":
        case "support":
        {
          const cmdArray = [
            { name: `${supportPermissions}Support Commands`, value: `${code}\n${client.command.total.support.join("\n")}${code}`, inline: true },
            { name: client.util.whitespace, value: `\u200b`, inline: true },
            { name: client.util.whitespace, value: `\u200b`, inline: true }
          ]

          const helpEmbed = client.embeds.field(command, `${client.util.welcomeBotInfo}\n\n**Command List**\nBelow shows a list of available support commands.\nTo get more details about a particular command, run: \`${guildPrefix}help [command]\`.\nIf you would like a detailed guide on the help menu, run \`${guildPrefix}help guide\`.\n\n${code}Support Commands${code}\u200b`, cmdArray);

          message.lineReply(helpEmbed);
          break;
        }
        case "d":
        case "dev":
        case "developer":
        {
          const cmdArray = [
            { name: `${devPermissions}Developer Commands`, value: `${code}\n${client.command.total.developer.join("\n")}${code}`, inline: true },
            { name: client.util.whitespace, value: `\u200b`, inline: true },
            { name: client.util.whitespace, value: `\u200b`, inline: true }
          ]

          const helpEmbed = client.embeds.field(command, `${client.util.welcomeBotInfo}\n\n**Command List**\nBelow shows a list of all developer commands.\nTo get more details about a particular command, run: \`${guildPrefix}help [command]\`.\nIf you would like a detailed guide on the help menu, run \`${guildPrefix}help guide\`.\n\n${code}Developer Commands${code}\u200b`, cmdArray);

          message.lineReply(helpEmbed);
          break;
        }
        default:
        {
          if (secArg == "guide") {
            const embed = client.embeds.blue(command, `\`<>\` <:Line:867201669371265054> Required field.\n\`[]\` <:Line:867201669371265054> Optional field.\n\`|\` <:Line:867201669371265054> Or indicator.`);
            return message.lineReply(embed)
          }
          
          var infoCmd = null;
          for (const [name, info] of Object.entries(client.command.general)) {
            if (infoCmd) break;
            if (secArg == info.commandName || info.aliases.includes(secArg)) {
              infoCmd = info;
              break;
            }
          }

          for (const [name, info] of Object.entries(client.command.administrator)) {
            if (infoCmd) break;
            if (secArg == info.commandName || info.aliases.includes(secArg)) {
              infoCmd = info;
              break;
            }
          }

          for (const [name, info] of Object.entries(client.command.moderator)) {
            if (infoCmd) break;
            if (secArg == info.commandName || info.aliases.includes(secArg)) {
              infoCmd = info;
              break;
            }
          }

          for (const [name, info] of Object.entries(client.command.developer)) {
            if (infoCmd) break;
            if (secArg == info.commandName || info.aliases.includes(secArg)) {
              infoCmd = info;
              break;
            }
          }

          for (const [name, info] of Object.entries(client.command.support)) {
            if (infoCmd) break;
            if (secArg == info.commandName || info.aliases.includes(secArg)) {
              infoCmd = info;
              break;
            }
          }

          for (const [name, info] of Object.entries(client.command.ticket)) {
            if (infoCmd) break;
            if (secArg == info.commandName || info.aliases.includes(secArg)) {
              infoCmd = info;
              break;
            }
          }

          if (infoCmd) {
            const embed = client.embeds.helpMenu(infoCmd, guildPrefix);
            message.lineReply(embed);
            
          } else {
            const embed = client.embeds.detailed(command, `I could not find a command or category that matched that query.`, `\`${secArg}\` is not a command or category.`);
            message.lineReply(embed);
          }
        }
      }
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, true, message, command);
  } 
}