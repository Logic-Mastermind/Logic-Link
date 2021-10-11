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
    var channel = message.mentions.channels.first();
    var reason = args.slice(1).join(" ");
    var fields = [];

    if (!channel) channel = await client.functions.findChannel(secArg, message.guild);
    if (!reason) reason = client.util.reason;

    if (!channel) {
      const embed = client.embeds.noChannel(command, secArg);
      return message.reply({ embeds: [embed] });
    }

    const memPerms = channel.permissionsFor(message.member).has(command.permissions);
    if (!memPerms && !client.functions.isAdmin(command, message.member, message.guild)) {
      const embed = client.embeds.permission(command);
      return message.reply({ embeds: [embed] });
    }

    const lockedData = client.db.channelLocks.get(channel.id);
    if (!channel.isText()) {
      const embed = client.embeds.error(command, `<#${channel.id}> is not a text based channel.`);
      return message.reply({ embeds: [embed] });
    }

    if (lockedData.locked) {
      const embed = client.embeds.error(command, `This channel has already been locked.`);
      return message.reply({ embeds: [embed] });
    }

    const pendingEmbed = client.embeds.pending(command, `Locking the channel...`);
    const editMsg = await message.reply({ embeds: [pendingEmbed] });
    var failed = false;

    try {
      channel.permissionOverwrites.edit(message.guild.roles.everyone, {
        SEND_MESSAGES: false
      }, `Locked the "${channel.name}" channel. Responsible User: ${message.author.tag}`);

      channel.permissionOverwrites.edit(message.member, {
        SEND_MESSAGES: true
      }, `Locked the "${channel.name}" channel. Responsible User: ${message.author.tag}`);

      if (settings.adminRole) {
        channel.permissionOverwrites.edit(settings.adminRole, {
          SEND_MESSAGES: true
        }, `Locked the "${channel.name}" channel. Responsible User: ${message.author.tag}`);
      }
    } catch (error) {
      failed = true;
      const embed = await client.embeds.errorInfo(command, message, error);
      editMsg.edit({ embeds: [embed] });
      
    } finally {
      if (failed == false) {
        client.db.channelLocks.set(channel.id, true, "locked");
        client.db.channelLocks.set(channel.id, message.author.id, "locker");
        client.db.channelLocks.set(channel.id, channel.id, "channel");
        client.db.channelLocks.set(channel.id, Date.now(), "lockedAt");

        fields[0] = {
          name: "Reason", value: reason, inline: true
        };
        
        const embed = client.embeds.green(command, `Locked <#${channel.id}> from regular server members.\nUse the \`unlock\` command to remove the command lock.`, fields);
        editMsg.edit({ embeds: [embed] });
      }
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, message, command, extra.logId);
  }
}