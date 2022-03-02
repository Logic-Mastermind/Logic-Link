import Discord from "discord.js";
import Types from "../Typings/types";
import client from "../index";

/**
 * A class with methods used to save log data to the database.
 * @class Logger
 */
export default class Logger {
  client: Discord.Client;

  /**
   * Used to set the client property if it still exists.
   * @constructor
   * @param {Discord.Client} [client] - The client.
   */
  constructor(client?: Discord.Client) {
    if (client) this.client = client;
  }

  /**
   * Saves a log to the database.
   * @function log
   * @param {string} content - The content of the log.
   * @param {Discord.User|string} [user] - The user who emitted this log.
   * @returns {number} The ID of the log that was created.
   */
  log(content: string, user?: Discord.User | string, type?: "log" | "warn" | "error"): number {
    const count = client.db.logs.count;
    const logId = (count + 1).toString();

    if (user) {
      var userId = user;
      if (user instanceof Discord.User) userId = user.id;
      
      const canLog = client.db.devSettings.get(client.config.devId).allowLog;
      console.log(1)
      if (userId == client.config.devId) if (canLog === false) return new ;
      client.db.logs.set(logId, userId, "user");
    }

    client.db.logs.set(logId, Date.now(), "timestamp");
    client.db.logs.set(logId, content, "content");
    client.db.logs.set(logId, type, "type");
    client.db.logs.set(logId, [], "details");

    return Number(logId);
  }

  /**
   * Saves a log warning to the database.
   * @function warn
   * @param {string} content - The content of the log.
   * @param {Discord.User|string} [user] - The user who emitted this log.
   * @returns {number} The ID of the log that was created.
   */
   warn(content: string, user?: Discord.User | string): number {
    return this.log(content, user, "warn");
  }

  /**
   * Saves a log error to the database.
   * @function error
   * @param {string} content - The content of the log.
   * @param {Discord.User|string} [user] - The user who emitted this log.
   * @returns {number} The ID of the log that was created.
   */
   error(content: string, user?: Discord.User | string): number {
    return this.log(content, user, "error");
  }

  /**
   * Updates a log with further details.
   * @function updateLog
   * @param {string} content - The content of the update.
   * @param {string|number} id - The ID of the log to update.
   * @returns {string[]} All of the updates to the log.
   */
  updateLog(content: string, id: string | number): string[] {
    if (typeof id != "number") return;
    client.db.logs.push(id, content, "details");

    const data = client.db.logs.get(id);
    return data.details;
  }

  /**
   * Clears all logs from the database.
   * @function clear
   * @returns {boolean} Whether the operation succeeded or not.
   */
  clear(): boolean {
    client.db.logs.clear();
    client.db.devSettings.set(client.config.devId, Date.now(), "logsCleared");
    return true;
  }
}