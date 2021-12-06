const Discord = require("discord.js");
const Fetch = require("node-fetch");
const Enmap = require("enmap");
const applicationScheme = require("../Structures/application.js");

module.exports = async (client) => {
  client.application.commands.scheme = applicationScheme;
  client.functions.log(`\n[${client.user.tag}]\nTotal Channels: ${client.channels.cache.size}\nTotal Servers: ${client.guilds.cache.size}\nTotal Users: ${client.users.cache.size}`);
  console.timeEnd("Login");

  client.ready = true;
  client.readySince = Math.floor(Date.now() / 1000);
  client.readySinceMS = Date.now();

  const timeouts = client.db.timeouts.fetchEverything();
  const logs = client.db.logs.fetchEverything();
  
  for (const [key, val] of timeouts.entries()) {
    if (val.type == "mute") {
      const guild = client.guilds.cache.get(val.guildId);
      const member = guild.members.cache.get(val.muted);

      const mutedRoleId = client.db.settings.get(guild.id, "mutedRole");
      const mutedRole = guild.roles.cache.get(mutedRoleId);
      const timeLeft = val.end - Date.now();
      const clientMember = guild.me;

      if (timeLeft > client.util.timeoutLimit) continue;
      if (!mutedRole) continue;

      if (!member.roles.cache.has(mutedRoleId)) continue;
      if (!clientMember.permissions.has("MANAGE_ROLES")) continue;
      if (mutedRole.position >= clientMember.roles.highest.position) continue;

      const remove = () => {
        member.roles.remove(mutedRole);
        client.db.timeouts.delete(key);
      };

      if (val.end >= Date.now()) setTimeout(remove, timeLeft);
      else remove();
      
    } else if (val.type == "reminders") {
      const reminders = val.reminders;
      if (!reminders instanceof Map) continue;

      for (const [k, v] of reminders.entries()) {
        const content = `Your reminder from <t:${v.date}:R> has just went off.`;
        const user = client.users.cache.get(v.user) || await client.users.fetch(v.user);
        const fields = [{ name: "Task", value: v.task, inline: false }];
        const timeLeft = v.end - Date.now();

        if (timeLeft > client.util.timeoutLimit) continue;
        if (!user) continue;

        const remind = () => {
          const embed = client.embeds.warn("Reminder", content, fields);
          reminders.delete(k);

          client.db.timeouts.set(`${v.user}[reminders]`, reminders, "reminders");
          user.send({ embeds: [embed] });
        };

        if (v.end >= Date.now()) setTimeout(remind, timeLeft);
        else remind();
      }
    }
  }
}