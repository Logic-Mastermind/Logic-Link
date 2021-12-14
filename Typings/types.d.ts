namespace Types {
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

  export interface errorData {
    name: string,
    message: string,
    stack: string,
    path?: string,
    code?: number | string,
    method?: string,
    httpStatus?: number | string
  }

  export interface optional {
    [key: string]: any
  }
}

export default APIComponents;