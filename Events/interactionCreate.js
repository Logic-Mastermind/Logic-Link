const Discord = require("discord.js");
const Fetch = require("node-fetch");
const ms = require("ms");

module.exports = async (client, interaction) => {
  const guild = interaction.guild;
  const member = interaction.member;
  const intId = interaction.customId;
  var now = Date.now();

  const clientMember = guild.me;
  const settings = await client.functions.getSettings(guild);
  const tsettings = await client.functions.getTicketData(guild);
  const guildPrefix = await client.functions.fetchPrefix(guild);
  const code = `\`\`\``;
  const responses = {};

  try {
    if (interaction.isCommand()) {
      const embed = client.embeds.warn("Slash Commands", `Slash commands are currently in development and cannot be used.`);
      return interaction.reply({ embeds: [embed] });

    } else if (interaction.isButton()) {
      if (intId.startsWith("Ticket") && !intId.startsWith("Ticket_Create")) {
        now = Date.now();
        
        const cooldown = client.cooldown.get(member.id);
        const lastUsed = cooldown?.ticketButtonCooldown || 0;
        const expiration = lastUsed + 1500;

        if (now < expiration) {
          return interaction.deferUpdate();
        }

        client.cooldown.set(member.id, now, "ticketButtonCooldown");
      }

      if (intId.startsWith("Ticket_Create")) {
        const panelId = Number(intId.split("Ticket_Create:")[1]);
        const panel = tsettings.panels.get(panelId);
        now = Date.now();

        const cooldown = client.cooldown.get(member.id);
        const panelCooldowns = cooldown?.ticketCooldowns || {};
        const lastUsed = panelCooldowns[panelId] || 0;
        const expiration = lastUsed + 5000;
        const timeLeft = expiration - now;

        if (now < expiration) {
          const embed = client.embeds.error("Ticket Cooldown", `You are on a cooldown, try again in \`${ms(timeLeft, { long: true })}\`.`);

          return interaction.reply({
            embeds: [embed],
            ephemeral: true
          });
        }

        panelCooldowns[panelId] = now;
        client.cooldown.set(member.id, panelCooldowns, "ticketCooldowns");
        const result = await client.schemas.createTicket(guild, panel, member);

        if (result == "LIMIT_EXCEEDED") {
          const embed = client.embeds.error("Ticket Limit", `You have reached the active ticket limit for this panel. (${panel.ticketLimit}/${panel.ticketLimit})`);
          return interaction.reply({ embeds: [embed], ephemeral: true });
          
        } else if (result == "BOT_MISSING_PERMISSIONS") {
          const embed = client.embeds.botPermission("Insufficient Permissions", `MANAGE_CHANNELS`);
          return interaction.reply({ embeds: [embed], ephemeral: true });

        } else {
          const channel = client.channels.cache.get(result.channel);
          const embed = client.embeds.success("Ticket Created", `Created the <#${channel.id}> ticket.`);
          interaction.reply({ embeds: [embed], ephemeral: true });

          const ticketEmbed = client.embeds.green("Ticket", `You have opened a ticket.\nSupport will be here to assist you shortly.`);

          const closeButton = client.buttons.emoji(`Ticket_Close:${panel.id}-${result.id}`, "🔒", "SECONDARY", "Close");
          const row = client.buttons.actionRow([closeButton]);

          await channel.send({
            content: `<@${interaction.user.id}>`,
            embeds: [ticketEmbed],
            components: [row]
          });
        }

      } else if (intId.startsWith("Ticket_Close")) {
        const ids = intId.split("Ticket_Close:")[1].split("-");
        const panel = tsettings.panels.get(Number(ids[0]));
        const ticket = panel.tickets.get(Number(ids[1]));

        if (ticket.state == "CLOSED") {
          const embed = client.embeds.error("Ticket", `This ticket has already been closed.`);
          return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        await client.schemas.closeTicket(guild, panel, ticket);
        const embed = client.embeds.success("Ticket Closed", `This ticket was closed by <@${interaction.user.id}>.`, [{
          name: "Support Controls",
          value: `🔓 - Re-open this ticket.\n🗒️ - Send a note to the user.\n${client.util.trashcan} - Delete this ticket.`,
          inline: false
        }]);

        const reopenBtn = client.buttons.emoji(`Ticket_Reopen:${panel.id}-${ticket.id}`, "🔓", "SECONDARY", "Re-open");
        const noteBtn = client.buttons.emoji(`Ticket_Note:${panel.id}-${ticket.id}`, "🗒️", "SECONDARY", "Note");
        const deleteBtn = client.buttons.emoji(`Ticket_Delete:${panel.id}-${ticket.id}`, "868118760702234674", "SECONDARY", "Delete");
        const row = client.buttons.actionRow([reopenBtn, noteBtn, deleteBtn]);

        interaction.reply({
          embeds: [embed],
          components: [row]
        });

      } else if (intId.startsWith("Ticket_Reopen:")) {
        const ids = intId.split("Ticket_Reopen:")[1].split("-");
        const panel = tsettings.panels.get(Number(ids[0]));
        const ticket = panel.tickets.get(Number(ids[1]));

        if (ticket.state == "OPENED") {
          const embed = client.embeds.error("Ticket", `This ticket has already been opened.`);
          return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        await client.schemas.openTicket(guild, panel, ticket);
        const embed = client.embeds.success("Ticket Opened", `This ticket was re-opened by <@${interaction.user.id}>.`);

        const closeButton = client.buttons.emoji(`Ticket_Close:${panel.id}-${ticket.id}`, "🔒", "SECONDARY", "Close");
        const row = client.buttons.actionRow([closeButton]);
        interaction.reply({ embeds: [embed], components: [row] });

      } else if (intId.startsWith("Ticket_Note:")) {
        const ids = intId.split("Ticket_Note:")[1].split("-");
        const panel = tsettings.panels.get(Number(ids[0]));
        const ticket = panel.tickets.get(Number(ids[1]));

        const questionEmbed = client.embeds.question("Ticket - Note", `What note would you like to send to <@${ticket.opener}>?`, [{
          name: "Details",
          value: "This note must be 512 or less characters long.\nThis prompt will expire in 60 seconds.",
          inline: false
        }]);

        const cancelBtn = client.buttons.cancel(`Ticket_Note_Cancel:${interaction.user.id}`);
        const row = client.buttons.actionRow([cancelBtn]);

        const filter = (m) => m.author.id == interaction.user.id;
        const opener = client.users.cache.get(ticket.opener);

        await interaction.reply({ embeds: [questionEmbed], components: [row], ephemeral: true });
        const noteCollector = interaction.channel.createMessageCollector({ filter, idle: 60000 });
        
        noteCollector.on("collect", async (msg) => {
          if (msg.content.length > 512) {
            const embed = client.embeds.error("Ticket - Note", `This note is over 512 characters, this prompt has ended.`);

            interaction.editReply({ embeds: [embed], components: [], ephemeral: true });
            msg.delete();
            return noteCollector.stop();
          }

          const note = msg.content;
          const noteEmbed = client.embeds.success("Ticket Note", `You have recieved a note from \`ticket-${String(ticket.id).padStart(4, "0")}\` in ${msg.guild.name}.`, [{
            name: "Note",
            value: note,
            inline: false
          }]);

          const successEmbed = client.embeds.success("Ticket - Note", `Sent the note to <@${ticket.opener}>.`);

          opener.send({ embeds: [noteEmbed] });
          interaction.editReply({ embeds: [successEmbed], components: [], ephemeral: true });
          msg.delete();

          return noteCollector.stop("finish");
        });

        async function handleOnCancel(int) {
          if (!int.customId.startsWith("Ticket_Note_Cancel")) return;
          
          if (int.user.id !== interaction.user.id) {
            const embed = client.embeds.notComponent();
            return int.reply({ embeds: [embed], ephemeral: true });
          }

          noteCollector.stop("cancel")
          const embed = client.embeds.warn("Ticket - Note", `This prompt has been cancelled.`);
          int.update({ embeds: [embed], components: [], ephemeral: true });
          client.removeListener("interactionCreate", handleOnCancel);
        }

        client.on("interactionCreate", handleOnCancel);
        noteCollector.on("end", async (_col, reason) => {
          if (reason !== "user") return;
          
          const embed = client.embeds.inactivity("Ticket - Note");
          await interaction.editReply({ embeds: [embed], components: [], ephemeral: true });
          client.removeListener("interactionCreate", handleOnCancel);
        });

      } else if (intId.startsWith("Ticket_Delete:")) {
        const ids = intId.split("Ticket_Delete:")[1].split("-");
        const panel = tsettings.panels.get(Number(ids[0]));
        const ticket = panel.tickets.get(Number(ids[1]));

        const embed = client.embeds.pending("Ticket - Delete", `This ticket will be deleted in a few seconds...`);
        await interaction.reply({ embeds: [embed] });
        client.schemas.deleteTicket(guild, panel, ticket);

      } else if (intId == "Support_Server:Verify") {
        var verifiedRole = guild.roles.cache.get(client.util.supportVerifyRole);
        var unverifiedRole = guild.roles.cache.get(client.util.supportUnverifyRole);

        if (member.roles.cache.has(verifiedRole.id)) return interaction.deferUpdate();
        member.roles.add(verifiedRole);
        member.roles.remove(unverifiedRole);

        const embed = client.embeds.success("Verification", `You have been verified.`);
        interaction.reply({ embeds: [embed], ephemeral: true });
      }
    }
  } catch (error) {
    client.functions.sendError(error);
  }
}