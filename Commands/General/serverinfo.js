const Discord = require("discord.js");
const Buttons = require("discord-buttons");
const Fetch = require("node-fetch");

exports.run = async (client, message, args, command, settings, tsettings, extra) => {
  const clientMember = message.guild.me;
  const guildPrefix = await client.functions.fetchPrefix(message.guild);
  
  const noArgs = await client.functions.getNoArgs(command, message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = await client.functions.getArgs(args);
  const code = `\`\`\``;
  const responses = {};

  try {
    const roleCount = message.guild.roles.cache.size - 1;
    const emojiCount = message.guild.emojis.cache.size;
    const memCount = message.guild.members.cache.size;

    const text = message.guild.channels.cache.filter(c => c.type == "text").size;
    const voice = message.guild.channels.cache.filter(c => c.type == "voice").size;
    const news = message.guild.channels.cache.filter(c => c.type == "news").size;
    
    const boostLvl = message.guild.premiumTier;
    const boosters = message.guild.premiumSubscriptionCount;

    const info = {
      owner: message.guild.owner.id,
      createdAt: Math.round(message.guild.joinedTimestamp / 1000),
      guild: message.guild,
      roles: `${client.util.moderator} ${roleCount} Role${roleCount == 1 ? `` : `s`}.`,
      emojis: `${client.util.sticker} ${emojiCount} Emoji${emojiCount == 1 ? `` : `s`}.`,
      members: `${client.util.members} ${memCount} Member${memCount == 1 ? `` : `s`}.`,
      channels: `${client.util.channel} ${text} Text Channel${text == 1 ? `` : `s`}.\n${client.util.voice} ${voice} Voice Channel${voice == 1 ? `` : `s`}.\n${client.util.news} ${news} News Channel${news == 1 ? `` : `s`}.`,
      boosts: `${client.util.boost2} Server Boost Level: \`${boostLvl}\`.\n${client.util.boost} Server Boosters: \`${boosters}\``,
      icon: message.guild.iconURL()
    }
    
    const embed = client.embeds.itemInfo(command, "guild", info);
    message.lineReply(embed);
  } catch (error) {
    client.functions.sendErrorMsg(error, true, message, command);
    client.logger.updateLog(`An unexpected error occured.`, extra.logId);
  }
}