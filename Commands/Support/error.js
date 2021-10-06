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
    var error = await client.db.errors.get(secArg);

    if (error) {
      if (error.info) {
        const embed = client.embeds.error(command, `No readable information is associated with this error.`);
        return message.reply({ embeds: [embed] });
      }

      const fields = [{
        name: `Error Info`,
        value: `${error.name ? `**Name:** \`${error.name}\`` : ``}${error.message ? `\n**Message:** \`${error.message}\`` : ``}${error.path ? `\n**Path:** \`${error.path}\`` : ``}${error.code ? `\n**Code:** \`${error.code}\`` : ``}${error.method ? `\n**Method:** \`${error.method}\`` : ``}${error.httpStatus ? `\n**HTTP Status:** \`${error.httpStatus}\`‎` : ``}`
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