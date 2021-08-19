const Discord = require("discord.js");
const Buttons = require("discord-buttons");
const Prefix = require("discord-prefix");

exports.run = async (client, message, args, command, settings, tsettings, extra) => {
  var guildPrefix = Prefix.getPrefix(message.guild.id);
  if (!guildPrefix) guildPrefix = client.util.defaultPrefix;

  const clientMember = message.guild.me;
  const noArgs = await client.functions.getNoArgs(command, message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = await client.functions.getArgs(args);
  const code = `\`\`\``;

  const responses = {
    hierarchy: `This member has a higher or equal role position as your top role.\n\n**Detailed Info**\n`,
    botHierarchy: `This member has a higher or equal role position as my top role.\n\n**Detailed Info**\n`,
    serverOwner: `You are attempting to change the nickname of the server owner.\n\n**Detailed Info**\n`,
    noUser: `No members were recorded from your message.\n\n**Detailed Info**\n`,
    pending: `Changing the member's nickname...`,
    alreadyNicked: `That member's nickname has already been set to that.\n\n**Detailed Info**\n`
  }

  try {
    var member = message.mentions.members.first();
    var nick = args.slice(1).join(" ");

    if (!member) member = await client.functions.findMember(secArg, message.guild);
    if (secArg.toLowerCase() == "me") member = message.member;

    if (member) {
      if (!thirdArg) {
        const embed = client.embeds.noArgsObj(noArgs);
        return message.lineReply(embed);
      }

      if (!clientMember.hasPermission("MANAGE_NICKNAMES")) {
        const errorEmbed = client.embeds.botPermission(command);
        return message.lineReply(errorEmbed)
      }

      if ((message.author.id !== message.guild.owner.id) && member.roles.highest) {
        if (message.member.roles.highest.position <= member.roles.highest.position) {
          const embed = client.embeds.error(command, `${responses.hierarchy}Targetted Member - <@${member.id}>: Top Role Position \`${member.roles.highest.position}\`.\nInitiator - <@${message.author.id}>: Top Role Position \`${message.member.roles.highest.position}\`.`);
          return message.lineReply(embed);
        }
      }

      if (member.roles.highest && (clientMember.id !== member.id)) {
        if (clientMember.roles.highest.position <= member.roles.highest.position) {
          const clientTopRole = clientMember.roles.highest;
          const embed = client.embeds.error(command, `${responses.botHierarchy}Targetted Member - <@${member.id}>: Top Role Position \`${member.roles.highest.position}\`.\nClient Member - <@${clientMember.id}>: Top Role Position \`${clientTopRole.position}\`.`);
          return message.lineReply(embed)
        }
      }

      if (member.id == message.guild.owner.id) {
        const errorEmbed = client.embeds.error(command, `${responses.serverOwner}Server Owner - <@${member.guild.owner.id}>\nTargetted Member - <@${member.id}>`);
        return message.lineReply(errorEmbed)
      }

      if (member.displayName == nick) {
        const embed = client.embeds.error(command, `${responses.alreadyNicked}Member Nickname - \`${member.displayName}>\`.\nRequested Nickname - \`${nick}\`.`);

        return message.lineReply(embed)
      }

      if (nick.length > 32) {
        const embed = client.embeds.error(command, `This nickname is over the limit of 32 characters.`);
        return message.lineReply(embed);
      }

      const pendingEmbed = client.embeds.pending(command, responses.pending);
      const editMsg = await message.lineReply(pendingEmbed);
      if (thirdArg.toLowerCase() == "reset") nick = member.user.username

      member.setNickname(nick, `${member.username}'s nickname was changed to ${nick}. Responsible User: ${message.author.tag}`)
      .then(() => {
        const successEmbed = client.embeds.success(command, `${nick == member.user.username ? `Reset <@${member.id}>'s nickname.` : `Changed <@${member.id}>'s nickname to \`${nick}\`.`}`)
        editMsg.edit(successEmbed)
      })
      .catch(async (error) => {
        const errorEmbed = await client.embeds.errorInfo(command, message, error)
        editMsg.edit(errorEmbed)
      })
    } else {
      const errorEmbed = client.embeds.noMember(command, `secArg`)
      message.lineReply(errorEmbed)
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, true, message, command);
  }
}