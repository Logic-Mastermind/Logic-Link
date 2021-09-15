const Discord = require("discord.js");
const Fetch = require("node-fetch");

exports.run = async (client, message, args, command, settings, tsettings, extra) => {
  const clientMember = message.guild.me;
  const guildPrefix = await client.functions.fetchPrefix(message.guild);
  
  const noArgs = await client.functions.getNoArgs(command, message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = await client.functions.getArgs(args);
  const code = `\`\`\``;
  const responses = {};

  try {
    var member = message.mentions.members.first();
    var mentionedRoles = message.mentions.roles.map(r => r.id);
    var roles = args.slice(1);

    roles.unshift(...mentionedRoles);
    roles = await roles.filter((v) => (!v.startsWith("<@&") || !v.startsWith("<@!")) && !v.endsWith(">"));
    roles = [...new Set(roles)];

    if (!member) member = await client.functions.findMember(secArg, message.guild);
    if (secArg.toLowerCase() == "me") member = message.member;

    if (member && roles[0]) {
      var total = 0;
      var results = {};
      
      const pendingEmbed = client.embeds.pending(command, "Removing roles from the user...");
      const editMsg = await message.reply({ embeds: [pendingEmbed] });
      
      for await (const [key, value] of Object.entries(roles)) {
        var role = message.guild.roles.cache.find(r => r.name.toLowerCase() == value.toLowerCase());
        if (!role) role = await client.functions.findRole(value, message.guild);

        if (role) {
          if (client.functions.hierarchy(message.member, role, message.guild)) {
            results[role.id] = "User Missing Permissions";
            continue;
          }

          if (member.roles.cache.has(role.id)) {
            await member.roles.remove(role, `Removed the "${role.name}" role from ${member.user.tag}. Responsible User: ${message.author.tag}`)
            .catch((error) => {
              results[role.id] = error.message ? `${error.message.endsWith(".") ? `` : `${error.message}.`}` : false;
            });

            results[role.id] = true;
            ++total;
          } else {
            results[role.id] = "Member does not have this role."
          }
        } else {
          results[value] = "Role does not exist.";
        }

        if (key == (roles.length - 1)) {
          const successful = [];
          const unsuccessful = [];
          
          for (const [key, value] of Object.entries(results)) {
            if (value == true) {
              successful.push(`<@&${key}>`);
            } else if (value == "Role does not exist.") {
              unsuccessful.push(`\`${key}\` - Not a role.`);
            } else {
              unsuccessful.push(`<@&${key}> - ${value}`);
            }
          }

          client.logger.updateLog(`User bulk removed ${total} role${total == 1 ? `` : `s`}.`, extra.logId);
          const resultsDescription = `${total == 0 ? `No roles were removed from <@${member.id}>.` : `Removed \`${total}\` role${total > 1 ? `s` : ``} from <@${member.id}>.`}\n\n**Successful**\n${successful[0] ? `${successful.join("\n")}` : `No roles were removed successfully.`}\n\n**Unsuccessful**\n${unsuccessful[0] ? `${unsuccessful.join("\n")}` : `All roles were removed successfully.`}`;

          const resultsEmbed = total == 0 ? client.embeds.error(command, resultsDescription) : client.embeds.success(command, resultsDescription);
          editMsg.edit({ embeds: [resultsEmbed] });
        }
      }
    } else {
      if (member) {
        client.logger.updateLog(`User did not pass enough arguments.`, extra.logId);
        const embed = await client.embeds.noArgs(command, message.guild);
        message.reply({ embeds: [embed] });
        
      } else {
        client.logger.updateLog(`Member does not exist.`, extra.logId);
        const embed = client.embeds.noMember(command, secArg);
        message.reply({ embeds: [embed] });
      }
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, true, message, command, extra.logId);
  }
}