import Discord from "discord.js";
import Types from "../../types";

export default async function run(client: Types.client, message: Discord.Message, args: string[], command: Types.commandData, settings: Types.guildSettings, tsettings: Types.ticketSettings, extra: Types.extraObject) {
  
  const clientMember = message.guild.me;
  const guildPrefix = client.functions.fetchPrefix(message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = client.functions.getArgs(args);
  const code = `\`\`\``;
  const responses = {};

  try {
    const embed = client.embeds.pending(command, `Pinging...`);
    const msg = await message.reply({ embeds: [embed] });

    const roundTrip = msg.createdTimestamp - message.createdTimestamp;
    const wsPing = client.ws.ping;

    const fields = [
      { name: `Discord Latency`, value: `${wsPing}ms`, inline: true },
      { name: `Message Round Trip`, value: `${roundTrip}ms`, inline: true },      
    ];

    const embed1 = client.embeds.success(command, `Logic Link is online.`, fields);
    msg.edit({ embeds: [embed1] });
  } catch (error) {
    client.functions.sendErrorMsg(error, message, command, extra.logId);
  }
}