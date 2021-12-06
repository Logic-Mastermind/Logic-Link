const Discord = require("discord.js");
const Fetch = require("node-fetch");

exports.run = async (client, message, args, command, settings, tsettings, extra) => {
  const clientMember = message.guild.me;
  const guildPrefix = client.functions.fetchPrefix(message.guild);

  const noArgs = client.functions.getNoArgs(command, message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = client.functions.getArgs(args);
  const code = `\`\`\``;
  const responses = {};

  try {
    var role = message.mentions.roles.first();
    var member = message.mentions.members.first();
    var fullRole = args.slice(1).join(" ");

    if (!role) role = await client.functions.findRole(fullRole, message.guild);
    if (!member) member = await client.functions.findMember(secArg, message.guild);
    if (secArg.toLowerCase() == "me") member = message.member;

    if (member && role) {
      if (client.functions.hierarchy(clientMember, role, message.guild)) {
        client.logger.updateLog(`Role position was higher than or equal to bot.`, extra.logId);

        const topRole = clientMember.roles.highest;
        const embed = client.embeds.detailed(command, client.util.botHierarchy, `Mentioned Role - <@&${role.id}>: Position \`${role.position}\`.`, `My Top Role - <@&${topRole.id}>: Position \`${topRole.position}\`.`);
        return message.reply({ embeds: [embed] });
      }

      if (client.functions.hierarchy(message.member, role, message.guild)) {
        client.logger.updateLog(`Role position was higher than or equal to user.`, extra.logId);
        const topRole = message.member.roles.highest;

        const embed = client.embeds.detailed(command, client.util.hierarchy, `Mentioned Role - <@&${role.id}>: Position \`${role.position}\`.`, `Your Top Role - <@&${topRole.id}>: Position \`${topRole.position}\`.`);
        return message.reply({ embeds: [embed] });
      }

      if (member.roles.cache.has(role.id)) {
        client.logger.updateLog(`Member already had role.`, extra.logId);
        const embed = client.embeds.error(command, `<@${member.id}> already has the <@&${role.id}> role.`);
        return message.reply({ embeds: [embed] });
      }

      const pendingEmbed = client.embeds.pending(command, "Adding the role...");
      const editMsg = await message.reply({ embeds: [pendingEmbed] });

      await member.roles.add(role, `Added the "${role.name}" role to ${member.user.tag}. Responsible User: ${message.author.tag}`)
      .catch(async (error) => {
        client.logger.updateLog(`An error occured while adding a role.`, extra.logId);
        const embed = await client.embeds.errorInfo(command, message, error);
        editMsg.edit({ embeds: [embed] });
      })

      client.logger.updateLog(`Added role successfully.`, extra.logId);
      const successEmbed = client.embeds.success(command, `Added the <@&${role.id}> role to <@${member.id}>.`);
      editMsg.edit({ embeds: [successEmbed] });
    } else {
      if (!thirdArg && member) {
        client.logger.updateLog(`User did not pass enough arguments.`, extra.logId);
        const embed = await client.embeds.noArgs(command, message.guild);
        message.reply({ embeds: [embed] });

      } else if (!member) {
        if (!thirdArg) {
          client.logger.updateLog(`Member does not exist.`, extra.logId);
          const embed = client.embeds.noMember(command, secArg);
          message.reply({ embeds: [embed] });

        } else {
          client.logger.updateLog(`Member and role does not exist.`, extra.logId);
          const embed = client.embeds.noMembersOrRoles(command, secArg, thirdArg);
          message.reply({ embeds: [embed] });
        }
      } else {
        client.logger.updateLog(`Role does not exist.`, extra.logId);
        const embed = client.embeds.noRole(command, thirdArg);
        message.reply({ embeds: [embed] });
      }
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, message, command, extra.logId);
  }
}