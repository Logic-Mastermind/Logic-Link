import Types from "../Typings/types";
import Discord from "discord.js";
import client from "../index";

/**
 * A class with methods that return discord.js interaction components.
 * @class Components
 */
export default class Components {
  client: Discord.Client;

  /**
   * Used to set the client property if it exists.
   * @constructor
   * @param {Discord.Client} [client] - The client.
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
   * @returns {Discord.MessageButton} The button that was created.
   */
  button(data: Types.buttonData): Discord.MessageButton {
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
   * @param {any[]} components - The components that should be added.
   * @returns {Discord.MessageActionRow} The action row containing the components.
   */
  actionRow(components: any[]): Discord.MessageActionRow {
    components = Array.from(components);
    if (!components.every(c => c instanceof Discord.BaseMessageComponent)) {
      throw new Error("One or more arguments is not a valid message component.");
    }

    const row = new Discord.MessageActionRow();
    row.addComponents(components);

    return row;
  }

  /**
   * Creates a new discord.js MessageActionRow and sets the components.
   * @function selectMenu
   * @param {string} placeholder - The placeholder for the selectMenu.
   * @param {Types.menuItemData[]} items - An array of items in the select menu.
   * @param {string} id - The customId of the select menu.
   * @param {number} [min] - The minimum number of selections.
   * @param {number} [max] - The maximum number of selections.
   * @returns {Discord.MessageSelectMenu} The select menu that was created.
   */
  selectMenu(placeholder: string, items: Types.menuOption[], id: string, min?: number, max?: number): Discord.MessageSelectMenu {
    const itemsArray = [];

    for (const item of items) {
      const { label, description, id, emoji, def } = item;
      itemsArray.push({
        label,
        description,
        id,
        emoji,
        default: def,
      });
    }

    const menu = new Discord.MessageSelectMenu();
    menu.addOptions(itemsArray);
    menu.setCustomId(id);
    menu.setPlaceholder(placeholder);
    
    if (min) menu.setMinValues(min);
    if (max) menu.setMaxValues(max);
    return menu;
  }
}