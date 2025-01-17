const Discord = require("discord.js");
const Fetch = require("node-fetch");
const ms = require("ms");

module.exports = async (client, message) => {
  if (message.author.bot) return;
  if (!message.guild) return;

  try {
    const clientMember = message.guild.me;
    const code = `\`\`\``;

    var mentioned = false;
    var allArgs = message.content.split(/ +/g);
    var guildPrefix = await client.functions.fetchPrefix(message.guild);
    var pingPrefixes = [`<@${client.user.id}>`, `<@!${client.user.id}>`];
    var blacklistInfo = client.db.blacklists.get(message.author.id);
    var userInfo = client.db.userInfo.get(`${message.author.id}-${message.guild.id}`);
    var prefix = guildPrefix;

    if (userInfo.inPrompt == message.channel.id) return;
    if (message.author.id == client.util.devId) {
      if (message.content.startsWith(".")) prefix = ".";
      if (message.content.startsWith("-")) prefix = "-";
    }

    if (pingPrefixes.includes(allArgs[0])) {
      mentioned = true;
      prefix = allArgs[0];
    }

    if (!message.content.startsWith(prefix) && !mentioned) return;
    if (mentioned) {
      if (!allArgs[1]) {
        const embed = client.embeds.green("Greetings", `Hello, I'm Logic Link, an advanced utility/moderation bot with extremely cool commands and features.`, [{
          name: "Server Prefix",
          value: `This server's prefix is currently set to: \`${guildPrefix}\`.\nRun \`${guildPrefix}help\` for more information.`,
          inline: false
        }]);
        return message.reply({ embeds: [embed] });
      }
    }
    
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const now = Date.now();

    var commandName = args.shift().toLowerCase();
    var command = await client.functions.findCommand(commandName);
    if (!command) return;

    var cmd = client.commands.get(command.commandName);
    if (!cmd) return;

    var userCooldown = client.cooldown.get(message.author.id);
    if (!userCooldown) {
      userCooldown = new Discord.Collection();
      userCooldown.set(message.author.id, {}, "cmdSpam");
    }

    const spamData = userCooldown.cmdSpam;
    const SPAM_LIMIT = 5000;
    const SPAM_COUNT = 3;

    if (spamData) {
      const lastMsgDiff = message.createdTimestamp - spamData.lastMsgTimestamp;

      if (lastMsgDiff > SPAM_LIMIT) {
        // When a message is sent after the cooldown ends.
        clearTimeout(spamData.timer);
        client.cooldown.set(message.author.id, {
          msgCount: 1,
          lastMsgTimestamp: message.createdTimestamp,
          timer: setTimeout(() => {
            client.cooldown.delete(message.author.id, "cmdSpam");
          }, SPAM_LIMIT)
        }, "cmdSpam");
      } else {
        // When a message is sent before the cooldown ends.
        ++spamData.msgCount;

        if (spamData.msgCount == SPAM_COUNT) {
          return message.react("867955785978761266");
        } else {
          client.cooldown.set(message.author.id, spamData, "cmdSpam");
        }
      }
    } else {
      const timeout = setTimeout(() => {
        client.cooldown.delete(message.author.id, "cmdSpam");
      }, SPAM_LIMIT);

      client.cooldown.set(message.author.id, {
        msgCount: 1,
        lastMsgTimestamp: message.createdTimestamp,
        timer: timeout
      }, "cmdSpam");
    }

    if (blacklistInfo.blacklisted) {
      const embed = client.embeds.error(command, `You are currently blacklisted from using Logic Link.`, [{ name: "Reason", value: blacklistInfo.blacklisted, inline: false }]);
      return message.reply({ embeds: [embed] });
    }

    const settings = await client.functions.getSettings(message.guild);
    const tsettings = await client.functions.getTicketData(message.guild);
    const devMode = client.db.devSettings.get(client.util.devId, "devMode");
    const logId = client.logger.log(`Command ${command.commandName} ran by ${message.author.id}`, message.author);
    
    const permissionWhitelist = ["delete", "lock", "hide", "unhide", "unlock"];
    const checkBotPerms = ["addrole", "addroles", "hide", "hoist", "lock", "removerole", "removeroles", "unhide", "unhoist", "unlock", "announce", "ban", "kick", "purge", "slowmode", "nickname", "softban", "tempban", "unban", "unmute"];

    async function filterPermissions() {
      if (permissionWhitelist.includes(command.commandName)) return null;
      if (devMode && (message.author.id == client.util.devId)) return null;
      if (command.required == "none") return null;

      if (command.required == "dev") {
        if (message.author.id !== client.util.devId) {
          if (!command.permissions.includes("ALL")) {
            client.logger.updateLog(`User lacked permissions.`, logId);
            const embed = client.embeds.permission(command);
            return message.reply({ embeds: [embed] });
          }
        }
      } else if (command.required == "support") {
        if (message.member.roles.cache.has(client.util.supportRole)) return null;
        if (message.author.id == client.util.devId) return null;
        if (command.permissions.includes("ALL") || !command.permissions[0]) return null;

        client.logger.updateLog(`User lacked permissions.`, logId);
        const embed = client.embeds.permission(command);
        return message.reply({ embeds: [embed] });
        
      } else if (command.required == "ticket") {
        if (command.permissions.includes("ALL")) return null;
      }

      var hasPerms = await client.functions.hasPermission(message.member, command, message.guild);
      var hasAdminRole = message.member.roles.cache.has(settings.adminRole);
      var hasModRole = message.member.roles.cache.has(settings.modRole);

      if (!hasPerms) {
        if (hasAdminRole) return null;

        if (command.required == "mod") {
          if (hasModRole) return null;
          
          client.logger.updateLog(`User lacked permissions.`, logId);
          const embed = client.embeds.permission(command);
          return message.reply({ embeds: [embed] });

        } else if (command.required == "admin") {
          client.logger.updateLog(`User lacked permissions.`, logId);
          const embed = client.embeds.permission(command);
          return message.reply({ embeds: [embed] });

        } else if (command.required == "ticket") {
          client.logger.updateLog(`User lacked permissions.`, logId);
          const embed = client.embeds.permission(command);
          return message.reply({ embeds: [embed] });
        }
      }
    }

    const filtered = await filterPermissions();
    if (filtered) return;

    const locked = client.db.devlock.get(command.commandName, "locked");
    const lockedGuild = client.guilds.cache.get(client.db.devlock.get(command.commandName, "guild"));
    const lockedReason = client.db.devlock.get(command.commandName, "reason");

    if (message.author.id !== client.util.devId) {
      if (locked == true && lockedGuild) {
        if (message.guild.id == lockedGuild.id) {
          client.logger.updateLog(`Command was locked in the guild.`, logId);
          const embed = client.embeds.blue(`Developer Lock`, `The \`${command.commandName}\` command has been locked until further notice.${lockedReason ? `\n\n**Developer Note**\n${lockedReason}` : `\nNo further information was provied.`}`);

          return message.reply({ embeds: [embed] });
        }
      } else if (locked == true && (!lockedGuild)) {
        client.logger.updateLog(`Command was locked.`, logId);
        const embed = client.embeds.blue(`Developer Lock`, `The \`${command.commandName}\` command has been locked until further notice.${lockedReason ? `\n\n**Developer Note**\n${lockedReason}` : `\nNo further information was provided.`}`);

        return message.reply({ embeds: [embed] });
      }

      if (userCooldown) {
        if (command.commandName in userCooldown) {
          const lastUsed = client.cooldown.get(message.author.id, command.commandName) || 0;
          const expiration = lastUsed + (command.cooldown * 1000);
          const timeLeft = expiration - now;

          if (now < expiration) {
            client.logger.updateLog(`User was on cooldown for that command.`, logId);
            const embed = client.embeds.error(command, `You are on cooldown for the \`${command.commandName}\` command.`, [{
              name: "Time Left",
              value: `\`${ms(timeLeft, { long: true })}\``,
              inline: false
            }]);

            return message.reply({ embeds: [embed] });
          }
        }
      }
    }

    if (command.minArgs > 0) {
      if (!args[command.minArgs - 1]) {
        const denied = await filterPermissions();
        if (denied) return;

        client.logger.updateLog(`User did not pass enough arguments.`, logId);
        const embed = await client.embeds.noArgs(command, message.guild);
        return message.reply({ embeds: [embed] });
      }
    }

    if (checkBotPerms.includes(command.commandName)) {
      if (!clientMember.permissions.has(command.permissions)) {
        client.logger.updateLog(`Bot lacked permissions.`, logId);
        const embed = client.embeds.botPermission(command);
        return message.reply({ embeds: [embed] });
      }
    }

    var hasSupportRole = false;
    for await (const [key, val] of tsettings.panels.entries()) {
      hasSupportRole = await val.support.some((r) => message.member.roles.cache.has(r));
    }

    const extra = {
      commandName: commandName,
      allArgs: allArgs,
      mentioned: mentioned,
      logId: logId,
      hasBotSupport: message.member.roles.cache.has(client.util.supportRole),
      isDev: message.author.id == client.util.devId,
      hasSupport: hasSupportRole
    }
    
    client.logger.updateLog(`All checks were passed.`, logId);
    client.cooldown.set(message.author.id, now, command.commandName);
    cmd.run(client, message, args, command, settings, tsettings, extra);
  } catch (error) {
    client.functions.sendError(error, message, command);
  }
}