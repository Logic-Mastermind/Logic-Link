import Discord from "discord.js";
import Types from "../../types";

export default async function run(client: Types.client, message: Discord.Message, args: string[], command: Types.commandData, settings: Types.guildSettings, tsettings: Types.ticketSettings, extra: Types.extraObject) {
  
  const clientMember = message.guild.me;
  const guildPrefix = client.functions.fetchPrefix(message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = client.functions.getArgs(args);
  const code = `\`\`\``;
  const responses = {};

  try {
    if (secArg) {
      if (secArg.toLowerCase() == "off") {
        const channels = await message.guild.channels.fetch();
        channels.forEach((c) => {
          if (!c.permissionsFor(clientMember).has("MANAGE_CHANNELS")) return;
          if (!c.permissionsFor(message.member).has("MANAGE_CHANNELS")) return;

          c.permissionOverwrites.edit(message.guild.roles.everyone, {
            SEND_MESSAGES: null
          });
        });
      }
    }
    
    const confirm = client.components.button({ label: "Confirm", style: "SUCCESS", id: "Guild_Lockdown:Confirm" });
    const cancel = client.components.button({ label: "Cancel", style: "DANGER", id: "Guild_Lockdown:Cancel" });
    const row = client.components.actionRow(confirm, cancel);

    const embed = client.embeds.warn(command, `Are you sure that you would like to lockdown this server's channels?`, [{
      name: "Detailed Info",
      value: "Proceeding will disallow regular server members from being able to type in channels. Click on a button below to either confirm or cancel your choice.",
      inline: false
    }]);

    const msg = await message.reply({ embeds: [embed], components: [row] });
    const collector = msg.createMessageComponentCollector({ time: 60_000 });

    collector.on("collect", async (int) => {
      if (int.user.id !== message.author.id) {
        return int.reply({ embeds: [client.embeds.notComponent()], ephemeral: true });
      }

      int.reply({ content: "still in developmetnt" });
      collector.stop();
    });

  } catch (error) {
    client.functions.sendErrorMsg(error, message, command, extra.logId);
  }
}