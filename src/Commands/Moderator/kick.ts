import Discord from "discord.js";
import Types from "../../types";

export default async function run(client: Types.client, message: Discord.Message, args: string[], command: Types.commandData, settings: Types.guildSettings, tsettings: Types.ticketSettings, extra: Types.extraObject) {
  
  const clientMember = message.guild.me;
  const guildPrefix = client.functions.fetchPrefix(message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = client.functions.getArgs(args);
  const code = `\`\`\``;

  const responses = {
    selfWarning: `You are attempting to kick yourself from the server.`,
    botKick: `You are attempting to kick me from the server.`,
    serverOwner: `You are attempting to kick the server owner.`,
  }

  try {
    let member = message.mentions.members.first();
    if (!member) member = client.functions.findMember(secArg, message.guild);
    if (secArg.toLowerCase() == "me") member = message.member;
    
    let reason = args.slice(1).join(" ");
    if (!reason) reason = client.util.messages.reason;

    if (member) {
      if (member.id === client.user.id) {
        const embed = client.embeds.detailed(command, responses.botKick, `Targetted Member - <@${member.id}>\nInitiator - <@${message.author.id}>`);
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

      const pendingEmbed = client.embeds.pending(command, "Kicking the member...");
      const editMsg = await message.reply({ embeds: [pendingEmbed] });

      const kickedEmbed = client.embeds.moderated("KICK", message.guild, reason);
      if (!member.user.bot) member.user.send({ embeds: [kickedEmbed] });
      setTimeout(kickMember, 500);

      function kickMember() {
        member.kick(`${member.user.tag} was kicked. Responsible User: ${message.author.tag}`)
        .then(() => {
          const successEmbed = client.embeds.success(command, `Kicked <@${member.id}> from the server.`, [{
            name: "Reason",
            value: reason,
            inline: false
          }]);

          const caseData: Types.caseData = {
            type: "KICK",
            user: member.id,
            moderator: message.author.id,
            reason: reason,
            timestamp: Math.round(Date.now() / 1000)
          }

          client.functions.createCase(caseData, message.guild);
          editMsg.edit({ embeds: [successEmbed] });
        })
        .catch((error) => {
          const embed = client.embeds.errorInfo(command, message, error);
          editMsg.edit({ embeds: [embed] });
        })
      }
    } else {
      const embed = client.embeds.invalidItem(command, ["member"], [secArg]);
      message.reply({ embeds: [embed] });
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, message, command, extra.logId);
  }
}