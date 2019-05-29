require('dotenv').config();

const Snoostorm = require('snoostorm');
const Snoowrap = require('snoowrap');
const randomFuckingQuote = require('./corpus');

// Build Snoowrap and Snoostorm clients
const r = new Snoowrap({
    userAgent: 'node-snoowrap, like Gecko',
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    username: process.env.REDDIT_USERNAME,
    password: process.env.REDDIT_PASSWORD
});
const comments = new Snoostorm.CommentStream(r, { subreddit:"TheExpanse+beltalowda" });

const cooldown = 60*60*1000; // 60 minute cooldown to appease the mods (hopefully)
const initTime = Date.now();
let lastPosted = null;

const predicates = [
    ({ comment }) => ['chrissie', 'chrissy'].some((value) => comment.body.toLowerCase().includes(value)),
    ({ comment }) => comment.author.name !== 'chrissie-bot', // Don't reply to yourself obviously
    ({ comment, initTime }) => Number(comment.created_utc)*1000 > initTime, // Don't grab comments from before bot was started, might reply to comments it has already replied to
    ({ comment, lastPosted }) => lastPosted ? Number(comment.created_utc)*1000 > (lastPosted + cooldown) : true, // if bot has posted before, check we aren't exceeding rate limit
]

const checkPredicates = (opts) => {
    results = predicates.map((predicate)=>predicate(opts));
    console.log(results);
    return results.every((result)=>result);
}

comments.on('item', (comment)=>{
    const predicateOpts = {
        initTime,
        lastPosted,
        comment,
    }
    
    if(checkPredicates(predicateOpts)){
        lastPosted = Date.now();
        console.log('passed all predicates')
        console.log('Chrissie found');
        comment.reply(`${randomFuckingQuote()}\n\n^(I'm a bot with a 1 hour cooldown, please don't push me out an airlock mods [github](https://github.com/jetbooster/chrissie-bot) | contact: [jetbooster](https://reddit.com/u/jetbooster))`)
    }
})
