if (current == 1) {
  async function next() {
    const newMsg = await msg.channel.send(welcomeRoleEmbed)
    var role = msg.mentions.roles.first();
    if (!role) role = msg.guild.roles.cache.get(msg.content);

    if (msg.content.toLowerCase() == "cancel") {
      const cancelledEmbed = new Discord.MessageEmbed()
      .setTitle("SETTING - WELCOME")
      .setColor("ORANGE")
      .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
      .setDescription(`**Welcome Prompt**\nPrompt cancelled.`)
      .setTimestamp();

      msg.channel.send(cancelledEmbed)
      return collector.stop()
    }

    if (role) {
      const welcomeRoleFinishedSuccessEmbed = new Discord.MessageEmbed()
      .setTitle("SETTING - WELCOME")
      .setColor("GREEN")
      .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
      .setDescription(`**Welcome Role**\n<@${role.id}> was found in the server.`)
      .setTimestamp();

      newMsg.edit(``, { embed: welcomeRoleFinishedSuccessEmbed });
    } else {
      const welcomeRoleFinishedFailedEmbed = new Discord.MessageEmbed()
      .setTitle("SETTING - WELCOME")
      .setColor("RED")
      .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
      .setDescription(`**Welcome Role**\nFailed to find that role in the server.`)
      .setTimestamp();

      newMsg.edit(``, { embed: welcomeRoleFinishedFailedEmbed })
    }
  }

  var channel = msg.mentions.channels.first()
  if (!channel) channel = msg.guild.channels.cache.get(msg.content);

  if (msg.content.toLowerCase() == "cancel") {
    const cancelledEmbed = new Discord.MessageEmbed()
    .setTitle("SETTING - WELCOME")
    .setColor("ORANGE")
    .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
    .setDescription(`**Welcome Prompt**\nPrompt cancelled.`)
    .setTimestamp();

    msg.channel.send(cancelledEmbed)
    return collector.stop()
  }

  if (msg.content.toLowerCase() == "skip") {
    const skippedEmbed = new Discord.MessageEmbed()
    .setTitle("SETTING - WELCOME")
    .setColor("ORANGE")
    .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
    .setDescription(`**Welcome Channel**\nQuestion skipped.`)
    .setTimestamp();

    button.reply.edit(``, { embed: skippedEmbed })
    return next()
  }

  if (channel) {
    const welcomeChannelFinishedSuccessEmbed = new Discord.MessageEmbed()
    .setTitle("SETTING - WELCOME")
    .setColor("GREEN")
    .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
    .setDescription(`**Welcome Channel**\n<#${channel.id}> was found in the server.`)
    .setTimestamp();

    button.reply.edit(``, { embed: welcomeChannelFinishedSuccessEmbed });
  } else {
    const welcomeChannelFinishedFailedEmbed = new Discord.MessageEmbed()
    .setTitle("SETTING - WELCOME")
    .setColor("RED")
    .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
    .setDescription(`**Welcome Channel**\nFailed to find that channel in the server.`)
    .setTimestamp();

    button.reply.edit(``, { embed: welcomeChannelFinishedFailedEmbed })
  }

  current = 2;
  next()
} else if (current == 2) {
  var role = msg.mentions.roles.first();
  if (!role) role = msg.guild.roles.cache.get(msg.content);

  if (role) {
    const welcomeRoleFinishedSuccessEmbed = new Discord.MessageEmbed()
    .setTitle("SETTING - WELCOME")
    .setColor("GREEN")
    .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
    .setDescription(`**Welcome Role**\n<@${role.id}> was found in the server.`)
    .setTimestamp();

    button.reply.edit(``, { embed: welcomeRoleFinishedSuccessEmbed });
  } else {
    const welcomeRoleFinishedFailedEmbed = new Discord.MessageEmbed()
    .setTitle("SETTING - WELCOME")
    .setColor("RED")
    .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
    .setDescription(`**Welcome Role**\nFailed to find that role in the server.`)
    .setTimestamp();

    button.reply.edit(``, { embed: welcomeRoleFinishedFailedEmbed })
  }
}