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
    var cases = settings.cases;
    var member = message.mentions.members.first();
    var case1 = settings.cases.get(Number(secArg));

    var fields = [];
    var pages = [];

    if (!member) member = await client.functions.findMember(args.join(" "), message.guild);
    if (secArg) if (secArg.toLowerCase() == "me") member = message.member;
    if (member) cases = settings.cases.filter(c => c.user == member.id);

    if (case1) {
      fields.push({
        name: `Case \`${case1.id}\``,
        value: `${client.util.moderator} Moderator: <@${case1.moderator}>\n${client.util.members} User: <@${case1.user}>\n${client.util.message} Reason: ${case1.reason}\n${client.util.clock} Timestamp: <t:${case1.timestamp}:R>\n${client.util.application} Action: ${case1.type}`,
        inline: false
      });

      const desc = `Viewing information for moderation case \`${case1.id}\`.`;
      const embed = client.embeds.blue(command, desc, fields);
      return message.reply({ embeds: [embed] });
    }

    if (cases) {
      if (cases.size < 1) {
        const embed = client.embeds.error(command, `No moderation cases were found for ${member ? `that user` : `this server`}.`);
        return message.reply({ embeds: [embed] });
      }

      for await (const [key, val] of cases.entries()) {
        fields.push({
          name: `Case \`${key}\``,
          value: `${client.util.moderator} Moderator: <@${val.moderator}>\n${client.util.members} User: <@${val.user}>\n${client.util.message} Reason: ${val.reason}\n${client.util.clock} Timestamp: <t:${val.timestamp}:R>\n${client.util.application} Action: ${val.type}`,
          inline: false
        });
      }

      const chunks = await client.functions.divideChunk(fields, 5);
      for await (const [key, div] of Object.entries(chunks)) {
        var desc = "";
        if (key == 0) {
          desc = `Viewing all moderation cases for ${member ? `that user` : `this server`}.\nA total of ${cases.size} case${cases.size == 1 ? ` is` : `s are`} shown.`;
        }

        const embed = client.embeds.blue(command, desc, div);
        pages.push(embed);
      }

      const buttonLeft = client.buttons.emoji("Server_Cases:Left", client.util.arrowLeft, "SECONDARY");
      const buttonRight = client.buttons.emoji("Server_Cases:Right", client.util.arrowRight, "SECONDARY");

      if (cases.size <= 5) {
        buttonLeft.setDisabled();
        buttonRight.setDisabled();
      } else {
        buttonLeft.setDisabled();
      }

      const row = client.buttons.actionRow([buttonLeft, buttonRight]);
      const paginationMsg = await message.channel.send({ embeds: [pages[0]], components: [row] });
      pages.shift();

      if (pages.length >= 1) client.functions.paginate(paginationMsg, pages);
      return;
    }

    if (isNaN(secArg)) {
      cases = client.db.userInfo.get(`${member.id}-${message.guild.id}`);

    } else {
      var caseId = settings.cases.get(Number(secArg));
      if (caseId) {

      } else {
        const embed = client.embeds.notValid(command, secArg, "case ID");
        message.reply({ embeds: [embed] });
      }
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, message, command, extra.logId);
  }
}