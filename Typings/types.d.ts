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

  export interface caseData {
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
    color?: embedColors | number | embedColors,
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
    cases: Discord.Collection,

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
  }

  export interface timeData {
    passed: boolean,
    digit: number,
    duration: number | null,
    display: string,
    unit: string
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