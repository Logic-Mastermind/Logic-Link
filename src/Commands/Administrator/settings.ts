import Discord from "discord.js";
import Types from "../../Typings/types";

export default async function run(client: Types.client, message: Discord.Message, args: string[], command: Types.commandData, settings: Types.guildSettings, tsettings: Types.ticketSettings, extra: Types.extraObject) {
  
  const clientMember = message.guild.me;
  const guildPrefix = client.functions.fetchPrefix(message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = client.functions.getArgs(args);
  const code = `\`\`\``;
  const responses = {};

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
          { name: "Welcome Channel", value: `${settings.welcomeChannel ? `<#${settings.welcomeChannel}>` : `Not configured.`}`, inline: true},
          { name: "Welcome Role", value: `${settings.welcomeRole ? `<@&${settings.welcomeRole}>` : `Not configured.`}`, inline: true },
          { name: "Welcome Message", value: `${settings.welcomeMsg ? `${settings.welcomeMsg}` : `Not configured.`}`, inline: true }
        )
      }

      const embed = client.embeds.blue(command, `${client.util.messages.welcomeBotInfo}\n\n**Server Settings**\nBelow is a list of configurations for this server.\nTo modify any of these settings, run: \`${guildPrefix}settings [option] [new setting]\`.\nTo reset your server settings, run: \`${guildPrefix}settings reset\`.\n\n${code}Settings${code}\u200b`, settingsArray);

      message.reply({ embeds: [embed] })
    } else {
      switch (secArg.toLowerCase()) {
        case "pre":
        case "prefix":
        {
          if (thirdArg) {
            const pendingEmbed = client.embeds.pending(command.option.prefix, `Saving the new prefix...`);
            let newPrefix = args.slice(1).join(" ");

            if (newPrefix == settings.prefix) {
              const embed = client.embeds.error(command.option.prefix, `The server prefix has already been set to \`${newPrefix}\`.`);
              return message.reply({ embeds: [embed] })
            }

            if (client.util.resetAliases.includes(thirdArg.toLowerCase())) {
              newPrefix = client.config.defaultPrefix;
              const editMsg = await message.reply({ embeds: [pendingEmbed] });
              client.db.settings.set(message.guild.id, newPrefix, "prefix");

              const successEmbed = client.embeds.success(command.option.prefix, `Reset the server prefix to the default: \`${newPrefix}\`.`)

              return editMsg.edit({ embeds: [successEmbed] });
            }

            if (newPrefix.length > 5) {
              const embed = client.embeds.error(command.option.prefix, `The new server prefix must be 5 or less characters long.`);
              return message.reply({ embeds: [embed] });
            }

            const editMsg = await message.reply({ embeds: [pendingEmbed] });
            client.db.settings.set(message.guild.id, newPrefix, "prefix");
            
            const successEmbed = client.embeds.success(command.option.prefix, `Set the server prefix to: \`${newPrefix}\`.`)
            editMsg.edit({ embeds: [successEmbed] });
          } else {
            const embed = client.embeds.settingsNoArgs(command.option.prefix, `The current server prefix is \`${settings.prefix}\`.`, settings.prefix);

            message.reply({ embeds: [embed] });
          }
          break;
        }
        case "mod":
        case "moderatorrole":
        case "modrole":
        {
          if (thirdArg) {
            const pendingEmbed = client.embeds.pending(command.option.modrole, `Saving the new moderator role...`);
            let newRole = message.mentions.roles.first();
            if (!newRole) newRole = client.functions.findRole(args.slice(1).join(" "), message.guild);

            if (client.util.resetAliases.includes(thirdArg.toLowerCase())) {
              if (!settings.modRole) {
                const embed = client.embeds.error(command.option.modrole, `This server does not have a moderator role.`);
                
                return message.reply({ embeds: [embed] })
              }

              const editMsg = await message.reply({ embeds: [pendingEmbed] });
              client.db.settings.delete(message.guild.id, "modRole");
              const successEmbed = client.embeds.success(command.option.modrole, `Removed the server moderator role.`);

              return editMsg.edit({ embeds: [successEmbed] });
            }

            if (newRole) {
              if (newRole.id == settings.modRole) {
                const embed = client.embeds.error(command.option.modrole, `The server moderator role has already been set to <@&${settings.modRole}>.`);
                
                return message.reply({ embeds: [embed] });
              }

              const editMsg = await message.reply({ embeds: [pendingEmbed] });
              client.db.settings.set(message.guild.id, newRole.id, "modRole");
              const successEmbed = client.embeds.success(command.option.modrole, `Set the server moderator role to: <@&${newRole.id}>.`)
              editMsg.edit({ embeds: [successEmbed] });
            } else {
              const embed = client.embeds.invalidItem(command.option.modrole, ["role"], [args.slice(1).join(" ")]);
              message.reply({ embeds: [embed] });
            }
          } else {
            const embed = client.embeds.settingsNoArgs(command.option.modrole, `${settings.modRole ? `The current server moderator role is <@&${settings.modRole}>.` : `Moderator role not configured.`}`, settings.prefix);

            message.reply({ embeds: [embed] });
          }
          break;
        }
        case "admin":
        case "administratorrole":
        case "adminrole":
        {
          if (thirdArg) {
            const pendingEmbed = client.embeds.pending(command.option.adminrole, `Saving the new administrator role...`);
            let newRole = message.mentions.roles.first();
            if (!newRole) newRole = client.functions.findRole(args.slice(1).join(" "), message.guild);

            if (client.util.resetAliases.includes(thirdArg.toLowerCase())) {
              if (!settings.adminRole) {
                const embed = client.embeds.error(command.option.adminrole, `This server does not have an administrator role.`);

                return message.reply({ embeds: [embed] });
              }

              const editMsg = await message.reply({ embeds: [pendingEmbed] });
              client.db.settings.delete(message.guild.id, "adminRole");

              const successEmbed = client.embeds.success(command.option.adminrole, `Removed the server administrator role.`)

              return editMsg.edit({ embeds: [successEmbed] });
            }

            if (newRole) {
              if (newRole.id == settings.adminRole) {
                const embed = client.embeds.error(command.option.adminrole, `The server administrator role has already been set to <@&${settings.adminRole}>.`);
                return message.reply({ embeds: [embed] });
              }

              const editMsg = await message.reply({ embeds: [pendingEmbed] });
              client.db.settings.set(message.guild.id, newRole.id, "adminRole");
              const successEmbed = client.embeds.success(command.option.adminrole, `Set the server administrator role to: <@&${newRole.id}>.`);
              editMsg.edit({ embeds: [successEmbed] });
            } else {
              const embed = client.embeds.invalidItem(command.option.modrole, ["role"], [args.slice(1).join(" ")]);
              message.reply({ embeds: [embed] });
            }
          } else {
            const embed = client.embeds.settingsNoArgs(command.option.adminrole, `${settings.adminRole ? `The current server administrator role is <@&${settings.adminRole}>.` : `Administrator role not configured.`}`, settings.prefix);

            message.reply({ embeds: [embed] });
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
            let newChannel = message.mentions.channels.first() as Types.guildChannel;
            if (!newChannel) newChannel = client.functions.findChannel(args.slice(1).join(" "), message.guild);

            if (client.util.resetAliases.includes(thirdArg.toLowerCase())) {
              if (!settings.logChannel) {
                const embed = client.embeds.error(command.option.logchannel, `This server does not have a log channel.`);
                
                return message.reply({ embeds: [embed] });
              }

              const editMsg = await message.reply({ embeds: [pendingEmbed] });
              client.db.settings.delete(message.guild.id, "logChannel");

              const successEmbed = client.embeds.success(command.option.logchannel, `Removed the server log channel.`);
              return editMsg.edit({ embeds: [successEmbed] });
            }

            if (newChannel) {
              if (newChannel.id == settings.logChannel) {
                const embed = client.embeds.error(command.option.logchannel, `The server log channel has already been set to <#${settings.logChannel}>.`);
                return message.reply({ embeds: [embed] });
              }

              if (!newChannel.isText()) {
                const embed = client.embeds.error(command, `<#${newChannel.id}> is not a text channel.`);
                return message.reply({ embeds: [embed] });
              }

              if (!newChannel.permissionsFor(clientMember).has("SEND_MESSAGES")) {
                const embed = client.embeds.botPermission("SEND_MESSAGES", `I do not have the required permissions in this channel.`);
                return message.reply({ embeds: [embed] });
              }

              const editMsg = await message.reply({ embeds: [pendingEmbed] });
              client.db.settings.set(message.guild.id, newChannel.id, "logChannel");
              const successEmbed = client.embeds.success(command.option.logchannel, `Set the server log channel to: <#${newChannel.id}>.`);
              editMsg.edit({ embeds: [successEmbed] });
            } else {
              const embed = client.embeds.error(command.option.logchannel, `No channels were recorded from your message.`);
              message.reply({ embeds: [embed] });
            }
          } else {
            const embed = client.embeds.settingsNoArgs(command.option.logchannel, `${settings.logChannel ? `The current server log channel is <#${settings.logChannel}>.` : `Log channel not configured.`}`, settings.prefix);

            message.reply({ embeds: [embed] });
          }
          break;
        }
        case "muted":
        case "mutedrole":
        {
          if (thirdArg) {
            const pendingEmbed = client.embeds.pending(command.option.mutedrole, `Saving the new muted role...`);
            let newRole = message.mentions.roles.first();
            if (!newRole) newRole = client.functions.findRole(args.slice(1).join(" "), message.guild);

            if (client.util.resetAliases.includes(thirdArg.toLowerCase())) {
              if (!settings.mutedRole) {
                const embed = client.embeds.error(command.option.mutedrole, `This server does not have a muted role.`);

                return message.reply({ embeds: [embed] })
              }

              const editMsg = await message.reply({ embeds: [pendingEmbed] });
              client.db.settings.delete(message.guild.id, "mutedRole");
              const successEmbed = client.embeds.success(command.option.mutedrole, `Removed the server muted role.`);

              return editMsg.edit({ embeds: [successEmbed] });
            }

            if (newRole) {
              if (newRole.id == settings.mutedRole) {
                const embed = client.embeds.error(command.option.mutedrole, `The server muted role has already been set to <@&${settings.mutedRole}>.`);
                
                return message.reply({ embeds: [embed] });
              }

              if (!clientMember.permissions.has("MANAGE_ROLES")) {
                const errorEmbed = client.embeds.botPermission("MANAGE_ROLES", `I do not have the required permissions to use this role.`);
                return message.reply({ embeds: [errorEmbed] })
              }

              if (client.functions.hierarchy(clientMember, newRole)) {
                const embed = client.embeds.error(command.option.welcomerole, `I am unable to use this role to members due to role hierarchy.`);
                return message.reply({ embeds: [embed] });
              }

              const editMsg = await message.reply({ embeds: [pendingEmbed] });
              client.db.settings.set(message.guild.id, newRole.id, "mutedRole");
              const successEmbed = client.embeds.success(command.option.mutedrole, `Set the server muted role to: <@&${newRole.id}>.`)
              editMsg.edit({ embeds: [successEmbed] });
            } else {
              const embed = client.embeds.invalidItem(command.option.mutedrole, ["role"], [args.slice(1).join(" ")]);
              message.reply({ embeds: [embed] });
            }
          } else {
            const embed = client.embeds.settingsNoArgs(command.option.mutedrole, `${settings.mutedRole ? `The current server muted role is <@&${settings.mutedRole}>.` : `Muted role not configured.`}`, settings.prefix);

            message.reply({ embeds: [embed] })
          }
          break;
        }
        case "welc":
        case "welcome":
        case "welcomesystem":
        {
          if (thirdArg) {
            const pendingEmbed = client.embeds.pending(command.option.welcome, `Configuring the welcome system...`);

            if (thirdArg.toLowerCase().includes("on") || thirdArg.toLowerCase().includes("off")) {
              const editMsg = await message.reply({ embeds: [pendingEmbed] });

              if (thirdArg.toLowerCase().includes("on")) {
                if (settings.welcomeSystem) {
                  const embed = client.embeds.error(command.option.welcome, `The welcome system has already been turned on.`);
                  return editMsg.edit({ embeds: [embed] });
                }

                client.db.settings.set(message.guild.id, true, "welcomeSystem");
                const successEmbed = client.embeds.success(command.option.welcome, `Turned the welcome system on.`)
                editMsg.edit({ embeds: [successEmbed] });

              } else {
                if (!settings.welcomeSystem) {
                  const embed = client.embeds.error(command.option.welcome, `The welcome system has already been turned off.`);
                  return editMsg.edit({ embeds: [embed] });
                }

                client.db.settings.set(message.guild.id, false, "welcomeSystem");
                const successEmbed = client.embeds.success(command.option.welcome, `Turned the welcome system off.`)
                editMsg.edit({ embeds: [successEmbed] });
              }
            } else {
              const embed = client.embeds.error(command.option.welcome, `Invalid setting option, valid options: \`on\` or \`off\`.`);

              message.reply({ embeds: [embed] });
            }
          } else {
            const embed = client.embeds.settingsNoArgs(command.option.welcome, `The welcome system is currently turned ${settings.welcomeSystem ? `on` : `off`}.`, settings.prefix);

            message.reply({ embeds: [embed] })
          }
          break;
        }
        case "wr":
        case "welcrole":
        case "welcomerole":
        {
          if (thirdArg) {
            if (!settings.welcomeSystem) {
              const embed = client.embeds.error(command.option.welcomerole, `The welcome system has not been configured.`);
              return message.reply({ embeds: [embed] });
            }

            const pendingEmbed = client.embeds.pending(command.option.welcomerole, `Saving the new welcome role...`);
            let newRole = message.mentions.roles.first();
            if (!newRole) newRole = client.functions.findRole(args.slice(1).join(" "), message.guild);

            if (client.util.resetAliases.includes(thirdArg.toLowerCase())) {
              if (!settings.welcomeRole) {
                const embed = client.embeds.error(command.option.welcomerole, `This server does not have a welcome role.`);

                return message.reply({ embeds: [embed] })
              }

              const editMsg = await message.reply({ embeds: [pendingEmbed] });
              client.db.settings.delete(message.guild.id, "welcomeRole");
              const successEmbed = client.embeds.success(command.option.welcomerole, `Removed the server welcome role.`);

              return editMsg.edit({ embeds: [successEmbed] });
            }

            if (newRole) {
              if (newRole.id == settings.welcomeRole) {
                const embed = client.embeds.error(command.option.welcomerole, `The server welcome role has already been set to <@&${settings.welcomeRole}>.`);
                
                return message.reply({ embeds: [embed] });
              }

              if (!clientMember.permissions.has("MANAGE_ROLES")) {
                const embed = client.embeds.botPermission("MANAGE_ROLES", `I do not have the required permissions to use this role.`);
                return message.reply({ embeds: [embed] });
              }

              if (client.functions.hierarchy(clientMember, newRole)) {
                const embed = client.embeds.error(command.option.welcomerole, `I am unable to use this role to members due to role hierarchy.`);
                return message.reply({ embeds: [embed] });
              }

              const editMsg = await message.reply({ embeds: [pendingEmbed] });
              client.db.settings.set(message.guild.id, newRole.id, "welcomeRole");
              const successEmbed = client.embeds.success(command.option.welcomerole, `Set the server welcome role to: <@&${newRole.id}>.`);
              editMsg.edit({ embeds: [successEmbed] });
            } else {
              const embed = client.embeds.invalidItem(command.option.welcomerole, ["role"], [args.slice(1).join(" ")]);
              message.reply({ embeds: [embed] });
            }
          } else {
            const embed = client.embeds.settingsNoArgs(command.option.welcomerole, `${settings.welcomeRole ? `The current server welcome role is <@&${settings.welcomeRole}>.` : `Welcome role not configured.`}`, settings.prefix);
            message.reply({ embeds: [embed] });
          }
          break
        }
        case "wc":
        case "welcchan":
        case "welcchannel":
        case "welcomechannel":
        {
          if (thirdArg) {
            if (!settings.welcomeSystem) {
              const embed = client.embeds.error(command.option.welcomechannel, `The welcome system has not been configured.`);
              return message.reply({ embeds: [embed] });
            }

            const pendingEmbed = client.embeds.pending(command.option.welcomechannel, `Saving the new welcome channel...`);
            let newChannel = message.mentions.channels.first() as Types.guildChannel;
            if (!newChannel) newChannel = client.functions.findChannel(args.slice(1).join(" "), message.guild);

            if (client.util.resetAliases.includes(thirdArg.toLowerCase())) {
              if (!settings.welcomeChannel) {
                const embed = client.embeds.error(command.option.welcomechannel, `This server does not have a welcome channel.`);
                return message.reply({ embeds: [embed] })
              }

              const editMsg = await message.reply({ embeds: [pendingEmbed] });
              client.db.settings.delete(message.guild.id, "welcomeChannel");

              const successEmbed = client.embeds.success(command.option.welcomechannel, `Removed the server welcome channel.`);
              return editMsg.edit({ embeds: [successEmbed] });
            }

            if (newChannel) {
              if (newChannel.id == settings.welcomeChannel) {
                const embed = client.embeds.error(command.option.welcomechannel, `The server welcome channel has already been set to <#${settings.welcomeChannel}>.`);
                
                return message.reply({ embeds: [embed] });
              }

              if (!newChannel.isText()) {
                const embed = client.embeds.error(command, `<#${newChannel.id}> is not a text channel.`);
                return message.reply({ embeds: [embed] });
              }

              if (!newChannel.permissionsFor(clientMember).has("SEND_MESSAGES")) {
                const embed = client.embeds.botPermission("SEND_MESSAGES", `I do not have the required permissions in this channel.`);
                return message.reply({ embeds: [embed] })
              }

              const editMsg = await message.reply({ embeds: [pendingEmbed] });
              client.db.settings.set(message.guild.id, newChannel.id, "welcomeChannel");
              const successEmbed = client.embeds.success(command.option.welcomechannel, `Set the server welcome channel to: <#${newChannel.id}>.`);
              editMsg.edit({ embeds: [successEmbed] });
            } else {
              const embed = client.embeds.error(command.option.welcomechannel, `No channels were recorded from your message.`);
              message.reply({ embeds: [embed] });
            }
          } else {
            const embed = client.embeds.settingsNoArgs(command.option.welcomechannel, `${settings.welcomeChannel ? `The current server welcome channel is <#${settings.welcomeChannel}>.` : `Welcome channel not configured.`}`, settings.prefix);

            message.reply({ embeds: [embed] })
          }
          break;
        }
        case "wm":
        case "welcmsg":
        case "welcmessage":
        case "welcomemessage":
        {
          if (thirdArg) {
            if (!settings.welcomeSystem) {
              const embed = client.embeds.error(command.option.welcomemsg, `The welcome system has not been configured.`);
              return message.reply({ embeds: [embed] });
            }

            const pendingEmbed = client.embeds.pending(command.option.welcomemsg, `Saving the new welcome message...`);
            let msg = args.slice(1).join(" ");

            if (client.util.resetAliases.includes(thirdArg.toLowerCase())) {
              if (!settings.welcomeMsg) {
                const embed = client.embeds.error(command.option.welcomemsg, `This server does not have a welcome message.`);
                
                return message.reply({ embeds: [embed] })
              }

              const editMsg = await message.reply({ embeds: [pendingEmbed] });
              client.db.settings.delete(message.guild.id, "welcomeMsg");

              const successEmbed = client.embeds.success(command.option.welcomemsg, `Removed the server welcome message.`)
              return editMsg.edit({ embeds: [successEmbed] });
            }

            const editMsg = await message.reply({ embeds: [pendingEmbed] });
            client.db.settings.set(message.guild.id, msg, "welcomeMsg");
            const successEmbed = client.embeds.success(command.option.welcomemsg, `Set the server welcome message to:\n\n${code}${msg}${code}`);
            editMsg.edit({ embeds: [successEmbed] });

          } else {
            const embed = client.embeds.settingsNoArgs(command.option.welcomemsg, `${settings.welcomeMsg ? `The current server welcome message has been set to:\n\`${settings.welcomeMsg}\`` : `Welcome message not configured.`}`, settings.prefix);

            message.reply({ embeds: [embed] })
          }
          break;
        }
        case "rst":
        case "reset":
        {
          const embed = client.embeds.warn(command.option.reset, `Are you sure that you would like to reset server settings?`);
          const confirm = client.components.button({ label: "Confirm", style: "SUCCESS", id: "Settings_Reset:Confirm" });
          const cancel = client.components.button({ label: "Cancel", style: "DANGER", id: "Settings_Reset:Cancel" });
          const row = client.components.actionRow(confirm, cancel);

          const msg = await message.reply({ embeds: [embed], components: [row] });
          //extra.prompt.resetSettings();

          break;
        }
        default:
        {
          const embed = client.embeds.error(command, `\`${secArg}\` is not a valid settings option, please refer back to the settings page.`);
          message.reply({ embeds: [embed] });
        }
      }
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, message, command, extra.logId);
  }
}