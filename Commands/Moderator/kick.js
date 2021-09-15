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
    noUser: `No members were recorded from your message.`,
  }

  try {
    var member = message.mentions.members.first();
    if (!member) member = await client.functions.findMember(secArg, message.guild);
    if (secArg.toLowerCase() == "me") member = message.member;
    
    var reason = args.slice(1).join(" ");
    if (!reason) reason = client.util.reason;

    if (member) {
      if (member.id === client.user.id) {
        const errorEmbed = client.embeds.detailed(command, responses.botKick, `Targetted Member - <@${member.id}>\nInitiator - <@${message.author.id}>`);
        return message.lineReply(errorEmbed);

      } else if (member.id == message.author.id) {
        const errorEmbed = client.embeds.detailed(command, responses.selfWarning, `Targetted Member - <@${member.id}>\nInitiator - <@${message.author.id}>`);
        return message.lineReply(errorEmbed);
        
      } else if (member.id == message.guild.owner.id) {
        const errorEmbed = client.embeds.error(command, responses.serverOwner, `Server Owner - <@${member.guild.owner.id}>\nTargetted Member - <@${member.id}>`);
        return message.lineReply(errorEmbed);
      }

      if (client.functions.hierarchy(message.member, member, message.guild)) {
        const embed = client.embeds.detailed(command, client.util.hierarchyM, `Targetted Member - <@${member.id}>: Top Role Position \`${member.roles.highest.position}\`.`, `Initiator - <@${message.author.id}>: Top Role Position \`${message.member.roles.highest.position}\`.`);
        return message.lineReply(embed);
      }
      
      if (client.functions.hierarchy(clientMember, member, message.guild)) {
        const clientTopRole = clientMember.roles.highest;
        const embed = client.embeds.detailed(command, client.util.botHierarchyM, `Targetted Member - <@${member.id}>: Top Role Position \`${member.roles.highest.position}\`.\nClient Member - <@${clientMember.id}>: Top Role Position \`${clientTopRole.position}\`.`);
        return message.lineReply(embed);
      }

      const pendingEmbed = client.embeds.pending(command, "Kicking the member...");
      const editMsg = await message.lineReply(pendingEmbed);

      const kickedEmbed = client.embeds.moderated("kick", message.guild, reason);
      if (!member.user.bot) member.user.send(kickedEmbed);
      setTimeout(kickMember, 500);

      function kickMember() {
        member
        .kick(`${member.user.tag} was kicked. Responsible User: ${message.author.tag}`)
        .then(() => {
          const successEmbed = client.embeds.success(command, `Kicked <@${member.id}> from the server.`, [{
            name: "Reason",
            value: reason,
            inline: false
          }])

          editMsg.edit(successEmbed)
        })
        .catch(async (error) => {
          const errorEmbed = await client.embeds.errorInfo(command, message, error);
          editMsg.edit(errorEmbed);
        })
      }
    } else {
      const errorEmbed = client.embeds.noMember(command, secArg);
      message.lineReply(errorEmbed)
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, true, message, command, extra.logId);
  }
}