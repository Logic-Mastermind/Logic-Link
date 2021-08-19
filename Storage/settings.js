const Discord = require("discord.js")
const prefixManager = require("discord-prefix")
const buttons = require("discord-buttons")

exports.run = async (client, message, args) =>  {
  var guildPrefix = prefixManager.getPrefix(message.guild.id)
  if (!guildPrefix || guildPrefix == null) {
    guildPrefix = client.defaultPrefix;
  }

  const secArg = args[0];
  const thirdArg = args[1];
  const fourthArg = args[2];
  const fifthArg = args[3];

  const commands = require("../config/commands.js");
  const guildConf = client.settings.get(message.guild.id);
  const clientMember = message.guild.member(client.user);
  const ending = `\`\`\``;

  const awaitMember = await message.member
  const adminRoleConfig = guildConf["adminRole"];
  const modRoleConfig = guildConf["modRole"];
  const modLogChannelConfig = guildConf["modLogChannel"];
  const welcomeChannelConfig = guildConf["welcomeChannel"];
  const welcomeRoleConfig = guildConf["welcomeRole"];
  const welcomeSystemConfig = guildConf["welcomeSystem"];

  const welcomeSystemMsg = `${welcomeSystemConfig ? "On" : "Off"}`;
  const adminRoleObject = message.guild.roles.cache.get(adminRoleConfig);
  const modRoleObject = message.guild.roles.cache.get(modRoleConfig);
  const modLogChannelObject = message.guild.channels.cache.get(modLogChannelConfig);
  const welcomeChannelObject = message.guild.channels.cache.get(welcomeChannelConfig);
  const welcomeRoleObject = message.guild.roles.cache.get(welcomeRoleConfig);
  
  if ((client.adminMode == true && message.member.id === client.ownerId) || message.member.hasPermission("ADMINISTRATOR") || message.member.roles.cache.has(adminRoleConfig)) {

    var adminRoleView
    var modRoleView
    var modLogChannelView
    var welcomeChannelView
    var welcomeRoleView

    if (adminRoleConfig && adminRoleObject) {
      if (adminRoleObject == undefined) {
        return adminRoleView = `Deleted Role`
      }
      adminRoleView = `@${adminRoleObject.name}`
    } else if (!adminRoleConfig) {
      adminRoleView = `None`
    }

    if (modRoleConfig && modRoleObject) {
      if (modRoleObject == undefined) {
        return modRoleView = `Deleted Role`
      }
      modRoleView = `@${modRoleObject.name}`
    } else if (!modRoleConfig) {
      modRoleView = `None`
    }

    if (modLogChannelConfig && modLogChannelObject) {
      if (modLogChannelObject == undefined) {
        return modLogChannelView = `Deleted Channel`
      }
      modLogChannelView = `#${modLogChannelObject.name}`
    } else if (!modLogChannelConfig) {
      modLogChannelView = `None`
    }

    if (welcomeChannelConfig && welcomeChannelObject) {
      if (welcomeChannelObject == undefined) {
        return welcomeChannelView = `Deleted Channel`
      }
      welcomeChannelView = `#${welcomeChannelObject.name}`
    } else if (!welcomeChannelConfig) {
      welcomeChannelView = `None`
    }

    if (welcomeRoleConfig && welcomeRoleObject) {
      if (welcomeRoleObject == undefined) {
        return welcomeRoleView = `Deleted Role`
      }
      welcomeRoleView = `@${welcomeRoleObject.name}`
    } else if (!welcomeRoleConfig) {
      welcomeRoleView = `None`
    }
    
    const welcomeEmbedMsg = `Welcome Channel - (welcomechannel)\n${welcomeChannelView}\n\nWelcome Role - (welcomerole)\n${welcomeRoleView}`;

    if (!args || args.length < 1) {
        const embed = new Discord.MessageEmbed()
        .setTitle("SETTINGS")
        .setColor("GREEN")
        .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
        .setDescription(`Welcome to Logic Link, an interactive Discord bot with tons of commands and automation options.\n\n**Server Settings**\nBelow shows a list of this server's settings.\nTo change any of the settings, run: \`${guildPrefix}settings [setting name]\`.\n\n\`\`\`fix\nServer Settings\`\`\`\n\`\`\`\nPrefix - (prefix)\n${guildPrefix}\n\nAdministrator Role - (adminrole)\n${adminRoleView}\n\nModerator Role - (modrole)\n${modRoleView}\n\nModerator Log Channel - (modlogchannel)\n${modLogChannelView}\n\nWelcome System - (welcome)\n${welcomeSystemMsg}\n\n${welcomeSystemConfig ? welcomeEmbedMsg : ""}\`\`\``)
        .setTimestamp();

        message.channel.send(embed)
      } else if (args.toString().startsWith("prefix")) {
        const newPrefix = args.splice(1).toString()
        if (newPrefix) {
          if (newPrefix.length > 3) {
            const charEmbed = new Discord.MessageEmbed()
            .setTitle("SETTING - PREFIX")
            .setColor("ORANGE")
            .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
            .setDescription(`**Server Prefix**\nYour new prefix must be less than 3 characters.`)
            .setTimestamp();

            message.channel.send(charEmbed)
          } else {
            prefixManager.setPrefix(newPrefix, message.guild.id)
            const sucEmbed = new Discord.MessageEmbed()
            .setTitle("SETTING - PREFIX")
            .setColor("GREEN")
            .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
            .setDescription(`**Success**\nThe Server Prefix has been changed to \`${newPrefix}\`.`)
            .setTimestamp();

            message.channel.send(sucEmbed)
          }
        } else {
          const prefixEmbed = new Discord.MessageEmbed()
          .setTitle("SETTING - PREFIX")
          .setColor("GREEN")
          .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
          .setDescription(`**Server Prefix**\nThe current prefix for this server is \`${guildPrefix}\`.\n\nTo change the prefix, run the command:\n\`\`\`${guildPrefix}settings prefix <new prefix>\`\`\``)
          .setTimestamp();

          message.channel.send(prefixEmbed)
        }
      } else if (args.toString().startsWith("adminrole") || args.toString().startsWith("administratorrole")) {
        var newRole = message.mentions.roles.first();
        const thirdArg = args[1];
        if (thirdArg) {
          if (!isNaN(thirdArg)) {
            newRole = message.guild.roles.cache.get(thirdArg);
          }

          if (newRole) {
            if (modRoleConfig) {
              if (newRole.id === modRoleConfig) {
                const sameRoleEmbed = new Discord.MessageEmbed()
                .setTitle("SETTING - ADMINISTRATOR ROLE")
                .setColor("RED")
                .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
                .setDescription(`**Error**\nThe Administrator Role cannot be the same as the Moderator Role.`)
                .setTimestamp();

                return message.channel.send(sameRoleEmbed)
              }
            } 
            
            if (adminRoleConfig) {
              if (newRole.id === adminRoleConfig) {
                const sameRoleEmbed = new Discord.MessageEmbed()
                .setTitle("SETTING - ADMINISTRATOR ROLE")
                .setColor("RED")
                .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
                .setDescription(`**Error**\nThe Administrator Role has already been set to <@&${newRole.id}>.`)
                .setTimestamp();

                return message.channel.send(sameRoleEmbed)
              }
            }

            client.settings.set(message.guild.id, newRole.id, "adminRole")

            const sucEmbed = new Discord.MessageEmbed()
            .setTitle("SETTING - ADMINISTRATOR ROLE")
            .setColor("GREEN")
            .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
            .setDescription(`**Success**\nThe Administrator Role has been set to <@&${newRole.id}>.`)
            .setTimestamp();

            message.channel.send(sucEmbed)
          } else {
            const noRoleEmbed = new Discord.MessageEmbed()
            .setTitle("SETTING - ADMINISTRATOR ROLE")
            .setColor("RED")
            .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
            .setDescription(`**Error**\n\`${thirdArg}\` is not a role, please mention a role to set the Administrator Role of this server.`)
            .setTimestamp();

            message.channel.send(noRoleEmbed)
          }
        } else {
          const noArgsEmbed = new Discord.MessageEmbed()
          .setTitle("SETTING - ADMINISTRATOR ROLE")
          .setColor("GREEN")
          .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
          .setDescription(`**Administrator Role**\n${adminRoleConfig ? `The current Administrator Role for this server is <@&${adminRoleConfig}>.\n\nTo change the Administrator Role, run the command:\n\`\`\`${guildPrefix}settings adminrole <new role>\`\`\`` : `There is no Administrator Role for this server.\n\nTo set an Administrator Role, run the command:\n\`\`\`${guildPrefix}settings adminrole <new role>\`\`\``}`)
          .setTimestamp();

          message.channel.send(noArgsEmbed)
        }
      } else if (args.toString().startsWith("modrole") || args.toString().startsWith("moderatorrole")) {
        var newRole = message.mentions.roles.first();
        const thirdArg = args[1];
        if (thirdArg) {
          if (!isNaN(thirdArg)) {
            newRole = message.guild.roles.cache.get(thirdArg);
          }

          if (newRole) {
            if (adminRoleConfig) {
              if (newRole.id === adminRoleConfig) {
                const sameRoleEmbed = new Discord.MessageEmbed()
                .setTitle("SETTING - MODERATOR ROLE")
                .setColor("RED")
                .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
                .setDescription(`**Error**\nThe Moderator Role cannot be the same as the Administrator Role.`)
                .setTimestamp();

                return message.channel.send(sameRoleEmbed)
              }
            } 
            
            if (modRoleConfig) {
              if (newRole.id === modRoleConfig) {
                const sameRoleEmbed = new Discord.MessageEmbed()
                .setTitle("SETTING - MODERATOR ROLE")
                .setColor("RED")
                .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
                .setDescription(`**Error**\nThe Moderator Role has already been set to <@&${newRole.id}>.`)
                .setTimestamp();

                return message.channel.send(sameRoleEmbed)
              }
            }

            client.settings.set(message.guild.id, newRole.id, "modRole")

            const sucEmbed = new Discord.MessageEmbed()
            .setTitle("SETTING - MODERATOR ROLE")
            .setColor("GREEN")
            .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
            .setDescription(`**Success**\nThe Moderator Role has been set to <@&${newRole.id}>.`)
            .setTimestamp();

            message.channel.send(sucEmbed)
          } else {
            const noRoleEmbed = new Discord.MessageEmbed()
            .setTitle("SETTING - MODERATOR ROLE")
            .setColor("RED")
            .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
            .setDescription(`**Error**\n\`${thirdArg}\` is not a role, please mention a role to set the Moderator Role of this server.`)
            .setTimestamp();

            message.channel.send(noRoleEmbed)
          }
        } else {
          const noArgsEmbed = new Discord.MessageEmbed()
          .setTitle("SETTING - MODERATOR ROLE")
          .setColor("GREEN")
          .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
          .setDescription(`**Moderator Role**\n${modRoleConfig ? `The current Moderator Role for this server is <@&${modRoleConfig}>.\n\nTo change the Moderator Role, run the command:\n\`\`\`${guildPrefix}settings modrole <new role>\`\`\`` : `There is no Moderator Role for this server.\n\nTo set a Moderator Role, run the command:\n\`\`\`${guildPrefix}settings modrole <role>\`\`\``}`)
          .setTimestamp();

          message.channel.send(noArgsEmbed)
        }
      } else if (args.toString().startsWith("modlogchannel") || args.toString().startsWith("moderatorlogchannel")) {
        var newChannel = message.mentions.channels.first();
        const thirdArg = args[1];
        if (!isNaN(thirdArg)) {
          newChannel = message.guild.channels.cache.get(thirdArg);
        }

        if (thirdArg) {
          if (newChannel) {
            if (modLogChannelConfig) {
              if (newChannel.id === modLogChannelConfig) {
                const sameChannelEmbed = new Discord.MessageEmbed()
                .setTitle("SETTING - MODERATOR LOG CHANNEL")
                .setColor("RED")
                .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
                .setDescription(`**Error**\nThe Moderator Log Channel has already been set to <#${newChannel.id}>.`)
                .setTimestamp();

                return message.channel.send(sameChannelEmbed)
              }
            }

            if (welcomeChannelConfig) {
              if (newChannel.id === welcomeChannelConfig) {
                const sameChannelEmbed = new Discord.MessageEmbed()
                .setTitle("SETTING - MODERATOR LOG CHANNEL")
                .setColor("RED")
                .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
                .setDescription(`**Error**\nThe Moderator Log Channel cannot be the same as the Welcome Channel.`)
                .setTimestamp();

                return message.channel.send(sameChannelEmbed)
              }
            }

            client.settings.set(message.guild.id, newChannel.id, "modLogChannel")

            const sucEmbed = new Discord.MessageEmbed()
            .setTitle("SETTING - MODERATOR LOG CHANNEL")
            .setColor("GREEN")
            .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
            .setDescription(`**Success**\nThe Moderator Log Channel has been set to <#${newChannel.id}>.`)
            .setTimestamp();

            message.channel.send(sucEmbed)

          } else {
            const noChannelEmbed = new Discord.MessageEmbed()
            .setTitle("SETTING - MODERATOR LOG CHANNEL")
            .setColor("RED")
            .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
            .setDescription(`**Error**\n\`${thirdArg}\` is not a channel, please mention a channel to set the Moderator Log Channel of this server.`)
            .setTimestamp();

            message.channel.send(noChannelEmbed)

          }
        } else {
          const noArgsEmbed = new Discord.MessageEmbed()
          .setTitle("SETTING - MODERATOR LOG CHANNEL")
          .setColor("GREEN")
          .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
          .setDescription(`**Moderator Log Channel**\n${modLogChannelConfig ? `The current Moderator Log Channel for this server is <#${modLogChannelConfig}>.\n\nTo change the Moderator Log Channel, run the command:\n\`\`\`${guildPrefix}settings modlogchannel <new channel>\`\`\`` : `There is no Moderator Log Channel for this server.\n\nTo set a Moderator Log Channel, run the command:\n\`\`\`${guildPrefix}settings modlogchannel <channel>\`\`\``}`)
          .setTimestamp();

          message.channel.send(noArgsEmbed)
        }
      } else if (args.toString().startsWith("welcomechannel")) {
        var newChannel = message.mentions.channels.first();
        const thirdArg = args[1];
        if (!isNaN(thirdArg)) {
          newChannel = message.guild.channels.cache.get(thirdArg);
        }

        if (!welcomeSystemConfig) {
          const notEnabledEmbed = new Discord.MessageEmbed()
          .setTitle("SETTING - WELCOME CHANNEL")
          .setColor("RED")
          .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
          .setDescription(`**Error**\nThe Welcome System module is not enabled for this server, please enable the module first before attempting to set the Welcome Channel of this server.`)
          .setTimestamp();

          return message.channel.send(notEnabledEmbed)
        }

        if (thirdArg) {
          if (newChannel) {
            if (welcomeChannelConfig) {
              if (newChannel.id === welcomeChannelConfig) {
                const sameChannelEmbed = new Discord.MessageEmbed()
                .setTitle("SETTING - WELCOME CHANNEL")
                .setColor("RED")
                .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
                .setDescription(`**Error**\nThe Welcome Channel has already been set to <#${newChannel.id}>.`)
                .setTimestamp();

                return message.channel.send(sameChannelEmbed)
              }
            }

            if (modLogChannelConfig) {
              if (newChannel.id === modLogChannelConfig) {
                const sameChannelEmbed = new Discord.MessageEmbed()
                .setTitle("SETTING - WELCOME CHANNEL")
                .setColor("RED")
                .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
                .setDescription(`**Error**\nThe Welcome Channel cannot be the same as the Moderator Log Channel.`)
                .setTimestamp();

                return message.channel.send(sameChannelEmbed)
              }
            }

            client.settings.set(message.guild.id, newChannel.id, "welcomeChannel")

            const sucEmbed = new Discord.MessageEmbed()
            .setTitle("SETTING - WELCOME CHANNEL")
            .setColor("GREEN")
            .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
            .setDescription(`**Success**\nThe Welcome Channel has been set to <#${newChannel.id}>.`)
            .setTimestamp();

            message.channel.send(sucEmbed)

          } else {
            const noChannelEmbed = new Discord.MessageEmbed()
            .setTitle("SETTING - WELCOME CHANNEL")
            .setColor("RED")
            .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
            .setDescription(`**Error**\n\`${thirdArg}\` is not a channel, please mention a channel to set the Welcome Channel of this server.`)
            .setTimestamp();

            message.channel.send(noChannelEmbed)
          }
        } else {
          const noArgsEmbed = new Discord.MessageEmbed()
          .setTitle("SETTING - WELCOME CHANNEL")
          .setColor("GREEN")
          .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
          .setDescription(`**Welcome Channel**\n${modLogChannelConfig ? `The current Welcome Channel for this server is <#${welcomeChannelConfig}>.\n\nTo change the Welcome Channel, run the command:\n\`\`\`${guildPrefix}settings welcomechannel <new channel>\`\`\`` : `There is no Welcome Channel for this server.\n\nTo set a Welcome Channel, run the command:\n\`\`\`${guildPrefix}settings welcomechannel <channel>\`\`\``}`)
          .setTimestamp();

          message.channel.send(noArgsEmbed)
        }
      } else if (args.toString().startsWith("welcomerole")) {
        var newRole = message.mentions.roles.first();
        const thirdArg = args[1];
        if (!isNaN(thirdArg)) {
          newRole = message.guild.roles.cache.get(thirdArg);
        }

        if (!welcomeSystemConfig) {
          const notEnabledEmbed = new Discord.MessageEmbed()
          .setTitle("SETTING - WELCOME ROLE")
          .setColor("RED")
          .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
          .setDescription(`**Error**\nThe Welcome System module is not enabled for this server, please enable the module first before attempting to set the Welcome Role of this server.`)
          .setTimestamp();

          return message.channel.send(notEnabledEmbed)
        }

        if (thirdArg) {
          if (newRole) {
            if (welcomeRoleConfig) {
              if (newRole.id === welcomeRoleConfig) {
                const sameChannelEmbed = new Discord.MessageEmbed()
                .setTitle("SETTING - WELCOME ROLE")
                .setColor("RED")
                .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
                .setDescription(`**Error**\nThe Welcome Role has already been set to <@&${newRole.id}>.`)
                .setTimestamp();

                return message.channel.send(sameChannelEmbed)
              }
            }

            client.settings.set(message.guild.id, newRole.id, "welcomeRole")
            
            const sucEmbed = new Discord.MessageEmbed()
            .setTitle("SETTING - WELCOME ROLE")
            .setColor("GREEN")
            .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
            .setDescription(`**Success**\nThe Welcome Role has been set to <@&${newRole.id}>.`)
            .setTimestamp();

            message.channel.send(sucEmbed)

          } else {
            const noRoleEmbed = new Discord.MessageEmbed()
            .setTitle("SETTING - WELCOME ROLE")
            .setColor("RED")
            .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
            .setDescription(`**Error**\n\`${thirdArg}\` is not a role, please mention a role to set the Welcome Role of this server.`)
            .setTimestamp();

            message.channel.send(noRoleEmbed)
          }
        } else {
          const noArgsEmbed = new Discord.MessageEmbed()
          .setTitle("SETTING - WELCOME ROLE")
          .setColor("GREEN")
          .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
          .setDescription(`**Welcome Role**\n${welcomeRoleConfig ? `The current Welcome Role for this server is <@&${welcomeRoleConfig}>.\n\nTo change the Welcome Role, run the command:\n\`\`\`${guildPrefix}settings welcomerole <new role>\`\`\`` : `There is no Welcome Role for this server.\n\nTo set a Welcome Role, run the command:\n\`\`\`${guildPrefix}settings welcomerole <role>\`\`\``}`)
          .setTimestamp();

          message.channel.send(noArgsEmbed)
        }

      } else if (args.toString().startsWith("welcome") || args.toString().startsWith("welcomesystem") || args.toString().startsWith("wlc")) {
        const thirdArg = args[1];

        if (thirdArg) {
          if (thirdArg == "on") {
            if (welcomeSystemConfig == false) {
              client.settings.set(message.guild.id, true, "welcomeSystem")
              const sucEmbed = new Discord.MessageEmbed()
              .setTitle("SETTING - WELCOME SYSTEM")
              .setColor("GREEN")
              .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
              .setDescription(`**Success**\nThe Welcome System has been turned on successfully.\nWould you like to start an interactive setup prompt?`)
              .setTimestamp();

              const promptStartButton = new buttons.MessageButton()
              .setStyle("green")
              .setLabel("Start Prompt")
              .setID("Welcome_Setting_Prompt_Start");

              const cancelButton = new buttons.MessageButton()
              .setStyle("red")
              .setLabel("Cancel")
              .setID("Welcome_Setting_Prompt_Cancel");

              const filter = (button) => true;
              const sentMessage = await message.channel.send(``, { embed: sucEmbed, buttons: [promptStartButton, cancelButton] });
              const collector = sentMessage.createButtonCollector(filter, { time: 60000 });
              var completed = false;

              collector.on("collect", async (button) => {
                const failedEmbed = new Discord.MessageEmbed()
                .setTitle("Insufficient Permissions")
                .setColor("RED")
                .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
                .setDescription("**Error**\nYou do not have permission to carry out this process.\nPermissions needed: ```ADMINISTRATOR```")
                .setTimestamp();

                const buttonClicker = await button.clicker.user;
                if (buttonClicker.id !== message.author.id) {
                  return button.reply.send(``, { embed: failedEmbed, ephemeral: true })
                }

                if (button.id == "Welcome_Setting_Prompt_Start") {
                  completed = true;
                  const startPromptEmbed = new Discord.MessageEmbed()
                  .setTitle("SETTING - WELCOME")
                  .setColor("GREEN")
                  .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
                  .setDescription("**Success**\nSuccessfully enabled the welcome system. Starting setup prompt...")
                  .setTimestamp();

                  const welcomeChannelEmbed = new Discord.MessageEmbed()
                  .setTitle("WELCOME PROMPT")
                  .setColor("BLUE")
                  .setFooter(`Setup Prompt`, message.guild.iconURL())
                  .setDescription(`**Welcome Channel**\nWhat is the channel that you would like welcome messages to be sent?`)
                  .setTimestamp();

                  const welcomeRoleEmbed = new Discord.MessageEmbed()
                  .setTitle("WELCOME PROMPT")
                  .setColor("BLUE")
                  .setFooter(`Setup Prompt`, message.guild.iconURL())
                  .setDescription(`**Welcome Role**\nWhat is the role that you would like new members to recieve when they join the server?`)
                  .setTimestamp();

                  const awaitingEmbed = new Discord.MessageEmbed()
                  .setTitle("WELCOME PROMPT")
                  .setColor("ORANGE")
                  .setFooter(`Setup Prompt`, message.guild.iconURL())
                  .setDescription(`Answer recieved, awaiting next question.`)
                  .setTimestamp();

                  await button.defer();
                  const msgChannel = await button.channel.send(``, { embed: startPromptEmbed })
                  await sentMessage.delete();

                  const filter = (msg) => msg.author.id == message.author.id;
                  var finished = false;
                  var cancelled = false;
                  var current = 1;
                  const textCollector = new Discord.MessageCollector(message.channel, filter, {
                    max: 2,
                    time: 1000 * 180
                  });

                  await msgChannel.edit(``, { embed: welcomeChannelEmbed });
                  const attempts = client.attempts.get(message.author.id, "attempts")

                  client.attempts.set(message.author.id, attempts + 1, "attempts")

                  textCollector.on("collect", async (msg) => {
                    var newMsg = msg.channel.messages.cache.get(client.promptDataStore.get(msg.author.id + attempts, "botMsgId"))
                    async function next() {
                      newMsg = await msg.channel.send(welcomeRoleEmbed)
                      client.promptDataStore.set(msg.author.id + attempts, newMsg.id, "botMsgId")
                    }

                    if (current == 1) {
                      var channel = msg.mentions.channels.first();
                      if (!channel) {
                        if (!isNaN(secArg)) {
                          channel = msg.guild.channels.cache.get(msg.content)
                        } else {
                          channel = msg.guild.channels.cache.find(c => c.name == msg.content)
                        }
                      }

                      if (msg.content.toLowerCase() == "cancel") {
                        const cancelledEmbed = new Discord.MessageEmbed()
                        .setTitle("WELCOME PROMPT")
                        .setColor("ORANGE")
                        .setFooter(`Setup Prompt`, message.guild.iconURL())
                        .setDescription(`**Welcome Prompt**\nPrompt cancelled.`)
                        .setTimestamp();

                        const cancelledEmbed1 = new Discord.MessageEmbed()
                        .setTitle("WELCOME PROMPT")
                        .setColor("ORANGE")
                        .setFooter(`Setup Prompt`, message.guild.iconURL())
                        .setDescription(`**Welcome Channel**\nThis question has stopped looking for responses.`)
                        .setTimestamp();

                        cancelled = true;
                        msgChannel.edit(``, { embed: cancelledEmbed1 })
                        return textCollector.stop()
                      }

                      if (msg.content.toLowerCase() == "skip") {
                        const skippedEmbed = new Discord.MessageEmbed()
                        .setTitle("WELCOME PROMPT")
                        .setColor("ORANGE")
                        .setFooter(`Setup Prompt`, message.guild.iconURL())
                        .setDescription(`**Welcome Channel**\nQuestion skipped.`)
                        .setTimestamp();

                        msgChannel.edit(``, { embed: skippedEmbed })
                        current = 2;
                        return next()
                      }

                      if (channel) {
                        const welcomeChannelFinishedSuccessEmbed = new Discord.MessageEmbed()
                        .setTitle("WELCOME PROMPT")
                        .setColor("GREEN")
                        .setFooter(`Setup Prompt`, message.guild.iconURL())
                        .setDescription(`**Welcome Channel**\n<#${channel.id}> was found in the server.`)
                        .setTimestamp();

                        if (channel.type !== `text`) {
                          const notTextEmbed = new Discord.MessageEmbed()
                          .setTitle("WELCOME PROMPT")
                          .setColor("RED")
                          .setFooter(`Setup Prompt`, message.guild.iconURL())
                          .setDescription(`**Welcome Channel**\nChannel type must be a text channel.`)
                          .setTimestamp();
                          
                          current = 2;
                          msgChannel.edit(``, { embed: notTextEmbed });
                          return next();
                        }

                        msgChannel.edit(``, { embed: welcomeChannelFinishedSuccessEmbed });
                        client.promptDataStore.set(msg.author.id + attempts, channel.id, "channel")
                      } else {
                        const welcomeChannelFinishedFailedEmbed = new Discord.MessageEmbed()
                        .setTitle("WELCOME PROMPT")
                        .setColor("RED")
                        .setFooter(`Setup Prompt`, message.guild.iconURL())
                        .setDescription(`**Welcome Channel**\nFailed to find that channel in the server.`)
                        .setTimestamp();

                        msgChannel.edit(``, { embed: welcomeChannelFinishedFailedEmbed })
                      }

                      current = 2;
                      next()
                    } else if (current == 2) {
                      var role = msg.mentions.roles.first();
                      if (!role) {
                        if (!isNaN(secArg)) {
                          role = msg.guild.roles.cache.get(msg.content)
                        } else {
                          role = msg.guild.roles.cache.find(r => r.name == msg.content)
                        }
                      }

                      if (msg.content.toLowerCase() == "cancel") {
                        const cancelledEmbed = new Discord.MessageEmbed()
                        .setTitle("WELCOME PROMPT")
                        .setColor("ORANGE")
                        .setFooter(`Setup Prompt`, message.guild.iconURL())
                        .setDescription(`**Welcome Prompt**\nPrompt cancelled.`)
                        .setTimestamp();

                        const cancelledEmbed1 = new Discord.MessageEmbed()
                        .setTitle("WELCOME PROMPT")
                        .setColor("ORANGE")
                        .setFooter(`Setup Prompt`, message.guild.iconURL())
                        .setDescription(`**Welcome Role**\nThis question has stopped looking for responses.`)
                        .setTimestamp();

                        msg.channel.send(``, { embed: cancelledEmbed })
                        button.reply.edit(``, { embed: cancelledEmbed1 })
                        cancelled = true
                        return textCollector.stop()
                      }

                      if (msg.content.toLowerCase() == "skip") {
                        const skippedEmbed = new Discord.MessageEmbed()
                        .setTitle("WELCOME PROMPT")
                        .setColor("ORANGE")
                        .setFooter(`Setup Prompt`, message.guild.iconURL())
                        .setDescription(`**Welcome Role**\nQuestion skipped.`)
                        .setTimestamp();

                        const finishedEmbed = new Discord.MessageEmbed()
                        .setTitle("WELCOME PROMPT")
                        .setColor("GREEN")
                        .setFooter(`Setup Prompt`, message.guild.iconURL())
                        .setDescription(`**Welcome Prompt**\nThis prompt has ended.`)
                        .setTimestamp();

                        newMsg.edit(``, { embed: skippedEmbed });
                        return finished = true;
                      }

                      if (role) {
                        const welcomeRoleFinishedSuccessEmbed = new Discord.MessageEmbed()
                        .setTitle("SETTING - WELCOME")
                        .setColor("GREEN")
                        .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
                        .setDescription(`**Welcome Role**\n<@&${role.id}> was found in the server.`)
                        .setTimestamp();

                        newMsg.edit(``, { embed: welcomeRoleFinishedSuccessEmbed });
                        client.promptDataStore.set(msg.author.id + attempts, role.id, "role")
                        finished = true;
                      } else {
                        const welcomeRoleFinishedFailedEmbed = new Discord.MessageEmbed()
                        .setTitle("SETTING - WELCOME")
                        .setColor("RED")
                        .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
                        .setDescription(`**Welcome Role**\nFailed to find that role in the server.`)
                        .setTimestamp();

                        newMsg.edit(``, { embed: welcomeRoleFinishedFailedEmbed })
                        finished = true;
                      }
                    }
                  });

                  textCollector.on("end", async (collected) => {
                    const promptRole = message.guild.roles.cache.get(client.promptDataStore.get(message.author.id + attempts, "role"));
                    const promptChannel = message.guild.channels.cache.get(client.promptDataStore.get(message.author.id + attempts, "channel"));

                    if (finished) {
                      if ((!promptRole) && (!promptChannel)) {
                        const noneEmbed = new Discord.MessageEmbed()
                        .setTitle("WELCOME PROMPT")
                        .setColor("RED")
                        .setFooter(`Welcome Prompt`, message.guild.iconURL())
                        .setDescription(`**Error**\nNeither a welcome role nor welcome channel was provided, so the prompt ended.\nThe welcome system is still on.`)
                        .setTimestamp();

                        return message.channel.send(noneEmbed)
                      }
                      const finishedEmbed = new Discord.MessageEmbed()
                      .setTitle("WELCOME PROMPT")
                      .setColor("GREEN")
                      .setFooter(`Welcome Prompt`, message.guild.iconURL())
                      .setDescription(`**Prompt Completed**\nThis prompt was completed successfully, here is what was collected.\nClick on a button below to either confirm or cancel the setup.\n‎`)
                      .addField(`Welcome Channel`, `${promptChannel ? `<#${promptChannel.id}>` : `None provided.`}`)
                      .addField(`Welcome Role`, `${promptRole ? `<@&${promptRole.id}>` : `None provided`}`)
                      .setTimestamp();

                      const confirmOKButton = new buttons.MessageButton()
                      .setStyle("green")
                      .setLabel("Confirm")
                      .setID("Welcome_Setting_Confirm_Settings");

                      const cancelKOButton = new buttons.MessageButton()
                      .setStyle("red")
                      .setLabel("Cancel")
                      .setID("Welcome_Setting_Cancel_Settings");
                      
                      const confirmFilter = (button) => true;
                      const confirmEmbedMsg = await message.channel.send(``, { embed: finishedEmbed, buttons: [confirmOKButton, cancelKOButton] });
                      const btncollector = confirmEmbedMsg.createButtonCollector(confirmFilter, { time: 60000 })

                      btncollector.on("collect", async (button) => {
                        const failedEmbed = new Discord.MessageEmbed()
                        .setTitle("Insufficient Permissions")
                        .setColor("RED")
                        .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
                        .setDescription("**Error**\nYou do not have permission to carry out this process.\nPermissions needed: ```ADMINISTRATOR```")
                        .setTimestamp();

                        const buttonClicker = await button.clicker.user;
                        if (buttonClicker.id !== message.author.id) {
                          return button.reply.send(``, { embed: failedEmbed, ephemeral: true })
                        }

                        if (button.id == "Welcome_Setting_Confirm_Settings") {
                          const cancelEmbed = new Discord.MessageEmbed()
                          .setTitle("WELCOME PROMPT")
                          .setColor("GREEN")
                          .setFooter(`Welcome Prompt`, message.guild.iconURL())
                          .setDescription("**Success**\nSuccessfully saved the settings and completed setup.")
                          .setTimestamp();

                          if (promptRole) client.settings.set(message.guild.id, promptRole.id, "welcomeRole");
                          if (promptChannel) client.settings.set(message.guild.id, promptChannel.id, "welcomeChannel");

                          await button.reply.send(``, { embed: cancelEmbed });
                          confirmEmbedMsg.delete()
                        } else if (button.id == "Welcome_Setting_Cancel_Settings") {
                          const cancelEmbed = new Discord.MessageEmbed()
                          .setTitle("WELCOME PROMPT")
                          .setColor("ORANGE")
                          .setFooter(`Welcome Prompt`, message.guild.iconURL())
                          .setDescription("**Success**\nCancelled the setup process.")
                          .setTimestamp();

                          await button.reply.send(``, { embed: cancelEmbed });
                          confirmEmbedMsg.delete()
                        }
                      })
                    } else if (cancelled) {
                      const cancelledEmbed = new Discord.MessageEmbed()
                      .setTitle("WELCOME PROMPT")
                      .setColor("ORANGE")
                      .setFooter(`Welcome Prompt`, message.guild.iconURL())
                      .setDescription(`**Prompt Cancelled**\nThis prompt has been cancelled successfully.`)
                      .setTimestamp();

                      message.channel.send(cancelledEmbed)
                    } else {
                      const timeoutEmbed = new Discord.MessageEmbed()
                      .setTitle("WELCOME PROMPT")
                      .setColor("RED")
                      .setFooter(`Welcome Prompt`, message.guild.iconURL())
                      .setDescription(`**Prompt Timeout**\nThis prompt has timed out.`)
                      .setTimestamp();

                      message.channel.send(timeoutEmbed)
                    }
                  });

                } else if (button.id == "Welcome_Setting_Prompt_Cancel") {
                  const cancelEmbed = new Discord.MessageEmbed()
                  .setTitle("SETTING - WELCOME")
                  .setColor("ORANGE")
                  .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
                  .setDescription("**Success**\nSuccessfully enabled the welcome system and cancelled the welcome setup prompt.")
                  .setTimestamp();

                  await button.reply.send(``, { embed: cancelEmbed });
                  completed = true;
                  sentMessage.delete()
                }
              })

              collector.on("end", async (result) => {
                if (!completed) {
                  const timeoutEmbed = new Discord.MessageEmbed()
                  .setTitle("SETTING - WELCOME")
                  .setColor("RED")
                  .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
                  .setDescription("**Error - Prompt Timeout**\nThis prompt has timed out because you have not pressed a button within the required time. The welcome system is still on.")
                  .setTimestamp();

                  message.channel.send(timeoutEmbed)
                  sentMessage.delete()
                }
              })
            } else {
              const errEmbed = new Discord.MessageEmbed()
              .setTitle("SETTING - WELCOME SYSTEM")
              .setColor("RED")
              .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
              .setDescription(`**Error**\nThe Welcome System is already on.`)
              .setTimestamp();

              message.channel.send(errEmbed)
            }
          } else if (thirdArg == "off") {
            if (welcomeSystemConfig == true) {
              client.settings.set(message.guild.id, false, "welcomeSystem")
              client.settings.delete(message.guild.id, "welcomeRole")
              client.settings.delete(message.guild.id, "welcomeChannel")
              const sucEmbed = new Discord.MessageEmbed()
              .setTitle("SETTING - WELCOME SYSTEM")
              .setColor("GREEN")
              .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
              .setDescription(`**Success**\nThe Welcome System has been turned off successfully.`)
              .setTimestamp();

              message.channel.send(sucEmbed)
            } else {
              const errEmbed = new Discord.MessageEmbed()
              .setTitle("SETTING - WELCOME SYSTEM")
              .setColor("RED")
              .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
              .setDescription(`**Error**\nThe Welcome System is already off.`)
              .setTimestamp();

              message.channel.send(errEmbed)
            }
          }
        } else {
          const noArgsEmbed = new Discord.MessageEmbed()
          .setTitle("SETTING - WELCOME SYSTEM")
          .setColor("GREEN")
          .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
          .setDescription(`**Welcome System**\n${welcomeSystemConfig ? `The welcome system is currently activated on this server.\n\nTo disable the Welcome System, run the command\n\`\`\`${guildPrefix}settings welcome <off>\`\`\`` : `The welcome system is currently disabled on this server\n\nTo enable the Welcome System, run the command:\n\`\`\`${guildPrefix}settings welcome <off>\`\`\``}`)
          .setTimestamp();

          message.channel.send(noArgsEmbed)
        }
      } else {
        const invalidEmbed = new Discord.MessageEmbed()
        .setTitle("SETTINGS")
        .setColor("ORANGE")
        .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
        .setDescription(`An invalid command option was found.\nRun the \`${guildPrefix}help settings\` command to show a list of valid options.`)
        .setTimestamp();

        message.channel.send(invalidEmbed)
      }
    } else {
    const failedEmbed = new Discord.MessageEmbed()
    .setTitle("Insufficient Permissions")
    .setColor("RED")
    .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
    .setDescription("**Error**\nYou do not have permission to use this command.\nPermissions needed: ```ADMINISTRATOR```")
    .setTimestamp();

    message.channel.send(failedEmbed)
  }
}