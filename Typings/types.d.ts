import Discord from "discord.js";

declare namespace Types {
  type embedColors = "RED" | "GREEN" | "BLUE" | "ORANGE" | "DEFAULT";
  type RGBOptions = [number, number, number];

  export type guildChannel = Discord.GuildChannel | Discord.ThreadChannel;
  export type anyGuildSetting = string | guildChannel | Discord.Role | null | boolean | Discord.Collection<number, caseData>;

  export interface buttonData {
    label: string,
    style: "PRIMARY" | "SECONDARY" | "SUCCESS" | "DANGER" | "LINK",
    id: string,
    emoji?: string,
    url?: string,
    disabled?: boolean
  }

  export interface caseData {
    id?: number,
    type: "BAN" | "KICK" | "MUTE" | "UNBAN" | "UNMUTE" | "WARN",
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
    permissions: string[],
    clientPerms: string[],
    cooldown: number,
    minArgs: number,
    options: string[],
    aliases: string[],
    usage: string,
    category: string,
    commandName: string
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