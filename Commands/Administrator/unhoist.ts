import Discord from "discord.js";
import Types from "../../Typings/types";

export default async function run(client: Types.client, message: Discord.Message, args: string[], command: Types.commandData, settings: Types.guildSettings, tsettings: Types.ticketSettings, extra: Types.extraObject) {
  
  const clientMember = message.guild.me;
  const guildPrefix = client.functions.fetchPrefix(message.guild);
  
  const noArgs = client.functions.getNoArgs(command, message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = client.functions.getArgs(args);
  const code = `\`\`\``;
  const responses = {};

  try {
    var role: Discord.Role = message.mentions.roles.first();
    if (!role) role = client.functions.findRole(args.join(" "), message.guild);

    if (role) {
      if (client.functions.hierarchy(clientMember, role)) {
        const embed = client.embeds.detailed(command, client.util.messages.botHierarchy, `Mentioned Role - <@&${role.id}>: Position \`${role.position}\`.`, `My Top Role - <@&${clientMember.roles.highest.id}>: Position \`${clientMember.roles.highest.position}\`.`);
        return message.reply({ embeds: [embed] });
      }

      if (client.functions.hierarchy(message.member, role)) {
        const embed = client.embeds.detailed(command, client.util.messages.hierarchy, `Mentioned Role - <@&${role.id}>: Position \`${role.position}\`.`, `Your Top Role - <@&${message.member.roles.highest.id}>: Position \`${message.member.roles.highest.position}\`.`);
        return message.reply({ embeds: [embed] });
      }

      if (!role.hoist) {
        const embed = client.embeds.error(command, `This role is not hoisted.`);
        return message.reply({ embeds: [embed] });
      }

      const pendingEmbed = client.embeds.pending(command, `Un-hoisting the role...`);
      const editMsg = await message.reply({ embeds: [pendingEmbed] });

      role.setHoist(false)
      .then(() => {
        const embed = client.embeds.success(command, `Un-hoisted the <@&${role.id}> role.`);
        editMsg.edit({ embeds: [embed] });
      })
      .catch((error) => {
        const embed = client.embeds.errorInfo(command, message, error);
        editMsg.edit({ embeds: [embed] });
      })
    } else {
      const embed = client.embeds.invalidItem(command, ["role"], [args.join(" ")]);
      message.reply({ embeds: [embed] });
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, message, command, extra.logId);
  }
}