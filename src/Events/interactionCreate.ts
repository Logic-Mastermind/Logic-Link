import Discord from "discord.js"

export async function handle(interaction: Discord.CommandInteraction) {
  console.log(interaction.options.data)
  interaction.reply("hi");
}