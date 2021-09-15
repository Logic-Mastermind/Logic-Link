const Discord = require("discord.js");
const Fetch = require("node-fetch");

exports.run = async (client, message, args, command, settings, tsettings, extra) => {
  const clientMember = message.guild.me;
  const guildPrefix = await client.functions.fetchPrefix(message.guild);
  
  const noArgs = await client.functions.getNoArgs(command, message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = await client.functions.getArgs(args);
  const code = `\`\`\``;

  const responses = {
    tooMuch: `This slowmode is over the limit of 6 hours.\n\n**Detailed Info**\n`,
    already: `This channel's slowmode has already been set to that integer.\n\n**Detailed Info**\n`
  }

  try {
    var slowmode = secArg;
    var channel = message.channel;
    var slowmodeTime = null;
    var passed = "default";

    if (thirdArg) {
      channel = message.mentions.channels.first();
      if (!channel) channel = await client.functions.findChannel(secArg, message.guild);
      slowmode = thirdArg;
      passed = "mention"
    }

    if (slowmode == "off" || slowmode == "reset") slowmode = "0";
    slowmode = await client.functions.getTime(slowmode);

    if (slowmode.passed && slowmode.timeView && channel) {
      slowmodeTime = Math.round(slowmode.duration / 1000);

      if (slowmodeTime > 21600) {
        const embed = client.embeds.error(command, `${responses.tooMuch}${slowmode.timeView[0]} ${slowmode.unit}${slowmode.timeView == 1 ? `` : `s`} (${slowmodeTime} seconds) is over the limit of \`21600\`.`);
        return message.lineReply(embed);
      }

      if (channel.rateLimitPerUser == slowmodeTime) {
        const embed = client.embeds.error(command, `${responses.already}Channel Slowmode - \`${channel.rateLimitPerUser}\`.\nRequested Slowmode - \`${slowmodeTime}\`.`);
        return message.lineReply(embed);
      }

      channel.setRateLimitPerUser(slowmodeTime, `Changed #${channel.name}'s slowmode. Responsible User: ${message.author.tag}`)
      .then(() => {
        const embed = client.embeds.success(command, `${slowmodeTime == 0 ? `Turned off` : `Set`} ${channel.id == message.channel.id ? `this channel's` : `<#${channel.id}>'s`} slowmode${slowmodeTime == 0 ? `.` : ` to \`${slowmode.timeView[0]}\` ${slowmode.unit}${slowmode.timeView[0] == 1 ? `` : `s`}.`}`);
        message.lineReply(embed);
      })
      .catch(async (error) => {
        const embed = await client.embeds.errorInfo(command, message, error);
        message.lineReply(embed);
      })
    } else {
      if (!channel && slowmode.timeView) {
        const embed = client.embeds.error(command, `${client.util.channel}\`${secArg}\` is not a channel.`);
        message.lineReply(embed);

      } else if (!slowmode.passed && channel && passed == "mention") {
        const noArgsEmbed = await client.embeds.noArgs(command, message.guild);
        message.lineReply(noArgsEmbed);

      } else if ((slowmode.passed && !slowmode.timeView && passed == "default") || (!slowmode.passed && passed == "default")) {
        const embed = client.embeds.error(command, `\`${secArg}\` is not a valid time unit.`);
        message.lineReply(embed);

      } else if ((slowmode.passed && !slowmode.timeView && passed == "mention") || (!slowmode.passed && passed == "mention")) {
        const embed = client.embeds.error(command, `\`${thirdArg}\` is not a valid time unit.`);
        message.lineReply(embed);

      } else {

      }
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, true, message, command, extra.logId);
  }
}