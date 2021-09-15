module.exports = {
  general: {
    avatar: {
      name: "Avatar",
      description: "Fetches the profile avatar of any user.",
      permissions: ["ALL"],
      clientPerms: [],
      cooldown: 2,
      minArgs: 0,
      options: [],
      aliases: ["av"],
      usage: "avatar [user]",
      required: "none",
      category: "General",
      commandName: "avatar"
    },
    botinfo: {
      name: "Bot Info",
      description: "Provides information about Logic Link.",
      permissions: ["ALL"],
      clientPerms: [],
      cooldown: 2,
      minArgs: 0,
      options: [],
      aliases: ["binfo"],
      usage: "botinfo",
      required: "none",
      category: "General",
      commandName: "botinfo"
    },
    help: {
      name: "Help",
      description: "Provides a list of commands.",
      permissions: ["ALL"],
      clientPerms: [],
      cooldown: 2,
      minArgs: 0,
      options: [],
      aliases: ["cmd", "cmds", "commands"],
      usage: "help [command name]",
      required: "none",
      category: "General",
      commandName: "help"
    },
    serverinfo: {
      name: "Server Info",
      description: "Provides info about your server.",
      permissions: ["ALL"],
      clientPerms: [],
      cooldown: 2,
      minArgs: 0,
      options: [],
      aliases: ["sinfo"],
      usage: "serverinfo",
      required: "none",
      category: "General",
      commandName: "serverinfo"
    },
    roleinfo: {
      name: "Role Info",
      description: "Provides info about a specific role.",
      permissions: ["ALL"],
      clientPerms: [],
      cooldown: 2,
      minArgs: 1,
      options: [],
      aliases: ["rinfo"],
      usage: "roleinfo <role>",
      required: "none",
      category: "General",
      commandName: "roleinfo"
    },
    channelinfo: {
      name: "Channel Info",
      description: "Provides info about a specific channel.",
      permissions: ["ALL"],
      clientPerms: [],
      cooldown: 2,
      minArgs: 0,
      options: [],
      aliases: ["cinfo"],
      usage: "channelinfo <channel>",
      required: "none",
      category: "General",
      commandName: "channelinfo"
    },
    invite: {
      name: "Bot Invite",
      description: "Provides the invite link that you can use to add Logic Link to your server.",
      permissions: ["ALL"],
      clientPerms: [],
      cooldown: 1,
      minArgs: 0,
      options: [],
      aliases: ["inv"],
      usage: "invite",
      required: "none",
      category: "General",
      commandName: "invite"
    },
    membercount: {
      name: "Member Count",
      description: "Provides the number of members in your server.",
      permissions: ["ALL"],
      clientPerms: [],
      cooldown: 1,
      minArgs: 0,
      options: [],
      aliases: ["mcount", "mc"],
      usage: "membercount",
      required: "none",
      category: "General",
      commandName: "membercount"
    },
    pastebin: {
      name: "Pastebin",
      description: "Creates a new paste from https://pastebin.com.",
      permissions: ["ALL"],
      clientPerms: [],
      cooldown: 10800,
      minArgs: 1,
      options: ["new"],
      aliases: ["paste"],
      usage: "pastebin <option>",
      required: "none",
      category: "General",
      commandName: "pastebin"
    },
    ping: {
      name: "Ping",
      description: "Checks the bot's latency.",
      permissions: ["ALL"],
      clientPerms: [],
      cooldown: 1,
      minArgs: 0,
      options: [],
      aliases: [],
      usage: "ping",
      required: "none",
      category: "General",
      commandName: "ping"
    },
    uptime: {
      name: "Up-Time",
      description: "Shows how long the bot has last been online for.",
      permissions: ["ALL"],
      clientPerms: [],
      cooldown: 1,
      minArgs: 0,
      options: [],
      aliases: ["up-time", "upt"],
      usage: "uptime",
      required: "none",
      category: "General",
      commandName: "uptime"
    },
    voice: {
      name: "Voice",
      description: "Performs various voice channel actions.",
      permissions: ["ALL"],
      clientPerms: [],
      cooldown: 2,
      minArgs: 1,
      options: ["connect", "disconnect", "play", "pause"],
      aliases: ["vc"],
      usage: "voice <option>",
      required: "none",
      category: "General",
      commandName: "voice",
      option: {
        connect: {
          name: "Voice - Connect",
          description: "Connects Logic Link to a voice channel.",
          permissions: ["ALL"],
          clientPerms: [],
          cooldown: 2,
          minArgs: 2,
          options: [],
          aliases: [],
          usage: "voice connect",
          required: "none",
          category: "General",
          commandName: "voice connect"
        },
        disconnect: {
          name: "Voice - Disconnect",
          description: "Disconnects Logic Link from a voice channel.",
          permissions: ["ALL"],
          clientPerms: [],
          cooldown: 2,
          minArgs: 2,
          options: [],
          aliases: [],
          usage: "voice disconnect",
          required: "none",
          category: "General",
          commandName: "voice disconnect"
        },
        play: {
          name: "Voice - Play",
          description: "Play any song or podcast from YouTube in a voice channel.",
          permissions: ["ALL"],
          clientPerms: [],
          cooldown: 2,
          minArgs: 2,
          options: [],
          aliases: [],
          usage: "voice play <search query>",
          required: "none",
          category: "General",
          commandName: "voice play"
        },
        pause: {
          name: "Voice - Pause",
          description: "Pauses the currently playing audio.",
          permissions: ["ALL"],
          clientPerms: [],
          cooldown: 2,
          minArgs: 2,
          options: [],
          aliases: [],
          usage: "voice pause",
          required: "none",
          category: "General",
          commandName: "voice pause"
        }
      }
    },
    whois: {
      name: "Who Is",
      description: "Retrieves information about a user.",
      permissions: ["ALL"],
      clientPerms: [],
      cooldown: 3,
      minArgs: 0,
      options: [],
      aliases: ["who-is", "userinfo", "uinfo", "who"],
      usage: "whois [user]",
      required: "none",
      category: "General",
      commandName: "whois"
    }
  },
  ticket: {
    thelp: {
      name: "Ticket Help",
      description: "Provides information about ticket commands.",
      permissions: ["ALL"],
      clientPerms: [],
      cooldown: 2,
      minArgs: 0,
      options: [],
      aliases: ["tickethelp"],
      usage: "thelp [command]",
      required: "ticket",
      category: "Ticket",
      subCategory: "Basic",
      commandName: "thelp"
    },
    panels: {
      name: "Ticket Panels",
      description: "Allows users to view or modify ticket panels.",
      permissions: ["ADMINISTRATOR"],
      clientPerms: [],
      cooldown: 3,
      minArgs: 0,
      options: ["new", "modify", "delete"],
      aliases: ["panel", "tpanels"],
      usage: "panels [new | modify | delete]",
      required: "ticket",
      category: "Ticket",
      subCategory: "Administrator",
      commandName: "panels",
      option: {
        new: {
          name: "Ticket Panels - New",
          description: "Creates a new ticket panel for your server.",
          permissions: ["ADMINISTRATOR"],
          clientPerms: [],
          cooldown: 3,
          minArgs: 0,
          options: [],
          aliases: [],
          usage: "panels new",
          required: "ticket",
          category: "Ticket",
          subCategory: "Administrator",
          commandName: "panels new",
        },
        modify: {
          name: "Ticket Panels - Modify",
          description: "Modifies the data of a ticket panel.",
          permissions: ["ADMINISTRATOR"],
          clientPerms: [],
          cooldown: 3,
          minArgs: 0,
          options: [],
          aliases: [],
          usage: "panels modify <panel id> [option] [option parameter]",
          required: "ticket",
          category: "Ticket",
          subCategory: "Administrator",
          commandName: "panels modify",
        },
        delete: {
          name: "Ticket Panels - Delete",
          description: "Deletes a ticket panel.",
          permissions: ["ADMINISTRATOR"],
          clientPerms: [],
          cooldown: 3,
          minArgs: 0,
          options: [],
          aliases: [],
          usage: "panels delete <panel id>",
          required: "ticket",
          category: "Ticket",
          subCategory: "Administrator",
          commandName: "panels delete",
        }
      }
    },
    tsettings: {
      name: "Ticket Settings",
      description: "Allows users to view or modify ticket settings.",
      permissions: ["ADMINISTRATOR"],
      clientPerms: [],
      cooldown: 3,
      minArgs: 0,
      options: [],
      aliases: ["ticketsettings", "tset"],
      usage: "tsettings [setting] [option parameter]",
      required: "ticket",
      category: "Ticket",
      subCategory: "Administrator",
      commandName: "tsettings"
    }
  },
  moderator: {
    announce: {
      name: "Announce",
      description: "Sends an announcement to a channel.",
      permissions: ["MENTION_EVERYONE"],
      clientPerms: ["MENTION_EVERYONE"],
      cooldown: 3,
      minArgs: 1,
      options: ["everyone", "here", "role"],
      aliases: ["announcement", "anounce"],
      usage: "announce [option] <channel> <announcement>",
      required: "mod",
      category: "Moderator",
      commandName: "announce",
      option: {
        everyone: {
          name: "Announce - Everyone",
          description: "Sends an announcement to a channel that pings @everyone.",
          permissions: ["SEND_MESSAGES", "MENTION_EVERYONE"],
          clientPerms: ["SEND_MESSAGES", "MENTION_EVERYONE"],
          cooldown: 3,
          minArgs: 1,
          options: [],
          aliases: [],
          usage: "announce everyone <channel> <announcement>",
          required: "admin",
          category: "Moderator",
          commandName: "announce everyone"
        },
        here: {
          name: "Announce - Here",
          description: "Sends an announcement to a channel that pings @here.",
          permissions: ["SEND_MESSAGES", "MENTION_EVERYONE"],
          clientPerms: ["SEND_MESSAGES", "MENTION_EVERYONE"],
          cooldown: 3,
          minArgs: 1,
          options: [],
          aliases: [],
          usage: "announce here <channel> <announcement>",
          required: "admin",
          category: "Moderator",
          commandName: "announce here"
        },
        role: {
          name: "Announce - Role",
          description: "Sends an announcement to a channel that pings a role.",
          permissions: ["SEND_MESSAGES"],
          clientPerms: ["SEND_MESSAGES"],
          cooldown: 3,
          minArgs: 1,
          options: [],
          aliases: [],
          usage: "announce role <role> <channel> <announcement>",
          required: "admin",
          category: "Moderator",
          commandName: "announce role"
        }
      }
    },
    ban: {
      name: "Ban",
      description: "Permanently removes members from your server, banned users are not able to rejoin unless unbanned.",
      permissions: ["BAN_MEMBERS"],
      clientPerms: ["BAN_MEMBERS"],
      cooldown: 4,
      minArgs: 1,
      options: [],
      aliases: [],
      usage: "ban <user> [reason]",
      required: "mod",
      category: "Moderator",
      commandName: "ban",
    },
    softban: {
      name: "Softban",
      description: "Bans members from your server without deleting previous messages.",
      permissions: ["BAN_MEMBERS"],
      clientPerms: ["BAN_MEMBERS"],
      cooldown: 4,
      minArgs: 1,
      options: [],
      aliases: ["sban"],
      usage: "softban <user> [reason]",
      required: "mod",
      category: "Moderator",
      commandName: "softban"
    },
    tempban: {
      name: "Tempban",
      description: "Temporarily bans members from your server.",
      permissions: ["BAN_MEMBERS"],
      clientPerms: ["BAN_MEMBERS"],
      cooldown: 4,
      minArgs: 1,
      options: [],
      aliases: ["tban"],
      usage: "tban <user> <duration> [reason]",
      required: "mod",
      category: "Moderator",
      commandName: "tempban"
    },
    embed: {
      name: "Embed",
      description: "Creates a customizeable embed to send in any channel.",
      permissions: ["MANAGE_MESSAGES"],
      clientPerms: ["SEND_MESSAGES"],
      cooldown: 2,
      minArgs: 1,
      options: [],
      aliases: ["emb"],
      usage: "embed ~<title>~ <description>",
      required: "mod",
      category: "Moderator",
      commandName: "embed"
    },
    kick: {
      name: "Kick",
      description: "Removes members from your server, kicked users are able to rejoin.",
      permissions: ["KICK_MEMBERS"],
      clientPerms: ["KICK_MEMBERS"],
      cooldown: 1,
      minArgs: 1,
      options: [],
      aliases: [],
      usage: "kick <user> [reason]",
      required: "mod",
      category: "Moderator",
      commandName: "kick"
    },
    mute: {
      name: "Mute",
      description: "Removes the ablity for a user to type in a text channel.",
      permissions: ["MANAGE_ROLES"],
      clientPerms: ["MANAGE_ROLES"],
      cooldown: 7,
      minArgs: 1,
      options: [],
      aliases: [],
      usage: "mute <user> [duration] [reason]",
      required: "mod",
      category: "Moderator",
      commandName: "mute"
    },
    nickname: {
      name: "Nickname",
      description: "Modifies the nickname of members in your server.",
      permissions: ["MANAGE_NICKNAMES"],
      clientPerms: ["MANAGE_NICKNAMES"],
      cooldown: 2,
      minArgs: 1,
      options: [],
      aliases: [],
      usage: "nickname <user> <new nickname | reset>",
      required: "mod",
      category: "Moderator",
      commandName: "nickname"
    },
    purge: {
      name: "Purge",
      description: "Quickly deletes messages from a channel.",
      permissions: ["MANAGE_MESSAGES"],
      clientPerms: ["MANAGE_MESSAGES"],
      cooldown: 3,
      minArgs: 1,
      options: [],
      aliases: [],
      usage: "purge <number>",
      required: "mod",
      category: "Moderator",
      commandName: "purge"
    },
    slowmode: {
      name: "Slowmode",
      description: "Limits how fast users are able to send messages.",
      permissions: ["MANAGE_CHANNELS"],
      clientPerms: ["MANAGE_CHANNELS"],
      cooldown: 2,
      minArgs: 1,
      options: [],
      aliases: ["slow", "smode"],
      usage: "slowmode [channel] <number | off>",
      required: "mod",
      category: "Moderator",
      commandName: "slowmode"
    },
    unban: {
      name: "Un-Ban",
      description: "Removes bans from users.",
      permissions: ["BAN_MEMBERS"],
      clientPerms: ["BAN_MEMBERS"],
      cooldown: 2,
      minArgs: 1,
      options: [],
      aliases: ["un-ban"],
      usage: "unban <user> [reason]",
      required: "mod",
      category: "Moderator",
      commandName: "unban"
    },
    unmute: {
      name: "Un-Mute",
      description: "Removes mutes from users.",
      permissions: ["MANAGE_CHANNELS"],
      clientPerms: ["MANAGE_CHANNELS"],
      cooldown: 2,
      minArgs: 1,
      options: [],
      aliases: ["un-mute"],
      usage: "unmute <user> [reason]",
      required: "mod",
      category: "Moderator",
      commandName: "unmute"
    },
    warn: {
      name: "Warn",
      description: "Creates a logged warning attached to a certain user.",
      permissions: ["MANAGE_NICKNAMES"],
      clientPerms: [],
      cooldown: 2,
      minArgs: 1,
      options: [],
      aliases: [],
      usage: "warn <user> [warning]",
      required: "mod",
      category: "Moderator",
      commandName: "warn"
    },
    warnings: {
      name: "Warnings",
      description: "Views all warnings from a particular user.",
      permissions: ["MANAGE_NICKNAMES"],
      clientPerms: [],
      cooldown: 3,
      minArgs: 1,
      options: [],
      aliases: [],
      usage: "warnings <member>",
      required: "mod",
      category: "Moderator",
      commandName: "warnings"
    }
  },
  administrator: {
    addrole: {
      name: "Add Role",
      description: "Adds a specific role to a user.",
      permissions: ["MANAGE_ROLES"],
      clientPerms: ["MANAGE_ROLES"],
      cooldown: 2,
      minArgs: 1,
      options: [],
      aliases: ["giverole", "ar"],
      usage: "addrole <user> <role>",
      required: "admin",
      category: "Administrator",
      commandName: "addrole",
    },
    addroles: {
      name: "Add Roles",
      description: "Adds multiple roles to a user.",
      permissions: ["MANAGE_ROLES"],
      clientPerms: ["MANAGE_ROLES"],
      cooldown: 10,
      minArgs: 1,
      options: [],
      aliases: ["giveroles", "ars"],
      usage: "addroles <user> <roles>",
      required: "admin",
      category: "Administrator",
      commandName: "addroles",
    },
    create: {
      name: "Create",
      description: "Creates roles and channels in your server.",
      permissions: ["MANAGE_CHANNELS", "MANAGE_ROLES"],
      clientPerms: ["MANAGE_CHANNELS", "MANAGE_ROLES"],
      cooldown: 2,
      minArgs: 1,
      options: ["channel", "role", "voice"],
      aliases: ["crt"],
      usage: "create <option> <name>",
      required: "admin",
      category: "Administrator",
      commandName: "create",
      option: {
        channel: {
          name: "Create - Channel",
          description: "Creates text channels in your server.",
          permissions: ["MANAGE_CHANNELS"],
          clientPerms: ["MANAGE_CHANNELS"],
          cooldown: 2,
          options: [],
          aliases: [],
          usage: "create channel <name>",
          required: "admin",
          category: "Administrator",
          commandName: "create channel"
        },
        role: {
          name: "Create - Role",
          description: "Creates roles in your server.",
          permissions: ["MANAGE_ROLES"],
          clientPerms: ["MANAGE_ROLES"],
          cooldown: 2,
          options: [],
          aliases: [],
          usage: "create role <name>",
          required: "admin",
          category: "Administrator",
          commandName: "create role"
        },
        voice: {
          name: "Create - Voice Channel",
          description: "Creates voice channels in your server.",
          permissions: ["MANAGE_CHANNELS"],
          clientPerms: ["MANAGE_CHANNELS"],
          cooldown: 2,
          options: [],
          aliases: [],
          usage: "create voice <name>",
          required: "admin",
          category: "Administrator",
          commandName: "create voice"
        }
      }
    },
    delete: {
      name: "Delete",
      description: "Deletes roles and channels in your server.",
      permissions: ["MANAGE_CHANNELS", "MANAGE_ROLES"],
      clientPerms: ["MANAGE_CHANNELS", "MANAGE_ROLES"],
      cooldown: 2,
      minArgs: 1,
      options: [],
      aliases: [],
      usage: "delete <role | channel>",
      required: "admin",
      category: "Administrator",
      commandName: "delete",
      option: {
        channel: {
          name: "Delete - Channel",
          description: "Deletes channels in your server.",
          permissions: ["MANAGE_CHANNELS"],
          clientPerms: ["MANAGE_CHANNELS"],
          cooldown: 2,
          options: [],
          aliases: [],
          usage: "delete <channel>",
          required: "admin",
          category: "Administrator",
          commandName: "delete channel"
        },
        role: {
          name: "Delete - Role",
          description: "Deletes roles in your server.",
          permissions: ["MANAGE_ROLES"],
          clientPerms: ["MANAGE_ROLES"],
          cooldown: 2,
          options: [],
          aliases: [],
          usage: "delete <role>",
          required: "admin",
          category: "Administrator",
          commandName: "delete role"
        }
      }
    },
    hide: {
      name: "Hide",
      description: "Prevents all users from being able to see a certain channel.",
      permissions: ["MANAGE_CHANNELS"],
      clientPerms: ["MANAGE_CHANNELS"],
      cooldown: 3,
      minArgs: 0,
      options: [],
      aliases: [],
      usage: "hide [channel] [reason]",
      required: "admin",
      category: "Administrator",
      commandName: "hide"
    },
    hoist: {
      name: "Hoist",
      description: "Separates users with a role differently from online members.",
      permissions: ["MANAGE_ROLES"],
      clientPerms: ["MANAGE_ROLES"],
      cooldown: 2,
      minArgs: 1,
      options: [],
      aliases: [],
      usage: "hoist <role>",
      required: "admin",
      category: "Administrator",
      commandName: "hoist"
    },
    lock: {
      name: "Lock",
      description: "Prevents all users from being able to type in a text channel.",
      permissions: ["MANAGE_CHANNELS"],
      clientPerms: ["MANAGE_CHANNELS"],
      cooldown: 3,
      minArgs: 0,
      options: [],
      aliases: [],
      usage: "lock [channel] [reason]",
      required: "admin",
      category: "Administrator",
      commandName: "lock"
    },
    removerole: {
      name: "Remove Role",
      description: "Removes a specific role from a user.",
      permissions: ["MANAGE_ROLES"],
      clientPerms: ["MANAGE_ROLES"],
      cooldown: 2,
      minArgs: 1,
      options: [],
      aliases: ["takerole", "rr"],
      usage: "removerole <user> <role>",
      required: "admin",
      category: "Administrator",
      commandName: "removerole",
    },
    removeroles: {
      name: "Remove Role",
      description: "Removes multiple roles from a user.",
      permissions: ["MANAGE_ROLES"],
      clientPerms: ["MANAGE_ROLES"],
      cooldown: 10,
      minArgs: 1,
      options: [],
      aliases: ["takeroles", "rrs"],
      usage: "removeroles <user> <roles>",
      required: "admin",
      category: "Administrator",
      commandName: "removeroles",
    },
    settings: {
      name: "Settings",
      description: "Allows you to view and configure your server settings.",
      permissions: ["ADMINISTRATOR"],
      clientPerms: [],
      cooldown: 2,
      minArgs: 0,
      options: ["prefix", "adminrole", "modrole", "logchannel", "welcome", "welcomechannel", "welcomerole"],
      aliases: ["setting", "set"],
      usage: "settings [option] [option parameter]",
      required: "admin",
      category: "Administrator",
      commandName: "settings",
      option: {
        prefix: {
          name: "Setting - Prefix",
          description: "Modifies the current prefix for your server.",
          permissions: ["ADMINISTRATOR"],
          clientPerms: [],
          cooldown: 1,
          aliases: ["settings pre"],
          usage: "settings prefix <new prefix>",
          required: "admin",
          category: "Administrator",
          commandName: "settings prefix"
        },
        adminrole: {
          name: "Setting - Administrator Role",
          description: "Changes what roles will have access to administrator commands.",
          permissions: ["ADMINISTRATOR"],
          clientPerms: [],
          cooldown: 1,
          aliases: ["settings admin", "settings administratorrole"],
          usage: "settings adminrole <role>",
          required: "admin",
          category: "Administrator",
          commandName: "settings adminrole"
        },
        modrole: {
          name: "Setting - Moderator Role",
          description: "Changes what roles will have access to moderator commands.",
          permissions: ["ADMINISTRATOR"],
          clientPerms: [],
          cooldown: 1,
          aliases: ["settings mod", "settings moderatorrole"],
          usage: "settings modrole <role>",
          required: "admin",
          category: "Administrator",
          commandName: "settings modrole"
        },
        logchannel: {
          name: "Setting - Log Channel",
          description: "Changes what channel server logs are sent to.",
          permissions: ["ADMINISTRATOR"],
          clientPerms: [],
          cooldown: 1,
          aliases: ["settings log", "settings logchan"],
          usage: "settings logchannel <channel>",
          required: "admin",
          category: "Administrator",
          commandName: "settings logchannel"
        },
        mutedrole: {
          name: "Setting - Muted Role",
          description: "Changes what role will be granted to users who are muted.",
          permissions: ["ADMINISTRATOR"],
          clientPerms: [],
          cooldown: 1,
          aliases: ["settings muted"],
          usage: "settings mutedrole <role>",
          required: "admin",
          category: "Administrator",
          commandName: "settings mutedrole"
        },
        welcome: {
          name: "Setting - Welcome System",
          description: "Enables or disable the welcoming system.",
          permissions: ["ADMINISTRATOR"],
          clientPerms: [],
          cooldown: 1,
          aliases: ["settings welc", "settings welcomesystem"],
          usage: "settings welcome <on | off>",
          required: "admin",
          category: "Administrator",
          commandName: "settings welcome"
        },
        welcomechannel: {
          name: "Setting - Welcome Channel",
          description: "Changes what channel new users are welcomed in.",
          permissions: ["ADMINISTRATOR"],
          clientPerms: [],
          cooldown: 1,
          aliases: ["settings welcomechan", "settings welcchan"],
          usage: "settings welcomechannel <channel>",
          required: "admin",
          category: "Administrator",
          commandName: "settings welcomechannel"
        },
        welcomerole: {
          name: "Setting - Welcome Role",
          description: "Changes what role new users recieve once they join your server.",
          permissions: ["ADMINISTRATOR"],
          clientPerms: [],
          cooldown: 1,
          aliases: ["settings welcrole"],
          usage: "settings welcomerole <role>",
          required: "admin",
          category: "Administrator",
          commandName: "settings welcomerole"
        },
        welcomemsg: {
          name: "Setting - Welcome Message",
          description: "Modifies the kind message that greets new users in your server.\n\`[user]\`, \`[tag]\`, \`[id]\` and \`[username]\` are replaced with their respective values.",
          permissions: ["ADMINISTRATOR"],
          clientPerms: [],
          cooldown: 1,
          aliases: ["settings welcmsg"],
          usage: "settings welcomemsg <msg>",
          required: "admin",
          category: "Administrator",
          commandName: "settings welcomemsg"
        },
      }
    },
    unhoist: {
      name: "Un-Hoist",
      description: "Turns off the hoist for a role.",
      permissions: ["MANAGE_ROLES"],
      clientPerms: ["MANAGE_ROLES"],
      cooldown: 2,
      minArgs: 1,
      options: [],
      aliases: ["un-hoist"],
      usage: "unhoist <role>",
      required: "admin",
      category: "Administrator",
      commandName: "unhoist"
    },
    unhide: {
      name: "Un-Hide",
      description: "Allows users to be able to see a certain channel again.",
      permissions: ["MANAGE_CHANNELS"],
      clientPerms: ["MANAGE_CHANNELS"],
      cooldown: 3,
      minArgs: 0,
      options: [],
      aliases: [],
      usage: "unhide [channel] [reason]",
      required: "admin",
      category: "Administrator",
      commandName: "unhide"
    },
    unlock: {
      name: "Un-Lock",
      description: "Re-enables the ability for users to talk in a text channel.",
      permissions: ["MANAGE_CHANNELS"],
      clientPerms: ["MANAGE_CHANNELS"],
      cooldown: 5,
      minArgs: 0,
      options: [],
      aliases: ["un-lock"],
      usage: "unlock [channel] [reason]",
      required: "admin",
      category: "Administrator",
      commandName: "unlock"
    }
  },
  support: {
    bug: {
      name: "Bug Report",
      description: "Submits a bug report to the support server.",
      permissions: [],
      clientPerms: [],
      cooldown: 10,
      minArgs: 1,
      options: [],
      aliases: [],
      usage: "bug new",
      required: "support",
      category: "Support",
      commandName: "bug"
    },
    error: {
      name: "Error",
      description: "Retrieves error information from an error ID.",
      permissions: ["SUPPORT_TEAM"],
      clientPerms: [],
      cooldown: 3,
      minArgs: 1,
      options: [],
      aliases: [],
      usage: "error <id>",
      required: "support",
      category: "Support",
      commandName: "error"
    },
    shelp: {
      name: "Support Help",
      description: "Provides information about support team commands.",
      permissions: ["SUPPORT_TEAM"],
      clientPerms: [],
      cooldown: 2,
      minArgs: 0,
      options: [],
      aliases: [],
      usage: "shelp [command]",
      required: "support",
      category: "Support",
      commandName: "shelp"
    }
  },
  developer: {
    blacklist: {
      name: "Blacklist",
      description: "Disallows certain users from using commands.",
      permissions: ["BOT_DEVELOPER"],
      clientPerms: [],
      cooldown: 0,
      minArgs: 1,
      options: ["view"],
      aliases: [],
      usage: "blacklist <user> [reason]",
      required: "dev",
      category: "Developer",
      commandName: "blacklist",
      option: {
        view: {
          name: "Blacklist - View",
          description: "Shows a list of currently blacklisted users.",
          permissions: ["BOT_DEVELOPER"],
          clientPerms: [],
          cooldown: 0,
          minArgs: 1,
          options: ["view"],
          aliases: [],
          usage: "blacklist <user> [reason]",
          required: "dev",
          category: "Developer",
          commandName: "blacklist",
        }
      }
    },
    devlock: {
      name: "Developer Lock",
      description: "Disables commands when they contain bugs, are under development, or contain security risks.",
      permissions: ["BOT_DEVELOPER"],
      clientPerms: [],
      cooldown: 0,
      minArgs: 1,
      options: ["view"],
      aliases: ["dlock", "dl", "developerlock"],
      usage: "devlock <command> [guild] [option | reason]",
      required: "dev",
      category: "Developer",
      commandName: "devlock",
      option: {
        view: {
          name: "Developer Lock - View",
          description: "Used to view the currently locked commands.",
          permissions: ["BOT_DEVELOPER"],
          clientPerms: [],
          cooldown: 0,
          minArgs: 1,
          options: [],
          aliases: ["check"],
          usage: "devlock view",
          required: "dev",
          category: "Developer",
          commandName: "devlock view",
        }
      }
    },
    devhelp: {
      name: "Developer Help",
      description: "Shows a list of developer commands.",
      permissions: ["ALL"],
      clientPerms: [],
      cooldown: 0,
      minArgs: 0,
      options: [],
      aliases: ["dhelp"],
      usage: "devhelp [option]",
      required: "dev",
      category: "Developer",
      commandName: "devhelp"
    },
    devmode: {
      name: "Developer Mode",
      description: "Enables the bot developer mode.",
      permissions: ["BOT_DEVELOPER"],
      clientPerms: [],
      cooldown: 0,
      minArgs: 1,
      options: [],
      aliases: ["dmode", "devm"],
      usage: "devmode <on | off>",
      required: "dev",
      category: "Developer",
      commandName: "devmode"
    },
    eval: {
      name: "Eval",
      description: "Executes javascript code directly from discord.",
      permissions: ["BOT_DEVELOPER"],
      clientPerms: [],
      cooldown: 0,
      minArgs: 1,
      options: ["silent", "async"],
      aliases: ["e"],
      usage: "eval [option] <code>",
      required: "dev",
      category: "Developer",
      commandName: "eval",
      option: {
        silent: {
          name: "Eval - Silent",
          description: "Executes javascript code silently.",
          permissions: ["BOT_DEVELOPER"],
          clientPerms: [],
          cooldown: 0,
          minArgs: 1,
          options: [],
          aliases: ["s"],
          usage: "eval silent <code>",
          required: "dev",
          category: "Developer",
          commandName: "eval silent",
        },
        async: {
          name: "Eval - Async",
          description: "Executes javascript code in an asynchronous thread.",
          permissions: ["BOT_DEVELOPER"],
          clientPerms: [],
          cooldown: 0,
          minArgs: 1,
          options: [],
          aliases: ["a"],
          usage: "eval async <code>",
          required: "dev",
          category: "Developer",
          commandName: "eval async",
        }
      }
    },
    logs: {
      name: "Logs",
      description: "Allows the bot developer to view and create logs.",
      permissions: ["BOT_DEVELOPER"],
      clientPerms: [],
      cooldown: 0,
      minArgs: 0,
      options: ["add", "remove", "persistent"],
      aliases: [],
      usage: "logs <option>",
      required: "dev",
      category: "Developer",
      commandName: "logs"
    },
    reload: {
      name: "Reload",
      description: "Reloads the content of a command file.",
      permissions: ["BOT_DEVELOPER"],
      clientPerms: [],
      cooldown: 0,
      minArgs: 1,
      options: [],
      aliases: ["rld"],
      usage: "reload <command name>",
      required: "dev",
      category: "Developer",
      commandName: "reload"
    },
    reset: {
      name: "Reset",
      description: "Resets database keys.",
      permissions: ["BOT_DEVELOPER"],
      clientPerms: [],
      cooldown: 0,
      minArgs: 1,
      options: ["cooldown", "settings"],
      aliases: ["rst"],
      usage: "reset <option> <option parameter>",
      required: "dev",
      category: "Developer",
      commandName: "reset",
      option: {
        cooldown: {
          name: "Reset - Cooldown",
          description: "Resets the command cooldown for a specific user.",
          permissions: ["BOT_DEVELOPER"],
          clientPerms: [],
          cooldown: 0,
          minArgs: 1,
          options: [],
          aliases: [],
          usage: "reset cooldown <user> [command]",
          required: "dev",
          category: "Developer",
          commandName: "reset cooldown",
        },
        settings: {
          name: "Reset - Settings",
          description: "Resets the settings for a particular guild.",
          permissions: ["BOT_DEVELOPER"],
          clientPerms: [],
          cooldown: 0,
          minArgs: 1,
          options: [],
          aliases: [],
          usage: "reset settings <guild> [setting]",
          required: "dev",
          category: "Developer",
          commandName: "reset settings",
        }
      }
    },
    restart: {
      name: "Restart",
      description: "Restarts Logic Link.",
      permissions: ["BOT_DEVELOPER"],
      clientPerms: [],
      cooldown: 0,
      minArgs: 0,
      options: [],
      aliases: ["rstart", "rst"],
      usage: "restart",
      required: "dev",
      category: "Developer",
      commandName: "restart"
    },
    shutdown: {
      name: "Shutdown",
      description: "Logs out of Logic Link.",
      permissions: ["BOT_DEVELOPER"],
      clientPerms: [],
      cooldown: 0,
      minArgs: 0,
      options: [],
      aliases: [],
      usage: "shutdown",
      required: "dev",
      category: "Developer",
      commandName: "shutdown"
    },
    test: {
      name: "Test",
      description: "A command used to test out new features.",
      permissions: ["BOT_DEVELOPER"],
      clientPerms: [],
      cooldown: 0,
      minArgs: 0,
      options: [],
      aliases: [],
      usage: "test",
      required: "dev",
      category: "Developer",
      commandName: "test"
    },
    unblacklist: {
      name: "Un-Blacklist",
      description: "Un-blacklists users from Logic Link.",
      permissions: ["BOT_DEVELOPER"],
      clientPerms: [],
      cooldown: 0,
      minArgs: 1,
      options: [],
      aliases: [],
      usage: "unblacklist <user>",
      required: "dev",
      category: "Developer",
      commandName: "unblacklist",
    },
  },
  categories: [
    "Administrator",
    "Developer",
    "General",
    "Moderator",
    "Support",
    "Ticket"
  ],
  ticketCategories: [
    "Administrator",
    "Basic",
    "Support"
  ],
  aliases: {
    "av": "avatar",
    "binfo": "botinfo",
    "inv": "invite",
    "mcount": "membercount",
    "memcount": "membercount",
    "mc": "membercount",
    "vc": "voice",
    "un-mute": "unmute",
    "un-ban": "unban",
    "role": "roles",
    "setting": "settings",
    "set": "settings",
    "e": "eval",
    "rld": "reload",
    "crt": "create",
    "tickets": "ticket",
    "tck": "ticket",
    "slow": "slowmode",
    "smode": "slowmode",
    "slowmod": "slowmode",
    "setnick": "nickname",
    "nickset": "nickname",
    "nick": "nickname",
    "dlock": "devlock",
    "developerlock": "devlock",
    "dl": "devlock",
    "un-lock": "unlock",
    "up-time": "uptime",
    "un-hoist": "unhoist",
    "giverole": "addrole",
    "takerole": "removerole",
    "paste": "pastebin",
    "giveroles": "addroles",
    "takeroles": "removeroles",
    "upt": "uptime",
    "commands": "help",
    "cmds": "help",
    "cmd": "help",
    "warning": "warnings",
    "warns": "warnings",
    "dhelp": "devhelp",
    "emb": "embed",
    "log": "logs",
    "tickethelp": "thelp",
    "ticketsettings": "tsettings",
    "ticketsetting": "tsettings",
    "tset": "tsettings",
    "ticketpanels": "panels",
    "tpanel": "panels",
    "tpanels": "panels",
    "ticketpanel": "panels",
    "panel": "panels",
    "errors": "error",
    "blacklists": "blacklist",
    "bl": "blacklist",
    "bls": "blacklist",
    "ubl": "unblacklist",
    "ubls": "unblacklist",
    "sban": "softban",
    "tban": "tempban",
    "cinfo": "channelinfo",
    "rinfo": "roleinfo",
    "sinfo": "serverinfo",
    "userinfo": "whois",
    "uinfo": "whois",
    "who": "whois",
    "unb": "unblacklist",
    "dvl": "devlock",
    "ar": "addrole",
    "ars": "addroles",
    "rr": "removerole",
    "rrs": "removeroles"
  }
}