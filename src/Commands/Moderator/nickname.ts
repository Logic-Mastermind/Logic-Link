import Discord from "discord.js";
import Types from "../../Typings/types";

export default async function run(client: Types.client, message: Discord.Message, args: string[], command: Types.commandData, settings: Types.guildSettings, tsettings: Types.ticketSettings, extra: Types.extraObject) {
  
  const clientMember = message.guild.me;
  const guildPrefix = client.functions.fetchPrefix(message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = client.functions.getArgs(args);
  const code = `\`\`\``;

  const responses = {
    serverOwner: `You are attempting to change the nickname of the server owner.`,
    alreadyNicked: `The member's nickname has already been set to this value.`
  }

  try {
    let member = message.mentions.members.first();
    let nick = args.slice(1).join(" ");

    if (!member) member = client.functions.findMember(secArg, message.guild);
    if (secArg.toLowerCase() == "me") member = message.member;

    if (member) {
      if (!thirdArg) {
        const embed = client.embeds.noArgs(command, message.guild);
        return message.reply({ embeds: [embed] });
      }

      if (member.id == message.guild.ownerId) {
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

      member.setNickname(nick, `${member.user.username}'s nickname was changed to ${nick}. Responsible User: ${message.author.tag}`)
      .then(() => {
        const successEmbed = client.embeds.success(command, `${nick == member.user.username ? `Reset <@${member.id}>'s nickname.` : `Changed \`${oldNick}\`'s nickname to <@${member.id}>.`}`);
        editMsg.edit({ embeds: [successEmbed] });
      })
      .catch((error) => {
        const errorEmbed = client.embeds.errorInfo(command, message, error);
        editMsg.edit({ embeds: [errorEmbed] });
      });
    } else {
      if (!thirdArg) {
        const embed = client.embeds.noArgs(command, message.guild);
        message.reply({ embeds: [embed] });

      } else {
        const embed = client.embeds.invalidItem(command, ["member"], [secArg]);
        message.reply({ embeds: [embed] });
      }
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, message, command, extra.logId);
  }
}