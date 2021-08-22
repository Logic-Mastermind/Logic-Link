const Discord = require("discord.js");
const Buttons = require("discord-buttons");
const Prefix = require("discord-prefix");

exports.run = async (client, message, args, command, settings, tsettings, extra) => {
  var guildPrefix = Prefix.getPrefix(message.guild.id);
  if (!guildPrefix) guildPrefix = client.util.defaultPrefix;

  const clientMember = message.guild.me;
  const noArgs = await client.functions.getNoArgs(command, message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = await client.functions.getArgs(args);
  const code = `\`\`\``;

  const responses = {

  }

  try {
    if (!secArg) {

    } else {
      switch (secArg) {
        case "n":
        case "new":
        {
          const prompt = {
            name: `What should be the name of this panel?\nThe name must be within 3 and 50 characters long.`,
            opened: `Where would you like opened tickets to go?\nType the name or ID of a category you want to set this to.`,
            closed: `Where would you like closed tickets to go?\nType the name or ID of a category you want to set this to.`,
            claiming: `Would you like panel claiming to be on, or off?\nType the option that you would like this to set to.`,
            support: `What are some support roles that you would like for this panel?\nMembers who have these roles will be able to view and manage support tickets.\nMention or type the names of those roles below.`,
            additional: `What are some additional roles that you would like for this panel?\nBy default, members who have these roles will be able to view support tickets.\nMention or type the names of those roles below.`
          }

          const startEmbed = client.embeds.pending(command, `Starting panel setup prompt...`);
          // if (settings.panelSetup) {
          //   const embed = client.embeds.error(command, `A panel is already being created in this server, please wait until the prompt has completed.`);
          //   return message.lineReply(embed);
          // }
          
          const embeds = [
            client.embeds.blue(command, prompt.name),
            client.embeds.blue(command, prompt.opened),
            client.embeds.blue(command, prompt.closed),
            client.embeds.blue(command, prompt.claiming),
            client.embeds.blue(command, prompt.support),
            client.embeds.blue(command, prompt.additional)
          ];

          const filter = (m) => m.author.id == message.author.id;
          const collector = message.channel.createMessageCollector(filter, { idle: 60 * 1000 });
          const startMsg = await message.lineReply(startEmbed);
          startMsg.edit(embeds[0])

          var current = 1;
          var cancelled = false;
          var finished = false;

          var msgId = [
            startMsg.id,
            null,
            null,
            null,
            null,
            null
          ]

          var collected = {};
          await client.db.settings.set(message.guild.id, true, "panelSetup");

          collector.on("collect", async (msg) => {
            const msgArgs = msg.content.split(/ +/g);

            if (current == 1) {
              const editMsg = msg.channel.messages.cache.get(msgId[0]);

              if (client.util.skipAliases.includes(msg.content.toLowerCase())) {
                const embed = client.embeds.error(command, `Skipping is disallowed in this prompt, please try again.\n\n**Original Question**\n${prompt.name}`);
                return editMsg.edit(embed);

              } else if (client.util.cancelAliases.includes(msg.content.toLowerCase())) {
                const embed = client.embeds.error(command, `This question has stopped looking for responses.`);

                editMsg.edit(embed);
                cancelled = true;
                return collector.stop();
              }

              if (msg.content.length > 50) {
                const embed = client.embeds.error(command, `This name is greater than 50 characters, please try again.\n\n**Original Question**\n${prompt.name}`);
                return editMsg.edit(embed);

              } else if (msg.content.length < 3) {
                const embed = client.embeds.error(command, `This name is less than 3 characters, please try again.\n\n**Original Question**\n${prompt.name}`);
                return editMsg.edit(embed);
              }

              var taken = await tsettings.panels.all.some(p => p.name == msg.content);
              if (taken) {
                const embed = client.embeds.error(command, `This name has already been used in another panel, please try again.\n\n**Original Question**\n${prompt.name}`);
                return editMsg.edit(embed);
              }

              collected.name = msg.content;
              const embed = client.embeds.success(command, `Panel name has been set to: \`${collected.name}\`.`);
              editMsg.edit(embed);

              current = 2;
              msgId = await client.functions.next(message.channel, msgId, embeds, 2);

            } else if (current == 2) {
              const editMsg = msg.channel.messages.cache.get(msgId[1]);

              if (client.util.skipAliases.includes(msg.content.toLowerCase())) {
                const embed = client.embeds.error(command, `Skipping is disallowed in this prompt, please try again.\n\n**Original Question**\n${prompt.opened}`);
                return editMsg.edit(embed);

              } else if (client.util.cancelAliases.includes(msg.content.toLowerCase())) {
                const embed = client.embeds.error(command, `This question has stopped looking for responses.`);

                editMsg.edit(embed);
                cancelled = true;
                return collector.stop();
              }

              var category = await client.functions.findCategory(msgArgs.join(" "), msg.guild);
              if (!category) {
                const embed = client.embeds.error(command, `I could not record any categories from your message, please try again.\n\n**Original Question**\n${prompt.opened}`);
                return editMsg.edit(embed);
              }

              if (!category.permissionsFor(clientMember).has("MANAGE_CHANNELS")) {
                const embed = client.embeds.error(command, `I do not have the required permissions in this category, please try again.\n\n**Original Question**\n${prompt.opened}`);
                return editMsg.edit(embed);
              }

              collected.opened = category.id;
              const embed = client.embeds.success(command, `Panel opened category has been set to: \`<#${category.id}>\`.`);
              editMsg.edit(embed);

              current = 3;
              msgId = await client.functions.next(message.channel, msgId, embeds, 3);

            } else if (current == 3) {
              const editMsg = msg.channel.messages.cache.get(msgId[2]);

              if (client.util.skipAliases.includes(msg.content.toLowerCase())) {
                const embed = client.embeds.error(command, `Skipping is disallowed in this prompt, please try again.\n\n**Original Question**\n${prompt.closed}`);
                return editMsg.edit(embed);

              } else if (client.util.cancelAliases.includes(msg.content.toLowerCase())) {
                const embed = client.embeds.error(command, `This question has stopped looking for responses.`);

                editMsg.edit(embed);
                cancelled = true;
                return collector.stop();
              }

              var category = await client.functions.findCategory(msgArgs.join(" "), msg.guild);
              if (!category) {
                const embed = client.embeds.error(command, `I could not record any categories from your message, please try again.\n\n**Original Question**\n${prompt.closed}`);
                return editMsg.edit(embed);
              }

              if (!category.permissionsFor(clientMember).has("MANAGE_CHANNELS")) {
                const embed = client.embeds.error(command, `I do not have the required permissions in this category, please try again.\n\n**Original Question**\n${prompt.closed}`);
                return editMsg.edit(embed);
              }

              collected.closed = category.id;
              const embed = client.embeds.success(command, `Panel closed category has been set to: \`<#${category.id}>\`.`);
              editMsg.edit(embed);

              current = 4;
              msgId = await client.functions.next(message.channel, msgId, embeds, 4);
              
            } else if (current == 4) {
              const editMsg = msg.channel.messages.cache.get(msgId[3]);

              if (client.util.skipAliases.includes(msg.content.toLowerCase())) {
                const embed = client.embeds.error(command, `Skipping is disallowed in this prompt, please try again.\n\n**Original Question**\n${prompt.claiming}`);
                return editMsg.edit(embed);

              } else if (client.util.cancelAliases.includes(msg.content.toLowerCase())) {
                const embed = client.embeds.error(command, `This question has stopped looking for responses.`);

                editMsg.edit(embed);
                cancelled = true;
                return collector.stop();
              }

              var option = null;
              if (msg.content.includes("yes") || msg.content.includes("on")) option = "true";
              if (msg.content.includes("no") || msg.content.includes("off")) option = "false";

              if (!option) {
                const embed = client.embeds.error(command, `An invalid option was recieved, please type \`on\` or \`off\`.\n\n**Original Question**\n${prompt.claiming}`);
                return editMsg.edit(embed);
              }
              
              const embed = client.embeds.success(command, `Panel claiming has been turned \`${option == "true" ? `on` : `off`}\`.`);
              editMsg.edit(embed);

              current = 5;
              msgId = await client.functions.next(message.channel, msgId, embeds, 5);

            } else if (current == 5) {
              const editMsg = msg.channel.messages.cache.get(msgId[4]);

              if (client.util.skipAliases.includes(msg.content.toLowerCase())) {
                const embed = client.embeds.error(command, `Skipping is disallowed in this prompt, please try again.\n\n**Original Question**\n${prompt.support}`);
                return editMsg.edit(embed);

              } else if (client.util.cancelAliases.includes(msg.content.toLowerCase())) {
                const embed = client.embeds.error(command, `This question has stopped looking for responses.`);

                editMsg.edit(embed);
                cancelled = true;
                return collector.stop();
              }

              var mentionedRoles = await msg.mentions.roles.map(r => r.id)
              var roles = msgArgs;
              var roleObj = [];

              await roles.unshift(...mentionedRoles);
              roles = roles.filter((v) => (!v.startsWith("<@&") || !v.startsWith("<@!")) && !v.endsWith(">"));
              roles = [...new Set(roles)];

              roles.forEach(async (v) => {
                var role = await client.functions.findRole(v, msg.guild);
                if (role) roleObj.push(role.id);
              })

              roleObj = [...new Set(roleObj)];
              console.log(roleObj)
            }
          });

          collector.on("end", async () => {
            
          });

          break;
        }
        case "m":
        case "modify":
        {
          break;
        }
        case "d":
        case "delete":
        {
          break;
        }
      }
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, true, message, command);
  }
}