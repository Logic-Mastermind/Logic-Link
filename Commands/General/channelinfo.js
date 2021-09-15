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
    var channel = message.mentions.channels.first();
    if (!channel && secArg) channel = await client.functions.findChannel(args.join(" "), message.guild);
    if (!secArg && !channel) channel = message.channel;

    if (channel) {
      const emoji = `${channel.type == "text" ? client.util.channel : channel.type == "voice" ? client.util.voice : channel.type == "news" ? client.util.news : channel.type == "category" ? client.util.category : null}`;

      const info = {
        type: `${emoji} ${await client.functions.upperFirst(channel.type)} Channel`,
        name: channel.name,
        overwrites: await client.functions.getPermOverwrites(channel),
        topic: channel.topic || "No Channel Topic",
        nsfw: channel.nsfw,
        category: message.guild.channels.cache.get(channel.parentID),
        guild: message.guild,
        position: channel.rawPosition,
        id: channel.id
      }
      
      const embed = client.embeds.itemInfo(command, "channel", info);
      message.lineReply(embed);
    } else {
      const embed = client.embeds.noChannel(command, args.join(" "));
      message.lineReply(embed);
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, true, message, command, extra.logId);
  }
}