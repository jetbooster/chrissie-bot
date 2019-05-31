const { getParentComment } = require('./redditUtils');
const { redditClient, debug, cooldown } = require('./config');

// Snoostorm written before async await makes all of this horrible
const containsWakeword = async ({ comment }) => {
    const commentBody = await comment.body;
    return ['chrissie', 'chrissy'].some((value)=>commentBody.toLowerCase().includes(value)); 
}
const containsPraise = async ({ comment }) => {
    const commentBody = await comment.body;
    return ['good bot'].some((value)=>commentBody.toLowerCase().includes(value));
}
const notSelfReply = async ({ comment }) => (await comment.author.name) !== 'chrissie-bot' // Don't reply to yourself obviously
const notPast = async ({ comment, initTime }) => Number(await comment.created_utc)*1000 > initTime // Don't grab comments from before bot was started, might reply to comments it has already replied to
const withinRatelimit = async ({ comment, lastPosted }) => lastPosted ? Number(await comment.created_utc)*1000 > (lastPosted + cooldown) : true // if bot has posted before, check we aren't exceeding rate limit

const inReplyToMe = (r) => async ({ comment }) => {
    const parent = await getParentComment(r,comment);
    if (parent){
        return (await parent.author.name) == 'chrissie-bot';
    }
    return false;
}

// Predicates for responding with an a quote
const regularPredicates = [
    containsWakeword,
    notSelfReply,
    notPast,
    withinRatelimit,
]

// Predicates for accepting head pats
const praisePredicates = [
    containsPraise,
    notPast,
    inReplyToMe(redditClient),
    // no rate limit for praise, as user is obviously intentionally interacting with bot
]

// iterate through all provided predicates and return true if all are true, otherwise false
const checkPredicates = async (opts, predicates) => {
    // assume all predicates might by async
    results = await Promise.all(predicates.map(async (predicate) => await predicate(opts)));
    if(debug){
        console.log(results);
    }
    return results.every((result) => result);
}

module.exports = {
    checkPredicates,
    regularPredicates,
    praisePredicates,
}