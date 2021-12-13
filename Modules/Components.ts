import Discord from "discord.js";
import client from "../index";

/** A class with methods that return discord.js interaction components. */
export default class Components {
  client: Discord.Client;

  /**
   * Used to set the client property if it still exists.
   * @constructor
   * @param {import("discord.js").Client} [client] - The client.
   */
  constructor(client?: Discord.Client) {
    if (client) this.client = client;
  }
  
  /**
   * Creates a new discord.js MessageButton and sets properties if they are defined.
   * @function button
   * @param {Object} data - The data of the button.
   * @param {string} data.label - The label of the button.
   * @param {string} data.style - The style of the button.
   * @param {string} data.id - The custom ID of the button.
   * @param {string} [data.emoji] - The emoji to be added to the button.
   * @param {string} [data.url] - The url of the emoji.
   * @param {boolean} [data.disabled] - Whether the button should be disabled.
   * @returns {import("discord.js").MessageButton} The button that was created.
   */
  button(data: buttonData): Discord.MessageButton {
    const { label, style, id, emoji, url, disabled } = data;
    const button = new Discord.MessageButton();

    button.setLabel(label);
    button.setStyle(style);
    button.setCustomId(id);

    if (emoji) button.setEmoji(emoji);
    if (url) button.setURL(url);
    if (disabled) button.setDisabled();

    return button;
  }

  /**
   * Creates a new discord.js MessageActionRow and sets the components.
   * @function actionRow
   * @param {... instanceof import("discord.js").BaseMessageComponent}
   * @returns {import("discord.js").MessageActionRow} The action row containing the components.
   */
  actionRow(...components): Discord.MessageActionRow {
    components = Array.from(components);
    if (components.every(c => c instanceof Discord.BaseMessageComponent)) {
      throw new Error("One or more arguments is not a valid message component.");
    }

    const row = new Discord.MessageActionRow();
    row.addComponents(components);

    return row;
  }

  /**
   * Creates a new discord.js MessageActionRow and sets the components.
   * @function actionRow
   * @param {... instanceof import("discord.js").BaseMessageComponent}
   * @returns {import("discord.js").MessageActionRow} The select menu that was created.
   */
  selectMenu(placeholder: string, options: menuOptions[], id: string, min?: number, max?: number) {
    const optionsArray = [];

    for (const option of options) {
      const { label, description, id, emoji, def } = option;
      optionsArray.push({
        label,
        description,
        id,
        emoji,
        default: def,
      });
    }

    const menu = new Discord.MessageSelectMenu();
    menu.addOptions(optionsArray);
    menu.setCustomId(id);
    menu.setPlaceholder(placeholder);
    
    if (min) menu.setMinValues(min);
    if (max) menu.setMaxValues(max);
    return menu;
  }
}