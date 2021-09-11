const Discord = require("discord.js");
const Buttons = require("discord-buttons");

module.exports = class MessageButtons {
  constructor(client) {
    this.client = client;
  }

  new(label, style, id, emoji, url, disabled) {
    const button = new Buttons.MessageButton();
    if (label) button.setLabel(label);
    if (style) button.setStyle(style);
    if (id) button.setID(id);
    if (emoji) button.setEmoji(emoji);
    if (url) button.setURL(url);
    if (disabled == true) button.setDisabled();

    return button
  }

  accept(id) {
    const button = new Buttons.MessageButton();
    button.setLabel("Accept");
    button.setStyle("green");
    button.setID(id);

    return button
  }

  decline(id) {
    const button = new Buttons.MessageButton();
    button.setLabel("Decline");
    button.setStyle("red");
    button.setID(id);
    
    return button
  }

  confirm(id) {
    const button = new Buttons.MessageButton();
    button.setLabel("Confirm");
    button.setStyle("green");
    button.setID(id);

    return button
  }

  cancel(id) {
    const button = new Buttons.MessageButton();
    button.setLabel("Cancel");
    button.setStyle("red");
    button.setID(id);
    
    return button
  }

  grey(text, id) {
    const button = new Buttons.MessageButton();
    button.setLabel(text);
    button.setStyle("grey");
    button.setID(id);
    
    return button
  }

  emoji(id, emoji, style) {
    const button = new Buttons.MessageButton();
    button.setLabel("");
    button.setEmoji(emoji)
    button.setStyle(style);
    button.setID(id);
    
    return button
  }

  async selectMenu(placeholder, options, id, min, max) {
    const optionsArray = [];

    if (options) {
      for await (const option of options) {
        const { label, value, id, emoji, def } = option;
        const menuOption = new Buttons.MessageMenuOption();
        if (emoji) menuOption.setEmoji(emoji);
        if (def) menuOption.setDefault(def);

        menuOption.setValue(id);
        menuOption.setLabel(label);
        menuOption.setDescription(value);
        optionsArray.push(menuOption);
      }
    }

    const menu = new Buttons.MessageMenu();
    if (options) menu.addOptions(optionsArray);
    if (id) menu.setID(id);
    menu.setPlaceholder(placeholder);
    menu.setMinValues(min);
    menu.setMaxValues(max);

    return menu;
  }
}