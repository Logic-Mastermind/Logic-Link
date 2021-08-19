const firstTime = client.firstTime.get(message.member.id, "delete")
if (firstTime) {
  const firstTimeEmbed = new Discord.MessageEmbed()
  .setTitle("DELETE")
  .setColor("ORANGE")
  .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
  .setDescription(`**Warning**\nFrom now on, this command will delete roles and channels without warning, by clicking the confirm button below, you accept the conditions stated above.`)
  .setTimestamp();

  const confirmButton = new buttons.MessageButton()
  .setStyle("green")
  .setLabel("Confirm")
  .setID("Delete_Cmd_Confirmation");

  const cancelButton = new buttons.MessageButton()
  .setStyle("red")
  .setLabel("Cancel")
  .setID("Delete_Cmd_Cancel");

  const msg = await message.channel.send(``, { embed: firstTimeEmbed, buttons: [confirmButton, cancelButton] });
  const filter = (a) => true;
  const btnCollector = msg.createButtonCollector(filter, { time: 60000 })

  btnCollector.on("collect", async (button) => {
    const failedEmbed = new Discord.MessageEmbed()
    .setTitle("Insufficient Permissions")
    .setColor("RED")
    .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
    .setDescription("**Error**\nYou do not have permission to carry out this process.\nPermissions needed: ```MANAGE_ROLES```")
    .setTimestamp();

    const buttonClicker = await button.clicker;
    console.log(buttonClicker.id)
    if (buttonClicker.id !== message.author.id) {
      button.reply.send(``, { embed: failedEmbed, ephemeral: true })
    }

    if (button.id == "Delete_Cmd_Confirmation") {
      const confirmEmbed = new Discord.MessageEmbed()
      .setTitle("DELETE - AGREEMENT")
      .setColor("GREEN")
      .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
      .setDescription("**Success**\nDeleting role...")
      .setTimestamp();

      const aMsg = await button.reply.send(``, { embed: confirmEmbed })
      msg.delete()
      deleteRole()
      aMsg.delete()
    } else if (button.id == "Delete_Cmd_Cancel") {
      const cancelEmbed = new Discord.MessageEmbed()
      .setTitle("DELETE - AGREEMENT")
      .setColor("ORANGE")
      .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
      .setDescription("**Success**\nCancelled the agreement.")
      .setTimestamp();

      button.reply.send(``, { embed: cancelEmbed })
      msg.delete()
    }
  })
}