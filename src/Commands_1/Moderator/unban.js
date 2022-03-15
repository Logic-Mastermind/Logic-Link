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
    let user = message.mentions.users.first();
    let reason = client.util.reason;
    let mentioned = true;

    if (!user) {
      user = await client.functions.findBan(secArg, message.guild);
      mentioned = false;
    }

    if (thirdArg) reason = args.slice(1).join(" ");
    if (user) {
      if (mentioned) {
        const bans = await message.guild.bans.fetch();
        
        if (!bans.get(user.id)) {
          const embed = client.embeds.error(command, `This user is not banned from this server.`);
          return message.reply({ embeds: [embed] });
        }
      }

      message.guild.members.unban(user, reason)
      .then(() => {
        const fields = [];
        if (reason !== client.util.reason) fields[0] = {
          name: "Reason",
          value: reason,
          inline: false
        }

        const caseData = {
          type: "UNBAN",
          user: member.id,
          moderator: message.author.id,
          reason: warning,
          timestamp: Math.round(Date.now() / 1000)
        }

        client.functions.createCase(caseData, settings, message.guild);
        const embed = client.embeds.success(command, `Un-banned <@${user.id}> from the server.`, fields);
        message.reply({ embeds: [embed] });
      })
      .catch(async (error) => {
        const embed = await client.embeds.error(command, message, error);
        message.reply({ embeds: [embed] });
      });
    } else {
      const embed = client.embeds.noUser(command, secArg);
      message.reply({ embeds: [embed] });
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, message, command, extra.logId);
  }
}