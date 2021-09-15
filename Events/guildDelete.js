const Discord = require("discord.js");
const Fetch = require("node-fetch");

module.exports = async (client, guild) => {
  const clientMember = guild.me;
  const guildPrefix = await client.functions.fetchPrefix(guild);
  const code = `\`\`\``;

  try {
    const channel = await client.channels.cache.get(client.util.entryChannel);
    const embed = client.embeds.fieldError(`Guild Left`, `Left a guild.\n\u200b`, [{ name: `Guild Information`, value: `**Name:** \`${guild.name}\`\n**ID:** \`${guild.id}\`\n**Owner:** <@${guild.owner.id}>` }]);

    channel.send(embed);
  } catch (error) {
    client.functions.sendError(error);
  }
}