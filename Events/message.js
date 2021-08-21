const Discord = require("discord.js");
const Buttons = require("discord-buttons");
const Prefix = require("discord-prefix");
const Reply = require("discord-reply");
const ms = require("ms");

module.exports = async (client, message) => {
  if (message.author.bot) return;
  if (!message.guild) return;

  try {
    const clientMember = message.guild.me;
    const code = `\`\`\``;

    var guildPrefix = Prefix.getPrefix(message.guild.id);
    if (!guildPrefix) {
      Prefix.setPrefix(client.util.defaultPrefix, message.guild.id);
      client.db.settings.set(message.guild.id, client.util.defaultPrefix, "prefix");
      guildPrefix = client.util.defaultPrefix;
    }

    var mentioned = false;
    var prefix = guildPrefix;
    var allArgs = message.content.split(/ +/g);
    var pingPrefixes = [`<@${client.user.id}>`, `<@!${client.user.id}>`];
    var blacklistInfo = client.db.blacklists.get(message.author.id);

    if (blacklistInfo.blacklisted) {
      const embed = client.embeds.error(command, `You are currently blacklisted from using Logic Link.\n\n**Reason**\n${blacklistInfo.reason}`);
      return message.lineReply(embed);
    }

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
        const embed = client.embeds.blue("Server Prefix", `This server's prefix is currently set to: \`${guildPrefix}\`.\nRun \`${guildPrefix}help\` for more information.`);
        return message.lineReply(embed);
      }
    }
    
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const now = Date.now();

    var commandName = args.shift().toLowerCase();
    var command = await client.functions.findCommand(commandName);
    if (!command) return;

    var cmd = client.commands.get(command.commandName);
    if (!cmd) return;

    const settings = await client.functions.getSettings(message.guild);
    const tsettings = await client.functions.getTicketData(message.guild);
    const devMode = client.db.devSettings.get(client.util.devId, "devMode");
    const logId = await client.logger.log(`${message.author.tag} ran the ${command.commandName} command.`);
    
    const hasPermission = (arr1, arr2) => arr1.some((e) => arr2.includes(e))
    const permissionWhitelist = ["delete", "lock", "hide", "unhide", "unlock"];

    async function filterPermissions() {
      if (permissionWhitelist.includes(command.commandName)) return null;
      if (devMode && (message.author.id == client.util.devId)) return null;
      if (command.required == "none") return null;

      if (command.required == "dev") {
        if (message.author.id !== client.util.devId) {
          await client.logger.updateLog(`User lacked permissions.`, logId);
          const embed = client.embeds.permission(command);
          return message.lineReply(embed);
        }
      } else if (command.required == "support") {
        if (message.member.roles.cache.has(client.util.supportRole)) return null;
        if (message.author.id == client.util.devId) return null;
        if (command.permissions.includes("ALL")) return null;

        if (message.guild.id !== client.util.supportServer) {
          await client.logger.updateLog(`Not in support server.`, logId);
          const embed = client.embeds.red(command, `This command is only available in the bot's support server.\nUse the \`${guildPrefix}invite\` command to join it.`);
          return message.lineReply(embed);

        } else {
          await client.logger.updateLog(`User lacked permissions.`, logId);
          const embed = client.embeds.permission(command);
          return message.lineReply(embed);
        }
      } else if (command.required == "ticket") {
        if (command.permissions.includes("ALL")) return null;
      }

      var hasPerms = await hasPermission(message.member.permissions.toArray(), command.permissions);
      var hasAdminRole = message.member.roles.cache.has(settings.adminRole);
      var hasModRole = message.member.roles.cache.has(settings.modRole);

      if (!hasPerms) {
        if (hasAdminRole) return null;

        if (command.required == "mod") {
          if (hasModRole) return null;
          
          await client.logger.updateLog(`User lacked permissions.`, logId);
          const embed = client.embeds.permission(command);
          return message.lineReply(embed);

        } else if (command.required == "admin") {
          await client.logger.updateLog(`User lacked permissions.`, logId);
          const embed = client.embeds.permission(command);
          return message.lineReply(embed);

        } else if (command.required == "ticket") {
          await client.logger.updateLog(`User lacked permissions.`, logId);
          const embed = client.embeds.permission(command);
          return message.lineReply(embed);
        }
      }
    }

    const filtered = await filterPermissions();
    if (filtered) return

    if (message.author.id !== client.util.devId) {
      const locked = client.db.devlock.get(command.commandName, "locked");
      const lockedGuild = client.guilds.cache.get(client.db.devlock.get(command.commandName, "guild"));
      const lockedReason = client.db.devlock.get(command.commandName, "reason");
      const userCooldown = client.db.cooldown.get(message.author.id);

      if (locked == true && lockedGuild) {
        if (message.guild.id == lockedGuild.id) {
          await client.logger.updateLog(`Command was locked in the guild.`, logId);
          const lockedEmbed = client.embeds.new(`Developer Lock`, `The \`${command.commandName}\` command has been locked until further notice.${lockedReason ? `\n\n**Developer Note**\n${lockedReason}` : `\nNo further information was provied.`}`, `BLUE`, client.util.footer1, client.util.footer2, true)

          return message.lineReply(lockedEmbed)
        }
      } else if (locked == true && (!lockedGuild)) {
        await client.logger.updateLog(`Command was locked.`, logId);
        const lockedEmbed = client.embeds.new(`Developer Lock`, `The \`${command.commandName}\` command has been locked until further notice.${lockedReason ? `\n\n**Developer Note**\n${lockedReason}` : `\nNo further information was provided.`}`, `BLUE`, client.util.footer1, client.util.footer2, true)

        return message.lineReply(lockedEmbed)
      }

      if (userCooldown) {
        if (command.commandName in userCooldown) {
          const lastUsed = client.db.cooldown.get(message.author.id, command.commandName);
          const expiration = lastUsed + (command.cooldown * 1000);
          const timeLeft = expiration - now;

          if (now < expiration) {
            await client.logger.updateLog(`User was on cooldown for that command.`, logId);
            const cooldownEmbed = client.embeds.error(command, `You are on cooldown for the \`${command.commandName}\` command.\nYou currently need to wait \`${ms(timeLeft, { long: true })}\` before running this command again.`);

            return message.lineReply(cooldownEmbed)
          }
        }
      }
    }

    if (command.minArgs > 0) {
      if (!args[command.minArgs - 1]) {
        const denied = await filterPermissions();
        if (denied) return;

        await client.logger.updateLog(`User did not give enough arguments.`, logId);
        const embed = client.embeds.noArgs(command, message.guild);
        return message.lineReply(embed);
      }
    }

    const extra = {
      commandName: commandName,
      allArgs: allArgs,
      mentioned: mentioned
    }

    await client.logger.updateLog(`User passed through into the command file.`, logId);
    await client.db.cooldown.set(message.author.id, now, command.commandName);

    cmd.run(client, message, args, command, settings, tsettings, extra);
  } catch (error) {
    client.functions.sendError(error, true, message, command);
  }
}