const Snoostorm = require('snoostorm');

const { redditClient, debug, initTime } = require('./config');
const { regularQuotePost, praiseResponsePost } = require('./redditUtils');
const { checkPredicates, praisePredicates, regularPredicates } = require('./predicates');

let lastPosted = null;

const comments = new Snoostorm.CommentStream(redditClient, { subreddit: process.env.SUBREDDIT, after: 'epn09fn1' });
comments.on('item', async (comment) => {
  const predicateOpts = {
    initTime,
    lastPosted,
    comment,
  };

  // Should I respond with a quote?
  const shouldRegularReply = await checkPredicates(predicateOpts, regularPredicates);
  if (await shouldRegularReply.passes) {
    try {
      regularQuotePost(comment, debug);
      lastPosted = Date.now();
    } catch (e) {
      // This is someone elses problem
      throw e;
    }
  }

  // Should I snarkily accept headpats?
  const shouldPraiseReply = await checkPredicates(predicateOpts, praisePredicates);
  if (shouldPraiseReply.passes) {
    praiseResponsePost(redditClient, comment, debug);
  }
});

console.log(`Initialised. Listening on ${process.env.SUBREDDIT}`);
