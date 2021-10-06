const Discord = require("discord.js");
const Fetch = require("node-fetch");

exports.run = async (client, message, args, command, settings, tsettings, extra) => {
  const clientMember = message.guild.me;
  const guildPrefix = await client.functions.fetchPrefix(message.guild);
  
  const noArgs = await client.functions.getNoArgs(command, message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = await client.functions.getArgs(args);
  const code = `\`\`\``;

  const responses = {
    selfWarning: `You are attempting to ban yourself from the server.`,
    botBan: `You are attempting to ban me from the server.`,
    serverOwner: `You are attempting to ban the server owner.`,
  }

  try {
    var member = message.mentions.members.first();
    var user = message.mentions.users.first();

    if (!member) member = await client.functions.findMember(secArg, message.guild);
    if (!user && !member) user = await client.functions.findUser(secArg, true);
    if (secArg.toLowerCase() == "me") member = message.member;

    var reason = args.slice(1).join(" ");
    if (!reason) reason = client.util.reason;

    if (member || user) {
      if (member) user = member.user;
      if (member.id === client.user.id) {
        const embed = client.embeds.detailed(command, responses.botBan, `Targetted Member - <@${member.id}>\nInitiator - <@${message.author.id}>`);
        return message.reply({ embeds: [embed] });

      } else if (member.id == message.author.id) {
        const embed = client.embeds.detailed(command, responses.selfWarning, `Targetted Member - <@${member.id}>\nInitiator - <@${message.author.id}>`);
        return message.reply({ embeds: [embed] });
        
      } else if (member.id == message.guild.ownerId) {
        const embed = client.embeds.detailed(command, responses.serverOwner, `Server Owner - <@${member.guild.ownerId}>\nTargetted Member - <@${member.id}>`);
        return message.reply({ embeds: [embed] });
      }

      if (member) {
        if (client.functions.hierarchy(message.member, member, message.guild)) {
          const embed = client.embeds.detailed(command, client.util.hierarchyM, `Targetted Member - <@${member.id}>: Top Role Position \`${member.roles.highest.position}\`.`, `Initiator - <@${message.author.id}>: Top Role Position \`${message.member.roles.highest.position}\`.`);
          return message.reply({ embeds: [embed] });
        }
        
        if (client.functions.hierarchy(clientMember, member, message.guild)) {
          const embed = client.embeds.detailed(command, client.util.botHierarchyM, `Targetted Member - <@${member.id}>: Top Role Position \`${member.roles.highest.position}\`.\nClient Member - <@${clientMember.id}>: Top Role Position \`${clientMember.roles.highest.position}\`.`);
          return message.reply({ embeds: [embed] });
        }
      }

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
      
      const pendingEmbed = client.embeds.pending(command, "Banning the member...");
      const editMsg = await message.reply({ embeds: [pendingEmbed] });

      const bannedEmbed = client.embeds.moderated("ban", message.guild, reason, timeObj.duration);
      if (!user.bot) user.send({ embeds: [bannedEmbed] });
      setTimeout(banMember, 500);

      function banMember() {
        message.guild.members.ban(user, { days: command.commandName == "softban" ? 0 : 7, reason: `${user.tag} was banned. Responsible User: ${message.author.tag}` })
        .then(() => {
          const fields = [{
            name: "Reason",
            value: reason,
            inline: false
          }];

          const caseData = {
            type: "BAN",
            user: member.id,
            moderator: message.author.id,
            reason: reason,
            timestamp: Math.round(Date.now() / 1000)
          }

          if (timeObj.passed) {
            fields[1] = {
              name: "Duration",
              value: timeObj.display,
              inline: false
            }
          }

          client.functions.createCase(caseData, settings, message.guild);
          const embed = client.embeds.success(command, `Banned <@${member.id}> from the server.`, fields);
          editMsg.edit({ embeds: [embed] });
        })
        .catch(async (error) => {
          const embed = await client.embeds.errorInfo(command, message, error);
          editMsg.edit({ embeds: [embed] });
        });

        if (timeObj.passed) {
          const key = `${user.id}-${message.guild.id}[ban]`;
          client.db.timeouts.set(key, message.author.id, "banner");
          client.db.timeouts.set(key, "ban", "type");
          client.db.timeouts.set(key, user.id, "banned");
          client.db.timeouts.set(key, Date.now(), "bannedTimestamp");
          client.db.timeouts.set(key, timeObj.duration, "duration");
          client.db.timeouts.set(key, Date.now() + timeObj.duration, "end");
          client.db.timeouts.set(key, message.guild.id, "guildId");

          if (timeObj.duration > client.util.timeoutLimit) return;
          setTimeout(async () => {
            if (clientMember.permissions.has("BAN_MEMBERS")) {
              await message.guild.members.unban(user, `${user.tag} was un-banned. Responsible User: ${message.author.tag}`).catch(() => {});

              client.db.timeouts.delete(key);
            }
          }, timeObj.duration);
        }
      }
    } else {
      const embed = client.embeds.noMember(command, secArg);
      message.reply({ embeds: [embed] });
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, message, command, extra.logId);
  }
}