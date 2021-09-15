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
    var member = message.mentions.members.first();
    var reason = "No reason was provided.";

    if (!member) member = await client.functions.findMember(secArg, message.guild);
    if (thirdArg) reason = args.slice(1).join(" ");

    if (member) {
      if (settings.mutedRoleObj) {
        if (!member.roles.cache.has(settings.mutedRole)) {
          const embed = client.embeds.error(command, `This member has not been muted.`);
          return message.lineReply(embed);
        }

        if (!clientMember.hasPermission("MANAGE_ROLES")) {
          const embed = client.embeds.botPermission("MANAGE_ROLES");
          return message.lineReply(embed);
        }

        member.roles.remove(settings.mutedRoleObj)
        .then(() => {
          const embed = client.embeds.success(command, `Un-muted <@${member.id}> from the server.\n\n**Reason**\n${reason}`);
          message.lineReply(embed);
        })
        .catch(async (error) => {
          const embed = await client.embeds.errorInfo(command, message, error);
          message.lineReply(embed);
        })
      } else {
        const embed = client.embeds.error(command, `This server does not have a muted role.`);
        message.lineReply(embed);
      }
    } else {
      const embed = client.embeds.noMember(command, secArg);
      message.lineReply(embed);
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, true, message, command);
  }
}