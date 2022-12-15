import Discord from "discord.js";
import Types from "../../types";

export default async function run(client: Types.client, message: Discord.Message, args: string[], command: Types.commandData, settings: Types.guildSettings, tsettings: Types.ticketSettings, extra: Types.extraObject) {
  
  const clientMember = message.guild.me;
  const guildPrefix = client.functions.fetchPrefix(message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = client.functions.getArgs(args);
  const code = `\`\`\``;

  try {
    let member = message.mentions.members.first();
    let reason = client.util.messages.reason;

    if (!member) member = client.functions.findMember(secArg, message.guild);
    if (thirdArg) reason = args.slice(1).join(" ");

    if (member) {
      if (!member.roles.cache.has(settings.mutedRole)) {
        const embed = client.embeds.error(command, `This member is not muted in this server.`);
        return message.reply({ embeds: [embed] });
      }

      member.roles.remove(settings.mutedRoleObj)
      .then(() => {
        const fields = [];
        if (reason !== client.util.messages.reason) fields[0] = {
          name: "Reason",
          value: reason,
          inline: false
        }

        const caseData: Types.caseData = {
          type: "UNMUTE",
          user: member.id,
          moderator: message.author.id,
          reason,
          timestamp: Math.round(Date.now() / 1000)
        }

        client.functions.createCase(caseData, message.guild);
        const embed = client.embeds.success(command, `Un-muted <@${member.id}> from the server.`, fields);
        message.reply({ embeds: [embed] });
      })
      .catch((error) => {
        const embed = client.embeds.errorInfo(command, message, error);
        message.reply({ embeds: [embed] });
      });
    } else {
      const embed = client.embeds.invalidItem(command, ["member"], [secArg]);
      message.reply({ embeds: [embed] });
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, message, command, extra.logId);
  }
}