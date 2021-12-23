import express from "express";
import fetch from "node-fetch";
const app = express();

app.get('/', (req, res) => res.send('Server is up.'));
export default function server() {
  const server = app.listen(3000);
  setInterval(() => {
    fetch(`${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`)
  }, 5 * 60 * 1000);
  return server;
}