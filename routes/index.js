const express = require('express');

const router = express.Router();

const generalController = require('../controller/general');
const blogController = require('../controller/blog');
const isAuth = require('../middleware/is-auth');

router.get('/', isAuth, generalController.getIndex);

//Blogs -> GET
router.get('/manage-blog',isAuth,blogController.getBlogs);
router.get('/blog-add', isAuth,blogController.getBlogAdd);
router.get('/blog-view/:id', isAuth,blogController.getBlog);
router.get('/blog-edit/:id', isAuth,blogController.getBlogEdit);


//Blogs -> post
router.post('/blog-add', isAuth,blogController.postBlogAdd);
router.post('/delete-blog', isAuth,blogController.deleteBlog);
router.post('/blog-edit', isAuth,blogController.postBlogEdit);



module.exports = router;