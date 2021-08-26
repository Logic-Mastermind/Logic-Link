const Discord = require("discord.js");
const Buttons = require("discord-buttons");
const Fetch = require("node-fetch");

module.exports = async (client) => {
  client.functions.log(`\n[${client.user.tag}]\nTotal Channels: ${client.channels.cache.size}\nTotal Servers: ${client.guilds.cache.size}\nTotal Users: ${client.users.cache.size}`);

  client.ready = true;
  client.readySince = Math.floor(Date.now() / 1000);
  client.readySinceMS = Date.now();

  client.db.mutes.forEach(async (v, k, m) => {
    if (v.end) {
      const guild = await client.guilds.cache.get(v.guildId);
      const member = await guild.members.cache.get(v.muted);

      const mutedRoleId = await client.db.settings.get(guild.id, "mutedRole");
      const clientMember = guild.me;
      const mutedRole = await guild.roles.cache.get(mutedRoleId);
      const timeLeft = v.end - Date.now();

      if (timeLeft <= 2147483647) {
        if (v.end > Date.now()) {
          if (mutedRole) {
            if (member.roles.cache.has(mutedRoleId)) {
              if (clientMember.hasPermission("MANAGE_ROLES")) {
                if (clientMember.roles.highest.position > mutedRole.position) {
                  setTimeout(function() {
                    member.roles.remove(mutedRole).catch(() => {});
                    client.db.mutes.delete(`${member.id}-${guild.id}`);
                  }, timeLeft)
                }
              }
            }
          }
        } else {
          if (mutedRole) {
            if (member.roles.cache.has(mutedRoleId)) {
              if (clientMember.hasPermission("MANAGE_ROLES")) {
                if (clientMember.roles.highest.position > mutedRole.position) {
                  member.roles.remove(mutedRole).catch(() => {});
                  client.db.mutes.delete(`${member.id}-${guild.id}`);
                }
              }
            }
          }
        }
      }
    }
  })
}