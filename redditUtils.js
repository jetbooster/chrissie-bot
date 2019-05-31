const Snoowrap = require('snoowrap');

/**
 * Take a comment and recursively build a simple object for all it's parents up to the top of the thread
 * @param {Snoowrap} r Snoowrap instance to use for retrieving comments
 * @param {Snoowrap.Comment} comment 
 * @param {Array} array comments found so far
 * @return {Array}
 */
const mapCommentChain = async (r, comment, array=[]) => {
    const basicComment = await {
        id: await comment.id,
        parent_id: await comment.parent_id,
        author: await comment.author.name,
        body: await comment.body,
    }

    array.push(basicComment);
    
    const parent = await getParentComment(r, comment);
    if (parent){
        return mapCommentChain(r, parent, array);
    } else {
        return array;
    }
}

/**
 * Obtain a comment's parent
 * @param {Snoowrap} r Snoowrap instance to use for retrieving comments
 * @param {Snoowrap.Comment} comment
 * @param {boolean} [onlyComments=true]
 * @return {Snoowrap.Comment} a snoowrap comment
 */
const getParentComment = async (r, comment, onlyComments=true) => {
    const parent_id = await comment.parent_id;
    if (onlyComments && !parent_id.startsWith('t1')){
        // Only want comments, parent is not a comment
        return undefined;
    } else {
        const parentComment = await r.getComment(parent_id);
        if (process.env.debug){
            console.log(parentComment)
        }
        return parentComment;
    }

}

/**
 * Get increasingly snarky as number of repeat 'good bot's in a chain increase
 * @param {*} r 
 * @param {*} comment
 * @return {number}
 */
const repeatPraise = async (r, comment) => (await mapCommentChain(r, comment)).reduce((praiseCount, basicComment)=>basicComment.body.includes('good bot')?praiseCount+=1:praiseCount,0)

module.exports = {
    mapCommentChain,
    getParentComment,
    repeatPraise,
}