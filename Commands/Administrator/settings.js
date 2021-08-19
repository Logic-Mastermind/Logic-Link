const Discord = require("discord.js");
const Buttons = require("discord-buttons");
const Prefix = require("discord-prefix");

exports.run = async (client, message, args, command, settings, tsettings, extra) => {
  var guildPrefix = Prefix.getPrefix(message.guild.id);
  if (!guildPrefix) guildPrefix = client.util.defaultPrefix;

  const clientMember = message.guild.me;
  const noArgs = await client.functions.getNoArgs(command, message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = await client.functions.getArgs(args);
  const code = `\`\`\``;

  const responses = {
    
  }

  try {
    if (!secArg) {
      const settingsArray = [
        { name: "Prefix", value: `\`${settings.prefix}\``, inline: true },
        { name: "Moderator Role", value: `${settings.modRole ? `<@&${settings.modRole}>` : `Not configured.`}`, inline: true },
        { name: "Administrator Role", value: `${settings.adminRole ? `<@&${settings.adminRole}>` : `Not configured.`}`, inline: true },
        { name: "Log Channel", value: `${settings.logChannel ? `<#${settings.logChannel}>` : `Not configured.`}`, inline: true },
        { name: "Muted Role", value: `${settings.mutedRole ? `<@&${settings.mutedRole}>` : `Not configured.`}`, inline: true },
        { name: "Welcome System", value: `${settings.welcomeSystem ? `On` : `Off`}`, inline: true },
      ];

      if (settings.welcomeSystem) {
        settingsArray.push(
          {name: "Welcome Channel", value: `${settings.welcomeChannel ? `<#${settings.welcomeChannel}>` : `Not configured.`}`, inline: true},
          {name: "Welcome Role", value: `${settings.welcomeRole ? `<@&${settings.welcomeRole}>` : `Not configured.`}`, inline: true },
          { name: "\u200b", value: "\u200b", inline: true }
        )
      }

      const embed = client.embeds.field(command, `${client.util.welcomeBotInfo}\n\n**Server Settings**\nBelow is a list of configurations for this server.\nTo modify any of these settings, run: \`${guildPrefix}settings [option] [new setting]\`.\n\n${code}Settings${code}\n\u200b`, settingsArray);

      message.lineReply(embed)
    } else {
      if (client.command.settingsOptions.includes(secArg) || client.command.settingsOptionsAliases.includes(secArg)) {
        switch (secArg.toLowerCase()) {
          case "pre":
          case "prefix":
          {
            if (thirdArg) {
              const pendingEmbed = client.embeds.pending(command.option.prefix, `Saving the new prefix...`);
              var newPrefix = args.slice(1).join(" ");
              if (newPrefix.toLowerCase() == "reset") newPrefix = client.util.defaultPrefix;

              if (newPrefix == settings.prefix) {
                const errorEmbed = client.embeds.error(command.option.prefix, `The server prefix has already been set to \`${newPrefix}\`.`);
                return message.lineReply(errorEmbed)
              }

              if (thirdArg.toLowerCase() == "reset") {
                const editMsg = await message.lineReply(pendingEmbed);
                await client.db.settings.set(message.guild.id, newPrefix, "prefix");
                await Prefix.setPrefix(newPrefix, message.guild.id);

                const successEmbed = client.embeds.success(command.option.prefix, `Reset the server prefix to the default: \`${newPrefix}\`.`)

                return editMsg.edit(successEmbed);
              }

              if (newPrefix.length > 5) {
                const embed = client.embeds.error(command.option.prefix, `The new server prefix must be 5 or less characters long.`);
                return message.lineReply(embed);
              }

              const editMsg = await message.lineReply(pendingEmbed);

              await client.db.settings.set(message.guild.id, newPrefix, "prefix");
              await Prefix.setPrefix(newPrefix, message.guild.id);
              
              const successEmbed = client.embeds.success(command.option.prefix, `Set the server prefix to: \`${newPrefix}\`.`)
              editMsg.edit(successEmbed);
            } else {
              const embed = client.embeds.settingsNoArgs(command.option.prefix, `The current server prefix is \`${settings.prefix}\`.`, settings.prefix);

              message.lineReply(embed)
            }
            break;
          }
          case "mod":
          case "moderatorrole":
          case "modrole":
          {
            if (thirdArg) {
              const pendingEmbed = client.embeds.pending(command.option.modrole, `Saving the new moderator role...`);
              var newRole = message.mentions.roles.first();
              if (!newRole) newRole = await client.functions.findRole(args.slice(1).join(" "), message.guild);

              if (thirdArg.toLowerCase() == "reset" || thirdArg.toLowerCase() == "off") {
                if (!settings.modRole) {
                  const errorEmbed = client.embeds.error(command.option.modrole, `This server does not have a moderator role.`);
                  
                  return message.lineReply(errorEmbed)
                }

                const editMsg = await message.lineReply(pendingEmbed);
                await client.db.settings.delete(message.guild.id, "modRole");

                const successEmbed = client.embeds.success(command.option.modrole, `Removed the server moderator role.`)

                return editMsg.edit(successEmbed);
              }

              if (newRole) {
                if (newRole.id == settings.modRole) {
                  const errorEmbed = client.embeds.error(command.option.modrole, `The server moderator role has already been set to <@&${settings.modRole}>.`);
                  
                  return message.lineReply(errorEmbed);
                }

                const editMsg = await message.lineReply(pendingEmbed);

                await client.db.settings.set(message.guild.id, newRole.id, "modRole");
                const successEmbed = client.embeds.success(command.option.modrole, `Set the server moderator role to: <@&${newRole.id}>.`)
                editMsg.edit(successEmbed);
              } else {
                const errorEmbed = client.embeds.error(command.option.modrole, `No roles were recorded from your message.`);
                message.lineReply(errorEmbed);
              }
            } else {
              const embed = client.embeds.settingsNoArgs(command.option.modrole, `${settings.modRole ? `The current server moderator role is <@&${settings.modRole}>.` : `Moderator role not configured.`}`, settings.prefix);

              message.lineReply(embed)
            }
            break;
          }
          case "admin":
          case "administratorrole":
          case "adminrole":
          {
            if (thirdArg) {
              const pendingEmbed = client.embeds.pending(command.option.adminrole, `Saving the new administrator role...`);
              var newRole = message.mentions.roles.first();
              if (!newRole) newRole = await client.functions.findRole(args.slice(1).join(" "), message.guild);

              if (thirdArg.toLowerCase() == "reset" || thirdArg.toLowerCase() == "off") {
                if (!settings.adminRole) {
                  const errorEmbed = client.embeds.error(command.option.adminrole, `This server does not have an administrator role.`);

                  return message.lineReply(errorEmbed)
                }

                const editMsg = await message.lineReply(pendingEmbed);
                await client.db.settings.delete(message.guild.id, "adminRole");

                const successEmbed = client.embeds.success(command.option.adminrole, `Removed the server administrator role.`)

                return editMsg.edit(successEmbed);
              }

              if (newRole) {
                if (newRole.id == settings.adminRole) {
                  const errorEmbed = client.embeds.error(command.option.adminrole, `The server administrator role has already been set to <@&${settings.adminRole}>.`);
                  
                  return message.lineReply(errorEmbed);
                }

                const editMsg = await message.lineReply(pendingEmbed);

                await client.db.settings.set(message.guild.id, newRole.id, "adminRole");
                const successEmbed = client.embeds.success(command.option.adminrole, `Set the server administrator role to: <@&${newRole.id}>.`)
                editMsg.edit(successEmbed);
              } else {
                const errorEmbed = client.embeds.error(command.option.adminrole, `No roles were recorded from your message.`);
                message.lineReply(errorEmbed);
              }
            } else {
              const embed = client.embeds.settingsNoArgs(command.option.adminrole, `${settings.adminRole ? `The current server administrator role is <@&${settings.adminRole}>.` : `Administrator role not configured.`}`, settings.prefix);

              message.lineReply(embed)
            }
            break;
          }
          case "log":
          case "logs":
          case "logchan":
          case "logchannel":
          {
            if (thirdArg) {
              const pendingEmbed = client.embeds.pending(command.option.logchannel, `Saving the new log channel...`);
              var newChannel = message.mentions.channels.first();
              if (!newChannel) newChannel = await client.functions.findChannel(args.slice(1).join(" "), message.guild);

              if (thirdArg.toLowerCase() == "reset" || thirdArg.toLowerCase() == "off") {
                if (!settings.logChannel) {
                  const errorEmbed = client.embeds.error(command.option.logchannel, `This server does not have a log channel.`);
                  
                  return message.lineReply(errorEmbed)
                }

                const editMsg = await message.lineReply(pendingEmbed);
                await client.db.settings.delete(message.guild.id, "logChannel");

                const successEmbed = client.embeds.success(command.option.logchannel, `Removed the server log channel.`)

                return editMsg.edit(successEmbed);
              }

              if (newChannel) {
                if (newChannel.id == settings.logChannel) {
                  const errorEmbed = client.embeds.error(command.option.logchannel, `The server log channel has already been set to <#${settings.logChannel}>.`);
                  
                  return message.lineReply(errorEmbed);
                }

                if (!newChannel.permissionsFor(clientMember).has("SEND_MESSAGES")) {
                  const errorEmbed = client.embeds.red(command.option.logchannel, `I do not have the required permissions in this channel.\n\n**Permissions**\n${code}SEND_MESSAGES${code}`);
                  return message.lineReply(errorEmbed)
                }

                const editMsg = await message.lineReply(pendingEmbed);

                await client.db.settings.set(message.guild.id, newChannel.id, "logChannel");
                const successEmbed = client.embeds.success(command.option.logchannel, `Set the server log channel to: <#${newChannel.id}>.`)
                editMsg.edit(successEmbed);
              } else {
                const errorEmbed = client.embeds.error(command.option.logchannel, `No channels were recorded from your message.`);
                message.lineReply(errorEmbed);
              }
            } else {
              const embed = client.embeds.settingsNoArgs(command.option.logchannel, `${settings.logChannel ? `The current server log channel is <#${settings.logChannel}>.` : `Log channel not configured.`}`, settings.prefix);

              message.lineReply(embed)
            }
            break;
          }
          case "muted":
          case "mutedrole":
          {
            if (thirdArg) {
              const pendingEmbed = client.embeds.pending(command.option.mutedrole, `Saving the new muted role...`);
              var newRole = message.mentions.roles.first();
              if (!newRole) newRole = await client.functions.findRole(args.slice(1).join(" "), message.guild);

              if (thirdArg.toLowerCase() == "reset" || thirdArg.toLowerCase() == "off") {
                if (!settings.mutedRole) {
                  const errorEmbed = client.embeds.error(command.option.mutedrole, `This server does not have a muted role.`);

                  return message.lineReply(errorEmbed)
                }

                const editMsg = await message.lineReply(pendingEmbed);
                await client.db.settings.delete(message.guild.id, "mutedRole");

                const successEmbed = client.embeds.success(command.option.mutedrole, `Removed the server muted role.`)

                return editMsg.edit(successEmbed);
              }

              if (newRole) {
                if (newRole.id == settings.mutedRole) {
                  const errorEmbed = client.embeds.error(command.option.mutedrole, `The server muted role has already been set to <@&${settings.mutedRole}>.`);
                  
                  return message.lineReply(errorEmbed);
                }

                if (newRole.position >= clientMember.roles.highest.position) {
                  const errorEmbed = client.embeds.error(command.option.welcomerole, `I am unable to grant this role to members due to role hierarchy.`);
                  return message.lineReply(errorEmbed);
                }

                if (!clientMember.hasPermission("MANAGE_ROLES")) {
                  const errorEmbed = client.embeds.red(command.option.welcomerole, `I do not have the required permissions to grant this role.\n\n**Permissions**\n${code}MANAGE_ROLES${code}`);
                  return message.lineReply(errorEmbed)
                }

                const editMsg = await message.lineReply(pendingEmbed);

                await client.db.settings.set(message.guild.id, newRole.id, "mutedRole");
                const successEmbed = client.embeds.success(command.option.mutedrole, `Set the server muted role to: <@&${newRole.id}>.`)
                editMsg.edit(successEmbed);
              } else {
                const errorEmbed = client.embeds.error(command.option.mutedrole, `No roles were recorded from your message.`);
                message.lineReply(errorEmbed);
              }
            } else {
              const embed = client.embeds.settingsNoArgs(command.option.mutedrole, `${settings.mutedRole ? `The current server muted role is <@&${settings.mutedRole}>.` : `Muted role not configured.`}`, settings.prefix);

              message.lineReply(embed)
            }
            break;
          }
          case "welc":
          case "welcome":
          case "welcomesystem":
          {
            if (thirdArg) {
              const pendingEmbed = client.embeds.pending(command.option.welcome, `Setting the welcome system on / off...`);

              if (thirdArg.toLowerCase().includes("on") || thirdArg.toLowerCase().includes("off")) {
                const editMsg = await message.lineReply(pendingEmbed);

                if (thirdArg.toLowerCase().includes("on")) {
                  if (settings.welcomeSystem) {
                    const errorEmbed = client.embeds.error(command.option.welcome, `The welcome system has already been turned on.`);
                    return editMsg.edit(errorEmbed)
                  }

                  await client.db.settings.set(message.guild.id, true, "welcomeSystem");
                  const successEmbed = client.embeds.success(command.option.welcome, `Turned the welcome system on.`)
                  editMsg.edit(successEmbed);

                } else {
                  if (!settings.welcomeSystem) {
                    const errorEmbed = client.embeds.error(command.option.welcome, `The welcome system has already been turned off.`);
                    return editMsg.edit(errorEmbed)
                  }

                  await client.db.settings.set(message.guild.id, false, "welcomeSystem");
                  const successEmbed = client.embeds.success(command.option.welcome, `Turned the welcome system off.`)
                  editMsg.edit(successEmbed);
                }
              } else {
                const errorEmbed = client.embeds.error(command.option.welcome, `Invalid setting option, valid options: \`on\` or \`off\`.`);

                message.lineReply(errorEmbed);
              }
            } else {
              const embed = client.embeds.settingsNoArgs(command.option.welcome, `The welcome system is currently turned ${settings.welcomeSystem ? `on` : `off`}.`, settings.prefix);

              message.lineReply(embed)
            }
            break;
          }
          case "welcrole":
          case "welcomerole":
          {
            if (thirdArg) {
              if (!settings.welcomeSystem) {
                const errorEmbed = client.embeds.error(command.option.welcomerole, `The welcome system has not been configured.`);
                return message.lineReply(errorEmbed);
              }

              const pendingEmbed = client.embeds.pending(command.option.welcomerole, `Saving the new welcome role...`);
              var newRole = message.mentions.roles.first();
              if (!newRole) newRole = await client.functions.findRole(args.slice(1).join(" "), message.guild);

              if (thirdArg.toLowerCase() == "reset" || thirdArg.toLowerCase() == "off") {
                if (!settings.welcomeRole) {
                  const errorEmbed = client.embeds.error(command.option.welcomerole, `This server does not have a welcome role.`);

                  return message.lineReply(errorEmbed)
                }

                const editMsg = await message.lineReply(pendingEmbed);
                await client.db.settings.delete(message.guild.id, "welcomeRole");

                const successEmbed = client.embeds.success(command.option.welcomerole, `Removed the server welcome role.`)

                return editMsg.edit(successEmbed);
              }

              if (newRole) {
                if (newRole.id == settings.welcomeRole) {
                  const errorEmbed = client.embeds.error(command.option.welcomerole, `The server welcome role has already been set to <@&${settings.welcomeRole}>.`);
                  
                  return message.lineReply(errorEmbed);
                }

                if (newRole.position >= clientMember.roles.highest.position) {
                  const errorEmbed = client.embeds.error(command.option.welcomerole, `I am unable to grant this role to members due to role hierarchy.`);
                  return message.lineReply(errorEmbed);
                }

                if (!clientMember.hasPermission("MANAGE_ROLES")) {
                  const errorEmbed = client.embeds.red(command.option.welcomerole, `I do not have the required permissions to grant this role.\n\n**Permissions**\n${code}MANAGE_ROLES${code}`);
                  return message.lineReply(errorEmbed)
                }

                const editMsg = await message.lineReply(pendingEmbed);

                await client.db.settings.set(message.guild.id, newRole.id, "welcomeRole");
                const successEmbed = client.embeds.success(command.option.welcomerole, `Set the server welcome role to: <@&${newRole.id}>.`)
                editMsg.edit(successEmbed);
              } else {
                const errorEmbed = client.embeds.error(command.option.welcomerole, `No roles were recorded from your message.`);
                message.lineReply(errorEmbed);
              }
            } else {
              const embed = client.embeds.settingsNoArgs(command.option.welcomerole, `${settings.welcomeRole ? `The current server welcome role is <@&${settings.welcomeRole}>.` : `Welcome role not configured.`}`, settings.prefix);

              message.lineReply(embed)
            }
            break
          }
          case "welcchan":
          case "welcchannel":
          case "welcomechannel":
          {
            if (thirdArg) {
              if (!settings.welcomeSystem) {
                const errorEmbed = client.embeds.error(command.option.welcomechannel, `The welcome system has not been configured.`);
                return message.lineReply(errorEmbed);
              }

              const pendingEmbed = client.embeds.pending(command.option.welcomechannel, `Saving the new welcome channel...`);
              var newChannel = message.mentions.channels.first();
              if (!newChannel) newChannel = await client.functions.findChannel(args.slice(1).join(" "), message.guild);

              if (thirdArg.toLowerCase() == "reset" || thirdArg.toLowerCase() == "off") {
                if (!settings.welcomeChannel) {
                  const errorEmbed = client.embeds.error(command.option.welcomechannel, `This server does not have a welcome channel.`);
                  
                  return message.lineReply(errorEmbed)
                }

                const editMsg = await message.lineReply(pendingEmbed);
                await client.db.settings.delete(message.guild.id, "welcomeChannel");

                const successEmbed = client.embeds.success(command.option.welcomechannel, `Removed the server welcome channel.`)

                return editMsg.edit(successEmbed);
              }

              if (newChannel) {
                if (newChannel.id == settings.welcomeChannel) {
                  const errorEmbed = client.embeds.error(command.option.welcomechannel, `The server welcome channel has already been set to <#${settings.welcomeChannel}>.`);
                  
                  return message.lineReply(errorEmbed);
                }

                if (!newChannel.permissionsFor(clientMember).has("SEND_MESSAGES")) {
                  const errorEmbed = client.embeds.red(command.option.welcomechannel, `I do not have the required permissions in this channel.\n\n**Permissions**\n${code}SEND_MESSAGES${code}`);
                  return message.lineReply(errorEmbed)
                }

                const editMsg = await message.lineReply(pendingEmbed);

                await client.db.settings.set(message.guild.id, newChannel.id, "welcomeChannel");
                const successEmbed = client.embeds.success(command.option.welcomechannel, `Set the server welcome channel to: <#${newChannel.id}>.`)
                editMsg.edit(successEmbed);
              } else {
                const errorEmbed = client.embeds.error(command.option.welcomechannel, `No channels were recorded from your message.`);
                message.lineReply(errorEmbed);
              }
            } else {
              const embed = client.embeds.settingsNoArgs(command.option.welcomechannel, `${settings.welcomeChannel ? `The current server welcome channel is <#${settings.welcomeChannel}>.` : `Welcome channel not configured.`}`, settings.prefix);

              message.lineReply(embed)
            }
            break;
          }
        }
      } else {
        const embed = client.embeds.error(command, `\`${secArg}\` is not a valid settings option, please refer back to the settings page.`)
        message.lineReply(embed)
      }
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, true, message, command);
  }
}