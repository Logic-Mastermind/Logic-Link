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
    var warning = "No reason was provided.";

    if (!member) member = await client.functions.findMember(secArg, message.guild);
    if (thirdArg) warning = args.slice(1).join(" ");
    if (secArg.toLowerCase() == "me") member = message.member;

    if (member) {
      if (warning.length > 1000) {
        const embed = client.embeds.error(command, `This warning is over the 1000 character limit.`);
        return message.lineReply(embed);
      }

      var warnings = await client.db.userInfo.get(`${member.id}-${member.guild.id}`, `warnings`);

      await warnings.push({ initiator: message.author.id, message: warning, date: Date.now() });
      await client.db.userInfo.set(`${member.id}-${member.guild.id}`, warnings, `warnings`);
      warnings = await client.db.userInfo.get(`${member.id}-${member.guild.id}`, `warnings`);

      const embed = client.embeds.success(command, `Logged a warning for <@${member.id}>${warnings.length == 1 ? `, this is their first warning` : ``}.`);
      message.lineReply(embed);
    } else {
      const embed = client.embeds.noMember(command, secArg);
      message.lineReply(embed);
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, true, message, command);
  }
}