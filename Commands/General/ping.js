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
    const embed = client.embeds.pending(command, `Pinging...`);
    const msg = await message.reply({ embeds: [embed] });

    const roundTrip = msg.createdTimestamp - message.createdTimestamp;
    const wsPing = client.ws.ping;

    const fields = [
      { name: `Discord Latency`, value: `${wsPing}ms`, inline: true },
      { name: `Message Round Trip`, value: `${roundTrip}ms`, inline: true },      
    ];

    const embed1 = client.embeds.success(command, `Logic Link is online.`, fields);
    msg.edit({ embeds: [embed1] });
  } catch (error) {
    client.functions.sendErrorMsg(error, message, command, extra.logId);
  }
}