const Discord = require("discord.js");
const Buttons = require("discord-buttons");
const Prefix = require("discord-prefix");
const Reply = require("discord-reply");
const code = "```"

module.exports = {
  new: (label, style, id, emoji, url, disabled) => {
    const button = new Buttons.MessageButton();
    if (label) button.setLabel(label);
    if (style) button.setStyle(style);
    if (id) button.setID(id);
    if (emoji) button.setEmoji(emoji);
    if (url) button.setURL(url);
    if (disabled == true) button.setDisabled();

    return button
  },
  accept: (id) => {
    const button = new Buttons.MessageButton();
    button.setLabel("Accept");
    button.setStyle("green");
    button.setID(id);

    return button
  },
  decline: (id) => {
    const button = new Buttons.MessageButton();
    button.setLabel("Decline");
    button.setStyle("red");
    button.setID(id);
    
    return button
  },
  grey: (text, id) => {
    const button = new Buttons.MessageButton();
    button.setLabel(text);
    button.setStyle("grey");
    button.setID(id);
    
    return button
  },
  emoji: (id, emoji, style) => {
    const button = new Buttons.MessageButton();
    button.setLabel("");
    button.setEmoji(emoji)
    button.setStyle(style);
    button.setID(id);
    
    return button
  },
}