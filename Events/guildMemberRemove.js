const Discord = require("discord.js");
const Buttons = require("discord-buttons");
const Prefix = require("discord-prefix");

module.exports = async (client, member) => {
  var guildPrefix = Prefix.getPrefix(member.guild.id);
  if (!guildPrefix) guildPrefix = client.util.defaultPrefix;

  const clientMember = member.guild.me;
  const settings = await client.functions.getSettings(member.guild);
  const tsettings = await client.functions.getTicketData(member.guild);
  const code = `\`\`\``;

  try {
    var channel = settings.welcomeChannelObj;

    if (channel) {
      if (!channel.permissionsFor(clientMember).has("SEND_MESSAGES")) return;

      const embed = client.embeds.red(`Goodbye`, `<@${member.id}> has left the server.`);
      channel.send(embed);
    }
  } catch (error) {
    client.functions.sendError(error);
  }
}