const Discord = require("discord.js");
const Buttons = require("discord-buttons");
const Fetch = require("node-fetch");
const Paste = require("pastebin-api").default;
const YouTube = require("ytdl-core-discord");
const Chalk = require("chalk");
const FS = require("fs");
const ms = require("ms");

exports.run = async (client, message, args, command, settings, tsettings, extra) => {
  const clientMember = message.guild.me;
  const guildPrefix = await client.functions.fetchPrefix(message.guild);
  
  const noArgs = await client.functions.getNoArgs(command, message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = await client.functions.getArgs(args);
  const code = `\`\`\``;
  const responses = {};

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

      if (secArg == "silent" || secArg == "s") {
        execCode = args.slice(1).join(" ");
        
        if (execCode) {
          evaled = await eval(`${execCode}`);
        } else {
          const embed = await client.embeds.noArgs(command.option.silent, message.guild);
          return message.lineReply(embed);
        }
      } else if (secArg == "async" || secArg == "a") {
        execCode = args.slice(1).join(" ");

        if (execCode) {
          evaled = await eval(`(async function() {return ${execCode}})()`);
        } else {
          const embed = await client.embeds.noArgs(command.option.async, message.guild);
          return message.lineReply(embed)
        }
      } else {
        execCode = args.join(" ");
        evaled = await eval(`${execCode}`);
      }

      if (typeof evaled !== "string") evaled = require("util").inspect(evaled);
      if (secArg !== "silent" && secArg !== "s") message.lineReply(evaled, { code: "xl", split: true })
    } catch (error) {
      const embed = client.embeds.red(command, `An error has occured whilst trying to execute that evaluation.\n\n**Code Executed**\n${code}javascript\n${execCode}${code}\n**Error**\n${code}${error.stack}${code}`);

      message.lineReply(embed);
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, true, message, command, extra.logId);
  }
}