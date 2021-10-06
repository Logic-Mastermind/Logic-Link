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
    var logs = await client.db.logs;
    var pages = [];
    var allLogs = [];

    var persist = false;
    var devLog = Math.round(client.db.devSettings.get(client.util.devId, "logsCleared") / 1000);
    var canLog = client.db.devSettings.get(client.util.devId, "allowLog");

    if (secArg) {
      if (secArg == "clr" || secArg == "clear") {
        await client.logger.clear();
        const embed = client.embeds.success(command, `Cleared the bot logs successfully.`);
        return message.reply({ embeds: [embed] });

      } else if (secArg == "all") {
        logs = await client.db.logs.fetchEverything();
        persist = true;

      } else if (secArg == "count") {
        const embed = client.embeds.success(command, `There is a total of \`${logs.count}\` bot log${logs.count == 1 ? `` : `s`}.`);
        return message.reply({ embeds: [embed] });

      } else if (secArg == "off") {
        if (!canLog) {
          const embed = client.embeds.error(command, `Developer logs have already been turned off.`);
          return message.reply({ embeds: [embed] });
        }

        client.db.devSettings.set(client.util.devId, false, "allowLog");
        const embed = client.embeds.success(command, `Turned off developer logs.`);
        return message.reply({ embeds: [embed] });

      } else if (secArg == "on") {
        if (canLog) {
          const embed = client.embeds.error(command, `Developer logs have already been turned on.`);
          return message.reply({ embeds: [embed] });
        }

        client.db.devSettings.set(client.util.devId, true, "allowLog");
        const embed = client.embeds.success(command, `Turned on developer logs.`);
        return message.reply({ embeds: [embed] });

      } else if (!isNaN(secArg)) {
        var logData = await client.db.logs.get(secArg);
        if (!logData.content) {
          const embed = client.embeds.error(command, `A log with the ID: \`${secArg}\` was not found.`);
          return message.reply({ embeds: [embed] });
        }

        const embed = client.embeds.blue(command, `Showing info for the log with ID: \`${secArg}\`.\n\n${client.util.category} Type: \`${logData.type}\`\n${client.util.clock} Date: <t:${Math.round(logData.timestamp / 1000)}:R>\n${client.util.message} Content: ${logData.content}${logData.details ? `\n\n**Log Details**\n${client.util.reply}${logData.details.join(`\n${client.util.reply}`)}` : ``}`);
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
      await allLogs.unshift(log);
    }

    const chunks = await client.functions.divideChunk(allLogs, 15);
    for await (const [k, v] of Object.entries(chunks)) {
      var desc = "";
      var logsTotal = allLogs.length;
      var totalLogs = client.db.logs.count;

      if (k == 0) {
        desc = `Displaying all logs last ${persist ? `cached since <t:${devLog}:T>` : `cleared since <t:${client.readySince}:T>`}.\nA total of \`${logsTotal}\` log${logsTotal == 1 ? ` is` : `s are`} shown.${logsTotal !== totalLogs ? ` (${totalLogs} total logs)` : ``}\n\n`;
      }

      const embed = client.embeds.blue(command, `${desc}${code}diff\n${v.join("\n")}${code}`);
      await pages.push(embed);
    }

    const leftBtn = client.buttons.emoji("Button_Left:DevLogs", client.util.arrowLeft, "SECONDARY");
    const rightBtn = client.buttons.emoji("Button_Right:DevLogs", client.util.arrowRight, "SECONDARY");

    if (allLogs.length <= 15) rightBtn.setDisabled();
    await leftBtn.setDisabled();
    const actionRow = client.buttons.actionRow([leftBtn, rightBtn]);

    const msg = await message.channel.send({ embeds: [pages[0]], components: [actionRow] });
    pages = await pages.slice(1);

    if (pages[0]) client.functions.paginate(msg, pages);
  } catch (error) {
    client.functions.sendErrorMsg(error, message, command, extra.logId);
  }
}