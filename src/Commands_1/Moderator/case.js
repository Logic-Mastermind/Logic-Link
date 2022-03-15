const Discord = require("discord.js");
const Fetch = require("node-fetch");

exports.run = async (client, message, args, command, settings, tsettings, extra) => {
  const clientMember = message.guild.me;
  const guildPrefix = await client.functions.fetchPrefix(message.guild);
  
  const noArgs = await client.functions.getNoArgs(command, message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = await client.functions.getArgs(args);
  const code = `\`\`\``;
  const responses = {};

  try {
    let cases = settings.cases;
    let member = message.mentions.members.first();
    let case1 = settings.cases.get(Number(secArg));

    let fields = [];
    let pages = [];

    if (!member) member = await client.functions.findMember(args.join(" "), message.guild);
    if (secArg) if (secArg.toLowerCase() == "me") member = message.member;
    if (member) cases = settings.cases.filter(c => c.user == member.id);

    if (case1) {
      fields = [
        {
          name: `Case \`${case1.id}\``,
          value: `${client.util.moderator} Moderator: <@${case1.moderator}>\n${client.util.members} User: <@${case1.user}>\n${client.util.clock} Timestamp: <t:${case1.timestamp}:R>\n${client.util.application} Action: ${case1.type}\n\u200b`,
          inline: false
        },
        {
          name: `Reason`,
          value: case1.reason,
          inline: false
        }
      ];

      const desc = `Viewing information for moderation case \`${case1.id}\`.`;
      const embed = client.embeds.blue(command, desc, fields);
      return message.reply({ embeds: [embed] });
    }

    if (secArg) {
      if (!isNaN(secArg)) {
        const embed = client.embeds.notValid(command, secArg, "case ID");
        return message.reply({ embeds: [embed] });

      } else {
        if (secArg.toLowerCase() == "clear") {
          client.db.settings.set(message.guild.id, new Map(), "cases");

          const embed = client.embeds.success(command, `Cleared all moderation cases for this server.`);
          return message.reply({ embeds: [embed] });
        }
      }
    }

    if (cases) {
      if (cases.size < 1) {
        const embed = client.embeds.error(command, `No moderation cases were found for ${member ? `that user` : `this server`}.`);
        return message.reply({ embeds: [embed] });
      }

      for await (const [key, val] of cases.entries()) {
        fields.push({
          name: `Case \`${key}\``,
          value: `${client.util.moderator} Moderator: <@${val.moderator}>\n${client.util.members} User: <@${val.user}>\n${client.util.message} Reason: ${val.reason.substring(0, 15).replaceAll("\n", "") + "..."}\n${client.util.clock} Timestamp: <t:${val.timestamp}:R>\n${client.util.application} Action: ${val.type}`,
          inline: true
        });

        if ((key % 2) == 0) {
          fields.push({
            name: "\u200b",
            value: "\u200b",
            inline: true
          });
        }
      }

      const chunks = await client.functions.divideChunk(fields, 6);
      for await (const [key, div] of Object.entries(chunks)) {
        let desc = "";
        if (key == 0) {
          desc = `Viewing all moderation cases for ${member ? `that user` : `this server`}.\nA total of ${cases.size} case${cases.size == 1 ? ` is` : `s are`} shown.`;
        }

        const embed = client.embeds.blue(command, desc, div);
        pages.push(embed);
      }

      const buttonLeft = client.buttons.emoji("Server_Cases:Left", client.util.arrowLeft, "SECONDARY");
      const buttonRight = client.buttons.emoji("Server_Cases:Right", client.util.arrowRight, "SECONDARY");

      if (fields.size <= 6) {
        buttonLeft.setDisabled();
        buttonRight.setDisabled();
      } else {
        buttonLeft.setDisabled();
      }

      const row = client.buttons.actionRow([buttonLeft, buttonRight]);
      const paginationMsg = await message.channel.send({ embeds: [pages[0]], components: [row] });
      pages.shift();

      const filter = (m) => m.id == message.author.id;
      if (pages.length >= 1) client.functions.paginate(paginationMsg, pages, filter);
      return;
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, message, command, extra.logId);
  }
}