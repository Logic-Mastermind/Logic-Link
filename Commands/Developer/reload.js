const Discord = require("discord.js");
const Buttons = require("discord-buttons");
const Prefix = require("discord-prefix");

exports.run = async (client, message, args, command, settings, tsettings, extra) => {
  var guildPrefix = Prefix.getPrefix(message.guild.id);
  if (!guildPrefix) guildPrefix = client.util.defaultPrefix;

  const clientMember = message.guild.me;
  const noArgs = await client.functions.getNoArgs(command, message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = await client.functions.getArgs(args);
  const code = `\`\`\``;

  try {
    var commandName = args.join(" ");
    var commandObject = null;
    var commandPath = null;

    if (client.command.aliases[commandName]) {
      commandObject = client.cmd[client.command.aliases[commandName]];
    } else {
      commandObject = client.cmd[commandName]
    }

    if (!commandObject) {
      const errorEmbed = client.embeds.error(command, `\`${commandName}\` is not a valid command.`);
      return message.lineReply(errorEmbed);
    }

    if (commandObject.category == "general") {
      commandPath = `../General/${commandObject.commandName}.js`

    } else if (commandObject.category == "moderator") {
      commandPath = `../Moderator/${commandObject.commandName}.js`

    } else if (commandObject.category == "administrator") {
      commandPath = `../Administrator/${commandObject.commandName}.js`

    } else if (commandObject.category == "developer") {
      commandPath = `../Developer/${commandObject.commandName}.js`
    }

    const successEmbed = client.embeds.success(command, `Reloaded the \`${commandObject.commandName}\` command.`)
    delete require.cache[require.resolve(commandPath)];
    const props = require(commandPath);

    client.commands.delete(commandName);
    client.commands.set(commandName, props);
    message.lineReply(successEmbed);

  } catch (error) {
    client.functions.sendErrorMsg(error, true, message, command);
  }
}