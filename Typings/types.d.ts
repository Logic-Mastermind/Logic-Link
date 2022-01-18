import Discord, { Intents } from "discord.js";

declare namespace Types {
  export type embedColors = "RED" | "GREEN" | "BLUE" | "ORANGE" | "DEFAULT";
  export type caseTypes = "BAN" | "KICK" | "MUTE" | "UNBAN" | "UNMUTE" | "WARN";
  export type RGBOptions = [number, number, number];

  export type guildChannels = Discord.GuildChannel | Discord.ThreadChannel;
  export type caseCollection = Discord.Collection<number, caseData>;
  export type guildTextChannels = Discord.TextChannel | Discord.ThreadChannel | Discord.NewsChannel;
  export type anyGuildSetting = string | guildChannels | Discord.Role | null | boolean | caseCollection;
  export type chalkOptions = "bold" | "dim" | "italic" | "underline" | "inverse" | "strikethrough" | "red" | "green" | "yellow" | "blue" | "magenta" | "cyan" | "white" | "gray" | "bgBlack" | "bgRed" | "bgGreen" | "bgYellow" | "bgBlue" | "bgMagenta" | "bgCyan" | "bgWhite";

  export type permissionString =
  'CREATE_INSTANT_INVITE'
  | 'KICK_MEMBERS'
  | 'BAN_MEMBERS'
  | 'ADMINISTRATOR'
  | 'MANAGE_CHANNELS'
  | 'MANAGE_GUILD'
  | 'ADD_REACTIONS'
  | 'VIEW_AUDIT_LOG'
  | 'PRIORITY_SPEAKER'
  | 'STREAM'
  | 'VIEW_CHANNEL'
  | 'SEND_MESSAGES'
  | 'SEND_TTS_MESSAGES'
  | 'MANAGE_MESSAGES'
  | 'EMBED_LINKS'
  | 'ATTACH_FILES'
  | 'READ_MESSAGE_HISTORY'
  | 'MENTION_EVERYONE'
  | 'USE_EXTERNAL_EMOJIS'
  | 'VIEW_GUILD_INSIGHTS'
  | 'CONNECT'
  | 'SPEAK'
  | 'MUTE_MEMBERS'
  | 'DEAFEN_MEMBERS'
  | 'MOVE_MEMBERS'
  | 'USE_VAD'
  | 'CHANGE_NICKNAME'
  | 'MANAGE_NICKNAMES'
  | 'MANAGE_ROLES'
  | 'MANAGE_WEBHOOKS'
  | 'MANAGE_EMOJIS_AND_STICKERS'
  | 'USE_APPLICATION_COMMANDS'
  | 'REQUEST_TO_SPEAK'
  | 'MANAGE_THREADS'
  | 'USE_PUBLIC_THREADS'
  | 'USE_PRIVATE_THREADS'
  | 'USE_EXTERNAL_STICKERS';

  export interface buttonData {
    label: string,
    style: "PRIMARY" | "SECONDARY" | "SUCCESS" | "DANGER" | "LINK",
    id: string,
    emoji?: string,
    url?: string,
    disabled?: boolean
  }

  export interface caseFilter {
    type: caseTypes,
    user: string,
    moderator: string,
    reason: string,
    timestamp: number
    when: "BEFORE" | "AFTER"
  }

  export interface memoryUsage {
    rss?: number,
    heapTotal?: number,
    heapUsed?: number,
    external?: number,
    arrayBuffers?: number
  }

  export interface caseData {
    id?: number,
    type: caseTypes,
    user: string,
    moderator: string,
    reason: string,
    timestamp: number
  }

  export interface selectMenuData {
    label: string,
    description: string,
    id: string,
    emoji?: string,
    def?: boolean
  }

  export interface fieldData {
    name: string,
    value: string,
    inline?: boolean
  }

  export interface embedData {
    title?: string,
    description: string,
    color?: embedColors,
    footer?: [string, string],
    timestamp?: number | null | Date,
    image?: string,
    thumbnail?: string,
    fields?: fieldData[]
  }

  export interface menuItemData {
    label: string,
    description: string,
    id: string,
    emoji?: string,
    def?: boolean
  }

  export interface guildSettings {
    prefix: string,
    modRole: string,
    adminRole: string,
    logChannel: string,
    welcomeChannel: string,
    welcomeRole: string,
    welcomeMsg: string,
    mutedRole: string,
    welcomeSystem: boolean,
    mutedRoleConfig: boolean,
    panelSetup: boolean,
    cases: Discord.Collection<number, caseData>,

    modRoleObj: Discord.Role,
    adminRoleObj: Discord.Role,
    logChannelObj: Discord.GuildChannel,
    welcomeChannelObj: Discord.GuildChannel,
    welcomeRoleObj: Discord.Role,
    mutedRoleObj: Discord.Role
  }

  export interface commandData {
    name: string,
    description: string,
    permissions: permissionString[],
    clientPerms: permissionString[],
    cooldown: number,
    minArgs: number,
    options: string[],
    aliases: string[],
    usage: string,
    commandName: string
    category: "Administrator" | "Developer" | "General" | "Moderator" | "Support" | "Ticket",
    subCategory?: "Basic" | "Support" | "Administrator",
    option?: empty
  }

  export interface timeData {
    passed: boolean,
    digit: number,
    duration: number | null,
    display: string,
    unit: string
  }

  export interface ticketSettings {
    settings: {
      dmUsers: boolean
    },
    panels: Discord.Collection<number, panelData>
  }

  export interface panelData {
    name: string,
    opened: string,
    closed: string,
    claiming: boolean,
    support: string[],
    additional: string[],
    channel: string,
    createdAt: string,
    createdBy: string,
    tickets: Discord.Collection<number, ticketData>,
    totalTicketCount: number,
    ticketLimit: number,
    claimed: string,
    ticket: string,
    panelMessage: string | null,
    ticketMessage: string | null,
    id: number,
    msg: string
  }

  export interface ticketData {
    id: number,
    channel: string,
    opener: string,
    claimer: string | null,
    timestamp: number
  }

  export interface args {
    secArg: string,
    thirdArg: string,
    fourthArg: string,
    fifthArg: string,
  }

  export interface collectorOptions {
    filter?: Function,
    idle?: number
  }

  export interface itemFilterOptions {
    safe?: boolean,
    searchFilter?: Function
  }

  export interface errorData {
    name: string,
    message: string,
    stack: string,
    path?: string,
    code?: number | string,
    method?: string,
    httpStatus?: number | string
  }

  export interface empty {
    [key: string]: any
  }
}

export default Types;