import Commands from "./Commands";
const reason: string = "The reason for this action.";

const gen = Commands.General;
const tck = Commands.Ticket;
const mod = Commands.Moderator;
const adm = Commands.Administrator;
const sup = Commands.Support;
const dev = Commands.Developer;

enum AppTypes {
  CHAT_INPUT = 1,
  USER = 2,
  MESSAGE = 3
}

enum OptionTypes {
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

const Application = [
  {
    name: "addrole",
    type: AppTypes.CHAT_INPUT,
    description: adm.addrole.description,
    options: [
      {
        name: "user",
        description: "The user to give the role to.",
        type: OptionTypes.USER,
        required: true
      },
      {
        name: "role",
        description: "The role to be added to the user.",
        type: OptionTypes.ROLE,
        required: true
      }
    ]
  },
  {
    name: "addroles",
    type: AppTypes.CHAT_INPUT,
    description: adm.addroles.description,
    options: [
      {
        name: "user",
        description: "The user to give the roles to.",
        type: OptionTypes.USER,
        required: true
      },
      {
        name: "roles",
        description: "Mention roles to add to the user.",
        type: OptionTypes.STRING,
        required: true
      }
    ]
  },
  {
    name: "create",
    type: AppTypes.CHAT_INPUT,
    description: adm.create.description,
    options: [
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
    ]
  },
  {
    name: "delete",
    type: AppTypes.CHAT_INPUT,
    description: adm.delete.description,
    options: [
      {
        name: "role",
        description: adm.delete.option.role.description,
        type: OptionTypes.SUB_COMMAND,
        options: [
          {
            name: "role",
            description: "The role to delete from this server.",
            type: OptionTypes.ROLE,
            required: true
          },
          {
            name: "channel",
            description: "The channel to delete from this server.",
            type: OptionTypes.CHANNEL,
            required: true
          }
        ]
      },
      {
        name: "channel",
        description: adm.delete.option.channel.description,
        type: AppTypes.CHAT_INPUT,
        options: [
          {
            name: "channel",
            description: "The channel to delete from this server.",
            type: OptionTypes.CHANNEL,
            required: true
          }
        ]
      }
    ]
  },
  {
    name: "hide",
    type: AppTypes.CHAT_INPUT,
    description: adm.hide.description,
    options: [
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
      }
    ]
  },
  {
    name: "hoist",
    type: AppTypes.CHAT_INPUT,
    description: adm.hoist.description,
    options: [
      {
        name: "role",
        description: "The role to hoist.",
        type: OptionTypes.ROLE,
        required: true
      }
    ]
  },
  {
    name: "lock",
    type: AppTypes.CHAT_INPUT,
    description: adm.lock.description,
    options: [
      {
        name: "channel",
        description: "The channel to lock from regular members.",
        type: OptionTypes.CHANNEL,
        required: true
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
    name: "lockdown",
    type: AppTypes.CHAT_INPUT,
    description: adm.lockdown.description,
  },
  {
    name: "removerole",
    type: AppTypes.CHAT_INPUT,
    description: adm.removerole.description,
    options: [
      {
        name: "user",
        description: "The user to remove the role from.",
        type: OptionTypes.USER,
        required: true
      },
      {
        name: "role",
        description: "The role to be removed from the user.",
        type: OptionTypes.ROLE,
        required: true
      }
    ]
  },
  {
    name: "removeroles",
    type: AppTypes.CHAT_INPUT,
    description: adm.removeroles.description,
    options: [
      {
        name: "user",
        description: "The user to remove the roles from.",
        type: OptionTypes.USER,
        required: true
      },
      {
        name: "roles",
        description: "Mention roles to from from the user.",
        type: OptionTypes.STRING,
        required: true
      }
    ]
  },
  {
    name: "settings",
    type: AppTypes.CHAT_INPUT,
    description: adm.settings.description,
    options: [
      {
        name: "setting",
        description: "The server setting to view or modify.",
        type: OptionTypes.STRING,
        required: false,
        choices: [
          {
            name: "Prefix",
            value: "PREFIX"
          },
          {
            name: "Moderator Role",
            value: "MOD_ROLE"
          },
          {
            name: "Administrator Role",
            value: "ADMIN_ROLE"
          },
          {
            name: "Log Channel",
            value: "LOG_CHANNEL"
          },
          {
            name: "Muted Role",
            value: "MUTED_ROLE"
          },
          {
            name: "Welcome System",
            value: "WELCOME"
          },
          {
            name: "Welcome Channel",
            value: "WELCOME_CHANNEL"
          },
          {
            name: "Welcome Role",
            value: "WELCOME_ROLE"
          },
          {
            name: "Welcome Message",
            value: "WELCOME_MESSAGE"
          }
        ]
      },
      {
        name: "new",
        description: "The new server setting.",
        type: OptionTypes.STRING,
        required: false
      }
    ]
  },
  {
    name: "unhide",
    type: AppTypes.CHAT_INPUT,
    description: adm.unhide.description,
    options: [
      {
        name: "channel",
        description: "The channel to unlock.",
        type: OptionTypes.CHANNEL,
        required: true
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
    name: "unhoist",
    type: AppTypes.CHAT_INPUT,
    description: adm.unhoist.description,
    options: [
      {
        name: "role",
        description: "The role to unhoist.",
        type: OptionTypes.ROLE,
        required: true
      }
    ]
  },
  {
    name: "unlock",
    type: AppTypes.CHAT_INPUT,
    description: adm.unlock.description,
    options: [
      {
        name: "channel",
        description: "The channel to unlock.",
        type: OptionTypes.CHANNEL,
        required: true
      },
      {
        name: "reason",
        description: reason,
        type: OptionTypes.STRING,
        required: false
      }
    ]
  },
]

export default Application;