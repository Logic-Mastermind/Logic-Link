import YouTube from "ytdl-core-discord";
import getVideoId from "get-video-id";
import Voice from "@discordjs/voice";
import YTSearch from "yt-search";

import Discord from "discord.js";
import Types from "../../Typings/types";

export function run() {
  const clientMember = message.guild.me;
  const guildPrefix = client.functions.fetchPrefix(message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = client.functions.getArgs(args);
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
          return message.reply({ embeds: [embed] });
        }

        if (clientMember.voice.channel) {
          const embed = client.embeds.error(command.option.connect, `I am already in a voice channel.`);
          return message.reply({ embeds: [embed] });
        }

        const connection = Voice.joinVoiceChannel({
          channelId: message.member.voice.channelId,
          guildId: message.guildId,

          //@ts-ignore
          adapterCreator: message.guild.voiceAdapterCreator
        })
        const embed = client.embeds.success(command.option.connect, `Joined the <#${ok}> channel.`);
        message.reply({ embeds: [embed] });

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
          return message.reply({ embeds: [embed] });
        }

        if (message.member.voice.channel) {
          if (message.member.voice.channel.id !== clientMember.voice.channel.id) {
            const embed = client.embeds.error(command.option.disconnect, `You must be in the voice channel.`);
            return message.reply({ embeds: [embed] });
          }
        } else {
          const embed = client.embeds.error(command.option.disconnect, `You must be in the voice channel.`);
          return message.reply({ embeds: [embed] });
        }

        await message.member.voice.channel.leave();
        const embed = client.embeds.success(command.option.disconnect, `Left the <#${message.member.voice.channel.id}> channel.`);
        message.reply({ embeds: [embed] });

        break;
      }
      case "p":
      case "play":
      {
        if (!thirdArg) {
          const embed = await client.embeds.noArgs(command.option.play, message.guild);
          return message.reply({ embeds: [embed] });
        }

        let filter = args.slice(1).join(" ");
        let connection = clientMember.voice.connection;

        if (!connection) {
          if (message.member.voice.channel) {
            connection = await message.member.voice.channel.join();
          } else {
            const embed = client.embeds.error(command.option.play, `You must be in a voice channel.`);
            return message.reply({ embeds: [embed] });
          }
        }

        const pendingEmbed = client.embeds.pending(command.option.play, `Fetching youtube videos...`);
        const editMsg = await message.reply({ embeds: [pendingEmbed] });

        if (connection && filter) {
          const results = await YTSearch(filter);
          const filtered = await results.all.filter(e => e.type == "video");
          const video = filtered[0];

          if (!video) {
            const embed = client.embeds.error(command.option.play, `No YouTube videos could be fetched from the query: \`${filter}\`.`);
            return editMsg.edit({ embeds: [embed] })
          }

          try {
            const videoStream = await YouTube(video.videoId);
            await connection.play(videoStream, { type: "opus" })
            await clientMember.voice.setSelfDeaf(true);

            const embed = client.embeds.success(command.option.play, `Playing \`${video.title}\` from [YouTube](${video.url}).`);
            editMsg.edit({ embeds: [embed] });

          } catch (error) {
            const embed = client.embeds.errorInfo(command.option.play, message, error);
            editMsg.edit({ embeds: [embed] });
          }
        }

        break;
      }
      case "ps":
      case "pause":
      {
        if (!message.member.voice.channel) {
          const embed = client.embeds.error(command.option.pause, `You must be in a voice channel.`);
          return message.reply({ embeds: [embed] });
        }

        let connection = clientMember.voice.connection;
        if (!connection) {
          const embed = client.embeds.error(command.option.pause, `I am not in a voice channel.`);
          return message.reply({ embeds: [embed] });
        }

        let dispatcher = connection.dispatcher;
        if (!dispatcher) {
          const embed = client.embeds.error(command.option.pause, `Nothing is currently being played.`);
          return message.reply({ embeds: [embed] });
        }

        try {
          await dispatcher.pause();

          const embed = client.embeds.success(command.option.pause, `Paused the currently playing audio.`);
          message.reply({ embeds: [embed] });
          
        } catch (error) {
          const embed = client.embeds.errorInfo(command.option.pause, message, error);
          message.reply(embed);
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
    client.functions.sendErrorMsg(error, message, command, extra.logId);
  }
}