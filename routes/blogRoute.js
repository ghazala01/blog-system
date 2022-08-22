const express = require('express');
const router = express.Router();
const blog = require('../model/blogSchema');
  
router.post('/create_blog', async (req, res, next) => {
    console.log(req.body);
    const { title, content} = req.body;
    try{
        const blogPost = await blog.create({title, content, authorDetail: id});
        console.log(blogPost);
        res.json({ blogPost });
    }catch(error){
      console.log(error.message);
      next({ status: 500, message: error.message });
    }
});
  
router.get('/get_your_blogs', async (req, res, next) => {
    try{
        const id = req.user.id;
        const blogPosts = await blog.find({ authorDetail:id }).populate('authorDetail', '-email -password');
        res.json({ blogPosts });
    }catch (error){
        console.log(error.message);
        next({ status: 500, message: error.message });
    }
});

router.get('/get_all_blog', async (req, res, next) => {
    try{
        const blogPosts = await blog.find({}).populate('authorDetail', '-email -password');
        res.json({ blogPosts });
    }catch(error){
        console.log(error.message);
        next({ status: 500, message: error.message });
    }
});

module.exports = router;