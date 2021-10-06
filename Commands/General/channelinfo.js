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
      const emoji = `${channel.id == message.guild.rulesChannelId ? `${client.util.rules} Rules` : channel.type == "GUILD_TEXT" ? `${client.util.channel} Text` : channel.type == "GUILD_VOICE" ? `${client.util.voice} Voice` : channel.type == "GUILD_NEWS" ? `${client.util.news} News` : channel.type == "GUILD_CATEGORY" ? `${client.util.category} Category` : channel.type == "GUILD_STORE" ? `${client.util.store} Store` : channel.type == "GUILD_STAGE_VOICE" ? `${client.util.stage} Stage` : channel.type == "GUILD_NEWS_THREAD" || channel.type == "GUILD_PUBLIC_THREAD" ? `${client.util.thread} Thread` : channel.type == "GUILD_PRIVATE_THREAD" ? `${client.util.threadPrivate} Thread` : null}`;
      const messages = (await channel.messages.fetchPinned()).size;

      const info = {
        type: `${emoji} Channel`,
        name: `\`${channel.name}\``,
        overwrites: (await client.functions.getPermOverwrites(channel)).join("\n"),
        topic: channel.topic || "No Channel Topic",
        nsfw: channel.nsfw ? `NSFW.` : `Not NSFW.`,
        category: channel.parent ? `#${channel.parent.name}` : `No Channel Category.`,
        guild: channel.guild,
        position: `\`${channel.rawPosition || channel.guild.channels.cache.get(channel.parentId).rawPosition || 0}\``,
        id: `\`${channel.id}\``,
        mention: `<#${channel.id}>`,
        pinned: `\`${messages}\` Pinned Message${messages == 1 ? `` : `s`}`
      }
      
      const embed = client.embeds.itemInfo(command, "channel", info);
      message.reply({ embeds: [embed] });
    } else {
      const embed = client.embeds.noChannel(command, args.join(" "));
      message.reply({ embeds: [embed] });
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, message, command, extra.logId);
  }
}