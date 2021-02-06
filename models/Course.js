const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSquema = new Schema({
    name: {
        type: String,
        required: true
    },
    subjects: [{
       type: mongoose.Types.ObjectId,
        ref: 'subjects',
    }],
    students: [{
        type: mongoose.Types.ObjectId,
        ref: 'students',
    }],
    professors:[{
        type: mongoose.Types.ObjectId,
        ref: 'professors',
    }]
 },
    {timestamps : true}
 )

const Course = mongoose.model('courses', courseSquema); 
module.exports = Course;