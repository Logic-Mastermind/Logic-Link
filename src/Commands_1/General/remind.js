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
    let time = client.functions.getTime(secArg);
    let task = args.slice(1).join(" ");
    let now = Math.round(Date.now() / 1000);

    if (!time.passed) {
      const embed = client.embeds.notValid(command, secArg, "time unit");
      return message.reply({ embeds: [embed] });
    }

    if (!task) {
      const embed = client.embeds.noArgsObj(noArgs);
      return message.reply({ embeds: [embed] });
    }

    if (task.length > 1024) {
      const embed = client.embeds.error(command, `This task is over the limit of 1024 characters.`);
      return message.reply({ embeds: [embed] });
    }

    const end = Date.now() + time.duration;
    const embed = client.embeds.success(command, `In \`${time.display}\` at <t:${Math.round(end / 1000)}:t>, I will direct message you this task.`, [{
      name: "Task",
      value: task,
      inline: false
    }]);
    message.reply({ embeds: [embed] });

    let reminders = client.db.timeouts.get(`${message.author.id}[reminders]`, "reminders");
    if (!reminders) reminders = new Map();

    let key = reminders.size + 1;
    let dbKey = `${message.author.id}[reminders]`;

    reminders.set(key, {
      task: task,
      user: message.author.id,
      date: now,
      end
    });
    
    client.db.timeouts.set(dbKey, reminders, "reminders");
    client.db.timeouts.set(dbKey, "reminders", "type");

    if (time.duration > client.util.timeoutLimit) return;
    setTimeout(async () => {
      const embed = client.embeds.warn("Reminder", `Your reminder from <t:${now}:R> has just went off.`, [{
        name: "Task",
        value: task
      }]);

      message.author.send({ embeds: [embed] });
      reminders.delete(key);
      client.db.timeouts.set(dbKey, reminders, "reminders");
    }, time.duration);

  } catch (error) {
    client.functions.sendErrorMsg(error, message, command, extra.logId);
  }
}