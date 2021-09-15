const Discord = require("discord.js");
const Fetch = require("node-fetch");

exports.run = async (client, message, args, command, settings, tsettings, extra) => {
  const clientMember = message.guild.me;
  const guildPrefix = await client.functions.fetchPrefix(message.guild);
  
  const noArgs = await client.functions.getNoArgs(command, message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = await client.functions.getArgs(args);
  const code = `\`\`\``;
  const responses = {};

  try {
    var cmd = await client.functions.findCommand(secArg);
    var guild = thirdArg ? await client.functions.findGuild(thirdArg) : null;
    var reason = guild ? args.slice(2).join(" ") : args.slice(1).join(" ");
    if (!reason) reason = client.util.reason;

    if (cmd) {
      if (reason == "bug") reason = client.util.buggy;
      if (reason == "sec") reason = client.util.security;
      if (reason == "dev") reason = client.util.development;

      const cmdInfo = client.db.devlock.get(cmd.commandName);
      if (cmdInfo.locked && (reason == client.util.reason)) {
        const fields = [];
        if (cmdInfo.reason !== client.util.reason) fields[0] = { name: "Reason", value: cmdInfo.reason };

        const embed = client.embeds.error(command, `This command has already been locked.`, fields);
        return message.lineReply(embed);
      }

      if (thirdArg == "off") {
        if (!cmdInfo.locked) {
          const embed = client.embeds.error(command, `This command is not locked.`);
          return message.lineReply(embed);
        }

        client.db.devlock.delete(cmd.commandName);

        const embed = client.embeds.success(command, `Removed the command lock for \`${cmd.commandName}\`.`);
        return message.lineReply(embed);
      }

      client.db.devlock.set(cmd.commandName, true, "locked");
      client.db.devlock.set(cmd.commandName, reason, "reason");
      client.db.devlock.set(cmd.commandName, guild, "guild");
      client.db.devlock.set(cmd.commandName, cmd.name, "name");
      client.db.devlock.set(cmd.commandName, Math.round(Date.now() / 1000), "date");

      const fields = [{ name: "Reason", value: reason, inline: false }];
      if (guild) fields[1] = { name: "Guild", value: guild.name, inline: false };

      const embed = client.embeds.success(command, `Locked the \`${cmd.commandName}\` command.`, fields);
      message.lineReply(embed);
    } else {
      if (secArg == "view") {
        const fetched = await client.db.devlock.fetchEverything();
        const cmds = [];

        for (const [key, val] of fetched.entries()) {
          if (!val.locked) continue;
          const guild = client.guilds.cache.get(val.guild);
          cmds.push({
            name: `${val.name}`,
            value: `Reason: \`${val.reason}\`\nDate: <t:${val.date}:R>\nGuild: ${guild ? guild.name : `None`}.`,
            inline: false
          });
        }

        if (!cmds[0]) {
          const embed = client.embeds.error(command, `No commands are currently locked.`);
          return message.lineReply(embed);
        }

        const embed = client.embeds.green(command, `\`${cmds.length}\` command${cmds.length == 1 ? ` is` : `s are`} currently locked.`, cmds);
        return message.lineReply(embed);

      } else if (secArg == "clear") {
        client.db.devlock.clear();

        const embed = client.embeds.success(command, `Removed all developer command locks.`);
        return message.lineReply(embed);
      }

      const embed = client.embeds.noCommand(command, secArg);
      message.lineReply(embed);
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, true, message, command, extra.logId);
  }
}