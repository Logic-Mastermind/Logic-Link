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
    if (!member) member = await client.functions.findMember(args.join(" "), message.guild);
    if (!secArg && !member) member = message.member;

    if (member) {
      var roles = Array.from(member.roles.cache.filter(r => r.id !== member.guild.roles.everyone.id).keys());
      var createdAt = Math.floor(Date.parse(member.user.createdAt) / 1000);
      var joinedAt = Math.floor(Date.parse(member.joinedAt) / 1000);

      const embed = client.embeds.new(command.name, `description`, `BLUE`, client.util.footer1, client.util.footer2, true, null, )
    } else {
      const embed = client.embeds.noMember(command, args.join(" "));
      message.lineReply(embed);
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, true, message, command);
  }
}