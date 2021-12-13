declare interface buttonData {
    label: string,
    style: "PRIMARY" | "SECONDARY" | "SUCCESS" | "DANGER" | "LINK",
    id: string,
    emoji?: string,
    url?: string,
    disabled?: boolean
}

declare interface menuOptions {
    label: string,
    description: string,
    id: string,
    emoji?: string,
    def?: boolean
}

type colors = "RED" | "GREEN" | "BLUE" | "ORANGE" | "DEFAULT";
type RGB = [number, number, number];

declare interface fieldData {
  name: string,
  value: string,
  inline?: boolean
}

declare interface embedData {
  title?: string,
  description: string,
  color?: colors | number | RGB,
  footer?: string[],
  timestamp?: number | null | Date,
  image?: string,
  thumbnail?: string,
  fields?: fieldData[]
}

declare interface commandData {
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

declare interface messageData {
  author: {
    id: string
  },
  channel: {
    id: string
  },
  guild: {
    id: string
  }
}

declare interface errorData {
  name: string,
  message: string,
  stack: string,
  path?: string,
  code?: number | string,
  method?: string,
  httpStatus?: number | string
}

declare interface guildData {
  name: string,
  id: string
}