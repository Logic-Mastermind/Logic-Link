const Discord = require("discord.js");
const Buttons = require("discord-buttons");
const Prefix = require("discord-prefix");

exports.run = async (client, message, args, command, settings, tsettings, extra) => {
  var guildPrefix = Prefix.getPrefix(message.guild.id);
  if (!guildPrefix) guildPrefix = client.util.defaultPrefix;

  const clientMember = message.guild.me;
  const noArgs = await client.functions.getNoArgs(command, message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = await client.functions.getArgs(args);
  const code = `\`\`\``;

  const responses = {
    invite: `To invite Logic Link to your server, click any one of the links below.\n\n**Invite Links**\n\`Administrator Invite\` - [Admin Invite ↗️](https://discord.com/api/oauth2/authorize?client_id=836761561074499695&permissions=8&scope=bot%20applications.commands)\n\`Non-Administrator Invite\` - [Non-Admin Invite ↗️](https://discord.com/oauth2/authorize?client_id=836761561074499695&permissions=1609591030&scope=bot%20applications.commands)\n\`Support Server\` - [Discord Invite ↗️](https://discord.gg/tg9sNMjpsU)`
  }
  
  try {
    const inviteEmbed = client.embeds.blue(command, `${client.util.botInfo} ${responses.invite}`);
    message.lineReply(inviteEmbed)
  } catch (error) {
    client.functions.sendErrorMsg(error, true, message, command);
  }
}