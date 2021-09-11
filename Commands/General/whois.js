const Discord = require("discord.js");
const Buttons = require("discord-buttons");
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
      const info = {
        roles: await Array.from(await member.roles.cache.filter(r => r.id !== member.guild.roles.everyone.id).keys()),
        createdAt: await Math.floor(Date.parse(member.user.createdAt) / 1000),
        joinedAt: await Math.floor(Date.parse(member.joinedAt) / 1000),
        permissions: await client.functions.getPermissions(member),
        badges: await client.functions.getBadges(member.user),
        profile: await member.user.displayAvatarURL({ dynamic: false, size: 512 }),
        user: member.user,
        owner: member.id == message.guild.owner.id
      }
      
      const embed = client.embeds.itemInfo(command, "user", info);
      message.lineReply(embed);
    } else {
      const embed = client.embeds.noMember(command, args.join(" "));
      message.lineReply(embed);
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, true, message, command, extra.logId);
  }
}