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
    if (!member && secArg) member = await client.functions.findMember(args.join(" "), message.guild);
    if (!secArg && !member) member = message.member;

    if (member) {
      const roles = await Array.from(await member.roles.cache.filter(r => r.id !== member.guild.roles.everyone.id).keys());
      const info = {
        roles: roles[0] ? `<@&${roles.join(">, <@&")}>` : `No Roles Found`,
        createdAt: `<t:${Math.floor(Date.parse(member.user.createdAt) / 1000)}:D>`,
        joinedAt: `<t:${Math.floor(Date.parse(member.joinedAt) / 1000)}:D>`,
        permissions: (await client.functions.getPermissions(member)).join(", "),
        badges: (await client.functions.getBadges(member.user)).join(" "),
        profile: member.user.displayAvatarURL({ dynamic: false, size: 512 }),
        id: member.user.id,
        roleCount: roles.length,
        owner: member.id == message.guild.ownerId
      }
      
      const embed = client.embeds.itemInfo(command, "user", info);
      message.reply({ embeds: [embed]});
    } else {
      const embed = client.embeds.noMember(command, args.join(" "));
      message.reply({ embeds: [embed] });
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, message, command, extra.logId);
  }
}