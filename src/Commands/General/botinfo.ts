import Discord from "discord.js";
import Types from "../../Typings/types";

export default async function run(client: Types.client, message: Discord.Message, args: string[], command: Types.commandData, settings: Types.guildSettings, tsettings: Types.ticketSettings, extra: Types.extraObject) {
  
  const clientMember = message.guild.me;
  const guildPrefix = client.functions.fetchPrefix(message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = client.functions.getArgs(args);
  const code = `\`\`\``;
  const responses = {};
  
  try {
    const fields = [
      {
        name: "Library",
        value: `Discord.js v${Discord.version}`,
        inline: false
      },
      {
        name: "Developer",
        value: `\`${(await client.users.fetch(client.config.devId)).tag}\``,
        inline: false
      }
    ];

    const embed = client.embeds.blue(command, `${client.util.messages.botInfo}\n\u200b`, fields);
    message.reply({ embeds: [embed] });
    
  } catch (error) {
    client.functions.sendErrorMsg(error, message, command, extra.logId);
  }
}