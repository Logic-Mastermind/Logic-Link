const Discord = require("discord.js");
const ms = require("ms");
const code = "```"

const footer1 = `Logic Link - Imagine A World`;
const footer2 = `https://cdn.discordapp.com/emojis/775848533298905130.png?v=1`;

const cross = "<:Cross:867955785978761266>";
const check = "<:Check:867931890437476353>";

module.exports = class Embeds {
  constructor(client) {
    this.client = client;
  }

  new(title, description, color, footer1, footer2, timestamp, image, thumbnail, fields) {
    const embed = new Discord.MessageEmbed();
    if (title) embed.setTitle(title);
    if (description) embed.setDescription(description);
    if (color) embed.setColor(color);
    if (footer1) embed.setFooter(footer1, footer2);
    if (timestamp) embed.setTimestamp();
    if (thumbnail) embed.setThumbnail(thumbnail);
    if (image) embed.setImage(image);
    if (fields) embed.addFields(fields);
    return embed
  }

  permission(command) {
    var permissions = command.permissions;
    if (!permissions) permissions = command;

    const description = `You do not have the required permissions to execute the \`${command.commandName}\` command.\nTo execute this command, you will need to be granted the permission${permissions.length == 1 ? `` : `s`} below.\n\n**Command Permissions**\n${code}${permissions.join(" | ")}${code}`;

    const embed = new Discord.MessageEmbed()
    .setTitle(`Insufficient Permissions`)
    .setDescription(`${description}`)
    .setColor(`RED`)
    .setFooter(footer1, footer2)
    .setTimestamp();

    return embed
  }

  botPermission(command) {
    var permissions = command.clientPerms;
    if (!permissions) permissions = command;

    const description = `I do not have the required permissions to carry out this process.\nConsider granting me the permission${permissions.length == 1 ? `` : `s`} below to run this command properly.\n\n**Command Permissions**\n${code}${permissions.join(" | ")}${code}`;

    const embed = new Discord.MessageEmbed()
    .setTitle(`Insufficient Permissions`)
    .setDescription(`${description}`)
    .setColor(`RED`)
    .setFooter(footer1, footer2)
    .setTimestamp();

    return embed
  }

  botPermissionCustom(command, msg) {
    var permissions = command.clientPerms;
    if (!permissions) permissions = command;

    const embed = new Discord.MessageEmbed()
    .setTitle(`Insufficient Permissions`)
    .setDescription(`${msg}\nConsider granting me the permission below to execute this command properly.\n\n**Permissions**\n${code}${permissions.join(" | ")}${code}`)
    .setColor(`RED`)
    .setFooter(footer1, footer2)
    .setTimestamp();

    return embed
  }

  async noArgs(command, guild) {
    const guildPrefix = await this.client.functions.fetchPrefix(guild);
    const noArgs = {
      title: `${command.name}`,
      color: `ORANGE`,
      description: `${command.description}\n\n**Usage**\n${code}${guildPrefix}${command.usage}${code}\n**Options**\n${command.options[0] ? `\`${guildPrefix}${command.commandName} ${command.options.join(`\n${guildPrefix}${command.commandName} `)}\`` : `No command options found.`}\n\n**Usage Error**\nYou are missing required parameters needed to carry out this command.\nTo get more information, run: \`${guildPrefix}help ${command.commandName}\`.`,
      footer1: `Logic Link - Imagine A World`,
      footer2: `https://cdn.discordapp.com/emojis/775848533298905130.png?v=1`
    }

    const embed = new Discord.MessageEmbed()
    .setTitle(noArgs.title)
    .setColor(noArgs.color)
    .setDescription(noArgs.description)
    .setFooter(noArgs.footer1, noArgs.footer2)
    .setTimestamp();

    return embed
  }

  noArgsObj(noArgs) {
    const embed = new Discord.MessageEmbed()
    .setTitle(noArgs.title)
    .setColor(noArgs.color)
    .setDescription(noArgs.description)
    .setFooter(noArgs.footer1, noArgs.footer2)
    .setTimestamp();

    return embed
  }

  pending(command, msg) {
    const embed = new Discord.MessageEmbed()
    .setTitle(command.name)
    .setColor(`BLUE`)
    .setDescription(`${msg ? msg : `Loading...`} <a:Loading:866730924606226462>`)
    .setFooter(footer1, footer2)
    .setTimestamp();

    return embed
  }
  success(command, description) {
    const embed = new Discord.MessageEmbed()
    .setTitle(command.name || command)
    .setColor(`GREEN`)
    .setDescription(`${check} ${description}`)
    .setFooter(footer1, footer2)
    .setTimestamp();

    return embed
  }

  error(command, description) {
    const embed = new Discord.MessageEmbed()
    .setTitle(command.name || command)
    .setColor(`RED`)
    .setDescription(`${cross} ${description}`)
    .setFooter(footer1, footer2)
    .setTimestamp();

    return embed
  }

  red(command, description) {
    const embed = new Discord.MessageEmbed()
    .setTitle(command.name || command)
    .setColor(`RED`)
    .setDescription(`${description}`)
    .setFooter(footer1, footer2)
    .setTimestamp();

    return embed
  }

  green(command, description) {
    const embed = new Discord.MessageEmbed()
    .setTitle(command.name || command)
    .setColor(`GREEN`)
    .setDescription(`${description}`)
    .setFooter(footer1, footer2)
    .setTimestamp();

    return embed
  }

  async errorInfo(command, message, error) {
    const errorId = await this.client.functions.getRandomString(10);
    await this.client.functions.setErrorData(error, errorId);
    
    const whClient = new Discord.WebhookClient(`874010484234399745`, `-LA99Q0YTBlLE75xsUYw9LGuRhw4Gn7chFhx1LLyxGgUDDLahtbdFv0j0QrMrZ2UjkUa`);

    const catcher = {
      title: `Bot Error`,
      color: `RED`,
      description: `An error has occured whilst running the \`${command.commandName}\` command.\n${error ? `${error.name ? `${error.name.includes("Discord") ? `This error was caused by a Discord API Error which passed through user filtering.` : `This error was caused by a human error from the command file of this command.   \u200b`}` : `This error was caused by a human error from the command file of this command.   \u200b`}` : ``}`,
      field1: {
        title: `Error Information`,
        description: `${error.name ? `**Name:** \`${error.name}\`` : ``}${error.message ? `\n**Message:** \`${error.message}\`` : ``}${error.path ? `\n**Path:** \`${error.path}\`` : ``}${error.code ? `\n**Code:** \`${error.code}\`` : ``}${error.method ? `\n**Method:** \`${error.method}\`` : ``}${error.httpStatus ? `\n**HTTP Status:** \`${error.httpStatus}\`‎` : ``}\n‎`,
      },
      field2: {
        title: `Command Information`,
        description: `${command.name ? `**Name:** \`${command.name}\`\n` : ``}${message.guild.name ? `**Guild Name:** \`${message.guild.name}\`\n` : ``}${message.author.id ? `**Sender:** <@${message.author.id}>\n` : ``}${message.channel.id ? `**Channel:** <#${message.channel.id}>\n` : ``}`,
      },
      field3: {
        title: `Error Stack`,
        description: `${code}${error.stack}${code}`,
      },
      footer1: `Logic Link - Imagine A World`,
      footer2: `https://cdn.discordapp.com/emojis/775848533298905130.png?v=1`
    }

    const errorEmbed = new Discord.MessageEmbed();
    errorEmbed.setTitle(`${catcher.title}`)
    errorEmbed.setColor(`${catcher.color}`)
    if (error) errorEmbed.addField(`${catcher.field1.title}`, `${catcher.field1.description}`)
    if (command) errorEmbed.addField(`${catcher.field2.title}`, `${catcher.field2.description}`)
    errorEmbed.setDescription(`${catcher.description}`)

    const stackEmbed = new Discord.MessageEmbed();
    stackEmbed.setTitle(catcher.field3.title);
    stackEmbed.setColor(catcher.color)
    stackEmbed.setDescription(catcher.field3.description);
    stackEmbed.setFooter(catcher.footer1, catcher.footer2)
    stackEmbed.setTimestamp();

    whClient.send({
      username: "Logic Link",
      avatarURL: this.client.user.displayAvatarURL(),
      embeds: [errorEmbed, stackEmbed]
    })
    .catch((error) => console.log(error))

    const embed = new Discord.MessageEmbed()
    .setTitle(command.name)
    .setColor(`RED`)
    .setDescription(`An error has occured whilst running this command${error.message ? `` : `, that's all we know for now`}.\nIf this issue persists, please contact the bot developer or support server.\n\n**Error ID**\n${code}${errorId}${code}\n**Error Info**\n${error.message ? `${code}${error.message}${code}\n` : ``}`)
    .setFooter(footer1, footer2)
    .setTimestamp();

    return embed
  }

  image(command, description, image) {
    const embed = new Discord.MessageEmbed()
    .setTitle(command.name)
    .setColor(`GREEN`)
    .setDescription(`${description}`)
    .setImage(image)
    .setFooter(footer1, footer2)
    .setTimestamp();

    return embed
  }

  confirmation(command, description) {
    const embed = new Discord.MessageEmbed()
    .setTitle(command.name)
    .setColor(`ORANGE`)
    .setDescription(`${description}`)
    .setFooter(footer1, footer2)
    .setTimestamp();

    return embed
  }

  blue(command, description, setFooters) {
    const embed = new Discord.MessageEmbed();
    if (command) embed.setTitle(command.name || command)
    embed.setColor(`BLUE`)
    if (description) embed.setDescription(`${description}`)
    if (!setFooters) {
      embed.setFooter(footer1, footer2);
      embed.setTimestamp();
    }

    return embed
  }

  orange(command, description) {
    const embed = new Discord.MessageEmbed()
    .setTitle(command.name || command)
    .setColor(`ORANGE`)
    .setDescription(`${description}`)
    .setFooter(footer1, footer2)
    .setTimestamp();

    return embed
  }

  field(command, description, fields) {
    const embed = new Discord.MessageEmbed()
    embed.setTitle(command.name);
    embed.setColor(`BLUE`);
    embed.setDescription(`${description}`);
    if (fields) embed.addFields(fields);
    embed.setFooter(footer1, footer2);
    embed.setTimestamp();

    return embed
  }

  fieldSuccess(command, description, fields) {
    const embed = new Discord.MessageEmbed()
    embed.setTitle(command.name || command);
    embed.setColor(`GREEN`);
    embed.setDescription(`${check} ${description}`);
    if (fields) embed.addFields(fields);
    embed.setFooter(footer1, footer2);
    embed.setTimestamp();

    return embed
  }

  fieldGreen(command, description, fields) {
    const embed = new Discord.MessageEmbed()
    embed.setTitle(command.name || command);
    embed.setColor(`GREEN`);
    embed.setDescription(`${description}`);
    if (fields) embed.addFields(fields);
    embed.setFooter(footer1, footer2);
    embed.setTimestamp();

    return embed
  }

  fieldError(command, description, fields) {
    const embed = new Discord.MessageEmbed()
    embed.setTitle(command.name || command);
    embed.setColor(`RED`);
    embed.setDescription(`${cross} ${description}`);
    if (fields) embed.addFields(fields);
    embed.setFooter(footer1, footer2);
    embed.setTimestamp();

    return embed
  }

  settingsNoArgs(command, description, prefix) {
    const embed = new Discord.MessageEmbed()
    embed.setTitle(command.name || command);
    embed.setColor(`BLUE`);
    embed.setDescription(`${command.description}\n\n**Current Setting**\n${description}\n\n**Usage**\n${code}${prefix}${command.usage}${code}\n**Usage Error**\nYou are missing required parameters needed to carry out this command.\nTo get more information, run: \`${prefix}help ${command.commandName}\`.`);
    embed.setFooter(footer1, footer2);
    embed.setTimestamp();

    return embed
  }

  helpMenu(command, prefix) {
    const fields = [
      { name: `Permissions`, value: `${command.permissions[0] == "ALL" ? `${this.client.util.noPerms}` : `${command.required == "dev" ? `Locked to bot developer.` : `\`${command.permissions.join(" | ")}\``}`}`, inline: true },
      { name: `Bot Permissions`, value: `${command.clientPerms[0] ? `\`${command.permissions.join(" | ")}\`` : `${this.client.util.noPerms}`}`, inline: true },
      { name: `\u200b`, value: `\u200b`, inline: true },
      { name: `Aliases`, value: `${command.aliases[0] ? `\`${command.aliases.join("\n")}\`` : `${this.client.util.noAlias}`}`, inline: true },
      { name: `Options`, value: `${command.options[0] ? `\`${command.options.join("\n")}\`` : `${this.client.util.noOption}`}`, inline: true },
      { name: `\u200b`, value: `\u200b`, inline: true },
    ]
    const embed = new Discord.MessageEmbed()
    embed.setTitle(`Help - ${command.name}`);
    embed.setColor(`BLUE`);
    embed.setDescription(`${command.description}\n\n**Usage**\n${code}\n${prefix}${command.usage}${code}\n**Cooldown**\n${command.cooldown == 0 ? `${this.client.util.noCooldown}` : `${ms(command.cooldown * 1000, { long: true })} cooldown.`}`);
    embed.addFields(fields);
    embed.setFooter(footer1, footer2);
    embed.setTimestamp();

    return embed
  }

  noUser(command, arg) {
    const embed = new Discord.MessageEmbed()
    embed.setTitle(command.name || command);
    embed.setColor(`RED`);
    embed.setDescription(`${cross} No users were recorded from your message.\n\n**Detailed Info**\n\`${arg}\` is not a user.`);
    embed.setFooter(footer1, footer2);
    embed.setTimestamp();

    return embed
  }

  noMember(command, arg) {
    const embed = new Discord.MessageEmbed()
    embed.setTitle(command.name);
    embed.setColor(`RED`);
    embed.setDescription(`${cross} No members were recorded from your message.\n\n**Detailed Info**\n\`${arg}\` is not a member.`);
    embed.setFooter(footer1, footer2);
    embed.setTimestamp();

    return embed
  }

  noRole(command, arg) {
    const embed = new Discord.MessageEmbed()
    embed.setTitle(command.name);
    embed.setColor(`RED`);
    embed.setDescription(`${cross} No roles were recorded from your message.\n\n**Detailed Info**\n\`${arg}\` is not a role.`);
    embed.setFooter(footer1, footer2);
    embed.setTimestamp();

    return embed
  }

  noChannel(command, arg) {
    const embed = new Discord.MessageEmbed()
    embed.setTitle(command.name);
    embed.setColor(`RED`);
    embed.setDescription(`${cross} No channels were recorded from your message.\n\n**Detailed Info**\n\`${arg}\` is not a channel.`);
    embed.setFooter(footer1, footer2);
    embed.setTimestamp();

    return embed
  }

  noCommand(command, arg) {
    const embed = new Discord.MessageEmbed()
    embed.setTitle(command.name);
    embed.setColor(`RED`);
    embed.setDescription(`${cross} No commands were recorded from your message.\n\n**Detailed Info**\n\`${arg}\` is not a command.`);
    embed.setFooter(footer1, footer2);
    embed.setTimestamp();

    return embed
  }

  noMembersOrRoles(command, arg1, arg2) {
    const embed = new Discord.MessageEmbed()
    embed.setTitle(command.name);
    embed.setColor(`RED`);
    embed.setDescription(`${cross} No members or roles were recorded from your message.\n\n**Detailed Info**\n\`${arg1}\` is not a member.${arg2 ? `\n\`${arg2}\` is not a role.` : ``}`);
    embed.setFooter(footer1, footer2);
    embed.setTimestamp();

    return embed
  }

  noRolesOrChannels(command, arg) {
    const embed = new Discord.MessageEmbed()
    embed.setTitle(command.name);
    embed.setColor(`RED`);
    embed.setDescription(`${cross} No roles or channels were recorded from your message.\n\n**Detailed Info**\n\`${arg}\` is not a role or channel.`);
    embed.setFooter(footer1, footer2);
    embed.setTimestamp();

    return embed
  }

  notValid(command, arg, type, other) {
    const embed = new Discord.MessageEmbed()
    embed.setTitle(command.name);
    embed.setColor(`RED`);
    embed.setDescription(`${cross} No valid ${other ? other : type}s were recorded from your message.\n\n**Detailed Info**\n\`${arg}\` is not a valid ${type}.`);
    embed.setFooter(footer1, footer2);
    embed.setTimestamp();

    return embed
  }
}