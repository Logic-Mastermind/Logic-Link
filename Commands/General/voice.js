const Discord = require("discord.js");
const Buttons = require("discord-buttons");
const YouTube = require("ytdl-core-discord");
const YTSearch = require("yt-search");
const Fetch = require("node-fetch");

exports.run = async (client, message, args, command, settings, tsettings, extra) => {
  const clientMember = message.guild.me;
  const guildPrefix = await client.functions.fetchPrefix(message.guild);
  
  const noArgs = await client.functions.getNoArgs(command, message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = await client.functions.getArgs(args);
  const code = `\`\`\``;
  const responses = {};

  try {
    switch (secArg.toLowerCase()) {
      case "c":
      case "j":
      case "join":
      case "con":
      case "connect":
      {
        if (!message.member.voice.channel) {
          const embed = client.embeds.error(command.option.connect, `You must be in a voice channel.`);
          return message.lineReply(embed);
        }

        if (clientMember.voice.channel) {
          const embed = client.embeds.error(command.option.connect, `I am already in a voice channel.`);
          return message.lineReply(embed);
        }

        const connection = await message.member.voice.channel.join();
        const successEmbed = client.embeds.success(command.option.connect, `Joined the <#${connection.channel.id}> channel.`);
        message.lineReply(successEmbed);

        break;
      }
      case "d":
      case "l":
      case "leave":
      case "disc":
      case "dc":
      case "disconnect":
      {
        if (!clientMember.voice.channel) {
          const embed = client.embeds.error(command.option.disconnect, `I am not in a voice channel.`);
          return message.lineReply(embed);
        }

        if (message.member.voice.channel) {
          if (message.member.voice.channel.id !== clientMember.voice.channel.id) {
            const embed = client.embeds.error(command.option.disconnect, `You must be in the voice channel.`);
            return message.lineReply(embed);
          }
        } else {
          const embed = client.embeds.error(command.option.disconnect, `You must be in the voice channel.`);
          return message.lineReply(embed);
        }

        await message.member.voice.channel.leave();
        const successEmbed = client.embeds.success(command.option.disconnect, `Left the <#${message.member.voice.channel.id}> channel.`);
        message.lineReply(successEmbed);

        break;
      }
      case "p":
      case "play":
      {
        if (!thirdArg) {
          const embed = await client.embeds.noArgs(command.option.play, message.guild);
          return message.lineReply(embed);
        }

        var filter = args.slice(1).join(" ");
        var connection = clientMember.voice.connection;

        if (!connection) {
          if (message.member.voice.channel) {
            connection = await message.member.voice.channel.join();
          } else {
            const embed = client.embeds.error(command.option.play, `You must be in a voice channel.`);
            return message.lineReply(embed);
          }
        }

        const pendingEmbed = client.embeds.pending(command.option.play, `Fetching youtube videos...`);
        const editMsg = await message.lineReply(pendingEmbed);

        if (connection && filter) {
          const results = await YTSearch(filter);
          const filtered = results.all.filter(e => e.type == "video");
          const video = filtered[0];

          if (!video) {
            const embed = client.embeds.error(command.option.play, `No YouTube videos could be fetched from the query: \`${filter}\`.`);
            return editMsg.edit(embed)
          }

          try {
            const videoStream = await YouTube(video.videoId);
            await connection.play(videoStream, { type: "opus" })

            const successEmbed = client.embeds.success(command.option.play, `Playing \`${video.title}\` from [YouTube](${video.url}).`);
            editMsg.edit(successEmbed);
          } catch (error) {
            const errorEmbed = client.embeds.errorInfo(command.option.play, message, error);
            editMsg.edit(errorEmbed);
          }
        }

        break;
      }
      case "ps":
      case "pause":
      {
        if (!message.member.voice.channel) {
          const embed = client.embeds.error(command.option.pause, `You must be in a voice channel.`);
          return message.lineReply(embed);
        }

        var connection = clientMember.voice.connection;
        if (!connection) {
          const embed = client.embeds.error(command.option.pause, `I am not in a voice channel.`);
          return message.lineReply(embed);
        }

        var dispatcher = connection.dispatcher;
        if (!dispatcher) {
          const embed = client.embeds.error(command.option.pause, `Nothing is currently being played.`);
          return message.lineReply(embed);
        }

        try {
          await dispatcher.pause();

          const embed = client.embeds.success(command.option.pause, `Paused the currently playing audio.`);
          message.lineReply(embed);
          
        } catch (error) {
          const errorEmbed = client.embeds.errorInfo(command.option.pause, message, error);
          message.lineReply(errorEmbed);
        }

        break;
      }
      case "r":
      case "res":
      case "resume":
      {
        break;
      }
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, true, message, command);
  }
}