const Discord = require("discord.js");
const Buttons = require("discord-buttons");
const Prefix = require("discord-prefix");
const Fetch = require("node-fetch");
const Paste = require("pastebin-api").default;
const YouTube = require("ytdl-core-discord");
const Chalk = require("chalk");
const ms = require("ms");

exports.run = async (client, message, args, command, settings, tsettings, extra) => {
  var guildPrefix = Prefix.getPrefix(message.guild.id);
  if (!guildPrefix) guildPrefix = client.util.defaultPrefix;

  const clientMember = message.guild.me;
  const noArgs = await client.functions.getNoArgs(command, message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = await client.functions.getArgs(args);
  const code = `\`\`\``;

  const responses = {

  }

  try {
    const guild = message.guild;
    const channel = message.channel;
    const category = message.channel.parent;
    const author = message.author;
    const member = message.member;

    async function clean(text) {
      if (typeof text === "string") {
        const newText = text.replace(/`/g, "`" + String.fromCharCode(8203));
        newText.replace(/@/g, "@" + String.fromCharCode(8203));
        return newText
      } else {
        return text;
      }
    }

    try {
      var execCode
      var evaled = null

      if (secArg == "silent") {
        execCode = args.slice(1).join(" ");
        
        if (execCode) {
          evaled = await eval(execCode);
        } else {
          const embed = client.embeds.noArgs(command.option.silent, message.guild);
          message.lineReply(embed)
        }
      } else {
        execCode = args.join(" ");
        evaled = await eval(execCode);
      }

      if (typeof evaled !== "string") evaled = require("util").inspect(evaled);
      if (secArg !== "silent") message.lineReply(evaled, { code: "xl", split: true })
    } catch (error) {
      const embed = client.embeds.red(command, `An error has occured whilst trying to execute that evaluation.\n\n**Code Executed**\n${code}javascript\n${execCode}${code}\n**Error**\n${code}${error.stack}${code}`);

      message.lineReply(embed);
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, true, message, command);
  }
}