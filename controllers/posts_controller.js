const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.create = async function (req, res) {
    try {
        const post = await Post.create({
            content: req.body.content,
            user: req.user._id
        });

        if (!post) {
            console.log("Error in creating the post");
            // Handle the error here
            return res.status(500).json({ error: 'An error occurred' });
        }

        return res.redirect('back');
    } catch (err) {
        console.error('Error in creating the post', err);
        // Handle the error here
        return res.status(500).json({ error: 'An error occurred' });
    }
};

module.exports.destroy = async function (req, res) {
    try {
        const post = await Post.findById(req.params.id).exec();

        if (!post) {
            // Handle the case where the post was not found
            return res.status(404).send('Post not found');
        }

        if (post.user.toString() === req.user._id.toString()) {
            await post.remove();

            await Comment.deleteMany({ post: req.params.id });

            return res.redirect('back');
        } else {
            return res.redirect('back');
        }
    } catch (err) {
        console.error('Error in deleting the post', err);
        // Handle the error here
        return res.status(500).json({ error: 'An error occurred' });
    }
};
