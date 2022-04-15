import Discord from "discord.js";
import Types from "../../Typings/types";

export default async function run(client: Types.client, message: Discord.Message, args: string[], command: Types.commandData, settings: Types.guildSettings, tsettings: Types.ticketSettings, extra: Types.extraObject) {
  
  const clientMember = message.guild.me;
  const guildPrefix = client.functions.fetchPrefix(message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = client.functions.getArgs(args);
  const code = `\`\`\``;

  const responses = {
    lessThan: `The purge number must be greater than or equal to 1.`,
    notNum: `The purge number must be a numerical value from 1 to 1000.`
  }

  try {
    let purgeNumber = Math.round(Number(secArg));
    if (isNaN(Number(secArg))) {
      const embed = client.embeds.detailed(command, responses.notNum, `\`${secArg}\` is not a number.`);
      return message.reply({ embeds: [embed] });
    }

    if (purgeNumber < 1) {
      const embed = client.embeds.detailed(command, responses.lessThan, `\`${purgeNumber}\` is less than 1.`);
      return message.reply({ embeds: [embed] });
    }

    await message.delete();
    if (purgeNumber > 1000) purgeNumber = 1000;
    const times = Math.ceil(purgeNumber / 100);
    const loops = [];
    let totalSize = 0;

    if (purgeNumber <= 100) {
      loops.push(purgeNumber);
    } else {
      let remainder = purgeNumber % 100;
      if (remainder == 0) remainder = 100;

      for (let i = 1; i <= times; ++i) {
        if (i !== times) {
          loops.push(100);
          continue;
        } else {
          loops.push(remainder);
        }
      }
    }

    for await (const num of loops) {
      let collected;
      if (message.channel instanceof Discord.GuildChannel) collected = await client.functions.bulkDeleteMessages(message.channel, num);
      totalSize += collected ? collected.size : collected instanceof Discord.Message ? 1 : 0;
    }

    if (totalSize !== 0) {
      const embed = client.embeds.success(command, `Purged \`${totalSize}\` message${totalSize == 1 ? `` : `s`} from this channel.`);
      const msg = await message.channel.send({ embeds: [embed] });
      setTimeout(async () => msg.delete(), 3000);
    } else {
      const embed = client.embeds.detailed(command, `No messages were deleted from this channel.`, `This is likely due to messages being more than 2 weeks old.`);
      message.channel.send({ embeds: [embed] });
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, message, command, extra.logId);
  }
}