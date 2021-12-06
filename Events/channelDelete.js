const Discord = require("discord.js");
const Fetch = require("node-fetch");

module.exports = async (client, channel) => {
  const tsettings = client.functions.getTicketData(channel.guild);
  const code = `\`\`\``;
  const responses = {};

  try {
    for (const [panelId, panel] of tsettings.panels.entries()) {
      for (const [ticketId, ticket] of panel.tickets.entries()) {
        if (ticket.channel == channel.id) {
          panel.tickets.delete(ticketId);
          tsettings.panels.set(panelId, panel);

          client.db.panels.set(channel.guild.id, tsettings.panels, "panels");
        }
      }
    }
  } catch (error) {
    client.functions.sendError(error);
  }
}