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
      var successful = [];
      var unsuccessful = [];
      
      const pendingEmbed = client.embeds.pending(command, "Adding roles to the user...");
      const editMsg = await message.reply({ embeds: [pendingEmbed] });
      
      for await (const entry of roles) {
        role = await client.functions.findRole(entry, message.guild);
        if (!role) {
          unsuccessful.push(`\`${entry}\` - Role Doesn't Exist`);
          continue;
        }

        if (member.roles.cache.has(role.id)) {
          unsuccessful.push(`<@&${role.id}> - Member Had Role`);
          continue;
        }
        
        if (client.functions.hierarchy(message.member, role, message.guild)) {
          unsuccessful.push(`<@&${role.id}> - User Missing Permissions`);
          continue;
        }

        await member.roles.add(role, `Added the "${role.name}" role to ${member.user.tag}. Responsible User: ${message.author.tag}`)
        .catch((error) => {
          unsuccessful.push(`<@&${role.id}> - ${error.message}`);
        });

        successful.push(`<@&${role.id}>`);
        ++total;
      }

      client.logger.updateLog(`User bulk added ${total} role${total == 1 ? `` : `s`}.`, extra.logId);
      const desc = `${total == 0 ? `No roles were added to <@${member.id}>.` : `Added \`${total}\` ${total == 1 ? `role` : `roles`} to <@${member.id}>.`}`;

      if (successful.length == 0) successful.push("No roles were added successfully.");
      if (unsuccessful.length == 0) unsuccessful.push("All roles were added successfully.");

      const fields = [
        { name: "Successful", value: successful.join("\n"), inline: false },
        { name: "Unsuccessful", value: unsuccessful.join("\n"), inline: false }
      ]

      const embed = total == 0 ? client.embeds.error(command, desc, fields) : client.embeds.success(command, desc, fields);
      editMsg.edit({ embeds: [embed] });

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
    client.functions.sendErrorMsg(error, message, command, extra.logId);
  }
}