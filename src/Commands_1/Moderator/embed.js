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

    const embed = client.embeds.custom(title, description);
    await message.channel.send({ embeds: [embed] });
    message.delete({ timeout: 3000 });

  } catch (error) {
    client.functions.sendErrorMsg(error, message, command, extra.logId);
  }
}