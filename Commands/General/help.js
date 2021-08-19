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
    const moderatorPermissions = `${message.member.roles.cache.has(settings.modRole) || message.member.roles.cache.has(settings.adminRole) || message.member.hasPermission("BAN_MEMBERS") || message.member.hasPermission("KICK_MEMBERS") || message.member.hasPermission("MANAGE_CHANNELS") || message.member.hasPermission("MANAGE_MESSAGES") ? `<:IconLock:868118375170211852> ` : `<:MessageFail:868113159737720912> `}`;

    const adminPermissions = `${message.member.roles.cache.has(settings.adminRole) || message.member.hasPermission("MANAGE_ROLES") || message.member.hasPermission("ADMINISTRATOR") ? `<:IconSettings:868117828341997588> ` : `<:MessageFail:868113159737720912> `}`;

    const cmdArray = [
      { name: `<:IconMembers:868118276310437898> General Commands`, value: `${code}\n${client.command.total.general.join("\n")}${code}`, inline: true },
      { name: `${moderatorPermissions}Moderator Commands`, value: `${code}\n${client.command.total.moderator.join("\n")}${code}`, inline: true },
      { name: `${adminPermissions}Administrator Commands`, value: `${code}\n${client.command.total.administrator.join("\n")}${code}`, inline: true }
    ]

    if (!secArg) {
      const helpEmbed = client.embeds.field(command, `${client.util.welcomeBotInfo}\n\n**Command List**\nBelow shows a list of available commands.\nTo get more details about a particular command, run: \`${guildPrefix}help [command]\`.\nIf you would like a detailed guide on the help menu, run \`${guildPrefix}help guide\`.\n\n${code}Commands${code}\n‎`, cmdArray)

      message.lineReply(helpEmbed)
    } else {
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

      if (infoCmd) {
        const embed = client.embeds.helpMenu(infoCmd, guildPrefix);
        message.lineReply(embed);
        
      } else {
        const embed = client.embeds.error(command, `\`${secArg}\` is not a valid command, refer to the help menu.`);
        message.lineReply(embed);
      }
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, true, message, command);
  } 
}