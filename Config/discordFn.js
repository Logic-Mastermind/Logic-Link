module.exports = {
  MessageSelectOption: class MessageSelectOption {
    constructor(options) {
      var label = null;
      var value = null;
      var desc = null;
      var emoji = null;
      var def = null;
      
      if (options) {
        if (typeof options !== "object") throw new Error(`Expected object, got ${typeof options}`);

        label = options.label;
        value = options.value;
        desc = options.description;
        emoji = options.emoji;
        def = options.default;
      }

      this.label = label;
      this.value = value;
      this.description = desc;
      this.emoji = emoji;
      this.default = def;
      return this;
    }

    setLabel(label) {
      this.label = label;
      return this;
    }

    setValue(value) {
      this.value = value;
      return this;
    }

    setDescription(desc) {
      this.description = desc;
      return this;
    }

    setEmoji(emoji) {
      this.emoji = emoji;
      return this;
    }

    setDefault(def) {
      this.default = def;
      return this;
    }
  },
  splitMessage: (string) => {
    if (!string) return [null];
    return string.match(/[\s\S]{1,1990}/g);
  }
}