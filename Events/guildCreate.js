const Discord = require("discord.js");
const Fetch = require("node-fetch");

module.exports = async (client, guild) => {
  const clientMember = guild.me;
  const guildPrefix = await client.functions.fetchPrefix(guild);
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