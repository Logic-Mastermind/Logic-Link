const Discord = require("discord.js");
const Buttons = require("discord-buttons");
const Prefix = require("discord-prefix");

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
    var member = message.mentions.members.first();
    if (!member) member = await client.functions.findMember(secArg, message.guild);
    if (secArg == "me") member = message.member

    if (member) {
      const warnings = client.db.userInfo.get(`${member.id}-${member.guild.id}`, "warnings");
      const divided = await client.functions.divideChunk(warnings, 10);

      if (warnings.length == 0) {
        const embed = client.embeds.error(command, `This member has no warnings.`);
        return message.lineReply(embed)
      }

      if (thirdArg) {
        switch(thirdArg) {
          case "c":
          case "clear":
          {
            await client.db.userInfo.set(`${member.id}-${member.guild.id}`, [], "warnings");
            const embed = client.embeds.success(command, `Cleared <@${member.id}>'s warnings.`);
            message.lineReply(embed);
            break;
          }
          case "r":
          case "remove":
          {
            break;
          }
          default:
          {
            const embed = client.embeds.error(command, `\`${thirdArg}\` is not a valid command option.`);
            message.lineReply(embed);
          }
        }
        
        return;
      }

      // const buttonLeft = client.buttons.emoji("Button_Left", "874038583621714020", "grey");
      // const buttonRight = client.buttons.emoji("Button_Right", "874038537169801216", "grey");

      const buttonLeft = client.buttons.grey("<", "buttonLeft");
      const buttonRight = client.buttons.grey(">", "buttonRight");

      if (warnings.length <= 10) {
        buttonLeft.setDisabled();
        buttonRight.setDisabled();
      } else {
        buttonLeft.setDisabled();
      }

      var pages = [];
      var paginationMsg = null;

      for (const [key, val] of Object.entries(divided)) {
        const pageContents = [];
        divided[key].forEach((v, k, a) => {
          const init = `<:IconRole:868117933237358642> Moderator: <@${v.initiator}>`
          const msg = `<:StatusRichPresence:868113305565278218> Warning: ${v.message}`
          const date = `<:IconClock:868118866960728144> Date: <t:${Math.round(v.date / 1000)}:R>`

          pageContents.unshift(`${init}\n${date}\n${msg}`);
        });

        const embed = client.embeds.blue(command, `This member has  a total of \`${warnings.length}\` warnings.\n\n**Member Warnings**\n${pageContents.join("\n\n")}`);

        if (key == 0) {
          paginationMsg = await message.channel.send({ embed: embed, buttons: [buttonLeft, buttonRight]});
        } else {
          pages.push(embed);
        }
      }

      if (pages.length >= 1) {
        client.functions.paginate(paginationMsg, pages)
      }
    } else {
      const embed = client.embeds.noMember(command, secArg);
      message.lineReply(embed);
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, true, message, command);
  }
}