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

  try {
    const pendingEmbed = client.embeds.pending(command, `Shutting down Logic Link...`);
    const editMsg = await message.lineReply(pendingEmbed);

    const successEmbed = client.embeds.success(command, `Shutdown Logic Link.`);
    await editMsg.edit(successEmbed)

    setTimeout(function() { client.destroy() }, 500);
  } catch (error) {
    client.functions.sendErrorMsg(error, true, message, command);
  }
}