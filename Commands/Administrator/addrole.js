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
    pending: `Adding the role to the user...`,
    botHierarchy: `This role has a higher or equal position as my top role.\n\n**Detailed Info**\n`,
    hierarchy: `This role has a higher or equal position as your top role.\n\n**Detailed Info**\n`
  }

  try {
    var role = message.mentions.roles.first();
    var member = message.mentions.members.first();
    var fullRole = args.slice(1).join(" ")

    if (!role) role = await client.functions.findRole(fullRole, message.guild)
    if (!member) member = await client.functions.findMember(secArg, message.guild)
    if (secArg.toLowerCase() == "me") member = message.member;

    if (member && role) {
      if (member.roles.cache.has(role.id)) {
        const embed = client.embeds.error(command, `\`${member.user.tag}\` already has the <@&${role.id}> role.`);
        return message.lineReply(embed)
      }

      const pendingEmbed = client.embeds.pending(command, responses.pending);
      const editMsg = await message.lineReply(pendingEmbed)

      if (!clientMember.hasPermission(command.clientPerms)) {
        const errorEmbed = client.embeds.botPermission(command)
        return editMsg.edit(errorEmbed)
      }

      if (clientMember.roles.highest.position <= role.position) {
        const clientTopRole = clientMember.roles.highest;
        const embed = client.embeds.error(command, `${responses.botHierarchy}Mentioned Role - <@&${role.id}>: Position \`${role.position}\`.\nMy Top Role - <@&${clientTopRole.id}>: Position \`${clientTopRole.position}\`.`);
        return editMsg.edit(embed);
      }

      if (message.author.id !== message.guild.owner.id) {
        if (message.member.roles.highest.position <= role.position) {
          const embed = client.embeds.error(command, `${responses.hierarchy}Mentioned Role - <@&${role.id}>: Position \`${role.position}\`.\nYour Top Role - <@&${message.member.roles.highest.id}>: Position \`${message.member.roles.highest.position}\`.`);
          return editMsg.edit(embed);
        }
      }

      member.roles.add(role, `Added the "${role.name}" role to ${member.user.tag}. Responsible User: ${message.author.tag}`)
      .then((r) => {
        const successEmbed = client.embeds.success(command, `Added the <@&${role.id}> role to <@${member.id}>.`);
        editMsg.edit(successEmbed)
      })
      .catch(async (error) => {
        const errorEmbed = await client.embeds.errorInfo(command, error);
        editMsg.edit(errorEmbed)
      })
    } else {
      if (!thirdArg && member) {
        const embed = client.embeds.noArgs(command, message.guild);
        message.lineReply(embed);

      } else if (!member) {
        if (!thirdArg) {
          const errorEmbed = client.embeds.noMember(command, secArg);
          message.lineReply(errorEmbed);

        } else {
          const errorEmbed = client.embeds.noMembersOrRoles(command, secArg, thirdArg);
          message.lineReply(errorEmbed);
        }
      } else {
        const errorEmbed = client.embeds.noRole(command, thirdArg);
        message.lineReply(errorEmbed);
      }
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, true, message, command);
  }
}