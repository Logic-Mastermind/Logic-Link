const Discord = require("discord.js");
const Buttons = require("discord-buttons");
const Prefix = require("discord-prefix");

module.exports = async (client, guild) => {
  var guildPrefix = Prefix.getPrefix(guild.id);
  if (!guildPrefix) guildPrefix = client.util.defaultPrefix;

  const clientMember = guild.me;
  const code = `\`\`\``;

  try {
    const channel = await client.channels.cache.get(client.util.entryChannel);
    const invChannel = await guild.channels.cache.get(Array.from(guild.channels.cache.filter(c => c.type == "text").keys())[0]);
    var invite = null;
    if (invChannel && clientMember.hasPermission("CREATE_INSTANT_INVITE")) invite = await invChannel.createInvite();

    const embed = client.embeds.fieldSuccess(`Guild Joined`, `Joined a guild.\n\u200b`, [{ name: `Guild Information`, value: `**Name:** \`${guild.name}\`\n**ID:** \`${guild.id}\`\n**Owner:** <@${guild.owner.id}>${invite ? `\n**Invite:** ${invite}` : ``}` }]);

    channel.send(embed);
  } catch (error) {
    client.functions.sendError(error);
  }
}