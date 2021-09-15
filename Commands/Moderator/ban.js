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
    if (!user) user = await client.functions.findUser(secArg, true);
    if (secArg.toLowerCase() == "me") member = message.member;

    var reason = args.slice(1).join(" ");
    if (!reason) reason = client.util.reason;

    if (member) {
      if (member.id === client.user.id) {
        const errorEmbed = client.embeds.detailed(command, responses.botBan, `Targetted Member - <@${member.id}>\nInitiator - <@${message.author.id}>`);
        return message.lineReply(errorEmbed);

      } else if (member.id == message.author.id) {
        const errorEmbed = client.embeds.detailed(command, responses.selfWarning, `Targetted Member - <@${member.id}>\nInitiator - <@${message.author.id}>`);
        return message.lineReply(errorEmbed);
        
      } else if (member.id == message.guild.owner.id) {
        const errorEmbed = client.embeds.error(command, responses.serverOwner, `Server Owner - <@${member.guild.owner.id}>\nTargetted Member - <@${member.id}>`);
        return message.lineReply(errorEmbed);
      }

      if (member.user) {
        if (client.functions.hierarchy(message.member, member, message.guild)) {
          const embed = client.embeds.detailed(command, client.util.hierarchyM, `Targetted Member - <@${member.id}>: Top Role Position \`${member.roles.highest.position}\`.`, `Initiator - <@${message.author.id}>: Top Role Position \`${message.member.roles.highest.position}\`.`);
          return message.lineReply(embed);
        }
        
        if (client.functions.hierarchy(clientMember, member, message.guild)) {
          const clientTopRole = clientMember.roles.highest;
          const embed = client.embeds.detailed(command, client.util.botHierarchyM, `Targetted Member - <@${member.id}>: Top Role Position \`${member.roles.highest.position}\`.\nClient Member - <@${clientMember.id}>: Top Role Position \`${clientTopRole.position}\`.`);
          return message.lineReply(embed);
        }
      }

      const pendingEmbed = client.embeds.pending(command, "Banning the member...");
      const editMsg = await message.lineReply(pendingEmbed);

      const bannedEmbed = client.embeds.moderated("ban", message.guild, reason);
      if (member.user) if (!member.user.bot) member.user.send(bannedEmbed);
      setTimeout(banMember, 500);

      function banMember() {
        message.guild.members.ban(member, { days: command.commandName == "softban" ? 0 : 7, reason: `${member.user ? member.user.tag : member.tag} was banned. Responsible User: ${message.author.tag}` })
        .then(() => {
          const embed = client.embeds.success(command, `Banned <@${member.id}> from the server.`, [{
            name: "Reason",
            value: reason,
            inline: false
          }]);

          editMsg.edit(embed);
        })
        .catch(async (error) => {
          const errorEmbed = await client.embeds.errorInfo(command, message, error);
          editMsg.edit(errorEmbed);
        })
      }
    } else {
      const errorEmbed = client.embeds.noMember(command, secArg);
      message.lineReply(errorEmbed);
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, true, message, command, extra.logId);
  }
}