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

  }

  try {
    var user = message.mentions.users.first();
    if (!user) user = await client.functions.findUser(secArg);

    if (user) {
      const blacklistInfo = client.db.blacklists.get(user.id);

      if (!blacklistInfo.blacklisted) {
        const embed = client.embeds.error(command, `This user has not been blacklisted.`);
        return message.lineReply(embed);
      }

      await client.db.blacklists.delete(user.id);
      const embed = client.embeds.success(command, `Un-blacklisted <@${user.id}> from Logic Link.`);
      message.lineReply(embed);
      
    } else {
      const embed = client.embeds.noUser(command, secArg);
      message.lineReply(embed);
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, true, message, command);
  }
}