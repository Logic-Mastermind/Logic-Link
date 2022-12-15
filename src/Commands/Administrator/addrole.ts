import Discord from "discord.js";
import Types from "../../types";

export default async function run(client: Types.client, message: Discord.Message, args: string[], command: Types.commandData, settings: Types.guildSettings, tsettings: Types.ticketSettings, extra: Types.extraObject) {
  
  const clientMember = message.guild.me;
  const guildPrefix = client.functions.fetchPrefix(message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = client.functions.getArgs(args);
  const code = `\`\`\``;
  const responses = {};

	try {
    let role = message.mentions.roles.first();
    let member = message.mentions.members.first();
    let fullRole = args.slice(1).join(" ");

    if (!role) role = client.functions.findRole(fullRole, message.guild);
    if (!member) member = client.functions.findMember(secArg, message.guild);
    if (secArg.toLowerCase() == "me") member = message.member;

    if (member && role) {
      if (client.functions.hierarchy(clientMember, role)) {
        client.logger.updateLog(`Role position was higher than or equal to bot.`, extra.logId);

        const topRole = clientMember.roles.highest;
        const embed = client.embeds.detailed(command, client.util.messages.botHierarchy, `Mentioned Role - <@&${role.id}>: Position \`${role.position}\`.`, `My Top Role - <@&${topRole.id}>: Position \`${topRole.position}\`.`);
        return message.reply({ embeds: [embed] });
      }

      if (client.functions.hierarchy(message.member, role)) {
        client.logger.updateLog(`Role position was higher than or equal to user.`, extra.logId);
        const topRole = message.member.roles.highest;

        const embed = client.embeds.detailed(command, client.util.messages.hierarchy, `Mentioned Role - <@&${role.id}>: Position \`${role.position}\`.`, `Your Top Role - <@&${topRole.id}>: Position \`${topRole.position}\`.`);
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
      .catch((error) => {
        client.logger.updateLog(`An error occured while adding a role.`, extra.logId);
        const embed = client.embeds.errorInfo(command, message, error);
        editMsg.edit({ embeds: [embed] });
      })

      client.logger.updateLog(`Added role successfully.`, extra.logId);
      const successEmbed = client.embeds.success(command, `Added the <@&${role.id}> role to <@${member.id}>.`);
      editMsg.edit({ embeds: [successEmbed] });
      
    } else {
      if (!thirdArg && member) {
        client.logger.updateLog(`User did not pass enough arguments.`, extra.logId);
        const embed = client.embeds.noArgs(command, message.guild);
        message.reply({ embeds: [embed] });

      } else {
        const invalidTypes = [];
        const invalidArgs = [];
        
        if (!member) {
          invalidTypes.push("member");
          invalidArgs.push(secArg);
        }

        if (thirdArg) {
          if (!role) {
            invalidTypes.push("role");
            invalidArgs.push(thirdArg);
          }
        }

        const embed = client.embeds.invalidItem(command, invalidTypes, invalidArgs);
        message.reply({ embeds: [embed] });
      }
    }
	} catch (error) {
    client.functions.sendErrorMsg(error, message, command, extra.logId);
	}
}