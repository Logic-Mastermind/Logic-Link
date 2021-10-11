const Discord = require("discord.js");

module.exports = class Buttons {
  constructor(client) {
    this.client = client;
  }

  new(label, style, id, emoji, url, disabled) {
    const button = new Discord.MessageButton();
    if (label) button.setLabel(label);
    if (style) button.setStyle(style);
    if (id) button.setCustomId(id);
    if (emoji) button.setEmoji(emoji);
    if (url) button.setURL(url);
    if (disabled) button.setDisabled();

    return button;
  }

  accept(id) {
    const button = new Discord.MessageButton();
    button.setLabel("Accept");
    button.setStyle("SUCCESS");
    button.setCustomId(id);

    return button;
  }

  decline(id) {
    const button = new Discord.MessageButton();
    button.setLabel("Decline");
    button.setStyle("DANGER");
    button.setCustomId(id);
    
    return button;
  }

  confirm(id) {
    const button = new Discord.MessageButton();
    button.setLabel("Confirm");
    button.setStyle("SUCCESS");
    button.setCustomId(id);

    return button;
  }

  cancel(id) {
    const button = new Discord.MessageButton();
    button.setLabel("Cancel");
    button.setStyle("DANGER");
    button.setCustomId(id);
    
    return button;
  }

  grey(text, id, disabled) {
    const button = new Discord.MessageButton();
    button.setLabel(text);
    button.setStyle("SECONDARY");
    button.setCustomId(id);
    if (disabled) button.setDisabled(true);
    
    return button;
  }

  green(text, id, disabled) {
    const button = new Discord.MessageButton();
    button.setLabel(text);
    button.setStyle("SUCCESS");
    button.setCustomId(id);
    if (disabled) button.setDisabled(true);
    
    return button;
  }

  emoji(id, emoji, style) {
    const button = new Discord.MessageButton();
    button.setLabel("");
    button.setEmoji(emoji)
    button.setStyle(style);
    button.setCustomId(id);
    
    return button;
  }

  actionRow(components) {
    const row = new Discord.MessageActionRow();
    row.addComponents(components);

    return row;
  }

  async selectMenu(placeholder, options, id, min, max) {
    if (!placeholder) throw new Error("Select menu placeholder is required");
    if (!options) throw new Error("Select menu options is required");
    if (!Array.isArray(options)) throw new TypeError("Select menu options is not an array");
    const optionsArray = [];

    if (options) {
      for await (const option of options) {
        if (typeof option !== "object") throw new Error(`Expected object, got ${typeof option}`);
        
        const { label, value, id, emoji, def } = option;
        const menuOption = new Discord.MessageSelectOption();
        if (emoji) menuOption.setEmoji(emoji);
        if (def) menuOption.setDefault(def);

        menuOption.setValue(id);
        menuOption.setLabel(label);
        menuOption.setDescription(value);
        optionsArray.push(menuOption);
      }
    }

    const menu = new Discord.MessageSelectMenu();
    if (options) menu.addOptions(optionsArray);
    if (id) menu.setCustomId(id);
    menu.setPlaceholder(placeholder);
    menu.setMinValues(min);
    menu.setMaxValues(max);

    return menu;
  }
}