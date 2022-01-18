import Discord from "discord.js";
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
   * @returns {number|Error} The ID of the log that was created.
   */
  log(content: string, user?: Discord.User | string): number | Error {
    try {
      const count = client.db.logs.count;
      const logId = (count + 1).toString();

      if (user) {
        const canLog = client.db.devSettings.get(client.util.devId, "allowLog");
        if (!canLog && (userId === client.util.devId)) return;

        var userId = user;
        if (user instanceof Discord.User) userId = user.id;
        client.db.logs.set(logId, userId, "user");
      }

      client.db.logs.set(logId, Date.now(), "timestamp");
      client.db.logs.set(logId, content, "content");
      client.db.logs.set(logId, "Log", "type");
      client.db.logs.set(logId, [], "details");

      return Number(logId);
    } catch (error) {
      client.functions.sendError(error);
      return error;
    }
  }

  /**
   * Saves a log warning to the database.
   * @function warn
   * @param {string} content - The content of the log.
   * @param {Discord.User|string} [user] - The user who emitted this log.
   * @returns {number|Error} The ID of the log that was created.
   */
   warn(content: string, user?: Discord.User | string): number | Error {
    try {
      const count = client.db.logs.count;
      const logId = (count + 1).toString();

      if (user) {
        const canLog = client.db.devSettings.get(client.util.devId, "allowLog");
        if (!canLog && (userId === client.util.devId)) return;

        var userId = user;
        if (user instanceof Discord.User) userId = user.id;
        client.db.logs.set(logId, userId, "user");
      }

      client.db.logs.set(logId, Date.now(), "timestamp");
      client.db.logs.set(logId, content, "content");
      client.db.logs.set(logId, "Warn", "type");
      client.db.logs.set(logId, [], "details");

      return Number(logId);
    } catch (error) {
      client.functions.sendError(error);
      return error;
    }
  }

  /**
   * Saves a log error to the database.
   * @function error
   * @param {string} content - The content of the log.
   * @param {Discord.User|string} [user] - The user who emitted this log.
   * @returns {number|Error} The ID of the log that was created.
   */
   error(content: string, user?: Discord.User | string): number | Error {
    try {
      const count = client.db.logs.count;
      const logId = (count + 1).toString();

      if (user) {
        const canLog = client.db.devSettings.get(client.util.devId, "allowLog");
        if (!canLog && (userId === client.util.devId)) return;

        var userId = user;
        if (user instanceof Discord.User) userId = user.id;
        client.db.logs.set(logId, userId, "user");
      }

      client.db.logs.set(logId, Date.now(), "timestamp");
      client.db.logs.set(logId, content, "content");
      client.db.logs.set(logId, "Error", "type");
      client.db.logs.set(logId, [], "details");

      return Number(logId);
    } catch (error) {
      client.functions.sendError(error);
      return error;
    }
  }

  /**
   * Updates a log with further details.
   * @function updateLog
   * @param {string} content - The content of the update.
   * @param {string|number} id - The ID of the log to update.
   * @returns {string[]|Error} All of the updates to the log.
   */
  updateLog(content: string, id: string | number): string[] | Error {
    try {
      if (typeof id === "number") id.toString();
      const data = client.db.logs.get(id);

      data.details.push(content);
      client.db.logs.set(id, data.details, "details");      
      return data.details;

    } catch (error) {
      client.functions.sendError(error);
      return error;
    }
  }

  /**
   * Clears all logs from the database.
   * @function clear
   * @returns {boolean} Whether the operation succeeded or not.
   */
  clear(): boolean {
    try {
      client.db.logs.clear();
      client.db.devSettings.set(client.util.devId, Date.now(), "logsCleared");
      return true;

    } catch (error) {
      client.functions.sendError(error);
      return false;
    }
  }
}