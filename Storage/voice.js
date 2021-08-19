const Discord = require("discord.js")
const prefixManager = require("discord-prefix")

exports.run = async (client, message, args) =>  {
  var guildPrefix = prefixManager.getPrefix(message.guild.id)
  if (!guildPrefix || guildPrefix == null) {
    guildPrefix = client.defaultPrefix;
  }

  const secArg = args[0];
  const thirdArg = args[1];
  const fourthArg = args[2];
  const fifthArg = args[3];

  const commands = require("../config/commands.js");
  const guildConf = client.settings.get(message.guild.id);
  const clientMember = message.guild.member(client.user);
  const ending = `\`\`\``;
  var voiceConnection;

  const adminRoleConfig = guildConf["adminRole"];
  const modRoleConfig = guildConf["modRole"];
  const modLogChannelConfig = guildConf["modLogChannel"];
  const welcomeChannelConfig = guildConf["welcomeChannel"];
  const welcomeRoleConfig = guildConf["welcomeRole"];
  const welcomeSystemConfig = guildConf["welcomeSystem"];

  const adminRoleObject = message.guild.roles.cache.get(adminRoleConfig);
  const modRoleObject = message.guild.roles.cache.get(modRoleConfig);
  const modLogChannelObject = message.guild.channels.cache.get(modLogChannelConfig);
  const welcomeChannelObject = message.guild.channels.cache.get(welcomeChannelConfig);
  const welcomeRoleObject = message.guild.roles.cache.get(welcomeRoleConfig);
  const voice = commands.general.voice;
  
  if (!args || args.length < 1) {
    const voiceEmbed = new Discord.MessageEmbed()
    .setTitle("VOICE")
    .setColor("GREEN")
    .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
    .setDescription(`**Command Info**\n${voice.description}\n\n**Usage**\n\`\`\`${guildPrefix}${voice.usage}\`\`\`\n**Modules**\n\`\`\`diff\n+ CONNECT\n${guildPrefix}voice connect\n\n+ DISCONNECT\n${guildPrefix}voice disconnect\`\`\``)
    .setTimestamp();
      
    message.channel.send(voiceEmbed)
  } else if (args.toString().startsWith("connect")) {
    if (message.member.voice.channel) {
      let guild = message.guild;
      if (!guild.me.voice.channel) {
        const joinedVc = message.member.voice.channel;
        message.member.voice.channel.join(joinedVc)
        .then(connection => {
          voiceConnection = connection;
        })
        .catch((error) => {
          const errorEmbed = new Discord.MessageEmbed()
          .setTitle("VOICE - CONNECT")
          .setColor("RED")
          .setFooter(`Requested by ${message.member ? 
      message.member.displayName : message.author.username}`, 
      message.author.displayAvatarURL())
          .setDescription(`**Error**\nFailed to connect to the channel.\n\`${error}\``)
          .setTimestamp();
          message.channel.send(errorEmbed)
          return;
        })
        const joinedEmbed = new Discord.MessageEmbed()
        .setTitle("VOICE - CONNECT")
        .setColor("GREEN")
        .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
        .setDescription(`**Success**\nSuccessfully connected to \`${joinedVc.name}\`.`)
        .setTimestamp();

          message.channel.send(joinedEmbed)
      } else {
        const inVcEmbed = new Discord.MessageEmbed()
        .setTitle("VOICE - CONNECT")
        .setColor("RED")
        .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
        .setDescription("**Error**\nI am already in a voice channel.")
        .setTimestamp();

        message.channel.send(inVcEmbed)
      }
    } else {
      const noVcEmbed = new Discord.MessageEmbed()
      .setTitle("VOICE - CONNECT")
      .setColor("RED")
      .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
      .setDescription("**Error**\nYou are not in a voice channel.")
      .setTimestamp();

        message.channel.send(noVcEmbed)
    }
  } else if (args.toString().startsWith("disconnect")) {
    if (message.member.voice.channel) {
      let guild = message.guild;
      const currentChannel = guild.me.voice.channel;
      if ((!currentChannel) || (currentChannel == null)) {
        const noChannelEmbed = new Discord.MessageEmbed()
        .setTitle("VOICE - DISCONNECT")
        .setColor("RED")
        .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
        .setDescription("**Error**\nI am not connected to a voice channel.")
        .setTimestamp();

        message.channel.send(noChannelEmbed);
        return;
      }
      if (message.guild.voice.connection) {
        message.guild.voice.connection.disconnect();
      }
      const disconnectEmbed = new Discord.MessageEmbed()
      .setTitle("VOICE - DISCONNECT")
      .setColor("ORANGE")
      .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
      .setDescription(`**Success**\nSuccessfully disconnected from \`${currentChannel.name}\`.`)
      .setTimestamp();

      message.channel.send(disconnectEmbed)
    } else {
      const noVcEmbed = new Discord.MessageEmbed()
      .setTitle("VOICE - DISCONNECT")
      .setColor("RED")
      .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
      .setDescription("**Error**\nYou are not in a voice channel.")
      .setTimestamp();

      message.channel.send(noVcEmbed)
    }
  } else if (args.toString().startsWith("rickroll")) {
      if (message.member.user.id === "611624247240032256") {
        const currentChannel = message.guild.me.voice.channel;
        const noVcEmbed = new Discord.MessageEmbed()
        .setTitle("VOICE - RICKROLL")
        .setColor("RED")
        .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
        .setDescription("**Error**\nI am not in a voice channel.")
        .setTimestamp();

        if (!currentChannel) return message.channel.send(noVcEmbed)
        const channel = currentChannel.guild.me.voice.connection;
        if (channel) {
          const rickRollEmbed = new Discord.MessageEmbed()
          .setTitle("VOICE - RICKROLL")
          .setColor("GREEN")
          .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
          .setDescription(`**Success**\nRickrolling the noobs in ${currentChannel.name}.`)
          .setTimestamp();
          
          channel.play("https://cdn.discordapp.com/attachments/710512748454215710/839266538062217216/Rick-Astley-Never-Gonna-Give-You-Up-_Video.mp3")
          message.channel.send(rickRollEmbed)
        } else {
          const noChannelEmbed = new Discord.MessageEmbed()
          .setTitle("VOICE - PLAY")
          .setColor("RED")
          .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
          .setDescription("**Error**\nCould not find a channel to play that audio.")
          .setTimestamp();

          message.channel.send(noChannelEmbed)
        }
      }
  } else if (args.toString().startsWith("stop")) {
      const currentChannel = message.guild.me.voice.channel;
      const channel = currentChannel.guild.me.voice.connection;

      if (voiceConnection) {
        voiceConnection.pause()
        const stopEmbed = new Discord.MessageEmbed()
        .setTitle("VOICE - STOP")
        .setColor("GREEN")
        .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
        .setDescription("**Success**\nStopped the current audio track.")
        .setTimestamp();

        message.channel.send(stopEmbed)
      } else {
        const stopEmbed = new Discord.MessageEmbed()
        .setTitle("VOICE - STOP")
        .setColor("GREEN")
        .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
        .setDescription("**Error**\nThere is no audio currectly being played.")
        .setTimestamp();
      }
  } else if (args.toString().startsWith("resume")) {
    console.log("ok")
  }
}