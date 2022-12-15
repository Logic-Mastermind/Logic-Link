import Discord from "discord.js";
import Types from "../../types";

export default async function run(client: Types.client, message: Discord.Message, args: string[], command: Types.commandData, settings: Types.guildSettings, tsettings: Types.ticketSettings, extra: Types.extraObject) {
  
  const clientMember = message.guild.me;
  const guildPrefix = client.functions.fetchPrefix(message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = client.functions.getArgs(args);
  const code = `\`\`\``;

  try {
    let user = message.mentions.users.first();
    let reason = client.util.messages.reason;
    let mentioned = true;

    if (!user) {
      user = (await client.functions.findBan(secArg, message.guild))?.user;
      mentioned = false;
    }

    if (thirdArg) reason = args.slice(1).join(" ");
    if (user) {
      if (mentioned) {
        const bans = await message.guild.bans.fetch();
        
        if (!bans.get(user.id)) {
          const embed = client.embeds.error(command, `This user is not banned from this server.`);
          return message.reply({ embeds: [embed] });
        }
      }

      message.guild.members.unban(user, reason)
      .then(() => {
        const fields = [];
        if (reason !== client.util.messages.reason) fields[0] = {
          name: "Reason",
          value: reason,
          inline: false
        }

        const caseData: Types.caseData = {
          type: "UNBAN",
          user: user.id,
          moderator: message.author.id,
          reason,
          timestamp: Math.round(Date.now() / 1000)
        }

        client.functions.createCase(caseData, message.guild);
        const embed = client.embeds.success(command, `Un-banned <@${user.id}> from the server.`, fields);
        message.reply({ embeds: [embed] });
      })
      .catch((error) => {
        const embed = client.embeds.errorInfo(command, message, error);
        message.reply({ embeds: [embed] });
      });
    } else {
      const embed = client.embeds.invalidItem(command, ["user"], [secArg]);
      message.reply({ embeds: [embed] });
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, message, command, extra.logId);
  }
}