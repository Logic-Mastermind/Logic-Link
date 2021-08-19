const Discord = require("discord.js");
const Buttons = require("discord-buttons");
const Prefix = require("discord-prefix");

exports.run = async (client, message, args, command, settings, tsettings) => {
  var guildPrefix = Prefix.getPrefix(message.guild.id);
  if (!guildPrefix) guildPrefix = client.util.defaultPrefix;

  const clientMember = message.guild.me;
  const noArgs = await client.functions.getNoArgs(command, message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = await client.functions.getArgs(args);
  const code = `\`\`\``;

  try {
      var slowmode = null;
      var channel = null;
      if (!thirdArg) channel = message.channel;

        var channel = message.mentions.channels.first();
        if (!channel) channel = client.functions.findChannel(secArg, message.guild);

        if (!isNaN(thirdArg)) {
          slowmode = thirdArg
        } else if (thirdArg == "off") {
          slowmode = 0
        } else {
          const errorEmbed = new Discord.MessageEmbed()
          .setTitle(`${command.name.toUpperCase()}`)
          .setColor(`RED`)
          .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
          .setDescription(`**Error**\nThe slowmode parameter must be a number.\nRun the \`${guildPrefix}help ${command.name}\` command to view command usage.`)
          .setTimestamp();

          return message.channel.send(errorEmbed)
        }

        slowmode = Math.round(slowmode)

        if (slowmode > 21600) {
          const errorEmbed = new Discord.MessageEmbed()
          .setTitle(`${command.name.toUpperCase()}`)
          .setColor(`RED`)
          .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
          .setDescription(`**Error**\nThe slowmode must be less than 6 hours long.`)
          .setTimestamp();

          return message.channel.send(errorEmbed)
        }

        if (channel) {
          if (channel.rateLimitPerUser == slowmode) {
            const errorEmbed = new Discord.MessageEmbed()
            .setTitle(`${command.name.toUpperCase()}`)
            .setColor(`ORANGE`)
            .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
            .setDescription(`**Error**\nThe slowmode has already been set to \`${slowmode}\` in that channel.`)
            .setTimestamp();

            return message.channel.send(errorEmbed)
          }

          if (!channel.permissionsFor(message.guild.me).has("MANAGE_CHANNELS")) {
            const errorEmbed = new Discord.MessageEmbed()
            .setTitle(`${command.name.toUpperCase()}`)
            .setColor(`RED`)
            .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
            .setDescription(`**Error**\nI do not have the required permissions in the <#${channel.id}> channel.\nPlease make sure that my role has the \`MANAGE_CHANNELS\` permission.`)
            .setTimestamp();

            return message.channel.send(errorEmbed)
          }

          channel.setRateLimitPerUser(slowmode, `${message.member.displayName} set #${channel.name}'s slowmode to ${slowmode}`)
          .then(() => {
            const successEmbed = new Discord.MessageEmbed()
            .setTitle(`${command.name.toUpperCase()}`)
            .setColor(`GREEN`)
            .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
            .setDescription(`**Success**\n${slowmode !== 0 ? `Changed <#${channel.id}>'s slowmode to \`${slowmode}\` ${slowmode == 1 ? `second` : `seconds`}` : `Turned off <#${channel.id}>'s slowmode`}.`)
            .setTimestamp();

            message.channel.send(successEmbed)
          })
          .catch((err) => {
            const errorEmbed = new Discord.MessageEmbed()
            .setTitle(`${command.name.toUpperCase()}`)
            .setColor(`RED`)
            .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
            .setDescription(`**Error**\nI was unable to change the slowmode of <#${channel.id}>.\n\n**Error Info**\n\`\`\`${err}\`\`\``)
            .setTimestamp();

            message.channel.send(errorEmbed)
          })
        } else {
          const errorEmbed = new Discord.MessageEmbed()
          .setTitle(`${command.name.toUpperCase()}`)
          .setColor(`RED`)
          .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
          .setDescription(`**Error**\nFailed to find the channel \`${secArg}\` in the server.`)
          .setTimestamp();

          message.channel.send(errorEmbed)
        }

        if (!isNaN(secArg)) {
          slowmode = secArg
        } else if (secArg == "off") {
          slowmode = 0
        } else {
          const errorEmbed = new Discord.MessageEmbed()
          .setTitle(`${command.name.toUpperCase()}`)
          .setColor(`RED`)
          .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
          .setDescription(`**Error**\nThe slowmode parameter must be a number.\nRun the \`${guildPrefix}help ${command.name}\` command to view command usage.`)
          .setTimestamp();

          return message.channel.send(errorEmbed)
        }

        slowmode = Math.round(slowmode)

        if (slowmode > 21600) {
          const errorEmbed = new Discord.MessageEmbed()
          .setTitle(`${command.name.toUpperCase()}`)
          .setColor(`RED`)
          .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
          .setDescription(`**Error**\nThe slowmode must be less than 6 hours long.`)
          .setTimestamp();

          return message.channel.send(errorEmbed)
        }

        if (message.channel.rateLimitPerUser == slowmode) {
          const errorEmbed = new Discord.MessageEmbed()
          .setTitle(`${command.name.toUpperCase()}`)
          .setColor(`ORANGE`)
          .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
          .setDescription(`**Error**\nThe slowmode has already been set to \`${slowmode}\` in that channel.`)
          .setTimestamp();

          return message.channel.send(errorEmbed)
        }

        if (!message.channel.permissionsFor(message.guild.me).has("MANAGE_CHANNELS")) {
          const errorEmbed = new Discord.MessageEmbed()
          .setTitle(`${command.name.toUpperCase()}`)
          .setColor(`RED`)
          .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
          .setDescription(`**Error**\nI do not have the required permissions in <#${message.channel.id}>.\nPlease make sure that my role has the \`MANAGE_CHANNELS\` permission.`)
          .setTimestamp();

          return message.channel.send(errorEmbed)
        }

        message.channel.setRateLimitPerUser(slowmode, `${message.member.displayName} set #${message.channel.name}'s slowmode to ${slowmode}`)
        .then(() => {
          const successEmbed = new Discord.MessageEmbed()
          .setTitle(`${command.name.toUpperCase()}`)
          .setColor(`GREEN`)
          .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
          .setDescription(`**Success**\n${slowmode !== 0 ? `Changed this channel's slowmode to \`${slowmode}\` ${slowmode == 1 ? `second` : `seconds`}` : `Turned off this channel's slowmode`}.`)
          .setTimestamp();

          message.channel.send(successEmbed)
        })
        .catch((err) => {
          const errorEmbed = new Discord.MessageEmbed()
          .setTitle(`${command.name.toUpperCase()}`)
          .setColor(`RED`)
          .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
          .setDescription(`**Error**\nI was unable to change the slowmode of <#${message.channel.id}>.\n\n**Error Info**\n${ending}${err}${ending}`)
          .setTimestamp();

          message.channel.send(errorEmbed)
        })
  } catch (error) {
    client.functions.sendErrorMsg(error, true, message, command);
  }
}