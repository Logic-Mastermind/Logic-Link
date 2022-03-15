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
    const roles = (await message.guild.roles.fetch()).size - 1;
    const emojis = (await message.guild.emojis.fetch()).size;
    const channels = await message.guild.channels.fetch();
    const members = message.guild.memberCount;

    const text = channels.filter(c => c.type == "GUILD_TEXT").size;
    const voice = channels.filter(c => c.type == "GUILD_VOICE").size;
    const news = channels.filter(c => c.type == "GUILD_NEWS").size;
    
    const boostLvl = message.guild.premiumTier;
    const boosters = message.guild.premiumSubscriptionCount;

    const info = {
      owner: `<@${message.guild.ownerId}>`,
      createdAt: `<t:${Math.round(message.guild.joinedTimestamp / 1000)}:D>`,
      roles: `${client.util.moderator} ${roles} Role${roles == 1 ? `` : `s`}.`,
      emojis: `${client.util.sticker} ${emojis} Emoji${emojis == 1 ? `` : `s`}.`,
      members: `${client.util.members} ${members} Member${members == 1 ? `` : `s`}.`,
      channels: `${client.util.channel} ${text} Text Channel${text == 1 ? `` : `s`}.\n${client.util.voice} ${voice} Voice Channel${voice == 1 ? `` : `s`}.\n${client.util.news} ${news} News Channel${news == 1 ? `` : `s`}.`,
      boosts: `${client.util.boost2} Server Boost Level: \`${boostLvl}\`.\n${client.util.boost} Server Boosters: \`${boosters}\``,
      icon: message.guild.iconURL(),
      name: message.guild.name
    }
    
    const embed = client.embeds.itemInfo(command, "guild", info);
    message.reply({ embeds: [embed] });
  } catch (error) {
    client.functions.sendErrorMsg(error, message, command, extra.logId);
  }
}