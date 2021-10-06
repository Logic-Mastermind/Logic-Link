const Discord = require("discord.js");
const Fetch = require("node-fetch");

module.exports = async (client, interaction) => {
  const guild = interaction.guild;
  const member = interaction.member;

  const clientMember = guild.me;
  const settings = await client.functions.getSettings(guild);
  const tsettings = await client.functions.getTicketData(guild);
  const guildPrefix = await client.functions.fetchPrefix(guild);
  const code = `\`\`\``;
  const responses = {};

  try {
    if (interaction.customId == "Support_Server:Verify") {
      var verifiedRole = guild.roles.cache.get(client.util.supportVerifyRole);
      var unverifiedRole = guild.roles.cache.get(client.util.supportUnverifyRole);

      if (member.roles.cache.has(verifiedRole.id)) return interaction.deferUpdate();
      member.roles.add(verifiedRole);
      member.roles.remove(unverifiedRole);

      const embed = client.embeds.success("Verification", `You have been verified.`);
      interaction.reply({ embeds: [embed], ephemeral: true });
    }
  } catch (error) {
    client.functions.sendError(error);
  }
}