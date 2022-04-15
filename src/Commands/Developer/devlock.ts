import Discord from "discord.js";
import Types from "../../Typings/types";

export default async function run(client: Types.client, message: Discord.Message, args: string[], command: Types.commandData, settings: Types.guildSettings, tsettings: Types.ticketSettings, extra: Types.extraObject) {
  
  const clientMember = message.guild.me;
  const guildPrefix = client.functions.fetchPrefix(message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = client.functions.getArgs(args);
  const code = `\`\`\``;
  const responses = {};

  try {
    let cmd = client.functions.findCommand(secArg);
    let guild = thirdArg ? client.functions.findGuild(thirdArg) : null;
    let reason = guild ? args.slice(2).join(" ") : args.slice(1).join(" ");
    if (!reason) reason = client.util.messages.reason;

    if (cmd) {
      if (reason == "bug") reason = client.util.messages.buggy;
      if (reason == "sec") reason = client.util.messages.security;
      if (reason == "dev") reason = client.util.messages.development;
      
      const cmdInfo: Types.commandLockData = client.db.devlock.get(cmd.commandName);

      if (thirdArg == "off") {
        if (!cmdInfo?.timestamp) {
          const embed = client.embeds.error(command, `This command is not locked.`);
          return message.reply({ embeds: [embed] });
        }

        client.db.devlock.set(cmd.commandName, {});
        const embed = client.embeds.success(command, `Removed the command lock for \`${cmd.commandName}\`.`);
        return message.reply({ embeds: [embed] });
      }

      client.db.devlock.set(cmd.commandName, reason, "reason");
      client.db.devlock.set(cmd.commandName, guild?.id || null, "guild");
      client.db.devlock.set(cmd.commandName, Math.round(Date.now() / 1000), "timestamp");

      const fields = [{ name: "Reason", value: reason, inline: false }];
      if (guild) fields.push({ name: "Guild", value: guild.name, inline: false });

      const embed = client.embeds.success(command, `Locked the \`${cmd.commandName}\` command.`, fields);
      message.reply({ embeds: [embed] });
    } else {
      if (secArg == "view" || secArg == "check") {
        const fetched = client.db.devlock.fetchEverything();
        const cmds = [];

        for (const [key, val] of fetched.entries()) {
          const guild = client.guilds.cache.get(val.guild);
          const cmdName = client.functions.findCommand(key as string).name;

          cmds.push({
            name: `${cmdName}`,
            value: `Reason: ${val.reason}\nDate: <t:${val.timestamp}:R>\nGuild: ${guild ? guild.name : `None`}.`,
            inline: false
          });
        }

        if (!cmds[0]) {
          const embed = client.embeds.error(command, `No commands are currently locked.`);
          return message.reply({ embeds: [embed] });
        }

        const embed = client.embeds.green(command, `\`${cmds.length}\` command${cmds.length == 1 ? ` is` : `s are`} currently locked.`, cmds);
        return message.reply({ embeds: [embed] });

      } else if (secArg == "clear") {
        client.db.devlock.clear();

        const embed = client.embeds.success(command, `Removed all developer command locks.`);
        return message.reply({ embeds: [embed] });
      }

      const embed = client.embeds.invalidItem(command, ["command"], [secArg]);
      message.reply({ embeds: [embed] });
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, message, command, extra.logId);
  }
}