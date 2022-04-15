import Discord from "discord.js";
import Types from "../../Typings/types";

export default async function run(client: Types.client, message: Discord.Message, args: string[], command: Types.commandData, settings: Types.guildSettings, tsettings: Types.ticketSettings, extra: Types.extraObject) {
  
  const clientMember = message.guild.me;
  const guildPrefix = client.functions.fetchPrefix(message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = client.functions.getArgs(args);
  const code = `\`\`\``;
  const responses = {};

  try {
    let role = message.mentions.roles.first();
    if (!role) role = client.functions.findRole(args.join(" "), message.guild);

    if (role) {
      const info = {
        name: `\`${role.name}\``,
        permissions: client.functions.getPermissions(role).join(", "),
        color: `${role.color == 0 ? `Default Colour` : `#${role.color.toString(16)}`}`,
        hoist: role.hoist ? `Role Hoisted` : `Role Not Hoisted`,
        mentionable: role.mentionable ? `Role Mentionable` : `Role Not Mentionable`,
        position: `\`${role.rawPosition}\``,
        id: `\`${role.id}\``,
        mention: `<@&${role.id}>`
      }
      
      const embed = client.embeds.itemInfo(command, "role", info);
      message.reply({ embeds: [embed] });
    } else {
      const embed = client.embeds.invalidItem(command, ["role"], [args.join(" ")]);
      message.reply({ embeds: [embed] });
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, message, command, extra.logId);
  }
}