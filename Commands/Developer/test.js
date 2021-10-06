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
    const emb = client.embeds.blue("Server Verification", `Welcome to the Logic Link support server.\nTo gain access to the rest of channnels, please click the button below.\n\nOnce you have completed verification, you can take a look at the server rules, get support, or talk with the community.`);
    const button = client.buttons.green("Verify", "Support_Server:Verify");
    const row = client.buttons.actionRow([button]);
    message.channel.send({ embeds: [emb], components: [row] });
  } catch (error) {
    client.functions.sendErrorMsg(error, message, command, extra.logId);
  }
}