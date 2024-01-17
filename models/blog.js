const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const blogSchema = new Schema({
    title : {
        type : String,
        required : true
    },
    content : {
        type : String,
        required : true
    },
    imageUrl : {
        type : String,
        required : true
    },
    status : {
        type : String,
        required : true
    },
});


module.exports = mongoose.model('blog', blogSchema);
