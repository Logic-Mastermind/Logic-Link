const Discord = require("discord.js");
const Buttons = require("discord-buttons");
const Fetch = require("node-fetch");

exports.run = async (client, message, args, command, settings, tsettings, extra) => {
  const clientMember = message.guild.me;
  const guildPrefix = await client.functions.fetchPrefix(message.guild);
  
  const noArgs = await client.functions.getNoArgs(command, message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = await client.functions.getArgs(args);
  const code = `\`\`\``;
  const responses = {};

  try {
    var cmd = await client.functions.findCommand(secArg);

    if (cmd) {
      const path = `../${cmd.category}/${cmd.commandName}.js`;
      const pendEmbed = client.embeds.pending(command, `Reloading the command...`);
      const editMsg = await message.lineReply(pendEmbed);

      delete require.cache[require.resolve(path)];
      const embed = client.embeds.success(command, `Reloaded the \`${cmd.commandName}\` command.`);
      const props = require(path);

      await client.commands.delete(cmd.commandName);
      await client.commands.set(cmd.commandName, props);
      editMsg.edit(embed);
      
    } else {
      const embed = client.embeds.detailed(command, `I could not record any commands from your message.`, `\`${secArg}\` is not a valid command.`);
      message.lineReply(embed);
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, true, message, command, extra.logId);
  }
}