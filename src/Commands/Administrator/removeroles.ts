import Discord from "discord.js";
import Types from "../../Typings/types";

export default async function run(client: Types.client, message: Discord.Message, args: string[], command: Types.commandData, settings: Types.guildSettings, tsettings: Types.ticketSettings, extra: Types.extraObject) {
  
  const clientMember = message.guild.me;
  const guildPrefix = client.functions.fetchPrefix(message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = client.functions.getArgs(args);
  const code = `\`\`\``;
  const responses = {};

  try {
    let member = message.mentions.members.first();
    let mentionedRoles = message.mentions.roles.map(r => r.id);
    let roles = args.slice(1);

    roles.unshift(...mentionedRoles);
    roles = roles.filter((v) => (!v.startsWith("<@&") || !v.startsWith("<@!")) && !v.endsWith(">"));
    roles = [...new Set(roles)];

    if (!member) member = client.functions.findMember(secArg, message.guild);
    if (secArg.toLowerCase() == "me") member = message.member;

    if (member && roles[0]) {
      let total = 0;
      let successful = [];
      let unsuccessful = [];
      
      const pendingEmbed = client.embeds.pending(command, "Removing roles from the user...");
      const editMsg = await message.reply({ embeds: [pendingEmbed] });
      
      for await (const entry of roles) {
        let role: Discord.Role = client.functions.findRole(entry, message.guild);
        let failed: boolean = false;

        if (!role) {
          unsuccessful.push(`\`${entry}\` - Role Doesn't Exist`);
          continue;
        }

        if (!member.roles.cache.has(role.id)) {
          unsuccessful.push(`<@&${role.id}> - Member Didn't Have Role`);
          continue;
        }
        
        if (client.functions.hierarchy(message.member, role)) {
          unsuccessful.push(`<@&${role.id}> - User Missing Permissions`);
          continue;
        }

        await member.roles.remove(role, `Removed the "${role.name}" role from ${member.user.tag}. Responsible User: ${message.author.tag}`)
        .catch((error) => {
          unsuccessful.push(`<@&${role.id}> - ${error.message}`);
          failed = true;
        });

        if (!failed) {
          successful.push(`<@&${role.id}>`);
          ++total;
        }
      }

      client.logger.updateLog(`User bulk removed ${total} role${total == 1 ? `` : `s`}.`, extra.logId);
      const desc = `${total == 0 ? `No roles were removed from <@${member.id}>.` : `Removed \`${total}\` ${total == 1 ? `role` : `roles`} from <@${member.id}>.`}`;

      if (successful.length == 0) successful.push("No   were removed successfully.");
      if (unsuccessful.length == 0) unsuccessful.push("All roles were removed successfully.");

      const fields = [
        { name: "Successful", value: successful.join("\n"), inline: false },
        { name: "Unsuccessful", value: unsuccessful.join("\n"), inline: false }
      ]

      const embed = total == 0 ? client.embeds.error(command, desc, fields) : client.embeds.success(command, desc, fields);
      editMsg.edit({ embeds: [embed] });

    } else {
      if (member) {
        client.logger.updateLog(`User did not pass enough arguments.`, extra.logId);
        const embed = client.embeds.noArgs(command, message.guild);
        message.reply({ embeds: [embed] });
        
      } else {
        client.logger.updateLog(`Member does not exist.`, extra.logId);
        const embed = client.embeds.invalidItem(command, ["member"], [secArg]);
        message.reply({ embeds: [embed] });
      }
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, message, command, extra.logId);
  }
}