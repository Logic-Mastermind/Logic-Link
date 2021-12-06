const Discord = require("discord.js");
const Fetch = require("node-fetch");
const ms = require("ms");

exports.run = async (client, message, args, command, settings, tsettings, extra) => {
  const clientMember = message.guild.me;
  const guildPrefix = await client.functions.fetchPrefix(message.guild);
  
  const noArgs = await client.functions.getNoArgs(command, message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = await client.functions.getArgs(args);
  const code = `\`\`\``;

  const responses = {
    tooMuch: `This duration is over the limit of 6 hours.`,
    notNum: `The duration number must be a numerical value.`,
    already: `This channel's slowmode has already been set to that value.`
  }

  try {
    var reset = false;
    var arg = thirdArg;

    var channel = message.mentions.channels.first();
    var time = client.functions.getTime(args.slice(1).join(" "));

    if (!channel) channel = await client.functions.findChannel(secArg, message.guild);
    if (!channel && !thirdArg) {
      arg = secArg;
      channel = message.channel;
      time = client.functions.getTime(secArg);
    }

    if (channel) {
      if (!channel.isText()) {
        const embed = client.embeds.error(command, `<#${channel}> is not a text channel.`);
        return message.reply({ embeds: [embed] });
      }

      var seconds = Math.round(time.duration / 1000);
      if (arg == "off" || arg == "reset") {
        reset = true;
        seconds = 0;
      }

      if (!time.passed && !reset) {
        const embed = client.embeds.error(command, `I could record any time durations from your message.`);
        return message.reply({ embeds: [embed] });
      }

      if (seconds > 21600) {
        const embed = client.embeds.detailed(command, responses.tooMuch, `\`${time.display}\` is over 21600 seconds.`);
        return message.reply({ embeds: [embed] });
      }

      if (channel.rateLimitPerUser == seconds) {
        const embed = client.embeds.error(command, responses.already);
        return message.reply({ embeds: [embed] });
      }

      await channel.setRateLimitPerUser(seconds)
      .catch(async (error) => {
        const embed = await client.embeds.errorInfo(command, message, error);
        return message.reply({ embeds: [embed] });
      });

      const embed = client.embeds.success(command, `${reset ? `Reset <#${channel.id}>'s slowmode.` : `Set <#${channel.id}>'s slowmode to \`${time.display}\`.`}`);
      message.reply({ embeds: [embed] });
    } else {
      const embed = client.embeds.noChannel(command, secArg);
      message.reply({ embeds: [embed] });
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, message, command, extra.logId);
  }
}