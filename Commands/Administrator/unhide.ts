import Discord from "discord.js";
import Types from "../../Typings/types";

export default async function run(client: Types.client, message: Discord.Message, args: string[], command: Types.commandData, settings: Types.guildSettings, tsettings: Types.ticketSettings, extra: Types.extraObject) {
  
  const clientMember = message.guild.me;
  const guildPrefix = client.functions.fetchPrefix(message.guild);
  
  const noArgs = client.functions.getNoArgs(command, message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = client.functions.getArgs(args);
  const code = `\`\`\``;
  const responses = {};

  try {
    var channel = message.mentions.channels.first() as Types.guildChannel;
    var reason = args.slice(1).join(" ");

    if (!reason) reason = client.util.messages.reason;
    if (!channel) channel = client.functions.findChannel(secArg, message.guild) as Types.guildChannel;

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
    if (!data?.hidden) {
      const embed = client.embeds.error(command, `This channel has not been hidden.`);
      return message.reply({ embeds: [embed] });
    }

    const pendingEmbed = client.embeds.pending(command, `Un-hiding the channel...`);
    const editMsg = await message.reply({ embeds: [pendingEmbed] });
    var failed = false;

    try {
      channel.permissionOverwrites.edit(message.guild.roles.everyone, { VIEW_CHANNEL: null }, {
        reason: `Un-hid the "${channel.name}" channel. Responsible User: ${message.author.tag}`,
        type: 0
      });

      channel.permissionOverwrites.edit(message.member, { VIEW_CHANNEL: null }, {
        reason: `Un-hid the "${channel.name}" channel. Responsible User: ${message.author.tag}`
      });

      if (settings.adminRole) {
        channel.permissionOverwrites.edit(settings.adminRole, { VIEW_CHANNEL: null }, {
          reason: `Un-hid the "${channel.name}" channel. Responsible User: ${message.author.tag}`
        });
      }
    } catch (error) {
      failed = true;
      const embed = client.embeds.errorInfo(command, message, error);
      editMsg.edit({ embeds: [embed] });

    } finally {
      if (!failed) {
        client.db.channelData.set(channel.id, {}, "hide");
        const embed = client.embeds.success(command, `Un-hid <#${channel.id}> from regular server members.`, [{
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