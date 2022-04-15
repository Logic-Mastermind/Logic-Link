import Types from "../Typings/types";
import Discord from "discord.js";
import client from "../index";
import ms from "ms";

const code = "```"
const text = `Logic Link - Imagine A World`;
const iconURL = `https://cdn.discordapp.com/emojis/775848533298905130.png?v=1`;

const check = "<:Check:867931890437476353>";
const question = "<:IconSupport:868117797429997578>";
const error = "<:MessageFail:868113159737720912>";
const warn = "<:Warn:868113114221121586>";

/**
 * A custom message embed class which eliminates text limit errors by con
 * @class Embed
 */
class Embed extends Discord.MessageEmbed {

  /**
   * Creates a new Discord.MessageEmbed().
   * @constructor
   * @param {Types.embedData} data - The embed data.
   */
  constructor(data?: Types.embedData) {
    if (data) {
      if (data.title?.length > 256) data.title = data.title.substring(0, 253) + "...";
      if (data.description.length > 4096) data.description = data.description.substring(0, 4093) + "...";

      if (data.fields) {
        data.fields.forEach((field, i, a) => {
          if (field.name.length > 256) field.name = field.name.substring(0,  253) + "...";
          if (field.value.length > 1024) field.value = field.value.substring(0, 1021) + "...";

          a.splice(i, 1, field);
        })
      }
    }

    //@ts-ignore
    super(data);
  } 

  public setTitle(title: string): this {
    if (title.length > 256) title = title.substring(0, 253) + "...";
    super.setTitle(title);
    return this;
  }

  public setDescription(description: string): this {
    if (description.length > 4096) description = description.substring(0, 4093) + "...";
    super.setDescription(description);
    return this;
  }

  public addFields(fields: Discord.EmbedFieldData[]): this {
    fields.forEach((field, i, a) => {
      if (field.name.length > 256) field.name = field.name.substring(0,  253) + "...";
      if (field.value.length > 1024) field.value = field.value.substring(0, 1021) + "...";

      a.splice(i, 1, field);
    })

    super.addFields(fields);
    return this;
  }

  public addField(name: string, value: string, inline?: boolean): this {
    if (name.length > 256) name = name.substring(0,  253) + "...";
    if (value.length > 1024) value = value.substring(0, 1021) + "...";

    super.addField(name, value);
    return this;
  }
}

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
  new(data?: Types.embedData): Discord.MessageEmbed {
    if (!data) return new Embed();

    const embed = new Embed();
    embed.setDescription(data.description);
    embed.setColor(data.color as "" || "BLUE");
    embed.setTimestamp(null);

    if (data.title) embed.setTitle(data.title);
    if (data.timestamp != null) embed.setTimestamp(data.timestamp);
    if (data.image) embed.setImage(data.image);
    if (data.thumbnail) embed.setThumbnail(data.thumbnail);
    if (data.fields) embed.addFields(data.fields);

    if (data.footer) embed.setFooter({ text: data.footer[0], iconURL: data.footer[1] });
    else embed.setFooter({ text, iconURL });
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
    let permissions: string[];
    if (typeof cmd == "object" && !Array.isArray(cmd)) permissions = cmd.permissions;
    else if (typeof cmd == "string") permissions = [cmd];
    
    const description = `${msg || `You do not have the required permissions to execute ${typeof cmd == "object" && !Array.isArray(cmd) ? `the \`${cmd.commandName}\` command.` : `this`}`}\nTo execute this command, you will need to be granted the permission${permissions.length == 1 ? `` : `s`} below.`;

    return this.new({
      title: "Insufficient Permissions",
      fields: [{ name: "Command Permissions", value:  `${code}${permissions.join(" | ")}${code}` }],
      color: "RED",
      description
    });
  }

  /**
   * Creates a pre-defined discord.js MessageEmbed and replaces some values.
   * @function botPermission
   * @param {Types.commandData|command|string|string[]} cmd - The command which the permission came from.
   * @param {string} [msg] - A custom message that is displayed in the embed.
   * @returns {Discord.MessageEmbed} The embed that was created.
   */
  botPermission(cmd: Types.commandData | string | string[], msg?: string): Discord.MessageEmbed {
    let permissions: string[];
    if (typeof cmd == "object" && !Array.isArray(cmd)) permissions = cmd.permissions;
    else if (typeof cmd == "string") permissions = [cmd];
    
    const description = `${msg || `I do not have the required permissions to execute ${typeof cmd == "object" && !Array.isArray(cmd) ? `the \`${cmd.commandName}\` command.` : `this`}`}\nTo execute this command, I will need to be granted the permission${permissions.length == 1 ? `` : `s`} below.`;

    return this.new({
      title: "Insufficient Permissions",
      fields: [{ name: "Command Permissions", value:  `${code}${permissions.join(" | ")}${code}` }],
      color: "RED",
      description
    });
  }

  /**
   * Creates a pre-defined discord.js MessageEmbed and replaces some values.
   * @function pending
   * @param {command|string} command - The command this function is executing from.
   * @param {string} [msg] - A custom message that is displayed in the embed.
   * @returns {Discord.MessageEmbed} The embed that was created.
   */
  pending(command: Types.commandData | string, msg?: string): Discord.MessageEmbed {
    const embed = this.new({
      title: typeof command == "object" ? command.name : command,
      description: `${client.util.emojis.clock} ${msg || `Loading...`} ${client.util.emojis.pending}`,
      color: "BLUE"
    });

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
    return this.new({
      title: typeof command == "object" ? command.name : command,
      color: "GREEN",
      fields: fields || [],
      description: `${check} ${description}`
    });
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
    return this.new({
      title: typeof command == "object" ? command.name : command,
      color: "GREEN",
      fields: fields || [],
      description: `${description}`
    });
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
    return this.new({
      title: typeof command == "object" ? command.name : command,
      color: "#f9a61a",
      fields: fields || [],
      description: `${warn} ${description}`
    });
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
    return this.new({
      title: typeof command == "object" ? command.name : command,
      color: "#f9a61a",
      fields: fields || [],
      description: `${description}`
    });
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
    return this.new({
      title: typeof command == "object" ? command.name : command,
      color: "RED",
      fields: fields || [],
      description: `${error} ${description}`
    });
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
    return this.new({
      title: typeof command == "object" ? command.name : command,
      color: "RED",
      fields: fields || [],
      description: `${description}`
    });
  }

  /**
   * Creates a pre-defined discord.js MessageEmbed and replaces some values.
   * @function inactivity
   * @param {command|string} command - The command this function is executing from.
   * @returns {Discord.MessageEmbed} The embed that was created.
   */
   inactivity(command: Types.commandData | string): Discord.MessageEmbed {
    return this.new({
      title: typeof command == "object" ? command.name : command,
      color: "RED",
      description: `${error} This prompt has timed out due to inactivity.`
    });
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
    return this.new({
      title: typeof command == "object" ? command.name : command,
      color: "BLUE",
      fields: fields || [],
      description: `${question} ${description}`
    });
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
    return this.new({
      title: typeof command == "object" ? command.name : command,
      color: "BLUE",
      fields: fields || [],
      description: `${description}`
    });
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
    return this.new({
      title: typeof command == "object" ? command.name : command,
      color: "BLUE",
      description: `${command.description}\n\u200b`,
      fields: [
        { name: "Current Setting", value: `${description}\n\u200b` },
        { name: "Usage", value: `${code}${prefix}${command.usage}${code}\u200b` },
        { name: "Usage Error", value: `You are missing required parameters needed to carry out this command.\nTo get more information, run: \`${prefix}help ${command.commandName}\`.` },
      ]
    });
  }

  /**
   * Creates a pre-defined discord.js MessageEmbed.
   * @function notComponent
   * @returns {Discord.MessageEmbed} The embed that was created.
   */
  notComponent() {
    return this.new({
      title: "Message Component",
      description: `${error} This is not your message component.`,
      color: "RED"
    });
  }

  /**
   * Creates a discord.js MessageEmbed based on the aguments provided.
   * @function helpMenu
   * @param {command} command - The command this function is executing from.
   * @param {string} prefix - The prefix of the guild.
   * @returns {Discord.MessageEmbed} The embed that was created.
   */
  helpMenu(command: Types.commandData, prefix: string): Discord.MessageEmbed {
    return this.new({
      title: `Help - ${command.name}`,
      color: "BLUE",
      description: `${command.description}\n\n**Usage**\n${code}\n${prefix}${command.usage}${code}\n**Cooldown**\n${command.cooldown == 0 ? `${client.util.messages.noCooldown}` : `${ms(command.cooldown * 1000, { long: true })} cooldown.`}`,
      fields: [
        { name: `Permissions`, value: `${command.permissions.includes("ALL") ? `${client.util.messages.noPerms}` : `${command.category == "Developer" ? `Locked to bot developer.` : `\`${command.permissions.join(" | ")}\``}`}`, inline: true },
        { name: `Bot Permissions`, value: `${command.clientPerms ? command.clientPerms[0] ? `\`${command.clientPerms.join(" | ")}\`` : client.util.messages.noPerms : client.util.messages.noPerms}`, inline: true },
        { name: `\u200b`, value: `\u200b`, inline: true },
        { name: `Aliases`, value: `${command.aliases[0] ? `\`${command.aliases.join("\`\n\`")}\`` : client.util.messages.noAlias}`, inline: true },
        { name: `Options`, value: `${command.options[0] ? `\`${command.options.join("\`\n\`")}\`` : client.util.messages.noOption}`, inline: true },
        { name: `\u200b`, value: `\u200b`, inline: true },
      ]
    });
  }

  /**
   * Creates a discord.js MessageEmbed with details on what arguments are invalid in a certain context.
   * @function invalidItem
   * @param {command|string} command - The command this function is executing from.
   * @param {string[]} items - The item(s) that are invalid.
   * @param {string[]} arg - The provided argument(s) that are invalid.
   * @returns {Discord.MessageEmbed} The embed that was created.
   */
  invalidItem(command: Types.commandData | string, items: string[], args: string[]): Discord.MessageEmbed {
    const fieldArgs = [];
    for (const [key, arg] of Object.entries(args)) {
      const string = `\`${arg}\` is not a valid ${items[key]}.`;
      fieldArgs.push(string);
    }

    return this.new({
      title: typeof command == "object" ? command.name : command,
      color: "RED",
      description: `${error} I could not record any ${items.map(i => i + "s").join(" or ")} from your message.`,
      fields: [
        { name: "Detailed Info", value: fieldArgs.join("\n") }
      ]
    });
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
    return this.new({
      title: typeof command == "object" ? command.name : command,
      color: "RED",
      description: `${error} ${content}`,
      fields: fields ? [{ name: "Detailed Info", value: fields.join("\n") }] : []
    });
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
  moderated(action: Types.caseTypes, guild: Discord.Guild | string, reason: string, duration?: number): Discord.MessageEmbed {
    let guildName = typeof guild == "object" ? guild.name : guild;
    let parsed: string = "";

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
   * @param {Types.helpCategoryInfo} info
   * @returns {Discord.MessageEmbed} The embed that was created.
   */
  helpCategory(name: string, info: Types.helpCategoryInfo): Discord.MessageEmbed {
    const category = client.category.get(name);
    const description = client.util.categoryInfo[name];
    const cmdArray = [];

    if (!Array.isArray(category)) {
      // Ticket category
      cmdArray.push({ name: info.Ticket.Basic, value: `${code}\n${category.Basic.join("\n")}${code}`, inline: true });
      cmdArray.push({ name: info.Ticket.Support, value: `${code}\n${category.Support.join("\n")}${code}`, inline: true });
      cmdArray.push({ name: info.Ticket.Admin, value: `${code}\n${category.Administrator.join("\n")}${code}`, inline: true });
    } else {
      // Normal category
      cmdArray.push({ name: info[name], value: `${code}\n${category.join("\n")}${code}`, inline: true });
      cmdArray.push({ name: "\u200b", value: `\u200b`, inline: true });
      cmdArray.push({ name: "\u200b", value: `\u200b`, inline: true });
    }

    return this.blue(`Help - ${name}`, `${description}\n\n**Command List**\nBelow shows a list of all ${name.toLowerCase()} commands.\nTo get more details about a particular command, run: \`${info.guildPrefix}help [command]\`.\nIf you would like a detailed guide on the help menu, run \`${info.guildPrefix}help guide\`.\n\n${code}${name} Commands${code}\u200b${name == "Ticket" ? info.noPanels : ``}`, cmdArray);
  }

  /**
   * Creates a discord.js MessageEmbed and replaces info fields using the data given.
   * @function itemInfo
   * @param {command|string} command - The command this function is executing from.
   * @param {string} item - The type of item.
   * @param {Object} data - Data for the item.
   * @returns {Discord.MessageEmbed} The embed that was created.
   */
  itemInfo(command: Types.commandData | string, item: string, data: Types.empty): Discord.MessageEmbed {
    const embed = this.new({
      title: typeof command == "object" ? command.name : command,
      description: "",
      color: "GREEN",
    });

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
      description: client.util.messages.errorMsgDefault,
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
    const parentCmd = command.option ? `` : command.usage.split(" ")[0] + " ";

    return this.new({
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
          value: `${command.aliases.length == 0 ? `${client.util.messages.noAlias}` : `\`${prefix}${parentCmd}${command.aliases.join(`\`\n\`${prefix}${parentCmd}`)}\``}\n\u200b`
        },
        {
          name: "Options",
          value: `${command.options.length == 0 ? `${client.util.messages.noOption}` : `\`${prefix}${cmdName} ${command.options.join(`\`\n\`${prefix}${cmdName} `)}\``}\n\u200b`
        },
        {
          name: "Usage Error",
          value: `You are missing required parameters needed to carry out this command.\nTo get more information, run \`${prefix}help ${parentCmd}${command.commandName}\`.`
        }
      ]
    });
  }
}