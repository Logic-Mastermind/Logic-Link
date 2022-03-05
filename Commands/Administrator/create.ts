import Discord from "discord.js";
import Types from "../../Typings/types";

export default async function run(client: Types.client, message: Discord.Message, args: string[], command: Types.commandData, settings: Types.guildSettings, tsettings: Types.ticketSettings, extra: Types.extraObject) {
  
  const clientMember = message.guild.me;
  const guildPrefix = client.functions.fetchPrefix(message.guild);
  
  const noArgs = client.functions.getNoArgs(command, message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = client.functions.getArgs(args);
  const code = `\`\`\``;

  const responses = {
    name: `The name cannot be greater than 100 characters.`
  }
  
  try {
    const name = args.slice(1).join(" ");
    switch (secArg) {
      case "c":
      case "ch":
      case "chan":
      case "channel":
      {
        if (!thirdArg) {
          const embed = client.embeds.noArgs(command.option.channel, message.guild);
          return message.reply({ embeds: [embed] });
        }

        if (!clientMember.permissions.has(command.option.channel.clientPerms)) {
          const embed = client.embeds.botPermission(command.option.channel);
          return message.reply({ embeds: [embed] });
        }

        if (name.length > 100) {
          const embed = client.embeds.error(command.option.channel, responses.name);
          return message.reply({ embeds: [embed] });
        }

        const pendingEmbed = client.embeds.pending(command.option.channel, `Creating the text channel...`);
        const editMsg = await message.reply({ embeds: [pendingEmbed] });

        const chan = await message.guild.channels.create(name, {
          reason: `Created the "${name}" channel. Responsible User: ${message.author.tag}`
        })
        .catch((error) => {
          const embed = client.embeds.errorInfo(command.option.channel, message, error);
          editMsg.edit({ embeds: [embed] });
        }) as Types.guildTextChannels;

        const embed = client.embeds.success(command.option.channel,`Created the <#${chan.id}> channel.`);
        editMsg.edit({ embeds: [embed] });
        break;
      }
      case "r":
      case "rl":
      case "role":
      {
        if (!thirdArg) {
          const embed = client.embeds.noArgs(command.option.role, message.guild);
          return message.reply({ embeds: [embed] })
        }

        if (!clientMember.permissions.has(command.option.role.clientPerms)) {
          const embed = client.embeds.botPermission(command.option.role);
          return message.reply({ embeds: [embed] });
        }

        if (name.length > 100) {
          const embed = client.embeds.error(command.option.role, responses.name);
          return message.reply({ embeds: [embed] });
        }

        const pendingEmbed = client.embeds.pending(command.option.role, `Creating the role...`);
        const editMsg = await message.reply({ embeds: [pendingEmbed] });

        const role = await message.guild.roles.create({
          name: name,
          reason: `Created the "${name}" role. Responsible User: ${message.author.tag}`
        })
        .catch((error) => {
          const embed = client.embeds.errorInfo(command.option.role, message, error);
          editMsg.edit({ embeds: [embed] });
        }) as Discord.Role;

        const embed = client.embeds.success(command.option.role,`Created the <@&${role.id}> role.`);
        editMsg.edit({ embeds: [embed] });
        break;
      }
      case "v":
      case "vc":
      case "voice":
      {
        if (!thirdArg) {
          const embed = client.embeds.noArgs(command.option.voice, message.guild);
          return message.reply({ embeds: [embed] });
        }

        if (!clientMember.permissions.has(command.option.voice.clientPerms)) {
          const embed = client.embeds.botPermission(command.option.voice);
          return message.reply({ embeds: [embed] });
        }

        if (name.length > 100) {
          const embed = client.embeds.error(command.option.voice, responses.name);
          return message.reply({ embeds: [embed] });
        }

        const pendingEmbed = client.embeds.pending(command.option.voice, `Creating the voice channel...`);
        const editMsg = await message.reply({ embeds: [pendingEmbed] });

        const chan = await message.guild.channels.create(name, {
          type: "GUILD_VOICE",
          reason: `Created the "${name}" voice channel. Responsible User: ${message.author.tag}`
        })
        .catch((error) => {
          const embed = client.embeds.errorInfo(command.option.voice, message, error);
          editMsg.edit({ embeds: [embed] });
        }) as Discord.VoiceChannel;

        const embed = client.embeds.success(command.option.voice,`Created the <#${chan.id}> voice channel.`);
        editMsg.edit({ embeds: [embed] });
        break;
      }
      default:
      {
        const embed = client.embeds.detailed(command, `An invalid command option was recieved.`, `\`${secArg}\` is not  a valid command option.`);
        message.reply({ embeds: [embed] });
      }
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, message, command, extra.logId);
  }
}