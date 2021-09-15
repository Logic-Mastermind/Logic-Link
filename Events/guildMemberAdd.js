const Discord = require("discord.js");
const Fetch = require("node-fetch");

module.exports = async (client, member) => {
  const clientMember = member.guild.me;
  const guildPrefix = await client.functions.fetchPrefix(member.guild);
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
      const embed = client.embeds.green(`Welcome`, `${settings.welcomeMsg ? `${settings.welcomeMsg.replaceAll("[user]", `<@${member.id}>`).replaceAll("[tag]", `${member.user.tag}`).replaceAll("[id]", `${member.id}`).replaceAll("[username]", `${member.user.username}`)}` : `Hello <@${member.id}>.\nWelcome to \`${member.guild.name}\`, enjoy your stay!`}`);

      channel.send(embed);
    }
  } catch (error) {
    client.functions.sendError(error);
  }
}