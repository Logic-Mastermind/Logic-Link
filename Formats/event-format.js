const Discord = require("discord.js");
const Buttons = require("discord-buttons");
const Prefix = require("discord-prefix");

module.exports = async (client) => {
  var guildPrefix = Prefix.getPrefix(guild.id);
  if (!guildPrefix) guildPrefix = client.util.defaultPrefix;

  // const clientMember = guild.me;
  // const settings = await client.functions.getSettings(guild);
  // const tsettings = await client.functions.getTicketData(guild);
  const code = `\`\`\``;

  const responses = {

  }

  try {
    
  } catch (error) {
    client.functions.sendError(error);
  }
}