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
    var member = message.mentions.members.first();
    if (!member) member = await client.functions.findMember(secArg, message.guild);
    if (secArg.toLowerCase() == "me") member = message.member;

    if (member) {
      const warnings = client.functions.filterCases(settings.cases, member.id, true);

      const fields = [];
      if (warnings.size < 1) {
        const embed = client.embeds.error(command, `This member has no warnings.`);
        return message.reply({ embeds: [embed] });
      }

      if (thirdArg) {
        switch(thirdArg) {
          case "c":
          case "clear":
          {
            const removedCases = new Discord.Collection();
            for (const [id, c] of settings.cases.entries()) {
              if (c.user == member.id) continue;
              removedCases.set(id, c);
            }

            client.db.settings.set(message.guild.id, removedCases, "cases");
            const embed = client.embeds.success(command, `Cleared ${userWarns.size} warning${userWarns.size == 1 ? `` : `s`} from <@${member.id}>.`);
            message.reply({ embeds: [embed] });
            return;
          }
        }
      }

      for await (const [key, val] of warnings.entries()) {
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

      const buttonLeft = client.buttons.emoji("User_Warnings:Left", client.util.arrowLeft, "SECONDARY");
      const buttonRight = client.buttons.emoji("User_Warnings:Right", client.util.arrowRight, "SECONDARY");

      if (fields.size <= 6) {
        buttonLeft.setDisabled();
        buttonRight.setDisabled();
      } else {
        buttonLeft.setDisabled();
      }

      var pages = [];
      var paginationMsg = null;
      var chunks = await client.functions.divideChunk(fields, 6);

      for await (const [key, div] of Object.entries(chunks)) {
        var desc = "";
        if (key == 0) {
          desc = `Viewing all warnings for <@${member.id}>.\nA total of ${warnings.size} warning${warnings.size == 1 ? ` is` : `s are`} shown.`;
        }

        const embed = client.embeds.blue(command, desc, div);
        pages.push(embed);
      }

      const row = client.buttons.actionRow([buttonLeft, buttonRight]);
      paginationMsg = await message.channel.send({ embeds: [pages[0]], components: [row] });
      pages.shift();

      if (pages.length >= 1) {
        client.functions.paginate(paginationMsg, pages, (m) => m.id == message.author.id);
      }
    } else {
      const embed = client.embeds.noMember(command, secArg);
      message.reply({ embeds: [embed] });
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, message, command, extra.logId);
  }
}