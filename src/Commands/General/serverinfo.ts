import Discord from "discord.js";
import Types from "../../Typings/types";

export default async function run(client: Types.client, message: Discord.Message, args: string[], command: Types.commandData, settings: Types.guildSettings, tsettings: Types.ticketSettings, extra: Types.extraObject) {
  
  const clientMember = message.guild.me;
  const guildPrefix = client.functions.fetchPrefix(message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = client.functions.getArgs(args);
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
      roles: `${client.util.emojis.roleIcon} ${roles} Role${roles == 1 ? `` : `s`}`,
      emojis: `${client.util.emojis.sticker} ${emojis} Emoji${emojis == 1 ? `` : `s`}`,
      members: `${client.util.emojis.members} ${members} Member${members == 1 ? `` : `s`}`,
      channels: `${client.util.emojis.channel} ${text} Text Channel${text == 1 ? `` : `s`}\n${client.util.emojis.voice} ${voice} Voice Channel${voice == 1 ? `` : `s`}\n${client.util.emojis.news} ${news} News Channel${news == 1 ? `` : `s`}`,
      boosts: `${client.util.emojis.boost2} Server Boost Level: \`${boostLvl}\`\n${client.util.emojis.boost} Server Boosters: \`${boosters}\``,
      icon: message.guild.iconURL(),
      name: message.guild.name
    }
    
    const embed = client.embeds.itemInfo(command, "guild", info);
    message.reply({ embeds: [embed] });
  } catch (error) {
    client.functions.sendErrorMsg(error, message, command, extra.logId);
  }
}