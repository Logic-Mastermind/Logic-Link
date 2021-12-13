const { REST } = require('@discordjs/rest');
const Discord = require("discord.js");
const Fetch = require("node-fetch");
const Chalk = require("chalk");
const ms = require("ms");

const code = "```";
const footer1 = `Logic Link - Imagine A World`;
const footer2 = `https://cdn.discordapp.com/emojis/775848533298905130.png?v=1`;

export default class Functions {
  constructor(client) {
    this.client = client;
  }

  async sendErrorMsg(error, message, command, logId) {
    const whClient = new Discord.WebhookClient({ url: "https://canary.discord.com/api/webhooks/874010484234399745/-LA99Q0YTBlLE75xsUYw9LGuRhw4Gn7chFhx1LLyxGgUDDLahtbdFv0j0QrMrZ2UjkUa" });

    const errorId = this.getRandomString(10);
    await this.setErrorData(error, errorId);

    var invite = null;
    if (message && command) {
      invite = await message.channel.createInvite({}, `Creating invite for evaluation because of an error in the ${command.commandName} command.`).catch(() => {});
    }

    const catcher = {
      title: `Bot Error`,
      color: `RED`,
      description: `An error has occured whilst running the \`${command.commandName}\` command.\n${error ? `${error.name ? `${error.name.includes("Discord") ? `This error originated from an invalidated request to the Discord API which was caused by.` : `This error was caused by a human error from the command file of this command.   \u200b`}` : `This error was caused by a human error from the command file of this command.   \u200b`}` : ``}`,
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

    if (logId) this.client.logger.updateLog(`An unexpected error occured.`, logId);
    message.channel.send({ embeds: [embed] }).catch((error) => console.log(error));

    whClient.send({
      username: "Logic Link",
      avatarURL: this.client.user.displayAvatarURL(),
      embeds: [embed1, embed2]
    })
    .catch((error) => console.log(error));
  }

  sendError(error) {
    const whClient = new Discord.WebhookClient({ url: "https://canary.discord.com/api/webhooks/874010484234399745/-LA99Q0YTBlLE75xsUYw9LGuRhw4Gn7chFhx1LLyxGgUDDLahtbdFv0j0QrMrZ2UjkUa"});

    const catcher = {
      title: `Bot Error`,
      color: `RED`,
      description: this.client.util.unexpectedError,
      fields: [
        {
          name: `Error Information`,
          value: `${error.name ? `**Name:** \`${error.name}\`` : ``}${error.message ? `\n**Message:** \`${error.message}\`` : ``}${error.path ? `\n**Path:** \`${error.path}\`` : ``}${error.code ? `\n**Code:** \`${error.code}\`` : ``}${error.method ? `\n**Method:** \`${error.method}\`` : ``}${error.httpStatus ? `\n**HTTP Status:** \`${error.httpStatus}\`‎` : ``}\n\u200b`,
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
      avatarURL: this.client.user.displayAvatarURL(),
      embeds: [embed1, embed2]
    })
    .catch((error) => console.log(error));
  }

  getNoArgs(command, guild) {
    const guildPrefix = this.fetchPrefix(guild);
    const noArgs = {
      title: `${command.name}`,
      color: `ORANGE`,
      description: `${command.description}\n\n**Usage**\n${code}${guildPrefix}${command.usage}${code}\n**Options**\n${command.options[0] ? `\`${guildPrefix}${command.commandName} ${command.options.join(`\n${guildPrefix}${command.commandName} `)}\`` : `No command options found.`}\n\n**Usage Error**\nYou are missing required parameters needed to carry out this command.\nTo get more information, run: \`${guildPrefix}help ${command.commandName}\`.`,
      footer1: `Logic Link - Imagine A World`,
      footer2: `https://cdn.discordapp.com/emojis/775848533298905130.png?v=1`
    }
    
    return noArgs;
  }
  
  async findRole(filter, guild, safe) {
    const filterL = filter.toLowerCase();
    const guildR = guild.roles.cache;
    if (!guildR) return null;

    var role = null;
    var found = false;

    if (!role) role = guildR.get(filter);
    if (!role) role = guildR.find(x => x.name.toLowerCase() == filterL);

    for await (const [id, role] of guildR.entries()) {
      if (filter.length < 3) break;
      var nameL = role.name.toLowerCase();
      var safeFilter = safe ? nameL.startsWith(filterL) : nameL.includes(filterL);

      if (safeFilter && filter.length >= 3) {
        found = id;
        break;
      }
    }

    if (found) role = guildR.get(found);
    if (!role) role = null;
    return role;
  }

  async findChannel(filter, guild, safe) {
    const filterL = filter.toLowerCase();
    const guildC = guild.channels.cache;
    if (!guildC) return null;

    var channel = null;
    var found = false;

    if (!channel) channel = guildC.get(filter);
    if (!channel) channel = guildC.find(x => x.name.toLowerCase() == filterL);

    for await (const [id, channel] of guildC.entries()) {
      if (filter.length < 3) break;
      var nameL = channel.name.toLowerCase();
      var safeFilter = safe ? nameL.startsWith(filterL) : nameL.includes(filterL);

      if (safeFilter) {
        found = id;
        break;
      }
    }

    if (found) channel = guildC.get(found);
    if (!channel) channel = null;
    return channel;
  }

  async findCategory(filter, guild, safe) {
    const filterL = filter.toLowerCase();
    const guildC = guild.channels.cache;
    if (!guildC) return null;

    var channel = null;
    var found = false;

    if (!channel) channel = guildC.get(filter);
    if (!channel) channel = guildC.find(x => x.name.toLowerCase() == filterL);

    for await (const [id, channel] of guildC.entries()) {
      if (filter.length < 3) break;
      if (channel.type !== "GUILD_CATEGORY") continue;

      var nameL = channel.name.toLowerCase();
      var safeFilter = safe ? nameL.startsWith(filterL) : nameL.includes(filterL);

      if (safeFilter && filter.length >= 3) {
        found = id;
        break;
      }
    }

    if (found) channel = guildC.get(found);
    if (!channel) return null;

    if (channel.type !== "GUILD_CATEGORY") return null;
    return channel;
  }

  async findMember(filter, guild, safe) {
    const filterL = filter.toLowerCase();
    const guildM = guild.members.cache;
    if (!guildM) return null;

    var member = null;
    var found = false;

    if (!member) member = guildM.get(filter);
    if (!member) member = guildM.find(x => x.displayName.toLowerCase() == filterL);
    if (!member) member = guildM.find(x => x.user.tag.toLowerCase() == filterL);

    for await (const [id, member] of guildM.entries()) {
      if (filter.length < 3) break;
      var nameL = member.displayName.toLowerCase();
      var safeFilter = safe ? nameL.startsWith(filterL) : nameL.includes(filterL);

      if (safeFilter && filter.length >= 3) {
        found = id;
        break;
      }
    }

    if (found) member = guildM.get(found);
    if (!member) member = null;
    return member;
  }

  async findMemberRoles(filter, member, safe) {
    const filterL = filter.toLowerCase();
    const memberR = member.roles.cache;
    if (!memberR) return null;

    var role = null;
    var found = false;

    if (!role) role = memberR.get(filter);
    if (!role) role = memberR.find(x => x.name.toLowerCase() == filterL);

    for await (const [id, role] of memberR.entries()) {
      if (filter.length < 3) break;
      var nameL = role.name.toLowerCase();
      var safeFilter = safe ? nameL.startsWith(filterL) : nameL.includes(filterL);

      if (safeFilter && filter.length >= 3) {
        found = id;
        break;
      }
    }

    if (found) role = memberR.get(found);
    if (!role) role = null;
    return role;
  }

  async findUser(filter, safe) {
    const filterL = filter.toLowerCase();
    const clientU = this.client.users.cache;
    if (!clientU) return null;

    var user = null;
    var found = false;

    if (!user && !isNaN(filterL)) user = clientU.get(filter) || await this.client.users.fetch(filter);
    if (!user) user = clientU.find(x => x.username.toLowerCase() == filterL);
    if (!user) user = clientU.find(x => x.tag.toLowerCase() == filterL);

    for await (const [id, user] of clientU.entries()) {
      if (filter.length < 3) break;
      if (safe) break;
      var nameL = user.username.toLowerCase();
      var safeFilter = safe ? nameL.startsWith(filterL) : nameL.includes(filterL);

      if (safeFilter && filter.length >= 3) {
        found = id;
        break;
      }
    }

    if (found) user = clientU.get(found);
    if (!user) user = null;
    return user;
  }

  async findGuild(filter, safe) {
    const filterL = filter.toLowerCase();
    const clientG = this.client.guilds.cache;
    if (!clientG) return null;

    var guild = null;
    var found = false;

    if (!guild) guild = clientG.get(filter);
    if (!guild) guild = clientG.find(x => x.name.toLowerCase() == filterL);

    for await (const [id, guild] of clientG.entries()) {
      if (filter.length < 3) break;
      var nameL = guild.name.toLowerCase();
      var safeFilter = safe ? nameL.startsWith(filterL) : nameL.includes(filterL);

      if (safeFilter && filter.length >= 3) {
        found = id;
        break;
      }
    }

    if (found) guild = clientG.get(found);
    if (!guild) guild = null;
    return guild;
  }

  async findBan(filter, guild, safe) {
    const filterL = filter.toLowerCase();
    const guildB = await guild.bans.fetch();
    const clientU = this.client.users.cache;
    if (!guildB) return null;

    var ban = null;
    var found = false;

    if (!ban) ban = guildB.get(filter);
    if (!ban) ban = guildB.find(x => x.user.username.toLowerCase() == filterL);
    if (!ban) ban = guildB.find(x => x.user.tag.toLowerCase() == filterL);

    for await (const [id, ban] of guildB.entries()) {
      if (filter.length < 3) break;
      var nameL = ban.user.username.toLowerCase();
      var safeFilter = safe ? nameL.startsWith(filterL) : nameL.includes(filterL);

      if (safeFilter && filter.length >= 3) {
        found = id;
        break;
      }
    }

    if (found) ban = clientU.get(found) || await this.client.users.fetch(found);
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

  getRandomString(length, chars) {
    var randomChars = chars || "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var result = '';
    for (var i = 0; i < length; i++) {
      result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }

    return result;
  }

  getSettings(guild) {
    const settings = this.client.db.settings.get(guild.id);
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
    const settings = this.client.db.tsettings.get(guild.id);
    const panels = this.client.db.panels.get(guild.id, "panels");
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
      if (this.client.util.chalkOptions.includes(option)) {
        console.log(Chalk[option](content))
      } else {
        return "Invalid Option";
      }
    } else {
      console.log(content);
    }
  }

  hasPermission(member, command, guild) {
    const isDev = member.id == this.client.util.devId;
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

  async setErrorData({ name, message, path, code, method, httpStatus } = null, errorId) {
    var id = errorId || await this.getRandomString(10);

    if (name) await this.client.db.errors.set(id, name, "name");
    if (message) await this.client.db.errors.set(id, message, "message");
    if (path) await this.client.db.errors.set(id, path, "path");
    if (code) await this.client.db.errors.set(id, code, "code");
    if (method) await this.client.db.errors.set(id, method, "method");
    if (httpStatus) await this.client.db.errors.set(id, httpStatus, "httpStatus");

    if (!name && !message && !path && !code && !method && !httpStatus) {
      await this.client.db.errors.set(id, null, "info");
    }

    return await this.client.db.errors.get(id);
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
    return this.client.db.settings.get(guild.id, "prefix") || null;
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
      if (flag == "DISCORD_EMPLOYEE") replaced.push(this.client.util.discordStaff);
      if (flag == "PARTNERED_SERVER_OWNER") replaced.push(this.client.util.partnered);
      if (flag == "HYPESQUAD_EVENTS") replaced.push(this.client.util.hypesquad);
      if (flag == "BUGHUNTER_LEVEL_1") replaced.push(this.client.util.bugHunter);
      if (flag == "BUGHUNTER_LEVEL_2") replaced.push(this.client.util.bugHunterLvl2);
      if (flag == "HOUSE_BRILLIANCE") replaced.push(this.client.util.brilliance);
      if (flag == "HOUSE_BRAVERY") replaced.push(this.client.util.bravery);
      if (flag == "HOUSE_BALANCE") replaced.push(this.client.util.balance);
      if (flag == "EARLY_SUPPORTER") replaced.push(this.client.util.earlySupporter);
      if (flag == "DISCORD_CERTIFIED_MODERATOR") replaced.push(this.client.util.certifiedMod);
      if (flag == "VERIFIED_BOT") replaced.push(this.client.util.verified);
      if (flag == "EARLY_VERIFIED_DEVELOPER") replaced.push(this.client.util.hypesquad);
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

      if (this.client.util.keyPerms.includes(perm)) {
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
      const id = this.client.user.id;
      const token = this.client.token;

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
    const isDev = target.id == this.client.util.devId;
    const supportRole = target.roles.cache.has(this.client.supportRole);

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

  hierarchy(initiator, target, guild) {
    const initRole = initiator.roles ? initiator.roles.highest : initiator;
    const targRole = target.roles ? target.roles.highest : target;
    const ownerId = guild.ownerId;

    const isLower = initRole.position <= targRole.position;
    const isOwner = (initiator.id == ownerId) && (target.id !== this.client.user.id);
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