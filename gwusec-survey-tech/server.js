'use strict';

const express = require('express');

// Constants
const PORT = 80;
const HOST = '0.0.0.0';

// App
const app = express();
app.use(express.static("dist/gwusec-survey-tech"));

app.get('*', (req, res) => {
    res.sendFile(__dirname+'/dist/gwusec-survey-tech/index.html');
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
