import Discord from "discord.js";
import Types from "../../Typings/types";

export default async function run(client: Types.client, message: Discord.Message, args: string[], command: Types.commandData, settings: Types.guildSettings, tsettings: Types.ticketSettings, extra: Types.extraObject) {
  
  const clientMember = message.guild.me;
  const guildPrefix = client.functions.fetchPrefix(message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = client.functions.getArgs(args);
  const code = `\`\`\``;

  const responses = {
    selfWarning: `You are attempting to ban yourself from the server.`,
    botBan: `You are attempting to ban me from the server.`,
    serverOwner: `You are attempting to ban the server owner.`,
  }

  try {
    let member = message.mentions.members.first();
    let user = message.mentions.users.first();

    if (!member) member = client.functions.findMember(secArg, message.guild);
    if (!user && !member) user = await client.functions.findUser(secArg, { safe: true });
    if (secArg.toLowerCase() == "me") member = message.member;

    let reason = args.slice(1).join(" ");
    let timeObj: Types.timeData;
    if (!reason) reason = client.util.messages.reason;

    if (member || user) {
      if (member) {
        user = member.user;
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

        if (client.functions.hierarchy(message.member, member)) {
          const embed = client.embeds.detailed(command, client.util.messages.hierarchyM, `Targetted Member - <@${member.id}>: Top Role Position \`${member.roles.highest.position}\`.`, `Initiator - <@${message.author.id}>: Top Role Position \`${message.member.roles.highest.position}\`.`);
          return message.reply({ embeds: [embed] });
        }
        
        if (client.functions.hierarchy(clientMember, member)) {
          const embed = client.embeds.detailed(command, client.util.messages.botHierarchyM, `Targetted Member - <@${member.id}>: Top Role Position \`${member.roles.highest.position}\`.\nClient Member - <@${clientMember.id}>: Top Role Position \`${clientMember.roles.highest.position}\`.`);
          return message.reply({ embeds: [embed] });
        }
      }

      if (command.commandName !== "softban") {
        if (thirdArg) {
          if (fourthArg) {
            timeObj = client.functions.getTime(thirdArg);
            if (!timeObj.passed) {
              reason = args.slice(1).join(" ");
            } else {
              reason = args.slice(2).join(" ");
            }
          } else {
            timeObj = client.functions.getTime(thirdArg);
            if (!timeObj.passed) reason = args.slice(1).join(" ");
          }
        }
      }
      
      const pendingEmbed = client.embeds.pending(command, "Banning the member...");
      const editMsg = await message.reply({ embeds: [pendingEmbed] });

      const bannedEmbed = client.embeds.moderated("BAN", message.guild, reason, timeObj?.duration);
      if (!user.bot) await user.send({ embeds: [bannedEmbed] });
      setTimeout(banMember, 500, user);

      function banMember(userToBan: Discord.User) {
        message.guild.members.ban(userToBan, { days: command.commandName == "softban" ? 0 : 7, reason: `${userToBan.tag} was banned. Responsible User: ${message.author.tag}` })
        .then(() => {
          const fields = [{
            name: "Reason",
            value: reason,
            inline: false
          }];

          const caseData: Types.caseData = {
            type: command.commandName == "softban" ? "SOFTBAN" : "BAN",
            user: member.id,
            moderator: message.author.id,
            reason: reason,
            timestamp: Math.round(Date.now() / 1000)
          }

          if (timeObj?.passed) {
            fields[1] = {
              name: "Duration",
              value: timeObj.display,
              inline: false
            }
          }

          if (command.commandName == "softban") message.guild.members.unban(userToBan, `Unbanning the user, as per a softban.`);
          client.functions.createCase(caseData, message.guild);

          const embed = client.embeds.success(command, `${command.commandName == "softban" ? "Soft-banned" : "Banned"} <@${member.id}> from the server.`, fields);
          editMsg.edit({ embeds: [embed] });
        })
        .catch((error) => {
          const embed = client.embeds.errorInfo(command, message, error);
          editMsg.edit({ embeds: [embed] });
        });

        if (timeObj?.passed) {
          const key = `${userToBan.id}-${message.guild.id}[ban]`;
          client.db.timeouts.set(key, "BAN", "type");
          client.db.timeouts.set(key, userToBan.id, "banned");
          client.db.timeouts.set(key, Date.now() + timeObj?.duration, "end");
          client.db.timeouts.set(key, message.guild.id, "guildId");

          if (timeObj?.duration > client.util.timeoutLimit) return;
          setTimeout(async () => {
            if (clientMember.permissions.has("BAN_MEMBERS")) {
              await message.guild.members.unban(userToBan, `${userToBan.tag} was un-banned. Responsible User: ${message.author.tag}`).catch(() => {});

              client.db.timeouts.delete(key);
            }
          }, timeObj.duration);
        }
      }
    } else {
      const embed = client.embeds.invalidItem(command, ["member"], [secArg]);
      message.reply({ embeds: [embed] });
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, message, command, extra.logId);
  }
}