const Discord = require("discord.js");
const Fetch = require("node-fetch");

module.exports = async (client, member) => {
  const clientMember = member.guild.me;
  const guildPrefix = await client.functions.fetchPrefix(member.guild);
  const settings = await client.functions.getSettings(member.guild);
  const tsettings = await client.functions.getTicketData(member.guild);
  const code = `\`\`\``;

  try {
    var guild = member.guild;
    var role = settings.welcomeRoleObj;
    var channel = settings.welcomeChannelObj;
    var welcomeMsg = settings.welcomeMsg;

    if (role) {
      if (member.guild.id == client.util.supportServer) {
        var unverifiedRole = guild.roles.cache.get(client.util.supportUnverifyRole);
        var dividerRole = guild.roles.cache.get(client.util.supportDividerRole);
        var memberRole = guild.roles.cache.get(client.util.supportMemberRole);

        return member.roles.add([unverifiedRole, dividerRole, memberRole]);
      } else {
        if (!client.functions.hierarchy(clientMember, role, member.guild)) { 
          member.roles.add(role)
          .catch((error) => client.functions.sendError(error));
        }
      }
    }

    if (channel) {
      if (!channel.permissionsFor(clientMember).has("SEND_MESSAGES")) return;
      if (welcomeMsg) {
        welcomeMsg = welcomeMsg
        .replaceAll("[username]", member.user.username)
        .replaceAll("[user]", `<@${member.id}>`)
        .replaceAll("[tag]", member.user.tag)
        .replaceAll("[id]", member.id)
      }

      const defaultMsg = `Hello <@${member.id}>.\nWelcome to \`${member.guild.name}\`, enjoy your stay!`;
      const embed = client.embeds.green(`Welcome`, `${welcomeMsg || defaultMsg}`);
      channel.send({ embeds: [embed] });
    }
  } catch (error) {
    client.functions.sendError(error);
  }
}