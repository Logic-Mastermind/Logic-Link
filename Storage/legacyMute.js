const Discord = require("discord.js");
const Buttons = require("discord-buttons");
const Prefix = require("discord-prefix");
const Reply = require("discord-reply");

exports.run = async (client, message, args) =>  {
  var guildPrefix = Prefix.getPrefix(message.guild.id)
  if (!guildPrefix) guildPrefix = client.defaultPrefix;

  const secArg = args[0];
  const thirdArg = args[1];
  const fourthArg = args[2];
  const fifthArg = args[3];
  const sixthArg = args[4];
  
  const adminRoleConfig = client.settings.get(message.guild.id, "adminRole");
  const modLogChannelConfig = client.settings.get(message.guild.id, "modLogChannel");
  const modRoleConfig = client.settings.get(message.guild.id, "modRole");
  const mutedRoleConfig = client.settings.get(message.guild.id, "mutedRole");
  const mutedRoleConfiguration = client.settings.get(message.guild.id, "mutedRoleConfiguration");
  const welcomeChannelConfig = client.settings.get(message.guild.id, "welcomeChannel");
  const welcomeRoleConfig = client.settings.get(message.guild.id, "welcomeRole");
  const welcomeSystemConfig = client.settings.get(message.guild.id, "welcomeSystem");

  const adminRoleObject = message.guild.roles.cache.get(adminRoleConfig);
  const modLogChannelObject = message.guild.channels.cache.get(modLogChannelConfig);
  const modRoleObject = message.guild.roles.cache.get(modRoleConfig);
  const mutedRoleObject = message.guild.roles.cache.get(mutedRoleConfig);
  const welcomeChannelObject = message.guild.channels.cache.get(welcomeChannelConfig);
  const welcomeRoleObject = message.guild.roles.cache.get(welcomeRoleConfig);

  const clientMember = message.guild.me;
  const command = client.command.administrator.lock;
  const noArgs = await client.functions.getNoArgs(command, message.member);
  const code = `\`\`\``;

  const responses = {
    hierarchy: `**User Permissions Required**\nYour role position must be higher than the user you are attempting to mute.`,
    noMutedRole: `**Role Not Found**\nA muted role was not detected, do you want to create one for this server?`,
    configuringRole: `Configuring the muted role...`,
    noUser: `**User Not Found**\nI was unable to record any users from your message.`,
    noRoleHierarchy: `**User Permissions Required**\nYou must have a role that is higher than `,
    userAdmin: `**Administrator Privileges**\nThe user that you are attempting to mute has administrator privileges that will prevent them from being locked out of channel.\n`,
    mutedRoleHierarchy: `**Role Hierarchy**\nThe user that you are attempting to mute has a role that is higher than this server's muted role.`
  }

  try {
    var member = message.mentions.members.first();
    var foundMutedRole = null;
    
    if (!mutedRoleObject) foundMutedRole = message.guild.roles.cache.find(r => r.name.toLowerCase() == "muted")
    if (!member) member = await client.functions.findMember(secArg, message.guild)

    if (member) {
      function muteMember() {
        if (member.roles.cache.has(mutedRoleObject.id)) {
          const alreadyMutedEmbed = client.embeds.error(command, `User Muted`, `<@${member.id}> is already muted in this server.`, footer1, footer2)

          return message.channel.send(alreadyMutedEmbed)
        }

        var timeObj = null;
        var reason = null;

        if (thirdArg) {
          if (!fourthArg) {
            timeObj = client.functions.getTime(thirdArg);
            if (timeObj.passed == false && isNaN(thirdArg)) reason = args.slice(1).join(" ");
          } else if (fourthArg) {
            timeObj = client.functions.getTime(thirdArg);
            reason = args.slice(2).join(" ");
          }
        }

        const pendingEmbed = client.embeds.pending(command, `Configuring Muted Role`, `Attempting to configure the muted role...`, footer1, footer2)

        //const pendingEmbed = client.embeds.pending(command, `Muting User`, `Attempting to add the muted role to the user...`, footer1, footer2)

        const mutedEmbed = client.embeds.new(`USER MUTED`, `You have been muted from \`${message.guild.name}\`${duration > 0 ? ` for ${timeView} ${timeView == 1 ? `${unit}.` : `${unit}s.`}` : `${message.guild.name.endsWith(".") ? `` : `.`}`}\n\n**Reason**\n${reason}`, `ORANGE`, footer1, footer2, true)

        if (!clientMember.hasPermission(["MANAGE_ROLES", "MANAGE_CHANNELS"])) {
          const errorEmbed = client.embeds.botPermission(command, footer1, footer2);
          return message.channel.send(errorEmbed);
        }
        
        if (message.member.roles.cache && member.roles.cache && (message.author.id !== message.guild.owner.id)) {
          if (message.member.roles.highest.position <= member.roles.highest.position) {
            const errorEmbed = client.embeds.error(command, `User Permissions`, `Your role position must be higher than the user you are attempting to mute.`, footer1, footer2);

            return message.channel.send(errorEmbed)
          }
        }

        if (member.hasPermission("ADMINISTRATOR")) {
          const errorEmbed = client.embeds.error(command, `Administrator Privileges`, `The user that you are attempting to mute has administrator privileges that will prevent them from being locked out of channel.`, footer1, footer2)

          return message.channel.send(errorEmbed)
        }

        if (member.roles.cache) {
          if (member.roles.highest.position > mutedRoleObject.position) {
            const errorEmbed5 = new Discord.MessageEmbed()
            .setTitle(`${command.name.toUpperCase()}`)
            .setColor(`ORANGE`)
            .setFooter(`${footer1}`, `${footer2}`)
            .setDescription(`${responses.mutedRoleHierarchy}`)
            .setTimestamp();

            return message.channel.send(errorEmbed5)
          }
        }

        member.roles.add(mutedRoleObject)
        .then(async (role) => {
          const successEmbed = new Discord.MessageEmbed()
          .setTitle(`${command.name.toUpperCase()}`)
          .setColor(`GREEN`)
          .setFooter(`${footer1}`, `${footer2}`)
          .setDescription(`${duration == 0 ? `**User Muted**\nMuted <@${member.id}> from the server.\n\n**Reason**\n${reason}` : `**User Muted**\nMuted <@${member.id}> from the server for ${timeView} ${timeView == 1 ? `${unit}` : `${unit}s`}.\n\n**Reason**\n${reason}`}`)
          .setTimestamp();

          function saveMuteData() {
            client.settings.set(message.guild.id, true, "mutedRoleConfiguration")
            client.mutes.set(`${member.id}-${message.guild.id}`, message.author.id, "muter");
            client.mutes.set(`${member.id}-${message.guild.id}`, member.id, "muted");
            client.mutes.set(`${member.id}-${message.guild.id}`, Date.now(), "mutedTimestamp");
            client.mutes.set(`${member.id}-${message.guild.id}`, duration, "duration");

            if (duration > 0) {
              client.mutes.set(`${member.id}-${message.guild.id}`, Date.now() + duration, "end")
            } else {
              client.mutes.set(`${member.id}-${message.guild.id}`, null, "end")
            }
          }

          if (!mutedRoleConfiguration) {
            botMessage = await message.channel.send(pendingEmbed)
            message.guild.channels.cache.forEach((channel) => {
              if (channel.permissionsFor(message.guild.me).has("MANAGE_CHANNELS")) {
                channel.updateOverwrite(mutedRoleObject, {
                  SEND_MESSAGES: false,
                }).then(() => {
                  botMessage.edit(``, { embed: successEmbed })
                  saveMuteData()

                  if (!member.user.bot) member.user.send(mutedEmbed)

                  if (isDuration) {
                    function removeRole() {
                      member.roles.remove(mutedRoleObject)
                      .catch((err) => {})
                    }
                    setTimeout(removeRole, duration)
                  }
                })
                .catch((error) => {
                  const errorEmbed = new Discord.MessageEmbed()
                  .setTitle(`${command.name.toUpperCase()}`)
                  .setColor(`${errors.color}`)
                  .setFooter(`${footer1}`, `${footer2}`)
                  .setDescription(`${error.message ? `**` : `**Unknown `}Error**\nFailed to mute the member.${error.message ? `\n\n**Error Info**\n${ending}${error.message}${ending}` : ``}`)
                  .setTimestamp();

                  botMessage.edit(``, { embed: errorEmbed })
                })
              }
            }); 
          } else {
            if (!member.user.bot) member.user.send(mutedEmbed)
            if (isDuration) {
              function removeRole() {
                member.roles.remove(mutedRoleObject)
              }
              setTimeout(removeRole, duration)
            }

            message.channel.send(``, { embed: successEmbed })
            saveMuteData()
          }
        })
        .catch((err) => {
          const errorEmbed = new Discord.MessageEmbed()
          .setTitle(`${command.name.toUpperCase()}`)
          .setColor(`RED`)
          .setFooter(`${footer1}`, `${footer2}`)
          .setDescription(`**Error**\nFailed to mute the member.${err.message ? `\n\n**Error Info**\n\`\`\`${err.message}\`\`\`` : ``}`)
          .setTimestamp();

          message.channel.send(errorEmbed)
        })
      }
      if (mutedRoleObject) {
        muteMember()
        } else {
          const filter = (button) => true;

          const confirmEmbed = new Discord.MessageEmbed()
          .setTitle(`${command.name.toUpperCase()}`)
          .setColor(`ORANGE`)
          .setFooter(`${footer1}`, `${footer2}`)
          .setDescription(`${(foundMutedRole && message.member.hasPermission("ADMINISTRATOR")) ? `**Muted Role Configuration**\nA role with the name \`${foundMutedRole.name}\` was detected.\nWould you like to set <@&${foundMutedRole.id}> as the server muted role?` : `${responses.noMutedRole}`}`)
          .setTimestamp();

          const confirmButton = new buttons.MessageButton()
          .setStyle("green")
          .setLabel("Create")
          .setID("Mute_Role_Create");

          const cancelButton = new buttons.MessageButton()
          .setStyle("red")
          .setLabel("Cancel")
          .setID("Mute_Role_Cancel");

          const sent = await message.channel.send(``, { embed: confirmEmbed, buttons: [confirmButton, cancelButton] })
          const collector = await sent.createButtonCollector(filter, { idle: 60000 });
          var result

          collector.on("collect", async (button) => {
            if (message.author.id !== button.clicker.user.id) {
              const noPermsEmbed = new Discord.MessageEmbed()
              .setTitle(`${errors.permission.title}`)
              .setColor(`${errors.permission.color}`)
              .setDescription(`**Error**\nYou do not have permission to carry out this process.\n\n**Permissions**\n${ending}MANAGE_CHANNELS${ending}`)
              .setTimestamp();

              return button.reply.send(``, { embed: noPermsEmbed, ephemeral: true });
            }

            if (button.id == "Mute_Role_Create") {
              result = true
              function confirmation(msgId, roleId) {
                const msg = message.channel.messages.cache.get(msgId);
                const role = message.guild.roles.cache.get(roleId);
                const collector2 = msg.createButtonCollector(filter, { idle: 60000 });
                var result1

                collector2.on("collect", async (button) => {
                  if (message.author.id !== button.clicker.user.id) {
                    const noPermsEmbed = new Discord.MessageEmbed()
                    .setTitle(`${errors.permission.title}`)
                    .setColor(`${errors.permission.color}`)
                    .setDescription(`**Error**\nYou do not have permission to carry out this process.\n\n**Permissions**\n${ending}MANAGE_CHANNELS${ending}`)
                    .setTimestamp();

                    return button.reply.send(``, { embed: noPermsEmbed, ephemeral: true });
                  }
                  result1 = true
                  if (button.id == "Mute_Continue") {
                    muteMember()
                    msg.delete()
                  } else if (button.id == "Mute_NoContinue") {
                    const successEmbed = new Discord.MessageEmbed()
                    .setTitle(`${command.name.toUpperCase()}`)
                    .setColor(`GREEN`)
                    .setFooter(`${footer1}`, `${footer2}`)
                    .setDescription(`**Success**\nSet the server muted role to <@&${role.id}>.`)
                    .setTimestamp();

                    msg.edit(successEmbed, null)

                  }
                })
                collector2.on("end", async (collected) => {
                  if (!result1) {
                    const errorEmbed = new Discord.MessageEmbed()
                    .setTitle(`${command.name.toUpperCase()}`)
                    .setColor(`RED`)
                    .setFooter(`${footer1}`, `${footer2}`)
                    .setDescription(`**Prompt Timeout**\nThis prompt has ended due to inactivity.`)
                    .setTimestamp();

                    msg.edit(errorEmbed, null)
                  }
                })
              }

              if (!foundMutedRole) {
                message.guild.roles.create({
                  data: {
                    name: "Muted",
                    position: clientMember.roles.highest.position,
                    color: "#979c9f"
                  },
                  reason: `Creating a muted role for this server. (${message.author.tag})`
                }).then(async (role) => {
                  await button.reply.defer();
                  client.settings.set(message.guild.id, role.id, "mutedRole")
                  const successEmbed = new Discord.MessageEmbed()
                  .setTitle(`${command.name.toUpperCase()}`)
                  .setColor(`GREEN`)
                  .setFooter(`${footer1}`, `${footer2}`)
                  .setDescription(`**Success**\nSet the server muted role to <@&${role.id}>.\nWould you still like to mute the member?`)
                  .setTimestamp();

                  const confirmButton1 = new buttons.MessageButton()
                  .setStyle("green")
                  .setLabel("Yes")
                  .setID("Mute_Continue");

                  const cancelButton1 = new buttons.MessageButton()
                  .setStyle("gray")
                  .setLabel("No")
                  .setID("Mute_NoContinue");

                  message.channel.send(``, { embed: successEmbed, buttons: [confirmButton1, cancelButton1] }).then((msg) => {
                    mutedRoleObject = message.guild.roles.cache.get(role.id)
                    confirmation(msg.id, role.id)
                  })
                  sent.delete()
                })
                .catch(async (err) => {
                  await button.reply.defer();
                  const errorEmbed = new Discord.MessageEmbed()
                  .setTitle(`${command.name.toUpperCase()}`)
                  .setColor(`RED`)
                  .setFooter(`${footer1}`, `${footer2}`)
                  .setDescription(`**Error**\nFailed to create the muted role.${err.message ? `\n\n**Error Info**\n\`\`\`${err.message}\`\`\`` : ``}`)
                  .setTimestamp();

                  message.channel.send(errorEmbed)
                  sent.delete()
                })
              } else if (foundMutedRole && message.member.hasPermission("ADMINISTRATOR")) {
                await button.reply.defer();
                client.settings.set(message.guild.id, foundMutedRole.id, "mutedRole")

                const successEmbed = new Discord.MessageEmbed()
                .setTitle(`${command.name.toUpperCase()}`)
                .setColor(`GREEN`)
                .setFooter(`${footer1}`, `${footer2}`)
                .setDescription(`**Success**\nSet the server muted role to <@&${foundMutedRole.id}>.\nWould you still like to mute the member?`)
                .setTimestamp();

                const confirmButton1 = new buttons.MessageButton()
                .setStyle("green")
                .setLabel("Yes")
                .setID("Mute_Continue");

                const cancelButton1 = new buttons.MessageButton()
                .setStyle("gray")
                .setLabel("No")
                .setID("Mute_NoContinue");

                message.channel.send(``, { embed: successEmbed, buttons: [confirmButton1, cancelButton1] }).then((msg) => {
                  mutedRoleObject = message.guild.roles.cache.get(foundMutedRole.id)
                  confirmation(msg.id, foundMutedRole.id)
                })

                sent.delete();
              }
            } else if (button.id == "Mute_Role_Cancel") {
              result = true
              await button.reply.defer()
              const cancelEmbed = new Discord.MessageEmbed()
              .setTitle("MUTE")
              .setColor("ORANGE")
              .setFooter(`${footer1}`, `${footer2}`)
              .setDescription(`**Success**\nCancelled the mute role prompt.`)
              .setTimestamp();

              message.channel.send(cancelEmbed)
              sent.delete()
            }
          })

          collector.on("end", collected => {
            if (!result) {
              const timeoutEmbed = new Discord.MessageEmbed()
              .setTitle("MUTE")
              .setColor("RED")
              .setFooter(`${footer1}`, `${footer2}`)
              .setDescription(`**Prompt Timeout**\nThis prompt has ended due to inactivity.`)
              .setTimestamp();

              message.channel.send(timeoutEmbed)
            }
          })
        }
      } else {
        const errorEmbed = new Discord.MessageEmbed()
        .setTitle("MUTE")
        .setColor("RED")
        .setFooter(`${footer1}`, `${footer2}`)
        .setDescription(`${responses.noUser}`)
        .setTimestamp();

        message.channel.send(errorEmbed)
      }
  } catch (error) {
    client.functions.sendErrorMsg(error, true, message, command, client)
  }
}