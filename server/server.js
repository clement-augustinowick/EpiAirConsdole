require('dotenv').config();
const express = require('express');
const http = require('http');
const path = require('path');

const port = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app);

app.use(express.static(path.join(__dirname, '../public')));

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
})
