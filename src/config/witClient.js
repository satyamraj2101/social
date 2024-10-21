// config/witClient.js
const { Wit } = require('node-wit');

const witClient = new Wit({
    accessToken: process.env.WIT_AI_TOKEN,
});

module.exports = witClient;