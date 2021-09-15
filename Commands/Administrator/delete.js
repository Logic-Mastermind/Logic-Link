const Discord = require("discord.js");
const Fetch = require("node-fetch");

exports.run = async (client, message, args, command, settings, tsettings, extra) => {
  const clientMember = message.guild.me;
  const guildPrefix = await client.functions.fetchPrefix(message.guild);
  
  const noArgs = await client.functions.getNoArgs(command, message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = await client.functions.getArgs(args);
  const code = `\`\`\``;

  const responses = {
    conditions: `This command is able to delete roles and channels based on partial names without warning. Please be careful when using this command, if you don't feel comfortable providing a partial name, remember that you can always just mention the role or channel to be sure that you are deleting the right one.\n\nBy clicking the "Accept" button below, you acknowledge the conditions above and understand that you will be fully responsible for roles and channels deleted with this command.`
  }
  
  try {
    var role = message.mentions.roles.first();
    var channel = message.mentions.channels.first();
    var firstTime = client.db.first.get(message.author.id, "deleteCmd");

    if (!role) role = await client.functions.findRole(args.join(" "), message.guild, true);
    if (!channel) channel = await client.functions.findChannel(args.join(" "), message.guild, true);
    if (firstTime) return await client.prompts.deleteConfirmation(message, command, responses);

    async function deleteRole() {
      if (!client.functions.hasPerm(command.option.role, message.member, message.guild, settings)) {
        const embed = client.embeds.permission(command.option.role);
        return message.reply({ embeds: [embed] });
      }

      if (!clientMember.permissions.has(command.option.role.permissions)) {
        const embed = client.embeds.botPermission(command.option.role);
        return message.reply({ embeds: [embed] });
      }

      if (client.functions.hierarchy(clientMember, role, message.guild)) {
        const clientTopRole = clientMember.roles.highest;
        const embed = client.embeds.detailed(command, client.util.botHierarchy, `Mentioned Role - <@&${role.id}>: Position \`${role.position}\``, `My Top Role - <@&${clientTopRole.id}>: Position \`${clientTopRole.position}\`.`);
        return message.reply({ embeds: [embed] });
      }

      if (client.functions.hierarchy(message.member, role, message.guild)) {
        const embed = client.embeds.detailed(command, client.util.hierarchy, `Mentioned Role - <@&${role.id}>: Position \`${role.position}\``, `Your Top Role - <@&${message.member.roles.highest.id}>: Position \`${message.member.roles.highest.position}\`.`);
        return message.reply({ embeds: [embed] });
      }

      const pendingEmbed = client.embeds.pending(command.option.role, `Deleting the role...`);
      const editMsg = await message.reply({ embeds: [pendingEmbed] });

      role.delete()
      .then(() => {
        const embed = client.embeds.success(command.option.role, `Deleted the \`${role.name}\` role.`);
        editMsg.edit({ embeds: [embed] });
      })
      .catch(async (error) => {
        const embed = await client.embeds.errorInfo(command.option.role, message, error);
        editMsg.edit({ embeds: [embed] });
      })
    }

    async function deleteChannel() {
      const hasPerm = channel.permissionsFor(message.member).has(command.option.channel.permissions);
      const hasPermBot = channel.permissionsFor(clientMember).has(command.option.channel.permissions);

      if (!hasPerm && !client.functions.isAdmin(message.member, message.guild, settings)) {
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
      .then((c) => {
        if (c.id == message.channel.id) return;
        const embed = client.embeds.success(command.option.channel, `Deleted the \`${channel.name}\` channel.`);

        editMsg.edit({ embeds: [embed] });
      })
      .catch(async (error) => {
        const embed = await client.embeds.errorInfo(command.option.channel, message, error);
        editMsg.edit({ embeds: [embed] });
      })
    }

    if (role) return deleteRole();
    if (channel) return deleteChannel();
    if (!role && !channel) {
      const embed = client.embeds.noRolesOrChannels(command, args.join(" "));
      message.reply({ embeds: [embed] });
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, true, message, command, extra.logId);
  }
}