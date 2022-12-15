import Discord from "discord.js";
import Types from "../../types";

export default async function run(client: Types.client, message: Discord.Message, args: string[], command: Types.commandData, settings: Types.guildSettings, tsettings: Types.ticketSettings, extra: Types.extraObject) {
  
  const clientMember = message.guild.me;
  const guildPrefix = client.functions.fetchPrefix(message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = client.functions.getArgs(args);
  const code = `\`\`\``;
  const responses = {};

  try {
    let cmd = client.functions.findCommand(secArg);

    if (cmd) {
      const path = client.functions.getCmdPath(cmd);
      const pendEmbed = client.embeds.pending(command, `Reloading the command...`);
      const editMsg = await message.reply({ embeds: [pendEmbed] });
      
      try {
        delete require.cache[require.resolve(path)];
        const props = (await import(path)).default;
        cmd.run = props;

      } catch (e) {
        const embed = client.embeds.error(command, "An error occured whilst reloading the command.", [{
          name: "Error Data",
          value: e.stack
        }]);

        return message.reply({ embeds: [embed] });
      }

      client.commands[cmd.category].delete(cmd.commandName);
      client.commands[cmd.category].set(cmd.commandName, cmd);

      const embed = client.embeds.success(command, `Reloaded the \`${cmd.commandName}\` command.`);
      editMsg.edit({ embeds: [embed] });
      
    } else {
      const embed = client.embeds.detailed(command, `I could not record any commands from your message.`, `\`${secArg}\` is not a valid command.`);
      message.reply({ embeds: [embed] });
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, message, command, extra.logId);
  }
}