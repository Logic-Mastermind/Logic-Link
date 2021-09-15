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
    if (secArg == "cooldown" || secArg == "cd") {
      if (!thirdArg) {
        const noArgsEmbed = await client.embeds.noArgs(command.option.cooldown, message.guild);
        return message.lineReply(noArgsEmbed);
      }

      var user = message.mentions.users.first();
      var cmd = await client.functions.findCommand(fourthArg);
      if (!user) user = await client.functions.findUser(thirdArg);

      if (user) {
        if (cmd) {
          await client.db.cooldown.delete(user.id, cmd.commandName);

          const embed = client.embeds.success(command.option.cooldown, `Cleared <@${user.id}>'s cooldown for the \`${cmd.commandName}\` command.`);
          message.lineReply(embed);
        } else {
          if (fourthArg) {
            const embed = client.embeds.noCommand(command.option.cooldown, fourthArg);
            return message.lineReply(embed);
          }

          await client.db.cooldown.delete(user.id);
          const embed = client.embeds.success(command.option.cooldown, `Cleared <@${user.id}>'s cooldown.`);
          message.lineReply(embed);
        }
      } else {
        const embed = client.embeds.noUser(command.option.cooldown, thirdArg);
        message.lineReply(embed);
      }
    } else if (secArg == "settings" || secArg == "set") {
      if (!thirdArg) {
        const noArgsEmbed = await client.embeds.noArgs(command.option.settings, message.guild);
        return message.lineReply(noArgsEmbed);
      }

      var setting = client.util.settingsAliases[fourthArg];
      var guild = await client.functions.findGuild(thirdArg);

      if (guild) {
        await client.db.settings.delete(guild.id, setting || null);
        const embed = client.embeds.success(command, `${setting ? `Reset the \`${setting}\` setting` : `Reset settings `} in the \`${guild.name}\` guild.`);
        message.lineReply(embed);

      } else {
        const embed = client.embeds.noGuild(command, thirdArg);
        message.lineReply(embed);
      }
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, true, message, command, extra.logId);
  }
}