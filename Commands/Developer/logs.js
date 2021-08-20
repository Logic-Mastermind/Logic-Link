const Discord = require("discord.js");
const Buttons = require("discord-buttons");
const Prefix = require("discord-prefix");

exports.run = async (client, message, args, command, settings, tsettings, extra) => {
  var guildPrefix = Prefix.getPrefix(message.guild.id);
  if (!guildPrefix) guildPrefix = client.util.defaultPrefix;

  const clientMember = message.guild.me;
  const noArgs = await client.functions.getNoArgs(command, message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = await client.functions.getArgs(args);
  const code = `\`\`\``;

  const responses = {

  }

  try {
    var logs = await client.db.logs;
    var pages = [];
    var allLogs = [];
    var persist = false;
    var devLog = client.db.logs.get(client.util.devId);

    if (secArg) {
      if (secArg == "clr" || secArg == "clear") {
        await client.logger.clear();
        const embed = client.embeds.success(command, `Cleared the bot logs successfully.`);
        return message.lineReply(embed);
      }

      if (secArg == "perst" || secArg == "persist" || secArg == "persistent") {
        logs = await client.db.logs.fetchEverything();
        persist = true;
      }
    }

    logs.forEach((v, k, m) => {
      if (k !== client.util.devId) {
        const log = `[${v.type} ${k}]: ${v.content}`;
        allLogs.unshift(log);
      }
    })

    const chunks = await client.functions.divideChunk(allLogs, 15);
    chunks.forEach((v, k, m) => {
      var totalLogs = client.db.logs.count - 1;
      var description = (k == 0 ? `${persist ? `Displaying all logs since last cleared since <t:${Math.floor(devLog.clearedAt / 1000)}:T>.` : `Displaying all logs last loaded since <t:${client.readySince}:T>.`}\nA total of \`${allLogs.length}\` log${allLogs.length == 1 ? ` is` : `s are`} shown.${allLogs.length !== totalLogs ? ` (${totalLogs} total log${totalLogs == 1 ? `` : `s`})` : ``}\n\n` : ``);

      const embed = client.embeds.blue(command, `${description}${code}${v.join("\n")}${code}`);
      pages.push(embed)
    })

    const leftBtn = client.buttons.grey("<", "Left_Button").setDisabled();
    const rightBtn = client.buttons.grey(">", "Right_Button");
    if (allLogs.length < 15) rightBtn.setDisabled();

    const msg = await message.channel.send({ embed: pages[0], buttons: [leftBtn, rightBtn] });
    pages = pages.slice(1);

    client.functions.paginate(msg, pages)
  } catch (error) {
    client.functions.sendErrorMsg(error, true, message, command);
  }
}