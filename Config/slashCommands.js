const commands = require("./commands.js");
const gen = commands.general;
const tck = commands.ticket;
const mod = commands.moderator;
const adm = commands.administrator;
const sup = commands.support;
const dev = commands.dev;

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
  }
]