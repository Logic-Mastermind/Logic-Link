// @ts-nocheck
import Enmap from "enmap";
import Discord from "discord.js";

const Database = {
  settings: new Enmap({
    name: "settings",
    fetchAll: false,
    autoFetch: true,
    dataDir: "./src/Data/",
    autoEnsure: {
      prefix: ">",
      modRole: null,
      adminRole: null,
      logChannel: null,
      welcomeChannel: null,
      welcomeRole: null,
      welcomeMsg: null,
      mutedRole: null,
      welcomeSystem: false,
      mutedRoleConfig: false,
      panelSetup: false,
      cases: new Discord.Collection()
    }
  }),
  tickets: new Enmap({
    name: "panels",
    fetchAll: false,
    autoFetch: true,
    dataDir: "./src/Data/",
    autoEnsure: {
      panels: new Discord.Collection(),
      settings: {
        dmUsers: false
      }
    }
  }),
  timeouts: new Enmap({
    name: "timeouts",
    fetchAll: true,
    autoFetch: true,
    dataDir: "./src/Data/"
  }),
  commandLocks: new Enmap({
    name: "commandLocks",
    fetchAll: true,
    autoFetch: true,
    dataDir: "./src/Data/",
    autoEnsure: {
      locked: false,
      guild: null,
      reason: null
    }
  }),
  channelData: new Enmap({
    name: "channelData",
    fetchAll: false,
    autoFetch: true,
    dataDir: "./src/Data/"
  }),
  devSettings: new Enmap({
    name: "devSettings",
    fetchAll: false,
    autoFetch: true,
    dataDir: "./src/Data/",
  }),
  errors: new Enmap({
    name: "errors",
    fetchAll: false,
    autoFetch: true,
    dataDir: "./src/Data/"
  }),
  logs: new Enmap({
    name: "logs",
    fetchAll: false,
    autoFetch: true,
    dataDir: "./src/Data/"
  }),
  devlock: new Enmap({
    name: "devlock",
    fetchAll: false,
    autoFetch: true,
    dataDir: "./src/Data/"
  }),
  userInfo: new Enmap({
    name: "userInfo",
    fetchAll: false,
    autoFetch: true,
    dataDir: "./src/Data",
    autoEnsure: {
      inPrompt: null,
      ticketCooldowns: {},
      ticketButtonCoooldown: null,
    }
  }),
  userGlobal: new Enmap({
    name: "userGlobal",
    fetchAll: false,
    autoFetch: true,
    dataDir: "./src/Data",
    autoEnsure: {
      blacklist: null,
      deleteCmdWarning: false
    }
  })
}

export default Database;