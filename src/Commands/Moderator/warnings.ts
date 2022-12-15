import Discord from "discord.js";
import Types from "../../types";

export default async function run(client: Types.client, message: Discord.Message, args: string[], command: Types.commandData, settings: Types.guildSettings, tsettings: Types.ticketSettings, extra: Types.extraObject) {
  
  const clientMember = message.guild.me;
  const guildPrefix = client.functions.fetchPrefix(message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = client.functions.getArgs(args);
  const code = `\`\`\``;

  try {
    let member = message.mentions.members.first();
    if (!member) member = client.functions.findMember(secArg, message.guild);
    if (secArg.toLowerCase() == "me") member = message.member;

    if (member) {
      const warnings = client.functions.filterCases(settings.cases, { user: member.id });

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
            const embed = client.embeds.success(command, `Cleared ${warnings.size} warning${warnings.size == 1 ? `` : `s`} from <@${member.id}>.`);
            message.reply({ embeds: [embed] });
            return;
          }
        }
      }

      for await (const [key, val] of warnings.entries()) {
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

      const buttonLeft = client.components.button({ id: "User_Warnings:Left", style: "SECONDARY", emoji: client.util.emojis.arrowLeft });
      const buttonRight = client.components.button({ id: "User_Warnings:Right", style: "SECONDARY", emoji: client.util.emojis.arrowRight });

      if (fields.length <= 6) {
        buttonLeft.setDisabled();
        buttonRight.setDisabled();
      } else {
        buttonLeft.setDisabled();
      }

      let pages = [];
      let paginationMsg = null;
      let chunks = client.functions.divideChunk(fields, 6);

      for await (const [key, div] of chunks.entries()) {
        let desc = "";
        if (key == 0) {
          desc = `Viewing all warnings for <@${member.id}>.\nA total of ${warnings.size} warning${warnings.size == 1 ? ` is` : `s are`} shown.`;
        }

        const embed = client.embeds.blue(command, desc, div);
        pages.push(embed);
      }

      const row = client.components.actionRow(buttonLeft, buttonRight);
      paginationMsg = await message.channel.send({ embeds: [pages[0]], components: [row] });
      pages.shift();

      if (pages.length >= 1) {
        client.functions.paginate(paginationMsg, pages, { filter: (m) => m.id == message.author.id });
      }
    } else {
      const embed = client.embeds.invalidItem(command, ["member"], [secArg]);
      message.reply({ embeds: [embed] });
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, message, command, extra.logId);
  }
}