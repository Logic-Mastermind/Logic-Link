const Discord = require("discord.js");
const Buttons = require("discord-buttons");
const Fetch = require("node-fetch");

exports.run = async (client, message, args, command, settings, tsettings, extra) => {
  const clientMember = message.guild.me;
  const guildPrefix = await client.functions.fetchPrefix(message.guild);
  
  const noArgs = await client.functions.getNoArgs(command, message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = await client.functions.getArgs(args);
  const code = `\`\`\``;
  const responses = {};

  try {
    if (secArg == "view") {
      const blacklists = await Array.from(client.db.blacklists.fetchEverything().filter(x => x.blacklisted).keys());

      const embed = client.embeds.blue(command.option.view, `${blacklists.length == 0 ? `No users are currently blacklisted.` : `A total of \`${blacklists.length}\` user${blacklists.length == 1 ? ` is` : `s are`} currently blacklisted.\n\n**Users**\n<@${blacklists.join(">\n<@")}>`}`);
      return message.lineReply(embed);
    }

    var user = message.mentions.users.first();
    var reason = client.util.reason;

    if (!user) user = await client.functions.findUser(secArg);
    if (thirdArg) reason = args.slice(1).join(" ");

    if (user) {
      const blacklistInfo = client.db.blacklists.get(user.id);

      if (blacklistInfo.blacklisted) {
        const embed = client.embeds.error(command, `This user has already been blacklisted.`);
        return message.lineReply(embed);
      }

      await client.db.blacklists.set(user.id, true, "blacklisted");
      await client.db.blacklists.set(user.id, reason, "reason");
      
      const embed = client.embeds.success(command, `Blacklisted <@${user.id}> from Logic Link.\n\n**Reason**\n${reason}`);
      message.lineReply(embed);
      
    } else {
      const embed = client.embeds.noUser(command, secArg);
      message.lineReply(embed);
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, true, message, command);
  }
}