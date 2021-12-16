import Types from "../Typings/types";
import { REST } from '@discordjs/rest';
import Discord from "discord.js";
import Fetch from "node-fetch";
import client from "../index";
import Chalk from "chalk";
import ms from "ms";

const code = "```";
const footer1 = `Logic Link - Imagine A World`;
const footer2 = `https://cdn.discordapp.com/emojis/775848533298905130.png?v=1`;

/** A class with utility methods that help standardize strenuous tasks. */
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
   * @param {string} [logId] - The logId that the command action recieved.
   * @returns {void}
   */
  sendErrorMsg(error: Types.errorData, message: Discord.Message, command: Types.commandData, logId?: string): void {
    const whClient = new Discord.WebhookClient({ url: "https://canary.discord.com/api/webhooks/874010484234399745/-LA99Q0YTBlLE75xsUYw9LGuRhw4Gn7chFhx1LLyxGgUDDLahtbdFv0j0QrMrZ2UjkUa" });

    const errorId = this.getRandomString(10);
    this.setErrorData(error, errorId);

    const catcher = {
      title: `Bot Error`,
      color: `RED`,
      description: `An error has occured whilst running the \`${command.commandName}\` command.\n${error.name.includes("Discord") ? `This error was caused by a Discord API Error which passed through user filtering.` : `This error was caused by a human error from the command file of this command.   \u200b`}`,
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
      description: client.util.errorMsgDefault,
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

    const catcher = {
      title: `Bot Error`,
      color: `RED`,
      description: client.util.unexpectedError,
      fields: [
        {
          name: `Error Information`,
          value: `**Name:** \`${error.name}\`\n**Message:** \`${error.message}\`${error.path ? `\n**Path:** \`${error.path}\`` : ``}${error.code ? `\n**Code:** \`${error.code}\`` : ``}${error.method ? `\n**Method:** \`${error.method}\`` : ``}${error.httpStatus ? `\n**HTTP Status:** \`${error.httpStatus}\`\u200b` : ``}\n\u200b`,
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

    const embed1 = new Discord.MessageEmbed(catcher);
    const embed2 = new Discord.MessageEmbed(stack);

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
    var guildPrefix = typeof prefix == "string" ? prefix : this.fetchPrefix(prefix);

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
  findRole(filter: string, guild: Discord.Guild | Discord.Collection, options?: Types.itemFilterOptions): Discord.Role | null {
    const filterL = filter.toLowerCase();
    const collection = guild instanceof Discord.Guild ? guild.roles.cache : guild;
    const { safe, searchFilter } = options;
    if (!collection) throw new Error("Invalid collection recieved");

    var role: Discord.Role;
    var found: string;

    role = collection.get(filter);
    if (!role) role = collection.find(x => x.name.toLowerCase() == filterL);

    if (!role) {
      for (const [id, role] of collection.entries()) {
        if (filter.length < 3) break;
        let nameL = role.name.toLowerCase();
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
   * @returns {Discord.GuildChannel|null} The channel, if it was found.
   */
  findChannel(filter: string, guild: Discord.Guild | Discord.Collection, options?: Types.itemFilterOptions): Discord.GuildChannel | null {
    const filterL = filter.toLowerCase();
    const collection = guild instanceof Discord.Guild ? guild.channels.cache : guild;
    const { safe, searchFilter } = options;
    if (!collection) throw new Error("Invalid collection recieved");

    var channel: Discord.GuildChannel;
    var found: string;

    channel = collection.get(filter);
    if (!channel) channel = collection.find(x => x.name.toLowerCase() == filterL);

    if (!channel) {
      for (let [id, item] of collection.entries()) {
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
   findMember(filter: string, guild: Discord.Guild | Discord.Collection, options?: Types.itemFilterOptions): Discord.Member | null {
    const filterL = filter.toLowerCase();
    const collection = guild instanceof Discord.Guild ? guild.members.cache : guild;
    const { safe, searchFilter } = options;
    if (!collection) throw new Error("Invalid collection recieved");

    var member: Discord.GuildMember;
    var found: string;

    member = collection.get(filter);
    if (!member) member = collection.find(x => x.displayName.toLowerCase() == filterL || x.user.username.toLowerCase() == filterL || x.user.tag.toLowerCase() == filterL);

    if (!member) {
      for (let [id, item] of collection.entries()) {
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
    const { safe, searchFilter } = options;

    var user: Discord.User;
    var found: string;

    user = collection.get(filter);
    if (!user) user = collection.find(x => x.username.toLowerCase() == filterL || x.tag.toLowerCase() == filterL);

    if (!user) {
      for (let [id, item] of collection.entries()) {
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

    if (!found && !user && !isNaN(filter)) {
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
    const { safe, searchFilter } = options;

    var guild: Discord.Guild;
    var found: string;

    guild = collection.get(filter);
    if (!guild) guild = collection.find(x => x.name.toLowerCase() == filterL);

    if (!guild) {
      for (let [id, item] of collection.entries()) {
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
   * @function findBan
   * @param {string} filter - The string to filter against.
   * @param {Discord.Guild|Discord.Collection} - The guild to get bans from, or a collection of bans.
   * @param {Object} [options] - Options for filtering.
   * @param {boolean} [options.safe] - Whether or not to check if ban usernames start or are included in the filter.
   * @param {Function} [options.searchFilter] - A filter to test against all matched bans.
   * @returns {Discord.GuildMember|null} The ban, if it was found.
   */
   async findBan(filter: string, guild: Discord.Guild | Discord.Collection, options?: Types.itemFilterOptions): Discord.GuildBan | null {
    const filterL = filter.toLowerCase();
    const collection = guild instanceof Discord.Guild ? await guild.bans.fetch() : guild;
    const { safe, searchFilter } = options;

    var ban: Discord.Guild;
    var found: string;

    ban = collection.get(filter);
    if (!ban) ban = collection.find(x => x.user.username.toLowerCase() == filterL || x.user.tag.toLowerCase() == filterL);

    if (!ban) {
      for (let [id, item] of collection.entries()) {
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

  getTime(unsorted) {
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

    var passed = false;
    var timeFromUnit = null;
    var digit = null;
    var duration = null;
    var unit = null;
    var hasNum = /\d/.test(unsorted);

    if (endsWithAny(timeUnits.total, unsorted) || (!isNaN(unsorted)) && (!isNaN(unsorted.split("")[0]))) {
      if (hasNum) {
        passed = true;
        timeFromUnit = unsorted.match(/[\d.]+/g);
        digit = timeFromUnit[0];

        if (endsWithAny(timeUnits.minutes, unsorted)) {
          duration = timeFromUnit * 60000;
          unit = "minute";

        } else if (endsWithAny(timeUnits.hours, unsorted)) {
          duration = timeFromUnit * 3600000
          unit = "hour"

        } else if (endsWithAny(timeUnits.days, unsorted)) {
          duration = timeFromUnit * 86400000
          unit = "day"

        } else if (endsWithAny(timeUnits.weeks, unsorted)) {
          duration = timeFromUnit * 604800000
          unit = "week"

        } else if (endsWithAny(timeUnits.months, unsorted)) {
          duration = timeFromUnit * 2592000000
          unit = "month"

        } else if (endsWithAny(timeUnits.years, unsorted)) {
          duration = timeFromUnit * 31536000000
          unit = "year"

        } else if (endsWithAny(timeUnits.seconds, unsorted)) {
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

  getRandomString(length, chars?) {
    var randomChars = chars || "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var result = '';
    for (var i = 0; i < length; i++) {
      result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }

    return result;
  }

  getSettings(guild) {
    const settings = client.db.settings.get(guild.id);
    const settingsObj = settings;

    settingsObj.modRoleObj = guild.roles.cache.get(settingsObj.modRole);
    settingsObj.adminRoleObj = guild.roles.cache.get(settingsObj.adminRole);
    settingsObj.logChannelObj = guild.channels.cache.get(settingsObj.logChannel);
    settingsObj.welcomeChannelObj = guild.channels.cache.get(settingsObj.welcomeChannel);
    settingsObj.welcomeRoleObj = guild.roles.cache.get(settingsObj.welcomeRole);
    settingsObj.mutedRoleObj = guild.roles.cache.get(settingsObj.mutedRole);
    settingsObj.cases = new Discord.Collection(settings.cases);

    return settingsObj;
  }

  getTicketData(guild) {
    const settings = client.db.tsettings.get(guild.id);
    const panels = client.db.panels.get(guild.id, "panels");
    const panelMap = new Discord.Collection(panels);

    return {
      settings,
      panels: panelMap
    }
  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }

  findCommand(filter) {
    var command = null;
    var client = this.client;
    var alias = client.command.aliases[filter];
    if (alias) filter = alias;
    
    for (const [name, info] of Object.entries(client.command.general)) {
      if (command) break;
      if (filter == info.commandName || info.aliases.includes(filter)) {
        command = info;
        break;
      }
    }

    for (const [name, info] of Object.entries(client.command.administrator)) {
      if (command) break;
      if (filter == info.commandName || info.aliases.includes(filter)) {
        command = info;
        break;
      }
    }

    for (const [name, info] of Object.entries(client.command.moderator)) {
      if (command) break;
      if (filter == info.commandName || info.aliases.includes(filter)) {
        command = info;
        break;
      }
    }

    for (const [name, info] of Object.entries(client.command.developer)) {
      if (command) break;
      if (filter == info.commandName || info.aliases.includes(filter)) {
        command = info;
        break;
      }
    }

    for (const [name, info] of Object.entries(client.command.support)) {
      if (command) break;
      if (filter == info.commandName || info.aliases.includes(filter)) {
        command = info;
        break;
      }
    }

    for (const [name, info] of Object.entries(client.command.ticket)) {
      if (command) break;
      
      if (filter == info.commandName || info.aliases.includes(filter)) {
        command = info;
        break;
      }
    }

    return command;
  }

  findOption(command, filter) {
    var option = null;
    for (const [name, info] of Object.entries(command.option)) {
      if (filter == info.commandName || info.aliases.includes(filter)) {
        option = info;
        break;
      }
    }

    return option;
  }

  async paginate(message = {}, pages, pFilter = () => true, timeout = 60000) {
    if (!message.components[0].components[1]) throw new Error("Message does not have 2 button components");

    const client = this.client;
    const original = message.embeds[0];
    const collector = message.createMessageComponentCollector({ filter: () => true, idle: timeout });

    const row = message.components[0];
    const button1 = row.components[0];
    const button2 = row.components[1];

    pages.unshift(original);
    var total = pages.length;
    var page = 1;

    collector.on("collect", async (int) => {
      if (!pFilter(int.user)) {
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

      const row1 = client.buttons.actionRow([button1, button2]);
      message.edit({ embeds: [original], components: [row1] });
    });
  }

  getArgs(args) {
    return {
      secArg: args[0],
      thirdArg: args[1],
      fourthArg: args[2],
      fifthArg: args[3]
    }
  }

  createCase(data, settings, guild) {
    const client = this.client;
    const caseId = settings.cases.last() ? settings.cases.last().id + 1 : 1;
    const key = `${data.user}-${guild.id}`;
    data.id = caseId;

    var cases = settings.cases.set(caseId, data);
    client.db.settings.set(guild.id, cases, "cases");
  }

  filterCases(cases, user, warns) {
    user = user.id || user;
    const filtered = new Discord.Collection();
    
    for (const [id, c] of cases.entries()) {
      if (c.user !== user) continue;
      if (warns) {
        if (c.type !== "WARN") continue;
      }

      filtered.set(id, c);
    }

    return filtered;
  }

  divideChunk(array, chunk) {
    var i = null;
    var length = array.length;
    var newArray = [];

    for (i = 0; i < length; i += chunk) {
      var portion = array.slice(i, i + chunk);
      newArray.push(portion);
    }

    return newArray;
  }

  getCmdPath(cmd) {
    if (cmd.category !== "Ticket") return `/home/runner/Logic-Link/Commands/${cmd.category}/${cmd.commandName}.js`
    return `/home/runner/Logic-Link/Commands/Ticket/${cmd.subCategory}/${cmd.commandName}.js`
  }

  log(content, option) {
    if (option) {
      if (client.util.chalkOptions.includes(option)) {
        console.log(Chalk[option](content))
      } else {
        return "Invalid Option";
      }
    } else {
      console.log(content);
    }
  }

  hasPermission(member, command, guild) {
    const isDev = member.id == client.util.devId;
    const devCmd = command.required == "dev";
    const perms = devCmd ? isDev : command.permissions.some(p => member.permissions.has(p));
    const isOwner = guild.ownerId == member.id;

    return perms || isOwner;
  }

  upperFirstAll(array) {
    var newArray = [];
    for (var word of array) {
      newArray.push(word.charAt(0).toUpperCase() + word.slice(1));
    }

    return newArray;
  }

  setErrorData({ name, message, path, code, method, httpStatus } = null, errorId) {
    var id = errorId || this.getRandomString(10);

    if (name) client.db.errors.set(id, name, "name");
    if (message) client.db.errors.set(id, message, "message");
    if (path) client.db.errors.set(id, path, "path");
    if (code) client.db.errors.set(id, code, "code");
    if (method) client.db.errors.set(id, method, "method");
    if (httpStatus) client.db.errors.set(id, httpStatus, "httpStatus");

    if (!name && !message && !path && !code && !method && !httpStatus) {
      client.db.errors.set(id, null, "info");
    }

    return client.db.errors.get(id);
  }

  async next(channel, obj, embeds, num) {
    const msg = await channel.send({ embeds: [embeds[num - 1]] });
    Object.defineProperty(obj, num - 1, {
      value: msg.id
    });
  }

  async getMemory() {
    const memory = await process.memoryUsage();
    const memUnit = {};

    for (const key in memory) {
      memUnit[key] = Math.round(memory[key] / 1024 / 1024 * 100) / 100;
    }

    return memUnit
  }

  fetchPrefix(guild = {}) {
    return client.db.settings.get(guild.id, "prefix") || null;
  }

  async tryCatch(callback, params) {
    try {
      var data = null;
      if (params) data = await callback(...params);
      else data = await callback();

      return [data, null];

    } catch (error) {
      return [null, error];
    }
  }

  getBadges(user) {
    const flags = user.flags;
    const noBadges = ["No Badges"];
    const replaced = [];

    if (!flags) return noBadges;
    if (flags.bitfield == 0) return noBadges;

    for (const flag of flags.toArray()) {
      if (flag == "DISCORD_EMPLOYEE") replaced.push(client.util.discordStaff);
      if (flag == "PARTNERED_SERVER_OWNER") replaced.push(client.util.partnered);
      if (flag == "HYPESQUAD_EVENTS") replaced.push(client.util.hypesquad);
      if (flag == "BUGHUNTER_LEVEL_1") replaced.push(client.util.bugHunter);
      if (flag == "BUGHUNTER_LEVEL_2") replaced.push(client.util.bugHunterLvl2);
      if (flag == "HOUSE_BRILLIANCE") replaced.push(client.util.brilliance);
      if (flag == "HOUSE_BRAVERY") replaced.push(client.util.bravery);
      if (flag == "HOUSE_BALANCE") replaced.push(client.util.balance);
      if (flag == "EARLY_SUPPORTER") replaced.push(client.util.earlySupporter);
      if (flag == "DISCORD_CERTIFIED_MODERATOR") replaced.push(client.util.certifiedMod);
      if (flag == "VERIFIED_BOT") replaced.push(client.util.verified);
      if (flag == "EARLY_VERIFIED_DEVELOPER") replaced.push(client.util.hypesquad);
    }

    if (!replaced[0]) return noBadges;
    return replaced;
  }

  getPermissions(member) {
    const unsPerms = member.permissions ? member.permissions.toArray() : [null];
    const client = this.client;
    const newPerms = [];

    for (var perm of unsPerms) {
      if (unsPerms[0] == null) {
        newPerms.push("No Permissions");
        break;
      }

      if (unsPerms.includes("ADMINISTRATOR")) {
        newPerms.push("Administrator");
        break;
      }

      if (client.util.keyPerms.includes(perm)) {
        perm = perm.replaceAll("_", " ");
        perm = perm.toLowerCase();

        var permSplit = client.functions.upperFirstAll(perm.split(" "));
        perm = permSplit.join(" ");
        newPerms.push(perm);
      }
    }

    if (!newPerms[0]) newPerms.push("No Key Permissions");
    return newPerms
  }

  getPermOverwrites(channel) {
    if (channel.type.endsWith("THREAD")) channel = channel.guild.channels.cache.get(channel.parentId);
    const overwrites = channel.permissionOverwrites.cache;
    const everyone = channel.guild.roles.everyone;
    const compact = [];

    for (const [key, perm] of overwrites.entries()) {
      if (key == everyone.id) continue;
      const mention = perm.type == "role" ? `<@&${key}>` : perm.type == "member" ? `<@${key}>` : `null`;
      compact.push(mention);
    }

    return compact[0] ? compact : "No Permission Overwrites";
  }

  isAdmin(target, guild, settings, noRole) {
    const hasPerm = target.permissions.has("ADMINISTRATOR");
    const hasRole = !noRole ? target.roles.cache.has(settings.adminRole) : null;
    const isOwner = guild.ownerId == target.id;

    const client = this.client;
    const devMode = client.db.devSettings.get(client.util.devId, "devMode") ? target.id == client.util.devId : false;

    return hasPerm || hasRole || isOwner || devMode;
  }

  isMod(target, guild, settings, noRole) {
    const hasPerm = target.permissions.has("ADMINISTRATOR");
    const hasMod = !noRole ? target.roles.cache.has(settings.modRole) : null;
    const hasAdmin = !noRole ? target.roles.cache.has(settings.adminRole) : null;
    const isOwner = guild.ownerId == target.id;

    const client = this.client;
    const devMode = client.db.devSettings.get(client.util.devId, "devMode") ? target.id == client.util.devId : false;

    return hasPerm || hasMod || hasAdmin || isOwner || devMode;
  }

  async updateApplicationCommands(data, guildId) {
    try {
      const id = client.user.id;
      const token = client.token;

      const route = `/applications/${id}/${guildId ? `guilds/${guildId}/` : ``}commands`;
      const rest = new REST({ version: "9" }).setToken(token);
      await rest.put(route, { body: data });
      return true;

    } catch (error) {
      this.sendError(error);
      return false;
    }
  }

  hasPerm(command, target, guild, settings, supRole) {
    const perm = command.required || command;
    const perms = command.permissions || command;
    const isDev = target.id == client.util.devId;
    const supportRole = target.roles.cache.has(client.supportRole);

    const client = this.client;
    const devMode = client.db.devSettings.get(client.util.devId, "devMode") ? target.id == client.util.devId : false;

    const isAdmin = this.isAdmin(target, guild, settings);
    const isMod = this.isMod(target, guild, settings);
    var hasPerm = false;

    if (perm == "admin") {
      if (isAdmin || target.permissions.has(perms)) hasPerm = true;

    } else if (perm == "mod") {
      if (isMod || target.permissions.has(perms)) hasPerm = true;

    } else if (perm == "dev") {
      if (isDev) hasPerm = true;

    } else if (perm == "ticket") {
      if (command.subCategory == "Administrator") {
        if (isAdmin || target.permissions.has(perms)) hasPerm = true;

      } else if (command.subCategory == "Support") {
        if (isAdmin || supRole) hasPerm = true;
      }
    } else if (perm == "support") {
      if (supportRole) hasPerm = true;
      
    } else if (perm == "none") {
      hasPerm = true;

    } else {
      if (supRole == "admin") {
        if (isAdmin || target.permissions.has(perms)) hasPerm = true;

      } else if (supRole == "mod") {
        if (isMod || target.permissions.has(perms)) hasPerm = true;

      } else {
        if (target.permissions.has(perms)) hasPerm = true;
      }
    }

    return hasPerm || devMode;
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
   * @function bulkDeleteMessages
   * @param {Discord.BaseGuildTextChannel} channel - The channel to bulk delete messages in.
   * @param {number} num - The number of messages to purge.
   * @returns {Promise} A promise containing a collection of messages that were deleted.
   */
  async bulkDeleteMessages(channel, num): Promise<Discord.Collection<string, Discord.Message>> {
    const msgs = await channel.messages.fetch({ limit: num });
    for await (const [id, msg] of msgs.entries()) {
      if (msg.pinned) msgs.delete(id);
    }

    return await channel.bulkDelete(msgs, true);
  }

  hierarchy(initiator, target, guild) {
    const initRole = initiator.roles ? initiator.roles.highest : initiator;
    const targRole = target.roles ? target.roles.highest : target;
    const ownerId = guild.ownerId;

    const isLower = initRole.position <= targRole.position;
    const isOwner = (initiator.id == ownerId) && (target.id !== client.user.id);
    var lower = false;

    if (isLower && !isOwner) lower = true;
    return lower;
  }

  validPerms(test, array) {
    return test.every(x => array.includes(x));
  }

  emojiId(emoji) {
    return emoji.split(":")[2].split(">")[0];
  }

  upperFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}