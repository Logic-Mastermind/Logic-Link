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
    var reason = client.util.reason;

    if (!member) member = await client.functions.findMember(secArg, message.guild);
    if (thirdArg) reason = args.slice(1).join(" ");

    if (member) {
      if (!member.roles.cache.has(settings.mutedRole)) {
        const embed = client.embeds.error(command, `This member is not muted in this server.`);
        return message.reply({ embeds: [embed] });
      }

      member.roles.remove(settings.mutedRoleObj)
      .then(() => {
        const fields = [];
        if (reason !== client.util.reason) fields[0] = {
          name: "Reason",
          value: reason,
          inline: false
        }

        const caseData = {
          type: "UNMUTE",
          user: member.id,
          moderator: message.author.id,
          reason: reason,
          timestamp: Math.round(Date.now() / 1000)
        }

        client.functions.createCase(caseData, settings, message.guild);
        const embed = client.embeds.success(command, `Un-muted <@${member.id}> from the server.`, fields);
        message.reply({ embeds: [embed] });
      })
      .catch(async (error) => {
        const embed = await client.embeds.errorInfo(command, message, error);
        message.reply({ embeds: [embed] });
      });
    } else {
      const embed = client.embeds.noMember(command, secArg);
      message.reply({ embeds: [embed] });
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, message, command, extra.logId);
  }
}