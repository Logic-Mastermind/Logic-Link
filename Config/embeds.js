const Discord = require("discord.js");
const ms = require("ms");
const code = "```"

const footer1 = `Logic Link - Imagine A World`;
const footer2 = `https://cdn.discordapp.com/emojis/775848533298905130.png?v=1`;

const cross = "<:Cross:867955785978761266>";
const check = "<:Check:867931890437476353>";
const error = "<:MessageFail:868113159737720912>";
const warn = "<:Warn:868113114221121586>";

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
    var permissions = command.clientPerms || [command];

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
    .setTitle(command.name || command)
    .setColor(`BLUE`)
    .setDescription(`${this.client.util.clock} ${msg ? msg : `Loading...`} ${this.client.util.pending}`)
    .setFooter(footer1, footer2)
    .setTimestamp();

    return embed
  }
  
  success(command, description, fields) {
    const embed = new Discord.MessageEmbed();
    embed.setTitle(command.name || command);
    embed.setColor(`GREEN`);
    embed.setDescription(`${check} ${description}`);
    embed.setFooter(footer1, footer2);
    if (fields) if (fields[0]) embed.addFields(fields);
    embed.setTimestamp();

    return embed
  }

  error(command, description, fields) {
    const embed = new Discord.MessageEmbed();
    embed.setTitle(command.name || command);
    embed.setColor(`RED`);
    embed.setDescription(`${this.client.util.error} ${description}`);
    embed.setFooter(footer1, footer2);
    if (fields) if (fields[0]) embed.addFields(fields);
    embed.setTimestamp();

    return embed;
  }

  red(command, description, fields) {
    const embed = new Discord.MessageEmbed();
    embed.setTitle(command.name || command);
    embed.setColor(`RED`);
    embed.setDescription(`${description}`);
    embed.setFooter(footer1, footer2);
    if (fields) if (fields[0]) embed.addFields(fields);
    embed.setTimestamp();

    return embed
  }

  green(command, description, fields) {
    const embed = new Discord.MessageEmbed();
    embed.setTitle(command.name || command);
    embed.setColor(`GREEN`);
    embed.setDescription(`${description}`);
    embed.setFooter(footer1, footer2);
    if (fields) if (fields[0]) embed.addFields(fields);
    embed.setTimestamp();

    return embed;
  }

  async errorInfo(command, message, error) {
    const errorId = await this.client.functions.getRandomString(10);
    error ? await this.client.functions.setErrorData(error, errorId) : console.log("Recieved Invalid Error");
    
    const whClient = new Discord.WebhookClient({ url: "https://canary.discord.com/api/webhooks/874010484234399745/-LA99Q0YTBlLE75xsUYw9LGuRhw4Gn7chFhx1LLyxGgUDDLahtbdFv0j0QrMrZ2UjkUa" });

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
    embed.setTitle(command.name || command);
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
    embed.setDescription(`${error} ${description}`);
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
    embed.setDescription(`${error} I could not record any users from your message.\n\n**Detailed Info**\n\`${arg}\` is not a user.`);
    embed.setFooter(footer1, footer2);
    embed.setTimestamp();

    return embed
  }

  noMember(command, arg) {
    const embed = new Discord.MessageEmbed()
    embed.setTitle(command.name);
    embed.setColor(`RED`);
    embed.setDescription(`${error} I could not record any server members from your message.\n\n**Detailed Info**\n\`${arg}\` is not a member.`);
    embed.setFooter(footer1, footer2);
    embed.setTimestamp();

    return embed;
  }

  noRole(command, arg) {
    const embed = new Discord.MessageEmbed()
    embed.setTitle(command.name);
    embed.setColor(`RED`);
    embed.setDescription(`${error} I could not record any roles from your message.\n\n**Detailed Info**\n\`${arg}\` is not a role.`);
    embed.setFooter(footer1, footer2);
    embed.setTimestamp();

    return embed;
  }

  noGuild(command, arg) {
    const embed = new Discord.MessageEmbed()
    embed.setTitle(command.name);
    embed.setColor(`RED`);
    embed.setDescription(`${error} I could not record any guilds from your message.\n\n**Detailed Info**\n\`${arg}\` is not a guild.`);
    embed.setFooter(footer1, footer2);
    embed.setTimestamp();

    return embed;
  }

  noChannel(command, arg) {
    const embed = new Discord.MessageEmbed()
    embed.setTitle(command.name);
    embed.setColor(`RED`);
    embed.setDescription(`${error} I could not record any channels from your message.\n\n**Detailed Info**\n\`${arg}\` is not a channel.`);
    embed.setFooter(footer1, footer2);
    embed.setTimestamp();

    return embed;
  }

  noCommand(command, arg) {
    const embed = new Discord.MessageEmbed()
    embed.setTitle(command.name);
    embed.setColor(`RED`);
    embed.setDescription(`${error} I could not record any commands from your message.\n\n**Detailed Info**\n\`${arg}\` is not a command.`);
    embed.setFooter(footer1, footer2);
    embed.setTimestamp();

    return embed;
  }

  noMembersOrRoles(command, arg1, arg2) {
    const embed = new Discord.MessageEmbed()
    embed.setTitle(command.name);
    embed.setColor(`RED`);
    embed.setDescription(`${error} I could not record any members or roles from your message.\n\n**Detailed Info**\n\`${arg1}\` is not a member.${arg2 ? `\n\`${arg2}\` is not a role.` : ``}`);
    embed.setFooter(footer1, footer2);
    embed.setTimestamp();

    return embed;
  }

  noRolesOrChannels(command, arg) {
    const embed = new Discord.MessageEmbed()
    embed.setTitle(command.name);
    embed.setColor(`RED`);
    embed.setDescription(`${error} I could not record any roles or channels from your message.\n\n**Detailed Info**\n\`${arg}\` is not a role or channel.`);
    embed.setFooter(footer1, footer2);
    embed.setTimestamp();

    return embed;
  }

  notValid(command, arg, type, other) {
    const embed = new Discord.MessageEmbed()
    embed.setTitle(command.name);
    embed.setColor(`RED`);
    embed.setDescription(`${error} No valid ${other ? other : type}s were recorded from your message.\n\n**Detailed Info**\n\`${arg}\` is not a valid ${type}.`);
    embed.setFooter(footer1, footer2);
    embed.setTimestamp();

    return embed;
  }

  detailed(command, content, ...descriptions) {
    const embed = new Discord.MessageEmbed()
    embed.setTitle(command.name);
    embed.setColor(`RED`);
    embed.setDescription(`${error} ${content}\n\n**Detailed Info**\n${descriptions.join("\n")}`);
    embed.setFooter(footer1, footer2);
    embed.setTimestamp();

    return embed;
  }

  moderated(type, guild, reason, duration) {
    var content = null;
    var title = null;

    switch (type) {
      case "ban":
      {
        content = `You have been banned from \`${guild.name}\`.`;
        title = "User Banned";
        break;
      }
      case "kick":
      {
        content = `You have been kicked from \`${guild.name}\`.`;
        title = "User Kicked";
        break;
      }
      case "mute":
      {
        content = `You have been muted in \`${guild.name}\`.`;
        title = "User Muted";
        break;
      }
      case "warn":
      {
        content = `You have been warned in \`${guild.name}\`.`;
        title = "User Warned";
        break;
      }
    }

    const embed = new Discord.MessageEmbed();
    embed.setTitle(title);
    embed.setColor("#f9a61a");
    embed.setDescription(`${warn} ${content}`);
    embed.setFooter(footer1, footer2);
    embed.addField("Reason", reason, false);
    if (duration) embed.addField("Duration", ms(duration, { long: true }));
    embed.setTimestamp();

    return embed;
  }

  helpCategory(category, emoji, prefix, tckSup, tckAdm, noPanel) {
    const lowerCat = category.toLowerCase();
    var cmdArray = null;
    
    if (category == "Ticket") {
      cmdArray = [
        { name: `${this.client.util.members} Basic Commands`, value: `${code}\n${this.client.category.get(category).Basic.join("\n")}${code}`, inline: true },
        { name: `${tckSup}Support Commands`, value: `${code}\n${this.client.category.get(category).Support.join("\n")}${code}`, inline: true },
        { name: `${tckAdm}Administrator Commands`, value: `${code}\n${this.client.category.get(category).Administrator.join("\n")}${code}`, inline: true }
      ]
    } else {
      cmdArray = [
        { name: `${emoji}${category} Commands`, value: `${code}\n${this.client.category.get(category).join("\n")}${code}`, inline: true },
        { name: this.client.util.whitespace, value: `\u200b`, inline: true },
        { name: this.client.util.whitespace, value: `\u200b`, inline: true }
      ]
    }

    const helpEmbed = this.field(`Help - ${category}`, `${this.client.util.welcomeBotInfo}\n\n**Command List**\nBelow shows a list of all ${lowerCat} commands.\nTo get more details about a particular command, run: \`${prefix}help [command]\`.\nIf you would like a detailed guide on the help menu, run \`${prefix}help guide\`.\n\n${code}${category} Commands${code}\u200b${noPanel ? `\n${this.client.util.warn} This server does not have any panels. Run \`${prefix}panels new\` to create one.\n` : ``}`, cmdArray);

    return helpEmbed;
  }

  itemInfo(command, type, info) {
    const embed = new Discord.MessageEmbed();
    embed.setTitle(command.name || command);
    embed.setColor("GREEN");
    embed.setFooter(footer1, footer2);
    embed.setTimestamp();

    if (type == "user") {
      const roles = info.roles[0] ? `<@&${info.roles.join(">, <@&")}>` : "No Roles";
      const roleCount = roles !== "No Roles" ? info.roles.length : 0;

      embed.addFields([
        { name: "Created At", value: `<t:${info.createdAt}:D>`, inline: true },
        { name: "Joined At", value: `<t:${info.joinedAt}:D>`, inline: true },
        { name: `Roles [${roleCount}]`, value: roles, inline: false },
        { name: "Permissions", value: info.permissions.join(" "), inline: false },
        { name: "Badges", value: info.badges.join(" "), inline: false },
      ]);

      embed.setThumbnail(info.profile);
      embed.setDescription(`${check} Showing whois information for: <@${info.user.id}>.\n\u200b`);
    } else if (type == "guild") {
      embed.addFields([
        { name: "Server Owner", value: `<@${info.owner}>`, inline: true },
        { name: "Created At", value: `<t:${info.createdAt}:D>`, inline: true },
        { name: "\u200b", value: "\u200b", inline: true },
        { name: "Roles", value: info.roles, inline: true },
        { name: "Emojis", value: info.emojis, inline: true },
        { name: "Members", value: info.members, inline: true },
        { name: "Channels", value: info.channels, inline: false },
        { name: "Boosts", value: info.boosts, inline: false },
      ]);

      embed.setThumbnail(info.icon);
      embed.setDescription(`${check} Showing server information for ${info.guild.name}.\n\u200b`);
    } else if (type == "channel") {
      const nsfw = info.nsfw ? `NSFW.` : `Not NSFW.`;

      embed.addFields([
        { name: "Name", value: `\`${info.name}\``, inline: true },
        { name: "ID", value: `\`${info.id}\``, inline: true },
        { name: "\u200b", value: "\u200b", inline: true },
        { name: "Type", value: info.type, inline: true },
        { name: "NSFW", value: nsfw, inline: true },
        { name: "Category", value: info.category ? `#${info.category.name}` : `No Channel Category.`, inline: true },
        { name: "Topic", value: info.topic || "No Channel Topic", inline: false },
        { name: "Permission Overwrites", value: info.overwrites, inline: true },
        { name: "Raw Position", value: info.position, inline: true }
      ]);

      embed.setDescription(`${check} Showing channel information for: <#${info.id}>.\n\u200b`);
    } else if (type == "role") {
      embed.addFields([
        { name: "Name", value: `\`${info.name}\``, inline: true },
        { name: "ID", value: `\`${info.id}\``, inline: true },
        { name: "\u200b", value: "\u200b", inline: true },
        { name: "Colour", value: info.color, inline: true },
        { name: "Hoist", value: info.hoist, inline: true },
        { name: "Mentionable", value: info.mentionable, inline: true },
        { name: "Permissions", value: info.permissions, inline: false },
        { name: "Raw Position", value: info.position, inline: true }
      ]);

      embed.setDescription(`${check} Showing role information for: <@&${info.id}>.\n\u200b`);
    }

    return embed;
  }
}