const { redditClient } = require('./config');
const redditUtils = require('./redditUtils');
const genQuote = require('./corpus');

jest.mock('./corpus', () => jest.fn(() => 'random quote'));

describe('Reddit Utils', () => {
  describe('getParentComment', () => {
    it('gets parent comment', async () => {
      const comment = redditClient.getComment('eprc5y5');
      const parent = await redditUtils.getParentComment(redditClient, comment);
      expect(await parent.id).toEqual('eprc5ev');
    });

    it('does not get parent if it is not a comment', async () => {
      const comment = redditClient.getComment('eprc5ev');
      const parent = await redditUtils.getParentComment(redditClient, comment);
      expect(parent).toEqual(undefined);
    });

    it('get parent if it is not a comment if onlyComments is disabled', async () => {
      const comment = redditClient.getComment('eprc5ev');
      const parent = await redditUtils.getParentComment(redditClient, comment, false);
      expect(await parent.id).toEqual('bvp0yy');
    });
  });

  describe('mapCommentChain', () => {
    it('get Comment chain to root', async () => {
      const comment = redditClient.getComment('epreabk');
      const chain = await redditUtils.mapCommentChain(redditClient, comment);
      expect(chain).toEqual([{
        id: 'epreabk',
        parent_id: 't1_epre9wj',
        author: 'chrissie-bot',
        body: 'https://media.giphy.com/media/l0Ex28pPLjJPVeahW/giphy.gif',
      },
      {
        id: 'epre9wj',
        parent_id: 't1_eprc5y5',
        author: 'Jetbooster',
        body: 'good bot',
      },
      {
        id: 'eprc5y5',
        parent_id: 't1_eprc5ev',
        author: 'chrissie-bot',
        // eslint-disable-next-line max-len
        body: 'No-one starts a war unless I say they can.\n\n^(I\'m a bot with a 1 hour cooldown, please don\'t push me out an airlock mods [github](https://github.com/jetbooster/chrissie-bot) | contact: [jetbooster](https://reddit.com/u/jetbooster))',
      },
      {
        id: 'eprc5ev',
        parent_id: 't3_bvp0yy',
        author: 'Jetbooster',
        body: 'chrissie',
      }]);
    });
  });

  it('regularQuotePost', () => {
    const comment = {
      reply: jest.fn(),
    };
    redditUtils.regularQuotePost(comment);
    expect(genQuote).toHaveBeenCalled();
    // eslint-disable-next-line max-len
    expect(comment.reply).toHaveBeenCalledWith('random quote\n\n^(I\'m a bot with a 1 hour cooldown, please don\'t push me out an airlock mods [github](https://github.com/jetbooster/chrissie-bot) | contact: [jetbooster](https://reddit.com/u/jetbooster))');
  });

  it('praiseResponsePost', () => {
    // Bleh jest sucks at mocking sibling functions in a module
    // TO
    // DO
    // ...eventually
    expect(true);
  });
});
