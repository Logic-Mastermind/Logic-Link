const Discord = require("discord.js");
const Fetch = require("node-fetch");

exports.run = async (client, message, args, command, settings, tsettings, extra) => {
  const clientMember = message.guild.me;
  const guildPrefix = await client.functions.fetchPrefix(message.guild);
  
  const noArgs = await client.functions.getNoArgs(command, message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = await client.functions.getArgs(args);
  const code = `\`\`\``;

  const responses = {
    invite: `To invite Logic Link to your server, click any one of the links below.`,
    invLinks: `\`Administrator Invite\` - [Admin Invite ↗️](https://discord.com/api/oauth2/authorize?client_id=836761561074499695&permissions=8&scope=bot%20applications.commands)\n\`Non-Administrator Invite\` - [Non-Admin Invite ↗️](https://discord.com/oauth2/authorize?client_id=836761561074499695&permissions=1609591030&scope=bot%20applications.commands)\n\`Support Server\` - [Discord Invite ↗️](https://discord.gg/tg9sNMjpsU)`,
    webLinks: `\`Website Link\` - [Home Page ️️↗️](${client.util.websiteLink})\n\`Documentation Link\` - [Bot Docs ↗️](${client.util.docsLink})`
  }
  
  try {
    const fields = [
      { name: "Invite Links", value: responses.invLinks, inline: false },
      { name: "Other Links", value: responses.webLinks, inline: false }
    ];

    const embed = client.embeds.blue(command, `${client.util.botInfo} ${responses.invite}`, fields);
    message.reply({ embeds: [embed] });
  } catch (error) {
    client.functions.sendErrorMsg(error, message, command, extra.logId);
  }
}