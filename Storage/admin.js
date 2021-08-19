const Discord = require("discord.js");
const prefixManager = require("discord-prefix");
const buttons = require("discord-buttons");
const reply = require("discord-reply");

exports.run = async (client, message, args) =>  {
  var guildPrefix = prefixManager.getPrefix(message.guild.id)
  if (!guildPrefix) guildPrefix = client.defaultPrefix;

  const secArg = args[0];
  const thirdArg = args[1];
  const fourthArg = args[2];
  const fifthArg = args[3];

  const functions = require("../config/functions.js");
  const commands = require("../config/commands.js");
  const errors = require("../config/errors.js");
  
  const adminRoleConfig = client.settings.get(message.guild.id, "adminRole");
  const modLogChannelConfig = client.settings.get(message.guild.id, "modLogChannel");
  const modRoleConfig = client.settings.get(message.guild.id, "modRole");
  const mutedRoleConfig = client.settings.get(message.guild.id, "mutedRole");
  const welcomeChannelConfig = client.settings.get(message.guild.id, "welcomeChannel");
  const welcomeRoleConfig = client.settings.get(message.guild.id, "welcomeRole");
  const welcomeSystemConfig = client.settings.get(message.guild.id, "welcomeSystem");

  const adminRoleObject = message.guild.roles.cache.get(adminRoleConfig);
  const modLogChannelObject = message.guild.channels.cache.get(modLogChannelConfig);
  const modRoleObject = message.guild.roles.cache.get(modRoleConfig);
  const mutedRoleObject = message.guild.roles.cache.get(mutedRoleConfig);
  const welcomeChannelObject = message.guild.channels.cache.get(welcomeChannelConfig);
  const welcomeRoleObject = message.guild.roles.cache.get(welcomeRoleConfig);

  const clientMember = message.guild.member(client.user);
  const errorChannel = client.channels.cache.get(client.errorChannel)
  const command = commands.developer.admin;
  const ending = `\`\`\``;

  const noArgs = {
    title: `${command.name.toUpperCase()}`,
    color: `ORANGE`,
    description: `**Command Info**\n${command.description}\n\n**Usage**\n${ending}${guildPrefix}${command.usage}${ending}\n**Options**\n${command.options[0] ? `\`${guildPrefix}${command.commandName} ${command.options.join(`\n${guildPrefix}${command.commandName} `)}\`` : `${commands.noOption}`}\n\n**Usage Error**\nYou are missing required parameters needed to carry out this command.\nTo get more information, run: \`${guildPrefix}help ${command.commandName}\`.`,
    footer1: `Requested by ${message.member ? message.member.displayName : message.author.username}`,
    footer2: message.author.displayAvatarURL()
  }

  const responses = {
    adminOn: {
      success: `**Bot Configuration Modified**\nEnabled admin mode.`,
      error: `**Error**\nAdmin mode has already been enabled.`,
    },
    adminOff: {
      success: `**Bot Configuration Modified**\nDisabled admin mode.`,
      error: `**Error**\nAdmin mode has already been disabled.`,
    }
  }

  const footer1 = `Requested by ${message.member ? message.member.displayName : message.author.username}`;
  const footer2 = message.author.displayAvatarURL();

  async function sendErrorMsg(error, bool) {
    const invite = await message.channel.createInvite({}, `Creating invite for evaluation because of an error in the ${command.commandName} command.`).catch((err) => {})

    const catcher = {
      title: `ERROR`,
      color: `RED`,
      description: `An error has occured whilst running the \`${command.name}\` command.`,
      field1: {
        title: `Error Information`,
        description: `${error.name ? `**Name:** \`${error.name}\`` : ``}${error.message ? `\n**Message:** \`${error.message}\`` : ``}${error.path ? `\n**Path:** \`${error.path}\`` : ``}${error.code ? `\n**Code:** \`${error.code}\`` : ``}${error.method ? `\n**Method:** \`${error.method}\`` : ``}${error.httpStatus ? `\n**HTTP Status:** \`${error.httpStatus}\`‎` : ``}\n‎`,
      },
      field2: {
        title: `Command Information`,
        description: `${command.name ? `**Name:** \`${command.name}\`\n` : ``}${message.guild.name ? `**Guild Name:** \`${message.guild.name}\`\n` : ``}${message.author.id ? `**Sender:** <@${message.author.id}>\n` : ``}${message.channel.id ? `**Channel:** <#${message.channel.id}>\n` : ``}${invite ? `**Invite:** ${invite}` : ``}\n‎`,
      },
      field3: {
        title: `Error Stack`,
        description: `${ending}${error.stack}${ending}`,
      }
    }

    const errorEmbed = new Discord.MessageEmbed()
    .setTitle(`${catcher.title}`)
    .setColor(`${catcher.color}`)
    .addField(`${catcher.field1.title}`, `${catcher.field1.description}`)
    .addField(`${catcher.field2.title}`, `${catcher.field2.description}`)
    .addField(`${catcher.field3.title}`, `${catcher.field3.description}`)
    .setDescription(`${catcher.description}`)
    .setTimestamp();

    errorChannel.send(errorEmbed).catch((err) => console.log(err))
    if (bool) {
      if (bool == true) {
        const errEmbed = new Discord.MessageEmbed()
        .setTitle(`${command.name.toUpperCase()}`)
        .setColor(`${errors.unknown.color}`)
        .setFooter(noArgs.footer1, noArgs.footer2)
        .setDescription(`${errors.unknown.description}`)
        .setTimestamp();

        message.channel.send(errEmbed).catch((error) => console.log(error))
      }
    }
  }
  
  try {
    if (message.member.user.id === client.ownerId) {
      if (!args[0]) {
        const noArgsEmbed = new Discord.MessageEmbed()
        .setTitle(noArgs.title)
        .setColor(noArgs.color)
        .setFooter(noArgs.footer1, noArgs.footer2)
        .setDescription(noArgs.description)
        .setTimestamp();

        message.channel.send(noArgsEmbed).catch((error) => sendErrorMsg(error))
      } else if (secArg) {
        if (secArg == "on") {
          if (client.adminMode == false) {
            client.adminMode = true;
            const successEmbed = new Discord.MessageEmbed()
            .setTitle(`${command.name.toUpperCase()}`)
            .setColor(`GREEN`)
            .setFooter(`${footer1}`, `${footer2}`)
            .setDescription(`${responses.adminOn.success}`)
            .setTimestamp();

            message.channel.send(successEmbed).catch((error) => sendErrorMsg(error))
          } else {
            const errorEmbed = new Discord.MessageEmbed()
            .setTitle(`${command.name.toUpperCase()}`)
            .setColor(`ORANGE`)
            .setFooter(`${footer1}`, `${footer2}`)
            .setDescription(`${responses.adminOn.error}`)
            .setTimestamp();

            message.channel.send(errorEmbed).catch((error) => sendErrorMsg(error))
          }
        } else if (secArg == "off") {
          if (client.adminMode == true) {
            client.adminMode = false;
            const successEmbed = new Discord.MessageEmbed()
            .setTitle(`${command.name.toUpperCase()}`)
            .setColor(`GREEN`)
            .setFooter(`${footer1}`, `${footer2}`)
            .setDescription(`${responses.adminOff.success}`)
            .setTimestamp();

            message.channel.send(successEmbed).catch((error) => sendErrorMsg(error))
          } else {
            const errorEmbed = new Discord.MessageEmbed()
            .setTitle(`${command.name.toUpperCase()}`)
            .setColor(`ORANGE`)
            .setFooter(`${footer1}`, `${footer2}`)
            .setDescription(`${responses.adminOff.error}`)
            .setTimestamp();

            message.channel.send(errorEmbed).catch((error) => sendErrorMsg(error))
          }
        }
      }
    }
  } catch (error) {
    sendErrorMsg(error, true)
  }
}