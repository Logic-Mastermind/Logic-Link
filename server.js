const app = require("express")();
const fetch = require("node-fetch")
app.get('/', (req, res) => res.send('Server is up.'));

module.exports = () => {
  const server = app.listen(3000);
  setInterval(() => {
    fetch(`https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`)
  }, 5 * 60 * 1000);
  return server;
}