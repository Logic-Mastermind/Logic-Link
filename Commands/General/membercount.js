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
    const memberCountUsers = message.guild.members.cache.filter((member) => !member.user.bot).size;
    const memberCountBots = message.guild.members.cache.filter((member) => member.user.bot).size;
    const memberCountTotal = message.guild.members.cache.size;

    const memberCountEmbed = client.embeds.blue(command, `${message.guild.name} has ${memberCountBots == 0 ? `${memberCountUsers} members` : `a combined total of \`${memberCountTotal}\` users and bots.\nOf this number \`${memberCountUsers}\` ${memberCountUsers == 1 ? `is a user` : `are users`} and \`${memberCountBots}\` ${memberCountBots == 1 ? `is a bot` : `are bots`}`}.`)

    message.lineReply(memberCountEmbed)
  } catch (error) {
    client.functions.sendErrorMsg(error, true, message, command, extra.logId);
  }
}