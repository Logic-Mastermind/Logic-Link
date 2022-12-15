import Discord from "discord.js";
import Types from "../../types";

export default async function run(client: Types.client, message: Discord.Message, args: string[], command: Types.commandData, settings: Types.guildSettings, tsettings: Types.ticketSettings, extra: Types.extraObject) {
  
  const clientMember = message.guild.me;
  const guildPrefix = client.functions.fetchPrefix(message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = client.functions.getArgs(args);
  const code = `\`\`\``;
  const responses = {};

  try {
    let member = message.mentions.members.first();
    if (!member && secArg) member = client.functions.findMember(args.join(" "), message.guild);
    if (!secArg && !member) member = message.member;

    if (member) {
      const roles = Array.from(member.roles.cache.filter(r => r.id !== member.guild.roles.everyone.id).sort((a, b) => b.position - a.position).keys());
      const info = {
        roles: roles[0] ? `<@&${roles.join("> <@&")}>` : `No Roles Found`,
        createdAt: `<t:${Math.floor(Date.parse(member.user.createdAt.toString()) / 1000)}:D>`,
        joinedAt: `<t:${Math.floor(Date.parse(member.joinedAt.toString()) / 1000)}:D>`,
        permissions: client.functions.getPermissions(member).join(", "),
        badges: client.functions.getBadges(member.user).join(" "),
        profile: member.user.displayAvatarURL({ dynamic: false, size: 512 }),
        id: member.user.id,
        roleCount: roles.length,
        owner: member.id == message.guild.ownerId
      }
      
      const embed = client.embeds.itemInfo(command, "user", info);
      message.reply({ embeds: [embed]});
    } else {
      const embed = client.embeds.invalidItem(command, ["member"], [args.join(" ")]);
      message.reply({ embeds: [embed] });
    }
  } catch (error) {
    client.functions.sendErrorMsg(error, message, command, extra.logId);
  }
}