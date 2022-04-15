import Discord from "discord.js";
import Types from "../../Typings/types";

export default async function run(client: Types.client, message: Discord.Message, args: string[], command: Types.commandData, settings: Types.guildSettings, tsettings: Types.ticketSettings, extra: Types.extraObject) {
  
  const clientMember = message.guild.me;
  const guildPrefix = client.functions.fetchPrefix(message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = client.functions.getArgs(args);
  const code = `\`\`\``;
  const responses = {};

  try {
    const hasBotSupport = extra.hasBotSupport || extra.isDev;
    const noPanels = tsettings.panels.size == 0;

    const isMod = client.functions.isMod(message.member, true);
    const isAdmin = client.functions.isAdmin(message.member, true);
    const tckPerms = isAdmin || extra.hasTicketSupport;

    const obj: Types.helpCategoryInfo = {
      guildPrefix,
      noPanels: noPanels ? `This server has no panels, use the \`${guildPrefix}panels new\` command to create one.` : ``,
      Administrator: `${isAdmin ? client.util.emojis.settings : client.util.emojis.error} Administrator Commands`,
      Developer: `${extra.isDev ? client.util.emojis.integration : client.util.emojis.error} Developer Commands`,
      General: `${client.util.emojis.members} General Commands`,
      Moderator: `${isMod ? client.util.emojis.locked : client.util.emojis.error} Moderator Commands`,
      Support: `${hasBotSupport ? client.util.emojis.support : client.util.emojis.error} Support Commands`,
      Ticket: {
        Basic: `${client.util.emojis.members} Basic Commands`,
        Support: `${tckPerms ? client.util.emojis.panel : client.util.emojis.error} Support Commands`,
        Admin: `${isAdmin ? client.util.emojis.settings : client.util.emojis.error} Administrator Commands`,
        title: `${tckPerms ? client.util.emojis.panel : client.util.emojis.error} Ticket Commands`,
      }
    }

    const cmdArray = [
      { name: obj.General, value: `${code}${guildPrefix}help general${code}\u200b`, inline: true },
      { name: obj.Moderator, value: `${code}${guildPrefix}help moderator${code}`, inline: true },
      { name: obj.Administrator, value: `${code}${guildPrefix}help administrator${code}`, inline: true },
      { name: obj.Ticket.title, value: `${code}${guildPrefix}help ticket${code}`, inline: true },
      { name: obj.Support, value: `${code}${guildPrefix}help support${code}`, inline: true },
    ]

    if (extra.isDev) {
      cmdArray[5] = {
        name: obj.Developer,
        value: `${code}\n${guildPrefix}help developer${code}`,
        inline: true
      }
    }

    if (!secArg) {
      const selectOptions: Types.menuItemData[] = [
        {
          label: "General",
          description: "Basic info / utility commands available to all users.",
          value: "Help_Menu:General",
          emoji: "868118276310437898"
        },
        {
          label: "Moderator",
          description: "Advanced moderation commands useful for stopping raids and attacks.",
          value: "Help_Menu:Moderator",
          emoji: "868118375170211852"
        },
        {
          label: "Administrator",
          description: "Easy to use admin / utility commands that can get the job done quickly.",
          value: "Help_Menu:Administrator",
          emoji: "868117828341997588"
        },
        {
          label: "Ticket",
          description: "Next generation ticket systems and commands great for de-cluttering channels.",
          value: "Help_Menu:Ticket",
          emoji: "868119725945815110"
        },
        {
          label: "Support",
          description: "Helpful commands for our support team used to diagnose issues.",
          value: "Help_Menu:Support",
          emoji: "868117797429997578"
        }
      ]

      if (extra.isDev) {
        selectOptions[5] = {
          label: "Developer",
          description: "Secret development commands used to debug problems and fix bugs.",
          value: "Help_Menu:Developer",
          emoji: "868118554497671238"
        }
      }

      const selectMenu = client.components.selectMenu("Select Command Category...", selectOptions, "Help_Menu_Select", 1, 1);
      const actionRow = new Discord.MessageActionRow().addComponents(selectMenu);

      const helpEmbed = client.embeds.blue(command, `${client.util.messages.welcomeBotInfo}\n\n**Command List**\nBelow shows a list of command categories.\nTo view commands in each category, run the command associated with it.\nIf you would like a detailed guide on the help menu, run \`${guildPrefix}help guide\`.\n\n${code}Commands${code}\u200b`, cmdArray)

      const msg = await message.reply({ embeds: [helpEmbed], components: [actionRow] });
      const prompt = new client.prompt(message, command);
      prompt.helpMenu(msg, obj);
    } else {
      switch (secArg) {
        case "gen":
        case "general":
        {
          const embed = client.embeds.helpCategory("General", obj);
          message.reply({ embeds: [embed] });
          break;
        }
        case "mod":
        case "moderator":
        case "moderation":
        {
          const embed = client.embeds.helpCategory("Moderator", obj);
          message.reply({ embeds: [embed] });
          break;
        }
        case "adm":
        case "admin":
        case "administrator":
        {
          const embed = client.embeds.helpCategory("Administrator", obj);
          message.reply({ embeds: [embed] });
          break;
        }
        case "tck":
        case "ticket":
        case "tickets":
        {
          const embed = client.embeds.helpCategory("Ticket", obj);
          message.reply({ embeds: [embed] });
          break;
        }
        case "sup":
        case "support":
        {
          const embed = client.embeds.helpCategory("Support", obj);
          message.reply({ embeds: [embed] });
          break;
        }
        case "dev":
        case "developer":
        {
          const embed = client.embeds.helpCategory("Developer", obj);
          message.reply({ embeds: [embed] });
          break;
        }
        default:
        {
          if (secArg == "guide") {
            const embed = client.embeds.blue(command, `\`<>\` <:Line:867201669371265054> Required field.\n\`[]\` <:Line:867201669371265054> Optional field.\n\`|\` <:Line:867201669371265054> Or indicator.`);
            return message.reply({ embeds: [embed] })
          }
          
          let infoCmd = client.functions.findCommand(secArg);
          if (infoCmd) {
            if (thirdArg && infoCmd.option) {
              const option = client.functions.findOption(infoCmd, thirdArg);

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