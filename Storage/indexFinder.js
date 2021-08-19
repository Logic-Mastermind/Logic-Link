function removeItem(array, item){
  for (var i in array) {
    if(array[i] == item) {
      array.splice(i, 1);
      break;
    }
  }
}

var modArray = ["banCommand", "kickCommand", "muteCommand", "purgeCommand", "unmuteCommand"];
const findIndexBan = (element) => element == "banCommand";
const findIndexUnmute = (element) => element == "unmuteCommand";
const findIndexPurge = (element) => element == "purgeCommand";
const findIndexMute = (element) => element == "muteCommand";
const findIndexKick = (element) => element == "kickCommand";

var banIndex = modArray.findIndex(findIndexBan)
var unmuteIndex = modArray.findIndex(findIndexUnmute)
var purgeIndex = modArray.findIndex(findIndexPurge)
var muteIndex = modArray.findIndex(findIndexMute)
var kickIndex = modArray.findIndex(findIndexKick)

if (!message.member.hasPermission("BAN_MEMBERS")) {
  banIndex = modArray.findIndex(findIndexBan)
  modArray.splice(banIndex, 1)
}

if (!message.member.hasPermission("KICK_MEMBERS")) {
  kickIndex = modArray.findIndex(findIndexKick)
  modArray.splice(kickIndex, 1)
}

if (!message.member.hasPermission("MANAGE_CHANNELS")) {
  muteIndex = modArray.findIndex(findIndexMute)
  modArray.splice(muteIndex, 1)

  unmuteIndex = modArray.findIndex(findIndexUnmute)
  modArray.splice(unmuteIndex, 1)
}

if (!message.member.hasPermission("MANAGE_MESSAGES")) {
  purgeIndex = modArray.findIndex(findIndexPurge)
  modArray.splice(purgeIndex, 1)
}