const Discord = require("discord.js");
const Fetch = require("node-fetch");

exports.run = async (client, message, args, command, settings, tsettings, extra) => {
  const clientMember = message.guild.me;
  const guildPrefix = await client.functions.fetchPrefix(message.guild);
  
  const noArgs = await client.functions.getNoArgs(command, message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = await client.functions.getArgs(args);
  const code = `\`\`\``;
  const responses = {};

  try {
    const modPerms = ["BAN_MEMBERS", "KICK_MEMBERS", "MANAGE_MESSAGES"];
    const adminPerms = ["ADMINISTRATOR", "MANAGE_ROLES", "MANAGE_CHANNELS"];

    const hasSupportRole = extra.hasSupport;
    const hasBotSupport = extra.hasBotSupport || extra.isDev;
    const noPanels = tsettings.panels.size == 0;

    const isMod = await modPerms.some((x) => message.member.permissions.has(x)) || client.functions.isMod(message.member, message.guild, settings);

    const isAdmin = await adminPerms.some((x) => message.member.permissions.has(x)) || client.functions.isAdmin(message.member, message.guild, settings);

    const tckPerms = isAdmin || hasSupportRole;
    const noPanel = noPanels && isAdmin;

    const genView = `${client.util.members} General Commands`;
    const modView = `${isMod ? client.util.locked : client.util.error} Moderator Commands`;
    const adminView = `${isAdmin ? client.util.settings : client.util.error} Administrator Commands`;
    const tckView = `${tckPerms ? client.util.panel : client.util.error} Ticket Commands`;
    const supView = `${hasBotSupport ? client.util.support : client.util.error} Support Commands`;
    const devView = `${extra.isDev ? client.util.integration : client.util.error} Developer Commands`;

    const tckAdmin = `${isAdmin ? client.util.settings : client.util.error} Administrator Commands`;
    const tckSupport = `${tckPerms ? client.util.panel : client.util.error} Support Commands`;

    const cmdArray = [
      { name: genView, value: `${code}${guildPrefix}help general${code}\u200b`, inline: true },
      { name: modView, value: `${code}${guildPrefix}help moderator${code}`, inline: true },
      { name: adminView, value: `${code}${guildPrefix}help administrator${code}`, inline: true },
      { name: tckView, value: `${code}${guildPrefix}help ticket${code}`, inline: true },
      { name: supView, value: `${code}${guildPrefix}help support${code}`, inline: true },
    ]

    if (extra.isDev) {
      cmdArray[5] = {
        name: devView,
        value: `${code}\n${guildPrefix}help developer${code}`,
        inline: true
      }
    }

    if (!secArg) {
      const selectOptions = [
        { label: "General", value: "Basic info / utility commands available to all users.", id: "Help_Menu:General", emoji: "868118276310437898" },
        { label: "Moderator", value: "Advanced moderation commands useful for stopping raids and attacks.", id: "Help_Menu:Moderator", emoji: "868118375170211852" },
        { label: "Administrator", value: "Easy to use admin / utility commands that can get the job done quickly.", id: "Help_Menu:Administrator", emoji: "868117828341997588" },
        { label: "Ticket", value: "Next generation ticket systems and commands great for de-cluttering channels.", id: "Help_Menu:Ticket", emoji: "868119725945815110" },
        { label: "Support", value: "Helpful commands for our support team used to diagnose issues.", id: "Help_Menu:Support", emoji: "868117797429997578" }
      ]

      if (extra.isDev) {
        selectOptions[5] = {
          label: "Developer",
          value: "Secret development commands used to debug problems and fix bugs.",
          id: "Help_Menu:Developer",
          emoji: "868118554497671238"
        }
      }

      const selectMenu = await client.buttons.selectMenu("Select Command Category...", selectOptions, "Help_Menu_Select", 1, 1);
      const actionRow = new Discord.MessageActionRow().addComponents(selectMenu);

      const helpEmbed = client.embeds.blue(command, `${client.util.welcomeBotInfo}\n\n**Command List**\nBelow shows a list of command categories.\nTo view commands in each category, run the command associated with it.\nIf you would like a detailed guide on the help menu, run \`${guildPrefix}help guide\`.\n\n${code}Commands${code}\u200b`, cmdArray)

      const msg = await message.reply({ embeds: [helpEmbed], components: [actionRow] });
      const obj = {
        mod: modView,
        admin: adminView,
        support: supView,
        gen: genView,
        dev: devView,
        tck: admin,
        sup: support,
        prefix: guildPrefix,
        noPanel
      }

      client.prompts.helpMenu(msg, message, obj);
    } else {
      switch (secArg) {
        case "g":
        case "gen":
        case "general":
        {
          const embed = client.embeds.helpCategory("General", genView, guildPrefix);
          message.reply({ embeds: [embed] });
          break;
        }
        case "m":
        case "mod":
        case "moderator":
        case "moderation":
        {
          const embed = client.embeds.helpCategory("Moderator", modView, guildPrefix);
          message.reply({ embeds: [embed] });
          break;
        }
        case "a":
        case "adm":
        case "admin":
        case "administrator":
        case "administration":
        {
          const embed = client.embeds.helpCategory("Administrator", adminView, guildPrefix);
          message.reply({ embeds: [embed] });
          break;
        }
        case "t":
        case "tck":
        case "ticket":
        case "tickets":
        {
          const embed = client.embeds.helpCategory("Ticket", admin, guildPrefix, support, noPanel);
          message.reply({ embeds: [embed] });
          break;
        }
        case "s":
        case "sup":
        case "support":
        {
          const embed = client.embeds.helpCategory("Support", supView, guildPrefix);
          message.reply({ embeds: [embed] });
          break;
        }
        case "d":
        case "dev":
        case "developer":
        {
          const embed = client.embeds.helpCategory("Developer", devView, guildPrefix);
          message.reply({ embeds: [embed] });
          break;
        }
        default:
        {
          if (secArg == "guide") {
            const embed = client.embeds.blue(command, `\`<>\` <:Line:867201669371265054> Required field.\n\`[]\` <:Line:867201669371265054> Optional field.\n\`|\` <:Line:867201669371265054> Or indicator.`);
            return message.reply({ embeds: [embed] })
          }
          
          let infoCmd = await client.functions.findCommand(secArg);
          if (infoCmd) {
            if (thirdArg && infoCmd.option) {
              const option = await client.functions.findOption(infoCmd, thirdArg);

              if (option) {
                const embed = client.embeds.helpMenu(option, guildPrefix);
                return message.reply({ embeds: [embed] });
              }
            }

            const embed = client.embeds.helpMenu(infoCmd, guildPrefix);
            message.reply({ embeds: [embed] });
            
          } else {
            const embed = client.embeds.detailed(command, `I could not find a command or category that matched that query.`, `\`${secArg}\` is not a command or category.`);
            message.reply({ embeds: [embed] });
          }
        }
      }
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, message, command, extra.logId);
  } 
}