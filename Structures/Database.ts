// @ts-nocheck
import Enmap from "enmap";
import Discord from "discord.js";

const Database = {
  settings: new Enmap({
    name: "settings",
    fetchAll: false,
    autoFetch: true,
    dataDir: "./Data/",
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
    dataDir: "./Data/",
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
    dataDir: "./Data/"
  }),
  commandLocks: new Enmap({
    name: "commandLocks",
    fetchAll: true,
    autoFetch: true,
    dataDir: "./Data/",
    autoEnsure: {
      locked: false,
      guild: null,
      reason: null
    }
  }),
  channelLocks: new Enmap({
    name: "channelLocks",
    fetchAll: false,
    autoFetch: true,
    dataDir: "./Data/",
    autoEnsure: {
      locked: false,
      locker: null,
      channel: null,
      lockedAt: null
    }
  }),
  channelHides: new Enmap({
    name: "channelHides",
    fetchAll: false,
    autoFetch: true,
    dataDir: "./Data/",
    autoEnsure: {
      hidden: false,
      locker: null,
      channel: null,
      lockedAt: null
    }
  }),
  devSettings: new Enmap({
    name: "devSettings",
    fetchAll: false,
    autoFetch: true,
    dataDir: "./Data/",
  }),
  errors: new Enmap({
    name: "errors",
    fetchAll: false,
    autoFetch: true,
    dataDir: "./Data/"
  }),
  logs: new Enmap({
    name: "logs",
    fetchAll: false,
    autoFetch: true,
    dataDir: "./Data/"
  }),
  userInfo: new Enmap({
    name: "userInfo",
    fetchAll: false,
    autoFetch: true,
    dataDir: "./Data/",
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
    dataDir: "./Data/",
    autoEnsure: {
      blacklist: null,
      deleteCmdWarning: false
    }
  })
}

export default Database;