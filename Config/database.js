const Enmap = require("enmap");

module.exports = {
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
      panelSetup: false
    }
  }),
  first: new Enmap({
    name: "first",
    fetchAll: false,
    autoFetch: true,
    dataDir: "./Data/",
    autoEnsure: {
      deleteCmd: true,
    }
  }),
  tsettings: new Enmap({
    name: "tsettings",
    fetchAll: false,
    autoFetch: true,
    dataDir: "./Data/",
    autoEnsure: {
      dmUsers: false
    }
  }),
  panels: new Enmap({
    name: "panels",
    fetchAll: false,
    autoFetch: true,
    dataDir: "./Data/",
    autoEnsure: {
      count: 0,
      panels: {},
      tickets: {}
    }
  }),
  timeouts: new Enmap({
    name: "timeouts",
    fetchAll: true,
    autoFetch: true,
    dataDir: "./Data/",
    autoEnsure: {
      type: null
    }
  }),
  devlock: new Enmap({
    name: "devlock",
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
  cooldown: new Enmap({
    name: "cooldown",
    fetchAll: false,
    dataDir: "./Data/",
  }),
  devSettings: new Enmap({
    name: "devSettings",
    fetchAll: false,
    autoFetch: true,
    dataDir: "./Data/",
    autoEnsure: {
      devMode: false,
      logsCleared: null,
      allowLog: true
    }
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
    dataDir: "./Data/",
    autoEnsure: {
      timestamp: null,
      content: null,
      type: null
    }
  }),
  userInfo: new Enmap({
    name: "userInfo",
    fetchAll: false,
    autoFetch: true,
    dataDir: "./Data/",
    autoEnsure: {
      warnings: [],
      inPrompt: false
    }
  }),
  blacklists: new Enmap({
    name: "blacklists",
    fetchAll: false,
    autoFetch: true,
    dataDir: "./Data/",
    autoEnsure: {
      blacklisted: false,
      reason: null
    }
  })
}