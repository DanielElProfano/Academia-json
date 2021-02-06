const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubjectSquema = new Schema({
    course: {
        type: mongoose.Types.ObjectId,
        ref: 'Course'
    },    
    name: {
        enum: ['React', 'Node', 'Vanilla JS', 'Angular'],
        type: String,
        required: true
    },
    students: [{
        type: mongoose.Types.ObjectId,
        ref: 'students',
    }],
    professors: [{
        type: mongoose.Types.ObjectId,
        ref: 'professors'
    }],
    test:[{
        type: mongoose.Types.ObjectId,
        ref: 'test'
    }]
},

{
    timestamps: true,
  }
)


const Subject = mongoose.model('subjects', SubjectSquema); 
module.exports = Subject;