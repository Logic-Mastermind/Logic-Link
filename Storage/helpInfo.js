switch (secArg) {
        case "avatar":
        {
          let command = commands.general.avatar;
          let commandEmbed = new Discord.MessageEmbed()
          .setTitle(`COMMAND - ${command.name.toUpperCase()}`)
          .setColor(`GREEN`)
          .setFooter(`${footer1}`, `${footer2}`)
          .setDescription(`**Command Info**\n${command.description}\n\n**Usage**\n${code}\n${guildPrefix}${command.usage}${code}\n**Permissions**\n${command.permissions == "ALL" ? `${commands.defaultPermissions}` : `${command.required == "dev" ? `This command has been locked to the bot developer.` : `Only members with the \`${command.permissions}\` permission are able to use this command.`}`}\n\n**Aliases**\n${command.aliases[0] ? `\`${guildPrefix}${command.aliases.join(`\n${guildPrefix}`)}\`` : `${commands.noAlias}`}\n\n**Options**\n${command.options[0] ? `\`${guildPrefix}${command.name} ${command.options.join(`\n${guildPrefix}${command.name} `)}\`` : `${commands.noOption}`}`)
          .setTimestamp();

          message.lineReply(commandEmbed).catch((error) => sendErrorMsg(error))
          break
        }
        case "ban":
        {
          let command = commands.moderator.ban;
          let commandEmbed = new Discord.MessageEmbed()
          .setTitle(`COMMAND - ${command.name.toUpperCase()}`)
          .setColor(`GREEN`)
          .setFooter(`${footer1}`, `${footer2}`)
          .setDescription(`**Command Info**\n${command.description}\n\n**Usage**\n${code}\n${guildPrefix}${command.usage}${code}\n**Permissions**\n${command.permissions == "ALL" ? `${commands.defaultPermissions}` : `${command.required == "dev" ? `This command has been locked to the bot developer.` : `Only members with the \`${command.permissions}\` permission are able to use this command.`}`}\n\n**Aliases**\n${command.aliases[0] ? `\`${guildPrefix}${command.aliases.join(`\n${guildPrefix}`)}\`` : `${commands.noAlias}`}\n\n**Options**\n${command.options[0] ? `\`${guildPrefix}${command.name} ${command.options.join(`\n${guildPrefix}${command.name} `)}\`` : `${commands.noOption}`}`)
          .setTimestamp();

          message.lineReply(commandEmbed).catch((error) => sendErrorMsg(error))
          break
        }
        case "botinfo":
        {
          let command = commands.general.botinfo;
          let commandEmbed = new Discord.MessageEmbed()
          .setTitle(`COMMAND - ${command.name.toUpperCase()}`)
          .setColor(`GREEN`)
          .setFooter(`${footer1}`, `${footer2}`)
          .setDescription(`**Command Info**\n${command.description}\n\n**Usage**\n${code}\n${guildPrefix}${command.usage}${code}\n**Permissions**\n${command.permissions == "ALL" ? `${commands.defaultPermissions}` : `${command.required == "dev" ? `This command has been locked to the bot developer.` : `Only members with the \`${command.permissions}\` permission are able to use this command.`}`}\n\n**Aliases**\n${command.aliases[0] ? `\`${guildPrefix}${command.aliases.join(`\n${guildPrefix}`)}\`` : `${commands.noAlias}`}\n\n**Options**\n${command.options[0] ? `\`${guildPrefix}${command.name} ${command.options.join(`\n${guildPrefix}${command.name} `)}\`` : `${commands.noOption}`}`)
          .setTimestamp();

          message.lineReply(commandEmbed).catch((error) => sendErrorMsg(error))
          break
        }
        case "create":
        {
          let command = commands.administrator.create;
          let commandEmbed = new Discord.MessageEmbed()
          .setTitle(`COMMAND - ${command.name.toUpperCase()}`)
          .setColor(`GREEN`)
          .setFooter(`${footer1}`, `${footer2}`)
          .setDescription(`**Command Info**\n${command.description}\n\n**Usage**\n${code}\n${guildPrefix}${command.usage}${code}\n**Permissions**\n${command.permissions == "ALL" ? `${commands.defaultPermissions}` : `${command.required == "dev" ? `This command has been locked to the bot developer.` : `Only members with the \`${command.permissions[0]}\` or \`${command.permissions[1]}\` permissions are able to use this command.`}`}\n\n**Aliases**\n${command.aliases[0] ? `\`${guildPrefix}${command.aliases.join(`\n${guildPrefix}`)}\`` : `${commands.noAlias}`}\n\n**Options**\n${command.options[0] ? `\`${guildPrefix}${command.name} ${command.options.join(`\n${guildPrefix}${command.name} `)}\`` : `${commands.noOption}`}`)
          .setTimestamp();

          message.lineReply(commandEmbed).catch((error) => sendErrorMsg(error))
          break
        }
        case "delete":
        {
          let command = commands.administrator.delete;
          let commandEmbed = new Discord.MessageEmbed()
          .setTitle(`COMMAND - ${command.name.toUpperCase()}`)
          .setColor(`GREEN`)
          .setFooter(`${footer1}`, `${footer2}`)
          .setDescription(`**Command Info**\n${command.description}\n\n**Usage**\n${code}\n${guildPrefix}${command.usage}${code}\n**Permissions**\n${command.permissions == "ALL" ? `${commands.defaultPermissions}` : `${command.required == "dev" ? `This command has been locked to the bot developer.` : `Only members with the \`${command.permissions}\` permission are able to use this command.`}`}\n\n**Aliases**\n${command.aliases[0] ? `\`${guildPrefix}${command.aliases.join(`\n${guildPrefix}`)}\`` : `${commands.noAlias}`}\n\n**Options**\n${command.options[0] ? `\`${guildPrefix}${command.name} ${command.options.join(`\n${guildPrefix}${command.name} `)}\`` : `${commands.noOption}`}`)
          .setTimestamp();

          message.lineReply(commandEmbed).catch((error) => sendErrorMsg(error))
          break
        }
        case "eval":
        {
          let command = commands.developer.eval;
          let commandEmbed = new Discord.MessageEmbed()
          .setTitle(`COMMAND - ${command.name.toUpperCase()}`)
          .setColor(`GREEN`)
          .setFooter(`${footer1}`, `${footer2}`)
          .setDescription(`**Command Info**\n${command.description}\n\n**Usage**\n${code}\n${guildPrefix}${command.usage}${code}\n**Permissions**\n${command.permissions == "ALL" ? `${commands.defaultPermissions}` : `${command.required == "dev" ? `This command has been locked to the bot developer.` : `Only members with the \`${command.permissions}\` permission are able to use this command.`}`}\n\n**Aliases**\n${command.aliases[0] ? `\`${guildPrefix}${command.aliases.join(`\n${guildPrefix}`)}\`` : `${commands.noAlias}`}\n\n**Options**\n${command.options[0] ? `\`${guildPrefix}${command.name} ${command.options.join(`\n${guildPrefix}${command.name} `)}\`` : `${commands.noOption}`}`)
          .setTimestamp();

          message.lineReply(commandEmbed).catch((error) => sendErrorMsg(error))
          break
        }
        case "help":
        {
          let command = commands.general.help;
          let commandEmbed = new Discord.MessageEmbed()
          .setTitle(`COMMAND - ${command.name.toUpperCase()}`)
          .setColor(`GREEN`)
          .setFooter(`${footer1}`, `${footer2}`)
          .setDescription(`**Command Info**\n${command.description}\n\n**Usage**\n${code}\n${guildPrefix}${command.usage}${code}\n**Permissions**\n${command.permissions == "ALL" ? `${commands.defaultPermissions}` : `${command.required == "dev" ? `This command has been locked to the bot developer.` : `Only members with the \`${command.permissions}\` permission are able to use this command.`}`}\n\n**Aliases**\n${command.aliases[0] ? `\`${guildPrefix}${command.aliases.join(`\n${guildPrefix}`)}\`` : `${commands.noAlias}`}\n\n**Options**\n${command.options[0] ? `\`${guildPrefix}${command.name} ${command.options.join(`\n${guildPrefix}${command.name} `)}\`` : `${commands.noOption}`}`)
          .setTimestamp();

          message.lineReply(commandEmbed).catch((error) => sendErrorMsg(error))
          break
        }
        case "invite":
        {
          let command = commands.general.invite;
          let commandEmbed = new Discord.MessageEmbed()
          .setTitle(`COMMAND - ${command.name.toUpperCase()}`)
          .setColor(`GREEN`)
          .setFooter(`${footer1}`, `${footer2}`)
          .setDescription(`**Command Info**\n${command.description}\n\n**Usage**\n${code}\n${guildPrefix}${command.usage}${code}\n**Permissions**\n${command.permissions == "ALL" ? `${commands.defaultPermissions}` : `${command.required == "dev" ? `This command has been locked to the bot developer.` : `Only members with the \`${command.permissions}\` permission are able to use this command.`}`}\n\n**Aliases**\n${command.aliases[0] ? `\`${guildPrefix}${command.aliases.join(`\n${guildPrefix}`)}\`` : `${commands.noAlias}`}\n\n**Options**\n${command.options[0] ? `\`${guildPrefix}${command.name} ${command.options.join(`\n${guildPrefix}${command.name} `)}\`` : `${commands.noOption}`}`)
          .setTimestamp();

          message.lineReply(commandEmbed).catch((error) => sendErrorMsg(error))
          break
        }
        case "kick":
        {
          let command = commands.moderator.kick;
          let commandEmbed = new Discord.MessageEmbed()
          .setTitle(`COMMAND - ${command.name.toUpperCase()}`)
          .setColor(`GREEN`)
          .setFooter(`${footer1}`, `${footer2}`)
          .setDescription(`**Command Info**\n${command.description}\n\n**Usage**\n${code}\n${guildPrefix}${command.usage}${code}\n**Permissions**\n${command.permissions == "ALL" ? `${commands.defaultPermissions}` : `${command.required == "dev" ? `This command has been locked to the bot developer.` : `Only members with the \`${command.permissions}\` permission are able to use this command.`}`}\n\n**Aliases**\n${command.aliases[0] ? `\`${guildPrefix}${command.aliases.join(`\n${guildPrefix}`)}\`` : `${commands.noAlias}`}\n\n**Options**\n${command.options[0] ? `\`${guildPrefix}${command.name} ${command.options.join(`\n${guildPrefix}${command.name} `)}\`` : `${commands.noOption}`}`)
          .setTimestamp();

          message.lineReply(commandEmbed).catch((error) => sendErrorMsg(error))
          break
        }
        case "membercount":
        {
          let command = commands.general.membercount;
          let commandEmbed = new Discord.MessageEmbed()
          .setTitle(`COMMAND - ${command.name.toUpperCase()}`)
          .setColor(`GREEN`)
          .setFooter(`${footer1}`, `${footer2}`)
          .setDescription(`**Command Info**\n${command.description}\n\n**Usage**\n${code}\n${guildPrefix}${command.usage}${code}\n**Permissions**\n${command.permissions == "ALL" ? `${commands.defaultPermissions}` : `${command.required == "dev" ? `This command has been locked to the bot developer.` : `Only members with the \`${command.permissions}\` permission are able to use this command.`}`}\n\n**Aliases**\n${command.aliases[0] ? `\`${guildPrefix}${command.aliases.join(`\n${guildPrefix}`)}\`` : `${commands.noAlias}`}\n\n**Options**\n${command.options[0] ? `\`${guildPrefix}${command.name} ${command.options.join(`\n${guildPrefix}${command.name} `)}\`` : `${commands.noOption}`}`)
          .setTimestamp();

          message.lineReply(commandEmbed).catch((error) => sendErrorMsg(error))
          break
        }
        case "mute":
        {
          let command = commands.moderator.mute;
          let commandEmbed = new Discord.MessageEmbed()
          .setTitle(`COMMAND - ${command.name.toUpperCase()}`)
          .setColor(`GREEN`)
          .setFooter(`${footer1}`, `${footer2}`)
          .setDescription(`**Command Info**\n${command.description}\n\n**Usage**\n${code}\n${guildPrefix}${command.usage}${code}\n**Permissions**\n${command.permissions == "ALL" ? `${commands.defaultPermissions}` : `${command.required == "dev" ? `This command has been locked to the bot developer.` : `Only members with the \`${command.permissions}\` permission are able to use this command.`}`}\n\n**Aliases**\n${command.aliases[0] ? `\`${guildPrefix}${command.aliases.join(`\n${guildPrefix}`)}\`` : `${commands.noAlias}`}\n\n**Options**\n${command.options[0] ? `\`${guildPrefix}${command.name} ${command.options.join(`\n${guildPrefix}${command.name} `)}\`` : `${commands.noOption}`}`)
          .setTimestamp();

          message.lineReply(commandEmbed).catch((error) => sendErrorMsg(error))
          break
        }
        case "ping":
        {
          let command = commands.general.ping;
          let commandEmbed = new Discord.MessageEmbed()
          .setTitle(`COMMAND - ${command.name.toUpperCase()}`)
          .setColor(`GREEN`)
          .setFooter(`${footer1}`, `${footer2}`)
          .setDescription(`**Command Info**\n${command.description}\n\n**Usage**\n${code}\n${guildPrefix}${command.usage}${code}\n**Permissions**\n${command.permissions == "ALL" ? `${commands.defaultPermissions}` : `${command.required == "dev" ? `This command has been locked to the bot developer.` : `Only members with the \`${command.permissions}\` permission are able to use this command.`}`}\n\n**Aliases**\n${command.aliases[0] ? `\`${guildPrefix}${command.aliases.join(`\n${guildPrefix}`)}\`` : `${commands.noAlias}`}\n\n**Options**\n${command.options[0] ? `\`${guildPrefix}${command.name} ${command.options.join(`\n${guildPrefix}${command.name} `)}\`` : `${commands.noOption}`}`)
          .setTimestamp();

          message.lineReply(commandEmbed).catch((error) => sendErrorMsg(error))
          break
        }
        case "purge":
        {
          let command = commands.moderator.purge;
          let commandEmbed = new Discord.MessageEmbed()
          .setTitle(`COMMAND - ${command.name.toUpperCase()}`)
          .setColor(`GREEN`)
          .setFooter(`${footer1}`, `${footer2}`)
          .setDescription(`**Command Info**\n${command.description}\n\n**Usage**\n${code}\n${guildPrefix}${command.usage}${code}\n**Permissions**\n${command.permissions == "ALL" ? `${commands.defaultPermissions}` : `${command.required == "dev" ? `This command has been locked to the bot developer.` : `Only members with the \`${command.permissions}\` permission are able to use this command.`}`}\n\n**Aliases**\n${command.aliases[0] ? `\`${guildPrefix}${command.aliases.join(`\n${guildPrefix}`)}\`` : `${commands.noAlias}`}\n\n**Options**\n${command.options[0] ? `\`${guildPrefix}${command.name} ${command.options.join(`\n${guildPrefix}${command.name} `)}\`` : `${commands.noOption}`}`)
          .setTimestamp();

          message.lineReply(commandEmbed).catch((error) => sendErrorMsg(error))
          break
        }
        case "reload":
        {
          let command = commands.developer.reload;
          let commandEmbed = new Discord.MessageEmbed()
          .setTitle(`COMMAND - ${command.name.toUpperCase()}`)
          .setColor(`GREEN`)
          .setFooter(`${footer1}`, `${footer2}`)
          .setDescription(`**Command Info**\n${command.description}\n\n**Usage**\n${code}\n${guildPrefix}${command.usage}${code}\n**Permissions**\n${command.permissions == "ALL" ? `${commands.defaultPermissions}` : `${command.required == "dev" ? `This command has been locked to the bot developer.` : `Only members with the \`${command.permissions}\` permission are able to use this command.`}`}\n\n**Aliases**\n${command.aliases[0] ? `\`${guildPrefix}${command.aliases.join(`\n${guildPrefix}`)}\`` : `${commands.noAlias}`}\n\n**Options**\n${command.options[0] ? `\`${guildPrefix}${command.name} ${command.options.join(`\n${guildPrefix}${command.name} `)}\`` : `${commands.noOption}`}`)
          .setTimestamp();

          message.lineReply(commandEmbed).catch((error) => sendErrorMsg(error))
          break
        }
        case "roles":
        {
          let command = commands.administrator.roles;
          let commandEmbed = new Discord.MessageEmbed()
          .setTitle(`COMMAND - ${command.name.toUpperCase()}`)
          .setColor(`GREEN`)
          .setFooter(`${footer1}`, `${footer2}`)
          .setDescription(`**Command Info**\n${command.description}\n\n**Usage**\n${code}\n${guildPrefix}${command.usage}${code}\n**Permissions**\n${command.permissions == "ALL" ? `${commands.defaultPermissions}` : `${command.required == "dev" ? `This command has been locked to the bot developer.` : `Only members with the \`${command.permissions}\` permission are able to use this command.`}`}\n\n**Aliases**\n${command.aliases[0] ? `\`${guildPrefix}${command.aliases.join(`\n${guildPrefix}`)}\`` : `${commands.noAlias}`}\n\n**Options**\n${command.options[0] ? `\`${guildPrefix}${command.name} ${command.options.join(`\n${guildPrefix}${command.name} `)}\`` : `${commands.noOption}`}`)
          .setTimestamp();

          message.lineReply(commandEmbed).catch((error) => sendErrorMsg(error))
          break
        }
        case "settings":
        {
          let command = commands.administrator.settings;
          let commandEmbed = new Discord.MessageEmbed()
          .setTitle(`COMMAND - ${command.name.toUpperCase()}`)
          .setColor(`GREEN`)
          .setFooter(`${footer1}`, `${footer2}`)
          .setDescription(`**Command Info**\n${command.description}\n\n**Usage**\n${code}\n${guildPrefix}${command.usage}${code}\n**Permissions**\n${command.permissions == "ALL" ? `${commands.defaultPermissions}` : `${command.required == "dev" ? `This command has been locked to the bot developer.` : `Only members with the \`${command.permissions}\` permission are able to use this command.`}`}\n\n**Aliases**\n${command.aliases[0] ? `\`${guildPrefix}${command.aliases.join(`\n${guildPrefix}`)}\`` : `${commands.noAlias}`}\n\n**Options**\n${command.options[0] ? `\`${guildPrefix}${command.name} ${command.options.join(`\n${guildPrefix}${command.name} `)}\`` : `${commands.noOption}`}`)
          .setTimestamp();

          message.lineReply(commandEmbed).catch((error) => sendErrorMsg(error))
          break
        }
        case "slow":
        case "smode":
        case "slowmode":
        {
          let command = commands.moderator.slowmode;
          let commandEmbed = new Discord.MessageEmbed()
          .setTitle(`COMMAND - ${command.name.toUpperCase()}`)
          .setColor(`GREEN`)
          .setFooter(`${footer1}`, `${footer2}`)
          .setDescription(`**Command Info**\n${command.description}\n\n**Usage**\n${code}\n${guildPrefix}${command.usage}${code}\n**Permissions**\n${command.permissions == "ALL" ? `${commands.defaultPermissions}` : `${command.required == "dev" ? `This command has been locked to the bot developer.` : `Only members with the \`${command.permissions}\` permission are able to use this command.`}`}\n\n**Aliases**\n${command.aliases[0] ? `\`${guildPrefix}${command.aliases.join(`\n${guildPrefix}`)}\`` : `${commands.noAlias}`}\n\n**Options**\n${command.options[0] ? `\`${guildPrefix}${command.name} ${command.options.join(`\n${guildPrefix}${command.name} `)}\`` : `${commands.noOption}`}`)
          .setTimestamp();

          message.lineReply(commandEmbed).catch((error) => sendErrorMsg(error))
          break
        }
        case "t":
        case "tickets":
        case "tck":
        case "ticket":
        {
          let command = commands.general.ticket;
          let commandEmbed = new Discord.MessageEmbed()
          .setTitle(`COMMAND - ${command.name.toUpperCase()}`)
          .setColor(`GREEN`)
          .setFooter(`${footer1}`, `${footer2}`)
          .setDescription(`**Command Info**\n${command.description}\n\n**Usage**\n${code}\n${guildPrefix}${command.usage}${code}\n**Permissions**\n${command.permissions == "ALL" ? `${commands.defaultPermissions}` : `${command.required == "dev" ? `This command has been locked to the bot developer.` : `Only members with the \`${command.permissions}\` permission are able to use this command.`}`}\n\n**Aliases**\n${command.aliases[0] ? `\`${guildPrefix}${command.aliases.join(`\n${guildPrefix}`)}\`` : `${commands.noAlias}`}\n\n**Options**\n${command.options[0] ? `\`${guildPrefix}${command.name} ${command.options.join(`\n${guildPrefix}${command.name} `)}\`` : `${commands.noOption}`}`)
          .setTimestamp();

          message.lineReply(commandEmbed).catch((error) => sendErrorMsg(error))
          break
        }
        case "unban":
        {
          let command = commands.moderator.unban;
          let commandEmbed = new Discord.MessageEmbed()
          .setTitle(`COMMAND - ${command.name.toUpperCase()}`)
          .setColor(`GREEN`)
          .setFooter(`${footer1}`, `${footer2}`)
          .setDescription(`**Command Info**\n${command.description}\n\n**Usage**\n${code}\n${guildPrefix}${command.usage}${code}\n**Permissions**\n${command.permissions == "ALL" ? `${commands.defaultPermissions}` : `${command.required == "dev" ? `This command has been locked to the bot developer.` : `Only members with the \`${command.permissions}\` permission are able to use this command.`}`}\n\n**Aliases**\n${command.aliases[0] ? `\`${guildPrefix}${command.aliases.join(`\n${guildPrefix}`)}\`` : `${commands.noAlias}`}\n\n**Options**\n${command.options[0] ? `\`${guildPrefix}${command.name} ${command.options.join(`\n${guildPrefix}${command.name} `)}\`` : `${commands.noOption}`}`)
          .setTimestamp();

          message.lineReply(commandEmbed).catch((error) => sendErrorMsg(error))
          break
        }
        case "unmute":
        {
          let command = commands.moderator.unmute;
          let commandEmbed = new Discord.MessageEmbed()
          .setTitle(`COMMAND - ${command.name.toUpperCase()}`)
          .setColor(`GREEN`)
          .setFooter(`${footer1}`, `${footer2}`)
          .setDescription(`**Command Info**\n${command.description}\n\n**Usage**\n${code}\n${guildPrefix}${command.usage}${code}\n**Permissions**\n${command.permissions == "ALL" ? `${commands.defaultPermissions}` : `${command.required == "dev" ? `This command has been locked to the bot developer.` : `Only members with the \`${command.permissions}\` permission are able to use this command.`}`}\n\n**Aliases**\n${command.aliases[0] ? `\`${guildPrefix}${command.aliases.join(`\n${guildPrefix}`)}\`` : `${commands.noAlias}`}\n\n**Options**\n${command.options[0] ? `\`${guildPrefix}${command.name} ${command.options.join(`\n${guildPrefix}${command.name} `)}\`` : `${commands.noOption}`}`)
          .setTimestamp();

          message.lineReply(commandEmbed).catch((error) => sendErrorMsg(error))
          break
        }
        case "voice":
        {
          let command = commands.general.voice;
          let commandEmbed = new Discord.MessageEmbed()
          .setTitle(`COMMAND - ${command.name.toUpperCase()}`)
          .setColor(`GREEN`)
          .setFooter(`${footer1}`, `${footer2}`)
          .setDescription(`**Command Info**\n${command.description}\n\n**Usage**\n${code}\n${guildPrefix}${command.usage}${code}\n**Permissions**\n${command.permissions == "ALL" ? `${commands.defaultPermissions}` : `${command.required == "dev" ? `This command has been locked to the bot developer.` : `Only members with the \`${command.permissions}\` permission are able to use this command.`}`}\n\n**Aliases**\n${command.aliases[0] ? `\`${guildPrefix}${command.aliases.join(`\n${guildPrefix}`)}\`` : `${commands.noAlias}`}\n\n**Options**\n${command.options[0] ? `\`${guildPrefix}${command.name} ${command.options.join(`\n${guildPrefix}${command.name} `)}\`` : `${commands.noOption}`}`)
          .setTimestamp();

          message.lineReply(commandEmbed).catch((error) => sendErrorMsg(error))
          break
        }
        case "guide":
        {
          let guideEmbed = new Discord.MessageEmbed()
          .setTitle(`HELP - GUIDE`)
          .setColor(`GREEN`)
          .setFooter(`${footer1}`, `${footer2}`)
          .setDescription(`**Usage Guide**\nThe following is a guide as to how to read the usage field in the help command.\n\n\`<>\` <:line:858121116491710484> Required field.\n\`[]\` <:line:858121116491710484> Optional field.\n\`|\`\ <:line:858121116491710484> Or indicator.\n\nExample:\n${code}${guildPrefix}command <required> [optional] [yes | no]${code}`)
          .setTimestamp();

          message.lineReply(guideEmbed).catch((error) => sendErrorMsg(error))
          break
        }
        default:
        {
          let invalidEmbed = new Discord.MessageEmbed()
          .setTitle(`HELP`)
          .setColor(`RED`)
          .setFooter(`${footer1}`, `${footer2}`)
          .setDescription(`An invalid help option was found.\nRun the \`${guildPrefix}help\` command to show a list of valid options.`)
          .setTimestamp();

          message.lineReply(invalidEmbed).catch((error) => sendErrorMsg(error))
        }
      }