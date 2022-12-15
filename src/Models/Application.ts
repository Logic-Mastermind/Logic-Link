import type types from "types";
import Commands from "./Commands";
import Config from "./Config";
const reason: string = "The reason for this action.";

const gen = Commands.General;
const tck = Commands.Ticket;
const mod = Commands.Moderator;
const adm = Commands.Administrator;
const sup = Commands.Support;
const dev = Commands.Developer;

const enum AppTypes {
  CHAT_INPUT = 1,
  USER = 2,
  MESSAGE = 3
}

const enum OptionTypes {
  SUB_COMMAND = 1,
  SUB_COMMAND_GROUP = 2,
  STRING = 3,
  INTEGER = 4,
  BOOLEAN = 5,
  USER = 6,
  CHANNEL = 7,
  ROLE = 8,
  MENTIONABLE = 9,
  NUMBER = 10
}

const enum PermissionType {
  ROLE = 1,
  USER,
  CHANNEL
}

interface options {
  name: string;
  description: string;
  type: OptionTypes;

  required?: boolean;
  options?: options[]

  choices?: {
    name: string;
    value: string;
  }[]
}

interface permission {
  id: string;
  type: PermissionType;
  permission: boolean;
}

interface Command {
  name: string;
  type: AppTypes;
  description: string;

  options?: options[];
  permissions?: permission[];
}

const choices = {
  settings: [
    {
      name: "Prefix",
      value: "prefix"
    },
    {
      name: "Moderator Role",
      value: "modRole"
    },
    {
      name: "Administrator Role",
      value: "adminRole"
    },
    {
      name: "Log Channel",
      value: "logChannel"
    },
    {
      name: "Muted Role",
      value: "mutedRole"
    },
    {
      name: "Welcome System",
      value: "welcomeSystem"
    },
    {
      name: "Welcome Channel",
      value: "welcomeChannel"
    },
    {
      name: "Welcome Role",
      value: "welcomeRole"
    },
    {
      name: "Welcome Message",
      value: "welcomeMsg"
    }
  ]
}

function c(name: string, category: types.commandCategory, options?: options[]) {
  const cmd: Command = {
    name,
    description: category.get(name).description,
    type: AppTypes.CHAT_INPUT,
    options: options
  }

  if (category === dev) {
    cmd.permissions = [
      {
        id: Config.devId,
        type: PermissionType.USER,
        permission: true
      }
    ]
  }

  return cmd;
}

function roles(type: "add" | "remove", multiple: boolean) {
  return {
    name: type,
    description: `${type === "add" ? "Add" : "Remove"} ${multiple ? "roles" : "a role"} ${type === "add" ? "to" : "from"} a user`,
    type: OptionTypes.SUB_COMMAND,

    options: [
      {
        name: "user",
        description: `The user to ${type} the role ${type === "add" ? "to" : "from"}`,
        type: OptionTypes.USER
      },
      {
        name: `${multiple ? "search" : "role"}`,
        description: `The role${multiple ? "s to search for and" : " to"} ${type}`,
        type: multiple ? OptionTypes.STRING : OptionTypes.ROLE
      }
    ]
  }
}

const Administrator: Command[] = [
  c("role", adm, [
    roles("add", false),
    roles("remove", false),
  ]),

  c("roles", adm, [
    roles("add", true),
    roles("remove", true),
  ]),

  c("create", adm, [
    {
      name: "type",
      description: "The type of item to create.",
      type: OptionTypes.STRING,
      required: true,
      choices: [
        {
          name: "Role",
          value: "GUILD_ROLE"
        },
        {
          name: "Text Channel",
          value: "GUILD_TEXT"
        },
        {
          name: "Voice Channel",
          value: "GUILD_VOICE"
        },
        {
          name: "Category Channel",
          value: "GUILD_CATEGORY"
        },
        {
          name: "Stage Channel",
          value: "GUILD_STAGE_VOICE"
        },
      ]
    },
    {
      name: "name",
      description: "The name of the role or channel.",
      type: OptionTypes.STRING,
      required: false
    }
  ]),
  
  c("delete", adm, [
    {
      name: "role",
      description: "The role to delete from this server.",
      type: OptionTypes.ROLE,
    },
    {
      name: "channel",
      description: "The channel to delete from this server.",
      type: OptionTypes.CHANNEL,
    }
  ]),

  c("hide", adm, [
    {
      name: "channel",
      description: "The channel to hide from regular members.",
      type: OptionTypes.CHANNEL,
      required: true
    },
    {
      name: "reason",
      description: reason,
      type: OptionTypes.STRING,
      required: false
    },
    {
      name: "unhide",
      description: "Whether to unhide this channel",
      type: OptionTypes.BOOLEAN,
      required: false
    },
  ]),

  c("hoist", adm, [
    {
      name: "role",
      description: "The role to hoist.",
      type: OptionTypes.ROLE,
      required: true
    },
    {
      name: "unhoist",
      description: "Whether to unhoist this role",
      type: OptionTypes.BOOLEAN,
      required: false
    }
  ]),

  c("lock", adm, [
    {
      name: "channel",
      description: "The channel to lock",
      type: OptionTypes.CHANNEL,
      required: true
    },
    {
      name: "reason",
      description: reason,
      type: OptionTypes.STRING,
      required: false
    },
    {
      name: "unlock",
      description: "Whether to unlock this channel",
      type: OptionTypes.BOOLEAN,
      required: false
    }
  ]),

  c("lockdown", adm, [
    {
      name: "off",
      description: "Disables an active lockdown",
      type: OptionTypes.BOOLEAN,
      required: false
    }
  ]),

  c("settings", adm, [
    {
      name: "setting",
      description: "The server setting to view or modify.",
      type: OptionTypes.STRING,
      choices: choices.settings,
      required: false,
    }
  ])
]

const Developer: Command[] = [
  c("blacklist", dev, [
    {
      name: "user",
      description: "The user to blacklist",
      type: OptionTypes.STRING
    },
    {
      name: "reason",
      description: reason,
      type: OptionTypes.STRING,
      required: false
    },
    {
      name: "unblacklist",
      description: "Whether to unblacklist this user",
      type: OptionTypes.BOOLEAN,
      required: false
    },
  ]),

  c("devlock", dev, [
    {
      name: "add",
      description: "Adds a command to devlock",
      type: OptionTypes.SUB_COMMAND,

      options: [
        {
          name: "command",
          description: "The command to add",
          type: OptionTypes.STRING
        },
        {
          name: "reason",
          description: reason,
          type: OptionTypes.STRING,
          required: false
        }
      ]
    },
    {
      name: "remove",
      description: "Removes a command from devlock",
      type: OptionTypes.SUB_COMMAND,

      options: [
        {
          name: "command",
          description: "The command to remove",
          type: OptionTypes.STRING
        }
      ]
    },
    {
      name: "view",
      description: "Shows active devlocks",
      type: OptionTypes.SUB_COMMAND
    }
  ]),

  c("devlockdown", dev, [
    {
      name: "off",
      description: "Turn off the dev lockdown",
      type: OptionTypes.BOOLEAN,
      required: false,
    }
  ]),

  c("devmode", dev, [
    {
      name: "on",
      description: "Toggle devmode",
      type: OptionTypes.BOOLEAN
    }
  ]),

  c("eval", dev, [
    {
      name: "code",
      description: "The code the evaluate",
      type: OptionTypes.STRING,
    },
    {
      name: "mode",
      description: "The eval mode to be used",
      type: OptionTypes.STRING,
      required: false,

      choices: [
        {
          name: "Async",
          value: "async"
        },
        {
          name: "Silent",
          value: "silent"
        }
      ]
    }
  ]),

  c("logs", dev, [
    {
      name: "option",
      description: "Choose a command option",
      type: OptionTypes.SUB_COMMAND,

      options: [
        {
          name: "option",
          description: "Command option",
          type: OptionTypes.STRING,

          choices: [
            {
              name: "Clear",
              value: "clear"
            },
            {
              name: "Count",
              value: "count"
            },
            {
              name: "On",
              value: "on"
            },
            {
              name: "Off",
              value: "off"
            }
          ]
        }
      ]
    },
    {
      name: "add",
      description: "Creates a log",
      type: OptionTypes.SUB_COMMAND,

      options: [
        {
          name: "text",
          description: "Text of the log",
          type: OptionTypes.STRING
        },
        {
          name: "priority",
          description: "Choose the log priority",
          type: OptionTypes.STRING,
          required: false,

          choices: [
            {
              name: "Info",
              value: "info"
            },
            {
              name: "Warn",
              value: "warn"
            },
            {
              name: "Error",
              value: "error"
            }
          ]
        }
      ]
    },
    {
      name: "remove",
      description: "Clears all logs",
      type: OptionTypes.SUB_COMMAND,

      options: [
        {
          name: "id",
          description: "The log to remove by Id",
          type: OptionTypes.STRING
        }
      ]
    }
  ]),

  c("reload", dev, [
    {
      name: "name",
      description: "The command to reload",
      type: OptionTypes.STRING
    }
  ]),

  c("reset", dev, [
    {
      name: "cooldown",
      description: "Resets a user's command cooldown",
      type: OptionTypes.SUB_COMMAND,

      options: [
        {
          name: "user",
          description: "The user",
          type: OptionTypes.USER
        },
        {
          name: "command",
          description: "The command to reset cooldown for",
          type: OptionTypes.STRING,
          required: false
        },
      ]
    },
    {
      name: "setting",
      description: "Resets a server's settings",
      type: OptionTypes.SUB_COMMAND,

      options: [
        {
          name: "guild",
          description: "The guild",
          type: OptionTypes.STRING
        },
        {
          name: "setting",
          description: "The setting to reset",
          type: OptionTypes.STRING,
          choices: choices.settings,
          required: false
        },
      ]
    }
  ]),

  c("restart", dev),
  c("shutdown", dev),
  c("test", dev)
]

const General: Command[] = [
  c("avatar", gen, [
    {
      name: "user",
      description: "The user to get the profile of",
      type: OptionTypes.USER
    }
  ]),

  c("botinfo", gen),
  c("invite", gen),
  c("membercount", gen),
  c("uptime", gen),
  c("ping", gen),

  c("whois", gen, [
    {
      name: "user",
      description: "The user to get info about",
      type: OptionTypes.USER
    }
  ]),

  c("channelinfo", gen, [
    {
      name: "channel",
      description: "The channel to get info about",
      type: OptionTypes.CHANNEL
    }
  ]),

  c("roleinfo", gen, [
    {
      name: "channel",
      description: "The channel to get info about",
      type: OptionTypes.CHANNEL
    }
  ]),

  c("serverinfo", gen, [
    {
      name: "channel",
      description: "The channel to get info about",
      type: OptionTypes.CHANNEL
    }
  ]),

  c("reminder", gen, [
    {
      name: "create",
      description: "Creates a new reminder",
      type: OptionTypes.SUB_COMMAND,

      options: [
        {
          name: "duration",
          description: "The duration of the task. Eg: 6h, 3min",
          type: OptionTypes.STRING
        },
        {
          name: "task",
          description: "The task to remind you of",
          type: OptionTypes.STRING
        }
      ]
    },
    {
      name: "view",
      description: "Lists all active reminders",
      type: OptionTypes.SUB_COMMAND
    }
  ]),

  c("help", gen, [
    {
      name: "command",
      description: "The command to get info about",
      type: OptionTypes.STRING,
      required: false
    },
    {
      name: "category",
      description: "The category to list commands from",
      type: OptionTypes.STRING,
      required: false,

      choices: [
        {
          name: "General",
          value: "GENERAL"
        },
        {
          name: "Moderator",
          value: "MODERATOR"
        },
        {
          name: "Administrator",
          value: "ADMINISTRATOR"
        },
        {
          name: "Ticket",
          value: "TICKET"
        }
      ]
    }
  ]),
]

const Moderator: Command[] = [
  c("announce", mod, [
    {
      name: "channel",
      description: "The channel to announce in",
      type: OptionTypes.CHANNEL
    },
    {
      name: "announcement",
      description: "The announcement text",
      type: OptionTypes.STRING
    },
    {
      name: "role_mention",
      description: "Any roles to mention",
      type: OptionTypes.ROLE,
      required: false
    },
    {
      name: "mentions",
      description: "Choice between @here and @everyone mentions",
      type: OptionTypes.STRING,
      required: false,

      choices: [
        {
          name: "Everyone",
          value: "everyone"
        },
        {
          name: "Here",
          value: "here"
        }
      ]
    }
  ])
]

const Application = [
  ...Administrator,
  ...Developer,
  ...General,
  ...Moderator
]

export default Application;