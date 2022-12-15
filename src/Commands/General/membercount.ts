import Discord from "discord.js";
import Types from "../../types";

export default async function run(client: Types.client, message: Discord.Message, args: string[], command: Types.commandData, settings: Types.guildSettings, tsettings: Types.ticketSettings, extra: Types.extraObject) {
  
  const clientMember = message.guild.me;
  const guildPrefix = client.functions.fetchPrefix(message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = client.functions.getArgs(args);
  const code = `\`\`\``;
  const responses = {};

  try {
    const fetched = await message.guild.members.fetch();
    const users = fetched.filter(m => !m.user.bot).size;
    const bots = fetched.filter(m => m.user.bot).size;
    const fields = [
      { name: "Information", value: `${client.util.emojis.members} Users: \`${users}\` Server Member${users == 1 ? `` : `s`}.\n🤖 Bots: \`${bots}\` Server Bot${bots == 1 ? `` : `s`}.` }
    ]

    const embed = client.embeds.blue(command, `${message.guild.name} has \`${fetched.size}\` members.`, fields);
    message.reply({ embeds: [embed] });
  } catch (error) {
    client.functions.sendErrorMsg(error, message, command, extra.logId);
  }
}