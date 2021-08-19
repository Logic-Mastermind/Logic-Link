const Discord = require("discord.js")

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
  
  // const getApp = (guildId) => {
  //   const app = client.api.applications(client.user.id)
  //   if (guildId) {
  //     app.guilds(guildId)
  //   }
  //   return app;
  // }

  // const commands = await getApp(guildId).commands.get()

  // await getApp(guildId).commands.post({
  //   data: {
  //     name: "avatar",
  //     description: "Fetches the avatar of a user.",
  //     options: [
  //       {
  //         name: "user",
  //         description: "The user to show the avatar of.",
  //         required: false,
  //         type: 3
  //       },
  //     ],
  //   },
  // })

  // client.ws.on("INTERACTION_CREATE", async (interaction) => {
  //   console.log(interaction)

  //   const { name, options } = interaction.data
  //   const command = name.toLowerCase()
  //   const user = interaction.user
  //   const args = {}

  //   if (options) {
  //     for (const option of options) {
  //       const { name, value } = option
  //       args[name] = value
  //     }
  //   }
    
  //   if (command === "avatar") {
  //     if (!args || args.length < 1) {
  //       reply(interaction, "kill me")
  //     }
  //   }
  // })

  // const reply = async (interaction, response) => {
  //   let data = {
  //     content: response
  //   }

  //   // if (data === "object") {
  //   //   data = await createAPIMessage(interaction, response)
  //   // }

  //   client.api.interactions(interaction.id, interaction.token).callback.post({
  //     data: {
  //       type: 4,
  //       data
  //     },
  //   })
  // }

  // const createAPIMessage = async (interaction, content)  => {
  //   const { data, files } = await Discord.APIMessage.create(
  //     client.channels.resolve(interaction.channel_id),
  //     content
  //   )
  //   .resolveData()
  //   .resolveFiles()

  //   return { ...data, files }
  // }
}