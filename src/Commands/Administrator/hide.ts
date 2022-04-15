import Discord from "discord.js";
import Types from "../../Typings/types";

export default async function run(client: Types.client, message: Discord.Message, args: string[], command: Types.commandData, settings: Types.guildSettings, tsettings: Types.ticketSettings, extra: Types.extraObject) {
  
  const clientMember = message.guild.me;
  const guildPrefix = client.functions.fetchPrefix(message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = client.functions.getArgs(args);
  const code = `\`\`\``;
  const responses = {};

  try {
    let channel = message.mentions.channels.first() as Discord.GuildChannel;
    let reason = args.slice(1).join(" ");

    if (!reason) reason = client.util.messages.reason;
    if (!channel) channel = client.functions.findChannel(secArg, message.guild, {
      searchFilter: (c) => c instanceof Discord.GuildChannel
    }) as Discord.GuildChannel;

    if (!channel) {
      const embed = client.embeds.invalidItem(command, ["channel"], [secArg]);
      return message.reply({ embeds: [embed] });
    }

    if (!client.functions.hasPerm(command, message.member) && !client.functions.isAdmin(message.member)) {
      const embed = client.embeds.permission(command);
      return message.reply({ embeds: [embed] });
    }

    if (channel instanceof Discord.ThreadChannel) {
      const embed = client.embeds.error(command, `Thread channels cannot be hidden, please mention a normal channel.`);
      return message.reply({ embeds: [embed] });
    }

    const data: Types.channelHideData = client.db.channelData.get(channel.id)?.hide;
    if (data?.hidden) {
      const embed = client.embeds.error(command, `This channel has already been hidden.`);
      return message.reply({ embeds: [embed] });
    }

    const pendingEmbed = client.embeds.pending(command, `Hiding the channel...`);
    const editMsg = await message.reply({ embeds: [pendingEmbed] });
    let failed = false;

    try {
      channel.permissionOverwrites.edit(message.guild.roles.everyone, { VIEW_CHANNEL: false }, {
        reason: `Hid the "${channel.name}" channel. Responsible User: ${message.author.tag}`,
        type: 0
      });

      channel.permissionOverwrites.edit(message.member, { VIEW_CHANNEL: true }, {
        reason: `Hid the "${channel.name}" channel. Responsible User: ${message.author.tag}`
      });

      if (settings.adminRole) {
        channel.permissionOverwrites.edit(settings.adminRole, { VIEW_CHANNEL: true }, {
          reason: `Hid the "${channel.name}" channel. Responsible User: ${message.author.tag}`
        });
      }
    } catch (error) {
      failed = true;
      const embed = client.embeds.errorInfo(command, message, error);
      editMsg.edit({ embeds: [embed] });

    } finally {
      if (!failed) {
        const options = {
          hidden: true,
          locker: message.member.id,
          lockedAt: Date.now()
        }

        client.db.channelData.set(channel.id, options, "hide");
        const embed = client.embeds.green(command, `Hid <#${channel.id}> from regular server members.\nUse the \`unhide\` command to remove the channel hide.`, [{
          name: "Reason",
          value: reason,
          inline: false
        }]);
        editMsg.edit({ embeds: [embed] });
      }
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, message, command, extra.logId);
  }
}