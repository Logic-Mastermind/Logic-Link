const Discord = require("discord.js");
const prefixManager = require("discord-prefix");
const buttons = require("discord-buttons");
const reply = require("discord-reply");

exports.run = async (client, message, args) =>  {
  var guildPrefix = prefixManager.getPrefix(message.guild.id)
  if (!guildPrefix) guildPrefix = client.defaultPrefix;

  const secArg = args[0];
  const thirdArg = args[1];
  const fourthArg = args[2];
  const fifthArg = args[3];
  const sixthArg = args[4];

  const functions = require("../config/functions.js");
  const commands = require("../config/commands.js");
  const errors = require("../config/errors.js");
  
  const adminRoleConfig = client.settings.get(message.guild.id, "adminRole");
  const modLogChannelConfig = client.settings.get(message.guild.id, "modLogChannel");
  const modRoleConfig = client.settings.get(message.guild.id, "modRole");
  const mutedRoleConfig = client.settings.get(message.guild.id, "mutedRole");
  const welcomeChannelConfig = client.settings.get(message.guild.id, "welcomeChannel");
  const welcomeRoleConfig = client.settings.get(message.guild.id, "welcomeRole");
  const welcomeSystemConfig = client.settings.get(message.guild.id, "welcomeSystem");

  const settings = client.ticketSettings.get(message.guild.id, "settings");
  const panels = client.ticketSettings.get(message.guild.id, "panels");
  var supportRolesAll = [];

  const adminRoleObject = message.guild.roles.cache.get(adminRoleConfig);
  const modLogChannelObject = message.guild.channels.cache.get(modLogChannelConfig);
  const modRoleObject = message.guild.roles.cache.get(modRoleConfig);
  const mutedRoleObject = message.guild.roles.cache.get(mutedRoleConfig);
  const welcomeChannelObject = message.guild.channels.cache.get(welcomeChannelConfig);
  const welcomeRoleObject = message.guild.roles.cache.get(welcomeRoleConfig);

  for (const element of panels) {
    if (!Array.isArray(element)) continue;
    for (const elem of element) {
      for (const [key, value] of Object.entries(elem)) {
        if (key.startsWith("panel")) {
          supportRolesAll.splice(0, 0, ...value.supportRoles)
        }
      }
    }
  }
  
  var hasSupportRoles
  const hasSupportFunction = supportRolesAll.forEach(e => {
    if (message.member.roles.cache.has(e)) {
      hasSupportRoles = true
    }
  });
  var basicLocked = `${panels[0] == 0 ? `<:error1:857332841495134239> ` : ``}`;
  var supportLocked = `${panels[0] == 0 ? `<:error1:857332841495134239> ` : ``}`;
  var adminLocked = ``;

  const clientMember = message.guild.member(client.user);
  const errorChannel = client.channels.cache.get(client.errorChannel)
  const command = commands.general.ticket;
  const ending = `\`\`\``;

  if (!message.member.hasPermission("ADMINISTRATOR")) {
    adminLocked = `<:error1:857332841495134239>`;
    if (hasSupportRoles == false) {
      supportLocked = `<:error1:857332841495134239>`;
    }
  }

  if (adminRoleConfig !== null) {
    if (!message.member.roles.cache.has(adminRoleConfig)) {
      adminLocked = `<:error1:857332841495134239>`;
    }
  }

  if (hasSupportRoles == false) {
    supportLocked = `<:error1:857332841495134239>`;
  }

  if (panels[0] == 0) {
    supportLocked = `<:error1:857332841495134239>`;
  }

  if (!secArg) {
    const helpEmbed = new Discord.MessageEmbed()
    .setTitle(`${command.name.toUpperCase()}`)
    .setColor(`GREEN`)
    .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
    .setDescription(`Welcome to Logic Link, an interactive Discord bot with tons of commands and automation options.\n\n**Ticket Help**\nBelow shows a list of all of ticket commands.\nTo get more details about a particular command, run: \`${guildPrefix}ticket help [command name]\`.\n\n${ending}Ticket Commands${ending}\n‎${(panels[0] == 0 && (message.member.hasPermission("ADMINISTRATOR") || message.member.roles.cache.has(adminRoleConfig))) ? `**[NOTICE]:** You have not created a panel yet, you can do so by running the command: \`${guildPrefix}ticket panel new\`.\n‎` : ``}`)
    .addField(`${basicLocked} Basic Commands`, `${ending}\nthelp\nnew\npanelinfo\nstats\ntag\nticketinfo${ending}`, true)
    .addField(`${supportLocked} Support Commands`, `${ending}\nadd\nclaim\nclose\ndelete\nopen\nremove\nrename${ending}`, true)
    .addField(`${adminLocked} Administrator Commands`, `${ending}\npanel\ntsettings\ntags\nview${ending}`, true)
    .setTimestamp();
      
    message.channel.send(helpEmbed)
  } else if (secArg == "panels" || secArg == "panel" || secArg == "settings" || secArg == "setting" || secArg == "set" || secArg == "tags" || secArg == "view" || secArg == "p" || secArg == "settng" || secArg == "settngs" || secArg == "views" || secArg == "s" || secArg == "t" || secArg == "v") {
    if (message.member.hasPermission("ADMINISTRATOR") || message.member.roles.cache.has(adminRoleConfig)) {
      if (secArg.includes("panel") || secArg == "p") {
        if (thirdArg) {
          if (thirdArg.includes("new") || thirdArg == "n") {
            const promptEmbed = new Discord.MessageEmbed()
            .setTitle(`${command.name.toUpperCase()} - PANEL`)
            .setColor(`GREEN`)
            .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
            .setDescription(`**Succuss**\nStarting panel setup prompt...`)
            .setTimestamp();

            const nameEmbed = new Discord.MessageEmbed()
            .setTitle(`PANEL SETUP PROMPT`)
            .setColor(`BLUE`)
            .setFooter(`Panel Setup Prompt`, message.guild.iconURL())
            .setDescription(`**Panel Name**\nWhat should be the name of this panel?`)
            .setTimestamp();

            const catOpenEmbed = new Discord.MessageEmbed()
            .setTitle(`PANEL SETUP PROMPT`)
            .setColor(`BLUE`)
            .setFooter(`Panel Setup Prompt`, message.guild.iconURL())
            .setDescription(`**Ticket Opened Category**\nWhat is the ID of the category that you would like open tickets to be moved to?`)
            .setTimestamp();

            const catCloseEmbed = new Discord.MessageEmbed()
            .setTitle(`PANEL SETUP PROMPT`)
            .setColor(`BLUE`)
            .setFooter(`Panel Setup Prompt`, message.guild.iconURL())
            .setDescription(`**Ticket Closed Category**\nWhat is the ID of the category that you would like closed tickets to be moved to to?`)
            .setTimestamp();

            const ticketNameEmbed = new Discord.MessageEmbed()
            .setTitle(`PANEL SETUP PROMPT`)
            .setColor(`BLUE`)
            .setFooter(`Panel Setup Prompt`, message.guild.iconURL())
            .setDescription(`**Ticket Name Format**\nWhat should be the name of newly opened tickets?\nExample: \`<Ticket Name>-0001\`.`)
            .setTimestamp();

            const claimingEmbed = new Discord.MessageEmbed()
            .setTitle(`PANEL SETUP PROMPT`)
            .setColor(`BLUE`)
            .setFooter(`Panel Setup Prompt`, message.guild.iconURL())
            .setDescription(`**Ticket Claiming**\nWould you like to enable ticket claiming?\nRespond with \`yes\` or \`no\`.`)
            .setTimestamp();

            const claimedNameEmbed = new Discord.MessageEmbed()
            .setTitle(`PANEL SETUP PROMPT`)
            .setColor(`BLUE`)
            .setFooter(`Panel Setup Prompt`, message.guild.iconURL())
            .setDescription(`**Ticket Claimed Name**\nWhat would you like the name of claimed tickets to be?\nExample: \`<Claimed Ticket Name>-0001\`.`)
            .setTimestamp();

            const supportRolesEmbed = new Discord.MessageEmbed()
            .setTitle(`PANEL SETUP PROMPT`)
            .setColor(`BLUE`)
            .setFooter(`Panel Setup Prompt`, message.guild.iconURL())
            .setDescription(`**Ticket Support Roles**\nWhat are some support roles that you would like for this panel?\nSeparate roles with spaces.`)
            .setTimestamp();

            const additionalRolesEmbed = new Discord.MessageEmbed()
            .setTitle(`PANEL SETUP PROMPT`)
            .setColor(`BLUE`)
            .setFooter(`Panel Setup Prompt`, message.guild.iconURL())
            .setDescription(`**Ticket Additional Roles**\nWhat are some additional roles that you would like for this panel?\nSeparate roles with spaces.`)
            .setTimestamp();

            const panelChannelEmbed = new Discord.MessageEmbed()
            .setTitle(`PANEL SETUP PROMPT`)
            .setColor(`BLUE`)
            .setFooter(`Panel Setup Prompt`, message.guild.iconURL())
            .setDescription(`**Panel Channel**\nWhat channel should we send this panel to?`)
            .setTimestamp();

            var current = 1;
            var cancelled = false;
            var finished = false;

            const filter = (m) => m.author.id == message.author.id;
            const collector = new Discord.MessageCollector(message.channel, filter, { idle: 60 * 1000 })

            var nameMsgId
            var catOpenMsgId
            var catCloseMsgId
            var ticketNameMsgId
            var claimingMsgId
            var claimedNameMsgId
            var supportRolesMsgId
            var additionalRolesMsgId
            var panelChannelMsgId

            var collectedName = null
            var collectedCatOpen = null
            var collectedCatClose = null
            var collectedTicketName = null
            var collectedClaiming = null
            var collectedClaimedName = null
            var collectedSupportRoles = null
            var collectedAdditionalRoles = null
            var collectedPanelChannel = null

            var supRoleView
            var addRoleView

            message.channel.send(promptEmbed)
            .then((m) => {
              m.edit(``, { embed: nameEmbed })
              nameMsgId = m.id;
            })

            collector.on("collect", async (msg) => {
              async function next(num) {
                switch (num) {
                  case 1:
                  {
                    msg.channel.send(nameEmbed).then((m) => nameMsgId = m.id)
                    break
                  }
                  case 2:
                  {
                    msg.channel.send(catOpenEmbed).then((m) => catOpenMsgId = m.id)
                    break
                  }
                  case 3:
                  {
                    msg.channel.send(catCloseEmbed).then((m) => catCloseMsgId = m.id)
                    break
                  }
                  case 4:
                  {
                    msg.channel.send(ticketNameEmbed).then((m) => ticketNameMsgId = m.id)
                    break
                  }
                  case 5:
                  {
                    msg.channel.send(claimingEmbed).then((m) => claimingMsgId = m.id)
                    break
                  }
                  case 6:
                  {
                    msg.channel.send(claimedNameEmbed).then((m) => claimedNameMsgId = m.id)
                    break
                  }
                  case 7:
                  {
                    msg.channel.send(supportRolesEmbed).then((m) => supportRolesMsgId = m.id)
                    break
                  }
                  case 8:
                  {
                    msg.channel.send(additionalRolesEmbed).then((m) => additionalRolesMsgId = m.id)
                    break
                  }
                  case 9:
                  {
                    msg.channel.send(panelChannelEmbed).then((m) => panelChannelMsgId = m.id)
                    break
                  }
                }
              }

              if (current == 1) {
                const editMsg = msg.channel.messages.cache.get(nameMsgId);
                if (msg.content.toLowerCase().includes("skip")) {
                  const noSkipEmbed = new Discord.MessageEmbed()
                  .setTitle(`PANEL SETUP PROMPT`)
                  .setColor(`RED`)
                  .setFooter(`Panel Setup Prompt`, message.guild.iconURL())
                  .setDescription(`**Panel Name**\nWhat should be the name of this panel?\n\n**Error**\nSkipping is not allowed in this prompt. Please try again.`)
                  .setTimestamp();

                  return editMsg.edit(``, { embed: noSkipEmbed })
                }

                if (msg.content.toLowerCase().includes("cancel")) {
                  const cancelledEmbed = new Discord.MessageEmbed()
                  .setTitle(`PANEL SETUP PROMPT`)
                  .setColor(`RED`)
                  .setFooter(`Panel Setup Prompt`, message.guild.iconURL())
                  .setDescription(`**Panel Name**\nThis question has stopped looking for responses.`)
                  .setTimestamp();

                  editMsg.edit(``, { embed: cancelledEmbed })
                  cancelled = true
                  return collector.stop()
                }

                if (msg.content.length <= 3) {
                  const shortNameEmbed = new Discord.MessageEmbed()
                  .setTitle(`PANEL SETUP PROMPT`)
                  .setColor(`RED`)
                  .setFooter(`Panel Setup Prompt`, message.guild.iconURL())
                  .setDescription(`**Panel Name**\nThe panel name must be greater than 3 characters.\nPlease try again.`)
                  .setTimestamp();

                  return editMsg.edit(``, { embed: shortNameEmbed })
                }

                for (const element of panels) {
                  if (!Array.isArray(element)) continue;
                  for (const elem of element) {
                    for (const [name, panel] of Object.entries(elem)) {
                      for (const [key, value] of Object.entries(panel)) {
                        if (key == "name") {
                          if (msg.content == value) {
                            const noDuplicateEmbed = new Discord.MessageEmbed()
                            .setTitle(`PANEL SETUP PROMPT`)
                            .setColor(`RED`)
                            .setFooter(`Panel Setup Prompt`, message.guild.iconURL())
                            .setDescription(`**Panel Name**\nThe name \`${msg.content}\` has already been used in another panel.\nPlease try again.`)
                            .setTimestamp();

                            return editMsg.edit(``, { embed: noDuplicateEmbed })
                          }
                        }
                      }
                    }
                  }
                }
                
                collectedName = msg.content;

                if (msg.content.length > 32) {
                  const limitEmbed = new Discord.MessageEmbed()
                  .setTitle(`PANEL SETUP PROMPT`)
                  .setColor(`RED`)
                  .setFooter(`Panel Setup Prompt`, message.guild.iconURL())
                  .setDescription(`**Panel Name**\nThe panel name cannot be more than 32 characters long.\nPlease try again.`)
                  .setTimestamp();

                  return editMsg.edit(``, { embed: limitEmbed })
                }

                const nameSuccessEmbed = new Discord.MessageEmbed()
                .setTitle(`PANEL SETUP PROMPT`)
                .setColor("GREEN")
                .setFooter(`Panel Setup Prompt`, message.guild.iconURL())
                .setDescription(`**Panel Name**\nPanel name has been set to: \`${msg.content}\`.`)
                .setTimestamp();

                editMsg.edit(``, { embed: nameSuccessEmbed })

                current = 2
                next(2)
              } else if (current == 2) {
                const editMsg = msg.channel.messages.cache.get(catOpenMsgId);
                if (msg.content.toLowerCase().includes("skip")) {
                  const noSkipEmbed = new Discord.MessageEmbed()
                  .setTitle(`PANEL SETUP PROMPT`)
                  .setColor(`RED`)
                  .setFooter(`Panel Setup Prompt`, message.guild.iconURL())
                  .setDescription(`**Ticket Opened Category**\nWhat is the ID of the category that you would like open tickets to be moved to?\n\n**Error**\nSkipping is not allowed in this prompt. Please try again.`)
                  .setTimestamp();

                  return editMsg.edit(``, { embed: noSkipEmbed })
                }

                if (msg.content.toLowerCase().includes("cancel")) {
                  const cancelledEmbed = new Discord.MessageEmbed()
                  .setTitle(`PANEL SETUP PROMPT`)
                  .setColor(`RED`)
                  .setFooter(`Panel Setup Prompt`, message.guild.iconURL())
                  .setDescription(`**Ticket Opened Category**\nThis question has stopped looking for responses.`)
                  .setTimestamp();

                  editMsg.edit(``, { embed: cancelledEmbed })
                  cancelled = true
                  return collector.stop()
                }

                var category = msg.guild.channels.cache.get(msg.content);
                var found = false;

                if (!category) {
                  category = msg.guild.channels.cache.find(c => c.name.toLowerCase() == msg.content.toLowerCase() && c.type == "category")

                  if (!category) category = message.guild.channels.cache.filter(c => c.name.toLowerCase().startsWith(msg.content.toLowerCase()) && c.type == "category" && msg.content.length >= 3).forEach((value, key, map) => {
                    if (found == false) {
                      found = key
                    }
                  })
                }

                if ((!category) && (found !== false)) category = msg.guild.channels.cache.get(found)

                if (!category) {
                  const catOpenErrorEmbed = new Discord.MessageEmbed()
                  .setTitle(`PANEL SETUP PROMPT`)
                  .setColor("RED")
                  .setFooter(`Panel Setup Prompt`, message.guild.iconURL())
                  .setDescription(`**Ticket Opened Category**\nFailed to find the category \`${msg.content}\` in the server.\nPlease try again.`)
                  .setTimestamp();

                  return editMsg.edit(``, { embed: catOpenErrorEmbed })
                }

                if (category.type !== "category") {
                  const catOpenErrorEmbed = new Discord.MessageEmbed()
                  .setTitle(`PANEL SETUP PROMPT`)
                  .setColor("RED")
                  .setFooter(`Panel Setup Prompt`, message.guild.iconURL())
                  .setDescription(`**Ticket Opened Category**\nNo categories have been recorded from your message.\nPlease try again.`)
                  .setTimestamp();

                  return editMsg.edit(``, { embed: catOpenErrorEmbed })
                }

                if (category) {
                  const catOpenSuccessEmbed = new Discord.MessageEmbed()
                  .setTitle(`PANEL SETUP PROMPT`)
                  .setColor("GREEN")
                  .setFooter(`Panel Setup Prompt`, message.guild.iconURL())
                  .setDescription(`**Ticket Opened Category**\n\`${category.name}\` was found in the server.`)
                  .setTimestamp();

                  editMsg.edit(``, { embed: catOpenSuccessEmbed })
                  collectedCatOpen = category.id
                }

                current = 3;
                next(3)
              } else if (current == 3) {
                const editMsg = msg.channel.messages.cache.get(catCloseMsgId);
                if (msg.content.toLowerCase().includes("skip")) {
                  const noSkipEmbed = new Discord.MessageEmbed()
                  .setTitle(`PANEL SETUP PROMPT`)
                  .setColor(`RED`)
                  .setFooter(`Panel Setup Prompt`, message.guild.iconURL())
                  .setDescription(`**Ticket Closed Category**\nWhat is the ID of the category that you would like closed tickets to be moved to?\n\n**Error**\nSkipping is not allowed in this prompt. Please try again.`)
                  .setTimestamp();

                  return editMsg.edit(``, { embed: noSkipEmbed })
                }

                if (msg.content.toLowerCase().includes("cancel")) {
                  const cancelledEmbed = new Discord.MessageEmbed()
                  .setTitle(`PANEL SETUP PROMPT`)
                  .setColor(`RED`)
                  .setFooter(`Panel Setup Prompt`, message.guild.iconURL())
                  .setDescription(`**Ticket Closed Category**\nThis question has stopped looking for responses.`)
                  .setTimestamp();

                  editMsg.edit(``, { embed: cancelledEmbed })
                  cancelled = true
                  return collector.stop()
                }

                var category = msg.guild.channels.cache.get(msg.content);
                var found = false;

                if (!category) {
                  category = msg.guild.channels.cache.find(c => c.name.toLowerCase() == msg.content.toLowerCase() && c.type == "category")

                  if (!category) category = message.guild.channels.cache.filter(c => c.name.toLowerCase().startsWith(msg.content.toLowerCase()) && c.type == "category" && msg.content.length >= 3).forEach((value, key, map) => {
                    if (found == false) {
                      found = key
                    }
                  })
                }

                if ((!category) && (found !== false)) category = msg.guild.channels.cache.get(found)

                  if (!category) {
                  const catOpenErrorEmbed = new Discord.MessageEmbed()
                  .setTitle(`PANEL SETUP PROMPT`)
                  .setColor("RED")
                  .setFooter(`Panel Setup Prompt`, message.guild.iconURL())
                  .setDescription(`**Ticket Closed Category**\nFailed to find the category \`${msg.content}\` in the server.\nPlease try again.`)
                  .setTimestamp();

                  return editMsg.edit(``, { embed: catOpenErrorEmbed })
                }

                if (category.type !== "category") {
                  const catOpenErrorEmbed = new Discord.MessageEmbed()
                  .setTitle(`PANEL SETUP PROMPT`)
                  .setColor("RED")
                  .setFooter(`Panel Setup Prompt`, message.guild.iconURL())
                  .setDescription(`**Ticket Closed Category**\nNo categories have been recorded from your message.\nPlease try again.`)
                  .setTimestamp();

                  return editMsg.edit(``, { embed: catOpenErrorEmbed })
                }

                if (category) {
                  const catClosedSuccessEmbed = new Discord.MessageEmbed()
                  .setTitle(`PANEL SETUP PROMPT`)
                  .setColor("GREEN")
                  .setFooter(`Panel Setup Prompt`, message.guild.iconURL())
                  .setDescription(`**Ticket Closed Category**\n\`${category.name}\` was found in the server.`)
                  .setTimestamp();

                  editMsg.edit(``, { embed: catClosedSuccessEmbed })
                  collectedCatClose = category.id
                } else {
                  const catClosedErrorEmbed = new Discord.MessageEmbed()
                  .setTitle(`PANEL SETUP PROMPT`)
                  .setColor("RED")
                  .setFooter(`Panel Setup Prompt`, message.guild.iconURL())
                  .setDescription(`**Ticket Closed Category**\nFailed to find the category \`${msg.content}\` in the server.\nPlease try again.`)
                  .setTimestamp();

                  return editMsg.edit(``, { embed: catClosedErrorEmbed })
                }
                current = 4;
                next(4)
              } else if (current == 4) {
                const editMsg = msg.channel.messages.cache.get(ticketNameMsgId);
                if (msg.content.toLowerCase().includes("skip")) {
                  const noSkipEmbed = new Discord.MessageEmbed()
                  .setTitle(`PANEL SETUP PROMPT`)
                  .setColor(`RED`)
                  .setFooter(`Panel Setup Prompt`, message.guild.iconURL())
                  .setDescription(`**Ticket Name**\nWhat should be the name of newly opened tickets?\nExample: \`ticket-0001\`.\n\n**Error**\nSkipping is not allowed in this prompt. Please try again.`)
                  .setTimestamp();

                  return editMsg.edit(``, { embed: noSkipEmbed })
                }

                if (msg.content.toLowerCase().includes("cancel")) {
                  const cancelledEmbed = new Discord.MessageEmbed()
                  .setTitle(`PANEL SETUP PROMPT`)
                  .setColor(`RED`)
                  .setFooter(`Panel Setup Prompt`, message.guild.iconURL())
                  .setDescription(`**Ticket Name**\nThis question has stopped looking for responses.`)
                  .setTimestamp();

                  editMsg.edit(``, { embed: cancelledEmbed })
                  cancelled = true
                  return collector.stop()
                }

                if (msg.content.length > 27) {
                  const limitEmbed = new Discord.MessageEmbed()
                  .setTitle(`PANEL SETUP PROMPT`)
                  .setColor(`RED`)
                  .setFooter(`Panel Setup Prompt`, message.guild.iconURL())
                  .setDescription(`**Ticket Name**\nThe name cannot be more than 27 characters long.\nPlease try again.`)
                  .setTimestamp();

                  return editMsg.edit(``, { embed: limitEmbed })
                }

                collectedTicketName = msg.content

                const successEmbed = new Discord.MessageEmbed()
                .setTitle(`PANEL SETUP PROMPT`)
                .setColor(`GREEN`)
                .setFooter(`Panel Setup Prompt`, message.guild.iconURL())
                .setDescription(`**Ticket Name**\nTicket name has been set to: \`${msg.content}\`.`)
                .setTimestamp();

                editMsg.edit(``, { embed: successEmbed })

                current = 5
                next(5)
              } else if (current == 5) {
                const editMsg = msg.channel.messages.cache.get(claimingMsgId);
                if (msg.content.toLowerCase().includes("skip")) {
                  const noSkipEmbed = new Discord.MessageEmbed()
                  .setTitle(`PANEL SETUP PROMPT`)
                  .setColor(`RED`)
                  .setFooter(`Panel Setup Prompt`, message.guild.iconURL())
                  .setDescription(`**Ticket Claiming**\nWould you like to enable ticket claiming?\nRespond with \`yes\` or \`no\`.\n\n**Error**\nSkipping is not allowed in this prompt. Please try again.`)
                  .setTimestamp();

                  return editMsg.edit(``, { embed: noSkipEmbed })
                }

                if (msg.content.toLowerCase().includes("cancel")) {
                  const cancelledEmbed = new Discord.MessageEmbed()
                  .setTitle(`PANEL SETUP PROMPT`)
                  .setColor(`RED`)
                  .setFooter(`Panel Setup Prompt`, message.guild.iconURL())
                  .setDescription(`**Ticket Claiming**\nThis question has stopped looking for responses.`)
                  .setTimestamp();

                  editMsg.edit(``, { embed: cancelledEmbed })
                  cancelled = true
                  return collector.stop()
                }

                if (msg.content.toLowerCase().includes("yes")) {
                  collectedClaiming = true

                  const yesEmbed = new Discord.MessageEmbed()
                  .setTitle(`PANEL SETUP PROMPT`)
                  .setColor(`GREEN`)
                  .setFooter(`Panel Setup Prompt`, message.guild.iconURL())
                  .setDescription(`**Ticket Claiming**\nEnabled ticket claiming.`)
                  .setTimestamp();

                  editMsg.edit(``, { embed: yesEmbed })
                } else if (msg.content.toLowerCase().includes("no")) {
                  collectedClaiming = false

                  const yesEmbed = new Discord.MessageEmbed()
                  .setTitle(`PANEL SETUP PROMPT`)
                  .setColor(`GREEN`)
                  .setFooter(`Panel Setup Prompt`, message.guild.iconURL())
                  .setDescription(`**Ticket Claiming**\nDisabled ticket claiming.`)
                  .setTimestamp();

                  editMsg.edit(``, { embed: yesEmbed })
                } else {
                  const notDetectedEmbed = new Discord.MessageEmbed()
                  .setTitle(`PANEL SETUP PROMPT`)
                  .setColor(`RED`)
                  .setFooter(`Panel Setup Prompt`, message.guild.iconURL())
                  .setDescription(`**Ticket Claiming**\nA yes/no option was not detected in your message.\nPlease try again.`)
                  .setTimestamp();

                  return editMsg.edit(``, { embed: notDetectedEmbed })
                }

                if (collectedClaiming == true) {
                  current = 6
                  next(6)
                } else {
                  current = 7
                  next(7)
                }
              } else if (current == 6) {
                const editMsg = msg.channel.messages.cache.get(claimedNameMsgId);
                if (msg.content.toLowerCase().includes("skip")) {
                  const noSkipEmbed = new Discord.MessageEmbed()
                  .setTitle(`PANEL SETUP PROMPT`)
                  .setColor(`RED`)
                  .setFooter(`Panel Setup Prompt`, message.guild.iconURL())
                  .setDescription(`**Ticket Claimed Name**\nWhat would you like the name of claimed tickets to be?\nExample: \`<Claimed Ticket Name>-0001\`.\n\n**Error**\nSkipping is not allowed in this prompt. Please try again.`)
                  .setTimestamp();

                  return editMsg.edit(``, { embed: noSkipEmbed })
                }

                if (msg.content.toLowerCase().includes("cancel")) {
                  const cancelledEmbed = new Discord.MessageEmbed()
                  .setTitle(`PANEL SETUP PROMPT`)
                  .setColor(`RED`)
                  .setFooter(`Panel Setup Prompt`, message.guild.iconURL())
                  .setDescription(`**Ticket Claimed Name**\nThis question has stopped looking for responses.`)
                  .setTimestamp();

                  editMsg.edit(``, { embed: cancelledEmbed })
                  cancelled = true
                  return collector.stop()
                }

                if (msg.content.length > 27) {
                  const limitEmbed = new Discord.MessageEmbed()
                  .setTitle(`PANEL SETUP PROMPT`)
                  .setColor(`RED`)
                  .setFooter(`Panel Setup Prompt`, message.guild.iconURL())
                  .setDescription(`**Ticket Claimed Name**\nThe name cannot be more than 27 characters long.\nPlease try again.`)
                  .setTimestamp();

                  return editMsg.edit(``, { embed: limitEmbed })
                }

                collectedClaimedName = msg.content

                const successEmbed = new Discord.MessageEmbed()
                .setTitle(`PANEL SETUP PROMPT`)
                .setColor(`GREEN`)
                .setFooter(`Panel Setup Prompt`, message.guild.iconURL())
                .setDescription(`**Ticket Claimed Name**\nTicket claimedname has been set to: \`${msg.content}\`.`)
                .setTimestamp();

                editMsg.edit(``, { embed: successEmbed })

                current = 7
                next(7)
              } else if (current == 7) {
                const editMsg = msg.channel.messages.cache.get(supportRolesMsgId);
                if (msg.content.toLowerCase().includes("skip")) {
                  const noSkipEmbed = new Discord.MessageEmbed()
                  .setTitle(`PANEL SETUP PROMPT`)
                  .setColor(`RED`)
                  .setFooter(`Panel Setup Prompt`, message.guild.iconURL())
                  .setDescription(`**Support Team Roles**\nWhat are some support roles that you would like for this panel?\n\n**Error**\nSkipping is not allowed in this prompt. Please try again.`)
                  .setTimestamp();

                  return editMsg.edit(``, { embed: noSkipEmbed })
                }

                if (msg.content.toLowerCase().includes("cancel")) {
                  const cancelledEmbed = new Discord.MessageEmbed()
                  .setTitle(`PANEL SETUP PROMPT`)
                  .setColor(`RED`)
                  .setFooter(`Panel Setup Prompt`, message.guild.iconURL())
                  .setDescription(`**Support Team Roles**\nThis question has stopped looking for responses.`)
                  .setTimestamp();

                  editMsg.edit(``, { embed: cancelledEmbed })
                  cancelled = true
                  return collector.stop()
                }

                var roleArray = [];
                var otherArray = [];
                var string = ``;

                if (msg.mentions.roles) {
                  msg.mentions.roles.forEach(r => roleArray.splice(0, 0, r.id))
                  roleArray.forEach(r => string = string + `\n<@&${r}>`)
                }

                if (msg.mentions.roles.size == 0) {
                  const failEmbed = new Discord.MessageEmbed()
                  .setTitle(`PANEL SETUP PROMPT`)
                  .setColor(`RED`)
                  .setFooter(`Panel Setup Prompt`, message.guild.iconURL())
                  .setDescription(`**Support Team Roles**\nNo roles have been recorded from your message.\nPlease try again.`)
                  .setTimestamp();

                  return editMsg.edit(``, { embed: failEmbed })
                }

                const collectedEmbed = new Discord.MessageEmbed()
                .setTitle(`PANEL SETUP PROMPT`)
                .setColor(`GREEN`)
                .setFooter(`Panel Setup Prompt`, message.guild.iconURL())
                .setDescription(`**Support Team Roles**\n${msg.mentions.roles.size} ${msg.mentions.roles.size == 1 ? `role was` : `roles were`} collected.\n\n**Collected**${string}`)
                .setTimestamp();

                editMsg.edit(``, { embed: collectedEmbed })
                collectedSupportRoles = roleArray
                supRoleView = string

                current = 8
                next(8)
              } else if (current == 8) {
                const editMsg = msg.channel.messages.cache.get(additionalRolesMsgId);
                if (msg.content.toLowerCase().includes("skip")) {
                  const noSkipEmbed = new Discord.MessageEmbed()
                  .setTitle(`PANEL SETUP PROMPT`)
                  .setColor(`RED`)
                  .setFooter(`Panel Setup Prompt`, message.guild.iconURL())
                  .setDescription(`**Additional Roles**\nWhat are some additional roles that you would like for this panel?\n\n**Error**\nSkipping is not allowed in this prompt. Please try again.`)
                  .setTimestamp();

                  return editMsg.edit(``, { embed: noSkipEmbed })
                }

                if (msg.content.toLowerCase().includes("cancel")) {
                  const cancelledEmbed = new Discord.MessageEmbed()
                  .setTitle(`PANEL SETUP PROMPT`)
                  .setColor(`RED`)
                  .setFooter(`Panel Setup Prompt`, message.guild.iconURL())
                  .setDescription(`**Additional Roles**\nThis question has stopped looking for responses.`)
                  .setTimestamp();

                  editMsg.edit(``, { embed: cancelledEmbed })
                  cancelled = true
                  return collector.stop()
                }

                var roleArray = [];
                var otherArray = [];
                var string = ``;

                if (msg.mentions.roles) {
                  msg.mentions.roles.forEach(r => roleArray.splice(0, 0, r.id))
                  roleArray.forEach(r => string = string + `\n<@&${r}>`)
                }

                if (msg.mentions.roles.size == 0) {
                  const failEmbed = new Discord.MessageEmbed()
                  .setTitle(`PANEL SETUP PROMPT`)
                  .setColor(`RED`)
                  .setFooter(`Panel Setup Prompt`, message.guild.iconURL())
                  .setDescription(`**Additional Roles**\nNo roles have been recorded from your message.\nPlease try again.`)
                  .setTimestamp();

                  return editMsg.edit(``, { embed: failEmbed })
                }

                const collectedEmbed = new Discord.MessageEmbed()
                .setTitle(`PANEL SETUP PROMPT`)
                .setColor(`GREEN`)
                .setFooter(`Panel Setup Prompt`, message.guild.iconURL())
                .setDescription(`**Additional Roles**\n${msg.mentions.roles.size} ${msg.mentions.roles.size == 1 ? `role was` : `roles were`} collected.\n\n**Collected**${string}`)
                .setTimestamp();

                editMsg.edit(``, { embed: collectedEmbed })
                collectedAdditionalRoles = roleArray
                addRoleView = string

                current = 9
                next(9)
              } else if (current == 9) {
                const editMsg = msg.channel.messages.cache.get(panelChannelMsgId);
                if (msg.content.toLowerCase().includes("skip")) {
                  const noSkipEmbed = new Discord.MessageEmbed()
                  .setTitle(`PANEL SETUP PROMPT`)
                  .setColor(`RED`)
                  .setFooter(`Panel Setup Prompt`, message.guild.iconURL())
                  .setDescription(`**Panel Channel**\nWhat channel should we send this panel to?\n\n**Error**\nSkipping is not allowed in this prompt. Please try again.`)
                  .setTimestamp();

                  return editMsg.edit(``, { embed: noSkipEmbed })
                }

                if (msg.content.toLowerCase().includes("cancel")) {
                  const cancelledEmbed = new Discord.MessageEmbed()
                  .setTitle(`PANEL SETUP PROMPT`)
                  .setColor(`RED`)
                  .setFooter(`Panel Setup Prompt`, message.guild.iconURL())
                  .setDescription(`**Panel Channel**\nThis question has stopped looking for responses.`)
                  .setTimestamp();

                  editMsg.edit(``, { embed: cancelledEmbed })
                  cancelled = true
                  return collector.stop()
                }

                var channel = msg.mentions.channels.first();
                if (!channel) {
                  if (!isNaN(msg.content)) {
                    channel = msg.guild.channels.cache.get(msg.content)
                  } else {
                    channel = msg.guild.channels.cache.find(c => c.name == msg.content)
                  }
                }

                if (!channel) {
                  const failEmbed = new Discord.MessageEmbed()
                  .setTitle(`PANEL SETUP PROMPT`)
                  .setColor(`RED`)
                  .setFooter(`Panel Setup Prompt`, message.guild.iconURL())
                  .setDescription(`**Panel Channel**\nNo channels have been recorded from your message.\nPlease try again.`)
                  .setTimestamp();

                  return editMsg.edit(``, { embed: failEmbed })
                }

                if (channel.type !== "text") {
                  const failEmbed = new Discord.MessageEmbed()
                  .setTitle(`PANEL SETUP PROMPT`)
                  .setColor(`RED`)
                  .setFooter(`Panel Setup Prompt`, message.guild.iconURL())
                  .setDescription(`**Panel Channel**\nNo text channels have been recorded from your message.\nPlease try again.`)
                  .setTimestamp();

                  return editMsg.edit(``, { embed: failEmbed })
                }

                collectedPanelChannel = channel.id
                finished = true
                collector.stop()
              }
            })

            collector.on("end", async (collected) => {
              if (finished) {
                const failEmbed = new Discord.MessageEmbed()
                .setTitle(`PANEL SETUP PROMPT`)
                .setColor(`GREEN`)
                .setFooter(`Panel Setup Prompt`, message.guild.iconURL())
                .setDescription(`**Prompt Completed**\nThis prompt has been completed successfully, here is what was collected.\nClick on a button below to either confirm or cancel the settings.`)
                .addField(`Collected`, `Panel Name: ${collectedName}\nOpened Category: #${message.guild.channels.cache.get(collectedCatOpen).name}\nClosed Category: #${message.guild.channels.cache.get(collectedCatClose).name}\nTicket Name: \`${collectedTicketName}\`\nTicket Claiming: ${collectedClaiming == true ? `On\nClaimed Ticket Name: \`${collectedClaimedName}\`` : `Off`}\nPanel Channel: <#${collectedPanelChannel}>\n\n**Support Roles**${supRoleView}\n\n**Additional Roles**${addRoleView}`)
                .setTimestamp();

                const confirmButton = new buttons.MessageButton()
                .setStyle("green")
                .setLabel("Confirm")
                .setID("Ticket_Panel_Confirm");

                const cancelButton = new buttons.MessageButton()
                .setStyle("red")
                .setLabel("Cancel")
                .setID("Ticket_Panel_Cancel");

                var clicked = false
                const btnFilter = (button) => true;
                const msg1 = await message.channel.send(``, { embed: failEmbed, buttons: [confirmButton, cancelButton] });
                const btnCollector1 = msg1.createButtonCollector(btnFilter, { time: 60000 })

                btnCollector1.on("collect", async (button) => {
                  const clicker = await button.clicker
                  clicked = true
                  const failedEmbed = new Discord.MessageEmbed()
                  .setTitle("Insufficient Permissions")
                  .setColor("RED")
                  .setFooter(`Panel Setup Prompt`, message.guild.iconURL())
                  .setDescription("**Error**\nYou do not have permission to carry out this process.\nPermissions needed: ```ADMINISTRATOR```")
                  .setTimestamp();
                  
                  if (!clicker.id == message.author.id) {
                    button.reply.send(``, { embed: failedEmbed, ephemeral: true })
                  } else {
                    if (button.id == "Ticket_Panel_Confirm") {
                      var numOfPanels
                      var newValue
                      var prev

                      for (const element of panels) {
                        if (!Array.isArray(element)) {
                          numOfPanels = element + 1;
                          prev = element;
                          newValue = `panel_${numOfPanels}`
                        }
                      }

                      const otherPanels = panels[1];
                      const panelConfigs = [];
                      const saved = [
                        {
                          [newValue]: {
                            name: `${collectedName}`,
                            categoryOpened: `${collectedCatOpen}`,
                            categoryClosed: `${collectedCatClose}`,
                            ticketName: `${collectedTicketName}`,
                            claiming: `${collectedClaiming}`,
                            claimedTicketName: `${collectedClaimedName}`,
                            supportRoles: collectedSupportRoles,
                            additionalRoles: collectedAdditionalRoles,
                            panelChannel: `${collectedPanelChannel}`,
                            id: `${numOfPanels}`
                          }
                        }
                      ]

                      if (typeof otherPanels !== "undefined") {
                        for (const element of otherPanels) {
                          saved.unshift(element)
                        }
                      }

                      panelConfigs.unshift(numOfPanels);
                      panelConfigs.push(saved)

                      const savedEmbed = new Discord.MessageEmbed()
                      .setTitle("PANEL SETUP PROMPT")
                      .setColor("GREEN")
                      .setFooter(`Panel Setup Prompt`, message.guild.iconURL())
                      .setDescription("**Success**\nSuccessfully saved the panel configurations.")
                      .setTimestamp();

                      client.ticketSettings.set(message.guild.id, panelConfigs, "panels")
                      button.reply.send(``, { embed: savedEmbed })
                      msg1.delete()
                    } else if (button.id == "Ticket_Panel_Cancel") {
                      const cancelEmbed = new Discord.MessageEmbed()
                      .setTitle("PANEL SETUP PROMPT")
                      .setColor("ORANGE")
                      .setFooter(`Panel Setup Prompt`, message.guild.iconURL())
                      .setDescription("**Success**\nSuccessfully cancelled the panel configuration prompt.")
                      .setTimestamp();

                      button.reply.send(``, { embed: cancelEmbed })
                      msg1.delete()
                    }
                  }
                })

                btnCollector1.on("end", async (collected) => {
                  if (clicked == false) {
                    const timeoutEmbed = new Discord.MessageEmbed()
                    .setTitle("PANEL SETUP PROMPT")
                    .setColor("ORANGE")
                    .setFooter(`Panel Setup Prompt`, message.guild.iconURL())
                    .setDescription("**Prompt Timeout**\nThis prompt has timed out due to inactivity.")
                    .setTimestamp();

                    message.channel.send(``, { embed: timeoutEmbed })
                  }
                })
                
              } else if (cancelled) {
                const cancelledEmbed = new Discord.MessageEmbed()
                .setTitle("PANEL SETUP PROMPT")
                .setColor("ORANGE")
                .setFooter(`Panel Setup Prompt`, message.guild.iconURL())
                .setDescription(`**Prompt Cancelled**\nThis prompt has been cancelled successfully.`)
                .setTimestamp();

                message.channel.send(cancelledEmbed)
              } else {
                const timeoutEmbed = new Discord.MessageEmbed()
                .setTitle("PANEL SETUP PROMPT")
                .setColor("ORANGE")
                .setFooter(`Panel Setup Prompt`, message.guild.iconURL())
                .setDescription(`**Prompt Timeout**\nThis prompt has timed out due to inactivity.`)
                .setTimestamp();

                message.channel.send(timeoutEmbed)
              }
            })
          } else if (thirdArg.includes("modify") || thirdArg == "m") {
            if (sixthArg) {
              const panelId = fourthArg;
              const option = fifthArg;
              var validOption = false;
              const options = ["name", "category_opened", "c_opened", "c_open", "c_closed", "c_close","category_closed", "ticket_name", "t_name", "claiming", "claim", "claimed_ticket_name", "claimed_name", "support_roles", "support", "s_roles", "s_role", "additional_roles", "additional", "a_roles", "a_role", "panel_channel", "p_channel"];

              for (const op of options) {
                if (option == op) validOption = true
              }

              if (panelId) {
                if (isNaN(panelId)) {
                  const nAnEmbed = new Discord.MessageEmbed()
                  .setTitle(`${command.name.toUpperCase()} - PANEL MODIFY`)
                  .setColor(`${errors.color}`)
                  .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
                  .setDescription(`**Invalid Panel ID**\nThe Panel ID must be a number.\nIf you are unsure what a Panel ID is, run: \`${guildPrefix}botfaq panel_id\``)
                  .setTimestamp();

                  return message.channel.send(nAnEmbed)
                }

                if (option) {
                  if (!validOption) {
                    const invalidEmbed = new Discord.MessageEmbed()
                    .setTitle(`${command.name.toUpperCase()} - PANEL MODIFY`)
                    .setColor("RED")
                    .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
                    .setDescription(`**Invalid Command Option**\n\`${option}\` is not a valid command option.\nRun \`${guildPrefix}help ticket panel modify\`.`)
                    .setTimestamp();

                    return message.channel.send(invalidEmbed)
                  }
                }
              }




            } else {
              const option = command.option.panel.option.modify;
              const noArgs = {
                title: `${command.name.toUpperCase()} - ${command.option.panel.name.toUpperCase()} ${option.name.toUpperCase()}`,
                color: `ORANGE`,
                description: `**Command Info**\n${option.description}\n\n**Usage**\n${ending}${guildPrefix}ticket panel ${option.usage}${ending}\n**Options**\n${option.options[0] ? `\`${option.options.join(`\n`)}\`` : `${commands.noOption}`}\n\n**Usage Error**\nYou are missing required parameters needed to carry out this command.\nTo get more information, run: \`${guildPrefix}help ticket panel ${option.commandName}\`.`,
                footer1: `Requested by ${message.member ? message.member.displayName : message.author.username}`,
                footer2: message.author.displayAvatarURL()
              }

              const noArgsEmbed = new Discord.MessageEmbed()
              .setTitle(noArgs.title)
              .setColor(noArgs.color)
              .setFooter(noArgs.footer1, noArgs.footer2)
              .setDescription(noArgs.description)
              .setTimestamp();

              message.channel.send(noArgsEmbed).catch((error) => sendErrorMsg(error))
            }

          } else if (thirdArg.includes("delete") || thirdArg == "d") {
            
          } else {
            const invalidEmbed = new Discord.MessageEmbed()
            .setTitle(`${command.name.toUpperCase()}`)
            .setColor(`RED`)
            .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
            .setDescription(`An invalid ticket panel option was found.\nRun the \`${guildPrefix}ticket panel\` command to show a list of valid options.`)
            .setTimestamp();

            message.channel.send(invalidEmbed)
          }
        } else {
          const noArgs = {
            title: `${command.name.toUpperCase()} - ${command.option.panel.name.toUpperCase()}`,
            color: `ORANGE`,
            description: `**Command Info**\n${command.option.panel.description}\n\n**Usage**\n${ending}${guildPrefix}ticket ${command.option.panel.usage}${ending}\n**Options**\n${command.option.panel.options[0] ? `\`${guildPrefix}ticket ${command.option.panel.commandName} ${command.option.panel.options.join(`\n${guildPrefix}ticket ${command.option.panel.commandName} `)}\`` : `${commands.noOption}`}\n\n**Usage Error**\nYou are missing required parameters needed to carry out this command.\nTo get more information, run: \`${guildPrefix}help ticket ${command.option.panel.commandName}\`.`,
            footer1: `Requested by ${message.member ? message.member.displayName : message.author.username}`,
            footer2: message.author.displayAvatarURL()
          }

          const noArgsEmbed = new Discord.MessageEmbed()
          .setTitle(noArgs.title)
          .setColor(noArgs.color)
          .setFooter(noArgs.footer1, noArgs.footer2)
          .setDescription(noArgs.description)
          .setTimestamp();

          message.channel.send(noArgsEmbed).catch((error) => sendErrorMsg(error))
        }
      } else if (secArg == "settings" || secArg == "setting" || secArg == "set") {
        if (panels[0] > 0) {

        } else {
          const errorEmbed = new Discord.MessageEmbed()
          .setTitle(`${command.name.toUpperCase()}`)
          .setColor(`RED`)
          .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
          .setDescription(`**Error**\nThis server doesn't have any panels.\nRun the \`${guildPrefix}ticket panels new\` command before trying to use that command.`)
          .setTimestamp();
            
          message.channel.send(errorEmbed)
        }
      } else if (secArg == "tags") {
        if (panels[0] > 0) {
          
        } else {
          const errorEmbed = new Discord.MessageEmbed()
          .setTitle(`${command.name.toUpperCase()}`)
          .setColor(`RED`)
          .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
          .setDescription(`**Error**\nThis server doesn't have any panels.\nRun the \`${guildPrefix}ticket panels new\` command before trying to use that command.`)
          .setTimestamp();
            
          message.channel.send(errorEmbed)
        }
      } else if (secArg == "view") {
        if (setup == true) {

        } else {
          const errorEmbed = new Discord.MessageEmbed()
          .setTitle(`${command.name.toUpperCase()}`)
          .setColor(`RED`)
          .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
          .setDescription(`**Error**\nThis server doesn't have any panels.\nRun the \`${guildPrefix}ticket panels new\` command before trying to use that command.`)
          .setTimestamp();
            
          message.channel.send(errorEmbed)
        }
      }
    } else {
      const noPermsEmbed = new Discord.MessageEmbed()
      .setTitle(`${errors.permission.title}`)
      .setColor(`${errors.permission.color}`)
      .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
      .setDescription(`${errors.permission.description}${ending}${command.permissions}${ending}`)
      .setTimestamp();

      message.channel.send(noPermsEmbed).catch((err) => {
        const embed = new Discord.MessageEmbed()
        .setTitle(`ERROR`)
        .setColor(`RED`)
        .setDescription(`**Error Information**\nName: Discord API Error\nDescription: There was an error sending an embed message in "${message.guild.name}".\nMessage Sender <@${message.author.id}>\nCommand Executed: ${command.name}\nError Code: ${err.code}\n\n**Error Stack**\n\`\`\`${err.stack}\`\`\``)
        .setTimestamp();

        errorChannel.send(embed).catch((err) => console.log(err))
      })
    }
  }
}