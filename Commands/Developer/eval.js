const Discord = require("discord.js");
const Fetch = require("node-fetch");
const googleApis = require("googleapis");
const Paste = require("pastebin-api").default;
const YouTube = require("ytdl-core-discord");
const Chalk = require("chalk");
const Mongoose = require("mongoose");
const Enmap = require("enmap");
const Roblox = require("noblox.js");
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
    const pasteClient = new Paste(client.config.pasteBinAPI);
    const ugKey = `${member.id}-${guild.id}`;

    try {
      var execCode;
      var evaled = null;
      var silent = false;

      if (secArg == "silent") {
        execCode = args.slice(1).join(" ");
        silent = true;
        
        if (execCode) {
          evaled = await eval(`${execCode}`);
        } else {
          const embed = await client.embeds.noArgs(command.option.silent, message.guild);
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
          const embed = await client.embeds.noArgs(command.option.async, message.guild);
          return message.reply({ embeds: [embed] })
        }
      } else {
        execCode = args.join(" ");
        evaled = await eval(`${execCode}`);
      }

      if (typeof evaled !== "string") evaled = require("util").inspect(evaled);
      if (!silent) {
        const msgs = await Discord.splitMessage(evaled);
        var inc = 0;

        for (const msg of msgs) {
          ++inc
          if (inc >= 5) {
            await client.functions.sleep(5000);
            inc = 0;
          }

          message.reply({ content: `${code}xl\n${msg}${code}` });
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