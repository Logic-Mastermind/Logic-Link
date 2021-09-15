const Discord = require("discord.js");
const Fetch = require("node-fetch");

exports.run = async (client, message, args, command, settings, tsettings, extra) => {
  const clientMember = message.guild.me;
  const guildPrefix = await client.functions.fetchPrefix(message.guild);
  
  const noArgs = await client.functions.getNoArgs(command, message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = await client.functions.getArgs(args);
  const code = `\`\`\``;

  const responses = {
    pendingChannel: `Creating the channel...`,
    pendingRole: `Creating the role...`,
    pendingVoice: `Creating the voice channel...`,
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
          const embed = await client.embeds.noArgs(command.option.channel, message.guild);
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

        const pendingEmbed = client.embeds.pending(command.option.channel, responses.pendingChannel);
        const editMsg = await message.reply({ embeds: [pendingEmbed] });

        const chan = await message.guild.channels.create(name, { reason: `Created the "${name}" channel. Responsible User: ${message.author.tag}` })
        .catch(async (error) => {
          const embed = await client.embeds.errorInfo(command.option.channel, message, error);
          editMsg.edit({ embeds: [embed] });
        })

        const embed = client.embeds.success(command.option.channel,`Created the <#${chan.id}> channel.`);
        editMsg.edit({ embeds: [embed] });
        break;
      }
      case "r":
      case "rl":
      case "role":
      {
        if (!thirdArg) {
          const embed = await client.embeds.noArgs(command.option.role, message.guild);
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

        const pendingEmbed = client.embeds.pending(command.option.role, responses.pendingRole);
        const editMsg = await message.reply({ embeds: [pendingEmbed] });

        const role = await message.guild.roles.create({
          name: name,
          reason: `Created the "${name}" role. Responsible User: ${message.author.tag}`
        })
        .catch(async (error) => {
          const embed = await client.embeds.errorInfo(command.option.role, message, error);
          editMsg.edit({ embeds: [embed] });
        })

        const embed = client.embeds.success(command.option.role,`Created the <@&${role.id}> role.`);
        editMsg.edit({ embeds: [embed] });
        break;
      }
      case "v":
      case "vc":
      case "voice":
      {
        if (!thirdArg) {
          const embed = await client.embeds.noArgs(command.option.voice, message.guild);
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

        const pendingEmbed = client.embeds.pending(command.option.voice, responses.pendingVoice);
        const editMsg = await message.reply({ embeds: [pendingEmbed] });

        const chan = await message.guild.channels.create(name, { type: "GUILD_VOICE", reason: `Created the "${name}" voice channel. Responsible User: ${message.author.tag}` })
        .catch(async (error) => {
          const embed = await client.embeds.errorInfo(command.option.voice, message, error);
          editMsg.edit({ embeds: [embed] });
        })

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
    client.functions.sendErrorMsg(error, true, message, command, extra.logId);
  }
}