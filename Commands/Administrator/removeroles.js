const Discord = require("discord.js");
const Buttons = require("discord-buttons");
const Fetch = require("node-fetch");

exports.run = async (client, message, args, command, settings, tsettings, extra) => {
  const clientMember = message.guild.me;
  const guildPrefix = await client.functions.fetchPrefix(message.guild);
  
  const noArgs = await client.functions.getNoArgs(command, message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = await client.functions.getArgs(args);
  const code = `\`\`\``;

  const responses = {
    pending: `Removing roles from the user...`
  }

  try {
    var member = message.mentions.members.first();
    var mentionedRoles = message.mentions.roles.map(r => r.id)
    var roles = args.slice(1);

    roles.unshift(...mentionedRoles);
    roles = roles.filter((v) => (!v.startsWith("<@&") || !v.startsWith("<@!")) && !v.endsWith(">"))
    roles = [...new Set(roles)];

    if (!member) member = await client.functions.findMember(secArg, message.guild);
    if (secArg.toLowerCase() == "me") member = message.member;

    if (member && roles[0]) {
      var total = 0;
      const results = new Object();
      const pendingEmbed = client.embeds.pending(command, responses.pending);
      const editMsg = await message.lineReply(pendingEmbed)
      
      roles.forEach(async (value, key, array) => {
        var role = message.guild.roles.cache.find(r => r.name.toLowerCase() == value.toLowerCase());
        var foundR = false;
        
        if (!role) role = await client.functions.findRole(value, message.guild)

        if (role) {
          if (member.roles.cache.has(role.id)) {
            member.roles.remove(role)
            .then((r) => {
              results[role.id] = true;
              total = total + 1
            })
            .catch((error) => {
              results[role.id] = error.message ? `${error.message.endsWith(".") ? `` : `${error.message}.`}` : false;
            })
          } else {
            results[role.id] = "Member does not have this role."
          }
        } else {
          results[value] = "Role does not exist.";
        }

        if (key == (roles.length - 1)) {
          setTimeout(function() {
            const successful = [];
            const unsuccessful = [];
            
            for (const [key, value] of Object.entries(results)) {
              if (value == true) {
                successful.push(`<@&${key}>`);
              } else if (value == "Role does not exist.") {
                unsuccessful.push(`\`${key}\` - Not a role.`);
              } else {
                unsuccessful.push(`<@&${key}> - ${value}`)
              }
            }

            const resultsDescription = `${total == 0 ? `No roles were removed from <@${member.id}>.` : `Removed \`${total}\` role${total > 1 ? `s` : ``} from <@${member.id}>.`}\n\n**Successful**\n${successful[0] ? `${successful.join("\n")}` : `No roles were removed successfully.`}\n\n**Unsuccessful**\n${unsuccessful[0] ? `${unsuccessful.join("\n")}` : `All roles were removed successfully.`}`

            const resultsEmbed = total == 0 ? client.embeds.error(command, resultsDescription) : client.embeds.success(command, resultsDescription);
            editMsg.edit(resultsEmbed)
          }, 500)
        }
      })
    } else {
      if ((!member) && (!roles[0])) {
        const embed = client.embeds.error(command, `No members or roles were recorded from your message.`);
        message.lineReply(embed)

      } else if ((!roles[0]) && (member)) {
        const embed = client.embeds.error(command, `No roles were recorded from your message.`);
        message.lineReply(embed);
      }
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, true, message, command, extra.logId);
  }
}