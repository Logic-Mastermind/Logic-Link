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
    if (secArg && (!member)) member = await client.functions.findMember(args.join(" "), message.guild);
    if (!member) member = await message.member;

    const avatar = await member.user.displayAvatarURL({ dynamic: true, size: 1024 })
    const embed = client.embeds.image(command, `\`${member.displayName}\`'s Avatar`, avatar);

    message.lineReply(embed)
  } catch (error) {
    client.functions.sendErrorMsg(error, true, message, command);
  }
}