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
    const pendingEmbed = client.embeds.pending(command, `Shutting down Logic Link...`);
    const editMsg = await message.reply({ embeds: [pendingEmbed] });

    const embed = client.embeds.success(command, `Shutdown Logic Link.`);
    await editMsg.edit({ embeds: [embed] });

    setTimeout(async () => { await client.destroy() }, 800);
  } catch (error) {
    client.functions.sendErrorMsg(error, message, command, extra.logId);
  }
}