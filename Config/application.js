const commands = require("./commands.js");
const gen = commands.general;
const tck = commands.ticket;
const mod = commands.moderator;
const adm = commands.administrator;
const sup = commands.support;
const dev = commands.dev;
const reason = "The reason for this action.";

const CommandTypes = {
  CHAT_INPUT: 1,
  USER: 2,
  MESSAGE: 3
}

const OptionTypes = {
  SUB_COMMAND: 1,
  SUB_COMMAND_GROUP: 2,
  STRING: 3,
  INTEGER: 4,
  BOOLEAN: 5,
  USER: 6,
  CHANNEL: 7,
  ROLE: 8,
  MENTIONABLE: 9,
  NUMBER: 10
}

module.exports = [
  {
    name: "addrole",
    type: 1,
    description: adm.addrole.description,
    options: [
      {
        name: "user",
        description: "The user to give the role to.",
        type: 6,
        required: true
      },
      {
        name: "role",
        description: "The role to be added to the user.",
        type: 8,
        required: true
      }
    ]
  },
  {
    name: "addroles",
    type: 1,
    description: adm.addroles.description,
    options: [
      {
        name: "user",
        description: "The user to give the roles to.",
        type: 6,
        required: true
      },
      {
        name: "roles",
        description: "Mention roles to add to the user.",
        type: 3,
        required: true
      }
    ]
  },
  {
    name: "create",
    type: 1,
    description: adm.create.description,
    options: [
      {
        name: "type",
        description: "The type of item to create.",
        type: 3,
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
        type: 3,
        required: false
      }
    ]
  },
  {
    name: "delete",
    type: 1,
    description: adm.delete.description,
    options: [
      {
        name: "role",
        description: adm.delete.option.role.description,
        type: 1,
        options: [
          {
            name: "role",
            description: "The role to delete from this server.",
            type: 8,
            required: true
          }
        ]
      },
      {
        name: "channel",
        description: adm.delete.option.channel.description,
        type: 1,
        options: [
          {
            name: "channel",
            description: "The channel to delete from this server.",
            type: 7,
            required: true
          }
        ]
      }
    ]
  },
  {
    name: "hide",
    type: 1,
    description: adm.hide.description,
    options: [
      {
        name: "channel",
        description: "The channel to hide from regular members.",
        type: 7,
        required: true
      },
      {
        name: "reason",
        description: reason,
        type: 3,
        required: false
      }
    ]
  },
  {
    name: "hoist",
    type: 1,
    description: adm.hoist.description,
    options: [
      {
        name: "role",
        description: "The role to hoist.",
        type: 8,
        required: true
      }
    ]
  },
  {
    name: "lock",
    type: 1,
    description: adm.lock.description,
    options: [
      {
        name: "channel",
        description: "The channel to lock from regular members.",
        type: 7,
        required: true
      },
      {
        name: "reason",
        description: reason,
        type: 3,
        required: false
      }
    ]
  },
  {
    name: "lockdown",
    type: 1,
    description: adm.lockdown.description,
  },
  {
    name: "removerole",
    type: 1,
    description: adm.removerole.description,
    options: [
      {
        name: "user",
        description: "The user to remove the role from.",
        type: 6,
        required: true
      },
      {
        name: "role",
        description: "The role to be removed from the user.",
        type: 8,
        required: true
      }
    ]
  },
  {
    name: "removeroles",
    type: 1,
    description: adm.removeroles.description,
    options: [
      {
        name: "user",
        description: "The user to remove the roles from.",
        type: 6,
        required: true
      },
      {
        name: "roles",
        description: "Mention roles to from from the user.",
        type: 3,
        required: true
      }
    ]
  },
  {
    name: "settings",
    type: 1,
    description: adm.settings.description,
    options: [
      {
        name: "setting",
        description: "The server setting to view or modify.",
        type: 3,
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
        type: 3,
        required: false
      }
    ]
  },
  {
    name: "unhide",
    type: 1,
    description: adm.unhide.description,
    options: [
      {
        name: "channel",
        description: "The channel to unlock.",
        type: 7,
        required: true
      },
      {
        name: "reason",
        description: reason,
        type: 3,
        required: false
      }
    ]
  },
  {
    name: "unhoist",
    type: 1,
    description: adm.unhoist.description,
    options: [
      {
        name: "role",
        description: "The role to unhoist.",
        type: 8,
        required: true
      }
    ]
  },
  {
    name: "unlock",
    type: 1,
    description: adm.unlock.description,
    options: [
      {
        name: "channel",
        description: "The channel to unlock.",
        type: 7,
        required: true
      },
      {
        name: "reason",
        description: reason,
        type: 3,
        required: false
      }
    ]
  },
]