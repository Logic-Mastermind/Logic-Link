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
    botHierarchy: `This role has a higher or equal position as my top role.\n\n**Detailed Info**\n`,
    hierarchy: `This role has a higher or equal position as your top role.\n\n**Detailed Info**\n`
  }

  try {
    var role = message.mentions.roles.first()
    if (!role) role = await client.functions.findRole(args.join(" "), message.guild)

    if (role) {
      if (role.hoist) {
        const embed = client.embeds.error(command, `This role has already been hoisted.`);
        return message.lineReply(embed);
      }

      if (!clientMember.hasPermission(command.clientPerms)) {
        const embed = client.embeds.botPermission(command);
        return message.lineReply(embed);
      }

      if (!message.member.hasPermission(command.permissions)) {
        const embed = client.embeds.permission(command);
        return message.lineReply(embed);
      }

      if (clientMember.roles.highest.position <= role.position) {
        const clientTopRole = clientMember.roles.highest;
        const embed = client.embeds.error(command, `${responses.botHierarchy}Mentioned Role - <@&${role.id}>: Position \`${role.position}\`.\nMy Top Role - <@&${clientTopRole.id}>: Position \`${clientTopRole.position}\`.`);
        return message.lineReply(embed);
      }

      if (message.author.id !== message.guild.owner.id) {
        if (message.member.roles.highest.position <= role.position) {
          const embed = client.embeds.error(command, `${responses.hierarchy}Mentioned Role - <@&${role.id}>: Position \`${role.position}\`.\nYour Top Role - <@&${message.member.roles.highest.id}>: Position \`${message.member.roles.highest.position}\`.`);
          return message.lineReply(embed);
        }
      }

      const pendingEmbed = client.embeds.pending(command, `Hoisting the role...`);
      const editMsg = await message.lineReply(pendingEmbed);

      role.setHoist(true)
      .then(() => {
        const successEmbed = client.embeds.success(command, `Hoisted the <@&${role.id}> role.`);
        editMsg.edit(successEmbed);
      })
      .catch(async (error) => {
        const errorEmbed = await client.embeds.errorInfo(command, error, client);
        editMsg.edit(errorEmbed)
      })
    } else {
      const errorEmbed = client.embeds.noRole(command, args.join(" "));
      message.lineReply(errorEmbed)
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, true, message, command);
  }
}