const Discord = require("discord.js");
const Buttons = require("discord-buttons");
const Fetch = require("node-fetch");

exports.run = async (client, message, args, command, settings, tsettings, extra) => {
  const clientMember = message.guild.me;
  const guildPrefix = await client.functions.fetchPrefix(message.guild);
  
  const noArgs = await client.functions.getNoArgs(command, message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = await client.functions.getArgs(args);
  const code = `\`\`\``;

  const responses = {
    error: `I have failed to generate the avatar, please try again later.`,
    errorUser: `Failed to find the user \`${args.join(" ")}\` in the server.`
  }

  try {
    if (secArg == "new") {
      const prompt = {
        name: {
          description: `What is the name of this paste?`
        },
        content: {
          description: `Please enter the contents of your paste.\nIf your paste is a code snippet, use [code blocks](https://gyazo.com/a0e33771673b102738ff2638c735fd14).`
        }
      }

      const promptStartEmbed = client.embeds.green(command, `Starting the pastebin prompt, check your [direct messages](https://www.discord.com/channels/@me/836981683076857867).`);

      const nameEmbed = client.embeds.blue(command, prompt.name.description);
      const contentEmbed = client.embeds.blue(command, prompt.content.description);

      var nameMsgId = null;
      var contentMsgId = null;

      await message.channel.send(promptStartEmbed)
      const dmMessage = await message.author.send(nameEmbed)
      nameMsgId = dmMessage.id

      var current = 1;
      var cancelled = false;
      var finished = false;

      const filter = (m) => m.author.id == message.author.id;
      const collector = new Discord.MessageCollector(dmMessage.channel, filter, { idle: 60 * 1000 })

      var collectedName = null;
      var collectedContent = null;

      collector.on("collect", async (msg) => {
        async function next(num) {
          switch (num) {
            case 1:
            {
              msg.channel.send(nameEmbed).then((m) => nameMsgId = m.id);
              break;
            }
            case 2:
            {
              msg.channel.send(contentEmbed).then((m) => contentMsgId = m.id);
              break;
            }
          }
        }

        if (current == 1) {
          const editMsg = await msg.channel.messages.fetch(nameMsgId);
          if (msg.content.toLowerCase() == "skip") {
            const noSkipEmbed = client.embeds.error(command, `This question has been skipped.`);

            editMsg.edit(noSkipEmbed)
            current = 2;
            return next(2)
          }

          if (msg.content.toLowerCase() == "cancel") {
            const cancelledEmbed = client.embeds.error(command, `This question has stopped looking for responses.`);

            editMsg.edit(cancelledEmbed)
            cancelled = true
            return collector.stop()
          }

          if (msg.content.length > 100) {
            const errorEmbed = client.embeds.error(command, `The name cannot be greater than 100 characters.\n\n**Question**\n${prompt.name.description}`);

            return editMsg.edit(errorEmbed);
          }

          collectedName = msg.content;
          const successEmbed = client.embeds.success(command, `Paste name has been set to: \`${collectedName}\`.`);

          editMsg.edit(successEmbed)
          current = 2;
          next(2)
        } else if (current == 2) {
          const editMsg = await msg.channel.messages.fetch(contentMsgId)
          if (msg.content.toLowerCase() == "skip") {
            const noSkipEmbed = client.embeds.error(command, `This is a required field, you may not skip it.\n\n**Question**\n${prompt.content.description}`)

            return editMsg.edit(noSkipEmbed)
          }

          if (msg.content.toLowerCase() == "cancel") {
            const cancelledEmbed = client.embeds.error(command, `This question has stopped looking for responses.`);

            editMsg.edit(cancelledEmbed)
            cancelled = true
            return collector.stop()
          }

          collectedContent = msg.content;
          const successEmbed = client.embeds.success(command, `Paste content has been set to:\n${code}${collectedContent}${code}`);

          editMsg.edit(successEmbed)
          finished = true
          return collector.stop()
        }
      })

      collector.on("end", async (collected) => {
        if (cancelled == true) {
          const cancelledEmbed = client.embeds.error(command, `This prompt has been cancelled.`);

          message.author.send(cancelledEmbed)
        } else if (finished == true) {
          const pendingEmbed = client.embeds.pending(command, `Generating pastebin link...`);
          const pendingMsg = await message.author.send(pendingEmbed);

          try {
            const pasteClient = new Paste(client.config.pasteBinAPI);
            const link = await pasteClient.createPaste({
              code: collectedContent,
              expireDate: "N",
              name: collectedName,
              publicity: 0,
            });

            const code = link.split("https://pastebin.com/")[1];
            const rawLink = `https://pastebin.com/raw/${code}`;
            const downloadLink = `https://pastebin.com/dl/${code}`;
            const cloneLink = `https://pastebin.com/clone/${code}`;
            const embedLink = `https://pastebin.com/embed/${code}`;
            const printLink = `https://pastebin.com/print/${code}`;

            const linkEmbed = client.embeds.success(command, `Pastebin link generated succesfully.\n\n**Link**\n<:MessageLink:868115215340941322> - ${link}`);

            pendingMsg.edit(linkEmbed)
          } catch (error) {
            const errorEmbed = client.embeds.errorInfo(command, error, client);
            message.author.send(errorEmbed);
          }
        } else {
          const timeoutEmbed = client.embed.error(command, `This prompt has timed out due to inactivity.`);
          message.author.send(timeoutEmbed)
        }
      })
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, true, message, command);
  }
}