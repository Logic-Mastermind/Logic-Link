const Discord = require("discord.js");
const Fetch = require("node-fetch");
const Paste = require("pastebin-api").default;
const YouTube = require("ytdl-core-discord");
const Chalk = require("chalk");
const ms = require("ms");

exports.run = async (client, message, args, command, settings, tsettings, extra) => {
  const clientMember = message.guild.me;
  const guildPrefix = await client.functions.fetchPrefix(message.guild);
  
  const noArgs = await client.functions.getNoArgs(command, message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = await client.functions.getArgs(args);
  const code = `\`\`\``;
  const responses = {};

  try {
    const embed = client.embeds.orange(command, `What panel option would you like to modify?\nSelect the option(s) that you would like to modify from the menu below.`);

    const select = await client.buttons.selectMenu("Select options...", [
      { label: "Name", value: "Change the name of the panel.", id: "Panel_Modify:Name", emoji: "" },
      { label: "Opened Category", value: "Change the opened ticket category.", id: "Panel_Modify:Opened", emoji: "" },
      { label: "Closed Category", value: "Change the closed ticket category.", id: "Panel_Modify:Closed", emoji: "" },
      { label: "Claiming", value: "Enable or disable ticket claiming", id: "Panel_Modify:Claiming", emoji: "" },
      { label: "Panel Channel", value: "Change the channel where the panel is sent to.", id: "Panel_Modify:Channel", emoji: "" },
      { label: "Support Roles", value: "Change the support roles for this panel.", id: "Panel_Modify:Support", emoji: "" },
      { label: "Additional Roles", value: "Change the additional roles for this panel.", id: "Panel_Modify:Additional", emoji: "" },
      { label: "Ticket Format", value: "Change the ticket format for new tickets.", id: "Panel_Modify:Ticket", emoji: "" },
      { label: "Claimed Format", value: "Change the ticket format for claimed tickets.", id: "Panel_Modify:Claimed", emoji: "" },
    ], "Panel_Settings:Modify", 1);
    
    const row = client.buttons.actionRow([select]);
    message.reply({ embeds: [embed], components: [row] });
  } catch (error) {
    client.functions.sendErrorMsg(error, message, command, extra.logId);
  }
}