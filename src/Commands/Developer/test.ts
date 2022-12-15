import Discord from "discord.js";
import Types from "../../types";
import { Octokit } from "@octokit/core";
import fetch from "node-fetch";

export default async function run(client: Types.client, message: Discord.Message, args: string[], command: Types.commandData, settings: Types.guildSettings, tsettings: Types.ticketSettings, extra: Types.extraObject) {
  
  const clientMember = message.guild.me;
  const guildPrefix = client.functions.fetchPrefix(message.guild);
  const { secArg, thirdArg, fourthArg, fifthArg } = client.functions.getArgs(args);
  const code = `\`\`\``;
  const responses = {};

  try {
    const octokit = new Octokit()
    const msg = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
      owner: 'Logic-Mastermind',
      repo: 'JavaScript',
      path: 'Math/triangle.js'
    })

    console.log(msg)
  } catch (error) {
    client.functions.sendErrorMsg(error, message, command, extra.logId);
  }
}