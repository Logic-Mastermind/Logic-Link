import fs from "fs";
import Client from "./Structures/Client";
import Util from "./Structures/Util";
import server from "./server";

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
client.server = server();

fs.readdir("./Events/", async (error, files) => {
  if (error) throw error;

  for (let file of files) {
    const event = await import(`./Events/${file}`);
    const bound = event.bind(null, client);
    const name = file.split(".")[0];
    client.on(name, bound);
  }
});

function handleError(error) {
  if (client.isReady()) client.functions.sendError(error);
  else console.log(error);
}

process.on("unhandledRejection", handleError);
process.on("unhandledException", handleError);

client.login(client.config.token);
export default client;