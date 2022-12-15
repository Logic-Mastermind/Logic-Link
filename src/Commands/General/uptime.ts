import Discord from "discord.js";
import Types from "../../types";

export default async function run(client: Types.client, message: Discord.Message, args: string[], command: Types.commandData, settings: Types.guildSettings, tsettings: Types.ticketSettings, extra: Types.extraObject) {
  
  const clientMember = message.guild.me;
  const guildPrefix = client.functions.fetchPrefix(message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = client.functions.getArgs(args);
  const code = `\`\`\``;
  const responses = {};

  try {
    const fields = [
      { name: `Relative`, value: `<t:${client.readySince}:R>`, inline: true },
      { name: `Exact`, value: `<t:${client.readySince}:d>`, inline: true }
    ];

    const embed = client.embeds.success(command, `Logic Link has been online since <t:${client.readySince}:t>.`, fields);
    message.reply({ embeds: [embed] });
    
  } catch (error) {
    client.functions.sendErrorMsg(error, message, command, extra.logId);
  }
}