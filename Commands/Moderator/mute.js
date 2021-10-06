const Discord = require("discord.js");
const Fetch = require("node-fetch");

exports.run = async (client, message, args, command, settings, tsettings, extra) => {
  const clientMember = message.guild.me;
  const guildPrefix = await client.functions.fetchPrefix(message.guild);
  
  const noArgs = await client.functions.getNoArgs(command, message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = await client.functions.getArgs(args);
  const code = `\`\`\``;

  const responses = {
    selfWarning: `You are attempting to mute yourself from the server.`,
    botMute: `You are attempting to mute me from the server.`,
    serverOwner: `You are attempting to mute the server owner.`,
    mutedRolePos: `The muted role for this server has a higher or equal position than my top role.`
  }

  try {
    var member = message.mentions.members.first();
    var mutedRole = settings.mutedRoleObj;

    if (!member) member = await client.functions.findMember(secArg, message.guild);
    if (secArg.toLowerCase() == "me") member = message.member;

    if (!member) {
      const embed = client.embeds.noMember(command, secArg);
      return message.reply({ embeds: [embed] });
    }

    if (member.id === client.user.id) {
      const embed = client.embeds.detailed(command, responses.botMute, `Targetted Member - <@${member.id}>\nInitiator - <@${message.author.id}>`);
      return message.reply({ embeds: [embed] });

    } else if (member.id == message.author.id) {
      const embed = client.embeds.detailed(command, responses.selfWarning, `Targetted Member - <@${member.id}>\nInitiator - <@${message.author.id}>`);
      return message.reply({ embeds: [embed] });
      
    } else if (member.id == message.guild.ownerId) {
      const embed = client.embeds.detailed(command, responses.serverOwner, `Server Owner - <@${member.guild.ownerId}>\nTargetted Member - <@${member.id}>`);
      return message.reply({ embeds: [embed] });
    }

    if (client.functions.hierarchy(message.member, member, message.guild)) {
      const embed = client.embeds.detailed(command, client.util.hierarchyM, `Targetted Member - <@${member.id}>: Top Role Position \`${member.roles.highest.position}\`.`, `Initiator - <@${message.author.id}>: Top Role Position \`${message.member.roles.highest.position}\`.`);
      return message.reply({ embeds: [embed] });
    }
    
    if (client.functions.hierarchy(clientMember, member, message.guild)) {
      const embed = client.embeds.detailed(command, client.util.botHierarchyM, `Targetted Member - <@${member.id}>: Top Role Position \`${member.roles.highest.position}\`.\nClient Member - <@${clientMember.id}>: Top Role Position \`${clientMember.roles.highest.position}\`.`);
      return message.reply({ embeds: [embed] });
    }

    if (client.functions.isMod(member, message.guild, settings, true)) {
      const embed = client.embeds.error(command, `This member is a server mod or admin, I cannot mute them.`);
      return message.reply({ embeds: [embed] });
    }

    var pendingEmbed = client.embeds.pending(command, "Muting the member...");
    if (!mutedRole) pendingEmbed = client.embeds.pending(command, "Creating muted role...");
    var editMsg = await message.reply({ embeds: [pendingEmbed] });

    if (!mutedRole) {
      mutedRole = message.guild.roles.cache.find(r => r.name.toLowerCase() == "muted");

      if (!mutedRole) {
        if (!clientMember.permissions.has("MANAGE_ROLES")) {
          const embed = client.embeds.botPermission("MANAGE_ROLES", `I am unable to create the server muted role.`);
          return editMsg.edit({ embeds: [embed] });
        }

        mutedRole = await message.guild.roles.create({
          data: {
            name: "Muted",
            position: clientMember.roles.highest.position,
            color: "#979c9f",
            permissions: new Discord.Permissions(0)
          },
          reason: `Created server muted role. Responsible User: ${message.author.tag}`
        });
      }

      client.db.settings.set(message.guild.id, mutedRole.id, "mutedRole");
      pendingEmbed = client.embeds.pending(command, "Muting the member");
      editMsg.edit({ embeds: [pendingEmbed] });
    }

    if (member.roles.cache.has(mutedRole.id)) {
      const embed = client.embeds.error(command, `<@${member.id}> is already muted in this server.`);
      return editMsg.edit({ embeds: [embed] });
    }

    if (client.functions.hierarchy(clientMember, mutedRole, message.guild)) {
      const embed = client.embeds.detailed(command, client.util.hierarchyM, `Muted Role - <@${mutedRole.id}>: Position \`${mutedRole.position}\`.`, `My Top Role - <@${clientMember.roles.highest.id}>: Top Role Position \`${clientMember.roles.highest.position}\`.`);
      return message.reply({ embeds: [embed] });
    }

    if (!clientMember.permissions.has("MANAGE_ROLES")) {
      const embed = client.embeds.botPermission(command);
      return editMsg.edit({ embeds: [embed] });
    }

    var timeObj = {};
    var reason = client.util.reason;

    if (thirdArg) {
      if (fourthArg) {
        timeObj = await client.functions.getTime(thirdArg);
        if (!timeObj.passed) {
          reason = args.slice(1).join(" ");
        } else {
          reason = args.slice(2).join(" ");
        }
      } else {
        timeObj = await client.functions.getTime(thirdArg);
        if (!timeObj.passed) reason = args.slice(1).join(" ");
      }
    }

    if (!settings.mutedRoleConfig) {
      if (clientMember.permissions.has("MANAGE_CHANNELS")) {
        const pendEmbed = client.embeds.pending(command, `Configuring muted role...`);
        editMsg.edit({ embeds: [pendEmbed] });

        for await (const [key, channel] of message.guild.channels.cache.entries()) {
          if (channel.permissionsFor(clientMember).has("MANAGE_CHANNELS")) {
            await channel.permissionOverwrites.edit(mutedRole, { SEND_MESSAGES: false });
          }
        }
        
        client.db.settings.set(message.guild.id, true, "mutedRoleConfig");
      }
    }

    const embed = client.embeds.moderated("mute", message.guild, reason, timeObj.duration);
    if (!member.user.bot) member.user.send({ embeds: [embed] });

    member.roles.add(mutedRole)
    .then(() => {
      const fields = [];
      if (reason !== client.util.reason) fields.push({
        name: "Reason",
        value: reason,
        inline: false
      })

      if (timeObj.passed) fields.push({
        name: "Duration",
        value: timeObj.display,
        inline: false
      })

      const caseData = {
        type: "MUTE",
        user: member.id,
        moderator: message.author.id,
        reason: reason,
        timestamp: Math.round(Date.now() / 1000)
      }

      client.functions.createCase(caseData, settings, message.guild);
      if (timeObj.passed) {
        const key = `${member.id}-${message.guild.id}[mute]`;
        const successEmbed = client.embeds.success(command, `Muted <@${member.id}> from the server.`, fields);
        editMsg.edit({ embeds: [successEmbed] });

        client.db.timeouts.set(key, message.author.id, "muter");
        client.db.timeouts.set(key, "mute", "type");
        client.db.timeouts.set(key, member.id, "muted");
        client.db.timeouts.set(key, Date.now(), "mutedTimestamp");
        client.db.timeouts.set(key, timeObj.duration, "duration");
        client.db.timeouts.set(key, Date.now() + timeObj.duration, "end");
        client.db.timeouts.set(key, message.guild.id, "guildId");

        if (timeObj.duration > 2147483647) return;
        setTimeout(async () => {
          if (!member.roles.cache.has(mutedRole.id)) return;
          if (!clientMember.permissions.has("MANAGE_ROLES")) return;
          if (client.functions.hierarchy(clientMember, mutedRole, message.guild)) return;
          
          member.roles.remove(mutedRole).catch(() => {});
          client.db.timeouts.delete(key);
        }, timeObj.duration);
      } else {
        const successEmbed = client.embeds.success(command, `Muted <@${member.id}> from the server.`, fields);
        editMsg.edit({ embeds: [successEmbed] });
      }
    })
    .catch(async (error) => {
      const embed = await client.embeds.errorInfo(command, message, error);
      editMsg.edit({ embeds: [embed] });
    })
    
  } catch (error) {
    client.functions.sendErrorMsg(error, message, command, extra.logId);
  }
}