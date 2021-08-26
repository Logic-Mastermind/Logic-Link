const Discord = require("discord.js");
const Buttons = require("discord-buttons");
const Fetch = require("node-fetch");

exports.run = async (client, message, args, command, settings, tsettings, extra) => {
  const clientMember = message.guild.me;
  const guildPrefix = await client.functions.fetchPrefix(message.guild);
  
  const noArgs = await client.functions.getNoArgs(command, message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = await client.functions.getArgs(args);
  const code = `\`\`\``;

  const responses = {
    bug: `This command contains some issues that prevent it from working correctly.`,
    security: `This command is currently under investigation for possible security risks.`,
    development: `This command is currently in development.`
  }

  try {
    var guild = false
    var lockedCommand = secArg;
    var lockedGuild = thirdArg;
    var reason = args.slice(1).join(" ");

    if (!isNaN(lockedGuild)) reason = args.slice(2).join(" ");
    if (client.command.aliases[lockedCommand]) lockedCommand = client.command.aliases[lockedCommand];

    if (client.commands.has(lockedCommand)) {
      const cmdData = client.db.devlock.get(lockedCommand)
      if (reason) {
        if (reason == "bug" || reason == "buggy" || reason == "security" || reason == "sec" || reason == "development" || reason == "dev") {
          if (reason == "bug" || reason == "buggy") reason = responses.bug
          if (reason == "security" || reason == "sec") reason = responses.security
          if (reason == "development" || reason == "dev") reason = responses.development
        }
      } else {
        reason = "No reason was provided."
      }

      if (!isNaN(lockedGuild)) {
        guild = client.guilds.cache.get(lockedGuild)
        
        if (!guild) {
          const errorEmbed = client.embeds.error(command, `No guilds have been recorded from your message.`)
          return message.lineReply(errorEmbed)
        }

        client.db.devlock.set(lockedCommand, guild.id, "guild")
      }

      if (thirdArg == "off") {
        if (cmdData["locked"] == true) {
          client.db.devlock.delete(lockedCommand)

          const successEmbed = client.embeds.success(command, `The \`${lockedCommand}\` command has been un-locked.`);

          return message.lineReply(successEmbed)
        } else {
          const errorEmbed = client.embeds.error(command, `The \`${lockedCommand}\` command is not locked.`);

          return message.lineReply(errorEmbed)
        }
      }

      if (cmdData["locked"] == true) {
        const errorEmbed = client.embeds.error(command, `The \`${lockedCommand}\` command has already been locked.`);

        return message.lineReply(errorEmbed)
      }

      client.db.devlock.set(lockedCommand, true, "locked")
      client.db.devlock.set(lockedCommand, reason, "reason")

      const successEmbed = client.embeds.success(command, `The \`${lockedCommand}\` command has been locked${guild !== false ? ` from the \`${guild.name}\` guild` : ``} for ${reason == responses.development ? `development` : `${reason == responses.bug ? `bugs` : `security`}`}.`);

      message.lineReply(successEmbed)

    } else {
      if (secArg == "view" || secArg == "check") {
        const lockedCommands = {};
        const filtered = client.db.devlock.filter(c => c.locked == true);
        filtered.forEach((value, key, map) => { lockedCommands[key] = value });
        const length = filtered.size
        var lockedView = [];

        for (const [key, value] of Object.entries(lockedCommands)) {
          lockedView.push(`<:MessageIconSlashCommands:868115363211124807> **\`${key}\`**\nReason: \`${value.reason}\`\nGuild: ${value.guild == null ? `None` : `\`${value.guild}\`.`}`)
        } 

        const embed = client.embeds.field(command, `A total of \`${length}\` command${length == 1 ? ` is` : `s are`} currently locked.`, length > 0 ? [{ name: `Locked Commands`, value: lockedView.join("\n\n"), inline: false }] : null);
        return message.lineReply(embed)
      }

      const errorEmbed = client.embeds.error(command, `\`${lockedCommand}\` is not a valid command.`);
      message.lineReply(errorEmbed)
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, true, message, command);
  }
}