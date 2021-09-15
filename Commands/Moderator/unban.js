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
    var reason = "No reason was provided.";

    if (!user) user = await client.functions.findBan(secArg, message.guild);
    if (thirdArg) reason = args.slice(1).join(" ");


    if (user) {
      if (!clientMember.hasPermission(command.clientPerms)) {
        const embed = client.embeds.botPermission(command);
        return message.lineReply(embed);
      }

      const guildBans = await message.guild.fetchBans();
      if (guildBans.get(user.id)) {
        message.guild.members.unban(user, reason)
        .then(() => {
          const embed = client.embeds.success(command, `Un-banned <@${user.id}> from the server.\n\n**Reason**\n${reason}`);

          message.lineReply(embed);
        })
        .catch(async (error) => {
          const embed = await client.embeds.error(command, message, error);
          message.lineReply(embed);
        })
      } else {
        const embed = client.embeds.error(command, `This user is not banned.`);
        message.lineReply(embed);
      }
    } else {
      const embed = client.embeds.noMember(command, secArg);
      message.lineReply(embed);
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, true, message, command);
  }
}