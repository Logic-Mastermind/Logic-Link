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
    selfWarning: `You are attempting to ban yourself from the server.`,
    botBan: `You are attempting to ban me from the server.`,
    serverOwner: `You are attempting to ban the server owner.`,
    hierarchy: `This member has a higher or equal role position as your top role.`,
    botHierarchy: `This member has a higher or equal role position as my top role.`,
  }

  try {
    var member = message.mentions.members.first();
    if (!member) member = await client.functions.findMember(secArg, message.guild);
    if (!member) member = await client.functions.findUser(secArg, true);
    if (secArg.toLowerCase() == "me") member = message.member

    var reason = args.slice(1).join(" ");
    if (!reason) reason = "No reason was provided.";

    if (member) {
      if (!clientMember.hasPermission(command.clientPerms)) {
        const errorEmbed = client.embeds.botPermission(command)
        return message.lineReply(errorEmbed)
      }

      if (member.id === client.user.id) {
        const errorEmbed = client.embeds.detailed(command, responses.botBan, `Targetted Member - <@${member.id}>\nInitiator - <@${message.author.id}>`);
        return message.lineReply(errorEmbed);

      } else if (member.id == message.author.id) {
        const errorEmbed = client.embeds.detailed(command, responses.selfWarning, `Targetted Member - <@${member.id}>\nInitiator - <@${message.author.id}>`);
        return message.lineReply(errorEmbed);
      }

      if (member.id == message.guild.owner.id) {
        const errorEmbed = client.embeds.error(command, responses.serverOwner, `Server Owner - <@${member.guild.owner.id}>\nTargetted Member - <@${member.id}>`);
        return message.lineReply(errorEmbed);
      }

      if (member.user) {
        if ((message.author.id !== message.guild.owner.id) && member.roles.highest) {
          if (message.member.roles.highest.position <= member.roles.highest.position) {
            const embed = client.embeds.detailed(command, responses.hierarchy, `Targetted Member - <@${member.id}>: Top Role Position \`${member.roles.highest.position}\`.\nInitiator - <@${message.author.id}>: Top Role Position \`${message.member.roles.highest.position}\`.`);
            return message.lineReply(embed);
          }
        }
        
        if (member.roles.highest) {
          if (clientMember.roles.highest.position <= member.roles.highest.position) {
            const clientTopRole = clientMember.roles.highest;
            const embed = client.embeds.detailed(command, responses.botHierarchy, `Targetted Member - <@${member.id}>: Top Role Position \`${member.roles.highest.position}\`.\nClient Member - <@${clientMember.id}>: Top Role Position \`${clientTopRole.position}\`.`);
            return message.lineReply(embed);
          }
        }
      }

      const pendingEmbed = client.embeds.pending(command, "Banning the member from the server...");
      const editMsg = await message.lineReply(pendingEmbed);

      const bannedEmbed = client.embeds.orange(`User Banned`, `You have been banned from \`${message.guild.name}\`${message.guild.name.endsWith(".") ? `` : `.`}\n\n**Reason**\n${reason}`)

      if (member.user) if (member.user.bot) member.user.send(bannedEmbed)
      setTimeout(banMember, 500)

      function banMember() {
        message.guild.members.ban(member, { days: 7, reason: `${member.user ? member.user.tag : member.tag} was banned. Responsible User: ${message.author.tag}` })
        .then(() => {
          const successEmbed = client.embeds.success(command, `Banned <@${member.id}> from the server.\n\n**Reason**\n${reason}`);

          editMsg.edit(successEmbed)
        })
        .catch(async (error) => {
          const errorEmbed = await client.embeds.errorInfo(command, message, error);
          editMsg.edit(errorEmbed)
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