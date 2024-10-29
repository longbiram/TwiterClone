import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import { v2 as cloudinary } from "cloudinary";

// Create Post
export const createPost = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        const { text } = req.body;
        let { img } = req.body;
        const userId = req.user._id.toString();

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User Not Found" });

        if (!text && !img) {
            return res.status(400).json({ error: "Post must have Text or Image" });
        }

        if (img) {
            try {
                const uploadedResponse = await cloudinary.uploader.upload(img);
                img = uploadedResponse.secure_url;
            } catch (uploadError) {
                console.log("Error uploading image to Cloudinary:", uploadError);
                return res.status(500).json({ error: "Error uploading image" });
            }
        }

        const newPost = new Post({
            user: userId,
            text,
            img,
        });

        await newPost.save();
        res.status(201).json(newPost);

    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
        console.log("Error in createPost controller:", error);
    }
}

export const getUserPost = async (req, res) => {
    try {
        const { username} = req.params;

        const user = await User.findOne({username});

        if(!user) return res.status(404).json({'User not found': error});

        const postfeed = await Post.find({user: user._id}).sort({createdAt: -1})
        .populate({
            path: 'user',
            select: '-password',
        }).populate({
            path: 'comments.user',
            select: '-password',    
        });

        res.status(200).json(post);

    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
        
    }
}

// Delete Post
export const deletePost = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: "You are not authorized to delete this post" });
        }

        if (post.img) {
            const imgId = post.img.split("/").pop().split(".")[0];
            try {
                await cloudinary.uploader.destroy(imgId);
            } catch (cloudError) {
                console.log("Error deleting image from Cloudinary:", cloudError.message);
            }
        }

        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Post deleted successfully" });

    } catch (error) {
        console.log("Error in deletePost controller:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Comment on Post
export const commentOnPost = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        const { text } = req.body;
        const postId = req.params.id;
        const userId = req.user._id;

        if (!text) {
            return res.status(400).json({ error: "Text field is required" });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        const comment = { user: userId, text };
        post.comments.push(comment);
        await post.save();

        res.status(200).json(post);

    } catch (error) {
        console.log("Error in commentOnPost controller:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const LikedUnLikedPost = async (req, res) => {
	
	try {
		
		const userId = req.user._id;

		const {id:postId} = req.params;

		const post = await Post.findById(postId);

		if(!post){
			return res.status(404).json({error: 'Post not found'});
		}

		const userLikedPost = post.likes.includes(userId);

		if(userLikedPost){

			//Unlike Post
			await Post.updateOne({_id:postId},{$pull:{likes: userId}});
            await User.updateOne({_id: userId},{$pull: {likedPost: postId}});
			res.status(200).json({message: 'Post unlike successfully'});

		}else {

			//Like Post

			post.likes.push(userId);
            await User.updateOne({_id: userId},{$push: {likedPost: postId}});
			await post.save();

			const notifaction = new Notification({
				from: userId,
				to: post.user,
				type: 'like',
			});

			await notifaction.save();

			res.status(200).json({message: 'Post liked Successfully'});

		}

	} catch (error) {
		console.log("Error in likedandunlikedpost", error);
		res.status(500).json({error: 'Internal server error'});
	}

}

export const getLikesPost = async (req, res) => {

    const userId = req.params.id;

    try {

        const user = await User.findById(userId);

        if(!user) return res.status(404).json({error: 'User not found'});

        const likedPosts = await Post.find({_id: {$in: user.likedPost}})
        .populate({
            path: 'user',
            select: '-password',
        })
        .populate({
            path: 'comments.user',
            select: '-password',
        });

        res.status(200).json(likedPosts);
        
    } catch (error) {
        console.log('error in like post' , error);
        res.status(500).json({error : 'Internal server error'});
    }
}

export const getAllPost = async (req, res) => {
    try {
        
        const posts = await Post.find().sort({createdAt: -1}).populate({path: "user", select: "-password"}).populate({path: "comments.user", select: "-password"});

        if(posts.length === 0) {
            return res.status(200).json([]);
        }

        res.status(200).json(posts);
    } catch (error) {
        console.log('get all post error: ',error);
        res.status(500).json({error: 'Internal server error'});
    }
}

export const getFollowingPosts = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId);

        if(!user) return res.status(404).json({error: 'User not found'});

        const following = user.following;

        const feedPost = await Post.find({user: {$in: following}}).sort({createdAt: -1})
        .populate({
            path: 'user',
            select: '-password',
        }).populate({
            path: 'comments.user',
            select: '-password',
        });

        res.status(200).json(feedPost);

    } catch (error) {

        console.log('Error in getfollowing post ' , error);

        res.status(500).json({error: 'Internal Server Error'});
        
    }
}
