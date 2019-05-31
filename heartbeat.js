const { redditClient } = require('./config')

const comments = new Snoostorm.CommentStream(redditClient, { subreddit: process.env.SUBREDDIT, after: "t1_epdmj6m" });

// Simple file for watching the comment stream that Chrissie is seeing to ensure she's not missing anything.
comments.on('item', async (comment)=>{
    //console.log(`${comment.author.name}: ${comment.body}`);
    console.log(`${comment.parent_id} -> ${comment.id}: ${comment.body}`)
    parentComment = await r.getComment(comment.parent_id)
    console.log(`${await parentComment.id}: ${await parentComment.body}`);    
})
