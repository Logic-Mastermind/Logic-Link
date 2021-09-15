const Discord = require("discord.js");
const Fetch = require("node-fetch");

module.exports = async (client, member) => {
  const clientMember = member.guild.me;
  const guildPrefix = await client.functions.fetchPrefix(member.guild);
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