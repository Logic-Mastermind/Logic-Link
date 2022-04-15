import Discord from "discord.js";
import Types from "../../Typings/types";

export default async function run(client: Types.client, message: Discord.Message, args: string[], command: Types.commandData, settings: Types.guildSettings, tsettings: Types.ticketSettings, extra: Types.extraObject) {
  
  const clientMember = message.guild.me;
  const guildPrefix = client.functions.fetchPrefix(message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = client.functions.getArgs(args);
  const code = `\`\`\``;
  const responses = {};

  try {
    let member = message.mentions.members.first();
    if (secArg && (!member)) member = client.functions.findMember(args.join(" "), message.guild);
    if (!secArg && !member) member = message.member;

    if (member) {
      const avatar = member.user.displayAvatarURL({ dynamic: true, size: 1024 })
      const embed = client.embeds.new({ title: command.name, description: `\`${member.displayName}\`'s Avatar`, image: avatar });

      message.reply({ embeds: [embed] });
    } else {
      const embed = client.embeds.invalidItem(command, ["member"], [args.join(" ")]);
      message.reply({ embeds: [embed] });
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, message, command, extra.logId);
  }
}