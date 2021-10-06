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
    const cmd = client.commands.get("help");
    cmd.run(client, message, args[0] ? args : ["sup"], command, settings, tsettings, extra);
  } catch (error) {
    client.functions.sendErrorMsg(error, message, command, extra.logId);
  }
}