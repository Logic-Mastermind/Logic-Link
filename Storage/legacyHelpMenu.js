const helpDescription = `Welcome to Logic Link, an interactive Discord bot with tons of commands and automation options.\n\n**Command List**\nBelow shows a list of available commands.\nTo get more details about a particular command, run: \`${guildPrefix}help [command name]\`.\n\n\`\`\`fix\nGeneral Commands\`\`\`\n\`\`\`${guildPrefix}avatar\n${guildPrefix}botinfo\n${guildPrefix}help\n${guildPrefix}invite\n${guildPrefix}ping\n${guildPrefix}voice${ending}${message.member.hasPermission("BAN_MEMBERS") || message.member.hasPermission("KICK_MEMBERS") || message.member.hasPermission("MANAGE_CHANNELS") || message.member.hasPermission("MANAGE_MESSAGES") || message.member.roles.cache.has(modRoleConfig) || message.member.roles.cache.has(modRoleConfig) || (client.adminMode == true && message.member.user.id == client.ownerId) ? `\n\n\`\`\`fix\nModerator Commands\`\`\`\n\`\`\`\n` : ``}${message.member.hasPermission("BAN_MEMBERS") || (client.adminMode == true && message.member.user.id == client.ownerId) || message.member.roles.cache.has(modRoleConfig) ? `${guildPrefix}ban\n` : ``}${message.member.hasPermission("KICK_MEMBERS") || (client.adminMode == true && message.member.user.id == client.ownerId) || message.member.roles.cache.has(modRoleConfig) ? `${guildPrefix}kick\n` : ``}${message.member.hasPermission("MANAGE_CHANNELS") || (client.adminMode == true && message.member.user.id == client.ownerId) || message.member.roles.cache.has(modRoleConfig) ? `${guildPrefix}mute\n` : ``}${message.member.hasPermission("MANAGE_MESSAGES") || (client.adminMode == true && message.member.user.id == client.ownerId) || message.member.roles.cache.has(modRoleConfig) ? `${guildPrefix}purge\n` : ``}${message.member.hasPermission("MANAGE_CHANNELS") || (client.adminMode == true && message.member.user.id == client.ownerId) || message.member.roles.cache.has(modRoleConfig) ? `${guildPrefix}unmute\n` : ``}${message.member.hasPermission("BAN_MEMBERS") || message.member.hasPermission("KICK_MEMBERS") || message.member.hasPermission("MANAGE_CHANNELS") || message.member.hasPermission("MANAGE_MESSAGES") || message.member.roles.cache.has(modRoleConfig) || message.member.roles.cache.has(modRoleConfig) || (client.adminMode == true && message.member.user.id == client.ownerId) ? ending : ``}${message.member.hasPermission("MANAGE_CHANNELS") || message.member.hasPermission("MANAGE_ROLES") || message.member.roles.cache.has(adminRoleConfig) || (client.adminMode == true && message.member.user.id == client.ownerId) ? `\n\n\`\`\`fix\nAdministrator Commands\`\`\`\n\`\`\`\n` : ``}${message.member.hasPermission("MANAGE_CHANNELS") || message.member.hasPermission("MANAGE_ROLES") || (client.adminMode == true && message.member.user.id == client.ownerId) ? `${guildPrefix}create\n` : ``}${message.member.hasPermission("MANAGE_CHANNELS") || message.member.hasPermission("MANAGE_ROLES") || (client.adminMode == true && message.member.user.id == client.ownerId) ? `${guildPrefix}delete\n` : ``}${message.member.hasPermission("MANAGE_ROLES") || (client.adminMode == true && message.member.user.id == client.ownerId) ? `${guildPrefix}roles\n` : ``}${message.member.hasPermission("ADMINISTRATOR") || (client.adminMode == true && message.member.user.id == client.ownerId) ? `${guildPrefix}settings\n` : ``}${message.member.hasPermission("MANAGE_CHANNELS") || message.member.hasPermission("MANAGE_ROLES") || message.member.roles.cache.has(adminRoleConfig) || (client.adminMode == true && message.member.user.id == client.ownerId) ? ending : ``}`;

if (!args || args.length < 1) {
  let embed = new Discord.MessageEmbed()
  .setTitle("HELP")
  .setColor("GREEN")
  .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
  .setDescription(helpDescription)
  .setTimestamp();

  message.channel.send(embed)
} else if (args.toString().startsWith("avatar")) {
  let embed = new Discord.MessageEmbed()
  .setTitle("COMMAND - AVATAR")
  .setColor("GREEN")
  .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
  .setDescription("**Command Info**\nThe avatar command is used to fetch the avatar for the user specified in the command.\n\n**Usage**\n```" + `${guildPrefix}` + "avatar [optional user mention]```\n**Permissions**\nAll members are able to use this command.\n\n**Aliases**\nNone.\n\n**Options**\nNone.")
  .setTimestamp();

  message.channel.send(embed)
} else if (args.toString().startsWith("botinfo")) {
  let embed = new Discord.MessageEmbed()
  .setTitle("COMMAND - BOT INFO")
  .setColor("GREEN")
  .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
  .setDescription("**Command Info**\nThe bot info command is used to provide information about Logic Link.\n\n**Usage**\n```" + `${guildPrefix}` + "botinfo```\n**Permissions**\nAll members are able to use this command.\n\n**Aliases**\nNone.\n\n**Options**\nNone.")
  .setTimestamp();

  message.channel.send(embed)
} else if (args.toString().startsWith("help")) {
  let embed = new Discord.MessageEmbed()
  .setTitle("COMMAND - HELP")
  .setColor("GREEN")
  .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
  .setDescription("**Command Info**\nThe help command is used to provide helpful information about how to use Logic Link's commands.\n\n**Usage**\n```" + `${guildPrefix}` + "help [optional command name]```\n**Permissions**\nAll members are able to use this command.\n\n**Aliases**\nNone.\n\n**Options**\nNone.")
  .setTimestamp();

  message.channel.send(embed)
} else if (args.toString().startsWith("ping")) {
  let embed = new Discord.MessageEmbed()
  .setTitle("COMMAND - PING")
  .setColor("GREEN")
  .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
  .setDescription("**Command Info**\nThe ping command is used to check the bot's connection to Discord's servers.\n\n**Usage**\n```" + `${guildPrefix}` + "ping```\n**Permissions**\nAll members are able to use this command.\n\n**Aliases**\nNone.\n\n**Options**\nNone.")
  .setTimestamp();

  message.channel.send(embed)
} else if (args.toString().startsWith("settings")) {
  const welcomeOptions = `${welcomeSystemConfig ? `\n\`${guildPrefix}settings welcomechannel <channel>\`\n\`${guildPrefix}settings welcomerole <role>\`` : ``}`;

  let embed = new Discord.MessageEmbed()
  .setTitle("COMMAND - SETTINGS")
  .setColor("GREEN")
  .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
  .setDescription("**Command Info**\nThe settings command is used to view / change the bot's settings.\n\n**Usage**\n```" + `${guildPrefix}` + "settings [optional module name]```\n**Permissions**\nOnly members with `ADMINISTRATOR` permissions are able to use this command.\n\n**Aliases**\n`" + `${guildPrefix}`+ "set`\n`" + `${guildPrefix}`+ "setting`\n\n**Options**\n`" + `${guildPrefix}` + "settings prefix <new prefix>`\n`" + `${guildPrefix}` + "settings adminrole <role>`\n`" + `${guildPrefix}` + "settings modrole <role>`\n`" + `${guildPrefix}` + "settings modlogchannel <channel>`\n`" + `${guildPrefix}` + "settings welcome <on / off>`" + `${welcomeOptions}` + "")
  .setTimestamp();

  message.channel.send(embed)
} else if (args.toString().startsWith("setting")) {
  const welcomeOptions = `${welcomeSystemConfig ? `\n\`${guildPrefix}setting welcomechannel <channel>\`\n\`${guildPrefix}setting welcomerole <role>\`` : ``}`;

  let embed = new Discord.MessageEmbed()
  .setTitle("COMMAND - SETTING")
  .setColor("GREEN")
  .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
  .setDescription("**Command Info**\nThe setting command is used to view / change the bot's settings.\n\n**Usage**\n```" + `${guildPrefix}` + "setting [optional module name]```\n**Permissions**\nOnly members with `ADMINISTRATOR` permissions are able to use this command.\n\n**Aliases**\n`" + `${guildPrefix}`+ "set`\n`" + `${guildPrefix}`+ "settings`\n\n**Options**\n`" + `${guildPrefix}` + "setting prefix <new prefix>`\n`" + `${guildPrefix}` + "setting adminrole <role>`\n`" + `${guildPrefix}` + "setting modrole <role>`\n`" + `${guildPrefix}` + "setting modlogchannel <channel>`\n`" + `${guildPrefix}` + "setting welcome <on / off>`" + `${welcomeOptions}` + "")
  .setTimestamp();

  message.channel.send(embed)
} else if (args.toString().startsWith("set")) {
  const welcomeOptions = `${welcomeSystemConfig ? `\n\`${guildPrefix}set welcomechannel <channel>\`\n\`${guildPrefix}set welcomerole <role>\`` : ``}`;

  let embed = new Discord.MessageEmbed()
  .setTitle("COMMAND - SET")
  .setColor("GREEN")
  .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
  .setDescription("**Command Info**\nThe set command is used to view / change the bot's settings.\n\n**Usage**\n```" + `${guildPrefix}` + "set [optional module name]```\n**Permissions**\nOnly members with `ADMINISTRATOR` permissions are able to use this command.\n\n**Aliases**\n`" + `${guildPrefix}`+ "settings`\n`" + `${guildPrefix}`+ "setting`\n\n**Options**\n`" + `${guildPrefix}` + "set prefix <new prefix>`\n`" + `${guildPrefix}` + "set adminrole <role>`\n`" + `${guildPrefix}` + "set modrole <role>`\n`" + `${guildPrefix}` + "set modlogchannel <channel>`\n`" + `${guildPrefix}` + "set welcome <on / off>`" + `${welcomeOptions}` + "")
  .setTimestamp();

  message.channel.send(embed)
} else if (args.toString().startsWith("ban")) {
  let embed = new Discord.MessageEmbed()
  .setTitle("COMMAND - BAN")
  .setColor("GREEN")
  .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
  .setDescription("**Command Info**\nThe ban command is used to permanently remove members from your Discord server, members that are banned will not be able to rejoin unless unbanned.\n\n**Usage**\n```" + `${guildPrefix}` + "ban <user mention> [optional reason]```\n**Permissions**\nOnly members with the `MODERATOR` role are able to use this command.\n\n**Aliases**\nNone.\n\n**Options**\nNone.")
  .setTimestamp();

  message.channel.send(embed)
} else if (args.toString().startsWith("kick")) {
  let embed = new Discord.MessageEmbed()
  .setTitle("COMMAND - KICK")
  .setColor("GREEN")
  .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
  .setDescription("**Command Info**\nThe kick command is used to remove members from your Discord server, members that are kicked can still rejoin.\n\n**Usage**\n```" + `${guildPrefix}` + "kick <user mention> [optional reason]```\n**Permissions**\nOnly members with the `MODERATOR` role are able to use this command.\n\n**Aliases**\nNone.\n\n**Options**\nNone.")
  .setTimestamp();

  message.channel.send(embed)
} else if (args.toString().startsWith("purge")) {
  let embed = new Discord.MessageEmbed()
  .setTitle("COMMAND - PURGE")
  .setColor("GREEN")
  .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
  .setDescription("**Command Info**\nThe purge command is used to delete a certain amount of messages from a channel.\n\n**Usage**\n```" + `${guildPrefix}` + "purge <amount>```\n**Permissions**\nOnly members with `MANAGE_MESSAGES` permissions are able to use this command.\n\n**Aliases**\nNone.\n\n**Options**\nNone.")
  .setTimestamp();

  message.channel.send(embed)
} else if (args.toString().startsWith("unban")) {
  let embed = new Discord.MessageEmbed()
  .setTitle("COMMAND - UNBAN")
  .setColor("GREEN")
  .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
  .setDescription("**Command Info**\nThe unban command is used to remove a ban from a user.\n\n**Usage**\n```" + `${guildPrefix}` + "unban <user id> [optional reason]```\n**Permissions**\nOnly members with the `MODERATOR` role are able to use this command.\n\n**Aliases**\nNone.\n\n**Options**\nNone.")
  .setTimestamp();

  message.channel.send(embed)
} else if (args.toString().startsWith("unmute")) {
  let embed = new Discord.MessageEmbed()
  .setTitle("COMMAND - UNMUTE")
  .setColor("GREEN")
  .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
  .setDescription("**Command Info**\nThe un-mute command is used to re-enable the ability for a member to type in a text channel.\n\n**Usage**\n```" + `${guildPrefix}` + "unmute <user id> [optional reason]```\n**Permissions**\nOnly members with the `MODERATOR` role are able to use this command.\n\n**Aliases**\nNone.\n\n**Options**\nNone.")
  .setTimestamp();

  message.channel.send(embed)
} else if (args.toString().startsWith("voice")) {
  let embed = new Discord.MessageEmbed()
  .setTitle("COMMAND - VOICE")
  .setColor("GREEN")
  .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
  .setDescription("**Command Info**\nThe voice command is a module used to make the bot execute certain voice actions.\n\n**Usage**\n```" + `${guildPrefix}` + "voice <module>```\n**Permissions**\nAll members are able to use this command.\n\n**Aliases**\nNone.\n\n**Options**\n`" + guildPrefix + "voice connect`\n`" + guildPrefix + "disconnect`\n`" + guildPrefix + "voice stop`")
  .setTimestamp();

  message.channel.send(embed)
} else if (args.toString().startsWith("roles")) {
  let embed = new Discord.MessageEmbed()
  .setTitle("COMMAND - ROLES")
  .setColor("GREEN")
  .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
  .setDescription("**Command Info**\nThe roles command is used to give/take roles to or from a member.\n\n**Usage**\n```" + `${guildPrefix}` + "roles <module> <user> <role>```\n**Permissions**\nOnly members with `MANAGE_ROLES` permissions are able to use this command.\n\n**Aliases**\n`" + guildPrefix + "role`\n\n**Options**\n`" + guildPrefix + "roles add <user> <role>`\n`" + guildPrefix + "roles remove <user> <role>`\n")
  .setTimestamp();

  message.channel.send(embed)
} else if (args.toString().startsWith("delete")) {
  let embed = new Discord.MessageEmbed()
  .setTitle("COMMAND - DELETE")
  .setColor("GREEN")
  .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
  .setDescription("**Command Info**\nThe delete command is used to delete a  certain role or channel from your server.\n\n**Usage**\n```" + `${guildPrefix}` + "delete <role or channel>```\n**Permissions**\nOnly members with `MANAGE_ROLES` or `MANAGE_CHANNELS` permissions are able to use this command.\n\n**Aliases**\nNone.\n\n**Options**\nNone")
  .setTimestamp();

  message.channel.send(embed)
} else if (args.toString().startsWith("create")) {
  let embed = new Discord.MessageEmbed()
  .setTitle("COMMAND - CREATE")
  .setColor("GREEN")
  .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
  .setDescription("**Command Info**\nThe create command is used to create roles and channels in your server.\n\n**Usage**\n```" + `${guildPrefix}` + "create <module> <name>```\n**Permissions**\nOnly members with `MANAGE_ROLES` or `MANAGE_CHANNELS` permissions are able to use this command.\n\n**Aliases**\nNone.\n\n**Options**\n`" + guildPrefix + "create channel <name>`\n`" + guildPrefix + "create role <name>`\n`" + guildPrefix + "create voice <name>`")
  .setTimestamp();

  message.channel.send(embed)
} else if (args.toString().startsWith("role")) {
  let embed = new Discord.MessageEmbed()
  .setTitle("COMMAND - ROLE")
  .setColor("GREEN")
  .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
  .setDescription("**Command Info**\nThe role command is used to give/take roles to or from a member.\n\n**Usage**\n```" + `${guildPrefix}` + "role <module> <user> <role>```\n**Permissions**\nOnly members with `MANAGE_ROLES` permissions are able to use this command.\n\n**Aliases**\n`" + guildPrefix + "roles`\n\n**Options**\n`" + guildPrefix + "role add <user> <role>`\n`" + guildPrefix + "role remove <user> <role>`")
  .setTimestamp();

  message.channel.send(embed)
} else if (args.toString().startsWith("invite")) {
  let embed = new Discord.MessageEmbed()
  .setTitle("COMMAND - INVITE")
  .setColor("GREEN")
  .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
  .setDescription("**Command Info**\nThe invite command is used to provide the invite link to add Logic Link to your Discord server.\n\n**Usage**\n```" + `${guildPrefix}` + "invite```\n**Permissions**\nAll members are able to use this command.\n\n**Aliases**\nNone.\n\n**Options**\nNone.")
  .setTimestamp();

  message.channel.send(embed)
} else {
  let embed = new Discord.MessageEmbed()
  .setTitle("HELP")
  .setColor("ORANGE")
  .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
  .setDescription(`\`${secArg}\` is not a valid command.\nRun the \`${guildPrefix}help\` command for a list of available commands.`)
  .setTimestamp();

  message.channel.send(embed)
}