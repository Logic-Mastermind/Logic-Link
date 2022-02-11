import express from "express";
import fetch from "node-fetch";
const app = express();

app.get('/', (req, res) => res.send('Server is up.'));
export default function server() {
  const server = app.listen(3000);
  setInterval(() => {
    fetch(`https://Logic-Link-Beta.logicmastermind.repl.co`);
  }, 5 * 60 * 1000);
  
  return server;
}