import Discord from "discord.js";
import Types from "../../Typings/types";

export default async function run(client: Types.client, message: Discord.Message, args: string[], command: Types.commandData, settings: Types.guildSettings, tsettings: Types.ticketSettings, extra: Types.extraObject) {
  
  const clientMember = message.guild.me;
  const guildPrefix = client.functions.fetchPrefix(message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = client.functions.getArgs(args);
  const code = `\`\`\``;

  const responses = {
    invite: `To invite Logic Link to your server, click any one of the links below.`,
    invLinks: `\`Administrator Invite\` - [Admin Invite ↗️](https://discord.com/api/oauth2/authorize?client_id=836761561074499695&permissions=8&scope=bot%20applications.commands)\n\`Non-Administrator Invite\` - [Non-Admin Invite ↗️](https://discord.com/oauth2/authorize?client_id=836761561074499695&permissions=1609591030&scope=bot%20applications.commands)\n\`Support Server\` - [Discord Invite ↗️](https://discord.gg/tg9sNMjpsU)`,
    webLinks: `\`Website Link\` - [Home Page ️️↗️](${client.config.websiteLink})\n\`Documentation Link\` - [Bot Docs ↗️](${client.config.docsLink})`
  }
  
  try {
    const fields = [
      { name: "Invite Links", value: responses.invLinks, inline: false },
      { name: "Other Links", value: responses.webLinks, inline: false }
    ];

    const embed = client.embeds.blue(command, `${client.util.messages.botInfo} ${responses.invite}`, fields);
    message.reply({ embeds: [embed] });
  } catch (error) {
    client.functions.sendErrorMsg(error, message, command, extra.logId);
  }
}