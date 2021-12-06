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
    var user = message.mentions.users.first();
    var reason = client.util.reason;

    if (!user) user = await client.functions.findUser(secArg);
    if (thirdArg) reason = args.slice(1).join(" ");

    if (user) {
      const blacklistInfo = client.db.blacklists.get(user.id);

      if (!blacklistInfo.blacklisted) {
        const embed = client.embeds.error(command, `This user is not blacklisted.`);
        return message.reply({ embeds: [embed] });
      }

      client.db.blacklists.delete(user.id);
      const embed = client.embeds.success(command, `Un-blacklisted <@${user.id}> from Logic Link.`, [{ name: "Reason", value: reason, inline: true }]);
      message.reply({ embeds: [embed] });
      
    } else {
      const embed = client.embeds.noUser(command, secArg);
      message.reply({ embeds: [embed] });
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, message, command, extra.logId);
  }
}