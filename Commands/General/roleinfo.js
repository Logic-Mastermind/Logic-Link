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
      const info = {
        name: `\`${role.name}\``,
        permissions: (await client.functions.getPermissions(role)).join(", "),
        color: `${role.color.toString(16) == 0 ? `Default Colour` : `#${role.color.toString(16)}`}`,
        hoist: role.hoist ? `Role Hoisted` : `Role Not Hoisted`,
        mentionable: role.mentionable ? `Role Mentionable` : `Role Not Mentionable`,
        position: `\`${role.rawPosition}\``,
        id: `\`${role.id}\``,
        mention: `<@&${role.id}>`
      }
      
      const embed = client.embeds.itemInfo(command, "role", info);
      message.reply({ embeds: [embed] });
    } else {
      const embed = client.embeds.noRole(command, args.join(" "));
      message.reply({ embeds: [embed] });
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, message, command, extra.logId);
  }
}