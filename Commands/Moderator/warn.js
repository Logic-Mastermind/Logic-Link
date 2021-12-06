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
    var warning = client.util.reason;

    if (!member) member = await client.functions.findMember(secArg, message.guild);
    if (thirdArg) warning = args.slice(1).join(" ");
    if (secArg.toLowerCase() == "me") member = message.member;

    if (member) {
      if (warning.length > 512) {
        const embed = client.embeds.error(command, `This warning is over the 512 character limit.`);
        return message.reply({ embeds: [embed] });
      }

      var caseData = {
        type: "WARN",
        user: member.id,
        moderator: message.author.id,
        reason: warning,
        timestamp: Math.round(Date.now() / 1000)
      }

      client.functions.createCase(caseData, settings, message.guild);
      const filteredCases = client.functions.filterCases(settings.cases, member.id, true);
      
      const warnedEmbed = client.embeds.moderated("warn", message.guild, warning);
      if (!member.user.bot) member.user.send({ embeds: [warnedEmbed] });

      const embed = client.embeds.success(command, `Logged a warning for <@${member.id}>, they now have ${filteredCases.size} warning${filteredCases.size == 1 ? `` : `s`}.`);
      message.reply({ embeds: [embed] });

    } else {
      const embed = client.embeds.noMember(command, secArg);
      message.reply({ embeds: [embed] });
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, message, command, extra.logId);
  }
}