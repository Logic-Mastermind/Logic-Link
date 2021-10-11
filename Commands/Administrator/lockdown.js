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
    if (secArg) {
      if (secArg.toLowerCase() == "off") {
        const channels = await message.guild.channels.fetch();
        channels.forEach((c) => {
          if (!c.permissionsFor(clientMember).has("MANAGE_CHANNELS")) return;
          if (!c.permissionsFor(message.member).has("MANAGE_CHANNELS")) return;

          c.permissions.edit(message.guild.roles.everyone, {
            SEND_MESSAGES: null
          });
        });
      }
    }
    
    const confirm = client.buttons.confirm("Guild_Lockdown:Confirm");
    const cancel = client.buttons.cancel("Guild_Lockdown:Cancel");
    const row = client.buttons.actionRow([confirm, cancel]);

    const embed = client.embeds.warn(command, `Are you sure that you would like to lockdown this server's channels?`, [{
      name: "Detailed Info",
      value: "Proceeding will disallow regular server members from being able to type in channels. Click on a button below to either confirm or cancel your choice.",
      inline: false
    }]);
    const msg = message.reply({ embeds: [embed], components: [row] });

  } catch (error) {
    client.functions.sendErrorMsg(error, message, command, extra.logId);
  }
}