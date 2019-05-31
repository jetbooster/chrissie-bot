const { redditClient, debug, initTime } = require('./config');

const Snoostorm = require('snoostorm');
const randomFuckingQuote = require('./corpus');
const { repeatPraise } = require('./redditUtils');
const { checkPredicates, praisePredicates, regularPredicates } = require('./predicates')

let lastPosted = null;

const comments = new Snoostorm.CommentStream(redditClient, { subreddit: process.env.SUBREDDIT, after: 'epn09fn1' });
comments.on('item', async (comment) => {
    const predicateOpts = {
        initTime,
        lastPosted,
        comment,
    }
    
    // Should I respond with a quote?
    if(await checkPredicates(predicateOpts, regularPredicates)){
        lastPosted = Date.now();
        if (debug){
            console.log('passed all predicates')
        }
        console.log(`Chrissie found: ${comment.body}`);
	    const motherfuckingQuote = randomFuckingQuote();
	    console.log(`Responding with: ${motherfuckingQuote}`);
        comment.reply(`${motherfuckingQuote}\n\n^(I'm a bot with a 1 hour cooldown, please don't push me out an airlock mods [github](https://github.com/jetbooster/chrissie-bot) | contact: [jetbooster](https://reddit.com/u/jetbooster))`)
    }

    // Should I snarkily accept headpats?
    if(await checkPredicates(predicateOpts, praisePredicates)){
        const praiseNum = await repeatPraise(redditClient, comment)
        if (debug){
            console.log('responding to praise', praiseNum)
        }
        snarkyGifs = [
            'https://media.giphy.com/media/l0Ex28pPLjJPVeahW/giphy.gif',
            'https://media.giphy.com/media/l2JJvJovRaKxm8ARq/giphy.gif',
            'https://media.giphy.com/media/wUSp5a128VsMU/giphy.gif',
        ]
        comment.reply(snarkyGifs[Math.min(praiseNum-1,snarkyGifs.length-1)])
    }
})

console.log(`Initialised. Listening on ${process.env.SUBREDDIT}`)



