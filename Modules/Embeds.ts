import Types from "../Typings/types";
import Discord from "discord.js";
import client from "../index";
import ms from "ms";

const code = "```"
const footer1 = `Logic Link - Imagine A World`;
const footer2 = `https://cdn.discordapp.com/emojis/775848533298905130.png?v=1`;
const { MessageEmbed } = Discord;

const check = "<:Check:867931890437476353>";
const question = "<:IconSupport:868117797429997578>";
const error = "<:MessageFail:868113159737720912>";
const warn = "<:Warn:868113114221121586>";

/**
 * A class with methods that return discord.js MessageEmbeds
 * @class Embeds
 */
export default class Embeds {
  client: Discord.Client;

  /**
   * Used to set the client property if it still exists.
   * @constructor
   * @param {Discord.Client} [client] - The client.
   */
  constructor(client?: Discord.Client) {
    if (client) this.client = client;
  }

  /**
   * Creates a new discord.js MessageEmbed and sets properties if they are defined.
   * @function new
   * @param {Object} data - The data of the embed.
   * @param {string} [data.title] - The title of the embed.
   * @param {string} data.description - The description of the embed.
   * @param {string|number|number[]} [data.color] - The color of the embed.
   * @param {string[]} [data.footer] - The footer data for the embed.
   * @param {number|null|Date} [data.timestamp] - The timestamp of the embed.
   * @param {string} [data.image] - The image of the embed.
   * @param {string} [data.thumbnail] - The thumbnail of the embed.
   * @param {Types.fieldData[]} [data.fields] - The fields for the embed.
   * @returns {Discord.MessageEmbed} The embed that was created.
   */
  new(data: Types.embedData): Discord.MessageEmbed {
    const { title, description, color, footer, timestamp, image, thumbnail, fields } = data;
    const embed = new MessageEmbed();
    embed.setDescription(description);
    embed.setColor(color || "BLUE");
    embed.setTimestamp(null);


    if (title) embed.setTitle(title);
    if (timestamp != null) embed.setTimestamp(timestamp);
    if (image) embed.setImage(image);
    if (thumbnail) embed.setThumbnail(thumbnail);
    if (fields) embed.addFields(fields);

    if (footer) embed.setFooter(footer[0], footer[1]);
    else embed.setFooter(footer1, footer2);
    return embed;
  }

  /**
   * Creates a new discord.js MessageEmbed and replaces values if specified.
   * @function permission
   * @param {Types.commandData|string|string[]} cmd - The command which the permission came from.
   * @param {string} [msg] - A custom message that is displayed in the embed.
   * @returns {Discord.MessageEmbed} The embed that was created.
   */
  permission(cmd: Types.commandData | string | string[], msg?: string): Discord.MessageEmbed {
    var permissions: string[];
    if (typeof cmd == "object" && !Array.isArray(cmd)) permissions = cmd.permissions;
    else if (typeof cmd == "string") permissions = [cmd];
    
    const description = `${msg || `You do not have the required permissions to execute ${typeof cmd == "object" && !Array.isArray(cmd) ? `the \`${cmd.commandName}\` command.` : `this`}`}\nTo execute this command, you will need to be granted the permission${permissions.length == 1 ? `` : `s`} below.`;

    const embed = new MessageEmbed();
    embed.setTitle(`Insufficient Permissions`);
    embed.setDescription(description);
    embed.setColor(`RED`);
    embed.addField("Command Permissions", `${code}${permissions.join(" | ")}${code}`);
    embed.setFooter(footer1, footer2);
    embed.setTimestamp();

    return embed;
  }

  /**
   * Creates a pre-defined discord.js MessageEmbed and replaces some values.
   * @function botPermission
   * @param {Types.commandData|command|string|string[]} cmd - The command which the permission came from.
   * @param {string} [msg] - A custom message that is displayed in the embed.
   * @returns {Discord.MessageEmbed} The embed that was created.
   */
  botPermission(cmd: Types.commandData | string | string[], msg?: string): Discord.MessageEmbed {
    var permissions: string[];
    if (typeof cmd == "object" && !Array.isArray(cmd)) permissions = cmd.permissions;
    else if (typeof cmd == "string") permissions = [cmd];
    
    const description = `${msg || `I do not have the required permissions to execute ${typeof cmd == "object" && !Array.isArray(cmd) ? `the \`${cmd.commandName}\` command.` : `this`}`}\nTo execute this command, I will need to be granted the permission${permissions.length == 1 ? `` : `s`} below.`;

    const embed = new MessageEmbed();
    embed.setTitle(`Insufficient Permissions`);
    embed.setDescription(description);
    embed.setColor(`RED`);
    embed.addField("Command Permissions", `${code}${permissions.join(" | ")}${code}`);
    embed.setFooter(footer1, footer2);
    embed.setTimestamp();

    return embed;
  }

  /**
   * Creates a pre-defined discord.js MessageEmbed and replaces some values.
   * @function pending
   * @param {command|string} command - The command this function is executing from.
   * @param {string} [msg] - A custom message that is displayed in the embed.
   * @returns {Discord.MessageEmbed} The embed that was created.
   */
  pending(command: Types.commandData | string, msg?: string): Discord.MessageEmbed {
    const title = typeof command == "object" ? command.name : command;
    const embed = new MessageEmbed();

    embed.setTitle(title);
    embed.setColor(`BLUE`);
    embed.setDescription(`${client.util.clock} ${msg || `Loading...`} ${client.util.pending}`);
    embed.setFooter(footer1, footer2);
    embed.setTimestamp();

    return embed;
  }
  
  /**
   * Creates a pre-defined discord.js MessageEmbed and replaces some values.
   * @function success
   * @param {command|string} command - The command this function is executing from.
   * @param {string} [description] - The description of the embed.
   * @param {Types.fieldData[]} [fields] - The embed's fields.
   * @returns {Discord.MessageEmbed} The embed that was created.
   */
  success(command: Types.commandData | string, description: string, fields?: Types.fieldData[]): Discord.MessageEmbed {
    const title = typeof command == "object" ? command.name : command;
    const embed = new MessageEmbed();

    embed.setTitle(title);
    embed.setColor(`GREEN`);
    embed.setDescription(`${check} ${description}`);
    embed.setFooter(footer1, footer2);
    embed.setTimestamp();

    if (fields.length != 0) embed.addFields(fields);
    return embed;
  }

  /**
   * Creates a pre-defined discord.js MessageEmbed and replaces some values.
   * @function green
   * @param {command|string} command - The command this function is executing from.
   * @param {string} [description] - The description of the embed.
   * @param {Types.fieldData[]} [fields] - The embed's fields.
   * @returns {Discord.MessageEmbed} The embed that was created.
   */
  green(command: Types.commandData | string, description: string, fields?: Types.fieldData[]): Discord.MessageEmbed {
    const title = typeof command == "object" ? command.name : command;
    const embed = new MessageEmbed();

    embed.setTitle(title);
    embed.setColor(`GREEN`);
    embed.setDescription(description);
    embed.setFooter(footer1, footer2);
    embed.setTimestamp();

    if (fields.length != 0) embed.addFields(fields);
    return embed;
  }

  /**
   * Creates a pre-defined discord.js MessageEmbed and replaces some values.
   * @function warn
   * @param {command|string} command - The command this function is executing from.
   * @param {string} [description] - The description of the embed.
   * @param {Types.fieldData[]} [fields] - The embed's fields.
   * @returns {Discord.MessageEmbed} The embed that was created.
   */
  warn(command: Types.commandData | string, description: string, fields?: Types.fieldData[]): Discord.MessageEmbed {
    const title = typeof command == "object" ? command.name : command;
    const embed = new MessageEmbed();

    embed.setTitle(title);
    embed.setColor(`#f9a61a`);
    embed.setDescription(`${warn} ${description}`);
    embed.setFooter(footer1, footer2);
    embed.setTimestamp();

    if (fields.length != 0) embed.addFields(fields);
    return embed;
  }

  /**
   * Creates a pre-defined discord.js MessageEmbed and replaces some values.
   * @function orange
   * @param {command|string} command - The command this function is executing from.
   * @param {string} [description] - The description of the embed.
   * @param {Types.fieldData[]} [fields] - The embed's fields.
   * @returns {Discord.MessageEmbed} The embed that was created.
   */
  orange(command: Types.commandData | string, description: string, fields?: Types.fieldData[]): Discord.MessageEmbed {
    const title = typeof command == "object" ? command.name : command;
    const embed = new MessageEmbed();

    embed.setTitle(title);
    embed.setColor(`#f9a61a`);
    embed.setDescription(description);
    embed.setFooter(footer1, footer2);
    embed.setTimestamp();

    if (fields.length != 0) embed.addFields(fields);
    return embed;
  }

  /**
   * Creates a pre-defined discord.js MessageEmbed and replaces some values.
   * @function error
   * @param {command|string} command - The command this function is executing from.
   * @param {string} [description] - The description of the embed.
   * @param {Types.fieldData[]} [fields] - The embed's fields.
   * @returns {Discord.MessageEmbed} The embed that was created.
   */
  error(command: Types.commandData | string, description: string, fields?: Types.fieldData[]): Discord.MessageEmbed {
    const title = typeof command == "object" ? command.name : command;
    const embed = new MessageEmbed();

    embed.setTitle(title);
    embed.setColor(`RED`);
    embed.setDescription(`${error} ${description}`);
    embed.setFooter(footer1, footer2);
    embed.setTimestamp();

    if (fields.length != 0) embed.addFields(fields);
    return embed;
  }

  /**
   * Creates a pre-defined discord.js MessageEmbed and replaces some values.
   * @function red
   * @param {command|string} command - The command this function is executing from.
   * @param {string} [description] - The description of the embed.
   * @param {Types.fieldData[]} [fields] - The embed's fields.
   * @returns {Discord.MessageEmbed} The embed that was created.
   */
  red(command: Types.commandData | string, description: string, fields?: Types.fieldData[]): Discord.MessageEmbed {
    const title = typeof command == "object" ? command.name : command;
    const embed = new MessageEmbed();

    embed.setTitle(title);
    embed.setColor(`RED`);
    embed.setDescription(description);
    embed.setFooter(footer1, footer2);
    embed.setTimestamp();

    if (fields.length != 0) embed.addFields(fields);
    return embed;
  }

  /**
   * Creates a pre-defined discord.js MessageEmbed and replaces some values.
   * @function question
   * @param {command|string} command - The command this function is executing from.
   * @param {string} [description] - The description of the embed.
   * @param {Types.fieldData[]} [fields] - The embed's fields.
   * @returns {Discord.MessageEmbed} The embed that was created.
   */
  question(command: Types.commandData | string, description: string, fields?: Types.fieldData[]): Discord.MessageEmbed {
    const title = typeof command == "object" ? command.name : command;
    const embed = new MessageEmbed();

    embed.setTitle(title);
    embed.setColor(`BLUE`);
    embed.setDescription(`${question} ${description}`);
    embed.setFooter(footer1, footer2);
    embed.setTimestamp();

    if (fields.length != 0) embed.addFields(fields);
    return embed;
  }

  /**
   * Creates a pre-defined discord.js MessageEmbed and replaces some values.
   * @function blue
   * @param {command|string} command - The command this function is executing from.
   * @param {string} [description] - The description of the embed.
   * @param {Types.fieldData[]} [fields] - The embed's fields.
   * @returns {Discord.MessageEmbed} The embed that was created.
   */
  blue(command: Types.commandData | string, description: string, fields?: Types.fieldData[]): Discord.MessageEmbed {
    const title = typeof command == "object" ? command.name : command;
    const embed = new MessageEmbed();

    embed.setTitle(title);
    embed.setColor(`BLUE`);
    embed.setDescription(description);
    embed.setFooter(footer1, footer2);
    embed.setTimestamp();

    if (fields.length != 0) embed.addFields(fields);
    return embed;
  }

  /**
   * Creates a discord.js MessageEmbed based on the arguments provided.
   * @function settingsNoArgs
   * @param {command} command - The command this function is executing from.
   * @param {string} [description] - The description of the setting.
   * @param {string} [prefix] - The prefix of the guild.
   * @returns {Discord.MessageEmbed} The embed that was created.
   */
  settingsNoArgs(command: Types.commandData, description: string, prefix: string): Discord.MessageEmbed {
    const title = typeof command == "object" ? command.name : command;
    const embed = new MessageEmbed();

    embed.setTitle(title);
    embed.setColor(`BLUE`);
    embed.setDescription(`${command.description}\n\u200b`);
    embed.addField("Current Setting", `${description}\n\u200b`);
    embed.addField("Usage", `${code}${prefix}${command.usage}${code}\u200b`);
    embed.addField("Usage Error", `You are missing required parameters needed to carry out this command.\nTo get more information, run: \`${prefix}help ${command.commandName}\`.`);
    embed.setFooter(footer1, footer2);
    embed.setTimestamp();

    return embed;
  }

  /**
   * Creates a pre-defined discord.js MessageEmbed and replaces some values.
   * @function inactivity
   * @param {command|string} command - The command this function is executing from.
   * @returns {Discord.MessageEmbed} The embed that was created.
   */
  inactivity(command: Types.commandData | string): Discord.MessageEmbed {
    const title = typeof command == "object" ? command.name : command;
    const embed = new MessageEmbed();

    embed.setTitle(title);
    embed.setColor(`RED`);
    embed.setDescription(`${error} This prompt has timed out due to inactivity.`);
    embed.setFooter(footer1, footer2);
    embed.setTimestamp();

    return embed;
  }

  /**
   * Creates a pre-defined discord.js MessageEmbed.
   * @function notComponent
   * @returns {Discord.MessageEmbed} The embed that was created.
   */
  notComponent() {
    const embed = new MessageEmbed();
    embed.setTitle("Message Component");
    embed.setColor(`RED`);
    embed.setDescription(`${error} This is not your message component.`);
    embed.setFooter(footer1, footer2);
    embed.setTimestamp();

    return embed;
  }

  /**
   * Creates a discord.js MessageEmbed based on the aguments provided.
   * @function helpMenu
   * @param {command} command - The command this function is executing from.
   * @param {string} prefix - The prefix of the guild.
   * @returns {Discord.MessageEmbed} The embed that was created.
   */
  helpMenu(command: Types.commandData, prefix: string): Discord.MessageEmbed {
    const fields = [
      { name: `Permissions`, value: `${command.permissions.includes("ALL") ? `${client.util.noPerms}` : `${command.category == "Developer" ? `Locked to bot developer.` : `\`${command.permissions.join(" | ")}\``}`}`, inline: true },
      { name: `Bot Permissions`, value: `${command.clientPerms ? command.clientPerms[0] ? `\`${command.clientPerms.join(" | ")}\`` : client.util.noPerms : client.util.noPerms}`, inline: true },
      { name: `\u200b`, value: `\u200b`, inline: true },
      { name: `Aliases`, value: `${command.aliases[0] ? `\`${command.aliases.join("\`\n\`")}\`` : client.util.noAlias}`, inline: true },
      { name: `Options`, value: `${command.options[0] ? `\`${command.options.join("\`\n\`")}\`` : client.util.noOption}`, inline: true },
      { name: `\u200b`, value: `\u200b`, inline: true },
    ]
    
    const embed = new MessageEmbed();
    embed.setTitle(`Help - ${command.name}`);
    embed.setColor(`BLUE`);
    embed.setDescription(`${command.description}\n\n**Usage**\n${code}\n${prefix}${command.usage}${code}\n**Cooldown**\n${command.cooldown == 0 ? `${client.util.noCooldown}` : `${ms(command.cooldown * 1000, { long: true })} cooldown.`}`);
    embed.addFields(fields);
    embed.setFooter(footer1, footer2);
    embed.setTimestamp();

    return embed;
  }

  /**
   * Creates a discord.js MessageEmbed based on the arguments provided.
   * @function invalidItem
   * @param {command|string} command - The command this function is executing from.
   * @param {string|string[]} item - The type(s) of items that are invalid.
   * @param {string|string[]} arg - The provided argument(s) that are invalid.
   * @returns {Discord.MessageEmbed} The embed that was created.
   */
  invalidItem(command: Types.commandData | string, item: string | string[], args: string | string[]): Discord.MessageEmbed {
    const title = typeof command == "object" ? command.name : command;
    const embed = new MessageEmbed();
    
    var items: string[];
    var fieldMsg: string[];
    if (!Array.isArray(args)) args = [args];

    if (Array.isArray(item)) {
      item.forEach((i: string) => items.push(i.toLowerCase()));
    } else {
      items.push(item.toLowerCase());
    }

    for (const [key, val] of Object.entries(args)) {
      var currentLine = `\`${val}\` is not a valid ${item[key]}.`;
      fieldMsg.push(currentLine);
    }

    embed.setTitle(title);
    embed.setColor(`RED`);
    embed.setDescription(`${error} I could not record any ${items.map(i => i + "s").join(" or ")} from your message.`);
    embed.addField("Detailed Info", fieldMsg.join("\n"));
    embed.setFooter(footer1, footer2);
    embed.setTimestamp();

    return embed;
  }

  /**
   * Creates a discord.js MessageEmbed based on the arguments provided.
   * @function detailed
   * @param {command|string} command - The command this function is executing from.
   * @param {string} content - The main content of the embed.
   * @param {...string} [fields] - Information for the fields of the embed.
   * @returns {Discord.MessageEmbed} The embed that was created.
   */
  detailed(command: Types.commandData | string, content: string, ...fields: string[]): Discord.MessageEmbed {
    const title = typeof command == "object" ? command.name : command;
    const embed = new MessageEmbed();

    embed.setTitle(title);
    embed.setColor(`RED`);
    embed.setDescription(`${error} ${content}`);
    embed.setFooter(footer1, footer2);
    embed.setTimestamp();

    if (fields) embed.addField("Detailed Info", fields.join("\n"));
    return embed;
  }

  /**
   * Creates a discord.js MessageEmbed based on the arguments provided.
   * @function moderated
   * @param {string} action - The moderation action that took place.
   * @param {Discord.Guild|string} guild - The guild or guild name that the action took place.
   * @param {string} reason - The reason for the action.
   * @param {number} [duration] - The duration for the action.
   * @returns {Discord.MessageEmbed} The embed that was created.
   */
  moderated(action: string, guild: Discord.Guild | string, reason: string, duration?: number): Discord.MessageEmbed {
    var guildName = typeof guild == "object" ? guild.name : guild;
    var parsed: string;

    if (action == "BAN") parsed = "Banned";
    else if (action == "KICK") parsed = "Kicked";
    else if (action == "MUTE") parsed = "Muted";
    else if (action == "WARN") parsed = "Warned";
    
    const embed = this.warn(`User ${parsed}`, `You have been ${parsed.toLowerCase()} in \`${guildName}\`.`, [{
      name: "Reason",
      value: reason
    }]);

    if (duration) embed.addField("Duration", ms(duration, { long: true }));
    return embed;
  }

  /**
   * 
   * @param {string} name - The name of the category.
   * @param {string} prefix - The prefix of the guild.
   * @param {Object} info - Info for the embed.
   * @param {string} info.main - The main title of the field.
   * @param {string} [info.supView] - The title of the ticket support field.
   * @param {string} [info.basicView] - The title of the ticket basic field.
   * @param {string} [info.noPanel] - A string which represents whether panels exist in the guild.
   * @returns {Discord.MessageEmbed} The embed that was created.
   */
  // helpCategory(name: string, prefix: string, info: Types.helpCategoryData): Discord.MessageEmbed {
  //   const category = client.category.get(name);
  //   const lowerName = name.toLowerCase();

  //   const basic = `${client.util.members} Basic Commands`;
  //   const description = client.commands[lowerName].description;
  //   const cmdArray = [];

  //   if (name == "Ticket") {
  //     cmdArray.push({ name: basic, value: `${code}\n${category.Basic.join("\n")}${code}`, inline: true });
  //     cmdArray.push({ name: info.supView, value: `${code}\n${category.Support.join("\n")}${code}`, inline: true });
  //     cmdArray.push({ name: info.main, value: `${code}\n${category.Administrator.join("\n")}${code}`, inline: true });
  //   } else {
  //     cmdArray.push({ name: info.main, value: `${code}\n${category.join("\n")}${code}`, inline: true });
  //     cmdArray.push({ name: client.util.whitespace, value: `\u200b`, inline: true });
  //     cmdArray.push({ name: client.util.whitespace, value: `\u200b`, inline: true });
  //   }

  //   const helpEmbed = this.blue(`Help - ${name}`, `${description}\n\n**Command List**\nBelow shows a list of all ${lowerName} commands.\nTo get more details about a particular command, run: \`${prefix}help [command]\`.\nIf you would like a detailed guide on the help menu, run \`${prefix}help guide\`.\n\n${code}${name} Commands${code}\u200b${info.noPanel}`, cmdArray);

  //   return helpEmbed;
  // }

  /**
   * Creates a discord.js MessageEmbed and replaces info fields using the data given.
   * @function itemInfo
   * @param {command|string} command - The command this function is executing from.
   * @param {string} item - The type of item.
   * @param {Object} data - Data for the item.
   * @returns {Discord.MessageEmbed} The embed that was created.
   */
  itemInfo(command: Types.commandData | string, item: string, data: Types.empty): Discord.MessageEmbed {
    const title = typeof command == "object" ? command.name : command;
    const embed = new MessageEmbed();

    embed.setTitle(title);
    embed.setColor("GREEN");
    embed.setFooter(footer1, footer2);
    embed.setTimestamp();

    if (item == "user") {
      embed.addFields([
        { name: "Created At", value: data.createdAt, inline: true },
        { name: "Joined At", value: data.joinedAt, inline: true },
        { name: `Roles [${data.roleCount}]`, value: data.roles, inline: false },
        { name: "User ID", value: `\`${data.id}\``, inline: false },
        { name: "Permissions", value: data.permissions, inline: false },
        { name: "Badges", value: data.badges, inline: true },
        { name: "Server Owner", value: data.owner ? `Yes` : `No`, inline: true },
      ]);

      embed.setThumbnail(data.profile);
      embed.setDescription(`${check} Showing whois information for: <@${data.id}>.\n\u200b`);
      
    } else if (item == "guild") {
      embed.addFields([
        { name: "Server Owner", value: data.owner, inline: true },
        { name: "Created At", value: data.createdAt, inline: true },
        { name: "\u200b", value: "\u200b", inline: true },
        { name: "Roles", value: data.roles, inline: true },
        { name: "Emojis", value: data.emojis, inline: true },
        { name: "Members", value: data.members, inline: true },
        { name: "Channels", value: data.channels, inline: false },
        { name: "Boosts", value: data.boosts, inline: false },
      ]);

      embed.setThumbnail(data.icon);
      embed.setDescription(`${check} Showing server information for ${data.name}.\n\u200b`);

    } else if (item == "channel") {
      const fields = [
        { name: "Name", value: data.name, inline: true },
        { name: "ID", value: data.id, inline: true },
        { name: "\u200b", value: "\u200b", inline: true },
        { name: "Type", value: data.type, inline: true },
        { name: "NSFW", value: data.nsfw, inline: true },
        { name: "Category", value: data.category, inline: true },
        { name: "Topic", value: data.topic, inline: false },
        { name: "Permission Overwrites", value: data.overwrites, inline: true },
        { name: "Raw Position", value: data.position, inline: true },
      ];

      if (data.pinned) fields.push({ name: "Pinned", value: data.pinned, inline: true })
      embed.addFields(fields);
      embed.setDescription(`${check} Showing channel information for: ${data.mention}.\n\u200b`);

    } else if (item == "role") {
      embed.addFields([
        { name: "Name", value: data.name, inline: true },
        { name: "ID", value: data.id, inline: true },
        { name: "\u200b", value: "\u200b", inline: true },
        { name: "Colour", value: data.color, inline: true },
        { name: "Hoist", value: data.hoist, inline: true },
        { name: "Mentionable", value: data.mentionable, inline: true },
        { name: "Permissions", value: data.permissions, inline: false },
        { name: "Raw Position", value: data.position, inline: true }
      ]);

      embed.setDescription(`${check} Showing role information for: ${data.mention}.\n\u200b`);
    }

    return embed;
  }

  /**
   * Creates a discord.js MessageEmbed, configures error info and sends a webhook error message.
   * @function errorInfo
   * @param {Types.commandData|string} command - The command this function is executing from.
   * @param {Discord.Message} message - The message that invoked the error.
   * @param {Types.errorData} error - The error that was thrown.
   * @returns {Discord.MessageEmbed} The embed that was created.
   */
  errorInfo(command: Types.commandData, message: Discord.Message, error: Types.errorData): Discord.MessageEmbed {
    const errorId = client.functions.getRandomString(10);
    client.functions.setErrorData(error, errorId);
    
    const whClient = new Discord.WebhookClient({ url: "https://canary.discord.com/api/webhooks/874010484234399745/-LA99Q0YTBlLE75xsUYw9LGuRhw4Gn7chFhx1LLyxGgUDDLahtbdFv0j0QrMrZ2UjkUa" });

    const catcher: Types.embedData = {
      title: `Bot Error`,
      color: `RED`,
      description: `An error has occured whilst running the \`${command.commandName}\` command.\n${error.name.includes("Discord") ? `This error was caused by a Discord API Error which passed through user filtering.` : `This error was caused by a human error from the command file of this command.\u2001  \u200b`}`,
      fields: [
        {
          name: `Error Information`,
          value: `**Name:** \`${error.name}\`\n**Message:** \`${error.message}\`${error.path ? `\n**Path:** \`${error.path}\`` : ``}${error.code ? `\n**Code:** \`${error.code}\`` : ``}${error.method ? `\n**Method:** \`${error.method}\`` : ``}${error.httpStatus ? `\n**HTTP Status:** \`${error.httpStatus}\`\u200b` : ``}\n\u200b`,
          inline: false
        },
        {
          name: `Command Information`,
          value: `**Name:** \`${command.name}\`\n**Guild Name:** \`${message.guild.name}\`\n**Sender:** <@${message.author.id}>\n**Channel:** <#${message.channel.id}>\n`,
          inline: false
        }
      ]
    }

    const stack: Types.embedData = {
      title: `Error Stack`,
      description: `${code}${error.stack}${code}`,
      color: "RED"
    }

    const msg: Types.embedData = {
      title: command.name,
      description: client.util.errorMsgDefault,
      color: "RED",
      fields: [
        { name: "Error Identification", value: `${code}${errorId}${code}`, inline: false }
      ]
    }

    const embed = this.new(msg);
    const embed1 = this.new(catcher);
    const embed2 = this.new(stack);

    whClient.send({
      username: "Logic Link",
      avatarURL: client.user.displayAvatarURL(),
      embeds: [embed1, embed2]
    })
    .catch((error) => console.log(error));
    return embed;
  }

  /**
   * Creates a discord.js MessageEmbed and replaces info fields using the data given.
   * @function itemInfo
   * @param {command} command - The command that usage error info is being requested.
   * @param {Discord.Guild|string} guild - The guild that this function is executing from.
   * @returns {Discord.MessageEmbed} The embed that was created.
   */
  noArgs(command: Types.commandData, guild: Discord.Guild | string): Discord.MessageEmbed {
    const guildId = typeof guild == "object" ? guild.id : guild;
    const prefix = client.functions.fetchPrefix(guildId);
    const cmdName = command.commandName;

    const embed = this.new({
      title: command.name,
      description: `${command.description}\n\u200b`,
      color: "ORANGE",
      fields: [
        {
          name: "Usage",
          value: `${code}${prefix}${command.usage}${code}\u200b`
        },
        {
          name: "Aliases",
          value: `${command.aliases.length == 0 ? `${client.util.noAlias}` : `\`${prefix}${command.aliases.join(`\`\n${prefix}`)}\``}\n\u200b`
        },
        {
          name: "Options",
          value: `${command.options.length == 0 ? `${client.util.noOption}` : `\`${prefix}${cmdName} ${command.options.join(`\`\n\`${prefix}${cmdName} `)}\``}\n\u200b`
        },
        {
          name: "Usage Error",
          value: `You are missing required parameters needed to carry out this command.\nTo get more information, run \`>help eval.\``
        }
      ]
    })
    
    return embed;
  }
}