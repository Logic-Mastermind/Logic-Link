const Discord = require("discord.js");
const Fetch = require("node-fetch");
const Chalk = require("chalk");
const FS = require("fs");

export default class Schemas {
  constructor(client?) {
    this.client = client;
  }
  
  async restart() {
    try {
      const client = this.client;
      await client.destroy();
      await client.clearMod.all();
      client.functions.log("\n----------\n");

      const commands = require("/home/runner/Logic-Link/Structures/commands.js");
      const config = require("/home/runner/Logic-Link/Structures/config.js");
      const database = require("/home/runner/Logic-Link/Structures/database.js");
      const util = require("/home/runner/Logic-Link/Structures/util.js");
      const discordFn = require("/home/runner/Logic-Link/Modules/discordFn.js");

      for (const [key, opt] of Object.entries(discordFn)) {
        Discord[key] = opt;
      }

      client.command = commands;
      client.config = config;
      client.db = database;
      client.util = util;

      const cmds = {
        Administrator: [],
        Developer: [],
        General: [],
        Moderator: [],
        Support: [],
        Ticket: { Basic: [], Support: [], Administrator: [] }
      };

      for (const category of client.command.categories) {
        if (category == "Ticket") {
          for (const category of client.command.ticketCategories) {
            FS.readdir(`/home/runner/Logic-Link/Commands/Ticket/${category}/`, (error, files) => {
              if (error) return console.error(error);
              files.forEach((file) => {
                if (!file.endsWith(".js")) return;
                let cmd = require(`/home/runner/Logic-Link/Commands/Ticket/${category}/${file}`);
                let name = file.split(".")[0];
                
                client.functions.log(`CMD: ${Chalk["bold"](name)}`);
                client.commands.set(name, cmd);
                cmds["Ticket"][category].push(name);
              });
              client.category.set("Ticket", cmds["Ticket"]);
            })
          }
          continue;
        }

        FS.readdir(`/home/runner/Logic-Link/Commands/${category}/`, (error, files) => {
          if (error) return console.error(error);
          files.forEach((file) => {
            if (!file.endsWith(".js")) return;
            let cmd = require(`/home/runner/Logic-Link/Commands/${category}/${file}`);
            let name = file.split(".")[0];
            
            client.functions.log(`CMD: ${Chalk["bold"](name)}`);
            client.commands.set(name, cmd);
            cmds[category].push(name);
          });
          client.category.set(category, cmds[category]);
        })
      }


      FS.readdir("/home/runner/Logic-Link/Events/", (error, files) => {
        if (error) return console.error(error);
        files.forEach((file) => {
          const event = require(`/home/runner/Logic-Link/Events/${file}`);
          const bound = event.bind(null, client);
          const name = file.split(".")[0];

          client.removeAllListeners(name);
          client.on(name, bound);
        });
      });

      await client.login(config.token);
      return true;
    } catch (error) {
      client.functions.sendError(error);
      return false;
    }
  }

  async sendPanel(panel, tsettings, guildId) {
    const client = this.client;
    const channel = client.channels.cache.get(panel.channel);
    const embed = client.embeds.blue(panel.name, `${client.util.check} To create a ticket, click on the button below.`, [{
      name: "Additional Info",
      value: `Clicking the button below will create a ticket for this panel.\nPlease remember to adhere to this server's rules within the ticket.`,
      inline: false
    }]);

    const button = client.buttons.emoji(`Ticket_Create:${panel.id}`, `📩`, "SUCCESS", `Create Ticket`);
    const row = client.buttons.actionRow([button]);

    if (!channel.permissionsFor(channel.guild.me).has("SEND_MESSAGES")) return false;
    const msg = await channel.send({ embeds: [embed], components: [row] });
    const panels = tsettings.panels;
    panel.msg = msg.id;
    
    panels.set(panel.id, panel);
    client.db.panels.set(guildId, panels, "panels");
    return true;
  }

  async editPanelMsg(panel, tsettings, guildId) {
    const client = this.client;
    const channel = await client.channels.fetch(panel.channel);
    const embed = client.embeds.blue(panel.name, `${client.util.check} To create a ticket, click on the button below.`, [{
      name: "Additional Info",
      value: `Clicking the button below will create a ticket for this panel.\nPlease remember to adhere to this server's rules within the ticket.`,
      inline: false
    }]);

    const button = client.buttons.emoji(`Ticket_Create:${panel.id}`, `📩`, "SUCCESS", `Create Ticket`);
    const row = client.buttons.actionRow([button]);

    const msg = channel ? await channel.messages.fetch(panel.msg) : null;
    if (msg) await msg.edit({ embeds: [embed], components: [row] });
    return true;
  }

  async createTicket(guild, panel, member) {
    const client = this.client;
    const panels = client.functions.getTicketData(guild).panels;
    const count = ++panel.totalTicketCount;

    var filteredTickets = new Map();
    var totalTickets = 0;

    for (const [id, ticket] of panel.tickets.entries()) {
      if (ticket.opener !== member.id) continue;

      totalTickets++
      if (ticket.state == "OPENED") filteredTickets.set(id, ticket);
    }

    if (totalTickets >= client.config.globalTicketLimit) return "GLOBAL_LIMIT_EXCEEDED";
    if (filteredTickets.size >= panel.ticketLimit) return "LIMIT_EXCEEDED";
    if (!guild.me.permissions.has("MANAGE_CHANNELS")) return "BOT_MISSING_PERMISSIONS";

    const name = panel.ticket.replaceAll("[number]", String(count).padStart(4, "0"));
    const channel = await guild.channels.create(name, { parent: panel.opened });

    const viewChannel = Discord.Permissions.FLAGS.VIEW_CHANNEL;
    const sendMessages = Discord.Permissions.FLAGS.SEND_MESSAGES;
    const overwrites = [
      {
        id: member.id,
        allow: [viewChannel, sendMessages],
        type: "member"
      },
      {
        id: guild.roles.everyone.id,
        deny: [viewChannel, sendMessages],
        type: "role"
      }
    ];

    for (const roleId of panel.support) {
      overwrites.push({
        id: roleId,
        allow: [viewChannel, sendMessages],
        type: "role"
      })
    }

    for (const roleId of panel.additional) {
      overwrites.push({
        id: roleId,
        allow: [viewChannel, sendMessages],
        type: "role"
      })
    }

    await channel.permissionOverwrites.set(overwrites, "Setting ticket permissions");
    panel.tickets.set(count, {
      id: count,
      state: "OPENED",
      channel: channel.id,
      opener: member.id,
      claimer: null,
      timestamp: Date.now()
    });

    panels.set(panel.id, panel);    
    client.db.panels.set(guild.id, panels, "panels");
    return panel.tickets.get(count);
  }

  async closeTicket(guild, panel, ticket) {
    const client = this.client;
    const panels = client.functions.getTicketData(guild).panels;
    const openerId = ticket.opener;
    const count = ticket.id;

    const channel = guild.channels.cache.get(ticket.channel);
    const member = guild.members.cache.get(openerId) || await guild.members.fetch(openerId);

    const isSupport = panel.support.some((id) => member.roles.cache.has(id));
    const isAdditional = panel.additional.some((id) => member.roles.cache.has(id));

    channel.permissionOverwrites.edit(openerId, {
      VIEW_CHANNEL: isSupport || isAdditional,
      SEND_MESSAGES: isSupport || isAdditional
    }, {
      reason: "Updating ticket permissions",
      type: 1
    });

    if (channel.parentId !== panel.closed) {
      channel.setParent(panel.closed);
    }

    panel.tickets.set(count, {
      id: count,
      state: "CLOSED",
      channel: ticket.channel,
      opener: ticket.opener,
      claimer: ticket.claimer,
      timestamp: ticket.timestamp
    });

    panels.set(panel.id, panel);
    client.db.panels.set(guild.id, panels, "panels");
    return panel.tickets.get(count);
  }

  async openTicket(guild, panel, ticket) {
    const client = this.client;
    const panels = client.functions.getTicketData(guild).panels;
    const openerId = ticket.opener;
    const count = ticket.id;

    const channel = guild.channels.cache.get(ticket.channel);
    channel.permissionOverwrites.edit(openerId, {
      VIEW_CHANNEL: true,
      SEND_MESSAGES: true
    }, {
      reason: "Updating ticket permissions",
      type: 1
    });

    if (channel.parentId !== panel.opened) {
      channel.setParent(panel.opened);
    }

    panel.tickets.set(count, {
      id: count,
      state: "OPENED",
      channel: ticket.channel,
      opener: ticket.opener,
      claimer: ticket.claimer,
      timestamp: ticket.timestamp
    });

    panels.set(panel.id, panel);
    client.db.panels.set(guild.id, panels, "panels");
    return panel.tickets.get(count);
  }

  async deleteTicket(guild, panel, ticket) {
    const client = this.client;
    const panels = client.functions.getTicketData(guild).panels;
    const count = ticket.id;

    const channel = guild.channels.cache.get(ticket.channel);
    setTimeout(async () => await channel.delete(), 3000);

    panel.tickets.delete(count);
    panels.set(panel.id, panel);
    
    client.db.panels.set(guild.id, panels, "panels");
    return panel;
  }
}