const Discord = require("discord.js");
const Fetch = require("node-fetch");

exports.run = async (client, message, args, command, settings, tsettings, extra) => {
  const clientMember = message.guild.me;
  const guildPrefix = await client.functions.fetchPrefix(message.guild);
  
  const noArgs = await client.functions.getNoArgs(command, message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = await client.functions.getArgs(args);
  const code = `\`\`\``;

  const responses = {
    selfWarning: `You are attempting to kick yourself from the server.`,
    botKick: `You are attempting to kick me from the server.`,
    serverOwner: `You are attempting to kick the server owner.`,
  }

  try {
    var member = message.mentions.members.first();
    if (!member) member = await client.functions.findMember(secArg, message.guild);
    if (secArg.toLowerCase() == "me") member = message.member;
    
    var reason = args.slice(1).join(" ");
    if (!reason) reason = client.util.reason;

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

      if (client.functions.hierarchy(message.member, member, message.guild)) {
        const embed = client.embeds.detailed(command, client.util.hierarchyM, `Targetted Member - <@${member.id}>: Top Role Position \`${member.roles.highest.position}\`.`, `Initiator - <@${message.author.id}>: Top Role Position \`${message.member.roles.highest.position}\`.`);
        return message.reply({ embeds: [embed] });
      }
      
      if (client.functions.hierarchy(clientMember, member, message.guild)) {
        const embed = client.embeds.detailed(command, client.util.botHierarchyM, `Targetted Member - <@${member.id}>: Top Role Position \`${member.roles.highest.position}\`.\nClient Member - <@${clientMember.id}>: Top Role Position \`${clientMember.roles.highest.position}\`.`);
        return message.reply({ embeds: [embed] });
      }

      const pendingEmbed = client.embeds.pending(command, "Kicking the member...");
      const editMsg = await message.reply({ embeds: [pendingEmbed] });

      const kickedEmbed = client.embeds.moderated("kick", message.guild, reason);
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

          const caseData = {
            type: "KICK",
            user: member.id,
            moderator: message.author.id,
            reason: reason,
            timestamp: Math.round(Date.now() / 1000)
          }

          client.functions.createCase(caseData, settings, message.guild);
          editMsg.edit({ embeds: [successEmbed] });
        })
        .catch(async (error) => {
          const embed = await client.embeds.errorInfo(command, message, error);
          editMsg.edit({ embeds: [embed] });
        })
      }
    } else {
      const embed = client.embeds.noMember(command, secArg);
      message.reply({ embeds: [embed] });
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, message, command, extra.logId);
  }
}