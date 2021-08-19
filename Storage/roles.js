const Discord = require('discord.js');
const prefixManager = require("discord-prefix")

exports.run = async (client, message, args) =>  {
  var guildPrefix = prefixManager.getPrefix(message.guild.id);
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
  const targetUser = message.mentions.members.first();
  const ending = `\`\`\``;

  const adminRoleConfig = guildConf["adminRole"];
  const modRoleConfig = guildConf["modRole"];
  const modLogChannelConfig = guildConf["modLogChannel"];
  const welcomeChannelConfig = guildConf["welcomeChannel"];
  const welcomeRoleConfig = guildConf["welcomeRole"];
  const welcomeSystemConfig = guildConf["welcomeSystem"];

  const adminRoleObject = message.guild.roles.cache.get(adminRoleConfig);
  const modRoleObject = message.guild.roles.cache.get(modRoleConfig);
  const modLogChannelObject = message.guild.channels.cache.get(modLogChannelConfig);
  const welcomeChannelObject = message.guild.channels.cache.get(welcomeChannelConfig);
  const welcomeRoleObject = message.guild.roles.cache.get(welcomeRoleConfig);
  const roles = commands.administrator.roles;

  if ((client.adminMode == true && message.member.user.id == client.ownerId) || message.member.hasPermission("MANAGE_ROLES") || message.member.roles.cache.has(adminRoleObject.id)) {
    if (!args || args.length < 1) {
      const noArgsEmbed = new Discord.MessageEmbed()
      .setTitle("ROLES")
      .setColor("ORANGE")
      .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
      .setDescription(`**Command Info**\n${roles.description}\n\n**Usage**\n\`\`\`${guildPrefix}${roles.usage}\`\`\`\n**Error**\nPlease specify a module and user to role.`)
      .setTimestamp();

      message.channel.send(noArgsEmbed)
    } else if (fourthArg) {
        var user = message.mentions.members.first();
        var role = message.mentions.roles.first();

        if (!isNaN(thirdArg)) {
          console.log("working")
          user = message.guild.member(client.users.cache.get(thirdArg))
        }

        if (!isNaN(fourthArg)) {
          console.log("also working")
          role = message.guild.roles.cache.get(fourthArg)
        }

        if (thirdArg == "me") {
          user = message.member;
        }

        if (secArg.toString() == "add" || "remove") {
          if (user) {
            if (role) {
              if (!clientMember.hasPermission("MANAGE_ROLES")) {
                const errorEmbed = new Discord.MessageEmbed()
                .setTitle("ROLES")
                .setColor("RED")
                .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
                .setDescription(`**Error - Insufficient Permissions**\nI do not have the required permissions to carry out this command.\n\n**Permissions Needed**\n${ending}MANAGE_ROLES${ending}`)
                .setTimestamp();

                return message.channel.send(errorEmbed)
              }

              if (user.user.id == message.author.id) {
                const guild = message.guild
                if (message.author.id !== message.guild.ownerID) {
                  if (role.position >= message.member.roles.highest.position) {
                    const selfRoleEmbed = new Discord.MessageEmbed()
                    .setTitle("ROLES")
                    .setColor("RED")
                    .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
                    .setDescription(`**Error - Permissions Needed**\nYou cannot add or remove roles that have a greater or equal role position than your highest role.`)
                    .setTimestamp();

                    return message.channel.send(selfRoleEmbed)
                  }
                }
              }

              if (secArg.toString() == "add") {
                if (role.position >= clientMember.roles.highest.position) {
                  const errorEmbed = new Discord.MessageEmbed()
                  .setTitle("ROLES")
                  .setColor("RED")
                  .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
                  .setDescription(`**Error - Insufficient Permissions**\nI am unable to give roles that have a higher or equal role position as my highest role.`)
                  .setTimestamp();

                  return message.channel.send(errorEmbed)
                }

                if (user.roles.cache.has(role.id)) {
                  const alrHasEmbed = new Discord.MessageEmbed()
                  .setTitle("ROLES")
                  .setColor("ORANGE")
                  .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
                  .setDescription(`**Error**\n<@${user.id}> already has the \`${role.name}\` role.`)
                  .setTimestamp();

                  message.channel.send(alrHasEmbed)
                } else {
                    user.roles.add(role)
                    .then(() => {
                      const successEmbed = new Discord.MessageEmbed()
                      .setTitle("ROLES - ADD")
                      .setColor("GREEN")
                      .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
                      .setDescription(`Successfully gave the \`${role.name}\` role to <@${user.user.id}>.`)
                      .setTimestamp();

                      message.channel.send(successEmbed)
                    })
                    .catch((error) => {
                      const alrHasEmbed = new Discord.MessageEmbed()
                      .setTitle("ROLES")
                      .setColor("RED")
                      .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
                      .setDescription(`**Error**\nFailed to add the \`${role.name}\` role to <@${user.user.id}>.\n\n**Error**\n\`\`\`${error}\`\`\``)
                      .setTimestamp();

                      message.channel.send(alrHasEmbed)
                    });
                }
              } else if (secArg.toString() == "remove") {
                if (role.position >= clientMember.roles.highest.position) {
                  const errorEmbed = new Discord.MessageEmbed()
                  .setTitle("ROLES")
                  .setColor("RED")
                  .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
                  .setDescription(`**Error - Insufficient Permissions**\nI am unable to remove roles that have a higher or equal role position as my highest role.`)
                  .setTimestamp();

                  return message.channel.send(errorEmbed)
                }

                if (user.roles.cache.has(role.id)) {
                  user.roles.remove(role)
                  .then(() => {
                    const successEmbed = new Discord.MessageEmbed()
                    .setTitle("ROLES - REMOVE")
                    .setColor("GREEN")
                    .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
                    .setDescription(`Successfully removed the \`${role.name}\` role from <@${user.user.id}>.`)
                    .setTimestamp();

                    message.channel.send(successEmbed)
                  })
                  .catch((error) => {
                      const alrHasEmbed = new Discord.MessageEmbed()
                      .setTitle("ROLES")
                      .setColor("RED")
                      .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
                      .setDescription(`**Error**\nFailed to remove the \`${role.name}\` role from <@${user.user.id}>.\n\`${error}\`.`)
                      .setTimestamp();

                      message.channel.send(alrHasEmbed)
                      return;
                    });
                } else {
                  const noHaveEmbed = new Discord.MessageEmbed()
                  .setTitle("ROLES")
                  .setColor("ORANGE")
                  .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
                  .setDescription(`**Error**\n<@${user.id}> does not have the \`${role.name}\` role.`)
                  .setTimestamp();

                  message.channel.send(noHaveEmbed)
                }
              }
            } else {
              const noRoleEmbed = new Discord.MessageEmbed()
              .setTitle("ROLES")
              .setColor("ORANGE")
              .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
              .setDescription(`**Error**\n\`${fourthArg}\` is not a role. Please mention a role to add/remove.`)
              .setTimestamp();

              message.channel.send(noRoleEmbed)
            }
          } else {
            const noUserEmbed = new Discord.MessageEmbed()
            .setTitle("ROLES")
            .setColor("ORANGE")
            .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
            .setDescription(`**Error**\n\`${thirdArg}\` is not a user. Please mention a user to role.`)
            .setTimestamp();

            message.channel.send(noUserEmbed)
          }
        }
    } else if (thirdArg && (!fourthArg)) {
        const user = message.mentions.members.first();
        if (secArg.toString() == "add" || secArg.toString() == "remove") {
          if (user) {
            if (secArg.toString() == "add") {
              const noArgs4Embed = new Discord.MessageEmbed()
              .setTitle("ROLES - ADD")
              .setColor("ORANGE")
              .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
              .setDescription(`**Command Info**\nThe roles add command is used to give roles to a member.\n\n**Usage**\n\`\`\`${guildPrefix}role add <user> <role>\`\`\`\n**Error**\nPlease specify a role to give.`)
              .setTimestamp();

              message.channel.send(noArgs4Embed)
            } else if (secArg.toString() == "remove") {
              const noArgs5Embed = new Discord.MessageEmbed()
              .setTitle("ROLES - REMOVE")
              .setColor("ORANGE")
              .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
              .setDescription(`**Command Info**\nThe roles remove command is used to remove roles from a member.\n\n**Usage**\n\`\`\`${guildPrefix}role remove <user> <role>\`\`\`\n**Error**\nPlease specify a role to remove.`)
              .setTimestamp();

              message.channel.send(noArgs5Embed)
            }
          } else {
            const noUserEmbed = new Discord.MessageEmbed()
            .setTitle("ROLES")
            .setColor("ORANGE")
            .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
            .setDescription(`**Error**\n\`${thirdArg}\` is not a user. Please mention a user to role.`)
            .setTimestamp();

            message.channel.send(noUserEmbed)
          }
        }
    } else if (secArg && (!fourthArg)) {
      if (secArg.toString() == "add" || secArg.toString() == "remove") {
        if (secArg.toString() == "add") {
          const noArgs2Embed = new Discord.MessageEmbed()
          .setTitle("ROLES - ADD")
          .setColor("ORANGE")
          .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
          .setDescription(`**Command Info**\nThe roles add command is used to give roles to a member.\n\n**Usage**\n\`\`\`${guildPrefix}role add <user> <role>\`\`\`\n**Error**\nPlease specify a user and a role to give.`)
          .setTimestamp();

          message.channel.send(noArgs2Embed)
        } else if (secArg.toString() == "remove") {
          const noArgs3Embed = new Discord.MessageEmbed()
          .setTitle("ROLES - REMOVE")
          .setColor("ORANGE")
          .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
          .setDescription(`**Command Info**\nThe roles remove command is used to remove roles from a member.\n\n**Usage**\n\`\`\`${guildPrefix}role remove <user> <role>\`\`\`\n**Error**\nPlease specify a user and a role to remove.`)
          .setTimestamp();

          message.channel.send(noArgs3Embed)
        }
      }
    }
  } else {
    const noPermsEmbed = new Discord.MessageEmbed()
    .setTitle("Insufficient Permissions")
    .setColor("RED")
    .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
    .setDescription("**Error**\nYou do not have permission to use this command.\n\n**Permissions**\n```MANAGE_ROLES```")
    .setTimestamp();

    message.channel.send(noPermsEmbed)
  }
}