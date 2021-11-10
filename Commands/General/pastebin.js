const Discord = require("discord.js");
const Fetch = require("node-fetch");
const Paste = require("pastebin-api").default;

exports.run = async (client, message, args, command, settings, tsettings, extra) => {
  const clientMember = message.guild.me;
  const guildPrefix = await client.functions.fetchPrefix(message.guild);
  
  const noArgs = await client.functions.getNoArgs(command, message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = await client.functions.getArgs(args);
  const code = `\`\`\``;
  const responses = {};

  try {
    if (secArg == "new") {
      const prompt = {
        title: `What should be the title of this paste?\nYour title should be less than 100 characters.`,
        content: `Please enter the contents of your paste.\nIf your paste is a code snippet, use [code blocks](https://gyazo.com/a0e33771673b102738ff2638c735fd14).`,
        starting: `Starting the pastebin prompt, check your [direct messages](https://www.discord.com/channels/@me/836981683076857867).`
      }

      const title = {
        title: `Paste Title`,
        content: `Paste Content`
      }

      const startEmbed = client.embeds.success(command, prompt.starting);
      await message.reply({ embeds: [startEmbed] });
      
      const embeds = [
        client.embeds.blue(title.title, prompt.title),
        client.embeds.blue(title.content, prompt.content),
      ];

      const filter = (m) => m.author.id == message.author.id;
      const titleMsg = await message.author.send({ embeds: [embeds[0]] });
      const collector = titleMsg.channel.createMessageCollector({ filter, idle: 60 * 1000 });

      var current = "name";
      var currentNum = 1;
      var cancelled = false;
      var finished = false;

      var msgId = [
        titleMsg.id,
        null
      ]

      var collected = {};
      var channel = titleMsg.channel;

      collector.on("collect", async (msg) => {
        const editMsg = channel.messages.cache.get(msgId[currentNum - 1]);

        if (current == "name") {
          if (msg.content.toLowerCase() == "skip") {
            const embed = client.embeds.warn(command, `This question has been skipped.`);
            editMsg.edit({ embeds: [embed] });
            
            current = "content";
            currentNum = 2;
            client.functions.next(channel, msgId, embeds, currentNum);
            return;
          }

          if (msg.content.toLowerCase() == "cancel") {
            const embed = client.embeds.warn(command, `This question has stopped looking for responses.`);
            editMsg.edit({ embeds: [embed] });

            cancelled = true;
            return collector.stop();
          }

          if (msg.content.length > 100) {
            const embed = client.embeds.error(command, `The name cannot be greater than 100 characters.`, [
              { name: "Question", value: prompt.title, inline: false }
            ]);
            return editMsg.edit({ embeds: [embed] });
          }

          collected.title = msg.content;
          const embed = client.embeds.success(command, `Paste name has been set to: \`${collected.title.replaceAll("`", "\u02cb")}\`.`);
          editMsg.edit({ embeds: [embed] });

          current = "content";
          currentNum = 2;
          client.functions.next(channel, msgId, embeds, currentNum);

        } else if (current == "content") {
          if (msg.content.toLowerCase() == "skip") {
            const embed = client.embeds.warn(command, `This is a required field, you may not skip it.`, [
              { name: "Question", value: prompt.content, inline: false }
            ]);
            return editMsg.edit({ embeds: [embed] });
          }

          if (msg.content.toLowerCase() == "cancel") {
            const embed = client.embeds.warn(command, `This question has stopped looking for responses.`);
            editMsg.edit({ embeds: [embed] });

            cancelled = true;
            return collector.stop();
          }

          var format = null;
          var content = msg.content;

          if (msg.content.startsWith("```") && msg.content.endsWith("```")) {
            const code = msg.content.split("```")[1];
            if (msg.content.includes("\n")) {
              const index = code.indexOf("\n");

              format = code.slice(0, index);
              content = code.slice(index + 1);
            } else {
              content = code;
            }
          }

          collected.content = content;
          collected.format = format;

          const embed = client.embeds.success(command, `Paste content has been set to:\n\n${format ? msg.content : `${code}${content.replaceAll("`", "\u02cb")}${code}`}`);

          editMsg.edit({ embeds: [embed] });
          finished = true;
          return collector.stop();
        }
      })

      collector.on("end", async () => {
        if (cancelled == true) {
          const embed = client.embeds.error(command, `This prompt has been cancelled.`);
          channel.send({ embeds: [embed] });

        } else if (finished == true) {
          const pendingEmbed = client.embeds.pending(command, `Generating pastebin link...`);
          const editMsg = await channel.send({ embeds: [pendingEmbed] });

          try {
            const pasteClient = new Paste(client.config.pasteBinAPI);
            const link = await pasteClient.createPaste({
              code: collected.content,
              format: collected.format,
              name: collected.title || "Untitled",
            });

            const embed = client.embeds.success(command, `Pastebin link generated succesfully.`, [
              { name: "Link", value: `${client.util.link} - ${link}`, inline: false }
            ]);

            editMsg.edit({ embeds: [embed] });
          } catch (error) {
            if (error.endsWith("api_paste_format")) {
              const embed = client.embeds.detailed(command, `You have used an invalid language format, this prompt has ended.`);
              return editMsg.edit({ embeds: [embed] });
            }

            const embed = client.embeds.errorInfo(command, message, error);
            channel.send({ embeds: [embed] });
          }
        } else {
          const embed = client.embeds.error(command, `This prompt has timed out due to inactivity.`);
          channel.send({ embeds: [embed] });
        }
      })
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, message, command, extra.logId);
  }
}