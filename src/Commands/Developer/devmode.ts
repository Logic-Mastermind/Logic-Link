import Discord from "discord.js";
import Types from "../../types";

export default async function run(client: Types.client, message: Discord.Message, args: string[], command: Types.commandData, settings: Types.guildSettings, tsettings: Types.ticketSettings, extra: Types.extraObject) {
  
  const clientMember = message.guild.me;
  const guildPrefix = client.functions.fetchPrefix(message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = client.functions.getArgs(args);
  const code = `\`\`\``;
  const responses = {};

  try {
    const devMode = client.db.devSettings.get("devMode");

    if (secArg == "on") {
      if (devMode === true) {
        const embed = client.embeds.error(command, `Developer mode has already been turned on.`);
        return message.reply({ embeds: [embed] });
      }

      client.db.devSettings.set("devMode", true);
      const embed = client.embeds.success(command, `Turned on developer mode.`);

      message.reply({ embeds: [embed] });
    } else if (secArg == "off") {
      if (devMode === false) {
        const embed = client.embeds.error(command,`Developer mode has already been turned off.`);
        return message.reply({ embeds: [embed] });
      }

      client.db.devSettings.set("devMode", false);
      const embed = client.embeds.success(command, `Turned off developer mode.`);

      message.reply({ embeds: [embed] });
    } else if (secArg == "check") {
      const embed = client.embeds.warn(command, `Developer mode is currently ${devMode ? `enabled` : `disabled`}.`);

      message.reply({ embeds: [embed] });
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, message, command, extra.logId);
  }
}