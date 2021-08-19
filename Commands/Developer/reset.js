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
    if (secArg == "cooldown") {
      if (!thirdArg) {
        const noArgsEmbed = client.embeds.noArgs(command.option.cooldown, message.guild);
        return message.lineReply(noArgsEmbed);
      }

      var user = message.mentions.users.first();
      var mentionedCommand = client.functions.findCommand(fourthArg, client);
      if (!user) user = await client.functions.findUser(thirdArg, client);

      if (user) {
        const userID = user.id;

        if (mentionedCommand) {
          await client.db.cooldown.delete(user.id, mentionedCommand.commandName);

          const embed = client.embeds.success(command.option.cooldown, `Cleared <@${userID}>'s cooldown for the \`${mentionedCommand.commandName}\` command.`);
          message.lineReply(embed);
        } else {
          if (fourthArg) {
            const embed = client.embeds.error(command.option.cooldown, `\`${fourthArg}\` is not a valid command.`);
            return message.lineReply(embed);
          }

          await client.db.cooldown.delete(user.id);

          const embed = client.embeds.success(command.option.cooldown, `Cleared <@${userID}>'s cooldown.`);
          message.lineReply(embed);
        }
      } else {
        const embed = client.embeds.error(command.option.cooldown, `No users were recorded from your message.`);
        message.lineReply(embed);
      }
    } else if (secArg == "settings") {

    }
  } catch (error) {
    client.functions.sendErrorMsg(error, true, message, command);
  }
}