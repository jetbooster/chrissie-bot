const randomFuckingQuote = require('./corpus');

/**
 * Obtain a comment's parent
 * @param {Snoowrap} r Snoowrap instance to use for retrieving comments
 * @param {Snoowrap.Comment} comment
 * @param {boolean} [onlyComments=true]
 * @return {Snoowrap.Comment} a snoowrap comment
 */
const getParentComment = async (r, comment, onlyComments = true) => {
  const parentId = await comment.parent_id;
  if (onlyComments && !parentId.startsWith('t1')) {
    // Only want comments, parent is not a comment
    return undefined;
  }
  const parentComment = await r.getComment(parentId);
  if (process.env.DEBUG) {
    console.log(parentComment);
  }
  return parentComment;
};

/**
 * Take a comment and recursively build a simple object for all it's parents up to the top of the thread
 * @param {Snoowrap} r Snoowrap instance to use for retrieving comments
 * @param {Snoowrap.Comment} comment
 * @param {Array} array comments found so far
 * @return {Array}
 */
const mapCommentChain = async (r, comment, array = []) => {
  const basicComment = await {
    id: await comment.id,
    parent_id: await comment.parent_id,
    author: await comment.author.name,
    body: await comment.body,
  };

  array.push(basicComment);

  const parent = await getParentComment(r, comment);
  if (parent) {
    return mapCommentChain(r, parent, array);
  }
  return array;
};


// Issue: counts all "good bot"'s in a chain even if they aren't in response to chrissie. Likely not too much of a problem as there are few other bots on TheExpanse
/**
 * Get number of good bots in comment chain
 * @param {Snoowrap} r
 * @param {Snoowrap.Comment} comment
 * @return {number}
 */
// eslint is just jealous of my codegolf
// eslint-disable-next-line max-len
const repeatPraise = async (r, comment) => (await mapCommentChain(r, comment)).reduce((praiseCount, basicComment) => (basicComment.body.includes('good bot') ? praiseCount + 1 : praiseCount), 0);


const regularQuotePost = async (comment) => {
  console.log(`Chrissie found: ${comment.body}`);
  const motherfuckingQuote = randomFuckingQuote();
  console.log(`Responding with: ${motherfuckingQuote}`);
  // eslint-disable-next-line max-len
  const footer = "^(I'm a bot with a 10 minute cooldown, please don't push me out an airlock mods [github](https://github.com/jetbooster/chrissie-bot) | contact: [jetbooster](https://reddit.com/u/jetbooster))";
  comment.reply(`${motherfuckingQuote}\n\n${footer}`);
};

/**
 * Get increasingly snarky as number of repeat 'good bot's in a chain increase
 * @param {Snoowrap} r
 * @param {Snoowrap.Comment} comment
 * @param {boolean} debug debug mode toggle
 */
const praiseResponsePost = async (r, comment, debug) => {
  const praiseNum = await repeatPraise(r, comment);
  if (debug) {
    console.log('responding to praise, depth:', praiseNum);
  }
  const snarkyGifs = [
    'https://media.giphy.com/media/l0Ex28pPLjJPVeahW/giphy.gif',
    'https://media.giphy.com/media/l2JJvJovRaKxm8ARq/giphy.gif',
    'https://media.giphy.com/media/wUSp5a128VsMU/giphy.gif',
  ];
  comment.reply(snarkyGifs[Math.min(praiseNum - 1, snarkyGifs.length - 1)]);
};

module.exports = {
  mapCommentChain,
  getParentComment,
  repeatPraise,
  regularQuotePost,
  praiseResponsePost,
};
