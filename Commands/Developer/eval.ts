import Discord from "discord.js";
import Types from "../../Typings/types";
import fetch from "node-fetch";

export default async function run(client: Types.client, message: Discord.Message, args: string[], command: Types.commandData, settings: Types.guildSettings, tsettings: Types.ticketSettings, extra: Types.extraObject) {
  
  const clientMember = message.guild.me;
  const guildPrefix = client.functions.fetchPrefix(message.guild);
  
  const noArgs = client.functions.getNoArgs(command, message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = client.functions.getArgs(args);
  const code = `\`\`\``;
  const responses = {};

  try {
    const guild = message.guild;
    const member = message.member;
    const channel = message.channel;
    const category = message.channel.type !== "DM" ? message.channel.parent : null;
    const author = message.author;
    const ugKey = `${member.id}-${guild.id}`;

    try {
      var execCode: string;
      var evaled = null;
      var silent = false;

      if (secArg == "silent") {
        execCode = args.slice(1).join(" ");
        silent = true;
        
        if (execCode) {
          evaled = await eval(`${execCode}`);
        } else {
          const embed = client.embeds.noArgs(command.option.silent, message.guild);
          return message.reply({ embeds: [embed] });
        }
      } else if (secArg.includes("await")) {
        execCode = args.join(" ");
        evaled = await eval(`(async function() { return ${execCode}})()`);

      } else if (secArg == "async") {
        execCode = args.slice(1).join(" ");

        if (execCode) {
          evaled = await eval(`(async function() {${execCode}})()`);
        } else {
          const embed = client.embeds.noArgs(command.option.async, message.guild);
          return message.reply({ embeds: [embed] })
        }
      } else {
        execCode = args.join(" ");
        evaled = await eval(`${execCode}`);
      }

      if (typeof evaled !== "string") evaled = require("util").inspect(evaled);
      if (!silent) {
        const msgs = Discord.Util.splitMessage(evaled, { maxLength: 1975 });

        for (let msg of msgs) {
          msg = Discord.Formatters.codeBlock('xl', msg);
          message.reply({ content: msg });
        }
      }
    } catch (error) {
      const embed = client.embeds.error(command, `An error has occured whilst trying to execute that evaluation.\n\u200b`, [
        { name: "Code Executed", value: `${code}js\n${execCode}${code}\u200b`, inline: false },
        { name: "Error Stack", value: `${code}${error.stack}${code}`, inline: false }
      ]);

      message.reply({ embeds: [embed] });
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, message, command, extra.logId);
  }
}