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
    var channel = message.mentions.channels.first();
    var announcement = args.slice(1).join(" ");
    var option = null;

    if (command.options.includes(secArg)) {
      if (!fourthArg) {
        const noArgsEmbed = client.embeds.noArgs(command.option[secArg], message.guild);
        return message.lineReply(noArgsEmbed);
      }

      if (secArg == "role") {
        if (!fifthArg) {
          const noArgsEmbed = client.embeds.noArgs(command.option[secArg], message.guild);
          return message.lineReply(noArgsEmbed);
        }

        if (!channel) channel = await client.functions.findChannel(fourthArg, message.guild);
        const role = await client.functions.findRole(thirdArg, message.guild);

        if (!role) {
          const embed = client.embeds.noRole(command, thirdArg);
          return message.lineReply(embed);
        }

        announcement = args.slice(3).join(" ");
        option = role.id
      } else {
        option = secArg;
        announcement = args.slice(2).join(" ");
        if (!channel) channel = await client.functions.findChannel(thirdArg, message.guild);
      }
    } else {
      if (!channel) channel = await client.functions.findChannel(secArg, message.guild);
      option = null;
    }

    if (channel) {
      const announceEmbed = client.embeds.blue("Announcement", announcement, true);
      const messageOptions = { embed: announceEmbed };

      if (option) {
        if (option == "everyone" || option == "here") messageOptions.content = `@${option}`;
        else messageOptions.content = `<@&${option}>`
      }

      channel.send(messageOptions)
      .then(() => {
        if (channel.id !== message.channel.id) {
          const embed = client.embeds.success(command, `Sent the announcement to <#${channel.id}>.`);
          message.lineReply(embed);
        }
      })
      .catch(async (error) => {
        const embed = client.embeds.errorInfo(command, message, error);
        message.lineReply(embed);
      })
    } else {
      const embed = client.embeds.noChannel(command, option ? thirdArg : secArg)
      message.lineReply(embed);
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, true, message, command);
  }
}