const Discord = require("discord.js");
const Buttons = require("discord-buttons");
const Fetch = require("node-fetch");

exports.run = async (client, message, args, command, settings, tsettings, extra) => {
  const clientMember = message.guild.me;
  const guildPrefix = await client.functions.fetchPrefix(message.guild);
  
  const noArgs = await client.functions.getNoArgs(command, message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = await client.functions.getArgs(args);
  const code = `\`\`\``;

  const responses = {
    selfWarning: `You are attempting to mute yourself.\n\n**Detailed Info**\n`,
    botMute: `You are attempting to mute me.\n\n**Detailed Info**\n`,
    serverOwner: `You are attempting to mute the server owner.\n\n**Detailed Info**\n`,
    hierarchy: `This member has a higher or equal role position as your top role.\n\n**Detailed Info**\n`,
    botHierarchy: `This member has a higher or equal role position as my top role.\n\n**Detailed Info**\n`,
    pending: `Muting the member...`,
    mutedRolePos: `The muted role for this server has a higher position than my top role.\n\n**Detailed Info**\n`,
    hierarchy: `This member has a higher or equal role position as your top role.\n\n**Detailed Info**\n`
  }

  try {
    var member = message.mentions.members.first();
    var mutedRole = message.guild.roles.cache.get(settings.mutedRole);
    if (!member) member = await client.functions.findMember(secArg, message.guild);
    if (secArg.toLowerCase() == "me") member = message.member;

    if (!member) {
      const errorEmbed = client.embeds.noMember(command, secArg);
      return message.lineReply(errorEmbed)
    }

    if (member.id === client.user.id) {
      const errorEmbed = client.embeds.error(command, `${responses.botMute}Targetted Member - <@${member.id}>\nInitiator - <@${message.author.id}>`)
      return message.lineReply(errorEmbed)

    } else if (member.id == message.author.id) {
      const errorEmbed = client.embeds.error(command, `${responses.selfWarning}Targetted Member - <@${member.id}>\nInitiator - <@${message.author.id}>`);
      return message.lineReply(errorEmbed)
    }

    if (member.id == message.guild.owner.id) {
      const errorEmbed = client.embeds.error(command, `${responses.serverOwner}Server Owner - <@${member.guild.owner.id}>\nTargetted Member - <@${member.id}>`);
      return message.lineReply(errorEmbed)
    }

    if ((message.author.id !== message.guild.owner.id) && member.roles.highest) {
      if (message.member.roles.highest.position <= member.roles.highest.position) {
        const embed = client.embeds.error(command, `${responses.hierarchy}Targetted Member - <@${member.id}>: Top Role Position \`${member.roles.highest.position}\`.\nInitiator - <@${message.author.id}>: Top Role Position \`${message.member.roles.highest.position}\`.`);
        return message.lineReply(embed);
      }
    }
    
    if (member.roles.highest) {
      if (clientMember.roles.highest.position <= member.roles.highest.position) {
        const clientTopRole = clientMember.roles.highest;
        const embed = client.embeds.error(command, `${responses.botHierarchy}Targetted Member - <@${member.id}>: Top Role Position \`${member.roles.highest.position}\`.\nClient Member - <@${clientMember.id}>: Top Role Position \`${clientTopRole.position}\`.`);
        return message.lineReply(embed);
      }
    }

    if (member.hasPermission("ADMINISTRATOR")) {
      const errorEmbed = client.embeds.error(command, `This member has administrator permissions, I cannot mute them.`);
      return editMsg.edit(errorEmbed);
    }

    const pendingEmbed = client.embeds.pending(command, responses.pending);
    var editMsg = await message.lineReply(pendingEmbed);

    if (!mutedRole) {
      mutedRole = message.guild.roles.cache.find(r => r.name.toLowerCase() == "muted");

      if (!mutedRole) {
        if (!clientMember.hasPermission("MANAGE_ROLES")) {
          const embed = client.embeds.botPermissionCustom("MANAGE_ROLES", `I am unable to create the server muted role.`);
          return editMsg.edit(embed)
        }

        const roleEmbed = client.embeds.pending(command, `Created the server muted role.`);
        mutedRole = await message.guild.roles.create({
          data: {
            name: "Muted",
            position: clientMember.roles.highest.position,
            color: "#979c9f",
            permissions: new Discord.Permissions(0)
          },
          reason: `Created server muted role. Responsible User: ${message.author.tag}`
        });

        await client.db.settings.set(message.guild.id, mutedRole.id, "mutedRole");
        editMsg.edit(roleEmbed);
      } else {
        const savedEmbed = client.embeds.pending(command, `Set <@&${mutedRole.id}> as the server muted role.`)
        await client.db.settings.set(message.guild.id, mutedRole.id, "mutedRole");
        editMsg.edit(savedEmbed);
      }

      editMsg.edit(pendingEmbed)
    }

    const clientTopRole = clientMember.roles.highest;
    if (clientTopRole.position <= mutedRole.position) {
      const errorEmbed = client.embeds.error(command, `${responses.mutedRolePos}Muted Role - <@&${mutedRole.id}>: Position \`${mutedRole.position}\`.\nMy Top Role - <@&${clientTopRole.id}>: Position \`${clientTopRole.position}\`.`);
      return editMsg.edit(errorEmbed);
    }

    if (!clientMember.hasPermission("MANAGE_ROLES")) {
      const errorEmbed = client.embeds.botPermission(command);
      return editMsg.edit(errorEmbed);
    }

    if (member.roles.cache.has(mutedRole.id)) {
      const errorEmbed = client.embeds.error(command, `\`${member.user.tag}\` is already muted in this server.`);
      return editMsg.edit(errorEmbed);
    }

    if ((message.author.id !== message.guild.owner.id) && member.roles.highest) {
      if (message.member.roles.highest.position <= member.roles.highest.position) {
        const embed = client.embeds.error(command, `${responses.hierarchy}Targetted Member - <@${member.id}>: Top Role Position \`${member.roles.highest.position}\`.\nInitiator - <@${message.author.id}>: Top Role Position \`${message.member.roles.highest.position}\`.`);
        return editMsg.edit(embed);
      }
    }

    var timeObj = null;
    var reason = "No reason was provided.";

    if (thirdArg) {
      if (fourthArg) {
        timeObj = await client.functions.getTime(thirdArg);
        if (timeObj.passed == false) {
          reason = args.slice(1).join(" ");
        } else {
          reason = args.slice(2).join(" ")
        }
      } else {
        timeObj = await client.functions.getTime(thirdArg);
        if (timeObj.passed == false) reason = args.slice(1).join(" ")
      }
    }

    if (settings.mutedRoleConfig == false) {
      if (clientMember.hasPermission("MANAGE_CHANNELS")) {
        const pendingEmbed1 = client.embeds.pending(command, `Configuring muted role...`);
        editMsg.edit(pendingEmbed1);
        
        await message.guild.channels.cache.forEach((channel) => {
          if (channel.permissionsFor(clientMember).has("MANAGE_CHANNELS")) {
            channel.updateOverwrite(mutedRole, { SEND_MESSAGES: false });
          }
        })

        client.db.settings.set(message.guild.id, true, "mutedRoleConfig");
      }
    }

    member.roles.add(mutedRole)
    .then(() => {
      if (timeObj) {
        if (timeObj.passed == true) {
          const successEmbed = client.embeds.success(command, `Muted <@${member.id}> from the server for ${timeObj.timeView[0]} ${timeObj.unit}${timeObj.timeView[0] > 1 ? `s` : ``}.\n\n**Reason**\n${reason}`);
          editMsg.edit(successEmbed);

          client.db.mutes.set(`${member.id}-${message.guild.id}`, message.author.id, "muter");
          client.db.mutes.set(`${member.id}-${message.guild.id}`, member.id, "muted");
          client.db.mutes.set(`${member.id}-${message.guild.id}`, Date.now(), "mutedTimestamp");
          client.db.mutes.set(`${member.id}-${message.guild.id}`, timeObj.duration, "duration");
          client.db.mutes.set(`${member.id}-${message.guild.id}`, Date.now() + timeObj.duration, "end");
          client.db.mutes.set(`${member.id}-${message.guild.id}`, message.guild.id, "guildId");

          if (timeObj.duration > 2147483647) return

          setTimeout(function() {
            if (member.roles.cache.has(mutedRole.id)) {
              if (clientMember.hasPermission("MANAGE_ROLES")) {
                if (clientMember.roles.highest.position > mutedRole.position) {
                  member.roles.remove(mutedRole).catch(() => {});
                  client.db.mutes.delete(`${member.id}-${message.guild.id}`);
                }
              }
            }
          }, timeObj.duration)
        } else {
          const successEmbed = client.embeds.success(command, `Muted <@${member.id}> from the server. \n\n**Reason**\n${reason}`);
          editMsg.edit(successEmbed);
        }
      } else {
        const successEmbed = client.embeds.success(command, `Muted <@${member.id}> from the server. \n\n**Reason**\n${reason}`);
        editMsg.edit(successEmbed);
      }
    })
    .catch(async (error) => {
      const errorEmbed = await client.embeds.errorInfo(command, error);
      editMsg.edit(errorEmbed);
    })
    
  } catch (error) {
    client.functions.sendErrorMsg(error, true, message, command);
  }
}