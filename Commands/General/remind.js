const Discord = require("discord.js");
const Fetch = require("node-fetch");

exports.run = async (client, message, args, command, settings, tsettings, extra) => {
  const clientMember = message.guild.me;
  const guildPrefix = await client.functions.fetchPrefix(message.guild);
  
  const noArgs = await client.functions.getNoArgs(command, message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = await client.functions.getArgs(args);
  const code = `\`\`\``;
  const responses = {};

  try {
    var time = await client.functions.getTime(secArg);
    var task = args.slice(1).join(" ");
    var now = Math.round(Date.now() / 1000);

    if (!time.passed) {
      const embed = client.embeds.notValid(command, secArg, "time unit");
      return message.reply({ embeds: [embed] });
    }

    if (!task) {
      const embed = client.embeds.noArgsObj(noArgs);
      return message.reply({ embeds: [embed] });
    }

    const embed = client.embeds.success(command, `In \`${time.display}\`, I will direct message you this reminder.`, [{
      name: "Reminder",
      value: task,
      inline: false
    }]);
    message.reply({ embeds: [embed] });

    var reminders = client.db.timeouts.get(`${message.author.id}[reminders]`, "reminders");
    if (!reminders) reminders = new Map();

    reminders.set(reminders.size + 1, { task: task, duration: time.duration });
    client.db.timeouts.set(`${message.author.id}[reminders]`, reminders, "reminders");

    setTimeout(async () => {
      const embed = client.embeds.warn(command, `Your reminder from <t:${now}:R> has just went off.`, [{
        name: "Reminder",
        value: task
      }]);
      message.author.send({ embeds: [embed] });
    }, time.duration);

  } catch (error) {
    client.functions.sendErrorMsg(error, message, command, extra.logId);
  }
}