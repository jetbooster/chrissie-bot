require('dotenv').config();

const Snoowrap = require('snoowrap');

// Build Snoowrap and Snoostorm clients
const redditClient = new Snoowrap({
  userAgent: 'node-snoowrap, like Gecko',
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  username: process.env.REDDIT_USERNAME,
  password: process.env.REDDIT_PASSWORD,
});

const debug = process.env.DEBUG === 'true';
const cooldown = 60 * 10 * 1000; // 10 minute cooldown to appease the mods (hopefully)
const initTime = Date.now();

module.exports = {
  redditClient,
  debug,
  cooldown,
  initTime,
};
