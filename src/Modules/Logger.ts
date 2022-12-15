import Discord from "discord.js";
import client from "../index";
import Types from "../types";

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
    const logData = {} as Types.logData;
    const logs = client.db.logs.get("logs");

    if (user) {
      let userId: string;
      if (user instanceof Discord.User) userId = user.id;
      else userId = user;
      
      const canLog = client.db.devSettings.get("devLogsEnabled");
      if (userId == client.config.devId) if (canLog === false) return;
      logData.user = userId;
    }

    logData.timestamp = Date.now();
    logData.content = content;
    logData.type = type || "log";
    logData.details = [];

    logs.push(logData);
    client.db.logs.set("logs", logs);
    return logs.length;
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
  updateLog(content: string, id: number): string[] {
    if (!id) return;
    id = id - 1;

    const logs: Types.logData[] = client.db.logs.get("logs");
    const log = logs[id];

    log.details.push(content);
    logs.splice(id, 1);

    delete logs[id];
    logs.splice(id, 1, log);
    client.db.logs.set("logs", logs);
    return log.details;
  }

  /**
   * Clears all logs from the database.
   * @function clear
   * @returns {boolean} Whether the operation succeeded or not.
   */
  clear(): boolean {
    client.db.logs.set("logs", []);
    client.db.devSettings.set(client.config.devId, Date.now(), "logsCleared");
    return true;
  }
}