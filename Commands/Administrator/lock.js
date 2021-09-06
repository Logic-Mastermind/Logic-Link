const Discord = require("discord.js");
const Buttons = require("discord-buttons");
const Fetch = require("node-fetch");

exports.run = async (client, message, args, command, settings, tsettings, extra) => {
  const clientMember = message.guild.me;
  const guildPrefix = await client.functions.fetchPrefix(message.guild);
  
  const noArgs = await client.functions.getNoArgs(command, message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = await client.functions.getArgs(args);
  const code = `\`\`\``;

  const responses = {
    
  }

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

    const lockedData = client.db.channelLocks.get(channel.id);

    if (channel.type == "voice" || channel.type == "category") {
      const invalidEmbed = client.embeds.error(command, `<#${channel.id}> is not a text channel.`);
      return message.lineReply(invalidEmbed);
    }

    if (lockedData["locked"] == true) {
      const alreadyLockedEmbed = client.embeds.error(command, `This channel has already been locked.`);
      return message.lineReply(alreadyLockedEmbed);
    }

    const pendingEmbed = client.embeds.pending(command, `Locking the channel...`);
    const editMsg = await message.lineReply(pendingEmbed)
    var failed = false;

    try {
      channel.updateOverwrite(message.guild.roles.everyone, {
        SEND_MESSAGES: false
      }, `Locked the "${channel.name}" channel. Responsible User: ${message.author.tag}`);

      channel.updateOverwrite(message.member, {
        SEND_MESSAGES: true
      }, `Locked the "${channel.name}" channel. Responsible User: ${message.author.tag}`);

      if (settings.adminRole) {
        channel.updateOverwrite(settings.adminRole, {
          SEND_MESSAGES: true
        }, `Locked the "${channel.name}" channel. Responsible User: ${message.author.tag}`);
      }
    } catch (error) {
      failed = true;
      const errorEmbed = client.embeds.errorInfo(command, message, error);

      editMsg.edit(errorEmbed);
    } finally {
      if (failed == false) {
        client.db.channelLocks.set(channel.id, true, "locked");
        client.db.channelLocks.set(channel.id, message.author.id, "locker");
        client.db.channelLocks.set(channel.id, channel.id, "channel");
        client.db.channelLocks.set(channel.id, Date.now(), "lockedAt");

        const completedEmbed = client.embeds.success(command, `Locked <#${channel.id}> from other members.${reason == client.util.reason || !reason? `` : `\n\n**Reason**\n${reason}`}`);

        editMsg.edit(completedEmbed)
      }
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, true, message, command);
  }
}