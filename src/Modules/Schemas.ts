import Discord from "discord.js";
import Types from "../Typings/types";
import client from "../index";

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
  
  /**
   * Sends a panel message to the panel channel.
   * @async
   * @function sendPanel
   * @param {number} panelId - ID of the panel.
   * @param {string} guildId - Guild that the panel is in.
   * @param {string} [newChannelId] - The new channel the message should be sent in.
   * @returns {Promise<string|boolean>}
   */
  async sendPanel(panelId: number, guildId: string, newChannelId?: string) {
    const panels = client.functions.getTicketData(guildId).panels;
    const panel = panels.get(panelId);
    if (!panel) return "INVALID_PANEL";

    let channel = await client.channels.fetch(panel.channel) as Discord.TextChannel;
    if (!channel) return "INVALID_CHANNEL";

    const embed = client.embeds.blue(panel.name, `${client.util.emojis.check} To create a ticket, click on the button below.`, [{
      name: "Additional Info",
      value: `Clicking the button below will create a ticket for this panel.\nPlease remember to adhere to this server's rules within the ticket.`,
      inline: false
    }]);

    const button = client.components.button({ label: "Create Ticket", id: `Ticket_Create:${panel.id}`, style: "SUCCESS", emoji: "📩" });
    const row = client.components.actionRow(button);

    if (!channel.permissionsFor(channel.guild.me).has("SEND_MESSAGES")) return "INSUFFICIENT_PERMISSIONS";
    if (panel.createdMessage) {
      const msg: Discord.Message = await channel.messages.fetch(panel.createdMessage);

      if (newChannelId) {
        const newChannel = await client.channels.fetch(newChannelId) as Discord.TextChannel;
        const newMsg = await newChannel.send({ embeds: [embed] });
        panel.createdMessage = newMsg.id;

        if (msg) msg.delete();
      } else {
        if (!msg) return "INVALID_MESSAGE";
        msg.edit({ embeds: [embed], components: [row] });
      }

    } else {
      const msg = await channel.send({ embeds: [embed], components: [row] });
      panel.createdMessage = msg.id;
    }
    
    panels.set(panel.id, panel);
    client.db.tickets.set(guildId, panels, "panels");
    return true;
  }

  /**
   * Creates a ticket from a panel in a guild.
   * @async
   * @function createTicket
   * @param {Types.panelData} panel - The panel to create a ticket from.
   * @param {Discord.Guild} guild - The guild the panel is in.
   * @param {string} openerId - The ID of the opener of this ticket.
   * @returns {Promise<string|boolean>}
   */
  async createTicket(panel: Types.panelData, guild: Discord.Guild, openerId: string) {
    const panels = client.functions.getTicketData(guild).panels;
    const count = ++panel.totalTicketCount;

    let activeTickets = 0;
    let totalTickets = 0;

    for (const [id, ticket] of panel.tickets.entries()) {
      if (ticket.opener !== openerId) continue;

      totalTickets++;
      if (ticket.state == "OPENED") activeTickets++;
    }

    if (totalTickets >= client.config.globalTicketLimit) return "GLOBAL_LIMIT_EXCEEDED";
    if (activeTickets >= panel.ticketLimit) return "LIMIT_EXCEEDED";
    if (!guild.me.permissions.has("MANAGE_CHANNELS")) return "BOT_MISSING_PERMISSIONS";

    const name = panel.ticketName.replaceAll("[number]", String(count).padStart(4, "0"));
    const channel = await guild.channels.create(name, { parent: panel.opened });

    const perms = [Discord.Permissions.FLAGS.VIEW_CHANNEL, Discord.Permissions.FLAGS.SEND_MESSAGES];
    const overwrites: Discord.OverwriteResolvable[] = [
      {
        id: openerId,
        allow: perms,
        type: "member"
      },
      {
        id: guild.roles.everyone.id,
        deny: perms,
        type: "role"
      }
    ];

    for (const roleId of panel.support) {
      overwrites.push({
        id: roleId,
        allow: perms,
        type: "role"
      })
    }

    for (const roleId of panel.additional) {
      overwrites.push({
        id: roleId,
        allow: perms,
        type: "role"
      })
    }

    await channel.permissionOverwrites.set(overwrites, "Setting ticket permissions");
    panel.tickets.set(count, {
      id: count,
      state: "OPENED",
      channel: channel.id,
      opener: openerId,
      claimer: null,
      timestamp: Date.now()
    });

    panels.set(panel.id, panel);    
    client.db.tickets.set(guild.id, panels, "panels");
    return panel.tickets.get(count);
  }

  /**
   * Changes the state of a ticket to open or closed.
   * @async
   * @function updateTicketState
   * @param {"OPENED"|"CLOSED"} state - New state of the ticket.
   * @param {number} ticketId - ID of the ticket to change.
   * @param {number} panelId - ID of the panel the ticket is in.
   * @param {Discord.Guild} guild - Guild related to the panel.
   * @returns 
   */
  async updateTicketState(state: "OPENED" | "CLOSED", ticketId: number, panelId: number, guild: Discord.Guild) {
    const panels = client.functions.getTicketData(guild).panels;
    const panel = panels.get(panelId);
    if (!panel) return "INVALID_PANEL";

    const ticket = panel.tickets.get(ticketId);
    if (!ticket) return "INVALID_TICKET";

    const channel = guild.channels.cache.get(ticket.channel) as Discord.GuildChannel;
    const member = guild.members.cache.get(ticket.opener) || await guild.members.fetch(ticket.opener);

    const isSupport = panel.support.some((id) => member.roles.cache.has(id));
    const isAdditional = panel.additional.some((id) => member.roles.cache.has(id));

    channel.permissionOverwrites.edit(ticket.opener, {
      VIEW_CHANNEL: isSupport || isAdditional,
      SEND_MESSAGES: isSupport || isAdditional
    }, {
      reason: "Updating ticket permissions",
      type: 1
    });

    if (channel.parentId !== panel.closed) {
      channel.setParent(panel.closed);
    }

    panel.tickets.set(ticket.id, {
      state,
      id: ticket.id,
      channel: ticket.channel,
      opener: ticket.opener,
      claimer: ticket.claimer,
      timestamp: ticket.timestamp
    });

    panels.set(panel.id, panel);
    client.db.tickets.set(guild.id, panels, "panels");
    return panel.tickets.get(ticket.id);
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