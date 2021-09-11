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
    var reason = client.util.reason;

    if (!channel && secArg) channel = await client.functions.findChannel(secArg, message.guild);
    if (!channel) reason = args.join(" ");
    else reason = args.slice(1).join(" ");

    if (!channel && secArg) {
      reason = args.join(" ")
      channel = message.channel;
    } else if (!channel && !secArg) {
      channel = message.channel
    }

    if (!channel.permissionsFor(message.member).has(command.permissions) && !message.member.roles.cache.has(settings.adminRole)) {
      const embed = client.embeds.permission(command);
      return message.lineReply(embed);
    }

    const lockedData = client.db.channelHides.get(channel.id);

    if (lockedData["hidden"] == false) {
      const alreadyLockedEmbed = client.embeds.error(command, `This channel has not been hidden.`);
      return message.lineReply(alreadyLockedEmbed);
    }

    const pendingEmbed = client.embeds.pending(command, `Un-hiding the channel...`);
    const editMsg = await message.lineReply(pendingEmbed)
    var failed = false;

    try {
      if (settings.adminRole) {
        channel.updateOverwrite(message.guild.roles.everyone, {
          VIEW_CHANNEL: null
        }, `Hid the "${channel.name}" channel. Responsible User: ${message.author.tag}`);

        channel.updateOverwrite(message.member, {
          VIEW_CHANNEL: null
        }, `Hid the "${channel.name}" channel. Responsible User: ${message.author.tag}`);

        channel.updateOverwrite(settings.adminRole, {
          VIEW_CHANNEL: null
        }, `Hid the "${channel.name}" channel. Responsible User: ${message.author.tag}`);
      } else {
        channel.updateOverwrite(message.guild.roles.everyone, {
          VIEW_CHANNEL: null
        }, `Hid the "${channel.name}" channel. Responsible User: ${message.author.tag}`);

        channel.updateOverwrite(message.member, {
          VIEW_CHANNEL: null
        }, `Hid the "${channel.name}" channel. Responsible User: ${message.author.tag}`);
      }
    } catch (error) {
      failed = true;
      const errorEmbed = await client.embeds.errorInfo(command, message, error);

      editMsg.edit(errorEmbed);
    } finally {
      if (failed == false) {
        client.db.channelHides.delete(channel.id);

        const completedEmbed = client.embeds.success(command, `Un-hid \`${channel.name}\` from other members.${reason == client.util.reason || !reason ? `` : `\n\n**Reason**\n${reason}`}`);

        editMsg.edit(completedEmbed)
      }
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, true, message, command, extra.logId);
  }
}