import fs from "fs";
import Client from "./Models/Client";
import Util from "./Models/Util";
import path from "path";

const client = new Client({
  intents: Util.intents,
  restGlobalRateLimit: 50,
  presence: {
    status: "online",
    afk: false,
    activities: [{
      name: `>help`,
      type: "LISTENING"
    }]
  }
});

console.time("Login");
client.initialize();

fs.readdir(path.resolve(__dirname, `./Events`), async (error, files) => {
  if (error) throw error;

  for (let file of files) {
    const event = await import(path.resolve(__dirname, `./Events/${file}/`));
    const name = file.split(".")[0];
    client.on(name, event.handle);
  }
});

function handleError(error): void {
  if (client.isReady()) client.functions.sendError(error);
  else console.log(error);
}

process.on("unhandledRejection", handleError);
process.on("unhandledException", handleError);
export default client;