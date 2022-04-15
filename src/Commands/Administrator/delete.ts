import Discord from "discord.js";
import Types from "../../Typings/types";

export default async function run(client: Types.client, message: Discord.Message, args: string[], command: Types.commandData, settings: Types.guildSettings, tsettings: Types.ticketSettings, extra: Types.extraObject) {
  
  const clientMember = message.guild.me;
  const guildPrefix = client.functions.fetchPrefix(message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = client.functions.getArgs(args);
  const code = `\`\`\``;
  const responses = {};
  
  try {
    let role: Discord.Role = message.mentions.roles.first() ;
    let channel = message.mentions.channels.first() as Types.guildChannel;
    let seenWarning = client.db.userGlobal.get(message.author.id, "deleteCmdWarning");

    if (!role) role =  client.functions.findRole(args.join(" "), message.guild, { safe: true });
    if (!channel) channel = client.functions.findChannel(args.join(" "), message.guild, { safe: true });

    if (!seenWarning) {
      const prompt = new client.prompt(message, command);
      return prompt.deleteConfirmation();
    }

    async function deleteRole() {
      if (!client.functions.hasPerm(command.option.role, message.member)) {
        const embed = client.embeds.permission(command.option.role);
        return message.reply({ embeds: [embed] });
      }

      if (!clientMember.permissions.has(command.option.role.permissions)) {
        const embed = client.embeds.botPermission(command.option.role);
        return message.reply({ embeds: [embed] });
      }

      if (client.functions.hierarchy(clientMember, role)) {
        const clientTopRole = clientMember.roles.highest;
        const embed = client.embeds.detailed(command, client.util.messages.botHierarchy, `Mentioned Role - <@&${role.id}>: Position \`${role.position}\``, `My Top Role - <@&${clientTopRole.id}>: Position \`${clientTopRole.position}\`.`);
        return message.reply({ embeds: [embed] });
      }

      if (client.functions.hierarchy(message.member, role)) {
        const embed = client.embeds.detailed(command, client.util.messages.hierarchy, `Mentioned Role - <@&${role.id}>: Position \`${role.position}\``, `Your Top Role - <@&${message.member.roles.highest.id}>: Position \`${message.member.roles.highest.position}\`.`);
        return message.reply({ embeds: [embed] });
      }

      const pendingEmbed = client.embeds.pending(command.option.role, `Deleting the role...`);
      const editMsg = await message.reply({ embeds: [pendingEmbed] });

      role.delete()
      .then(() => {
        const embed = client.embeds.success(command.option.role, `Deleted the \`${role.name}\` role.`);
        editMsg.edit({ embeds: [embed] });
      })
      .catch((error) => {
        const embed = client.embeds.errorInfo(command.option.role, message, error);
        editMsg.edit({ embeds: [embed] });
      })
    }

    async function deleteChannel() {
      const hasPerm = channel.permissionsFor(message.member).has(command.option.channel.permissions);
      const hasPermBot = channel.permissionsFor(clientMember).has(command.option.channel.permissions);

      if (!hasPerm && !client.functions.isAdmin(message.member)) {
        const embed = client.embeds.permission(command.option.channel);
        return message.reply({ embeds: [embed] });
      }

      if (!hasPermBot) {
        const embed = client.embeds.botPermission(command.option.channel);
        return message.reply({ embeds: [embed] });
      }

      const pendingEmbed = client.embeds.pending(command.option.channel,`Deleting the channel...`);
      const editMsg = await message.reply({ embeds: [pendingEmbed] });

      channel.delete()
      .then((c: Types.guildChannel) => {
        if (c.id == message.channel.id) return;
        const embed = client.embeds.success(command.option.channel, `Deleted the \`${channel.name}\` channel.`);

        editMsg.edit({ embeds: [embed] });
      })
      .catch((error) => {
        const embed = client.embeds.errorInfo(command.option.channel, message, error);
        editMsg.edit({ embeds: [embed] });
      })
    }

    if (role && channel) {
      const embed = client.embeds.warn(command, `Both a role and channel have been found, which one would you like to delete?`, [{
        name: "Detailed Info",
        value: `${client.util.emojis.roleIcon} Role: <@&${role.id}>\n${client.util.emojis.channel} Channel: <#${channel.id}>`,
        inline: false
      }]);

      const roleButton = client.components.button({ label: "Role", emoji: "868117933237358642", style: "PRIMARY", id: "DeleteCmd:Role" });
      const channelButton = client.components.button({ label: "Channel", emoji: "868119367689334834", style: "PRIMARY", id: "DeleteCmd:Channel" });

      const row = client.components.actionRow(roleButton, channelButton);
      const msg = await message.reply({ embeds: [embed], components: [row] });
      const collector = msg.createMessageComponentCollector({ time: 60_000 });

      collector.on("collect", async (int) => {
        if (int.user.id !== message.author.id) {
          return int.reply({ embeds: [client.embeds.notComponent()], ephemeral: true });
        }
        
        if (int.customId.endsWith("Role")) deleteRole();
        else deleteChannel();

        collector.stop("completed");
        msg.delete();
      })

      collector.on("end", async (_, reason) => {
        if (reason == "completed") return;
        msg.reply({ embeds: [client.embeds.inactivity(command)] });
        msg.delete();
      })

      return;
    }

    if (role) return deleteRole();
    if (channel) return deleteChannel();
    if (!role && !channel) {
      const embed = client.embeds.invalidItem(command, ["role", "channel"], [secArg, secArg]);
      message.reply({ embeds: [embed] });
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, message, command, extra.logId);
  }
}