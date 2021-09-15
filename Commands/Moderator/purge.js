const Discord = require("discord.js");
const Fetch = require("node-fetch");

exports.run = async (client, message, args, command, settings, tsettings, extra) => {
  const clientMember = message.guild.me;
  const guildPrefix = await client.functions.fetchPrefix(message.guild);
  
  const noArgs = await client.functions.getNoArgs(command, message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = await client.functions.getArgs(args);
  const code = `\`\`\``;

  const responses = {
    tooLow: `The purge limit must be greater than 1.\n\n**Detailed Info**\n`,
    nAn: `The purge limit must be a number.\n\n**Detailed Info**\n`
  }

  try {
    var purgeNumber = Number(secArg);
    purgeNumber = Math.round(purgeNumber);

    if (!clientMember.hasPermission(command.clientPerms)) {
      const errorEmbed = client.embeds.botPermission(command);
      return message.lineReply(errorEmbed)
    }

    if (purgeNumber < 1) {
      const embed = client.embeds.error(command, `${responses.tooLow}\`${secArg}\` is less than 1.`)
      return message.lineReply(embed)
    }

    if (isNaN(secArg)) {
      const embed = client.embeds.error(command, `${responses.nAn}\`${secArg}\` is not a number.`)
      return message.lineReply(embed);
    }

    await message.delete();
    if (purgeNumber > 1000) purgeNumber = 1000;
    const purgeTimes = Math.ceil(purgeNumber / 100);
    const purgeArray = [];

    var remainder = purgeNumber % 100;
    var success = null;
    var error = null;

    for (var i = 1; i <= purgeTimes; i++) {
      if (purgeNumber < 100) {
        const col = await message.channel.bulkDelete(purgeNumber, true);
        success += col.size;
        break;

      } else if (purgeNumber.toString().endsWith("00")) {
        const col = await message.channel.bulkDelete(100, true);
        success += col.size
        continue;
      }

      if (remainder) {
        const col = await message.channel.bulkDelete(remainder, true);
        success += col.size
        remainder = null;

      } else {
        const col = await message.channel.bulkDelete(100, true);
        success += col.size
      }
    }

    setTimeout(async function() {
      if (success) {
        const embed = client.embeds.success(command, `Purged \`${success}\` message${success == 1 ? `` : `s`} from this channel.`);
        const msg = await message.channel.send(embed);
        msg.delete({ timeout: 5000 });

      } else {
        const embed = await client.embeds.errorInfo(command, error);
        message.channel.send(embed);
      }
    }, purgeNumber < 350 ? 1200 : 700)
  } catch (error) {
    client.functions.sendErrorMsg(error, true, message, command, extra.logId);
  }
}