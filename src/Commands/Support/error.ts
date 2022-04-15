import Discord from "discord.js";
import Types from "../../Typings/types";

export default async function run(client: Types.client, message: Discord.Message, args: string[], command: Types.commandData, settings: Types.guildSettings, tsettings: Types.ticketSettings, extra: Types.extraObject) {
  
  const clientMember = message.guild.me;
  const guildPrefix = client.functions.fetchPrefix(message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = client.functions.getArgs(args);
  const code = `\`\`\``;

  try {
    let error = client.db.errors.get(secArg);

    if (error) {
      if (error.info) {
        const embed = client.embeds.error(command, `No readable information is associated with this error.`);
        return message.reply({ embeds: [embed] });
      }

      const fields = [{
        name: `Error Info`,
        value: `${error.name ? `**Name:** \`${error.name}\`` : ``}${error.message ? `\n**Message:** \`${error.message}\`` : ``}${error.path ? `\n**Path:** \`${error.path}\`` : ``}${error.code ? `\n**Code:** \`${error.code}\`` : ``}${error.method ? `\n**Method:** \`${error.method}\`` : ``}${error.httpStatus ? `\n**HTTP Status:** \`${error.httpStatus}\`\u200e` : ``}`
      }];

      const embed = client.embeds.success(command, `Found an error with the ID: \`${secArg}\`.`, fields);
      message.reply({ embeds: [embed] });
    } else {
      if (secArg == "clear") {
        client.db.errors.clear();
        const embed = client.embeds.success(command, `Cleared all bot errors.`);
        return message.reply({ embeds: [embed] });
      }

      const embed = client.embeds.error(command, `No errors were found matching the associated ID: \`${secArg}\`.`);
      message.reply({ embeds: [embed] });
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, message, command, extra.logId);
  }
}