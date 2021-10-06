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

  new(title = "", description = "", color = "BLUE", footer1 = footer1, footer2 = footer2, timestamp = true, image = null, thumbnail = null, fields = []) {
    const embed = new Discord.MessageEmbed();
    if (title) embed.setTitle(title);
    if (description) embed.setDescription(description);
    if (color) embed.setColor(color);
    if (footer1) embed.setFooter(footer1, footer2);
    if (timestamp) embed.setTimestamp();
    if (thumbnail) embed.setThumbnail(thumbnail);
    if (image) embed.setImage(image);
    if (fields) embed.addFields(fields);
    return embed;
  }

  permission(command, msg) {
    var permissions = command;
    if (typeof command == "object") permissions = command.permissions;
    
    if (/[A-Z_]/.test(msg)) {
      permissions = [msg];
      msg = null;
    }

    const description = `${msg || `You do not have the required permissions to execute the \`${command.commandName}\` command.`}\nTo execute this command, you will need to be granted the permission${permissions.length == 1 ? `` : `s`} below.`;

    const embed = new Discord.MessageEmbed();
    embed.setTitle(`Insufficient Permissions`);
    embed.setDescription(`${description}`);
    embed.setColor(`RED`);
    embed.addField("Command Permissions", `${code}${permissions.join(" | ")}${code}`);
    embed.setFooter(footer1, footer2);
    embed.setTimestamp();

    return embed;
  }

  botPermission(command, msg) {
    var permissions = command;
    if (typeof command == "object") permissions = command.permissions;

    if (/[A-Z_]/.test(msg)) {
      permissions = [msg];
      msg = null;
    }

    const description = `${msg || `I do not have the required permissions to carry out this process.`}\nConsider granting me the permission${permissions.length == 1 ? `` : `s`} below to run this command properly.`;

    const embed = new Discord.MessageEmbed();
    embed.setTitle(`Insufficient Permissions`);
    embed.setDescription(`${description}`);
    embed.setColor(`RED`);
    embed.addField("Command Permissions", `${code}${permissions.join(" | ")}${code}`);
    embed.setFooter(footer1, footer2);
    embed.setTimestamp();

    return embed;
  }

  pending(command, msg) {
    const embed = new Discord.MessageEmbed();
    embed.setTitle(command.name || command);
    embed.setColor(`BLUE`);
    embed.setDescription(`${this.client.util.clock} ${msg ? msg : `Loading...`} ${this.client.util.pending}`);
    embed.setFooter(footer1, footer2);
    embed.setTimestamp();

    return embed;
  }
  
  success(command, description, fields = []) {
    const embed = new Discord.MessageEmbed();
    embed.setTitle(command.name || command);
    embed.setColor(`GREEN`);
    embed.setDescription(`${check} ${description}`);
    embed.setFooter(footer1, footer2);
    if (fields[0]) embed.addFields(fields);
    embed.setTimestamp();

    return embed;
  }

  warn(command, description, fields = []) {
    const embed = new Discord.MessageEmbed();
    embed.setTitle(command.name || command);
    embed.setColor(`#f9a61a`);
    embed.setDescription(`${warn} ${description}`);
    embed.setFooter(footer1, footer2);
    if (fields[0]) embed.addFields(fields);
    embed.setTimestamp();

    return embed;
  }

  error(command, description, fields = []) {
    const embed = new Discord.MessageEmbed();
    embed.setTitle(command.name || command);
    embed.setColor(`RED`);
    embed.setDescription(`${error} ${description}`);
    embed.setFooter(footer1, footer2);
    if (fields[0]) embed.addFields(fields);
    embed.setTimestamp();

    return embed;
  }

  red(command, description, fields = []) {
    const embed = new Discord.MessageEmbed();
    embed.setTitle(command.name || command);
    embed.setColor(`RED`);
    embed.setDescription(`${description}`);
    embed.setFooter(footer1, footer2);
    if (fields[0]) embed.addFields(fields);
    embed.setTimestamp();

    return embed;
  }

  green(command, description, fields = []) {
    const embed = new Discord.MessageEmbed();
    embed.setTitle(command.name || command);
    embed.setColor(`GREEN`);
    embed.setDescription(`${description}`);
    embed.setFooter(footer1, footer2);
    if (fields[0]) embed.addFields(fields);
    embed.setTimestamp();

    return embed;
  }

  blue(command, description, fields = []) {
    const embed = new Discord.MessageEmbed();
    embed.setTitle(command.name || command);
    embed.setColor(`BLUE`);
    embed.setDescription(`${description}`);
    embed.setFooter(footer1, footer2);
    if (fields[0]) embed.addFields(fields);
    embed.setTimestamp();

    return embed;
  }

  custom(title, description, footer = [], fields = [], stamp) {
    const embed = new Discord.MessageEmbed();
    if (title) embed.setTitle(title.name || title);
    embed.setColor(`BLUE`);
    if (description) embed.setDescription(description);
    if (footer[0]) embed.setFooter(footer[0], footer[1]);
    if (fields[0]) embed.addFields(fields);
    if (stamp) embed.setTimestamp();

    return embed;
  }

  orange(command, description, fields = []) {
    const embed = new Discord.MessageEmbed();
    embed.setTitle(command.name || command);
    embed.setColor(`ORANGE`);
    embed.setDescription(`${description}`);
    embed.setFooter(footer1, footer2);
    if (fields[0]) embed.addFields(fields);
    embed.setTimestamp();

    return embed;
  }

  image(command, description, image) {
    const embed = new Discord.MessageEmbed();
    embed.setTitle(command.name);
    embed.setColor(`GREEN`);
    embed.setDescription(`${description}`);
    if (image) embed.setImage(image);
    embed.setFooter(footer1, footer2);
    embed.setTimestamp();

    return embed;
  }

  settingsNoArgs(command, description, prefix) {
    const embed = new Discord.MessageEmbed()
    embed.setTitle(command.name || command);
    embed.setColor(`BLUE`);
    embed.setDescription(`${command.description}\n\u200b`);
    embed.addField("Current Setting", `${description}\n\u200b`);
    embed.addField("Usage", `${code}${prefix}${command.usage}${code}\u200b`);
    embed.addField("Usage Error", `You are missing required parameters needed to carry out this command.\nTo get more information, run: \`${prefix}help ${command.commandName}\`.`);
    embed.setFooter(footer1, footer2);
    embed.setTimestamp();

    return embed;
  }

  inactivity(command) {
    const embed = new Discord.MessageEmbed()
    embed.setTitle(command.name || command);
    embed.setColor(`RED`);
    embed.setDescription(`${error} This prompt has timed out due to inactivity.`);
    embed.setFooter(footer1, footer2);
    embed.setTimestamp();

    return embed;
  }

  notComponent() {
    const embed = new Discord.MessageEmbed()
    embed.setTitle("Message Component");
    embed.setColor(`RED`);
    embed.setDescription(`${error} This is not your message component.`);
    embed.setFooter(footer1, footer2);
    embed.setTimestamp();

    return embed;
  }

  helpMenu(command, prefix) {
    const fields = [
      { name: `Permissions`, value: `${command.permissions == "ALL" ? `${this.client.util.noPerms}` : `${command.required == "dev" ? `Locked to bot developer.` : `\`${command.permissions.join(" | ")}\``}`}`, inline: true },
      { name: `Bot Permissions`, value: `${command.clientPerms ? command.clientPerms[0] ? `\`${command.clientPerms.join(" | ")}\`` : this.client.util.noPerms : this.client.util.noPerms}`, inline: true },
      { name: `\u200b`, value: `\u200b`, inline: true },
      { name: `Aliases`, value: `${command.aliases ? `\`${command.aliases.join("\`\n\`")}\`` : this.client.util.noAlias}`, inline: true },
      { name: `Options`, value: `${command.options ? `\`${command.options.join("\`\n\`")}\`` : this.client.util.noOption}`, inline: true },
      { name: `\u200b`, value: `\u200b`, inline: true },
    ]
    
    const embed = new Discord.MessageEmbed()
    embed.setTitle(`Help - ${command.name}`);
    embed.setColor(`BLUE`);
    embed.setDescription(`${command.description}\n\n**Usage**\n${code}\n${prefix}${command.usage}${code}\n**Cooldown**\n${command.cooldown == 0 ? `${this.client.util.noCooldown}` : `${ms(command.cooldown * 1000, { long: true })} cooldown.`}`);
    embed.addFields(fields);
    embed.setFooter(footer1, footer2);
    embed.setTimestamp();

    return embed;
  }

  noUser(command, arg) {
    const embed = new Discord.MessageEmbed()
    embed.setTitle(command.name || command);
    embed.setColor(`RED`);
    embed.setDescription(`${error} I could not record any users from your message.`);
    embed.setFooter(footer1, footer2);
    embed.addFields([{
      name: "Detailed Info",
      value: `\`${arg}\` is not a user.`,
      inline: false
    }]);
    embed.setTimestamp();

    return embed;
  }

  noMember(command, arg) {
    const embed = new Discord.MessageEmbed()
    embed.setTitle(command.name);
    embed.setColor(`RED`);
    embed.setDescription(`${error} I could not record any server members from your message.`);
    embed.setFooter(footer1, footer2);
    embed.addFields([{
      name: "Detailed Info",
      value: `\`${arg}\` is not a member.`,
      inline: false
    }]);
    embed.setTimestamp();

    return embed;
  }

  noRole(command, arg) {
    const embed = new Discord.MessageEmbed()
    embed.setTitle(command.name);
    embed.setColor(`RED`);
    embed.setDescription(`${error} I could not record any roles from your message.`);
    embed.setFooter(footer1, footer2);
    embed.addFields([{
      name: "Detailed Info",
      value: `\`${arg}\` is not a role.`,
      inline: false
    }]);
    embed.setTimestamp();

    return embed;
  }

  noGuild(command, arg) {
    const embed = new Discord.MessageEmbed()
    embed.setTitle(command.name);
    embed.setColor(`RED`);
    embed.setDescription(`${error} I could not record any guilds from your message.`);
    embed.setFooter(footer1, footer2);
    embed.addFields([{
      name: "Detailed Info",
      value: `\`${arg}\` is not a guild.`,
      inline: false
    }]);
    embed.setTimestamp();

    return embed;
  }

  noChannel(command, arg) {
    const embed = new Discord.MessageEmbed()
    embed.setTitle(command.name);
    embed.setColor(`RED`);
    embed.setDescription(`${error} I could not record any channels from your message.`);
    embed.setFooter(footer1, footer2);
    embed.addFields([{
      name: "Detailed Info",
      value: `\`${arg}\` is not a channel.`,
      inline: false
    }]);
    embed.setTimestamp();

    return embed;
  }

  noCommand(command, arg) {
    const embed = new Discord.MessageEmbed()
    embed.setTitle(command.name);
    embed.setColor(`RED`);
    embed.setDescription(`${error} I could not record any commands from your message.`);
    embed.setFooter(footer1, footer2);
    embed.addFields([{
      name: "Detailed Info",
      value: `\`${arg}\` is not a command.`,
      inline: false
    }]);
    embed.setTimestamp();

    return embed;
  }

  noMembersOrRoles(command, arg1, arg2) {
    const embed = new Discord.MessageEmbed()
    embed.setTitle(command.name);
    embed.setColor(`RED`);
    embed.setDescription(`${error} I could not record any members or roles from your message.`);
    embed.setFooter(footer1, footer2);
    embed.addFields([{
      name: "Detailed Info",
      value: `\`${arg1}\` is not a member.${arg2 ? `\n${arg2} is not a role`: ``}`,
      inline: false
    }]);
    embed.setTimestamp();

    return embed;
  }

  noRolesOrChannels(command, arg1) {
    const embed = new Discord.MessageEmbed()
    embed.setTitle(command.name);
    embed.setColor(`RED`);
    embed.setDescription(`${error} I could not record any roles or channels from your message.`);
    embed.setFooter(footer1, footer2);
    embed.addFields([{
      name: "Detailed Info",
      value: `\`${arg1}\` is not a role or channel.`,
      inline: false
    }]);
    embed.setTimestamp();

    return embed;
  }

  notValid(command, arg, type, other) {
    const embed = new Discord.MessageEmbed()
    embed.setTitle(command.name);
    embed.setColor(`RED`);
    embed.setDescription(`${error} I could not record any valid ${other || type}'s from your message.`);
    embed.setFooter(footer1, footer2);
    embed.addFields([{
      name: "Detailed Info",
      value: `\`${arg}\` is not a valid ${type}.`,
      inline: false
    }]);
    embed.setTimestamp();

    return embed;
  }

  detailed(command, content, ...descriptions) {
    const embed = new Discord.MessageEmbed()
    embed.setTitle(command.name);
    embed.setColor(`RED`);
    embed.setDescription(`${error} ${content}`);
    embed.addFields([{
      name: "Detailed Info",
      value: descriptions.join("\n"),
      inline: false
    }]);
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
        content = `You have been banned from \`${guild.name || guild}\`.`;
        title = "User Banned";
        break;
      }
      case "kick":
      {
        content = `You have been kicked from \`${guild.name || guild}\`.`;
        title = "User Kicked";
        break;
      }
      case "mute":
      {
        content = `You have been muted in \`${guild.name || guild}\`.`;
        title = "User Muted";
        break;
      }
      case "warn":
      {
        content = `You have been warned in \`${guild.name || guild}\`.`;
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

  helpCategory(category, title, prefix, supView, noPanel) {
    const cat = this.client.category.get(category);
    const lowerCat = category.toLowerCase();
    const client = this.client;

    const basic = `${client.util.members} Basic Commands`;
    const cmdArray = [];
    var catMsg = category == "General" ? "Basic info / utility commands available to all users." : category == "Moderator" ? "Advanced moderation commands useful for stopping raids and attacks." : category == "Administrator" ? "Easy to use admin / utility commands that can get the job done quickly." : category == "Ticket" ? "Next generation ticket systems and commands great for de-cluttering channels." : category == "Support" ? "Helpful commands for our support team used to diagnose issues." : category == "Developer" ? "Secret development commands used to debug problems and fix bugs." : null;
    
    if (category == "Ticket") {
      cmdArray.push({ name: basic, value: `${code}\n${cat.Basic.join("\n")}${code}`, inline: true });
      cmdArray.push({ name: supView, value: `${code}\n${cat.Support.join("\n")}${code}`, inline: true });
      cmdArray.push({ name: title, value: `${code}\n${cat.Administrator.join("\n")}${code}`, inline: true });
    } else {
      cmdArray.push({ name: title, value: `${code}\n${cat.join("\n")}${code}`, inline: true });
      cmdArray.push({ name: client.util.whitespace, value: `\u200b`, inline: true });
      cmdArray.push({ name: client.util.whitespace, value: `\u200b`, inline: true });
    }

    const helpEmbed = this.blue(`Help - ${category}`, `${catMsg}\n\n**Command List**\nBelow shows a list of all ${lowerCat} commands.\nTo get more details about a particular command, run: \`${prefix}help [command]\`.\nIf you would like a detailed guide on the help menu, run \`${prefix}help guide\`.\n\n${code}${category} Commands${code}\u200b${noPanel ? `\n${client.util.warn} This server does not have any panels. Run \`${prefix}panels new\` to create one.\n` : ``}`, cmdArray);

    return helpEmbed;
  }

  itemInfo(command, type, info) {
    const embed = new Discord.MessageEmbed();
    embed.setTitle(command.name || command);
    embed.setColor("GREEN");
    embed.setFooter(footer1, footer2);
    embed.setTimestamp();

    if (type == "user") {
      embed.addFields([
        { name: "Created At", value: info.createdAt, inline: true },
        { name: "Joined At", value: info.joinedAt, inline: true },
        { name: `Roles [${info.roleCount}]`, value: info.roles, inline: false },
        { name: "Permissions", value: info.permissions, inline: false },
        { name: "Badges", value: info.badges, inline: false },
      ]);

      embed.setThumbnail(info.profile);
      embed.setDescription(`${check} Showing whois information for: ${info.mention}.\n\u200b`);
    } else if (type == "guild") {
      embed.addFields([
        { name: "Server Owner", value: info.owner, inline: true },
        { name: "Created At", value: info.createdAt, inline: true },
        { name: "\u200b", value: "\u200b", inline: true },
        { name: "Roles", value: info.roles, inline: true },
        { name: "Emojis", value: info.emojis, inline: true },
        { name: "Members", value: info.members, inline: true },
        { name: "Channels", value: info.channels, inline: false },
        { name: "Boosts", value: info.boosts, inline: false },
      ]);

      embed.setThumbnail(info.icon);
      embed.setDescription(`${check} Showing server information for ${info.name}.\n\u200b`);
    } else if (type == "channel") {
      embed.addFields([
        { name: "Name", value: info.name, inline: true },
        { name: "ID", value: info.id, inline: true },
        { name: "\u200b", value: "\u200b", inline: true },
        { name: "Type", value: info.type, inline: true },
        { name: "NSFW", value: info.nsfw, inline: true },
        { name: "Category", value: info.category, inline: true },
        { name: "Topic", value: info.topic, inline: false },
        { name: "Permission Overwrites", value: info.overwrites, inline: true },
        { name: "Raw Position", value: info.position, inline: true },
        { name: "Pinned", value: info.pinned, inline: true }
      ]);

      embed.setDescription(`${check} Showing channel information for: ${info.mention}.\n\u200b`);
    } else if (type == "role") {
      embed.addFields([
        { name: "Name", value: info.name, inline: true },
        { name: "ID", value: info.id, inline: true },
        { name: "\u200b", value: "\u200b", inline: true },
        { name: "Colour", value: info.color, inline: true },
        { name: "Hoist", value: info.hoist, inline: true },
        { name: "Mentionable", value: info.mentionable, inline: true },
        { name: "Permissions", value: info.permissions, inline: false },
        { name: "Raw Position", value: info.position, inline: true }
      ]);

      embed.setDescription(`${check} Showing role information for: ${info.mention}.\n\u200b`);
    }

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
      fields: [
        {
          name: `Error Information`,
          value: `${error.name ? `**Name:** \`${error.name}\`` : ``}${error.message ? `\n**Message:** \`${error.message}\`` : ``}${error.path ? `\n**Path:** \`${error.path}\`` : ``}${error.code ? `\n**Code:** \`${error.code}\`` : ``}${error.method ? `\n**Method:** \`${error.method}\`` : ``}${error.httpStatus ? `\n**HTTP Status:** \`${error.httpStatus}\`‎` : ``}\n\u200b`,
          inline: false
        },
        {
          name: `Command Information`,
          value: `${command ? `**Name:** \`${command.name}\`\n` : ``}${message.guild ? `**Guild Name:** \`${message.guild.name}\`\n` : ``}${message.author ? `**Sender:** <@${message.author.id}>\n` : ``}${message.channel ? `**Channel:** <#${message.channel.id}>\n` : ``}`,
          inline: false
        }
      ]
    }

    const stack = {
      title: `Error Stack`,
      description: `${code}${error.stack}${code}`,
      color: "RED",
      timestamp: Date.now(),
      footer: {
        text: footer1,
        iconURL: footer2
      }
    }

    const msg = {
      title: command.name,
      description: this.client.util.errorMsgDefault,
      color: "RED",
      fields: [
        { name: "Error Identification", value: `${code}${errorId}${code}`, inline: false }
      ],
      timestamp: Date.now(),
      footer: {
        text: footer1,
        iconURL: footer2
      }
    }

    const embed = new Discord.MessageEmbed(msg);
    const embed1 = new Discord.MessageEmbed(catcher);
    const embed2 = new Discord.MessageEmbed(stack);

    whClient.send({
      username: "Logic Link",
      avatarURL: this.client.user.displayAvatarURL(),
      embeds: [embed1, embed2]
    })
    .catch((error) => console.log(error));
    return embed;
  }

  async noArgs(command = {}, guild) {
    const prefix = await this.client.functions.fetchPrefix(guild);
    const noArgs = {
      title: `${command.name}`,
      color: `ORANGE`,
      description: `${command.description}\n\u200b`,
      fields: [
        { name: "Usage", value: `${code}${prefix}${command.usage}${code}\u200b`, inline: false },
        { name: "Options", value: `${command.options[0] ? `\`${prefix}${command.commandName} ${command.options.join(`\`\n\`${prefix}${command.commandName} `)}\`` : this.client.util.noOption}\n\u200b` },
        { name: "Usage Error", value: `${this.client.util.requiredParams}\nTo get more information, run \`${prefix}help ${command.commandName}\`.` }
      ]
    }

    const embed = new Discord.MessageEmbed(noArgs);
    embed.setTimestamp();
    embed.setFooter(footer1, footer2);
    return embed;
  }

  noArgsObj(noArgs) {
    const embed = new Discord.MessageEmbed();
    embed.setTitle(noArgs.title);
    embed.setColor(noArgs.color);
    embed.setDescription(noArgs.description);
    embed.setFooter(noArgs.footer1, noArgs.footer2);
    embed.setTimestamp();

    return embed;
  }
}