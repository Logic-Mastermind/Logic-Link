import Discord from "discord.js";

const DiscordFunctions = {
  /**
   * A function that takes an input 'msg' and splits it every 1990 characters.
   * @function splitMessage
   * @param {string} msg - The string to be split.
   * @returns {Array} An array of the split messages
   */
  splitMessage: (msg: string): RegExpMatchArray => {
    return msg.match(/[\s\S]{1,1990}/g);
  },

  /**
   * Bulk deletes messages in a channel while ignoring pinned messages.
   * @function bulkDeleteMessages
   * @param {extends import("discord.js").BaseGuildTextChannel} channel - The channel to bulk delete messages in.
   * @param {number} num - The number of messages to purge.
   * @returns {Promise} A promise containing a collection of messages that were deleted.
   */
  bulkDeleteMessages: async (channel, num): Promise<Discord.Collection<string, Discord.Message>> => {
    const msgs = await channel.messages.fetch({ limit: num });
    for await (const [id, msg] of msgs.entries()) {
      if (msg.pinned) msgs.delete(id);
    }

    return await channel.bulkDelete(msgs, true);
  }
}

export default DiscordFunctions;