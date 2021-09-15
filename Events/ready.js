const Discord = require("discord.js");
const Fetch = require("node-fetch");

module.exports = async (client) => {
  client.functions.log(`\n[${client.user.tag}]\nTotal Channels: ${client.channels.cache.size}\nTotal Servers: ${client.guilds.cache.size}\nTotal Users: ${client.users.cache.size}`);

  client.ready = true;
  client.readySince = Math.floor(Date.now() / 1000);
  client.readySinceMS = Date.now();

  for (const [key, val] of client.db.timeouts.fetchEverything().entries()) {
    if (val.type == "mute") {
      const guild = await client.guilds.cache.get(val.guildId);
      const member = await guild.members.cache.get(val.muted);

      const mutedRoleId = await client.db.settings.get(guild.id, "mutedRole");
      const mutedRole = await guild.roles.cache.get(mutedRoleId);
      const timeLeft = val.end - Date.now();
      const clientMember = guild.me;

      if (timeLeft > client.util.timeoutLimit) continue;
      if (!mutedRole) continue;

      if (!member.roles.cache.has(mutedRoleId)) continue;
      if (!clientMember.hasPermission("MANAGE_ROLES")) continue;
      if (mutedRole.position >= clientMember.roles.highest.position) continue;

      const remove = () => {
        member.roles.remove(mutedRole);
        client.db.mutes.delete(key);
      };

      if (v.end >= Date.now()) setTimeout(remove, timeLeft);
      else remove();
    }
  }
}