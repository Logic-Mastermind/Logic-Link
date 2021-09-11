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
    conditions: `This command is able to delete roles and channels based on partial names without warning. Please be careful when using this command, if you don't feel comfortable providing a partial name, remember that you can always just mention the role or channel to be sure that you are deleting the right one.\n\nBy clicking the "Accept" button below, you acknowledge the conditions above and understand that you will be fully responsible for roles and channels deleted with this command.`,
    botHierarchy: `This role has a higher or equal position as my top role.\n\n**Detailed Info**\n`,
    hierarchy: `This role has a higher or equal position as your top role.\n\n**Detailed Info**\n`
  }
  
  try {
    var role = message.mentions.roles.first();
    var channel = message.mentions.channels.first();
    const firstTime = client.db.first.get(message.author.id, "deleteCmd")

    if (!role) role = await client.functions.findRole(args.join(" "), message.guild, true);
    if (!channel) channel = await client.functions.findChannel(args.join(" "), message.guild, true);

    if (firstTime == true) {
      const conditionsEmbed = client.embeds.confirmation(command, responses.conditions);
      const filter = (button) => true;
      var clicked = false;

      const acceptButton = client.buttons.accept("Delete_Conditions_Accept");
      const declineButton = client.buttons.decline("Delete_Conditions_Decline");

      const msg = await message.channel.send(conditionsEmbed, { buttons: [acceptButton, declineButton] });
      const collector = msg.createButtonCollector(filter, { idle: 60000 });

      collector.on("collect", async (button) => {
        const btnClicker = await button.clicker.user;
        const acceptEmbed = client.embeds.success(command,`Accepted the delete command conditions.`);
        const declineEmbed = client.embeds.error(command, `Declined the delete command conditions.`);

        if (btnClicker.id == message.author.id) {
          clicked = true
          if (button.id == "Delete_Conditions_Accept") {
            client.db.first.set(btnClicker.id, false, "deleteCmd")
            msg.edit(acceptEmbed, null)
            button.reply.defer()
          } else if (button.id == "Delete_Conditions_Decline") {
            msg.edit(declineEmbed, null)
            button.reply.defer()
          }
        }

        if (btnClicker.id !== message.author.id) {
          if (button.id == "Delete_Conditions_Accept") {
            client.db.first.set(btnClicker.id, false, "deleteCmd")
            button.reply.send(``, { embed: acceptEmbed, ephemeral: true })
          } else if (button.id == "Delete_Conditions_Decline") {
            button.reply.send(``, { embed: declineEmbed, ephemeral: true })
          }
        }
      })

      collector.on("end", async (collected) => {
        if (clicked == false) {
          const errorEmbed = client.embeds.error(command, `This prompt has ended due to inactivity.`)
          msg.edit(errorEmbed, null)
        }
      })
      return;
    }

    async function deleteRole() {
      const pendingEmbed = client.embeds.pending(command.option.role, `Deleting the role...`)
      const editMsg = await message.lineReply(pendingEmbed);

      if (!message.member.hasPermission(command.option.role.permissions) && message.member.roles.cache.has(settings.adminRole)) {
        const embed = client.embeds.permission(command.option.role);
        return editMsg.edit(embed);
      }

      if (!clientMember.hasPermission(command.option.role.permissions)) {
        const embed = client.embeds.botPermission(command.option.role);
        return editMsg.edit(embed);
      }

      if (clientMember.roles.highest.position <= role.position) {
        const clientTopRole = clientMember.roles.highest;
        const embed = client.embeds.error(command, `${responses.botHierarchy}Mentioned Role - <@&${role.id}>: Position \`${role.position}\`\nMy Top Role - <@&${clientTopRole.id}>: Position \`${clientTopRole.position}\`.`);
        return editMsg.edit(embed);
      }

      if (message.author.id !== message.guild.owner.id) {
        if (message.member.roles.highest.position <= role.position) {
          const embed = client.embeds.error(command, `${responses.hierarchy}Mentioned Role - <@&${role.id}>: Position \`${role.position}\`\nYour Top Role - <@&${message.member.roles.highest.id}>: Position \`${message.member.roles.highest.position}\`.`);
          return editMsg.edit(embed);
        }
      }

      role.delete()
      .then(() => {
        const embed = client.embeds.success(command.option.role, `Deleted the \`${role.name}\` role.`);
        editMsg.edit(embed);
      })
      .catch(async (error) => {
        const embed = await client.embeds.errorInfo(command.option.role, error, client);
        editMsg.edit(embed);
      })
    }

    async function deleteChannel() {
      const pendingEmbed = client.embeds.pending(command.option.channel,`Deleting the channel...`);
      const editMsg = await message.lineReply(pendingEmbed);

      if (!channel.permissionsFor(message.member).has(command.option.channel.permissions) && !message.member.roles.cache.has(settings.adminRole)) {
        const embed = client.embeds.permission(command.option.channel);
        return editMsg.edit(embed)
      }

      if (!channel.permissionsFor(clientMember).has(command.option.channel.permissions)) {
        const embed = client.embeds.botPermission(command.option.channel);
        return editMsg.edit(embed)
      }

      channel.delete()
      .then((c) => {
        if (c.id == message.channel.id) return
        const embed = client.embeds.success(command.option.channel, `Deleted the \`${channel.name}\` channel.`);

        editMsg.edit(embed)
      })
      .catch(async (error) => {
        const embed = await client.embeds.errorInfo(command.option.channel, error, client);
        editMsg.edit(embed)
      })
    }

    if (role) return deleteRole()
    if (channel) return deleteChannel()
    if (!role && !channel) {
      const embed = client.embeds.noRolesOrChannels(command, args.join(" "));
      message.lineReply(embed)
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, true, message, command, extra.logId);
  }
}