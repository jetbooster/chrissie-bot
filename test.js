const {redditClient} = require('./config');

const {checkPredicates, praisePredicates, regularPredicates} = require('./predicates');


// lol tests, I aint getting paid for this
(async ()=>{
    const comment = redditClient.getComment('epo93ce');
    
    const result = await checkPredicates({initTime,lastPosted,comment}, praisePredicates);
    console.log(result);
})();