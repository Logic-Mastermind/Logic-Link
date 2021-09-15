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
    var role = message.mentions.roles.first();
    if (!role) role = await client.functions.findRole(args.join(" "), message.guild);

    if (role) {
      if (client.functions.hierarchy(clientMember, role, message.guild)) {
        const clientTopRole = clientMember.roles.highest;
        const embed = client.embeds.detailed(command, client.util.botHierarchy, `Mentioned Role - <@&${role.id}>: Position \`${role.position}\`.`, `My Top Role - <@&${clientTopRole.id}>: Position \`${clientTopRole.position}\`.`);
        return message.reply({ embeds: [embed] });
      }

      if (client.functions.hierarchy(message.member, role, message.guild)) {
        const embed = client.embeds.detailed(command, responses.hierarchy, `Mentioned Role - <@&${role.id}>: Position \`${role.position}\`.`, `Your Top Role - <@&${message.member.roles.highest.id}>: Position \`${message.member.roles.highest.position}\`.`);
        return message.reply({ embeds: [embed] });
      }

      if (role.hoist) {
        const embed = client.embeds.error(command, `This role has already been hoisted.`);
        return message.reply({ embeds: [embed] });
      }

      const pendingEmbed = client.embeds.pending(command, `Hoisting the role...`);
      const editMsg = await message.reply({ embeds: [pendingEmbed] });

      role.setHoist(true)
      .then(() => {
        const embed = client.embeds.success(command, `Hoisted the <@&${role.id}> role.`);
        editMsg.edit({ embeds: [embed] });
      })
      .catch(async (error) => {
        const embed = await client.embeds.errorInfo(command, message, error);
        editMsg.edit({ embeds: [embed] });
      })
    } else {
      const embed = client.embeds.noRole(command, args.join(" "));
      message.reply({ embeds: [embed] });
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, true, message, command, extra.logId);
  }
}