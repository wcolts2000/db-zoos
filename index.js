const server = require('./api/server');
const PORT = process.env.PORT || 3300;

// sanity check
server.get('/', (req, res) => {
  res.send("api working");
});

server.listen(PORT, function() {
  console.log(`\n=== Web API Listening on http://localhost:${PORT} ===\n`);
});