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
    var channel = message.mentions.channels.first();
    var role = message.mentions.roles.first();

    if (!channel) channel = client.functions.findChannel(thirdArg, message.guild);
    if (!role) role = client.functions.findRole(thirdArg, message.guild);

    if (!channel && !role) {
      const errorEmbed = client.embeds.noRolesOrChannels(command, thirdArg);
      return message.lineReply(errorEmbed);
    }

    switch (secArg) {
      case "n":
      case "nm":
      case "name":
      {
        var oldName = null;
        var newName = args.slice(2).join(" ");

        if (channel) {
          oldName = channel.name;
          if (!channel.permissionsFor(clientMember).has("MANAGE_CHANNEL")) {
            const embed = client.embeds.botPermissionCustom(command, `I do not have the required permissions in the <#${channel.id}> channel.`);
            return message.lineReply(embed);
          }

          if (!channel.permissionsFor(message.member).has("MANAGE_CHANNEL")) {
            const embed = client.embeds.permission(command);
            return message.lineReply(embed);
          }

          channel.setName(newName, `Changed the name of the #${oldName} channel. Responsible User: ${message.author.tag}`)
          .then(() => {
            const embed = client.embeds.success(command, `Changed the \`${oldName}\` channel name to <#${channel.id}>.`);
            message.lineReply(embed);
          })
          .catch(async (error) => {
            const embed = await client.embeds.errorInfo(command, message, error);
            message.lineReply(embed);
          })
        } else if (role) {
          oldName = role.name;
        }
        break;
      }
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, true, message, command, extra.logId);
  }
}