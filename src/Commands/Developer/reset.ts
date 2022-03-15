import Discord from "discord.js";
import Types from "../../Typings/types";

export default async function run(client: Types.client, message: Discord.Message, args: string[], command: Types.commandData, settings: Types.guildSettings, tsettings: Types.ticketSettings, extra: Types.extraObject) {
  
  const clientMember = message.guild.me;
  const guildPrefix = client.functions.fetchPrefix(message.guild);
  
  const noArgs = client.functions.getNoArgs(command, message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = client.functions.getArgs(args);
  const code = `\`\`\``;
  const responses = {};

  try {
    if (secArg == "cooldown" || secArg == "cd") {
      if (!thirdArg) {
        const embed = client.embeds.noArgs(command.option.cooldown, message.guild);
        return message.reply({ embeds: [embed] });
      }

      let user = message.mentions.users.first();
      let cmd = client.functions.findCommand(fourthArg);
      if (!user) user = await client.functions.findUser(thirdArg);

      if (user) {
        if (cmd) {
          client.cooldown.delete(user.id, cmd.commandName);

          const embed = client.embeds.success(command.option.cooldown, `Cleared <@${user.id}>'s cooldown for the \`${cmd.commandName}\` command.`);
          message.reply({ embeds: [embed] });
        } else {
          if (fourthArg) {
            const embed = client.embeds.invalidItem(command.option.cooldown, ["command"], [fourthArg]);
            return message.reply({ embeds: [embed] });
          }

          client.cooldown.delete(user.id);
          const embed = client.embeds.success(command.option.cooldown, `Cleared <@${user.id}>'s cooldown.`);
          message.reply({ embeds: [embed] });
        }
      } else {
        const embed = client.embeds.invalidItem(command.option.cooldown, ["user"], [thirdArg]);
        message.reply({ embeds: [embed] });
      }
    } else if (secArg == "settings" || secArg == "setting") {
      if (!thirdArg) {
        const embed = client.embeds.noArgs(command.option.settings, message.guild);
        return message.reply({ embeds: [embed] });
      }

      let setting = fourthArg;
      let guild = client.functions.findGuild(thirdArg);

      if (guild) {
        client.db.settings.delete(guild.id, setting || null);
        const embed = client.embeds.success(command, `${setting ? `Reset the \`${setting}\` setting` : `Reset settings `} in the \`${guild.name}\` guild.`);
        message.reply({ embeds: [embed] });

      } else {
        const embed = client.embeds.invalidItem(command, ["guild"], [thirdArg]);
        message.reply({ embeds: [embed] });
      }
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, message, command, extra.logId);
  }
}