const { redditClient } = require('./config');

const { checkPredicates, praisePredicates, regularPredicates } = require('./predicates');


// lol tests, I aint getting paid for this
(async () => {

})();


describe('Predicates', () => {
  let lastPosted;
  let initTime;

  beforeEach(() => {
    lastPosted = null;
    initTime = Date.now();
  });

  describe('Regular reply', () => {
    it('expect unrelated comment in the past to have expected result', async () => {
      const comment = redditClient.getComment('epr8mgo');
      const result = await checkPredicates({ initTime, lastPosted, comment }, regularPredicates);
      expect(result.passes).toEqual(false);
      expect(result.details).toEqual([false, true, false, true]);
    });

    it('expect comment by bot to be ignored', async () => {
      const comment = redditClient.getComment('epr8txy');
      const result = await checkPredicates({ initTime, lastPosted, comment }, regularPredicates);
      expect(result.passes).toEqual(false);
      expect(result.details).toEqual([false, false, false, true]);
    });

    it('expect "new" comment to be valid', async () => {
      initTime = 0;
      const comment = redditClient.getComment('epr8txy');
      const result = await checkPredicates({ initTime, lastPosted, comment }, regularPredicates);
      expect(result.passes).toEqual(false);
      expect(result.details).toEqual([false, false, true, true]);
    });

    it('expect cannot post if lastPosted was within the cooldown time', async () => {
      // 10 minutes ago
      lastPosted = Date.now() - 1000 * 10 * 60;
      const comment = redditClient.getComment('epr8txy');
      const result = await checkPredicates({ initTime, lastPosted, comment }, regularPredicates);
      expect(result.passes).toEqual(false);
      expect(result.details).toEqual([false, false, false, false]);
    });

    it('expect can post if lastPosted exists but exceeds cooldown time', async () => {
      // 70 minutes ago
      lastPosted = Date.now() - 1000 * 70 * 60;
      const comment = redditClient.getComment('epr8txy');
      const result = await checkPredicates({ initTime, lastPosted, comment }, regularPredicates);
      expect(result.passes).toEqual(false);
      expect(result.details).toEqual([false, false, false, true]);
    });

    it('detects chrissie', async () => {
      const comment = redditClient.getComment('eprc5ev');
      const result = await checkPredicates({ initTime, lastPosted, comment }, regularPredicates);
      expect(result.passes).toEqual(false);
      expect(result.details).toEqual([true, true, false, true]);
    });

    it('detects Chrissie', async () => {
      const comment = redditClient.getComment('eprcbdy');
      const result = await checkPredicates({ initTime, lastPosted, comment }, regularPredicates);
      expect(result.passes).toEqual(false);
      expect(result.details).toEqual([true, true, false, true]);
    });

    it('detects chrissy', async () => {
      const comment = redditClient.getComment('eprcbsy');
      const result = await checkPredicates({ initTime, lastPosted, comment }, regularPredicates);
      expect(result.passes).toEqual(false);
      expect(result.details).toEqual([true, true, false, true]);
    });
  });

  describe('Praise reply', () => {
    it('detects wakeword "good bot"', async () => {
      const comment = redditClient.getComment('eprdu22');
      const result = await checkPredicates({ initTime, lastPosted, comment }, praisePredicates);
      expect(result.passes).toEqual(false);
      expect(result.details).toEqual([true, false, false]);
    });

    it('detects reply to bot', async () => {
      const comment = redditClient.getComment('epre9wj');
      const result = await checkPredicates({ initTime, lastPosted, comment }, praisePredicates);
      expect(result.passes).toEqual(false);
      expect(result.details).toEqual([true, false, true]);
    });
  });
});
