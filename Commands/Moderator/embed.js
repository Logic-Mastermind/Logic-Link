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
    var args = args.join(" ");
    var title = args.split('~')[1];
    var description = title ? args.split(`${title}~`)[1] : args;

    if (title) {
      if (title.length > 256) {
        const embed = client.embeds.error(command, `The title must be 256 characters or less.`);
        return message.lineReply(embed);
      }
    }

    if (description.length > 4096) {
      const embed = client.embeds.error(command, `The description must be 4096 characters or less.`);
      return message.lineReply(embed);
    }

    const embed = client.embeds.blue(title, description, true);
    await message.channel.send(embed);
    message.delete({ timeout: 3000 });

  } catch (error) {
    client.functions.sendErrorMsg(error, true, message, command, extra.logId);
  }
}