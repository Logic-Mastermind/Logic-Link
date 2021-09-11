const Discord = require("discord.js");
const Buttons = require("discord-buttons");
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
    var devLog = client.db.devSettings.get(client.util.devId, "logsCleared");
    var canLog = client.db.devSettings.get(client.util.devId, "allowLog");

    if (secArg) {
      if (secArg == "clr" || secArg == "clear") {
        await client.logger.clear();
        const embed = client.embeds.success(command, `Cleared the bot logs successfully.`);
        return message.lineReply(embed);

      } else if (secArg == "perst" || secArg == "persist" || secArg == "persistent") {
        logs = await client.db.logs.fetchEverything();
        persist = true;

      } else if (secArg == "off") {
        if (!canLog) {
          const embed = client.embeds.error(command, `Logs have already been turned off.`);
          return message.lineReply(embed);
        }

        client.db.devSettings.set(client.util.devId, false, "allowLog");
        const embed = client.embeds.success(command, `Turned off logs for the bot developer.`);
        return message.lineReply(embed);

      } else if (secArg == "on") {
        if (canLog) {
          const embed = client.embeds.error(command, `Logs have already been turned on.`);
          return message.lineReply(embed);
        }

        client.db.devSettings.set(client.util.devId, true, "allowLog");
        const embed = client.embeds.success(command, `Turned on logs for the bot developer.`);
        return message.lineReply(embed);

      } else if (!isNaN(secArg)) {
        var logData = await client.db.logs.get(secArg);
        if (!logData.content) {
          const embed = client.embeds.error(command, `A log with the ID: \`${secArg}\` was not found.`);
          return message.lineReply(embed);
        }

        const embed = client.embeds.blue(command, `Showing info for the log with ID: \`${secArg}\`.\n\n${client.util.category} Type: \`${logData.type}\`\n${client.util.clock} Date: <t:${Math.round(logData.timestamp / 1000)}:R>\n${client.util.message} Content: ${logData.content}${logData.details ? `\n\n**Log Details**\n${client.util.reply}${logData.details.join(`\n${client.util.reply}`)}` : ``}`);
        return message.lineReply(embed);
      }
    }

    if (logs.size <= 1) {
      const embed = client.embeds.error(command, `There are no logs to show.`);
      return message.lineReply(embed);
    }

    logs.forEach((v, k) => {
      if (v.type && v.content) {
        const log = `${(v.type == "Error" || v.type == "Warn") ? `${v.type == "Error" ? `-` : `+`}` : `~`}[${v.type} ${k}]: ${v.content}`;
        allLogs.unshift(log);
      }
    })

    const chunks = await client.functions.divideChunk(allLogs, 15);
    chunks.forEach((v, k) => {
      var totalLogs = client.db.logs.count;
      var description = (k == 0 ? `${persist ? `Displaying all logs since last cleared since <t:${Math.round(devLog / 1000)}:T>.` : `Displaying all logs last loaded since <t:${client.readySince}:T>.`}\nA total of \`${allLogs.length}\` log${allLogs.length == 1 ? ` is` : `s are`} shown.${allLogs.length !== totalLogs ? ` (${totalLogs} total log${totalLogs == 1 ? `` : `s`})` : ``}\n\n` : ``);

      const embed = client.embeds.blue(command, `${description}${code}diff\n${v.join("\n")}${code}`);
      pages.push(embed)
    })

    const leftBtn = client.buttons.grey("<", "Left_Button").setDisabled();
    const rightBtn = client.buttons.grey(">", "Right_Button");
    if (allLogs.length <= 15) rightBtn.setDisabled();

    const msg = await message.channel.send({ embed: pages[0], buttons: [leftBtn, rightBtn] });
    pages = await pages.slice(1);

    if (pages[0]) client.functions.paginate(msg, pages)
  } catch (error) {
    client.functions.sendErrorMsg(error, true, message, command, extra.logId);
  }
}