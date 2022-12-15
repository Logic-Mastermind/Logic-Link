import Discord from "discord.js";
import Types from "../../types";

export default async function run(client: Types.client, message: Discord.Message, args: string[], command: Types.commandData, settings: Types.guildSettings, tsettings: Types.ticketSettings, extra: Types.extraObject) {
  
  const clientMember = message.guild.me;
  const guildPrefix = client.functions.fetchPrefix(message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = client.functions.getArgs(args);
  const code = `\`\`\``;
  const responses = {};

  try {
    let channel = message.mentions.channels.first() as Types.guildChannel;
    if (!channel && secArg) channel = client.functions.findChannel(args.join(" "), message.guild);
    if (!secArg && !channel) channel = message.channel as Types.guildChannel;

    if (channel) {
      const emoji = `${channel.id == message.guild.rulesChannelId ? `${client.util.emojis.rules} Rules` : channel.type == "GUILD_TEXT" ? `${client.util.emojis.channel} Text` : channel.type == "GUILD_VOICE" ? `${client.util.emojis.voice} Voice` : channel.type == "GUILD_NEWS" ? `${client.util.emojis.news} News` : channel.type == "GUILD_CATEGORY" ? `${client.util.emojis.category} Category` : channel.type == "GUILD_STORE" ? `${client.util.emojis.store} Store` : channel.type == "GUILD_STAGE_VOICE" ? `${client.util.emojis.stage} Stage` : channel.type == "GUILD_NEWS_THREAD" || channel.type == "GUILD_PUBLIC_THREAD" ? `${client.util.emojis.thread} Thread` : channel.type == "GUILD_PRIVATE_THREAD" ? `${client.util.emojis.threadPrivate} Thread` : null}`;
      const messages = channel.isText() ? (await channel.messages.fetchPinned()).size : null;

      const info = {
        type: `${emoji} Channel`,
        name: `\`${channel.name}\``,
        overwrites: client.functions.getPermOverwrites(channel).join("\n"),
        topic: channel instanceof Discord.TextChannel ? channel.topic || "No Channel Topic" : "Not Text Channel",
        nsfw: channel instanceof Discord.TextChannel ? channel.nsfw ? `NSFW.` : `Not NSFW.`: "Not Text Channel",
        category: channel.parent ? `#${channel.parent.name}` : `No Channel Category`,
        guild: channel.guild,
        position: `\`${!(channel instanceof Discord.ThreadChannel) ? channel.rawPosition : channel.parent?.rawPosition}\``,
        id: `\`${channel.id}\``,
        mention: `<#${channel.id}>`,
        pinned: messages ? `\`${messages}\` Pinned Message${messages == 1 ? `` : `s`}` : null
      }
      
      const embed = client.embeds.itemInfo(command, "channel", info);
      message.reply({ embeds: [embed] });
    } else {
      const embed = client.embeds.invalidItem(command, ["channel"], [args.join(" ")]);
      message.reply({ embeds: [embed] });
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, message, command, extra.logId);
  }
}