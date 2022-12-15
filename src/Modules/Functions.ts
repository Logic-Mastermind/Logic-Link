import Types from "../types";
import { REST } from '@discordjs/rest';
import Discord from "discord.js";
import client from "../index";
import Chalk from "chalk";
import path from "path";
import ms from "ms";

const code = "```";
const footer1 = `Logic Link - Imagine A World`;
const footer2 = `https://cdn.discordapp.com/emojis/775848533298905130.png?v=1`;

/**
 * A class with utility methods that help standardize strenuous tasks.
 * @class Functions
 */
export default class Functions {
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
   * A function that sends an error message and logs the error.
   * @function sendErrorMsg
   * @param {Error} error - The error that was emitted.
   * @param {Discord.Message} message - The command message that caused the error.
   * @param {Types.commandData} command - The command that the function is executing from.
   * @param {number} [logId] - The logId that the command action recieved.
   * @returns {void}
   */
  sendErrorMsg(error: Types.errorData, message: Discord.Message, command: Types.commandData, logId?: number): void {
    const whClient = new Discord.WebhookClient({ url: "https://canary.discord.com/api/webhooks/874010484234399745/-LA99Q0YTBlLE75xsUYw9LGuRhw4Gn7chFhx1LLyxGgUDDLahtbdFv0j0QrMrZ2UjkUa" });

    const errorId = this.getRandomString(10);
    this.setErrorData(error, errorId);

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
      color: "RED",
      timestamp: Date.now(),
      footer: [footer1, footer2]
    }

    const msg: Types.embedData = {
      title: command.name,
      description: client.util.messages.errorMsgDefault,
      color: "RED",
      fields: [
        { name: "Error Identification", value: `${code}${errorId}${code}`, inline: false }
      ],
      timestamp: Date.now(),
      footer: [footer1, footer2]
    }

    const embed = client.embeds.new(msg);
    const embed1 = client.embeds.new(catcher);
    const embed2 = client.embeds.new(stack);

    if (logId) client.logger.updateLog(`An unexpected error occured.`, logId);
    message.channel.send({ embeds: [embed] }).catch((error) => console.log(error));

    whClient.send({
      username: "Logic Link",
      avatarURL: client.user.displayAvatarURL(),
      // @ts-ignore
      embeds: [embed1, embed2]
    })
    .catch((error) => console.log(error));
  }

  /**
   * A function that logs unexpected errors.
   * @function sendError
   * @param {Error} error - The error that was emitted.
   * @returns {void}
   */
  sendError(error: Types.errorData): void {
    const whClient = new Discord.WebhookClient({ url: "https://canary.discord.com/api/webhooks/874010484234399745/-LA99Q0YTBlLE75xsUYw9LGuRhw4Gn7chFhx1LLyxGgUDDLahtbdFv0j0QrMrZ2UjkUa"});

    const catcher: Types.embedData = {
      title: `Bot Error`,
      color: `RED`,
      description: client.util.messages.unexpectedError,
      fields: [
        {
          name: `Error Information`,
          value: `**Name:** \`${error.name}\`\n**Message:** \`${error.message}\`${error.path ? `\n**Path:** \`${error.path}\`` : ``}${error.code ? `\n**Code:** \`${error.code}\`` : ``}${error.method ? `\n**Method:** \`${error.method}\`` : ``}${error.httpStatus ? `\n**HTTP Status:** \`${error.httpStatus}\`\u200b` : ``}\n\u200b`,
          inline: false
        }
      ]
    }

    const stack: Types.embedData = {
      title: `Error Stack`,
      description: `${code}${error.stack}${code}`,
      color: "RED",
      timestamp: Date.now(),
      footer: [footer1, footer2]
    }

    const embed1 = client.embeds.new(catcher);
    const embed2 = client.embeds.new(stack);

    whClient.send({
      username: "Logic Link",
      avatarURL: client.user.displayAvatarURL(),
      embeds: [embed1, embed2]
    })
    .catch((error) => console.log(error));
  }

  /**
   * A function that returns an object of noArgs info for a specific command.
   * @function getNoArgs
   * @param {Types.commandData} command - The command.
   * @param {Discord.Guild|string} prefix - The prefix, if a guild is provided, a prefix is fetched from the database.
   * @returns {Types.embedData}
   */
  getNoArgs(command: Types.commandData, prefix: Discord.Guild | string): Types.embedData {
    let guildPrefix = typeof prefix == "string" ? prefix : this.fetchPrefix(prefix);

    return {
      title: `${command.name}`,
      color: `ORANGE`,
      description: `${command.description}\n\n**Usage**\n${code}${guildPrefix}${command.usage}${code}\n**Options**\n${command.options[0] ? `\`${guildPrefix}${command.commandName} ${command.options.join(`\n${guildPrefix}${command.commandName} `)}\`` : `No command options found.`}\n\n**Usage Error**\nYou are missing required parameters needed to carry out this command.\nTo get more information, run: \`${guildPrefix}help ${command.commandName}\`.`,
      footer: [`Logic Link - Imagine A World`, `https://cdn.discordapp.com/emojis/775848533298905130.png?v=1`]
    }
  }
  
  /**
   * Searches through all of the roles in a guild and finds one that matches the filter string.
   * @function findRole
   * @param {string} filter - The string to filter against.
   * @param {Discord.Guild|Discord.Collection} guild - The guild to get roles from, or a collection of roles.
   * @param {Object} [options] - Options for filtering.
   * @param {boolean} [options.safe] - Whether or not to check if role names start or are included in the filter.
   * @param {Function} [options.searchFilter] - A filter to test against all matched roles.
   * @returns {Discord.Role|null} The role, if it was found.
   */
  findRole(filter: string, guild: Discord.Guild | Discord.Collection<string, Discord.Role>, options?: Types.itemFilterOptions): Discord.Role | null {
    const filterL = filter.toLowerCase();
    const collection = guild instanceof Discord.Guild ? guild.roles.cache : guild;
    
    const safe = options?.safe;
    const searchFilter = options?.searchFilter;
    if (!collection) throw new Error("Invalid collection recieved");

    let role: Discord.Role;
    let found: string;

    role = collection.get(filter);
    if (!role) role = collection.find(x => x.name.toLowerCase() == filterL);

    if (!role) {
      for (const [id, item] of collection.entries()) {
        if (filter.length < 3) break;
        let nameL = item.name.toLowerCase();
        let safeFilter = safe ? nameL.startsWith(filterL) : nameL.includes(filterL);

        if (searchFilter) {
          if (!searchFilter(item)) continue;
        }

        if (safeFilter && filter.length >= 3) {
          found = id;
          break;
        }
      }
    }

    if (found) role = collection.get(found);
    if (!role) role = null;
    return role;
  }

  /**
   * Searches through all of the channels in a guild and finds one that matches the filter string.
   * @function findChannel
   * @param {string} filter - The string to filter against.
   * @param {Discord.Guild|Discord.Collection} guild - The guild to get channels from, or a collection of channels.
   * @param {Object} [options] - Options for filtering.
   * @param {boolean} [options.safe] - Whether or not to check if channel names start or are included in the filter.
   * @param {Function} [options.searchFilter] - A filter to test against all matched channels.
   * @returns {Types.guildChannel|null} The channel, if it was found.
   */
  findChannel(filter: string, guild: Discord.Guild | Discord.Collection<string, Types.guildChannel>, options?: Types.itemFilterOptions): Types.guildChannel | null {
    const filterL = filter.toLowerCase();
    const collection = guild instanceof Discord.Guild ? guild.channels.cache : guild;

    const safe = options?.safe;
    const searchFilter = options?.searchFilter;
    if (!collection) throw new Error("Invalid collection recieved");

    let channel: Types.guildChannel;
    let found: string;

    channel = collection.get(filter);
    if (!channel) channel = collection.find(x => x.name.toLowerCase() == filterL);

    if (!channel) {
      for (const [id, item] of collection.entries()) {
        if (filter.length < 3) break;
        let nameL = item.name.toLowerCase();
        let safeFilter = safe ? nameL.startsWith(filterL) : nameL.includes(filterL);

        if (searchFilter) {
          if (!searchFilter(item)) continue;
        }

        if (safeFilter) {
          found = id;
          break;
        }
      }
    }

    if (found) channel = collection.get(found);
    if (!channel) channel = null;
    return channel;
  }

  /**
   * Searches through all of the members in a guild and finds one that matches the filter string.
   * @function findMember
   * @param {string} filter - The string to filter against.
   * @param {Discord.Guild|Discord.Collection} guild - The guild to get members from, or a collection of members.
   * @param {Object} [options] - Options for filtering.
   * @param {boolean} [options.safe] - Whether or not to check if member names start or are included in the filter.
   * @param {Function} [options.searchFilter] - A filter to test against all matched members.
   * @returns {Discord.GuildMember|null} The member, if they was found.
   */
   findMember(filter: string, guild: Discord.Guild | Discord.Collection<string, Discord.GuildMember>, options?: Types.itemFilterOptions): Discord.GuildMember | null {
    const filterL = filter.toLowerCase();
    const collection = guild instanceof Discord.Guild ? guild.members.cache : guild;
    
    const safe = options?.safe;
    const searchFilter = options?.searchFilter;
    if (!collection) throw new Error("Invalid collection recieved");

    let member: Discord.GuildMember;
    let found: string;

    member = collection.get(filter);
    if (!member) member = collection.find(x => x.displayName.toLowerCase() == filterL || x.user.username.toLowerCase() == filterL || x.user.tag.toLowerCase() == filterL);

    if (!member) {
      for (const [id, item] of collection.entries()) {
        if (filter.length < 3) break;
        let nameL = item.displayName.toLowerCase();
        let safeFilter = safe ? nameL.startsWith(filterL) : nameL.includes(filterL);

        if (searchFilter) {
          if (!searchFilter(item)) continue;
        }

        if (safeFilter) {
          found = id;
          break;
        }
      }
    }

    if (found) member = collection.get(found);
    if (!member) member = null;
    return member;
  }

  /**
   * Searches through all cached users and finds one that matches the filter string.
   * @async
   * @function findUser
   * @param {string} filter - The string to filter against.
   * @param {Object} [options] - Options for filtering.
   * @param {boolean} [options.safe] - Whether or not to check if user names start or are included in the filter.
   * @param {Function} [options.searchFilter] - A filter to test against all matched users.
   * @returns {Discord.GuildMember|null} The user, if they was found.
   */
   async findUser(filter: string, options?: Types.itemFilterOptions): Promise<Discord.User | null> {
    const filterL = filter.toLowerCase();
    const collection = client.users.cache;
    const safe = options?.safe;
    const searchFilter = options?.searchFilter;

    let user: Discord.User;
    let found: string;

    user = collection.get(filter);
    if (!user) user = collection.find(x => x.username.toLowerCase() == filterL || x.tag.toLowerCase() == filterL);

    if (!user) {
      for (const [id, item] of collection.entries()) {
        if (filter.length < 3) break;
        let nameL = item.username.toLowerCase();
        let safeFilter = safe ? nameL.startsWith(filterL) : nameL.includes(filterL);

        if (searchFilter) {
          if (!searchFilter(item)) continue;
        }

        if (safeFilter) {
          found = id;
          break;
        }
      }
    }

    if (!found && !user && !isNaN(filter as any)) {
      user = await client.users.fetch(filter);
    } 

    if (found) user = collection.get(found);
    if (!user) user = null;
    return user;
  }

  /**
   * Searches through all cached guilds and finds one that matches the filter string.
   * @function findGuild
   * @param {string} filter - The string to filter against.
   * @param {Object} [options] - Options for filtering.
   * @param {boolean} [options.safe] - Whether or not to check if guild names start or are included in the filter.
   * @param {Function} [options.searchFilter] - A filter to test against all matched guilds.
   * @returns {Discord.GuildMember|null} The guild, if it was found.
   */
   findGuild(filter: string, options?: Types.itemFilterOptions): Discord.Guild | null {
    const filterL = filter.toLowerCase();
    const collection = client.guilds.cache;
    const safe = options?.safe;
    const searchFilter = options?.searchFilter;

    let guild: Discord.Guild;
    let found: string;

    guild = collection.get(filter);
    if (!guild) guild = collection.find(x => x.name.toLowerCase() == filterL);

    if (!guild) {
      for (const [id, item] of collection.entries()) {
        if (filter.length < 3) break;
        let nameL = item.name.toLowerCase();
        let safeFilter = safe ? nameL.startsWith(filterL) : nameL.includes(filterL);

        if (searchFilter) {
          if (!searchFilter(item)) continue;
        }

        if (safeFilter) {
          found = id;
          break;
        }
      }
    }

    if (found) guild = collection.get(found);
    if (!guild) guild = null;
    return guild;
  }

  /**
   * Searches through all guild bans and finds one that matches the filter string.
   * @async
   * @function findBan
   * @param {string} filter - The string to filter against.
   * @param {Discord.Guild|Discord.Collection} - The guild to get bans from, or a collection of bans.
   * @param {Object} [options] - Options for filtering.
   * @param {boolean} [options.safe] - Whether or not to check if ban usernames start or are included in the filter.
   * @param {Function} [options.searchFilter] - A filter to test against all matched bans.
   * @returns {Discord.GuildMember|null} The ban, if it was found.
   */
   async findBan(filter: string, guild: Discord.Guild | Discord.Collection<string, Discord.GuildBan>, options?: Types.itemFilterOptions): Promise<Discord.GuildBan | null> {
    const filterL = filter.toLowerCase();
    const collection = guild instanceof Discord.Guild ? await guild.bans.fetch() : guild;
    const safe = options?.safe;
    const searchFilter = options?.searchFilter;

    let ban: Discord.GuildBan;
    let found: string;

    ban = collection.get(filter);
    if (!ban) ban = collection.find(x => x.user.username.toLowerCase() == filterL || x.user.tag.toLowerCase() == filterL);

    if (!ban) {
      for (const [id, item] of collection.entries()) {
        if (filter.length < 3) break;
        let nameL = item.user.username.toLowerCase();
        let safeFilter = safe ? nameL.startsWith(filterL) : nameL.includes(filterL);

        if (searchFilter) {
          if (!searchFilter(item)) continue;
        }

        if (safeFilter) {
          found = id;
          break;
        }
      }
    }

    if (found) ban = collection.get(found);
    if (!ban) ban = null;
    return ban;
  }

  /**
   * Searches through all commands and finds one that matches the filter string.
   * @function findCommand
   * @param {string} filter - The filter to search with.
   * @returns {Types.commandData|null} The command, if it was found.
   */
   findCommand(filter: string): Types.commandData | null {
    let command = null;
    filter = filter.toLowerCase();

    function filterCommands(cmdData) {
      const aliases = cmdData.aliases || [];
      const cmdName = cmdData.commandName || "";
      if (filter == cmdName || aliases.includes(filter)) {
        command = cmdData
        return true;

      } else {
        return false;
      }
    }

    for (const category of Object.keys(client.commands)) {
      if (command) break;

      for (const [key, data] of client.commands[category].entries()) {
        if (key == "description") continue;
        if (filterCommands(data)) break;
      }
    }

    return command;
  }

  /**
   * Searches through all options from a command and finds one that matches the filter string.
   * @function findOption
   * @param {Types.commandData} command - The command to get options from.
   * @param {string} filter - The filter to search with.
   * @returns {Types.commandData|null} The option, if it was found.
   */
  findOption(command: Types.commandData, filter: string): Types.commandData | null {
    let option = null;
    filter = filter.toLowerCase();

    for (const [_, data] of Object.entries(command.option)) {
      if (filter == data.commandName || data.aliases.includes(filter)) {
        option = data;
        break;
      }
    }

    return option;
  }

  /**
   * Parses a unit and value from a time string.
   * @function getTime
   * @param {string} string - The string to parse.
   * @returns {Types.timeData} The time object.
   */
  getTime(string: string): Types.timeData {
    const endsWithAny = (suffixes, string) => suffixes.some((suffix) => string.endsWith(suffix));
    const timeUnits = {
      total: ["s", "sec", "secs", "second", "seconds", "m", "min", "mins", "minute", "minutes", "h", "hr", "hrs", "hour", "hours", "d", "dy", "dys", "day", "days", "w", "wk", "wks", "week", "weeks", "mn", "mo", "mon", "mth", "mths", "mnth", "mnths", "month", "months", "y", "yr", "yrs", "year", "years"],
      seconds: ["s", "sec", "secs", "second", "seconds"],
      minutes: ["m", "min", "mins", "minute", "minutes"],
      hours: ["h", "hr", "hrs", "hour", "hours"],
      days: ["d", "dy", "dys", "day", "days"],
      weeks: ["w", "wk", "wks", "week", "weeks"],
      months: ["mn", "mo", "mon", "mth", "mnth", "mnths", "month", "months"],
      years: ["y", "yr", "yrs", "year", "years"]
    };

    let passed = false;
    let timeFromUnit = null;
    let digit = null;
    let duration = null;
    let unit = null;
    let hasNum = /\d/.test(string);

    if (endsWithAny(timeUnits.total, string) || (!isNaN(string as any)) && (!isNaN(string.split("")[0] as any))) {
      if (hasNum) {
        passed = true;
        timeFromUnit = string.match(/[\d.]+/g);
        digit = timeFromUnit[0];

        if (endsWithAny(timeUnits.minutes, string)) {
          duration = timeFromUnit * 60000;
          unit = "minute";

        } else if (endsWithAny(timeUnits.hours, string)) {
          duration = timeFromUnit * 3600000
          unit = "hour"

        } else if (endsWithAny(timeUnits.days, string)) {
          duration = timeFromUnit * 86400000
          unit = "day"

        } else if (endsWithAny(timeUnits.weeks, string)) {
          duration = timeFromUnit * 604800000
          unit = "week"

        } else if (endsWithAny(timeUnits.months, string)) {
          duration = timeFromUnit * 2592000000
          unit = "month"

        } else if (endsWithAny(timeUnits.years, string)) {
          duration = timeFromUnit * 31536000000
          unit = "year"

        } else if (endsWithAny(timeUnits.seconds, string)) {
          duration = timeFromUnit * 1000
          unit = "second"

        } else {
          duration = timeFromUnit * 60000
          unit = "minute"
        }
      }
    }

    duration = duration ? ms(duration, { long: true }) : null;
    digit = duration ? duration.split(" ")[0] : null;
    
    return {
      "passed": passed,
      "digit": digit,
      "duration": duration ? ms(duration, { long: true }) : null,
      "display": duration,
      "unit": unit
    }
  }

  /**
   * Generates a random string from a character set.
   * @function getRandomString
   * @param {number} length - The length of the random string.
   * @param {string} [chars] - A custom character set to generate from.
   * @returns {Types.timeData} The time object.
   */
  getRandomString(length: number, chars?: string): string {
    let randomChars = chars || "abcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";

    for (let i = 0; i < length; i++) {
      result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }

    return result;
  }

  /**
   * Returns a guild settings object for a guild.
   * @function getSettings
   * @param {Discord.Guild|string} guild - The guild to get settings from.
   * @param {string} [setting] - A specific setting to to get from the guild.
   * @returns {Types.guildSettings} The guild settings.
   */
  getSettings(guild: Discord.Guild | string, setting?: string): Types.guildSettings | Types.anyGuildSetting {
    if (typeof guild === "string") guild = client.guilds.cache.get(guild);
    const settings = client.db.settings.get(guild.id);
    const settingsObj = settings;

    settingsObj.modRoleObj = guild.roles.cache.get(settingsObj.modRole);
    settingsObj.adminRoleObj = guild.roles.cache.get(settingsObj.adminRole);
    settingsObj.logChannelObj = guild.channels.cache.get(settingsObj.logChannel);
    settingsObj.welcomeChannelObj = guild.channels.cache.get(settingsObj.welcomeChannel);
    settingsObj.welcomeRoleObj = guild.roles.cache.get(settingsObj.welcomeRole);
    settingsObj.mutedRoleObj = guild.roles.cache.get(settingsObj.mutedRole);
    settingsObj.cases = new Discord.Collection(settings.cases);
    
    if (setting) return settingsObj[setting];
    return settingsObj;
  }

  /**
   * Returns a ticket data object for a guild.
   * @function getTicketData
   * @param {Discord.Guild|string} guild - The guild to get data from.
   * @returns {Types.ticketData} The ticket data object.
   */
  getTicketData(guild: Discord.Guild | string): Types.ticketSettings {
    const guildId = guild instanceof Discord.Guild ? guild.id : guild;
    const data = client.db.tickets.get(guildId);

    return {
      settings: data.settings,
      panels: new Discord.Collection(data.panels)
    }
  }

  /**
   * Generates a random integer between two numbers.
   * @function getRandomInt
   * @param {number} min - The minimum number floor.
   * @param {number} max - The maximum number ceiling.
   * @returns {number} The randomly generates integer.
   */
  getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min) + min);
  }

  /**
   * Creates an interaction collector that paginates a message with the specifies pages.
   * @function paginate
   * @param {Discord.Message} message - The message to paginate.
   * @param {Discord.MessageEmbed[]} pages - The embed pages to paginate with.
   * @param {Object} [options] - Options for the interaction collector.
   * @param {Function} [options.filter] - A filter to test against every person who clicks a button.
   * @param {number} [options.idle] - The idle time that the collector should stop after.
   * @returns {void}
   */
  paginate(message: Discord.Message, pages: Discord.MessageEmbed[], options: Types.collectorOptions): void {
    if (!message.components[0].components[1]) throw new Error("Message does not have 2 button components");

    const original = message.embeds[0];
    const { filter, idle } = options;
    const collector = message.createMessageComponentCollector({ filter: () => true, idle });

    const row = message.components[0];
    const button1 = row.components[0];
    const button2 = row.components[1];

    pages.unshift(original);
    let total = pages.length;
    let page = 1;

    collector.on("collect", async (int) => {
      if (!filter(int.user)) {
        const embed = client.embeds.notComponent();
        return int.reply({ embeds: [embed], ephemeral: true });
      }

      switch (int.customId) {
        case button1.customId:
        {
          page = page <= 1 ? page : page - 1;
          break;
        }
        case button2.customId:
        {
          page = page >= total ? page : page + 1;
          break;
        }
      }

      if (page <= 1) button1.setDisabled();
      else button1.setDisabled(false);

      if (page >= total) button2.setDisabled();
      else button2.setDisabled(false);

      row.spliceComponents(0, 2);
      row.addComponents(button1, button2);

      int.update({ embeds: [pages[page - 1]], components: [row] });
    });

    collector.on("end", async () => {
      button1.setDisabled();
      button2.setDisabled();

      const row1 = client.components.actionRow(button1, button2);
      message.edit({ embeds: [original], components: [row1] });
    });
  }

  /**
   * A function that spreads the elements of an arguments array.
   * @function getArgs
   * @param {string[]} args - The arguments to spread.
   * @returns {Types.args} The args object.
   */
  getArgs(args: string[]): Types.args {
    return {
      secArg: args[0],
      thirdArg: args[1],
      fourthArg: args[2],
      fifthArg: args[3]
    }
  }

  /**
   * A function that reads through a formatted string and returns a 2d array.
   * @function flashcard
   * @param {string} data - The formatted string to deconstruct.
   * @returns {any[]} The 2d array.
   */
  flashcard(data: string): any[] {
    let cards = data.split("\n");
    let array = [];

    for (const line of cards) {
      let part = line.split(" - ");
      array.push(part);
    }

    return array;
  }

  /**
   * Sets case data in a guild.
   * @function createCase
   * @param {Types.caseData} data - The case data for the action.
   * @param {Discord.Guild|string} guild - The guild that the action took place in.
   * @returns {void}
   */
  createCase(data: Types.caseData, guild: Discord.Guild | string): void {
    const guildId = guild instanceof Discord.Guild ? guild.id : guild;
    const cases = this.getSettings(guildId, "cases") as Discord.Collection<number, Types.caseData>;
    const caseId = cases.last() ? cases.last().id + 1 : 1;

    const key = `${data.user}-${guildId}`;
    data.id = caseId;

    cases.set(caseId, data);
    client.db.settings.set(guildId, cases, "cases");
  }

  /**
   * A function that filters moderation cases in a guild.
   * @function filterCases
   * @param {Types.cases} cases - The cases to filter.
   * @param {Types.caseDataFilter} filter - Properties to filter for.
   * @param {Types.caseTypes} [filter.type] - The type of case.
   * @param {string} [filter.user] - The user of the case.
   * @param {string} [filter.moderator] - The moderator of the case.
   * @param {string} [filter.reason] - The reason of the case.
   * @param {number} [filter.timestamp] - Filters for before or after a certain timestamp.
   * @param {"BEFORE"|"AFTER"} [filter.when] - Filters if the case has a timestamp before or after the filter.
   * @returns {Types.cases} The filtered collection of cases.
   */
  filterCases(cases: Types.caseCollection, filter: Types.caseFilter): Types.caseCollection {
    const filtered: Types.caseCollection = new Discord.Collection();
    const { type, user, moderator, reason, timestamp, when } = filter;
    
    for (const [id, c] of cases.entries()) {
      if (type) {
        if (type != c.type) continue;
      }

      if (user) {
        if (user != c.user) continue;
      }

      if (moderator) {
        if (moderator != c.moderator) continue;
      }

      if (reason) {
        if (reason != c.reason) continue;
      }

      if (timestamp && when) {
        if (when == "BEFORE") {
          if (timestamp > c.timestamp) continue;
        } else {
          if (timestamp < c.timestamp) continue;
        }
      }

      filtered.set(id, c);
    }

    return filtered;
  }

  /**
   * Divides an array every certain number of elements.
   * @function divideChunk
   * @param {any[]} array - The array to divide.
   * @param {number} chunk - The number of elements to divide the array after.
   * @returns {any[]} The chunked array.
   */
  divideChunk(array: any[], chunk: number): any[] {
    let length = array.length;
    let newArray = [];

    for (let i = 0; i < length; i += chunk) {
      let portion = array.slice(i, i + chunk);
      newArray.push(portion);
    }

    return newArray;
  }

  /**
   * Gets the command path of a command.
   * @function getCmdPath
   * @param {Types.commandData} cmd - The command to get the file path of.
   * @returns {string} The file path of the command.
   */
  getCmdPath(cmd: Types.commandData): string {
    if (cmd.category == "Ticket") return path.resolve(__dirname, `../Commands/Ticket/${cmd.subCategory}/${cmd.commandName}`);
    return path.resolve(__dirname, `../Commands/${cmd.category}/${cmd.commandName}`);
  }

  /**
   * Logs content to the console with a chalk colour option.
   * @function log
   * @param {string} content - The content of the log.
   * @param {Types.chalkOptions} [option] - The chalk option to log with.
   * @returns {void}
   */
  log(content: string, option?: Types.chalkOptions): void {
    if (option) {
      console.log(Chalk[option](content))
    } else {
      console.log(content);
    }
  }

  /**
   * Uppers the first character on every word in a sentence.
   * @function upperFirstAll
   * @param {string|string[]} sentence - The sentence.
   * @returns {string|string[]} The new sentence, returns the same type that was given as a parameter.
   */
  upperFirstAll(sentence: string | string[]): string | string[] {
    let result = [];
    let type = typeof sentence;

    if (typeof sentence == "string") sentence = sentence.split(" ");
    for (let word of sentence) {
      result.push(word.charAt(0).toUpperCase() + word.slice(1));
    }

    if (type == "string") return result.join(" ");
    return result;
  }

  /**
   * Sets data from an error into the database.
   * @function setErrorData
   * @param {Types.errorData} error - The error data.
   * @param {string} [id] - The ID of the error, a random one is generated if left empty.
   * @returns {Types.errorData}
   */
  setErrorData(error: Types.errorData, id?: string): Types.errorData {
    if (!id) id = this.getRandomString(10);
    const { name, message, path, code, method, httpStatus } = error;

    if (name) client.db.errors.set(id, name, "name");
    if (message) client.db.errors.set(id, message, "message");
    if (path) client.db.errors.set(id, path, "path");
    if (code) client.db.errors.set(id, code, "code");
    if (method) client.db.errors.set(id, method, "method");
    if (httpStatus) client.db.errors.set(id, httpStatus, "httpStatus");

    return client.db.errors.get(id);
  }

  /**
   * Gets the current memory usage data of the Node process.
   * @function getMemory
   * @returns {Types.memoryUsage}
   */
  getMemory(): Types.memoryUsage {
    const memory = process.memoryUsage();
    const memUnit: Types.memoryUsage = {};

    for (const key in memory) {
      memUnit[key] = Math.round(memory[key] / 1024 / 1024 * 100) / 100;
    }

    return memUnit;
  }

  /**
   * Fetches the prefix of a guild from the database.
   * @function fetchPrefix
   * @param {Discord.Guild|string} guild - The guild to fetch the prefix from.
   * @returns {string|null} The prefix of the guild.
   */
  fetchPrefix(guild: Discord.Guild | string): string | null {
    const guildId = guild instanceof Discord.Guild ? guild.id : guild;
    return client.db.settings.get(guildId, "prefix") || null;
  }

  /**
   * Creates a try-catch block to run function.
   * @async
   * @function tryCatch
   * @param {Function} callback - The function to be called in the try-catch block.
   * @param {any[]} params - Parameters used in the function.
   * @returns {any[]} An array, the first element being the data, and the second being an error if one was thrown.
   */
  async tryCatch(callback: Function, params: any[]): Promise<any[]> {
    try {
      let data = null;
      if (params) data = await callback(...params);
      else data = await callback();

      return [data, null];

    } catch (error) {
      return [null, error];
    }
  }

  /**
   * Gets the badges from a user and returns an array of emojis.
   * @function getBadges
   * @param {Discord.User} user - The user to get badges from.
   * @returns {string[]} An array of emojis correlating to a badge.
   */
  getBadges(user: Discord.User): string[] {
    const flags = user.flags;
    const replaced: string[] = [];
    
    for (const flag of flags.toArray()) {
      if (flag == "DISCORD_EMPLOYEE") replaced.push(client.util.emojis.discordStaff);
      if (flag == "PARTNERED_SERVER_OWNER") replaced.push(client.util.emojis.partnered);
      if (flag == "HYPESQUAD_EVENTS") replaced.push(client.util.emojis.hypesquad);
      if (flag == "BUGHUNTER_LEVEL_1") replaced.push(client.util.emojis.bugHunter);
      if (flag == "BUGHUNTER_LEVEL_2") replaced.push(client.util.emojis.bugHunterLvl2);
      if (flag == "HOUSE_BRILLIANCE") replaced.push(client.util.emojis.brilliance);
      if (flag == "HOUSE_BRAVERY") replaced.push(client.util.emojis.bravery);
      if (flag == "HOUSE_BALANCE") replaced.push(client.util.emojis.balance);
      if (flag == "EARLY_SUPPORTER") replaced.push(client.util.emojis.earlySupporter);
      //if (flag == "TEAM_USER") 
      //if (flag == "BOT_HTTP_INTERACTIONS")
      if (flag == "DISCORD_CERTIFIED_MODERATOR") replaced.push(client.util.emojis.certifiedMod);
      if (flag == "VERIFIED_BOT") replaced.push(client.util.emojis.verified);
      if (flag == "EARLY_VERIFIED_BOT_DEVELOPER") replaced.push(client.util.emojis.botDev);
    }

    if (replaced.length == 0) return ["No Badges"];
    return replaced;
  }

  /**
   * Gets a member's permissions and converts them into an array of formatted strings.
   * @function getPermissions
   * @param {Discord.GuildMember | Discord.Role} object - The member to get the permissions from.
   * @returns {string[]} The formatted permissions of the member.
   */
  getPermissions(object: Discord.GuildMember | Discord.Role): string[] {
    const permissions = object.permissions.toArray() as string[];
    const newPerms = [];

    if (permissions.includes("ADMINISTRATOR")) return ["Administrator"];
    for (let perm of permissions) {
      if (client.util.permissions.keyPerms.includes(perm)) {
        perm = perm.replaceAll("_", " ");
        newPerms.push(this.upperFirstAll(perm.toLowerCase()));
      }
    }

    if (!newPerms[0]) newPerms.push("No Key Permissions");
    return newPerms;
  }

  /**
   * Gets the permission overwrites for a channel and returns an array of formatted strings.
   * @function getPermOverwrites
   * @param {Types.guildChannel} channel - The channel to get permission overwrites for.
   * @returns {string[]} The array of mention-formatted permission overwrites.
   */
  getPermOverwrites(channel: Types.guildChannel): string[] {
    if (channel instanceof Discord.ThreadChannel) channel = channel.guild.channels.cache.get(channel.parentId) as Discord.GuildChannel;
    const overwrites = channel.permissionOverwrites.cache;
    const everyone = channel.guild.roles.everyone;
    const compact: string[] = [];

    for (const [key, perm] of overwrites.entries()) {
      if (key == everyone.id) continue;
      const mention = perm.type == "role" ? `<@&${key}>` : `<@${key}>`;
      compact.push(mention);
    }

    if (compact.length == 0) compact.push("No Permission Overwrites");
    return compact;
  }

  /**
   * Checks various factors to determine whether a user is a server admin.
   * @function isAdmin
   * @param {Discord.GuildMember} target - The user that is being checked.
   * @param {boolean} [widePermCheck] - Checks if a user has one or more permissions that are normally given to admins.
   * @returns {boolean} Whether or not the user is an admin.
   */
  isAdmin(target: Discord.GuildMember, widePermCheck?: boolean): boolean {
    const settings: Types.guildSettings = client.db.settings.get(target.guild.id);
    const isOwner = target.guild.ownerId == target.id;

    let hasPerm = target.permissions.has("ADMINISTRATOR") || target.roles.cache.has(settings.modRole);
    if (widePermCheck) hasPerm ||= client.util.permissions.modPerms.some((p: Types.adminPerms) => target.permissions.has(p));

    const devMode = client.db.devSettings.get("devMode") ? target.id == client.config.devId : false;
    return hasPerm || isOwner || devMode;
  }

  /**
   * Checks various factors to determine whether a user is a server moderator.
   * @function isMod
   * @param {Discord.GuildMember} target - The user that is being checked.
   * @param {boolean} [widePermCheck] - Checks if a user has one or more permissions that are normally given to moderators.
   * @returns {boolean} Whether or not the user is a moderator.
   */
   isMod(target: Discord.GuildMember, widePermCheck?: boolean): boolean {
    const settings: Types.guildSettings = client.db.settings.get(target.guild.id);
    const isOwner = target.guild.ownerId == target.id;

    let hasPerm = target.permissions.has("ADMINISTRATOR") || target.roles.cache.has(settings.modRole);
    if (widePermCheck) hasPerm ||= client.util.permissions.modPerms.some((p: Types.modPerms) => target.permissions.has(p));

    const devMode = client.db.devSettings.get("devMode") ? target.id == client.config.devId : false;
    return hasPerm || isOwner || devMode;
  }

  /**
   * Checks whether a user has at least one role in a guild's support panels.
   * @function hasTicketSupport
   * @param {Discord.GuildMember} target - The user to compare.
   * @returns {boolean} Whether the user has a ticket support role.
   */
  hasTicketRole(target: Discord.GuildMember, role: "Support" | "Additional"): boolean {
    const tsettings = this.getTicketData(target.guild.id);
    let hasRole = false;

    for (const [id, panel] of tsettings.panels.entries()) {
      if (panel[role.toLowerCase()].some((id) => target.roles.cache.has(id))) {
        hasRole = true;
        break;
      }
    }

    return hasRole;
  }

  /**
   * Checks if a user has the required permissions to run a command.
   * @function hasPerm
   * @param {Types.commandData} command - The command to compare with.
   * @param {Discord.GuildMember} target - The user to check permissions for.
   * @returns {boolean} Whether or not the user has the required permissions.
   */
  hasPerm(command: Types.commandData, target: Discord.GuildMember): boolean {
    //@ts-ignore
    const hasPermissions = command.permissions.some((p) => target.permissions.has(p));
    let otherPerm = false;

    if (command.category == "Administrator") otherPerm = this.isAdmin(target);
    else if (command.category == "Moderator") otherPerm = this.isMod(target);
    else if (command.category == "Developer") otherPerm = client.config.devId == target.id;
    else if (command.category == "Support") otherPerm = target.roles.cache.has(client.config.supportRole);
    else if (command.category == "General") otherPerm = true;

    else if (command.category == "Ticket") {
      const settings = this.getTicketData(target.guild.id);

      if (command.subCategory == "Administrator") otherPerm = this.isAdmin(target);
      else if (command.subCategory == "Support") otherPerm = this.hasTicketRole(target, "Support");
      else if (command.subCategory == "Basic") otherPerm = true;
    }

    if (client.db.devSettings.get("devMode")) otherPerm = target.id == client.config.devId;
    return hasPermissions || otherPerm;
  }

  /**
   * Sends an API request that overwrites the application commands globally, or locally to a guild.
   * @async
   * @function updateApplicationCommands
   * @param {Object} data - The new data.
   * @param {any[]} [guildId] - The guild to update.
   * @returns {boolean} Whether the action was successful.
   */
   async updateApplicationCommands(data: any[], guildId: string): Promise<boolean> {
    try {
      const route = `/applications/${client.user.id}/${guildId ? `guilds/${guildId}/` : ``}commands` as const;
      const rest = new REST({ version: "9" }).setToken(client.token);

      await rest.put(route, { body: data });
      return true;

    } catch (error) {
      this.sendError(error);
      return false;
    }
  }

  /**
   * A function that takes an input 'msg' and splits it every 1990 characters.
   * @function splitMessage
   * @param {string} msg - The string to be split.
   * @returns {RegExpMatchArray} An array of the split messages
   */
  splitMessage(msg: string): RegExpMatchArray  {
    return msg.match(/[\s\S]{1,1990}/g);
  }

  /**
   * Bulk deletes messages in a channel while ignoring pinned messages.
   * @async
   * @function bulkDeleteMessages
   * @param {Types.guildTextChannel} channel - The channel to bulk delete messages in.
   * @param {number} num - The number of messages to purge.
   * @returns {Promise} A promise containing a collection of messages that were deleted.
   */
  async bulkDeleteMessages(channel: Types.guildTextChannel, num: number): Promise<Discord.Collection<string, Discord.Message>> {
    const msgs = await channel.messages.fetch({ limit: num });
    for await (const [id, msg] of msgs.entries()) {
      if (msg.pinned) msgs.delete(id);
    }

    return await channel.bulkDelete(msgs, true);
  }

  /**
   * Checks whether a member or role is above another.
   * @function hierarchy
   * @param {Discord.Role|Discord.GuildMember} initiator - The member or role that is being checked.
   * @param {Discord.Role|Discord.GuildMember} target - The member or role that the initator is being compared to.
   * @returns {boolean} Whether or not the initator's role position is lower than the target's role position.
   */
  hierarchy(initiator: Discord.Role | Discord.GuildMember, target: Discord.Role | Discord.GuildMember): boolean {
    const initRole = initiator instanceof Discord.GuildMember ? initiator.roles.highest : initiator;
    const targRole = target instanceof Discord.GuildMember ? target.roles.highest : target;

    const isLower = initRole.position <= targRole.position;
    const isOwner = (initiator.id == initiator.guild.ownerId) && (target.id !== client.user.id);
    return isLower && !isOwner;
  }

  /**
   * Separates an emoji ID from an emoji string
   * @function emojiId
   * @param {string} emoji - The emoji string to get the ID of.
   * @returns {string} The ID of the emoji.
   */
  emojiId(emoji: string): string {
    return emoji.split(":")[2].split(">")[0];
  }

  /**
   * Sets the first letter in a string to uppercase.
   * @function upperFirst
   * @param {string} string - The string to modify.
   * @returns {string} The string that has been modified.
   */
  upperFirst(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  /**
   * Delays the NodeJS process for a certain number of time.
   * @function sleep
   * @param {number} ms - The duration in ms.
   * @returns {Promise<number>} A promise that resolves the number of ms elapsed.
   */
  sleep(ms: number): Promise<number> {
    return new Promise((resolve) => setTimeout(resolve, ms, ms));
  }
}