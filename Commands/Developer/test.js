const Discord = require("discord.js");
const Buttons = require("discord-buttons");
const Prefix = require("discord-prefix");
const Paste = require("pastebin-api").default;
const YouTube = require("ytdl-core-discord");
const YTSearch = require("yt-search");
const ms = require("ms");

exports.run = async (client, message, args, command, settings, tsettings, extra) => {
  var guildPrefix = Prefix.getPrefix(message.guild.id);
  if (!guildPrefix) guildPrefix = client.util.defaultPrefix;

  const clientMember = message.guild.me;
  const noArgs = await client.functions.getNoArgs(command, message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = await client.functions.getArgs(args);
  const code = `\`\`\``;

  try {
    if (secArg == "1") {
      return tyuytre
    }

    const embeds = [
      client.embeds.orange(command.name, "Page 1"),
      client.embeds.orange(command.name, "Page 2"),
      client.embeds.orange(command.name, "Page 3"),
      client.embeds.orange(command.name, "Page 4"),
      client.embeds.orange(command.name, "Page 5"),
    ];

    const msg = await message.channel.send({ embed: client.embeds.green(command, "Starter Page"), buttons: [client.buttons.grey("<", "hi").setDisabled(), client.buttons.grey(">", "bye")] });

    client.functions.paginate(msg, embeds);
  } catch (error) {
    client.functions.sendErrorMsg(error, true, message, command);
  }
}