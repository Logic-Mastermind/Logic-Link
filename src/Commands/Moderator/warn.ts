import Discord from "discord.js";
import Types from "../../Typings/types";

export default async function run(client: Types.client, message: Discord.Message, args: string[], command: Types.commandData, settings: Types.guildSettings, tsettings: Types.ticketSettings, extra: Types.extraObject) {
  
  const clientMember = message.guild.me;
  const guildPrefix = client.functions.fetchPrefix(message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = client.functions.getArgs(args);
  const code = `\`\`\``;

  try {
    let member = message.mentions.members.first();
    let warning = client.util.messages.reason;

    if (!member) member = client.functions.findMember(secArg, message.guild);
    if (thirdArg) warning = args.slice(1).join(" ");
    if (secArg.toLowerCase() == "me") member = message.member;

    if (member) {
      if (warning.length > 512) {
        const embed = client.embeds.error(command, `This warning is over the 512 character limit.`);
        return message.reply({ embeds: [embed] });
      }

      const caseData: Types.caseData = {
        type: "WARN",
        user: member.id,
        moderator: message.author.id,
        reason: warning,
        timestamp: Math.round(Date.now() / 1000)
      }

      client.functions.createCase(caseData, message.guild);
      const filteredCases = client.functions.filterCases(settings.cases, { user: member.id });
      
      const warnedEmbed = client.embeds.moderated("WARN", message.guild, warning);
      if (!member.user.bot) member.user.send({ embeds: [warnedEmbed] });

      const embed = client.embeds.success(command, `Logged a warning for <@${member.id}>, they now have ${filteredCases.size} warning${filteredCases.size == 1 ? `` : `s`}.`);
      message.reply({ embeds: [embed] });

    } else {
      const embed = client.embeds.invalidItem(command, ["member"], [secArg]);
      message.reply({ embeds: [embed] });
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, message, command, extra.logId);
  }
}