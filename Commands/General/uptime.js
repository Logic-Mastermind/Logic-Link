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