import Discord from "discord.js";
import Types from "../../Typings/types";

export default async function run(client: Types.client, message: Discord.Message, args: string[], command: Types.commandData, settings: Types.guildSettings, tsettings: Types.ticketSettings, extra: Types.extraObject) {
  
  const clientMember = message.guild.me;
  const guildPrefix = client.functions.fetchPrefix(message.guild);
  
  const noArgs = client.functions.getNoArgs(command, message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = client.functions.getArgs(args);
  const code = `\`\`\``;
  const responses = {};

  try {
    let user = message.mentions.users.first();
    let reason = client.util.messages.reason;

    if (!user) user = await client.functions.findUser(secArg);
    if (thirdArg) reason = args.slice(1).join(" ");

    if (user) {
      const blacklistInfo = client.db.userGlobal.get(user.id, "blacklist");

      if (!blacklistInfo) {
        const embed = client.embeds.error(command, `This user is not blacklisted.`);
        return message.reply({ embeds: [embed] });
      }

      client.db.userGlobal.set(user.id, null, "blacklist");
      const embed = client.embeds.success(command, `Un-blacklisted \`${user.tag}\` from Logic Link.`, [{
        name: "Reason",
        value: reason
      }]);
      message.reply({ embeds: [embed] });
      
    } else {
      const embed = client.embeds.invalidItem(command, ["user"], [secArg]);
      message.reply({ embeds: [embed] });
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, message, command, extra.logId);
  }
}