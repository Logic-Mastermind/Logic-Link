import Discord from "discord.js";
import Types from "../../types";

export default async function run(client: Types.client, message: Discord.Message, args: string[], command: Types.commandData, settings: Types.guildSettings, tsettings: Types.ticketSettings, extra: Types.extraObject) {
  
  const clientMember = message.guild.me;
  const guildPrefix = client.functions.fetchPrefix(message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = client.functions.getArgs(args);
  const code = `\`\`\``;
  const responses = {};

  try {
    let joined = args.join(" ");
    let title = joined.split(`"`)[1];
    let description = title ? joined.split(`${title}"`)[1] : joined;

    if (title) {
      if (title.length > 256) {
        const embed = client.embeds.error(command, `The title must be 256 characters or less.`);
        return message.reply({ embeds: [embed] });
      }
    }

    if (description.length > 4096) {
      const embed = client.embeds.error(command, `The description must be 4096 characters or less.`);
      return message.reply({ embeds: [embed] });
    }

    const embed = client.embeds.new({ title, description, footer: [message.author.tag, message.author.displayAvatarURL()] });
    await message.channel.send({ embeds: [embed] });
    setTimeout(() => message.delete(), 3000);

  } catch (error) {
    client.functions.sendErrorMsg(error, message, command, extra.logId);
  }
}