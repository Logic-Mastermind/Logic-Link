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
    const embed = client.embeds.fieldError(`Guild Left`, `Left a guild.\n\u200b`, [{ name: `Guild Information`, value: `**Name:** \`${guild.name}\`\n**ID:** \`${guild.id}\`\n**Owner:** <@${guild.owner.id}>` }]);

    channel.send(embed);
  } catch (error) {
    client.functions.sendError(error);
  }
}