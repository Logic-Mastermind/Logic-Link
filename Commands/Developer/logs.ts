import Discord from "discord.js";
import Types from "../../Typings/types";

export default async function run(client: Types.client, message: Discord.Message, args: string[], command: Types.commandData, settings: Types.guildSettings, tsettings: Types.ticketSettings, extra: Types.extraObject) {
  
  const clientMember = message.guild.me;
  const guildPrefix = client.functions.fetchPrefix(message.guild);
  
  const noArgs = client.functions.getNoArgs(command, message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = client.functions.getArgs(args);
  const code = `\`\`\``;
  const responses = {};

  try {
    var canLog = client.db.devSettings.get(client.config.devId, "allowLog");
    var logs = new Discord.Collection(client.db.logs).sort() as Types.logData;
    var pages = [];
    var allLogs = [];

    if (secArg) {
      if (secArg == "clr" || secArg == "clear") {
        client.logger.clear();
        const embed = client.embeds.success(command, `Cleared the bot logs successfully.`);
        return message.reply({ embeds: [embed] });

      } else if (secArg == "count") {
        const embed = client.embeds.success(command, `There is a total of \`${logs.size}\` bot log${logs.size == 1 ? `` : `s`}.`);
        return message.reply({ embeds: [embed] });

      } else if (secArg == "off") {
        if (!canLog) {
          const embed = client.embeds.error(command, `Developer logs have already been turned off.`);
          return message.reply({ embeds: [embed] });
        }

        client.db.devSettings.set(client.config.devId, false, "allowLog");
        const embed = client.embeds.success(command, `Turned off developer logs.`);
        return message.reply({ embeds: [embed] });

      } else if (secArg == "on") {
        if (canLog) {
          const embed = client.embeds.error(command, `Developer logs have already been turned on.`);
          return message.reply({ embeds: [embed] });
        }

        client.db.devSettings.set(client.config.devId, true, "allowLog");
        const embed = client.embeds.success(command, `Turned on developer logs.`);
        return message.reply({ embeds: [embed] });

      } else if (!isNaN(secArg as any)) {
        var logData = client.db.logs.get(secArg);
        if (!logData.content) {
          const embed = client.embeds.error(command, `A log with the ID: \`${secArg}\` was not found.`);
          return message.reply({ embeds: [embed] });
        }

        const embed = client.embeds.blue(command, `Showing info for the log with ID: \`${secArg}\`.\n\n${client.util.emojis.category} Type: \`${logData.type}\`\n${logData.user ? `${client.util.emojis.moderator} User: <@${logData.user}>\n` : ``}${client.util.emojis.clock} Date: <t:${Math.round(logData.timestamp / 1000)}:R>\n${client.util.emojis.message} Content: ${logData.content}${logData.details ? `\n\n**Log Details**\n${client.util.emojis.reply}${logData.details.join(`\n${client.util.emojis.reply}`)}` : ``}`);
        return message.reply({ embeds: [embed] });

      } else {
        var action = secArg.toLowerCase();
        var log = args.slice(1).join(" ");

        if (action !== "warn" && action !== "error") {
          action = "log";
          log = args.join(" ");
        }

        const logId = client.logger[action](log);
        const embed = client.embeds.success(command, `Created a${action == "error" ? `n` : ``} ${action} with ID: \`${logId}\`.`, [{
          name: "Content",
          value: log,
          inline: false
        }]);
        return message.reply({ embeds: [embed] });
      }
    }

    if (logs.size < 1) {
      const embed = client.embeds.error(command, `There are no logs to show.`);
      return message.reply({ embeds: [embed] });
    }

    for await (const [k, v] of logs.entries()) {
      if (!v.type) continue;
      if (!v.content) continue;

      const priority = v.type == "Error" ? `-` : v.type == "Warn" ? `+` : `~`;
      const log = `${priority} [Log] ${k}: ${v.content}`;
      allLogs.push(log);
    }

    const chunks: string[][] = client.functions.divideChunk(allLogs, 15);
    for await (const [k, v] of Object.entries(chunks)) {
      var desc = "";
      var logsTotal = allLogs.length;
      var totalLogs = logs.size;

      if (k == "0") {
        desc = `Displaying all logs last cleared since <t:${client.readySince}:T>.\nA total of \`${logsTotal}\` log${logsTotal == 1 ? ` is` : `s are`} shown.${logsTotal !== totalLogs ? ` (${totalLogs} total logs)` : ``}\n\n`;
      }

      const embed = client.embeds.blue(command, `${desc}${code}diff\n${v.join("\n")}${code}`);
      pages.push(embed);
    }

    const leftBtn = client.components.button({ id: "Button_Left:DevLogs", emoji: client.util.emojis.arrowLeft, style: "SECONDARY" });
    const rightBtn = client.components.button({ id: "Button_Right:DevLogs", emoji: client.util.emojis.arrowRight, style: "SECONDARY" });

    if (allLogs.length <= 15) rightBtn.setDisabled();
    leftBtn.setDisabled();
    const actionRow = client.components.actionRow(leftBtn, rightBtn);

    const msg = await message.reply({ embeds: [pages[0]], components: [actionRow] });
    pages = pages.slice(1);

    if (pages[0]) client.functions.paginate(msg, pages, { filter: (c) => c.user.id == message.author.id });
  } catch (error) {
    client.functions.sendErrorMsg(error, message, command, extra.logId);
  }
}