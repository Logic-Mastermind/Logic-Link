import Discord from "discord.js";
import Types from "../../types";

export default async function run(client: Types.client, message: Discord.Message, args: string[], command: Types.commandData, settings: Types.guildSettings, tsettings: Types.ticketSettings, extra: Types.extraObject) {
  
  const clientMember = message.guild.me;
  const guildPrefix = client.functions.fetchPrefix(message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = client.functions.getArgs(args);
  const code = `\`\`\``;
  const responses = {};

  try {
    let time = client.functions.getTime(secArg);
    let task = args.slice(1).join(" ");
    let now = Math.round(Date.now() / 1000);

    if (!time.passed) {
      const embed = client.embeds.invalidItem(command, ["time unit"], [secArg]);
      return message.reply({ embeds: [embed] });
    }

    if (task.length > 1024) {
      const embed = client.embeds.error(command, `This task is over the limit of 1024 characters.`);
      return message.reply({ embeds: [embed] });
    }

    const end = Date.now() + time.duration;
    const embed = client.embeds.success(command, `In \`${time.display}\` at <t:${Math.round(end / 1000)}:t>, I will direct message you this message.`, [{ name: "Task", value: task }]);
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