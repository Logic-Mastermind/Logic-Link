import Discord from "discord.js";

declare namespace Types {
  type embedColors = "RED" | "GREEN" | "BLUE" | "ORANGE" | "DEFAULT";
  type RGBOptions = [number, number, number];

  export interface buttonData {
    label: string,
    style: "PRIMARY" | "SECONDARY" | "SUCCESS" | "DANGER" | "LINK",
    id: string,
    emoji?: string,
    url?: string,
    disabled?: boolean
  }

  export interface panelData {

  }

  export interface guildSettings {
    prefix: string,
    modRole: string | null,
    adminRole: string | null,
    logChannel: string | null,
    welcomeChannel: string | null,
    welcomeRole: string | null,
    welcomeMsg: string | null,
    mutedRole: string | null,
    welcomeSystem: boolean,
    mutedRoleConfig: boolean,
    panelSetup: boolean,
    cases: cases,

    modRoleObj: Discord.Role | undefined,
    adminRoleObj: Discord.Role | undefined,
    logChannelObj: Discord.GuildChannel | undefined,
    welcomeChannelObj: Discord.GuildChannel | undefined,
    welcomeRoleObj: Discord.Role | undefined,
    mutedRoleObj: Discord.Role | undefined
  }

  export interface paginateOptions {
    filter: Function,
    idle: number
  }

  export type caseTypes = "BAN" | "KICK" | "MUTE" | "UNBAN" | "UNMUTE" | "WARN";
  export type cases = Discord.Collection<number, caseData>;
  export type chalkOptions = "bold" | "dim" | "italic" | "underline" | "inverse" | "strikethrough" | "red" | "green" | "yellow" | "blue" | "magenta" | "cyan" | "white" | "gray" | "bgBlack" | "bgRed" | "bgGreen" | "bgYellow" | "bgBlue" | "bgMagenta" | "bgCyan" | "bgWhite"

  export interface caseData {
    type: caseTypes,
    user: string,
    moderator: string,
    reason: string,
    timestamp: number
  }

  export interface caseDataFilter {
    type?: caseTypes,
    user?: string,
    moderator?: string,
    reason?: string,
    timestamp?: number
    when?: "BEFORE" | "AFTER"
  }

  export interface args {
    secArg: string,
    thirdArg: string,
    fourthArg: string,
    fifthArg: string
  }

  export interface ticketData {
    settings: {
      dmUsers: boolean
    },
    panels: Discord.Collection<number, panelData>
  }

  export interface menuOption {
    label: string,
    description: string,
    id: string,
    emoji: string,
    def: boolean
  }

  export interface helpCategoryData {
    
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
    color?: embedColors | number,
    footer?: [string, string],
    timestamp?: number | null | Date,
    image?: string,
    thumbnail?: string,
    fields?: fieldData[]
  }

  export interface timeData {
    passed: boolean,
    digit: number,
    duration: number,
    display: string,
    unit: string
  }

  export interface menuItemData {
    label: string,
    description: string,
    id: string,
    emoji?: string,
    def?: boolean
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
  }

  export interface itemFilterOptions {
    safe?: boolean,
    filter?: Function
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