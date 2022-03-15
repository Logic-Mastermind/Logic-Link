import Discord from "discord.js";
import clearMod from "clear-module";
import client from "../index";
import Chalk from "chalk";
import FS from "fs";

/**
 * A class with methods that standardize specific functions.
 * @class Schemas
 */
 export default class Schemas {
  client: Discord.Client;

  /**
   * Used to set the client property if it still exists.
   * @constructor
   * @param {Discord.Client} [client] - The client.
   */
  constructor(client?: Discord.Client) {
    if (client) this.client = client;
  }
  
  async sendPanel(panel, tsettings, guildId) {
    const channel = client.channels.cache.get(panel.channel) as Discord.TextChannel;
    const embed = client.embeds.blue(panel.name, `${client.util.emojis.check} To create a ticket, click on the button below.`, [{
      name: "Additional Info",
      value: `Clicking the button below will create a ticket for this panel.\nPlease remember to adhere to this server's rules within the ticket.`,
      inline: false
    }]);

    const button = client.components.button({ label: "Create Ticket", id: `Ticket_Create:${panel.id}`, style: "SUCCESS", emoji: "📩" });
    const row = client.components.actionRow(button);

    if (!channel.permissionsFor(channel.guild.me).has("SEND_MESSAGES")) return false;
    const msg = await channel.send({ embeds: [embed], components: [row] });
    const panels = tsettings.panels;
    panel.msg = msg.id;
    
    panels.set(panel.id, panel);
    client.db.tickets.set(guildId, panels, "panels");
    return true;
  }

  async editPanelMsg(panel, tsettings, guildId) {
    
    const channel = await client.channels.fetch(panel.channel) as Discord.TextChannel;
    const embed = client.embeds.blue(panel.name, `${client.util.emojis.check} To create a ticket, click on the button below.`, [{
      name: "Additional Info",
      value: `Clicking the button below will create a ticket for this panel.\nPlease remember to adhere to this server's rules within the ticket.`,
      inline: false
    }]);

    const button = client.components.button({ label: "Create Ticket", id: `Ticket_Create:${panel.id}`, style: "SUCCESS", emoji: "📩" });
    const row = client.components.actionRow(button);

    const msg = channel ? await channel.messages.fetch(panel.msg) : null;
    if (msg) await msg.edit({ embeds: [embed], components: [row] });
    return true;
  }

  async createTicket(guild, panel, member) {
    
    const panels = client.functions.getTicketData(guild).panels;
    const count = ++panel.totalTicketCount;

    let filteredTickets = new Map();
    let totalTickets = 0;

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
    client.db.tickets.set(guild.id, panels, "panels");
    return panel.tickets.get(count);
  }

  async closeTicket(guild, panel, ticket) {
    
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
    client.db.tickets.set(guild.id, panels, "panels");
    return panel.tickets.get(count);
  }

  async openTicket(guild, panel, ticket) {
    
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
    client.db.tickets.set(guild.id, panels, "panels");
    return panel.tickets.get(count);
  }

  async deleteTicket(guild, panel, ticket) {
    
    const panels = client.functions.getTicketData(guild).panels;
    const count = ticket.id;

    const channel = guild.channels.cache.get(ticket.channel);
    setTimeout(async () => await channel.delete(), 3000);

    panel.tickets.delete(count);
    panels.set(panel.id, panel);
    
    client.db.tickets.set(guild.id, panels, "panels");
    return panel;
  }
}