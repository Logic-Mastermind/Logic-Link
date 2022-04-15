import Discord from "discord.js";
import Types from "../../Typings/types";

export default async function run(client: Types.client, message: Discord.Message, args: string[], command: Types.commandData, settings: Types.guildSettings, tsettings: Types.ticketSettings, extra: Types.extraObject) {
  
  const clientMember = message.guild.me;
  const guildPrefix = client.functions.fetchPrefix(message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = client.functions.getArgs(args);
  const code = `\`\`\``;
  const responses = {};

  try {
    let channel: any = message.mentions.channels.first();
    let announcement = args.slice(1).join(" ");
    let option = null;

    if (command.options.includes(secArg)) {
      if (!fourthArg) {
        const embed = client.embeds.noArgs(command.option[secArg], message.guild);
        return message.reply({ embeds: [embed] });
      }

      if (secArg == "role") {
        if (!fifthArg) {
          const embed = client.embeds.noArgs(command.option[secArg], message.guild);
          return message.reply({ embeds: [embed] });
        }

        if (!channel) channel = client.functions.findChannel(fourthArg, message.guild, { searchFilter: (c) => c.isText() });
        const role = message.mentions.roles.first() || client.functions.findRole(thirdArg, message.guild);

        if (!role) {
          const embed = client.embeds.invalidItem(command, ["role"], [thirdArg]);
          return message.reply({ embeds: [embed] });
        }

        announcement = args.slice(3).join(" ");
        option = role.id
      } else {
        option = secArg;
        announcement = args.slice(2).join(" ");
        if (!channel) channel = client.functions.findChannel(thirdArg, message.guild);
      }
    } else {
      if (!channel) channel = client.functions.findChannel(secArg, message.guild);
      option = null;
    }

    if (channel) {
      if (!channel.permissionsFor(message.member).has("SEND_MESSAGES")) {
        const embed = client.embeds.permission(command, "SEND_MESSAGES");
        return message.reply({ embeds: [embed] });
      }

      if (!announcement) {
        const noArgs = client.embeds.noArgs(option ? command.option[option] : command, message.guild);
        return message.reply({ embeds: [noArgs] });
      }

      const announceEmbed = client.embeds.new({ title: "Announcement", description: announcement, footer: [`Announced by ${message.author.tag}`, message.author.displayAvatarURL()]} );
      const messageOptions = { embeds: [announceEmbed], content: null };

      if (option) {
        if (option == "everyone" || option == "here") messageOptions.content = `@${option}`;
        else messageOptions.content = `<@&${option}>`;
      }

      if (!client.functions.isMod(message.member)) {
        if (!channel.permissionsFor(message.member).has("SEND_MESSAGES")) {
          const embed = client.embeds.permission("SEND_MESSAGES");
          return message.reply({ embeds: [embed] });
        }

        if (!channel.permissionsFor(message.member).has("MENTION_EVERYONE")) {
          const embed = client.embeds.permission("MENTION_EVERYONE");
          return message.reply({ embeds: [embed] });
        }
      }

      channel.send(messageOptions)
      .then(() => {
        if (channel.id !== message.channel.id) {
          const embed = client.embeds.success(command, `Sent the announcement to <#${channel.id}>.`);
          message.reply({ embeds: [embed] });
        }
      })
      .catch((error) => {
        const embed = client.embeds.errorInfo(command, message, error);
        message.reply({ embeds: [embed] });
      })
    } else {
      const embed = client.embeds.invalidItem(command, ["text channel"], [option ? thirdArg : secArg]);
      message.reply({ embeds: [embed] });
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, message, command, extra.logId);
  }
}