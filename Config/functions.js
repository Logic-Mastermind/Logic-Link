const Discord = require("discord.js");
const Buttons = require("discord-buttons");
const Fetch = require("node-fetch");
const Chalk = require("chalk");
const ms = require("ms");
const code = "```";

module.exports = class Functions {
  constructor(client) {
    this.client = client;
  }

  async sendErrorMsg(error, send, message, command, logId) {
    const whClient = new Discord.WebhookClient(`874010484234399745`, `-LA99Q0YTBlLE75xsUYw9LGuRhw4Gn7chFhx1LLyxGgUDDLahtbdFv0j0QrMrZ2UjkUa`);

    const errorId = await this.getRandomString(10);
    await this.setErrorData(error, errorId)

    var invite = null;
    if (message && command) {
      invite = await message.channel.createInvite({}, `Creating invite for evaluation because of an error in the ${command.commandName} command.`).catch(() => {});
    }

    var catcher = {
      title: `Bot Error`,
      color: `RED`,
      description: `An error has occured whilst running the \`${command ? command.commandName : `unknown`}\` command.\n${error.name.includes("Discord") ? `This error was caused by a Discord API Error which passed through user sanitization.` : `This error was caused by a human error from the command file of this command.   \u200b`}`,
      field1: {
        title: `Error Information`,
        description: `${error.name ? `**Name:** \`${error.name}\`` : ``}${error.message ? `\n**Message:** \`${error.message}\`` : ``}${error.path ? `\n**Path:** \`${error.path}\`` : ``}${error.code ? `\n**Code:** \`${error.code}\`` : ``}${error.method ? `\n**Method:** \`${error.method}\`` : ``}${error.httpStatus ? `\n**HTTP Status:** \`${error.httpStatus}\`‎` : ``}\n**Error ID:** \`${errorId}\`\n\u200b`,
      },
      field2: {
        title: `Command Information`,
        description: `${command.name ? `**Name:** \`${command.name}\`\n` : ``}${message.guild.name ? `**Guild Name:** \`${message.guild.name}\`\n` : ``}${message.author.id ? `**Sender:** <@${message.author.id}>\n` : ``}${message.channel.id ? `**Channel:** <#${message.channel.id}>\n` : ``}${invite ? `**Invite:** ${invite}` : ``}`,
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
    errorEmbed.addField(`${catcher.field1.title}`, `${catcher.field1.description}`)
    if (command) errorEmbed.addField(`${catcher.field2.title}`, `${catcher.field2.description}`)
    errorEmbed.setDescription(`${catcher.description}`)

    const stackEmbed = new Discord.MessageEmbed();
    stackEmbed.setTitle(catcher.field3.title);
    stackEmbed.setColor(catcher.color)
    stackEmbed.setDescription(catcher.field3.description);
    stackEmbed.setFooter(catcher.footer1, catcher.footer2)
    stackEmbed.setTimestamp();

    if (logId) this.client.logger.updateLog(`An unexpected error occured.`, logId);

    whClient.send({
      username: "Logic Link",
      avatarURL: this.client.user.displayAvatarURL(),
      embeds: [errorEmbed, stackEmbed]
    })
    .catch((error) => console.log(error))

    if (send) {
      if (send == true) {
        const sendEmbed = new Discord.MessageEmbed()
        .setTitle(command.name)
        .setColor(`RED`)
        .setFooter(catcher.footer1, catcher.footer2)
        .setDescription(`A fatal error has occured that prevented this command from working correctly.\nIf this issue persists, please contact the bot developer or support server.\n\n**Error ID**\n${code}${errorId}${code}`)
        .setTimestamp();

        message.channel.send(sendEmbed).catch((error) => console.log(error))
      }
    }
  }

  async sendError(error) {
    const whClient = new Discord.WebhookClient(`874010484234399745`, `-LA99Q0YTBlLE75xsUYw9LGuRhw4Gn7chFhx1LLyxGgUDDLahtbdFv0j0QrMrZ2UjkUa`);

    const catcher = {
      title: `Bot Error`,
      color: `RED`,
      description: `An unexpected error has occured.                      \u200b`,
      field1: {
        title: `Error Information`,
        description: `${error.name ? `**Name:** \`${error.name}\`` : ``}${error.message ? `\n**Message:** \`${error.message}\`` : ``}${error.path ? `\n**Path:** \`${error.path}\`` : ``}${error.code ? `\n**Code:** \`${error.code}\`` : ``}${error.method ? `\n**Method:** \`${error.method}\`` : ``}${error.httpStatus ? `\n**HTTP Status:** \`${error.httpStatus}\`‎` : ``}`,
      },
      field2: {
        title: `Error Stack`,
        description: `${code}${error.stack}${code}`,
      },
      footer1: `Logic Link - Imagine A World`,
      footer2: `https://cdn.discordapp.com/emojis/775848533298905130.png?v=1`
    }

    const errorEmbed = new Discord.MessageEmbed();
    errorEmbed.setTitle(`${catcher.title}`)
    errorEmbed.setColor(`${catcher.color}`)
    errorEmbed.addField(`${catcher.field1.title}`, `${catcher.field1.description}`)
    errorEmbed.setDescription(`${catcher.description}`)

    const stackEmbed = new Discord.MessageEmbed();
    stackEmbed.setTitle(catcher.field2.title);
    stackEmbed.setColor(catcher.color)
    stackEmbed.setDescription(catcher.field2.description);
    stackEmbed.setFooter(catcher.footer1, catcher.footer2)
    stackEmbed.setTimestamp();

    whClient.send({
      username: "Logic Link",
      avatarURL: this.client.user.displayAvatarURL(),
      embeds: [errorEmbed, stackEmbed]
    })
    .catch((error) => console.log(error))
  }

  async getNoArgs(command, guild) {
    const guildPrefix = await this.client.functions.fetchPrefix(guild);
    const noArgs = {
      title: `${command.name}`,
      color: `ORANGE`,
      description: `${command.description}\n\n**Usage**\n${code}${guildPrefix}${command.usage}${code}\n**Options**\n${command.options[0] ? `\`${guildPrefix}${command.commandName} ${command.options.join(`\n${guildPrefix}${command.commandName} `)}\`` : `No command options found.`}\n\n**Usage Error**\nYou are missing required parameters needed to carry out this command.\nTo get more information, run: \`${guildPrefix}help ${command.commandName}\`.`,
      footer1: `Logic Link - Imagine A World`,
      footer2: `https://cdn.discordapp.com/emojis/775848533298905130.png?v=1`
    }
    return noArgs
  }
  
  async findRole(filter, guild, safe) {
    var role = null;
    var found = false;

    if (!isNaN(filter)) {
      role = guild.roles.cache.get(filter);

      if (!role) role = guild.roles.cache.find(r => r.name.toLowerCase() === filter.toLowerCase());

      if (!safe) {
        if (!role) role = guild.roles.cache.filter(r => r.name.toLowerCase().includes(filter.toLowerCase()) && filter.length >= 3).forEach((value, key, map) => {
          if (found == false) {
            found = key
          }
        })
      } else {
        if (!role) role = guild.roles.cache.filter(r => r.name.toLowerCase().startsWith(filter.toLowerCase()) && filter.length >= 3).forEach((value, key, map) => {
          if (found == false) {
            found = key
          }
        })
      }
    } else {
      role = guild.roles.cache.find(r => r.name.toLowerCase() === filter.toLowerCase());

      if (!safe) {
        if (!role) role = guild.roles.cache.filter(r => r.name.toLowerCase().includes(filter.toLowerCase()) && filter.length >= 3).forEach((value, key, map) => {
          if (found == false) {
            found = key
          }
        })
      } else {
        if (!role) role = guild.roles.cache.filter(r => r.name.toLowerCase().startsWith(filter.toLowerCase()) && filter.length >= 3).forEach((value, key, map) => {
          if (found == false) {
            found = key
          }
        })
      }
    }

    if (found !== false) role = guild.roles.cache.get(found);
    return role
  }

  async findChannel(filter, guild, safe) {
    var channel = null;
    var found = false;

    if (!isNaN(filter)) {
      channel = guild.channels.cache.get(filter);

      if (!channel) channel = guild.channels.cache.find(c => c.name.toLowerCase() === filter.toLowerCase());

      if (!safe) {
        if (!channel) channel = guild.channels.cache.filter(c => c.name.toLowerCase().includes(filter.toLowerCase()) && filter.length >= 3).forEach((value, key, map) => {
          if (found == false) {
            found = key
          }
        })
      } else {
        if (!channel) channel = guild.channels.cache.filter(c => c.name.toLowerCase().startsWith(filter.toLowerCase()) && filter.length >= 3).forEach((value, key, map) => {
          if (found == false) {
            found = key
          }
        })
      }
    } else {
      channel = guild.channels.cache.find(c => c.name.toLowerCase() === filter.toLowerCase());

      if (!safe) {
        if (!channel) channel = guild.channels.cache.filter(c => c.name.toLowerCase().includes(filter.toLowerCase()) && filter.length >= 3).forEach((value, key, map) => {
          if (found == false) {
            found = key
          }
        })
      } else {
        if (!channel) channel = guild.channels.cache.filter(c => c.name.toLowerCase().startsWith(filter.toLowerCase()) && filter.length >= 3).forEach((value, key, map) => {
          if (found == false) {
            found = key
          }
        })
      }
    }

    if (found !== false) channel = guild.channels.cache.get(found);
    return channel
  }

  async findCategory(filter, guild, safe) {
    var channel = null;
    var found = false;

    if (!isNaN(filter)) {
      channel = guild.channels.cache.get(filter);

      if (!channel) channel = guild.channels.cache.find(c => c.name.toLowerCase() === filter.toLowerCase());

      if (!safe) {
        if (!channel) channel = guild.channels.cache.filter(c => c.name.toLowerCase().includes(filter.toLowerCase()) && filter.length >= 3).forEach((value, key, map) => {
          if (found == false) {
            found = key
          }
        })
      } else {
        if (!channel) channel = guild.channels.cache.filter(c => c.name.toLowerCase().startsWith(filter.toLowerCase()) && filter.length >= 3).forEach((value, key, map) => {
          if (found == false) {
            found = key
          }
        })
      }
    } else {
      channel = guild.channels.cache.find(c => c.name.toLowerCase() === filter.toLowerCase());

      if (!safe) {
        if (!channel) channel = guild.channels.cache.filter(c => c.name.toLowerCase().includes(filter.toLowerCase()) && filter.length >= 3).forEach((value, key, map) => {
          if (found == false) {
            found = key
          }
        })
      } else {
        if (!channel) channel = guild.channels.cache.filter(c => c.name.toLowerCase().startsWith(filter.toLowerCase()) && filter.length >= 3).forEach((value, key, map) => {
          if (found == false) {
            found = key
          }
        })
      }
    }

    if (found !== false) channel = guild.channels.cache.get(found);
    if (channel) {
      if (channel.type !== "category") channel = null;
    }
    return channel
  }

  async findMember(filter, guild, safe) {
    var member = null;
    var found = false;

    if (!isNaN(filter)) {
      member = guild.members.cache.get(filter);

      if (!member) member = guild.members.cache.find(m => m.user.username.toLowerCase() === filter.toLowerCase() || m.displayName.toLowerCase() == filter.toLowerCase());

      if (!safe) {
        if (!member) member = guild.members.cache.filter(m => m.user.username.toLowerCase().includes(filter.toLowerCase()) || m.displayName.toLowerCase().includes(filter.toLowerCase()) && filter.length >= 3).forEach((value, key, map) => {
          if (found == false) {
            found = key
          }
        })
      } else {
        if (!member) member = guild.members.cache.filter(m => m.user.username.toLowerCase().startsWith(filter.toLowerCase()) || m.displayName.toLowerCase().startsWith(filter.toLowerCase()) && filter.length >= 3).forEach((value, key, map) => {
          if (found == false) {
            found = key
          }
        })
      }
    } else if (filter.includes("#")) {
      member = guild.members.cache.find(m => m.user.tag.toLowerCase() == filter.toLowerCase());

      if (!member) member = guild.members.cache.find(m => m.user.username.toLowerCase() === filter.toLowerCase() || m.displayName.toLowerCase() == filter.toLowerCase());

      if (!safe) {
        if (!member) member = guild.members.cache.filter(m => m.user.username.toLowerCase().includes(filter.toLowerCase()) || m.displayName.toLowerCase().includes(filter.toLowerCase()) && filter.length >= 3).forEach((value, key, map) => {
          if (found == false) {
            found = key
          }
        })
      } else {
        if (!member) member = guild.members.cache.filter(m => m.user.username.toLowerCase().startsWith(filter.toLowerCase()) || m.displayName.toLowerCase().startsWith(filter.toLowerCase()) && filter.length >= 3).forEach((value, key, map) => {
          if (found == false) {
            found = key
          }
        })
      }
    } else {
      if (!member) member = guild.members.cache.find(m => m.user.username.toLowerCase() === filter.toLowerCase() || m.displayName.toLowerCase() == filter.toLowerCase());

      if (!safe) {
        if (!member) member = guild.members.cache.filter(m => m.user.username.toLowerCase().includes(filter.toLowerCase()) || m.displayName.toLowerCase().includes(filter.toLowerCase()) && filter.length >= 3).forEach((value, key, map) => {
          if (found == false) {
            found = key
          }
        })
      } else {
        if (!member) member = guild.members.cache.filter(m => m.user.username.toLowerCase().startsWith(filter.toLowerCase()) || m.displayName.toLowerCase().startsWith(filter.toLowerCase()) && filter.length >= 3).forEach((value, key, map) => {
          if (found == false) {
            found = key
          }
        })
      }
    }

    if (found !== false) member = guild.members.cache.get(found);
    return member
  }

  async findMemberRoles(filter, member) {
    var role = null;
    var found = false;

    if (!isNaN(filter)) {
      role = member.roles.cache.get(filter);

      if (!role) role = member.roles.cache.find(r => r.name.toLowerCase() === filter.toLowerCase());

      if (!role) role = member.roles.cache.filter(r => r.name.toLowerCase().includes(filter.toLowerCase()) && filter.length >= 3).forEach((value, key, map) => {
        if (found == false) {
          found = key
        }
      })
    } else {
      role = member.roles.cache.find(r => r.name.toLowerCase() === filter.toLowerCase());

      if (!role) role = member.roles.cache.filter(r => r.name.toLowerCase().includes(filter.toLowerCase()) && filter.length >= 3).forEach((value, key, map) => {
        if (found == false) {
          found = key
        }
      })
    }

    if (found !== false) role = member.roles.cache.get(found);
    return role
  }

  async findUser(filter, safe) {
    var user = null;
    var found = false;

    if (!isNaN(filter)) {
      user = this.client.users.fetch(filter);

      if (!user) user = this.client.users.cache.find(u => u.username.toLowerCase() === filter.toLowerCase());

      if (!user) user = this.client.users.cache.filter(u => u.username.toLowerCase().includes(filter.toLowerCase()) && filter.length >= 3).forEach((value, key, map) => {
        if (found == false) {
          found = key
        }
      })
    } else if (filter.includes("#")) {
      user = this.client.users.fetch(u => u.tag.toLowerCase() == filter.toLowerCase());

      if (!user) user = this.client.users.cache.find(u => u.username.toLowerCase() === filter.toLowerCase());

      if (!user) user = this.client.users.cache.filter(u => u.username.toLowerCase().includes(filter.toLowerCase()) && filter.length >= 3).forEach((value, key, map) => {
        if (found == false) {
          found = key
        }
      })
    } else {
      if (!user) user = this.client.users.cache.find(u => u.username.toLowerCase() === filter.toLowerCase());

      if (!user) user = this.client.users.cache.filter(u => u.username.toLowerCase().includes(filter.toLowerCase()) && filter.length >= 3).forEach((value, key, map) => {
        if (found == false) {
          found = key
        }
      })
    }

    if ((found !== false) && !safe) user = this.client.users.cache.get(found);
    return user;
  }

  async findBan(filter, guild) {
    var user = null;
    var found = false;
    var bans = await guild.fetchBans()

    if (!isNaN(filter)) {
      user = bans.get(filter);

      if (!user) user = bans.find(u => u.user.username.toLowerCase() === filter.toLowerCase());

      if (!user) user = bans.filter(u => u.user.username.toLowerCase().includes(filter.toLowerCase()) && filter.length >= 3).forEach((value, key, map) => {
        if (found == false) {
          found = key
        }
      })
    } else if (filter.includes("#")) {
      user = bans.find(u => u.tag.toLowerCase() == filter.toLowerCase());

      if (!user) user = bans.find(u => u.user.username.toLowerCase() === filter.toLowerCase());

      if (!user) user = bans.filter(u => u.user.username.toLowerCase().includes(filter.toLowerCase()) && filter.length >= 3).forEach((value, key, map) => {
        if (found == false) {
          found = key
        }
      })
    } else {
      if (!user) user = bans.find(u => u.user.username.toLowerCase() === filter.toLowerCase());

      if (!user) user = bans.filter(u => u.user.username.toLowerCase().includes(filter.toLowerCase()) && filter.length >= 3).forEach((value, key, map) => {
        if (found == false) {
          found = key
        }
      })
    }

    if (found !== false) user = await this.client.users.fetch(found);
    else if (user) user = user.user
    return user
  }

  async getTime(unsorted) {
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
        passed = true
        timeFromUnit = unsorted.match(/\d+/g);
        digit = timeFromUnit[0]

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

    return {
      "passed": passed,
      "digit": digit,
      "duration": duration,
      "display": duration ? await ms(duration, { long: true }) : null,
      "unit": unit
    }
  }

  async getRandomString(length) {
    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var result = '';
    for (var i = 0; i < length; i++) {
      result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
  }

  async getSettings(guild) {
    const settings = await this.client.db.settings.get(guild.id);
    const settingsObj = settings;

    settingsObj.modRoleObj = await guild.roles.cache.get(settingsObj.modRole);
    settingsObj.adminRoleObj = await guild.roles.cache.get(settingsObj.adminRole);
    settingsObj.logChannelObj = await guild.channels.cache.get(settingsObj.logChannel);
    settingsObj.welcomeChannelObj = await guild.channels.cache.get(settingsObj.welcomeChannel);
    settingsObj.welcomeRoleObj = await guild.roles.cache.get(settingsObj.welcomeRole);
    settingsObj.mutedRoleObj = await guild.roles.cache.get(settingsObj.mutedRole);

    return settingsObj
  }

  async getTicketData(guild) {
    const settings = await this.client.db.tsettings.get(guild.id);
    const panels = await this.client.db.panels.get(guild.id, "panels");
    const panelMap = await new Map(Object.entries(panels));

    return {
      settings: {
        dmUsers: settings.dmUsers
      },
      panels: {
        all: panelMap,
        count: panelMap.size
      },
      tickets: {
        all: null,
        count: null
      }
    }
  }

  async getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min)
  }

  async findCommand(filter) {
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

    return command
  }

  async paginate(message = {}, pages, filter = () => true, timeout = 60000) {
    if (!message.components[0].components[0] && !message.components[0].components[1]) return console.log("Message has 1 one no button components.")

    const original = await message.embeds[0];
    const collector = await message.createButtonCollector(filter, { idle: timeout });

    const button1 = message.components[0].components[0];
    const button2 = message.components[0].components[1];
    pages.unshift(original);

    var total = pages.length;
    var page = 1;

    collector.on("collect", async (button) => {
      if (!filter(button)) return button.reply.defer();

      switch (button.id) {
        case button1.custom_id:
        {
          page = page <= 1 ? page : page - 1
          await button.reply.defer()
          break;
        }
        case button2.custom_id:
        {
          page = page >= total ? page : page + 1
          await button.reply.defer()
          break;
        }
      }

      if (page <= 1) {
        button1.setDisabled();
      } else {
        button1.setDisabled(false);
      }

      if (page >= total) {
        button2.setDisabled();
      } else {
        button2.setDisabled(false);
      }

      message.edit({ embed: pages[page - 1], buttons: [button1, button2] })
    })

    collector.on("end", async (collected) => {
      await message.edit(original, null);
    })
  }

  async getArgs(args) {
    return {
      secArg: args[0],
      thirdArg: args[1],
      fourthArg: args[2],
      fifthArg: args[3]
    }
  }

  async divideChunk(array, chunk) {
    var i = null;
    var length = array.length
    var newArray = [];

    for (i = 0; i < length; i += chunk) {
      var portion = array.slice(i, i + chunk);
      newArray.push(portion);
    }

    return newArray
  }

  async log(content, option) {
    if (option) {
      if (this.client.util.chalkOptions.includes(option)) {
        console.log(Chalk[option](content))
      } else {
        return "Invalid Option"
      }
    } else {
      console.log(content)
    }
  }

  async upperFirstAll(array) {
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

  async next(channel, idObj, embeds, num) {
    const msg = await channel.send(embeds[num - 1]);
    idObj[num - 1] = msg.id;
    return idObj;
  }

  async getMemory() {
    const memory = await process.memoryUsage();
    const memUnit = {};

    for (const key in memory) {
      memUnit[key] = Math.round(memory[key] / 1024 / 1024 * 100) / 100;
    }

    return memUnit
  }

  async fetchPrefix(guild = {}) {
    const prefix = await this.client.db.settings.get(guild.id, "prefix") || null;
    return prefix;
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

  async getBadges(user) {
    const flags = await user.flags;
    const replaced = [];

    if (!flags) return ["No Badges"];
    if (flags.bitfield == 0) return ["No Badges"];

    for await (const flag of flags.toArray()) {
      if (flag == "DISCORD_EMPLOYEE") replaced.push(this.client.util.discordStaff);
      if (flag == "PARTNERED_SERVER_OWNER") replaced.push(this.client.util.partnered);
      if (flag == "HYPESQUAD_EVENTS") replaced.push(this.client.util.hypesquad);
      if (flag == "BUGHUNTER_LEVEL_1") replaced.push(this.client.util.bugHunter);
      if (flag == "BUGHUNTER_LEVEL_2") replaced.push(this.client.util.bugHunterLvl2);
      if (flag == "HOUSE_BRILLIANCE") replaced.push(this.client.util.brilliance);
      if (flag == "HOUSE_BRAVERY") replaced.push(this.client.util.bravery);
      if (flag == "HOUSE_BALANCE") replaced.push(this.client.util.balance);
      if (flag == "EARLY_SUPPORTER") replaced.push(this.client.util.earlySupporter);
      if (flag == "CERTIFIED_DISCORD_MODERATOR") replaced.push(this.client.util.certifiedMod);
      if (flag == "EARLY_VERIFIED_DEVELOPER" || flag == "VERIFIED_DEVELOPER") replaced.push(this.client.util.hypesquad);
    }

    return replaced;
  }

  async getPermissions(member) {
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
        perm = await perm.replaceAll("_", " ");
        perm = await perm.toLowerCase();

        var permSplit = await client.functions.upperFirstAll(perm.split(" "));
        perm = permSplit.join(" ");
        newPerms.push(perm);
      }
    }

    if (!newPerms[0]) newPerms.push("No Key Permissions");
    return newPerms
  }

  async getPermOverwrites(channel) {
    const overwrites = channel.permissionOverwrites;
    const everyone = channel.guild.roles.everyone;
    const compact = [];

    for await (const [key, perm] of overwrites.entries()) {
      if (key == everyone.id) continue;
      const mention = perm.type == "role" ? `<@&${key}>` : perm.type == "member" ? `<@${key}>` : `null`;
      compact.push(mention);
    }

    return compact[0] ? compact : "No Permission Overwrites";
  }

  async emojiId(emoji) {
    return emoji.split(":")[2].split(">")[0];
  }

  async upperFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}