const Blog = require('../models/blog');

const fileHelper = require('../utils/file');

exports.getBlogAdd = (req,res,next)=>{
    res.render('blogs-add', {
        pageTitle : 'Blog Add',
        errorMessage : null
    })
};


exports.getBlogs = (req,res,next)=>{
    Blog.find()
    .then(blogs=>{
        res.render('manage-blog', {
            blogs,
            pageTitle : 'Manage Blogs',
            allBlog : blogs.length,
            activeBlogsCount : blogs.filter(item=>item.status === 'active').length,
            inActiveBlogsCount : blogs.filter(item=>item.status === 'inactive').length
        })
    })
    .catch(err=>console.log(err));
}

exports.postBlogAdd = (req,res,next) =>{
    const title = req.body.title;
    const image = req.file;
    const content = req.body.content;
    const status = req.body.status ? 'active' : 'inactive';
    if(!image){
        return res.status(422).render('blogs-add', {
            pageTitle: 'Blog Add',
            errorMessage: 'Attached file is not an image.',
          });
    }
    const blog = new Blog({
        title,
        imageUrl : image.path,
        content,
        status
    });
    blog.save()
    .then(result=>{
        res.redirect('/manage-blog');
    })
    .catch(err=>console.log(err));
}

exports.getBlog = (req,res,next)=>{
    const id = req.params.id;
    Blog.findById(id)
    .then(blog=>{
        res.render('blog-view', {
            pageTitle : blog.title,
            blog,
        })
    })
    .catch(err=>console.log(err))
};

exports.getBlogEdit = (req,res,next) =>{
    const id = req.params.id;
    Blog.findById(id)
    .then(blog=>{
        res.render('blog-edit', {
            pageTitle : 'Edit : ' + blog.title,
            blog
        })
    })
    .catch(err=>console.log(err))
};


exports.postBlogEdit = (req,res,next)=>{
    const id = req.body.id;
    const updateTitle = req.body.title;
    const image = req.file;
    const updateStatus = req.body.status ? 'active' : 'inactive';
    const updateContent = req.body.content;

    Blog.findById(id)
    .then(blog=>{
        blog.title = updateTitle;
        if (image) {
            fileHelper.deleteFile(blog.imageUrl);
            blog.imageUrl = image.path;
          }
        blog.status = updateStatus;
        blog.content = updateContent;
        return blog.save();
    })
    .then(()=>{
        res.redirect('/manage-blog');
    }) 
    .catch(err=>console.log(err))


}

exports.deleteBlog = (req,res,next) => {
    const id = req.body.id;
    Blog.findById(id)
    .then(blog =>{
        if(!blog){
            return next(new Error('Blog not found.'));
        };
        fileHelper.deleteFile(blog.imageUrl);
    })
    Blog.findByIdAndDelete(id)
    .then(()=>{
        res.redirect('/manage-blog');
    })
    .catch(err=>console.log(err))
}