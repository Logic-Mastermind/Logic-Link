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
    if (!secArg) {
      var hasSupportRole = false;

      for (const [key, val] of Object.entries(tsettings.panels.all)) {
        for (const role of val.support) {
          if (message.member.roles.cache.has(role)) {
            hasSupportRole = true;
            break;
          }
        }
      }

      const noPanels = tsettings.panels.count == 0 ? true : false;
      const supportPermissions = `${hasSupportRole || message.member.hasPermission("ADMINISTRATOR") || message.member.roles.cache.has(settings.adminRole) ? `${client.util.support} ` : `${client.util.error} `}`;

      const adminPermissions = `${message.member.hasPermission("ADMINISTRATOR") || message.member.roles.cache.has(settings.adminRole) ? `${client.util.settings} ` : `${client.util.error} `}`;

      const cmdArray = [
        { name: `${client.util.members} Basic Commands`, value: `${code}\n${client.command.total.ticket.basic.join("\n")}${code}`, inline: true },
        { name: `${supportPermissions}Support Commands`, value: `${code}\n${client.command.total.ticket.support.join("\n")}${code}`, inline: true },
        { name: `${adminPermissions}Administrator Commands`, value: `${code}\n${client.command.total.ticket.admin.join("\n")}${code}`, inline: true }
      ]

      const embed = client.embeds.field(command, `${client.util.welcomeBotInfo}\n\n**Command List**\nBelow shows a list of available ticket commands.\nTo get more details about a particular command, run: \`${guildPrefix}thelp [command]\`.\nIf you would like a detailed guide on the help menu, run \`${guildPrefix}thelp guide\`.\n\n${code}Ticket Commands${code}\u200b${(noPanels && (message.member.hasPermission("ADMINISTRATOR") || message.member.roles.cache.has(settings.adminRole))) ? `\n${client.util.warn} This server does not have any panels. Run \`${guildPrefix}panels new\` to create one.\n` : ``}`, cmdArray);
      message.lineReply(embed);
      
    } else {

    }
  } catch (error) {
    client.functions.sendErrorMsg(error, true, message, command);
  }
}