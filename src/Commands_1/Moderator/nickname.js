const Discord = require("discord.js");
const Fetch = require("node-fetch");

exports.run = async (client, message, args, command, settings, tsettings, extra) => {
  const clientMember = message.guild.me;
  const guildPrefix = await client.functions.fetchPrefix(message.guild);
  
  const noArgs = await client.functions.getNoArgs(command, message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = await client.functions.getArgs(args);
  const code = `\`\`\``;

  const responses = {
    serverOwner: `You are attempting to change the nickname of the server owner.`,
    alreadyNicked: `The member's nickname has already been set to this value.`
  }

  try {
    let member = message.mentions.members.first();
    let nick = args.slice(1).join(" ");

    if (!member) member = await client.functions.findMember(secArg, message.guild);
    if (secArg.toLowerCase() == "me") member = message.member;

    if (member) {
      if (!thirdArg) {
        const embed = client.embeds.noArgsObj(noArgs);
        return message.reply({ embeds: [embed] });
      }

      if (member.id == message.guild.ownerId) {
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

      if (member.displayName == nick) {
        const embed = client.embeds.detailed(command, responses.alreadyNicked, `Member Nickname - \`${member.displayName}\`.\nRequested Nickname - \`${nick}\`.`);
        return message.reply({ embeds: [embed] });
      }

      if (nick.length > 32) {
        const embed = client.embeds.error(command, `This nickname is over the limit of 32 characters.`);
        return message.reply({ embeds: [embed] });
      }

      const pendingEmbed = client.embeds.pending(command, "Changing member nickname...");
      const editMsg = await message.reply({ embeds: [pendingEmbed] });

      const oldNick = member.displayName;
      if (thirdArg.toLowerCase() == "reset") nick = member.user.username;

      member.setNickname(nick, `${member.username}'s nickname was changed to ${nick}. Responsible User: ${message.author.tag}`)
      .then(() => {
        const successEmbed = client.embeds.success(command, `${nick == member.user.username ? `Reset <@${member.id}>'s nickname.` : `Changed \`${oldNick}\`'s nickname to <@${member.id}>.`}`);
        editMsg.edit({ embeds: [successEmbed] });
      })
      .catch(async (error) => {
        const errorEmbed = await client.embeds.errorInfo(command, message, error);
        editMsg.edit({ embeds: [errorEmbed] });
      });
    } else {
      if (!thirdArg) {
        const embed = await client.embeds.noArgs(command, message.guild);
        message.reply({ embeds: [embed] });

      } else {
        const embed = client.embeds.noMember(command, secArg);
        message.reply({ embeds: [embed] });
      }
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, message, command, extra.logId);
  }
}