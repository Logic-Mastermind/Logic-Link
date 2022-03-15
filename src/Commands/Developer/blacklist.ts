import Discord from "discord.js";
import Types from "../../Typings/types";

export default async function run(client: Types.client, message: Discord.Message, args: string[], command: Types.commandData, settings: Types.guildSettings, tsettings: Types.ticketSettings, extra: Types.extraObject) {
  
  const clientMember = message.guild.me;
  const guildPrefix = client.functions.fetchPrefix(message.guild);
  
  const noArgs = client.functions.getNoArgs(command, message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = client.functions.getArgs(args);
  const code = `\`\`\``;
  const responses = {};

  try {
    if (secArg == "view") {
      const blacklists = Array.from(client.db.userGlobal.fetchEverything().filter((u) => u.blacklist).keys()) as string[];
      const tags = [];

      if (blacklists.length == 0) {
        const embed = client.embeds.error(command.option.view, "No users are currently blacklisted.");
        return message.reply({ embeds: [embed] });
      }

      for (const id of blacklists) {
        const user = await client.functions.findUser(id);
        if (user) tags.push(user.tag);
      }

      const embed = client.embeds.blue(command.option.view, `\`${blacklists.length}\` user${blacklists.length == 1 ? ` is` : `s are`} currently blacklisted.\n\n**Users**\n${tags.join("\n")}`);
      return message.reply({ embeds: [embed] });
    }

    let user = message.mentions.users.first();
    let reason = client.util.messages.reason;

    if (!user) user = await client.functions.findUser(secArg);
    if (thirdArg) reason = args.slice(1).join(" ");

    if (user) {
      const blacklistInfo = client.db.userGlobal.get(user.id, "blacklist");

      if (blacklistInfo) {
        const embed = client.embeds.warn(command, `This user has already been blacklisted.`, [{
          name: "Data",
          value: `**User:** ${user.tag}\n**Reason:** ${blacklistInfo.reason}`
        }]);
        return message.reply({ embeds: [embed] });
      }

      client.db.userGlobal.set(user.id, { reason }, "blacklist");
      
      const embed = client.embeds.success(command, `Blacklisted \`${user.tag}\` from Logic Link.`, [{
        name: "Reason",
        value: reason,
      }]);
      message.reply({ embeds: [embed] });
      
    } else {
      const embed = client.embeds.invalidItem(command, ["user"], [secArg]);
      message.reply({ embeds: [embed] });
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, message, command, extra.logId);
  }
}