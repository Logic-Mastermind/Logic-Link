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
    const devMode = client.db.devSettings.get(client.util.devId, "devMode");
    if (secArg == "on") {
      if (devMode == true) {
        const embed = client.embeds.error(command, `Developer mode has already been turned on.`);
        return message.reply({ embeds: [embed] });
      }

      client.db.devSettings.set(client.util.devId, true, "devMode");
      const embed = client.embeds.success(command, `Turned on developer mode.`);

      message.reply({ embeds: [embed] });
    } else if (secArg == "off") {
      if (devMode == false) {
        const embed = client.embeds.error(command,`Developer mode has already been turned off.`);
        return message.reply({ embeds: [embed] });
      }

      client.db.devSettings.set(client.util.devId, false, "devMode");
      const embed = client.embeds.success(command, `Turned off developer mode.`);

      message.reply({ embeds: [embed] });
    } else if (secArg == "check") {
      const embed = client.embeds.blue(command, `Developer mode is currently ${devMode ? `enabled` : `disabled`}.`);

      message.reply({ embeds: [embed] });
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, true, message, command, extra.logId);
  }
}