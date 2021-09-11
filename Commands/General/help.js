const Discord = require("discord.js");
const Buttons = require("discord-buttons");
const Fetch = require("node-fetch");

exports.run = async (client, message, args, command, settings, tsettings, extra) => {
  const clientMember = message.guild.me;
  const guildPrefix = await client.functions.fetchPrefix(message.guild);
  
  const noArgs = await client.functions.getNoArgs(command, message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = await client.functions.getArgs(args);
  const code = `\`\`\``;
  const responses = {};

  try {
    var hasSupportRole = false;

    for await (const [key, val] of tsettings.panels.all) {
      for await (const role of val.support) {
        if (message.member.roles.cache.has(role)) {
          hasSupportRole = true;
          break;
        }
      }
    }

    const supportMember = await client.guilds.cache.get(client.util.supportServer).members.cache.get(message.author.id);
    const noPanels = tsettings.panels.count == 0;

    const modPermissions = `${message.member.roles.cache.has(settings.modRole) || message.member.roles.cache.has(settings.adminRole) || message.member.hasPermission("BAN_MEMBERS") || message.member.hasPermission("KICK_MEMBERS") || message.member.hasPermission("MANAGE_CHANNELS") || message.member.hasPermission("MANAGE_MESSAGES") ? `<:IconLock:868118375170211852> ` : `${client.util.error} `}`;

    const adminPermissions = `${message.member.roles.cache.has(settings.adminRole) || message.member.hasPermission("MANAGE_ROLES") || message.member.hasPermission("ADMINISTRATOR") ? `<:IconSettings:868117828341997588> ` : `${client.util.error} `}`;

    const ticketPermissions = `${(hasSupportRole || message.member.hasPermission("ADMINISTRATOR") || message.member.roles.cache.has(settings.adminRole)) ? `${client.util.panel} ` : `${client.util.error} `}`;
    const supportPermissions = `${supportMember ? `${supportMember.roles.cache.has(client.util.supportRole) && (message.guild.id == client.util.supportServer) || (message.author.id == client.util.devId) ? `${client.util.support} ` : `${client.util.error} `}` : `${client.util.error} `}`;

    const devPermissions = message.author.id == client.util.devId ? `${client.util.integration} ` : null;
    const noPanel = noPanels && (message.member.hasPermission("ADMINISTRATOR") || message.member.roles.cache.has(settings.adminRole));

    const cmdArray = [
      { name: `${client.util.members} General Commands`, value: `${code}\n${guildPrefix}help general${code}\u200b`, inline: true },
      { name: `${modPermissions}Moderator Commands`, value: `${code}\n${guildPrefix}help moderator${code}`, inline: true },
      { name: `${adminPermissions}Administrator Commands`, value: `${code}\n${guildPrefix}help administrator${code}`, inline: true },
      { name: `${ticketPermissions}Ticket Commands`, value: `${code}\n${guildPrefix}help ticket${code}`, inline: true },
      { name: `${supportPermissions}Support Commands`, value: `${code}\n${guildPrefix}help support${code}`, inline: true },
    ]

    if (devPermissions) {
      cmdArray[5] = { name: `${devPermissions}Developer Commands`, value: `${code}\n${guildPrefix}help developer${code}`, inline: true }
    }

    if (!secArg) {
      const selectOptions = [
        { label: "General", value: "Basic info / utility commands available to all users.", id: "Help_Menu:General", emoji: "868118276310437898" },
        { label: "Moderator", value: "Advanced moderation commands useful for stopping raids and attacks.", id: "Help_Menu:Moderator", emoji: "868118375170211852" },
        { label: "Administrator", value: "Easy to use admin / utility commands that can get the job done quickly.", id: "Help_Menu:Administrator", emoji: "868117828341997588" },
        { label: "Ticket", value: "Next generation ticket systems and commands great for de-cluttering channels.", id: "Help_Menu:Ticket", emoji: "868119725945815110" },
        { label: "Support", value: "Helpful commands for our support team used to diagnose issues.", id: "Help_Menu:Support", emoji: "868117797429997578" }
      ]

      if (devPermissions) {
        selectOptions[5] = { label: "Developer", value: "Secret development commands used to debug problems and fix bugs.", id: "Help_Menu:Developer", emoji: "868118554497671238" }
      }

      const selectMenu = await client.buttons.selectMenu("Select Command Category...", selectOptions, "Help_Menu_Select", 1, 1);

      const helpEmbed = client.embeds.field(command, `${client.util.welcomeBotInfo}\n\n**Command List**\nBelow shows a list of command categories.\nTo view commands in each category, run the command associated with it.\nIf you would like a detailed guide on the help menu, run \`${guildPrefix}help guide\`.\n\n${code}Commands${code}\u200b`, cmdArray)

      const msg = await message.channel.send(helpEmbed, selectMenu);
      client.prompts.helpMenu(msg, message, modPermissions, adminPermissions, ticketPermissions, supportPermissions, guildPrefix, noPanel);
    } else {
      switch (secArg) {
        case "g":
        case "gen":
        case "general":
        {
          const helpEmbed = client.embeds.helpCategory("General", `${client.util.members} `, guildPrefix);
          message.lineReply(helpEmbed);
          break;
        }
        case "m":
        case "mod":
        case "moderator":
        case "moderation":
        {
          const helpEmbed = client.embeds.helpCategory("Moderator", modPermissions, guildPrefix);
          message.lineReply(helpEmbed);
          break;
        }
        case "a":
        case "adm":
        case "admin":
        case "administrator":
        case "administration":
        {
          const helpEmbed = client.embeds.helpCategory("Administrator", adminPermissions, guildPrefix);
          message.lineReply(helpEmbed);
          break;
        }
        case "t":
        case "tck":
        case "ticket":
        case "tickets":
        {
          const noPanel = noPanels && (message.member.hasPermission("ADMINISTRATOR") || message.member.roles.cache.has(settings.adminRole));

          const helpEmbed = client.embeds.helpCategory("Ticket", `${client.util.members} `, guildPrefix, ticketPermissions, adminPermissions, noPanel);
          message.lineReply(helpEmbed);
          break;
        }
        case "s":
        case "sup":
        case "support":
        {
          const helpEmbed = client.embeds.helpCategory("Support", supportPermissions, guildPrefix);
          message.lineReply(helpEmbed);
          break;
        }
        case "d":
        case "dev":
        case "developer":
        {
          const helpEmbed = client.embeds.helpCategory("Developer", devPermissions, guildPrefix);
          message.lineReply(helpEmbed);
          break;
        }
        default:
        {
          if (secArg == "guide") {
            const embed = client.embeds.blue(command, `\`<>\` <:Line:867201669371265054> Required field.\n\`[]\` <:Line:867201669371265054> Optional field.\n\`|\` <:Line:867201669371265054> Or indicator.`);
            return message.lineReply(embed)
          }
          
          var infoCmd = await client.functions.findCommand(secArg);
          if (infoCmd) {
            const embed = client.embeds.helpMenu(infoCmd, guildPrefix);
            message.lineReply(embed);
            
          } else {
            const embed = client.embeds.detailed(command, `I could not find a command or category that matched that query.`, `\`${secArg}\` is not a command or category.`);
            message.lineReply(embed);
          }
        }
      }
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, true, message, command, extra.logId);
  } 
}