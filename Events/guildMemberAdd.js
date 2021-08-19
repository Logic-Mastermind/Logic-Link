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
    var role = settings.welcomeRoleObj;
    var channel = settings.welcomeChannelObj;

    if (role) {
      if (clientMember.roles.highest.position <= role.position) return;

      member.roles.add(role)
      .catch((error) => client.functions.sendError(error))
    }

    if (channel) {
      if (!channel.permissionsFor(clientMember).has("SEND_MESSAGES")) return;

      const embed = client.embeds.green(`Welcome`, `Hello <@${member.id}>.\nWelcome to \`${member.guild.name}\`, enjoy your stay!`);

      channel.send(embed);
    }
  } catch (error) {
    client.functions.sendError(error);
  }
}