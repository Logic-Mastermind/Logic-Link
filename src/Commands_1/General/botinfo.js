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
      {
        name: "Library",
        value: `Discord.js V${Discord.version}`,
        inline: false
      },
      {
        name: "Developer",
        value: `<@${client.config.devId}>`,
        inline: false
      }
    ];

    const embed = client.embeds.blue(command, `${client.util.botInfo}\n\u200b`, fields);
    message.reply({ embeds: [embed] });
    
  } catch (error) {
    client.functions.sendErrorMsg(error, message, command, extra.logId);
  }
}