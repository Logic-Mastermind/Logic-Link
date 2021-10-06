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
    var channel = message.mentions.channels.first();
    var announcement = args.slice(1).join(" ");
    var option = null;

    if (command.options.includes(secArg)) {
      if (!fourthArg) {
        const embed = await client.embeds.noArgs(command.option[secArg], message.guild);
        return message.reply({ embeds: [embed] });
      }

      if (secArg == "role") {
        if (!fifthArg) {
          const embed = await client.embeds.noArgs(command.option[secArg], message.guild);
          return message.reply({ embeds: [embed] });
        }

        if (!channel) channel = await client.functions.findChannel(fourthArg, message.guild);
        const role = await client.functions.findRole(thirdArg, message.guild);

        if (!role) {
          const embed = client.embeds.noRole(command, thirdArg);
          return message.reply({ embeds: [embed] });
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
      if (!channel.permissionsFor(message.member).has("SEND_MESSAGES")) {
        const embed = client.embeds.permission(command, "SEND_MESSAGES");
        return message.reply({ embeds: [embed] });
      }

      announcement = await client.functions.upperFirst(announcement);
      const announceEmbed = client.embeds.custom("Announcement", announcement, [`Announced by ${message.author.tag}`, message.author.displayAvatarURL()]);
      const messageOptions = { embeds: [announceEmbed] };

      if (option) {
        if (option == "everyone" || option == "here") messageOptions.content = `@${option}`;
        else messageOptions.content = `<@&${option}>`;
      }

      if (!client.functions.isMod(message.member, message.guild, settings)) {
        if (!channel.permissionsFor(message.member).has("SEND_MESSAGES")) {
          const embed = client.embeds.permission("SEND_MESSAGES");
          return message.reply({ embeds: [embed] });
        }

        if (!channel.permissionsFor(message.member).has("MENTION_EVERYONE")) {
          const embed = client.embeds.permission("MENTION_EVERYONE");
          return message.reply({ embeds: [embed] });
        }
      }

      channel.send(messageOptions)
      .then(() => {
        if (channel.id !== message.channel.id) {
          const embed = client.embeds.success(command, `Sent the announcement to <#${channel.id}>.`);
          message.reply({ embeds: [embed] });
        }
      })
      .catch(async (error) => {
        const embed = client.embeds.errorInfo(command, message, error);
        message.reply({ embeds: [embed] });
      })
    } else {
      const embed = client.embeds.noChannel(command, option ? thirdArg : secArg)
      message.reply({ embeds: [embed] });
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, message, command, extra.logId);
  }
}