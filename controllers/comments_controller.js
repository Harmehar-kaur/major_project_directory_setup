const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.create = async function (req, res) {
    try {
        const post = await Post.findById(req.body.post).exec();
        
        if (post) {
            const comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            });

            post.comment.push(comment);
            await post.save();

            res.redirect('/');
        }
    } catch (err) {
        console.log('Error in creating the comment', err);
        // Handle the error here
        res.status(500).json({ error: 'An error occurred' });
    }
}


module.exports.destroy = async function(req,res){

    try{
     let comment = await Comment.findById(req.params.id).exec(); 
    
     if(comment.user == req.user.id){
        const postId = comment.post;
        await comment.remove();
        
        const post = Post.findByIdAndUpdate(postId, {$pull : {comments: req.params.id}}).exec()

        if (post){
            return res.redirect('back');
        }
        else {
            // Handle the case where the post was not found
            res.status(404).send('Post not found');
        }
     } else {
        return res.redirect('back');
     }
    } catch (err) {
    console.error('Error in deleting the comment', err);
    // Handle the error here
    res.status(500).json({ error: 'An error occurred' });   
    }
}