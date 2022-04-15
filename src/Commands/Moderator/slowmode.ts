import Discord from "discord.js";
import Types from "../../Typings/types";

export default async function run(client: Types.client, message: Discord.Message, args: string[], command: Types.commandData, settings: Types.guildSettings, tsettings: Types.ticketSettings, extra: Types.extraObject) {
  
  const clientMember = message.guild.me;
  const guildPrefix = client.functions.fetchPrefix(message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = client.functions.getArgs(args);
  const code = `\`\`\``;

  const responses = {
    tooMuch: `This duration is over the limit of 6 hours.`,
    notNum: `The duration number must be a numerical value.`,
    already: `This channel's slowmode has already been set to that value.`
  }

  try {
    let reset = false;
    let arg = thirdArg;

    let channel = message.mentions.channels.first() as Types.guildChannel;
    let time = client.functions.getTime(args.slice(1).join(" "));

    if (!channel) channel = client.functions.findChannel(secArg, message.guild);
    if (!channel && !thirdArg) {
      arg = secArg;
      channel = message.channel as Types.guildChannel;
      time = client.functions.getTime(secArg);
    }

    if (channel) {
      if (!channel.isText()) {
        const embed = client.embeds.error(command, `<#${channel.id}> is not a text channel.`);
        return message.reply({ embeds: [embed] });
      }

      let seconds = Math.round(time.duration / 1000);
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
      .catch((error) => {
        const embed = client.embeds.errorInfo(command, message, error);
        return message.reply({ embeds: [embed] });
      });

      const embed = client.embeds.success(command, `${reset ? `Reset <#${channel.id}>'s slowmode.` : `Set <#${channel.id}>'s slowmode to \`${time.display}\`.`}`);
      message.reply({ embeds: [embed] });
    } else {
      const embed = client.embeds.invalidItem(command, ["member"], [secArg]);
      message.reply({ embeds: [embed] });
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, message, command, extra.logId);
  }
}