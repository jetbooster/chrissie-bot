if ( !process.argv[2] || process.argv[2] !== "--started-correctly" ){
  console.log("Use ./start.sh or 'npm start' to start the bot, otherwise old instances of the bot can linger");
  process.exit(1);
}

require('dotenv').config();

const AutoSnoo = require('auto-snoo');
const corpus = require('./corpus');

const snarkyGifs = [
  'https://media.giphy.com/media/l0Ex28pPLjJPVeahW/giphy.gif',
  'https://media.giphy.com/media/l2JJvJovRaKxm8ARq/giphy.gif',
  'https://media.giphy.com/media/wUSp5a128VsMU/giphy.gif',
];

const chrissieBot = AutoSnoo.create({
  snoowrapOpts: {
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    username: process.env.REDDIT_USERNAME,
    password: process.env.REDDIT_PASSWORD,
  },
  subreddits: process.env.SUBREDDIT,
  debug: !!process.env.DEBUG,
  listeners: {
    quote: {
      responseType: 'random',
      corpus,
      triggerPhrase: [
        'chrissie',
        'chrissy',
      ],
    },
    praise: {
      triggerPhrase: 'good bot',
      cooldown: 0,
      responseType: 'function',
      function: async (comment) => {
        const commentChain = await AutoSnoo.getCommentChain(comment);
        const praise = await commentChain.reduce(
          // eslint-disable-next-line max-len
          (praiseCount, basicComment) => (basicComment.body.toLowerCase().includes('good bot') ? praiseCount + 1 : praiseCount), 0,
        );
        const index = Math.min(praise - 1, snarkyGifs.length - 1);
        return snarkyGifs[index];
      },
      customPredicates: [
        // Only reply if the parent to the comment is the bot
        // ie, only accept praise aimed at me
        async (comment) => {
          const commentParent = await AutoSnoo.getParentComment(comment);
          if (!commentParent) {
            // commentParent will be false if top level comment
            return false;
          }
          const parentAuthor = await commentParent.author.name;
          console.log(parentAuthor);
          return (await commentParent.author.name) === 'chrissie-bot';
        },
      ],
    },
  },
});

chrissieBot.listen();

console.log(`Initialised. Listening on ${process.env.SUBREDDIT}`);
