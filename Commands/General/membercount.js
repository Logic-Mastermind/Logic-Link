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
    const fetched = await message.guild.members.fetch();
    const users = await fetched.filter(m => !m.user.bot).size;
    const bots = await fetched.filter(m => m.user.bot).size;
    const fields = [
      { name: "Information", value: `${client.util.members} Users: \`${users}\` Server Member${users == 1 ? `` : `s`}.\n🤖 Bots: \`${bots}\` Server Bot${bots == 1 ? `` : `s`}.` }
    ]

    const embed = client.embeds.blue(command, `${message.guild.name} has \`${fetched.size}\` members.`, fields);
    message.reply({ embeds: [embed] });
  } catch (error) {
    client.functions.sendErrorMsg(error, message, command, extra.logId);
  }
}