const Discord = require("discord.js");
const Buttons = require("discord-buttons");
const Prefix = require("discord-prefix");

exports.run = async (client, message, args, command, settings, tsettings, extra) => {
  var guildPrefix = Prefix.getPrefix(message.guild.id);
  if (!guildPrefix) guildPrefix = client.util.defaultPrefix;

  const clientMember = message.guild.me;
  const noArgs = await client.functions.getNoArgs(command, message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = await client.functions.getArgs(args);
  const code = `\`\`\``;

  const responses = {

  }

  try {
    var error = await client.db.errors.get(secArg);

    if (error) {
      if (error.info) {
        const embed = client.embeds.error(command, `No readable information is associated with this error.`);
        return message.lineReply(embed);
      }

      const fields = [{
        name: `Error Info`,
        value: `${error.name ? `**Name:** \`${error.name}\`` : ``}${error.message ? `\n**Message:** \`${error.message}\`` : ``}${error.path ? `\n**Path:** \`${error.path}\`` : ``}${error.code ? `\n**Code:** \`${error.code}\`` : ``}${error.method ? `\n**Method:** \`${error.method}\`` : ``}${error.httpStatus ? `\n**HTTP Status:** \`${error.httpStatus}\`‎` : ``}`
      }];

      const embed = client.embeds.fieldSuccess(command, `Found an error with the ID: \`${secArg}\`.`, fields);

      message.lineReply(embed);
    } else {
      const embed = client.embeds.error(command, `No errors were found matching the associated ID: \`${secArg}\`.`);
      message.lineReply(embed);
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, true, message, command);
  }
}