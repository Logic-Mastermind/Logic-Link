const Discord = require("discord.js");
const Buttons = require("discord-buttons");
const Prefix = require("discord-prefix");

exports.run = async (client, message, args, command, settings, tsettings, extra) => {
  var guildPrefix = Prefix.getPrefix(message.guild.id);
  if (!guildPrefix) guildPrefix = client.util.defaultPrefix;

  const clientMember = message.guild.me;
  const noArgs = await client.functions.getNoArgs(command, message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = await client.functions.getArgs(args);
  const code = `\`\`\``;

  const responses = {

  }

  try {
    const uptimeEmbed = client.embeds.green(command, `Logic Link has been online since <t:${client.readySince}:f>.\n\n**Relative Time**\n<t:${client.readySince}:R>.`);

    message.lineReply(uptimeEmbed)
  } catch (error) {
    client.functions.sendErrorMsg(error, true, message, command);
  }
}