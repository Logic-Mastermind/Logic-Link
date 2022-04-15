import Discord from "discord.js";
import Types from "../../Typings/types";

export default async function run(client: Types.client, message: Discord.Message, args: string[], command: Types.commandData, settings: Types.guildSettings, tsettings: Types.ticketSettings, extra: Types.extraObject) {
  
  const clientMember = message.guild.me;
  const guildPrefix = client.functions.fetchPrefix(message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = client.functions.getArgs(args);
  const code = `\`\`\``;
  const responses = {};

  try {
    let cases = settings.cases;
    let member = message.mentions.members.first();
    let case1 = settings.cases.get(Number(secArg));

    let fields = [];
    let pages = [];

    if (!member) member = client.functions.findMember(args.join(" "), message.guild);
    if (secArg) if (secArg.toLowerCase() == "me") member = message.member;
    if (member) cases = settings.cases.filter(c => c.user == member.id);

    if (case1) {
      fields = [
        {
          name: `Case \`${case1.id}\``,
          value: `${client.util.emojis.roleIcon} Moderator: <@${case1.moderator}>\n${client.util.emojis.members} User: <@${case1.user}>\n${client.util.emojis.clock} Timestamp: <t:${case1.timestamp}:R>\n${client.util.emojis.application} Action: ${case1.type}\n\u200b`,
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
      if (!isNaN(Number(secArg))) {
        const embed = client.embeds.invalidItem(command, ["case ID"], [secArg]);
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
          value: `${client.util.emojis.roleIcon} Moderator: <@${val.moderator}>\n${client.util.emojis.members} User: <@${val.user}>\n${client.util.emojis.message} Reason: ${val.reason.substring(0, 15).replaceAll("\n", "") + "..."}\n${client.util.emojis.clock} Timestamp: <t:${val.timestamp}:R>\n${client.util.emojis.application} Action: ${val.type}`,
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

      const chunks = client.functions.divideChunk(fields, 6);
      for await (const [key, div] of chunks.entries()) {
        let desc = "";
        if (key == 0) {
          desc = `Viewing all moderation cases for ${member ? `that user` : `this server`}.\nA total of ${cases.size} case${cases.size == 1 ? ` is` : `s are`} shown.`;
        }

        const embed = client.embeds.blue(command, desc, div);
        pages.push(embed);
      }

      const buttonLeft = client.components.button({ id: "Server_Cases:Left", style: "SECONDARY", emoji: client.util.emojis.arrowLeft });
      const buttonRight = client.components.button({ id: "Server_Cases:Right", style: "SECONDARY", emoji: client.util.emojis.arrowRight });

      if (fields.length <= 6) {
        buttonLeft.setDisabled();
        buttonRight.setDisabled();
      } else {
        buttonLeft.setDisabled();
      }

      const row = client.components.actionRow(buttonLeft, buttonRight);
      const paginationMsg = await message.channel.send({ embeds: [pages[0]], components: [row] });
      pages.shift();

      if (pages.length >= 1) client.functions.paginate(paginationMsg, pages, { filter: (m) => m.id == message.author.id });
      return;
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, message, command, extra.logId);
  }
}