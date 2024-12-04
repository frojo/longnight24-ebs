import express from "express";

const PORT = 8000;

const server = express();

server.get('/', (req, res) => {
    res.send("EBS server!");
});

server.get('/ping', (req, res) => {
    res.send("OK");
});

server.post('/send', (req, res) => {
    res.send("OK");
});

server.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`);
  });
